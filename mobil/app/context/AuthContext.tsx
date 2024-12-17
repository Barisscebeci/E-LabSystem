import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

interface AuthContextData {
  user: any;
  loading: boolean;
  signIn(credentials: { email: string; sifre: string }): Promise<void>;
  signOut(): void;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      try {
        console.log('AsyncStorage verileri yükleniyor...');
        const storedUser = await AsyncStorage.getItem('@Auth:user');
        const storedToken = await AsyncStorage.getItem('@Auth:token');
  
        if (storedUser && storedToken) {
          api.defaults.headers['Authorization'] = `Bearer ${storedToken}`;
          setUser(JSON.parse(storedUser));
          console.log('Kullanıcı bulundu:', storedUser);
        } else {
          console.log('Kullanıcı bulunamadı.');
        }
      } catch (error) {
        console.error('AsyncStorage hatası:', error);
      } finally {
        setLoading(false);
        console.log('Loading durumu false olarak ayarlandı.');
      }
    }
  
    loadStorageData();
  }, []);

  async function signIn(credentials: { email: string; sifre: string }) {
    try {
      console.log('Giriş isteği gönderiliyor...', credentials);

      const response = await api.post('/auth/login', credentials);
      console.log('Giriş yanıtı:', response.data);

      const { token } = response.data;

      const userResponse = await api.get('/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Kullanıcı verileri:', userResponse.data);

      setUser(userResponse.data);
      api.defaults.headers['Authorization'] = `Bearer ${token}`;

      await AsyncStorage.setItem('@Auth:user', JSON.stringify(userResponse.data));
      await AsyncStorage.setItem('@Auth:token', token);
    } catch (err: any) {
      console.error('Giriş hatası:', err);
      alert('Giriş sırasında bir hata oluştu: ' + err.message);
    }
  }

  function signOut() {
    AsyncStorage.clear().then(() => {
      setUser(null);
    });
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
