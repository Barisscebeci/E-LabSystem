import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import TestsScreen from "../views/screens/user/TestsScreen";
import TestDetailsScreen from "../views/screens/user/TestDetailsScreen";
import EditProfileScreen from "../views/screens/user/EditProfileScreen";

export type TestsStackParamList = {
  TestsHome: undefined;
  TestDetails: { testId: string };
  EditProfile: undefined;
};

const Stack = createStackNavigator<TestsStackParamList>();

export default function TestsNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TestsHome"
        component={TestsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TestDetails"
        component={TestDetailsScreen}
        options={{ title: "Tahlil Detayları" }}
      />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    </Stack.Navigator>
  );
}
