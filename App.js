import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Weather from './screens/Weather'
import HomeScreen from './screens/HomeScreen'
import LocationWeather from './screens/LocationWeather';

import { StyleSheet } from 'react-native';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="HomeScreen"
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
        />
        <Stack.Screen
          name="Weather"
          component={Weather}
        />
        <Stack.Screen
          name="LocationWeather"
          component={LocationWeather}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;