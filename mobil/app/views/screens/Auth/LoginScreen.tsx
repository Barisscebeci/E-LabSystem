import React, { useState, useContext } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Checkbox from 'expo-checkbox';
import { AuthContext } from '../../../context/AuthContext';
import { StackScreenProps } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Platform } from 'react-native';


type AuthStackParamList = {
  'Giriş Yap': undefined;
  'Kayıt Ol': undefined;
};

type Props = StackScreenProps<AuthStackParamList, 'Giriş Yap'>;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [sifre, setSifre] = useState('');
  const [loading, setLoading] = useState(false);
  const [sifreGizli, setSifreGizli] = useState(true);
  const [beniHatirla, setBeniHatirla] = useState(false);
  const { signIn } = useContext(AuthContext);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signIn({ email, sifre });
    } catch (err) {
      alert('Giriş başarısız!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#FFF8E1', '#D3CCE3']} style={styles.gradient}>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
      >
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Giriş Yap</Text>
          <Text style={styles.subtitle}>Giriş yapmak için e-posta adresinizi ve şifrenizi girin</Text>

          <View style={styles.inputContainer}>
            <MaterialIcons name="email" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons name="lock" size={20} color="#666" style={styles.inputIcon} />
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
                name={sifreGizli ? 'visibility-off' : 'visibility'}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.optionsContainer}>
            <View style={styles.rememberMe}>
              <Checkbox
                value={beniHatirla}
                onValueChange={setBeniHatirla}
                style={styles.checkbox}
              />
              <Text style={styles.rememberMeText}>Beni Hatırla</Text>
            </View>
            <TouchableOpacity onPress={() => Alert.alert('Şifremi Unuttum')}>
              <Text style={styles.forgotPassword}>Şifremi Unuttum</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Giriş Yap</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.orText}>Veya şu hesap ile giriş yap</Text>

          <View style={styles.socialIcons}>
            <TouchableOpacity style={styles.socialButton}>
              <FontAwesome name="google" size={24} color="#DB4437" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <FontAwesome name="facebook" size={24} color="#4267B2" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <FontAwesome name="apple" size={24} color="#000000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <FontAwesome name="twitter" size={24} color="#1DA1F2" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('Kayıt Ol')}>
            <Text style={styles.registerText}>
              Hesabınız yok mu? <Text style={styles.registerLink}>Kayıt Ol</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      </KeyboardAwareScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    elevation: 5, // Android gölge efekti
    shadowColor: '#000', // iOS gölge efekti
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  title: {
    fontSize: 32,
    color: '#333',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    position: 'relative',
    marginBottom: 16,
  },
  inputIcon: {
    position: 'absolute',
    top: 14,
    left: 12,
  },
  input: {
    width: '100%',
    height: 48,
    backgroundColor: '#fff',
    paddingLeft: 44,
    paddingRight: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  eyeIcon: {
    position: 'absolute',
    top: 14,
    right: 12,
  },
  optionsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  rememberMe: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    marginRight: 8,
  },
  rememberMeText: {
    color: '#666',
  },
  forgotPassword: {
    color: '#0066cc',
  },
  button: {
    width: '100%',
    backgroundColor: '#0066cc',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  orText: {
    color: '#666',
    marginBottom: 16,
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 16,
  },
  socialButton: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 50,
    elevation: 2,
    shadowColor: '#000', // iOS gölge efekti
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  registerText: {
    color: '#666',
  },
  registerLink: {
    color: '#0066cc',
  },
});
