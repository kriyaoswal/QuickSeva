// screens/SelectUserTypeScreen.jsx
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function SelectUserTypeScreen({ navigation }) {
  useEffect(() => {
    console.log("SelectUserTypeScreen component has mounted");
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Account Type</Text>
      
      <TouchableOpacity 
        style={styles.optionButton} 
        onPress={() => navigation.navigate('Signup', { userType: 'user' })}
      >
        <Text style={styles.optionText}>User</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.optionButton} 
        onPress={() => navigation.navigate('Signup', { userType: 'maid' })}
      >
        <Text style={styles.optionText}>Maid</Text>
      </TouchableOpacity>
    </View>
  );
}

// Purple Theme
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // Light lavender background for a soft touch
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4a148c', // Deep purple for the title text to stand out
    marginBottom: 30,
  },
  optionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7b1fa2', // Medium purple for buttons
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
  },
  optionText: {
    fontSize: 18,
    color: '#f3e5f5', // Light lavender text color on dark purple buttons for good contrast
  },
});
