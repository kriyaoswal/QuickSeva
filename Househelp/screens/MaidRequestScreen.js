//MaidRequestScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, StyleSheet, FlatList } from 'react-native';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://192.168.0.100:5000'); // Replace with your server URL

const MaidRequestScreen = ({ route }) => {
  const { storedMaidUsername } = route.params; // Maid's username passed via navigation
  const [pendingRequests, setPendingRequests] = useState([]);

  useEffect(() => {
    // Register the maid with their username
    socket.emit('registerMaid', storedMaidUsername);

    // Fetch pending requests when the component mounts
    const fetchPendingRequests = async () => {
      try {
        const response = await axios.get('http://192.168.0.100:5000/requests/pending'); // Adjust this endpoint if necessary
        setPendingRequests(response.data);
      } catch (error) {
        console.error('Error fetching pending requests:', error);
        Alert.alert('Error', 'Failed to fetch pending requests');
      }
    };

    fetchPendingRequests();

    // Listen for maid requests
    socket.on('maidRequest', (request) => {
      setPendingRequests((prevRequests) => [request, ...prevRequests]); // Add new requests to the top of the list
      Alert.alert(`New request from user: ${request.username}`);
    });

    return () => {
      socket.off('maidRequest');
    };
  }, [storedMaidUsername]);

  const handleAccept = async (requestId) => {
    const requestToAccept = pendingRequests.find(req => req._id === requestId);
    if (!requestToAccept) {
      Alert.alert('Error', 'Request not found');
      return;
    }
  
    try {
      await axios.put(`http://192.168.0.100:5000/requests/status/${requestId}`, { status: 'accepted' });
      setPendingRequests((prevRequests) => prevRequests.filter((req) => req._id !== requestId)); // Remove accepted request from list
      Alert.alert('You have accepted the request!');
      socket.emit('acceptRequest', { maidUsername: storedMaidUsername, requestData: requestToAccept }); // Pass the correct data
    } catch (error) {
      console.error('Error accepting request:', error);
      Alert.alert('Error', 'Failed to accept request');
    }
  };
  

  const handleDeny = async (requestId) => {
    try {
      await axios.put(`http://192.168.0.100:5000/requests/status/${requestId}`, { status: 'denied' });
      setPendingRequests((prevRequests) => prevRequests.filter((req) => req._id !== requestId)); // Remove denied request from list
      Alert.alert('You have denied the request!');
    } catch (error) {
      console.error('Error denying request:', error);
      Alert.alert('Error', 'Failed to deny request');
    }
  };

  const renderRequestItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.requestText}>User: {item.username}</Text>
      <Text style={styles.requestText}>Phone: {item.phone}</Text>
      <Text style={styles.requestText}>Address: {item.address}</Text>
      <Text style={styles.requestText}>Date: {item.date}</Text>
      <Text style={styles.requestText}>Time: {item.time}</Text>
      <Text style={styles.requestText}>Details: {item.details}</Text>
      <View style={styles.buttonContainer}>
        <Button title="Accept" onPress={() => handleAccept(item._id)} />
        <Button title="Deny" onPress={() => handleDeny(item._id)} color="red" />
      </View>
    </View>
  );

  return (
    <View style={{ padding: 20 }}>
      {pendingRequests.length > 0 ? (
        <FlatList
          data={pendingRequests}
          renderItem={renderRequestItem}
          keyExtractor={(item) => item._id}
        />
      ) : (
        <Text style={styles.blackText}>No new requests...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  blackText: {
    color: 'black',
  },
  card: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 10,
    marginBottom: 10,
  },
  requestText: {
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default MaidRequestScreen;
