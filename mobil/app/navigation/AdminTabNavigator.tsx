import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AdminHomeScreen from "../views/screens/Admin/AdminHomeScreen";
import HastaTahlilAramaScreen from "../views/screens/Admin/HastaTahlilAramaScreen";
import KilavuzListScreen from "../views/screens/Admin/KilavuzListScreen";
import { Ionicons } from "@expo/vector-icons"; // Ionicons'u içe aktarın

const Tab = createBottomTabNavigator();

export default function AdminTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case "AdminHome":
              iconName = focused ? "home" : "home-outline";
              break;
            case "KilavuzList":
              iconName = focused ? "book" : "book-outline";
              break;
            case "HastaTahlilArama":
              iconName = focused ? "search" : "search-outline";
              break;
            default:
              iconName = "ellipse";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#0066cc",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 0,
          elevation: 5,
          height: 60, // Tab bar yüksekliğini artırmak isterseniz
          display: 'none', // Hide default tab bar if using custom BottomBar
        },
        tabBarLabelStyle: {
          fontSize: 12,
          paddingBottom: 4,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="AdminHome"
        component={AdminHomeScreen}
        options={{ title: "Ana Sayfa" }}
      />
      <Tab.Screen
        name="KilavuzList"
        component={KilavuzListScreen}
        options={{ title: "Kılavuzlar" }}
      />
      <Tab.Screen
        name="HastaTahlilArama"
        component={HastaTahlilAramaScreen}
        options={{ title: "Tahlil Arama" }}
      />
    </Tab.Navigator>
  );
}