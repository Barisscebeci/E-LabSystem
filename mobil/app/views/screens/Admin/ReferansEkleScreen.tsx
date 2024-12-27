import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import api from "../../../services/api";
import { Ionicons } from "@expo/vector-icons";

type RouteParams = {
  params: {
    kilavuzId: string;
  };
};

export default function ReferansEkleScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RouteParams, "params">>();

  // 1. Adımda oluşturduğumuz kılavuzun `_id`'sini parametre olarak alıyoruz
  // Örneğin: navigation.navigate("ReferansEkle", { kilavuzId: "123abc..." })
  const { kilavuzId } = route.params || {};

  const [yasAraligi, setYasAraligi] = useState("");

  const [IgA_min, setIgA_min] = useState("");
  const [IgA_max, setIgA_max] = useState("");

  const [IgM_min, setIgM_min] = useState("");
  const [IgM_max, setIgM_max] = useState("");

  const [IgG_min, setIgG_min] = useState("");
  const [IgG_max, setIgG_max] = useState("");

  const [IgG1_min, setIgG1_min] = useState("");
  const [IgG1_max, setIgG1_max] = useState("");

  const [IgG2_min, setIgG2_min] = useState("");
  const [IgG2_max, setIgG2_max] = useState("");

  const [IgG3_min, setIgG3_min] = useState("");
  const [IgG3_max, setIgG3_max] = useState("");

  const [IgG4_min, setIgG4_min] = useState("");
  const [IgG4_max, setIgG4_max] = useState("");

  // "Referans Ekle" mantığı: /kilavuzlar/:id/references endpoint’ine istek atacağız
  const handleAddReference = async () => {
    if (!kilavuzId) {
      Alert.alert("Hata", "kılavuzId parametresi alınamadı!");
      return;
    }

    // "4-7" gibi girildiğini varsayalım
    const [minAgeStr, maxAgeStr] = yasAraligi.split("-").map((s) => s.trim());
    const minAge = parseInt(minAgeStr, 10);
    const maxAge = parseInt(maxAgeStr, 10);

    // Backend’de references: [ { ageMin, ageMax, IgA, IgM, ... } ] şeklinde tutuluyor.
    const payload = {
      ageMin: minAge,
      ageMax: maxAge,
      IgA: { min: parseFloat(IgA_min), max: parseFloat(IgA_max) },
      IgM: { min: parseFloat(IgM_min), max: parseFloat(IgM_max) },
      IgG: { min: parseFloat(IgG_min), max: parseFloat(IgG_max) },
      IgG1: { min: parseFloat(IgG1_min), max: parseFloat(IgG1_max) },
      IgG2: { min: parseFloat(IgG2_min), max: parseFloat(IgG2_max) },
      IgG3: { min: parseFloat(IgG3_min), max: parseFloat(IgG3_max) },
      IgG4: { min: parseFloat(IgG4_min), max: parseFloat(IgG4_max) },
    };

    try {
      await api.post(`/kilavuzlar/${kilavuzId}/references`, payload);
      Alert.alert("Başarılı", "Referans eklendi.");
      // İster geri dönün, ister detay ekranına yönlendirin
      navigation.goBack();
    } catch (error) {
      console.error("Referans ekleme hatası:", error);
      Alert.alert("Hata", "Referans eklenirken hata oluştu.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.innerContainer}>
        <Text style={styles.title}>Referans Ekle</Text>

        <View style={styles.inputContainer}>
          <Ionicons
            name="calendar-outline"
            size={24}
            color="#0066cc"
            style={styles.icon}
          />
          <TextInput
            placeholder="Ay Aralığı (örn: 36-48)"
            style={styles.input}
            value={yasAraligi}
            onChangeText={setYasAraligi}
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>

        {/* IgA */}
        <Text style={styles.sectionTitle}>IgA (g/l)</Text>
        <View style={styles.row}>
          <View style={styles.halfInputContainer}>
            <Ionicons
              name="arrow-down-circle-outline"
              size={20}
              color="#28a745"
              style={styles.iconSmall}
            />
            <TextInput
              placeholder="Min"
              style={styles.halfInput}
              value={IgA_min}
              onChangeText={setIgA_min}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.halfInputContainer}>
            <Ionicons
              name="arrow-up-circle-outline"
              size={20}
              color="#dc3545"
              style={styles.iconSmall}
            />
            <TextInput
              placeholder="Max"
              style={styles.halfInput}
              value={IgA_max}
              onChangeText={setIgA_max}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Diğer Ig türleri için aynı yapı */}
        <Text style={styles.sectionTitle}>IgM (g/l)</Text>
        <View style={styles.row}>
          <View style={styles.halfInputContainer}>
            <Ionicons
              name="arrow-down-circle-outline"
              size={20}
              color="#28a745"
              style={styles.iconSmall}
            />
            <TextInput
              placeholder="Min"
              style={styles.halfInput}
              value={IgM_min}
              onChangeText={setIgM_min}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.halfInputContainer}>
            <Ionicons
              name="arrow-up-circle-outline"
              size={20}
              color="#dc3545"
              style={styles.iconSmall}
            />
            <TextInput
              placeholder="Max"
              style={styles.halfInput}
              value={IgM_max}
              onChangeText={setIgM_max}
              keyboardType="numeric"
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>IgG (g/l)</Text>
        <View style={styles.row}>
          <View style={styles.halfInputContainer}>
            <Ionicons
              name="arrow-down-circle-outline"
              size={20}
              color="#28a745"
              style={styles.iconSmall}
            />
            <TextInput
              placeholder="Min"
              style={styles.halfInput}
              value={IgG_min}
              onChangeText={setIgG_min}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.halfInputContainer}>
            <Ionicons
              name="arrow-up-circle-outline"
              size={20}
              color="#dc3545"
              style={styles.iconSmall}
            />
            <TextInput
              placeholder="Max"
              style={styles.halfInput}
              value={IgG_max}
              onChangeText={setIgG_max}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* IgG1 */}
        <Text style={styles.sectionTitle}>IgG1 (g/l)</Text>
        <View style={styles.row}>
          <View style={styles.halfInputContainer}>
            <Ionicons
              name="arrow-down-circle-outline"
              size={20}
              color="#28a745"
              style={styles.iconSmall}
            />
            <TextInput
              placeholder="Min"
              style={styles.halfInput}
              value={IgG1_min}
              onChangeText={setIgG1_min}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.halfInputContainer}>
            <Ionicons
              name="arrow-up-circle-outline"
              size={20}
              color="#dc3545"
              style={styles.iconSmall}
            />
            <TextInput
              placeholder="Max"
              style={styles.halfInput}
              value={IgG1_max}
              onChangeText={setIgG1_max}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* IgG2 */}
        <Text style={styles.sectionTitle}>IgG2 (g/l)</Text>
        <View style={styles.row}>
          <View style={styles.halfInputContainer}>
            <Ionicons
              name="arrow-down-circle-outline"
              size={20}
              color="#28a745"
              style={styles.iconSmall}
            />
            <TextInput
              placeholder="Min"
              style={styles.halfInput}
              value={IgG2_min}
              onChangeText={setIgG2_min}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.halfInputContainer}>
            <Ionicons
              name="arrow-up-circle-outline"
              size={20}
              color="#dc3545"
              style={styles.iconSmall}
            />
            <TextInput
              placeholder="Max"
              style={styles.halfInput}
              value={IgG2_max}
              onChangeText={setIgG2_max}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* IgG3 */}
        <Text style={styles.sectionTitle}>IgG3 (g/l)</Text>
        <View style={styles.row}>
          <View style={styles.halfInputContainer}>
            <Ionicons
              name="arrow-down-circle-outline"
              size={20}
              color="#28a745"
              style={styles.iconSmall}
            />
            <TextInput
              placeholder="Min"
              style={styles.halfInput}
              value={IgG3_min}
              onChangeText={setIgG3_min}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.halfInputContainer}>
            <Ionicons
              name="arrow-up-circle-outline"
              size={20}
              color="#dc3545"
              style={styles.iconSmall}
            />
            <TextInput
              placeholder="Max"
              style={styles.halfInput}
              value={IgG3_max}
              onChangeText={setIgG3_max}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* IgG4 */}
        <Text style={styles.sectionTitle}>IgG4 (g/l)</Text>
        <View style={styles.row}>
          <View style={styles.halfInputContainer}>
            <Ionicons
              name="arrow-down-circle-outline"
              size={20}
              color="#28a745"
              style={styles.iconSmall}
            />
            <TextInput
              placeholder="Min"
              style={styles.halfInput}
              value={IgG4_min}
              onChangeText={setIgG4_min}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.halfInputContainer}>
            <Ionicons
              name="arrow-up-circle-outline"
              size={20}
              color="#dc3545"
              style={styles.iconSmall}
            />
            <TextInput
              placeholder="Max"
              style={styles.halfInput}
              value={IgG4_max}
              onChangeText={setIgG4_max}
              keyboardType="numeric"
            />
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleAddReference}>
          <Text style={styles.buttonText}>Kaydet</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f7",
    padding: 16,
  },
  innerContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
    marginBottom: 24,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0066cc",
    marginTop: 16,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#0066cc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 20,
    backgroundColor: "#f9fafb",
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    width: "48%",
    backgroundColor: "#f9fafb",
  },
  iconSmall: {
    marginRight: 4,
  },
  halfInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#28a745",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 24,
    shadowColor: "#28a745",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },
});
