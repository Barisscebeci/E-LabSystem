import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AdminHomeScreen from '../screens/AdminHomeScreen';
import KilavuzEkleScreen from '../screens/KilavuzEkleScreen';
import HastaTahlilAramaScreen from '../screens/HastaTahlilAramaScreen';

const Tab = createBottomTabNavigator();

export default function AdminNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="AdminHome" component={AdminHomeScreen} options={{ title: 'Ana Sayfa' }} />
      <Tab.Screen name="KilavuzEkle" component={KilavuzEkleScreen} options={{ title: 'Kılavuz Ekle' }} />
      <Tab.Screen name="HastaTahlilArama" component={HastaTahlilAramaScreen} options={{ title: 'Tahlil Arama' }} />
    </Tab.Navigator>
  );
}
