import React, { useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import UserNavigator from './UserNavigator';
import AdminNavigator from './AdminNavigator';

export default function Navigation() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!user) {
    // Kullanıcı yoksa AuthNavigator'a yönlendir
    return <AuthNavigator />;
  }

  // Kullanıcı varsa rolüne göre yönlendir
  if (user.rol === 'admin') {
    return <AdminNavigator />;
  } else {
    return <UserNavigator />;
  }
}