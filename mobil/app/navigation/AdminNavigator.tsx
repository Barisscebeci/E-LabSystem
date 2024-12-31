// AdminNavigator.tsx

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AdminTabNavigator from "./AdminTabNavigator";
import KilavuzDetayScreen from "../views/screens/Admin/KilavuzDetayScreen";
import ReferansDetayScreen from "../views/screens/Admin/ReferansDetayScreen";
import ReferansEkleScreen from "../views/screens/Admin/ReferansEkleScreen";
import KilavuzOlusturScreen from "../views/screens/Admin/KilavuzOlusturScreen";
import TahlilDetayScreen from "../views/screens/Admin/TahlilDetayScreen";
import ReferansGuncelleScreen from "../views/screens/Admin/ReferansGuncelleScreen";
import TahlilEkleScreen from "../views/screens/Admin/TahlilEkleScreen";
import { useNavigation } from "@react-navigation/native";

export type AdminStackParamList = {
  AdminTabs: undefined;
  KilavuzDetay: { kilavuzId: string };
  ReferansDetay: { reference: any };
  ReferansEkleScreen: undefined;
  KilavuzOlustur: undefined;
  TahlilDetay: { tahlilId: string };
  ReferansGuncelleScreen: undefined;
  TahlilEkleScreen: undefined;
};

const Stack = createStackNavigator<AdminStackParamList>();

function BackButton() {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.backButton}
      onPress={() => navigation.goBack()}
    >
      <Ionicons name="arrow-back" size={24} color="#000" />
    </TouchableOpacity>
  );
}

export default function AdminNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerBackTitleVisible: false,
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="AdminTabs"
        component={AdminTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="KilavuzOlustur"
        component={KilavuzOlusturScreen}
        options={{
          title: "Kılavuz Oluştur",
          headerLeft: () => <BackButton />,
        }}
      />
      <Stack.Screen
        name="KilavuzDetay"
        component={KilavuzDetayScreen}
        options={{
          title: "Kılavuz Detayı",
          headerLeft: () => <BackButton />,
        }}
      />
      <Stack.Screen
        name="ReferansDetay"
        component={ReferansDetayScreen}
        options={{
          title: "Referans Detayı",
          headerLeft: () => <BackButton />,
        }}
      />
      <Stack.Screen
        name="ReferansEkleScreen"
        component={ReferansEkleScreen}
        options={{
          title: "Referans Ekle",
          headerLeft: () => <BackButton />,
        }}
      />
      <Stack.Screen
        name="TahlilDetay"
        component={TahlilDetayScreen}
        options={{
          title: "Tahlil Detayı",
          headerLeft: () => <BackButton />,
        }}
      />
      <Stack.Screen
        name="ReferansGuncelleScreen"
        component={ReferansGuncelleScreen}
        options={{
          title: "Referans Güncelle",
          headerLeft: () => <BackButton />,
        }}
      />
      <Stack.Screen
        name="TahlilEkleScreen"
        component={TahlilEkleScreen}
        options={{
          title: "Tahlil Ekle",
          headerLeft: () => <BackButton />,
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  backButton: {
    paddingHorizontal: 10,
  },
});
