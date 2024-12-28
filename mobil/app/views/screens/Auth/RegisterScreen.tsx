import React, { useState } from "react";
import Checkbox from "expo-checkbox";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import api from "../../../services/api";
import { StackScreenProps } from "@react-navigation/stack";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";

type AuthStackParamList = {
  "Giriş Yap": undefined;
  "Kayıt Ol": undefined;
};

type Props = StackScreenProps<AuthStackParamList, "Kayıt Ol">;

export default function RegisterScreen({ navigation }: Props) {
  const [isim, setIsim] = useState("");
  const [soyisim, setSoyisim] = useState("");
  const [email, setEmail] = useState("");
  const [sifre, setSifre] = useState("");
  const [telefon, setTelefon] = useState("");
  const [yas, setYas] = useState("");
  const [dogumTarihi, setDogumTarihi] = useState("");
  const [loading, setLoading] = useState(false);
  const [sifreGizli, setSifreGizli] = useState(true);

  const handleRegister = async () => {
    setLoading(true);
    try {
      // Doğum tarihini formatlayın veya backend'inize uygun şekilde gönderin
      await api.post("/auth/register", {
        isim,
        soyisim,
        email,
        sifre,
        telefon,
        dogumTarihi ,
      });
      alert("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
      navigation.navigate("Giriş Yap");
    } catch (err) {
      alert("Kayıt başarısız!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#FFF8E1", "#D3CCE3"]} style={styles.gradient}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Kayıt Ol</Text>
          <Text style={styles.subtitle}>
            Devam etmek için bir hesap oluşturun
          </Text>

          <View style={styles.inputContainer}>
            <MaterialIcons
              name="person"
              size={20}
              color="#666"
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="İsim"
              value={isim}
              onChangeText={setIsim}
              style={styles.input}
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons
              name="person"
              size={20}
              color="#666"
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Soyisim"
              value={soyisim}
              onChangeText={setSoyisim}
              style={styles.input}
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons
              name="email"
              size={20}
              color="#666"
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {/* Yaş Girişi */}
          <View style={styles.inputContainer}>
            <MaterialIcons
              name="cake"
              size={20}
              color="#666"
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Doğum Tarihi (gg/aa/yyyy)"
              value={dogumTarihi}
              onChangeText={setDogumTarihi}
              style={styles.input}
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons
              name="phone"
              size={20}
              color="#666"
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Telefon"
              value={telefon}
              onChangeText={setTelefon}
              style={styles.input}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons
              name="lock"
              size={20}
              color="#666"
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Şifre"
              value={sifre}
              onChangeText={setSifre}
              style={styles.input}
              secureTextEntry={sifreGizli}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setSifreGizli(!sifreGizli)}
            >
              <MaterialIcons
                name={sifreGizli ? "visibility-off" : "visibility"}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Kayıt Ol</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={() => navigation.navigate("Giriş Yap")}>
            <Text style={styles.loginText}>
              Zaten bir hesabınız var mı?{" "}
              <Text style={styles.loginLink}>Giriş Yap</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    elevation: 5, // Android gölge efekti
    shadowColor: "#000", // iOS gölge efekti
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  title: {
    fontSize: 28,
    color: "#333",
    marginBottom: 8,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 24,
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    position: "relative",
    marginBottom: 16,
  },
  inputIcon: {
    position: "absolute",
    top: 14,
    left: 12,
  },
  input: {
    width: "100%",
    height: 48,
    backgroundColor: "#fff",
    paddingLeft: 44,
    paddingRight: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  eyeIcon: {
    position: "absolute",
    top: 14,
    right: 12,
  },
  button: {
    width: "100%",
    backgroundColor: "#0066cc",
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  loginText: {
    color: "#666",
  },
  loginLink: {
    color: "#0066cc",
  },
});
