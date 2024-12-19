import { createStackNavigator } from "@react-navigation/stack";
import ProfileScreen from "../views/screens/user/ProfileScreen";
import EditProfileScreen from "../views/screens/user/EditProfileScreen";

const Stack = createStackNavigator();

export default function ProfileNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ProfileHome" 
        component={ProfileScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfileScreen} 
      />
    </Stack.Navigator>
  );
}
