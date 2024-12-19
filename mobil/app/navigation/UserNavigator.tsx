import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "react-native";
import HomeNavigator from "./HomeNavigator";
import UserNavigation from "./TestsNavigator";
import ProfileScreen from "../views/screens/user/ProfileScreen";
import SettingsNavigator from "./SettingsNavigator";
import ProfileNavigator from "./ProfileNavigator";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Anasayfa"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "Anasayfa") {
            return (
              <Image
                source={require("../../assets/home.png")}
                style={{ width: size, height: size, tintColor: color }}
              />
            );
          } else if (route.name === "Geçmiş") {
            return (
              <Image
                source={require("../../assets/analytics.png")}
                style={{ width: size, height: size, tintColor: color }}
              />
            );
          } else if (route.name === "Hesabım") {
            return (
              <Image
                source={require("../../assets/settings.png")}
                style={{ width: size, height: size, tintColor: color }}
              />
            );
          } else {
            iconName = "ellipse";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#0066cc",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { height: 70, paddingBottom: 10 },
        tabBarLabelStyle: { paddingBottom: 5 },
      })}
    >
      <Tab.Screen
        name="Anasayfa"
        component={HomeNavigator}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="Geçmiş" component={UserNavigation} />
      <Tab.Screen name="Hesabım" component={ProfileNavigator} />
    </Tab.Navigator>
  );
}
