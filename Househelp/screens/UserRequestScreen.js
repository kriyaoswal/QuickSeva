import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView 
} from 'react-native';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://192.168.56.1:5000'); // Replace with your server URL

const UserRequestScreen = ({ route }) => {
  const { username } = route.params;
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [details, setDetails] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [acceptedMaidInfo, setAcceptedMaidInfo] = useState(null);
  const [showAcceptedRequest, setShowAcceptedRequest] = useState(false); // Track visibility
  const isSending = useRef(false); // Ref to track sending status

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://192.168.56.1:5000/users/${username}`);
        setUserInfo(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Failed to fetch user data');
      }
    };

    fetchUserData();

    socket.on('maidAccepted', async (response) => {
      try {
        const maidResponse = await axios.get(
          `http://192.168.56.1:5000/acceptedrequests/${response.requestId}`
        );
        setAcceptedMaidInfo(maidResponse.data);
        setShowAcceptedRequest(true); // Automatically show accepted info
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

    // Prevent multiple submissions
    if (isSending.current) return;

    isSending.current = true; // Set sending status to true

    const request = {
      date,
      time,
      details,
      userId: userInfo._id,
      username: userInfo.username,
      phone: userInfo.phone,
      address: userInfo.address,
    };

    try {
      console.log('Sending request:', request); // Log the request
      await axios.post('http://192.168.56.1:5000/requests', request);
      socket.emit('maidRequest', request);
      Alert.alert('Success', 'Request sent successfully!');
    } catch (error) {
      console.error('Error sending request:', error);
      Alert.alert('Error', 'Failed to send request');
    } finally {
      isSending.current = false; // Reset sending status
    }
  };

  const fetchAcceptedRequestInfo = async () => {
    if (showAcceptedRequest) {
      // Hide the request info if it's already visible
      setAcceptedMaidInfo(null);
      setShowAcceptedRequest(false);
    } else {
      // Fetch the accepted request info
      try {
        const response = await axios.get(
          `http://192.168.56.1:5000/acceptedrequests/${userInfo.username}`
        );
        if (response.data.length > 0) {
          setAcceptedMaidInfo(response.data[0]);
        } else {
          Alert.alert('No accepted requests found');
        }
        setShowAcceptedRequest(true);
      } catch (error) {
        console.error('Error fetching accepted request info:', error);
        Alert.alert('Error', 'Failed to fetch accepted request info');
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {userInfo ? (
        <>
          <Text style={styles.headerText}>User Info</Text>
          <Text style={styles.infoText}>Username: {userInfo.username}</Text>
          <Text style={styles.infoText}>Phone: {userInfo.phone}</Text>
          <Text style={styles.infoText}>Address: {userInfo.address}</Text>

          <TextInput
            placeholder="Date (YYYY-MM-DD)"
            value={date}
            onChangeText={setDate}
            style={styles.input}
            placeholderTextColor="#9c27b0"
          />
          <TextInput
            placeholder="Time (HH:MM)"
            value={time}
            onChangeText={setTime}
            style={styles.input}
            placeholderTextColor="#9c27b0"
          />
          <TextInput
            placeholder="Details"
            value={details}
            onChangeText={setDetails}
            style={styles.input}
            placeholderTextColor="#9c27b0"
          />

          <TouchableOpacity style={styles.button} onPress={handleRequest}>
            <Text style={styles.buttonText}>Send Request</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={fetchAcceptedRequestInfo}>
            <Text style={styles.buttonText}>
              {showAcceptedRequest ? 'Hide Accepted Request Info' : 'Fetch Accepted Request Info'}
            </Text>
          </TouchableOpacity>

          {showAcceptedRequest && acceptedMaidInfo && (
            <View style={styles.maidInfoContainer}>
              <Text style={styles.infoText}>Maid Accepted Your Request:</Text>
              <Text style={styles.infoText}>Username: {acceptedMaidInfo.username1}</Text>
              <Text style={styles.infoText}>Phone: {acceptedMaidInfo.maidPhone}</Text>
              <Text style={styles.infoText}>Date: {acceptedMaidInfo.date}</Text>
              <Text style={styles.infoText}>Time: {acceptedMaidInfo.time}</Text>
              <Text style={styles.infoText}>Details: {acceptedMaidInfo.details}</Text>
            </View>
          )}
        </>
      ) : (
        <Text style={styles.infoText}>Loading user info...</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 30,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4a148c',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    color: '#4a148c',
    marginBottom: 10,
  },
  input: {
    width: '80%',
    height: 50,
    borderColor: '#7b1fa2',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: '#ffffff',
    color: '#4a148c',
  },
  button: {
    backgroundColor: '#7b1fa2',
    width: '80%',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  maidInfoContainer: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#7b1fa2',
    borderRadius: 8,
    backgroundColor: '#f3e5f5',
    width: '90%',
  },
});

export default UserRequestScreen;
