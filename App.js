import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './src/screens/HomeScreen';
import DrivingScreen from './src/screens/DrivingScreen';
import LessonsScreen from './src/screens/LessonsScreen';
import ReportsScreen from './src/screens/ReportsScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2E7D32',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'SafeDrive Romania' }}
        />
        <Stack.Screen 
          name="Driving" 
          component={DrivingScreen} 
          options={{ title: 'Active Driving' }}
        />
        <Stack.Screen 
          name="Lessons" 
          component={LessonsScreen} 
          options={{ title: 'Safety Lessons' }}
        />
        <Stack.Screen 
          name="Reports" 
          component={ReportsScreen} 
          options={{ title: 'Your Progress' }}
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen} 
          options={{ title: 'Settings' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}