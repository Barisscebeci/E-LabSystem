import React from "react";
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent } from "react-native";

type GuideCardProps = {
  label: string;
  onPress?: (event: GestureResponderEvent) => void;
};

export default function GuideCard({ label, onPress }: GuideCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.cardText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    marginHorizontal: 4,
    marginVertical: 4,
    borderRadius: 8,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  cardText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
