import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, FlatList } from 'react-native';
import axios from 'axios';
import io from 'socket.io-client';

const MaidScreen = () => {
  const [requests, setRequests] = useState([]);
  const [maidUsername, setMaidUsername] = useState(''); // Store the maid's username

  useEffect(() => {
    // Fetch the maid's username (you might get this from storage or auth context)
    const fetchMaidUsername = async () => {
      // Assuming you stored the maid's username after login
      const storedMaidUsername = await AsyncStorage.getItem('maidUsername');
      setMaidUsername(storedMaidUsername);
    };

    fetchMaidUsername();

    const socket = io('http://192.168.0.101:5000'); // Replace with your server URL

    // Register the maid's username when they connect
    socket.emit('registerMaid', storedMaidUsername);

    // Listen for new requests
    socket.on('newRequest', (requestData) => {
      console.log('New request received:', requestData);
      setRequests((prevRequests) => [...prevRequests, requestData]);
    });

    return () => {
      socket.disconnect(); // Clean up when the component unmounts
    };
  }, []);

  const handleAcceptRequest = async (request) => {
    try {
      await axios.post('http://192.168.0.101:5000/accept-request', {
        requestId: request._id,
        maidUsername,
      });
      Alert.alert('Success', 'Request accepted!');
    } catch (error) {
      console.error('Error accepting request:', error);
      Alert.alert('Error', 'Failed to accept request');
    }
  };

  const handleRejectRequest = async (request) => {
    try {
      await axios.post('http://192.168.0.101:5000/reject-request', {
        requestId: request._id,
        maidUsername,
      });
      Alert.alert('Success', 'Request rejected!');
    } catch (error) {
      console.error('Error rejecting request:', error);
      Alert.alert('Error', 'Failed to reject request');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Incoming Requests</Text>
      {requests.length === 0 ? (
        <Text>No incoming requests.</Text>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 20, padding: 10, borderWidth: 1 }}>
              <Text>User Info:</Text>
              <Text>Username: {item.userId.username}</Text>
              <Text>Phone: {item.userId.phone}</Text>
              <Text>Request Time: {new Date(item.requestTime).toLocaleString()}</Text>
              <Button title="Accept" onPress={() => handleAcceptRequest(item)} />
              <Button title="Reject" onPress={() => handleRejectRequest(item)} />
            </View>
          )}
        />
      )}
    </View>
  );
};

export default MaidScreen;
