import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import api from '../../../services/api'; 
import { Ionicons } from '@expo/vector-icons'; // İkonlar için import

export default function EditProfileScreen() {
  const { user, token } = useContext(AuthContext);
  const navigation = useNavigation();

  const [username, setUsername] = useState(user?.isim || "");
  const [surname, setSurname] = useState(user?.soyisim || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState(user?.sifre || "");
  const [birthDateString, setBirthDateString] = useState("");

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Profil bilgisini backend'den çek
    const fetchProfile = async () => {
      if (!token) return; // token yoksa istek atma
      try {
        const response = await api.get("/users/me", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const userData = response.data;

        // Bunu gg/aa/yyyy formatına çevirelim
        if (userData.dogumTarihi) {
          const dateObj = new Date(userData.dogumTarihi);
          const day = String(dateObj.getDate() + 1).padStart(2, '0');
          const month = String(dateObj.getMonth() + 1).padStart(2, '0');
          const year = dateObj.getFullYear();
          setBirthDateString(`${day}/${month}/${year}`);
        }

        // İsim, soyisim, email, vs. yenile
        if (userData.isim) setUsername(userData.isim);
        if (userData.soyisim) setSurname(userData.soyisim);
        if (userData.email) setEmail(userData.email);
      } catch (err) {
        console.error(err);
        Alert.alert("Hata", "Profil bilgileri alınamadı. Lütfen tekrar deneyin.");
      }
    };

    fetchProfile();
  }, [token]);

  const handleSave = async () => {
    // Form doğrulama
    if (![username, surname, email, birthDateString].every(val => val.trim() !== "")) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun.");
      return;
    }

    // E-posta formatı kontrolü
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      Alert.alert("Hata", "Lütfen geçerli bir e-posta adresi girin.");
      return;
    }

    setLoading(true);
    try {
      await api.put('/users/me', {
        isim: username,
        soyisim: surname,
        email: email,
        sifre: password,
        dogumTarihi: birthDateString 
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      Alert.alert('Başarılı', 'Profiliniz güncellendi.');
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert('Hata', 'Profil güncellenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#f0f4f7' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Profilini Düzenle</Text>

        {/* İsim */}
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={24} color="#0066cc" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="İsim"
            placeholderTextColor="#999"
            value={username}
            onChangeText={setUsername}
          />
        </View>

        {/* Soyisim */}
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={24} color="#0066cc" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Soyisim"
            placeholderTextColor="#999"
            value={surname}
            onChangeText={setSurname}
          />
        </View>

        {/* E-posta */}
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={24} color="#0066cc" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="E-posta"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Şifre */}
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={24} color="#0066cc" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Yeni Şifre"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {/* Doğum Tarihi */}
        <View style={styles.inputContainer}>
          <Ionicons name="calendar-outline" size={24} color="#0066cc" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Doğum Tarihi (gg/aa/yyyy)"
            placeholderTextColor="#999"
            value={birthDateString}
            onChangeText={setBirthDateString}
            keyboardType="numeric"
          />
        </View>

        {/* Kaydet Butonu */}
        <TouchableOpacity 
          style={[styles.saveButton, loading && styles.buttonDisabled]} 
          onPress={handleSave} 
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Değişiklikleri Kaydet</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Geliştirilmiş stil
const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#0066cc',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#0066cc',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    marginTop: 24,
  },
  buttonDisabled: {
    backgroundColor: '#99c2ff',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
