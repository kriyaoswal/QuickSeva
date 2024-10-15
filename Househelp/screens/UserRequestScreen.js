import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://192.168.0.100:5000'); // Replace with your server URL

const UserRequestScreen = ({ route }) => {
  const { username } = route.params;
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [details, setDetails] = useState('');
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log(`Fetching user data for username: ${username}`);
        const response = await axios.get(`http://192.168.0.100:5000/users/${username}`);
        const data = response.data;
        setUserInfo(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Failed to fetch user data');
      }
    };

    fetchUserData();

    // Listen for accepted requests
    socket.on('maidAccepted', (response) => {
      Alert.alert(`Your request has been accepted by maid with ID: ${response.maidId}`);
    });

    socket.on('noMaidFound', () => {
      Alert.alert('No maids found to accept your request.');
    });

    return () => {
      socket.off('maidAccepted');
      socket.off('noMaidFound');
    };
  }, [username]);

  const handleRequest = () => {
    if (!date || !time || !details) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const request = {
      date,
      time,
      details,
      userId: userInfo._id,
      username: userInfo.username,
      phone: userInfo.phone,
      address: userInfo.address,
    };

    // Emit the request to the server
    socket.emit('maidRequest', request);
    Alert.alert('Success', 'Request sent successfully!');
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
});

export default UserRequestScreen;
