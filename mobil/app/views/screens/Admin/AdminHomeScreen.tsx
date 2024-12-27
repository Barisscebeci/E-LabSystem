// src/views/screens/admin/AdminHomeScreen.tsx

import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { AuthContext } from '../../../context/AuthContext';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminMenuCard from '../../components/admin/AdminMenuCard';
import AnimatedBottomBar from '../../components/admin/AnimatedBottomBar';

type AdminNavigatorParamList = {
  KilavuzOlustur: undefined;
  HastaTahlilArama: undefined;
  TahlilEkleScreen: undefined;
};

export default function AdminHomeScreen() {
  const navigation = useNavigation<NavigationProp<AdminNavigatorParamList>>();
  const { signOut } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent}>
      <AdminHeader title="Yönetici Paneli" />
        
        <AdminMenuCard
          title="Kılavuz Ekle"
          subtitle="Yeni referans değerleri ekle"
          iconName="add-circle-outline"
          onPress={() => navigation.navigate('KilavuzOlustur')}
          color="#3F51B5"
        />

        <AdminMenuCard
          title="Tahlil Ekle"
          subtitle="Hasta için yeni tahlil kaydı oluştur"
          iconName="medkit-outline"
          onPress={() => navigation.navigate('TahlilEkleScreen')}
          color="#00897B"
        />

        <AdminMenuCard
          title="Hasta Tahlilleri"
          subtitle="Hasta tahlillerini görüntüle ve yönet"
          iconName="document-text-outline"
          onPress={() => navigation.navigate('HastaTahlilArama')}
          color="#5C6BC0"
        />

        <AdminMenuCard
          title="Çıkış Yap"
          subtitle="Oturumu sonlandır"
          iconName="exit-outline"
          onPress={signOut}
          isDestructive
        />
        
      </ScrollView>
      
      <AnimatedBottomBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f7",
  },
  scrollContent: {
    padding: 16,
    marginTop: 16,
    marginBottom: 16,
  },
});
