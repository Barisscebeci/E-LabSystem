import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';

type AdminNavigatorParamList = {
  AdminHome: undefined;
  KilavuzList: undefined;
  HastaTahlilArama: undefined;
};

const BottomBar = () => {
  const navigation = useNavigation<NavigationProp<AdminNavigatorParamList>>();

  return (
    <View style={styles.bottomBar}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('AdminHome')}
      >
        <Ionicons name="home-outline" size={28} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('KilavuzList')}
      >
        <Ionicons name="book-outline" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Yeni Hasta Tahlil Arama Butonu */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('HastaTahlilArama')}
      >
        <Ionicons name="search-outline" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#3F51B5',
    paddingVertical: 15,
    paddingHorizontal: 8,
    marginHorizontal: 8,
    marginBottom: 8,
    borderRadius: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  button: {
    alignItems: 'center',
    padding: 8,
  },
});

export default BottomBar;