import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../views/screens/Auth/LoginScreen';
import RegisterScreen from '../views/screens/Auth/RegisterScreen';

type AuthStackParamList = {
  'Giriş Yap': undefined;
  'Kayıt Ol': undefined;
};

const AuthStack = createStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <AuthStack.Navigator
      initialRouteName="Giriş Yap"
      screenOptions={{
        headerShown: false, // Header'ı tüm ekranlardan kaldırıyoruz
      }}
    >
      <AuthStack.Screen name="Giriş Yap" component={LoginScreen} />
      <AuthStack.Screen name="Kayıt Ol" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}