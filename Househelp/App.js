import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import SplashScreen from './screens/SplashScreen';
import SelectUserTypeScreen from './screens/SelectUserTypeScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import BookingsScreen from './screens/PreviousBookings';
import MaidHomeScreen from './screens/MaidHomeScreen';
import MaidProfileScreen from './screens/MaidProfileScreen';
import MaidTasksScreen from './screens/MaidTasksScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function UserTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home-outline';
          } else if (route.name === 'Profile') {
            iconName = 'person-outline';
          } else if (route.name === 'Bookings') {
            iconName = 'book-outline';
          }
          return <Icon name={iconName} size={24} color={color} />;
        },
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Bookings" component={BookingsScreen} />
    </Tab.Navigator>
  );
}

function MaidTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'MaidHome') {
            iconName = 'home-outline';
          } else if (route.name === 'MaidProfile') {
            iconName = 'person-outline';
          } else if (route.name === 'Tasks') {
            iconName = 'list-outline';
          }
          return <Icon name={iconName} size={24} color={color} />;
        },
        tabBarActiveTintColor: 'green',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="MaidHome" component={MaidHomeScreen} />
      <Tab.Screen name="MaidProfile" component={MaidProfileScreen} />
      <Tab.Screen name="Tasks" component={MaidTasksScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [userType, setUserType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserType = async () => {
      const loggedInUserType = await getUserType();
      setUserType(loggedInUserType);
      setIsLoading(false);
    };

    fetchUserType();
  }, []);

  const getUserType = async () => {
    // Mock userType fetch logic
    return 'User'; // Change to 'Maid' for testing maid flow
  };

  if (isLoading) {
    return <SplashScreen />; // Show SplashScreen while loading
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SelectUserType">
        <Stack.Screen name="SelectUserType" component={SelectUserTypeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />

        {/* Show correct tab navigator based on userType */}
        <Stack.Screen name="UserTabs" component={UserTabs} options={{ headerShown: false }} />
        <Stack.Screen name="MaidTabs" component={MaidTabs} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
