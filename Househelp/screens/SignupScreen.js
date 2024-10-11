// screens/SignupScreen.jsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import axios from 'axios';

export default function SignupScreen({ route, navigation }) {
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const {userType = 'user' } = route.params || {}; // Added fallback in case userType is not passed
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // State to manage submission

  const handleSignup = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
  
    if (!username || !password || !phoneNumber || (userType === 'user' && !address)) {
      Alert.alert('Error', 'All fields are required');
      setIsSubmitting(false);
      return;
    }
  
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      setIsSubmitting(false);
      return;
    }
  
    if (!/^\d{10}$/.test(phoneNumber)) {
      Alert.alert('Error', 'Phone number must be 10 digits');
      setIsSubmitting(false);
      return;
    }
  
    const signupData = { username, password, phone: phoneNumber, userType };
    if (userType === 'user') {
      signupData.address = address;
    }
  
    try {
      await axios.post('http://192.168.20.117:5000/auth/signup', signupData);
      
      // Navigate based on userType
      if (userType === 'user') {
        navigation.navigate('UserTabs');
      } else if (userType === 'maid') {
        navigation.navigate('MaidTabs');
      }
    } catch (error) {
      if (error.response) {
        Alert.alert('Signup Failed', error.response.data.message || 'An error occurred during signup.');
      } else {
        Alert.alert('Signup Failed', 'An unexpected error occurred.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Adjust for keyboard on iOS
    >
      <Text style={styles.headerText}>Sign Up as {userType.charAt(0).toUpperCase() + userType.slice(1)}</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#9c27b0" // Light purple placeholder text color
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#9c27b0" // Light purple placeholder text color
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        placeholderTextColor="#9c27b0" // Light purple placeholder text color
        value={phoneNumber}
        keyboardType="numeric" // Restrict to numeric input
        onChangeText={setPhoneNumber}
      />
      
      {/* Address field only for "User" type */}
      {userType === 'user' && (
        <TextInput
          style={styles.input}
          placeholder="Address"
          placeholderTextColor="#9c27b0" // Light purple placeholder text color
          value={address}
          onChangeText={setAddress}
        />
      )}

      <TouchableOpacity style={styles.signupButton} onPress={handleSignup} disabled={isSubmitting}>
        <Text style={styles.signupButtonText}>{isSubmitting ? 'Signing Up...' : 'Sign Up'}</Text>
      </TouchableOpacity>

      {/* "Already have an account? Login" link */}
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}> Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3e5f5', // Light lavender for the background
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#4a148c', // Deep purple for the title text
    textAlign: 'center',
  },
  input: {
    width: '80%',
    height: 50,
    borderColor: '#7b1fa2', // Medium purple border for inputs
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: '#ffffff', // White background for input fields
    color: '#4a148c', // Text color inside the input
  },
  signupButton: {
    backgroundColor: '#7b1fa2', // Medium purple for signup button
    width: '80%',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  signupButtonText: {
    color: '#ffffff', // White text for the button
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  loginText: {
    color: '#4a148c', // Deep purple text
    fontSize: 16,
  },
  loginLink: {
    color: '#7b1fa2', // Medium purple link text
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
});
