// screens/LoginScreen.jsx
import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import axios from 'axios';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      // Replace with your backend login URL
      const response = await axios.post('http://192.168.56.1:5000/auth/login', { username, password });
      console.log('Login successful:', response.data);
      
      // You can store the token in local storage or state for authentication purposes
      // localStorage.setItem('token', response.data.token);

      // Navigate to the desired screen after login
      navigation.navigate('Home'); // Or replace 'Home' with your main app screen
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />
      <Text onPress={() => navigation.navigate('Signup', { userType: 'user' })}>
        Don't have an account? Sign up
      </Text>
    </View>
  );
}
