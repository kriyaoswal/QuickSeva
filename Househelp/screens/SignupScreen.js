import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet } from 'react-native';
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
      await axios.post('http://192.168.56.1:5000/auth/signup', signupData);
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
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      
      {/* Address field only for "User" type */}
      {userType === 'user' && (
        <TextInput
          style={styles.input}
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
        />
      )}

      <Button title="Sign Up" onPress={handleSignup} disabled={isSubmitting} />

      {/* "Already have an account? Login" link */}
      <View style={styles.loginContainer}>
        <Text>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}> Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: 'blue',
    marginLeft: 5,
  },
});
