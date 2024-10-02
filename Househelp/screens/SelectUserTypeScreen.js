// screens/SelectUserTypeScreen.jsx
import React, { useEffect } from 'react';
import { View, Button, Text } from 'react-native';

export default function SelectUserTypeScreen({ navigation }) {
  useEffect(() => {
    console.log("SelectUserTypeScreen component has mounted");
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Select Account Type</Text>
      <Button title="User" onPress={() => navigation.navigate('Signup', { userType: 'user' })} />
      <Button title="Maid" onPress={() => navigation.navigate('Signup', { userType: 'maid' })} />
    </View>
  );
}
