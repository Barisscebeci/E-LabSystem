import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import api from "../../../services/api";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function KilavuzOlusturScreen() {
  const [kilavuzAdi, setKilavuzAdi] = useState("");
  const navigation = useNavigation();

  async function handleCreateKilavuz() {
    try {
      const response = await api.post("/kilavuzlar", { kilavuzAdi });
      Alert.alert("Başarılı", "Kılavuz oluşturuldu!");
      // Oluşan kılavuzun _id'sini alıp bir sonrakine yönlendirebilirsiniz
      const createdKilavuz = response.data.kilavuz;

      navigation.navigate("ReferansEkleScreen", {
        kilavuzId: createdKilavuz._id,
      });
    } catch (error) {
      console.log("Kılavuz oluşturma hatası:", error);
      Alert.alert("Hata", "Kılavuz oluşturulamadı.");
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Kılavuz Oluştur</Text>
        <View style={styles.inputContainer}>
          <Ionicons
            name="book-outline"
            size={24}
            color="#0066cc"
            style={styles.icon}
          />
          <TextInput
            placeholder="Kılavuz Adı (örn: Kılavuz A)"
            style={styles.input}
            value={kilavuzAdi}
            onChangeText={setKilavuzAdi}
            placeholderTextColor="#999"
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleCreateKilavuz}>
          <Text style={styles.buttonText}>Oluştur</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f7",
    justifyContent: "center",
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
  button: {
    backgroundColor: "#0066cc",
    paddingVertical: 14,
    borderRadius: 8,
    shadowColor: "#0066cc",
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
