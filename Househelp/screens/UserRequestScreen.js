import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://192.168.0.100:5000'); // Replace with your server URL

const UserRequestScreen = ({ route }) => {
  const { username } = route.params; // Get the username passed via navigation
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [details, setDetails] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [acceptedMaidInfo, setAcceptedMaidInfo] = useState(null); // State for accepted maid info

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://192.168.0.100:5000/users/${username}`);
        setUserInfo(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Failed to fetch user data');
      }
    };

    fetchUserData();

    // Listen for accepted requests
    socket.on('maidAccepted', async (response) => {
      // Fetch the accepted maid's info from the new collection
      try {
        const maidResponse = await axios.get(`http://192.168.0.100:5000/accepted-requests/${response.maidId}`);
        setAcceptedMaidInfo(maidResponse.data); // Store the accepted maid's info
        Alert.alert(`Your request has been accepted by maid: ${response.maidUsername}`);
      } catch (error) {
        console.error('Error fetching accepted maid info:', error);
      }
    });

    return () => {
      socket.off('maidAccepted');
    };
  }, [username]);

  const handleRequest = async () => {
    if (!date || !time || !details) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const request = {
      date,
      time,
      details,
      userId: userInfo._id, // Use fetched user ID
      username: userInfo.username, // User's username
      phone: userInfo.phone, // User's phone
      address: userInfo.address, // User's address
    };

    try {
      // Emit the request to the server and save to the database
      await axios.post('http://192.168.0.100:5000/requests', request); // Updated route here
      socket.emit('maidRequest', request); // Send request to all maids
      Alert.alert('Success', 'Request sent successfully!');
    } catch (error) {
      console.error('Error sending request:', error);
      Alert.alert('Error', 'Failed to send request');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      {userInfo ? (
        <>
          <Text style={styles.blackText}>User Info:</Text>
          <Text style={styles.blackText}>Username: {userInfo.username}</Text>
          <Text style={styles.blackText}>Phone: {userInfo.phone}</Text>
          <Text style={styles.blackText}>Address: {userInfo.address}</Text>

          <TextInput
            placeholder="Date (YYYY-MM-DD)"
            value={date}
            onChangeText={setDate}
            style={styles.input}
          />
          <TextInput
            placeholder="Time (HH:MM)"
            value={time}
            onChangeText={setTime}
            style={styles.input}
          />
          <TextInput
            placeholder="Details"
            value={details}
            onChangeText={setDetails}
            style={styles.input}
          />
          <Button title="Send Request" onPress={handleRequest} />

          {/* Section to show accepted maid info */}
          {acceptedMaidInfo && (
            <View style={styles.maidInfoContainer}>
              <Text style={styles.blackText}>Maid Accepted Your Request:</Text>
              <Text style={styles.blackText}>Username: {acceptedMaidInfo.maidUsername}</Text>
              <Text style={styles.blackText}>Phone: {acceptedMaidInfo.maidPhone}</Text>
              <Text style={styles.blackText}>Address: {acceptedMaidInfo.address}</Text>
              <Text style={styles.blackText}>Date: {acceptedMaidInfo.date}</Text>
              <Text style={styles.blackText}>Time: {acceptedMaidInfo.time}</Text>
              <Text style={styles.blackText}>Details: {acceptedMaidInfo.details}</Text>
            </View>
          )}
        </>
      ) : (
        <Text style={styles.blackText}>Loading user info...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  blackText: {
    color: 'black',
  },
  input: {
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  maidInfoContainer: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#000',
  },
});

export default UserRequestScreen;
