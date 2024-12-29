// SettingsScreen.tsx
import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../../navigation/types"; // Yolunuzu uygun şekilde ayarlayın
import { AuthContext } from "../../../context/AuthContext";
import SettingItem from "../../components/SettingItem";
import ToggleSwitch from "../../components/ToggleSwitch";
import { Ionicons } from "@expo/vector-icons"; // Ionicons importu eklendi

export default function SettingsScreen() {
  const { user, signOut } = useContext(AuthContext);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleToggleDarkMode = (value: boolean) => {
    setIsDarkMode(value);
    // Dark mode logic burada
  };

  const handleToggleNotification = (value: boolean) => {
    setIsNotificationEnabled(value);
    // Bildirim logic burada
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Hesap Bölümü */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Hesap</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon={<Ionicons name="person-outline" size={24} color="#000" />} // İkon rengi siyah yapıldı
              label="Profili Düzenle"
              onPress={() => navigation.navigate("EditProfile")}
            />
            <SettingItem
              icon={
                <Ionicons name="lock-closed-outline" size={24} color="#000" />
              } // İkon rengi siyah yapıldı
              label="Şifre Değiştir"
              onPress={() => {}}
            />
            <SettingItem
              icon={
                <Ionicons name="notifications-outline" size={24} color="#000" />
              } // İkon rengi siyah yapıldı
              label="Bildirimler"
              onPress={() => {}}
              rightComponent={
                <ToggleSwitch
                  isOn={isNotificationEnabled}
                  onToggle={handleToggleNotification}
                />
              }
            />
            <SettingItem
              icon={<Ionicons name="moon-outline" size={24} color="#000" />} // İkon rengi siyah yapıldı
              label="Koyu Mod"
              onPress={() => {}}
              rightComponent={
                <ToggleSwitch
                  isOn={isDarkMode}
                  onToggle={handleToggleDarkMode}
                />
              }
            />
          </View>
        </View>

        {/* Daha Fazla Bölümü */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Daha Fazla</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon={
                <Ionicons name="help-circle-outline" size={24} color="#000" />
              } // İkon rengi siyah yapıldı
              label="Yardım & Destek"
              onPress={() => {}}
            />
            <SettingItem
              icon={
                <Ionicons
                  name="shield-checkmark-outline"
                  size={24}
                  color="#000"
                />
              } // İkon rengi siyah yapıldı
              label="Gizlilik"
              onPress={() => {}}
            />
            <SettingItem
              icon={
                <Ionicons name="add-circle-outline" size={24} color="#000" />
              } // İkon rengi siyah yapıldı
              label="Hesap Ekle"
              onPress={() => {}}
            />
            <SettingItem
              icon={<Ionicons name="log-out-outline" size={24} color="#000" />} // İkon rengi siyah yapıldı
              label="Çıkış Yap"
              onPress={() => {
                signOut();
              }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  contentContainer: {
    paddingVertical: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginHorizontal: 20,
    paddingVertical: 10,
    // iOS gölgesi
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Android gölgesi
    elevation: 3,
  },
});
