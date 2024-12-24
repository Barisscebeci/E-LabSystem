// src/views/components/admin/AdminCard.tsx

import React, { useRef } from "react";
import { Animated, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface AdminCardProps {
  title: string;
  subtitle?: string;
  iconName: keyof typeof Ionicons.glyphMap; // keyof typeof Ionicons.glyphMap tipi kullanıldı
  onPress: () => void;
  color: string;
  isDestructive?: boolean;
}

const AdminCard: React.FC<AdminCardProps> = ({
  title,
  subtitle,
  iconName,
  onPress,
  color,
  isDestructive = false, // Varsayılan değer eklendi
}) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scaleValue, {
        toValue: 0.95,
        useNativeDriver: true,
      }),
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
    onPress();
  };

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        { transform: [{ scale: scaleValue }] },
        isDestructive && styles.destructiveCard, // 'scale' yerine farklı bir stil uygulandı
      ]}
    >
      <TouchableOpacity
        style={[styles.card, { backgroundColor: color }]}
        onPress={handlePress}
        activeOpacity={0.9}
      >
        <Ionicons name={iconName} size={32} color="#fff" style={styles.icon} />
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: "100%",
    marginVertical: 8,
    borderRadius: 16,
    elevation: 4, // Android için gölge
    shadowColor: "#000", // iOS için gölge
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  card: {
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
    textAlign: "center",
  },
  destructiveCard: {
    borderWidth: 2,
    borderColor: "#FF5252", // Örneğin, kırmızı bir sınır ekleyerek yıkıcı aksiyonu vurgulama
  },
});

export default AdminCard;
