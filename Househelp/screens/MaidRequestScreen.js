import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, FlatList } from 'react-native';
import axios from 'axios';
import io from 'socket.io-client';

const MaidScreen = () => {
  const [requests, setRequests] = useState([]);
  const [maidId, setMaidId] = useState(''); // This should be set when the maid logs in

  useEffect(() => {
    // Fetch the maid's ID from your auth context or storage
    const fetchMaidId = async () => {
      // Replace this with your method of fetching the maid's ID
      const storedMaidId = await AsyncStorage.getItem('maidId'); // Example using AsyncStorage
      setMaidId(storedMaidId);
    };

    fetchMaidId();

    const socket = io('http://192.168.56.1:5000'); // Replace with your server URL

    socket.on('newRequest', (requestData) => {
      // Update state to show this request to the maid
      setRequests((prevRequests) => [...prevRequests, requestData]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleAcceptRequest = async (request) => {
    try {
      await axios.post('http://192.168.56.1:5000/accept-request', {
        requestId: request._id,
        maidId,
      });
      Alert.alert('Success', 'Request accepted!');
    } catch (error) {
      console.error('Error accepting request:', error);
      Alert.alert('Error', 'Failed to accept request');
    }
  };

  const handleRejectRequest = async (request) => {
    try {
      await axios.post('http://192.168.56.1:5000/reject-request', {
        requestId: request._id,
        maidId,
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
              <Text>Username: {item.username}</Text>
              <Text>Phone: {item.phone}</Text>
              <Text>Address: {item.address}</Text>
              <Text>Date: {item.date}</Text>
              <Text>Time: {item.time}</Text>
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
