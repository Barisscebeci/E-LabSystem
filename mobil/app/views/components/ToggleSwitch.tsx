import React, { useState, useEffect, useRef } from "react";
import { TouchableWithoutFeedback, Animated, StyleSheet, View } from "react-native";

interface ToggleSwitchProps {
  isOn: boolean;
  onToggle: (value: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isOn, onToggle }) => {
  const [toggle, setToggle] = useState(isOn);
  const animatedValue = useRef(new Animated.Value(isOn ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: toggle ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [toggle, animatedValue]);

  const toggleSwitch = () => {
    setToggle(!toggle);
    onToggle(!toggle);
  };

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22], // Slider'ın hareket edeceği aralık
  });

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["#ccc", "#4cd137"], // Gri ve yeşil renkler
  });

  return (
    <TouchableWithoutFeedback onPress={toggleSwitch}>
      <Animated.View style={[styles.switchContainer, { backgroundColor }]}>
        <Animated.View style={[styles.slider, { transform: [{ translateX }] }]} />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    width: 50,
    height: 28,
    borderRadius: 14,
    padding: 2,
    justifyContent: "center",
  },
  slider: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#fff",
  },
});

export default ToggleSwitch;
