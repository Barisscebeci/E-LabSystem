// SettingItem.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface SettingItemProps {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  rightComponent?: React.ReactNode;
}

const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  label,
  onPress,
  rightComponent,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.leftContainer}>
        {icon}
        <Text style={styles.label}>{label}</Text>
      </View>
      {rightComponent && (
        <View style={styles.rightContainer}>{rightComponent}</View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    justifyContent: "space-between",
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginLeft: 12,
  },
  rightContainer: {
    // Sağ tarafta yer alacak bileşenler için
  },
});

export default SettingItem;
