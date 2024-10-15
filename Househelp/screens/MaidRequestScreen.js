import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import io from 'socket.io-client';

const socket = io('http://192.168.0.100:5000'); // Replace with your server URL

const MaidRequestScreen = ({ route }) => {
  const { storedMaidUsername } = route.params;
  const [incomingRequest, setIncomingRequest] = useState(null);

  useEffect(() => {
    // Register maid with their socket ID when they open the screen
    socket.emit('registerMaid', storedMaidUsername);

    // Listen for maid requests
    socket.on('maidRequest', (request) => {
      setIncomingRequest(request);
      Alert.alert(`New request from user: ${request.username}`);
    });

    return () => {
      socket.off('maidRequest');
    };
  }, [storedMaidUsername]);

  const handleAccept = () => {
    if (incomingRequest) {
      socket.emit('acceptRequest', { maidId: storedMaidUsername, requestData: incomingRequest });
      Alert.alert('You have accepted the request!');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      {incomingRequest ? (
        <>
          <Text style={styles.blackText}>New Request:</Text>
          <Text style={styles.blackText}>User: {incomingRequest.username}</Text>
          <Text style={styles.blackText}>Phone: {incomingRequest.phone}</Text>
          <Text style={styles.blackText}>Address: {incomingRequest.address}</Text>
          <Text style={styles.blackText}>Date: {incomingRequest.date}</Text>
          <Text style={styles.blackText}>Time: {incomingRequest.time}</Text>
          <Text style={styles.blackText}>Details: {incomingRequest.details}</Text>

          <Button title="Accept Request" onPress={handleAccept} />
        </>
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
});

export default MaidRequestScreen;
