import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator 
} from 'react-native';
import api from '../../../services/api';
import { Ionicons } from '@expo/vector-icons'; // İkonlar için import
import { NavigationProp } from '@react-navigation/native';

export default function AddTestScreen({ navigation }: { navigation: NavigationProp<any> }) {
  const [IgA, setIgA] = useState('');
  const [IgM, setIgM] = useState('');
  const [IgG, setIgG] = useState('');
  const [IgG1, setIgG1] = useState('');
  const [IgG2, setIgG2] = useState('');
  const [IgG3, setIgG3] = useState('');
  const [IgG4, setIgG4] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // Form doğrulama
    if (![IgA, IgM, IgG, IgG1, IgG2, IgG3, IgG4].every(val => val !== '')) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    setLoading(true);
    try {
      const degerler = {
        IgA: parseFloat(IgA),
        IgM: parseFloat(IgM),
        IgG: parseFloat(IgG),
        IgG1: parseFloat(IgG1),
        IgG2: parseFloat(IgG2),
        IgG3: parseFloat(IgG3),
        IgG4: parseFloat(IgG4),
      };

      // Geçersiz veya boş değerleri kaldır
      (Object.keys(degerler) as (keyof typeof degerler)[]).forEach((key) => {
        if (isNaN(degerler[key])) {
          delete degerler[key];
        }
      });

      const response = await api.post('/tahliller', {
        tarih: new Date(),
        degerler,
      });

      Alert.alert('Başarılı', 'Tahlil eklendi.');
      navigation.goBack();
    } catch (error) {
      console.error('Tahlil eklerken hata oluştu:', error);
      Alert.alert('Hata', 'Tahlil eklenirken bir hata oluştu.');
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
        <Text style={styles.title}>Tahlil Ekle</Text>

        {/* IgA */}
        <View style={styles.inputContainer}>
          <Ionicons name="analytics-outline" size={24} color="#0066cc" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="IgA (g/l)"
            placeholderTextColor="#999"
            value={IgA}
            onChangeText={setIgA}
            keyboardType="numeric"
          />
        </View>

        {/* IgM */}
        <View style={styles.inputContainer}>
          <Ionicons name="analytics-outline" size={24} color="#0066cc" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="IgM (g/l)"
            placeholderTextColor="#999"
            value={IgM}
            onChangeText={setIgM}
            keyboardType="numeric"
          />
        </View>

        {/* IgG */}
        <View style={styles.inputContainer}>
          <Ionicons name="analytics-outline" size={24} color="#0066cc" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="IgG (g/l)"
            placeholderTextColor="#999"
            value={IgG}
            onChangeText={setIgG}
            keyboardType="numeric"
          />
        </View>

        {/* IgG1 */}
        <View style={styles.inputContainer}>
          <Ionicons name="analytics-outline" size={24} color="#0066cc" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="IgG1 (g/l)"
            placeholderTextColor="#999"
            value={IgG1}
            onChangeText={setIgG1}
            keyboardType="numeric"
          />
        </View>

        {/* IgG2 */}
        <View style={styles.inputContainer}>
          <Ionicons name="analytics-outline" size={24} color="#0066cc" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="IgG2 (g/l)"
            placeholderTextColor="#999"
            value={IgG2}
            onChangeText={setIgG2}
            keyboardType="numeric"
          />
        </View>

        {/* IgG3 */}
        <View style={styles.inputContainer}>
          <Ionicons name="analytics-outline" size={24} color="#0066cc" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="IgG3 (g/l)"
            placeholderTextColor="#999"
            value={IgG3}
            onChangeText={setIgG3}
            keyboardType="numeric"
          />
        </View>

        {/* IgG4 */}
        <View style={styles.inputContainer}>
          <Ionicons name="analytics-outline" size={24} color="#0066cc" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="IgG4 (g/l)"
            placeholderTextColor="#999"
            value={IgG4}
            onChangeText={setIgG4}
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleSubmit} 
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Kaydet</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

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
  button: {
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
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
