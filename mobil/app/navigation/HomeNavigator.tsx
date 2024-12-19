import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../views/screens/user/HomeScreen';
import AddTestScreen from '../views/screens/user/AddTestScreen';
import TestsScreen from '../views/screens/user/TestsScreen';

export type HomeStackParamList = {
  Home: undefined;
  YeniTahlilEkle: undefined;
  TestsNavigator: undefined;
};

const Stack = createStackNavigator<HomeStackParamList>();

export default function HomeNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="YeniTahlilEkle" component={AddTestScreen} options={{ title: 'Yeni Tahlil Ekle' }} />
      <Stack.Screen name="TestsNavigator" component={TestsScreen} options={{ title: 'Tahlillerim' }} />
    </Stack.Navigator>
  );
}
