import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MaidHomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3e5f5', // Light lavender background
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4a148c', // Deep purple text color
  },
});
