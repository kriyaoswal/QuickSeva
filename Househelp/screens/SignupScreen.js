// screens/SignupScreen.jsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';

export default function SignupScreen({ route, navigation }) {
  const { userType } = route.params; // Retrieve user type from route params
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // State to manage submission

  const handleSignup = async () => {
    if (isSubmitting) return; // Prevent further submissions
    setIsSubmitting(true); // Set submitting state to true

    // Validate that all required fields are filled
    if (!username || !password || !phoneNumber || (userType === 'user' && !address)) {
      console.error('All fields are required');
      setIsSubmitting(false); // Reset submitting state
      return;
    }

    // Construct the signup data based on user type
    const signupData = { username, password, phone: phoneNumber, userType };
    if (userType === 'user') {
      signupData.address = address; // Include address only if userType is 'user'
    }

    console.log('Signup Data:', signupData); // Log the signup data for debugging

    try {
      // Replace with your API URL
      await axios.post('http://192.168.0.100:5000/auth/signup', signupData);
      navigation.navigate('Login'); // Navigate after successful signup
    } catch (error) {
      // Handle errors during signup
      if (error.response) {
        console.error('Error response:', error.response.data); // Log error response data
      } else {
        console.error('Error:', error.message); // Log general error message
      }
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  return (
    <View style={styles.container}>
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
        <Text style={styles.signupButtonText}>Sign Up</Text>
      </TouchableOpacity>

      {/* "Already have an account? Login" link */}
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}> Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // Light lavender for the background
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
    marginTop:5,
  },
});
