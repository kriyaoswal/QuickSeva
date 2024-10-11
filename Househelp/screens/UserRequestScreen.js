import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://192.168.56.1:5000'); // Replace with your server URL

const UserRequestScreen = () => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [details, setDetails] = useState('');
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://192.168.56.1:5000/users/${_Id}`);  // Make sure userId is correct
                const data = response.data;
                
                if (!data) {
                    throw new Error('User data is null or undefined');
                }
                setUserInfo(data);  // Set user data to state
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

        // Listen for no maid found
        socket.on('noMaidFound', () => {
            Alert.alert('No maids found to accept your request.');
        });

        return () => {
            socket.off('maidAccepted');
            socket.off('noMaidFound');
        };
    }, []);

    const handleRequest = () => {
        if (!date || !time || !details) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        const request = {
            date,
            time,
            details,
            userId: userInfo._Id, // Use fetched user ID
            username: userInfo.username, // User's username
            phone: userInfo.phone, // User's phone
            address: userInfo.address // User's address
        };

        // Emit the request to the server
        socket.emit('maidRequest', request);
        Alert.alert('Success', 'Request sent successfully!');
    };

    return (
        <View style={{ padding: 20 }}>
            {userInfo ? (
                <>
                    <Text>User Info:</Text>
                    <Text>Username: {userInfo.username}</Text>
                    <Text>Phone: {userInfo.phone}</Text>
                    <Text>Address: {userInfo.address}</Text>

                    <TextInput
                        placeholder="Date (YYYY-MM-DD)"
                        value={date}
                        onChangeText={setDate}
                        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
                    />
                    <TextInput
                        placeholder="Time (HH:MM)"
                        value={time}
                        onChangeText={setTime}
                        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
                    />
                    <TextInput
                        placeholder="Details"
                        value={details}
                        onChangeText={setDetails}
                        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
                    />
                    <Button title="Send Request" onPress={handleRequest} />
                </>
            ) : (
                <Text>Loading user info...</Text>
            )}
        </View>
    );
};

export default UserRequestScreen;
