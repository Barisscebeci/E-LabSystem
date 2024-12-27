// TahlilDetayScreen.tsx

import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  ScrollView, 
  Dimensions, 
  TouchableOpacity,
  Alert
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { AdminStackParamList } from "../../../navigation/AdminNavigator";
import api from "../../../services/api";
import { Ionicons } from '@expo/vector-icons'; // İkon eklemek için

type Props = StackScreenProps<AdminStackParamList, "TahlilDetay">;

interface Tahlil {
  _id: string;
  tarih: string;
  degerler: {
    [key: string]: number;
    IgA: number;
    IgM: number;
    IgG: number;
    IgG1: number;
    IgG2: number;
    IgG3: number;
    IgG4: number;
  };
  yasAy: number;
  kullanici: {
    _id: string;
    isim: string;
    soyisim: string;
  };
}

interface KilavuzReference {
  ageMin: number;
  ageMax: number;
  IgA: { min: number; max: number };
  IgM: { min: number; max: number };
  IgG: { min: number; max: number };
  IgG1: { min: number; max: number };
  IgG2: { min: number; max: number };
  IgG3: { min: number; max: number };
  IgG4: { min: number; max: number };
}

interface Kilavuz {
  _id: string;
  kilavuzAdi: string;
  references: KilavuzReference[];
}

interface KilavuzDegerlendirme {
  kilavuzAdi: string;
  ageRange: string;
  referans: KilavuzReference;
}

export default function TahlilDetayScreen({ route }: Props) {
  const { tahlilId } = route.params;
  const [tahlil, setTahlil] = useState<Tahlil | null>(null);
  const [kilavuz, setKilavuz] = useState<Kilavuz | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchTahlilDetay();
  }, []);

  const fetchTahlilDetay = async () => {
    try {
      const response = await api.get(`/admin/tahliller/detay/${tahlilId}`);
      const fetchedTahlil: Tahlil = response.data;
      setTahlil(fetchedTahlil);

      if (fetchedTahlil.yasAy) {
        const kilavuzResponse = await api.get(`/kilavuzlar/yasaraligi?yasAy=${fetchedTahlil.yasAy}`);
        setKilavuz(kilavuzResponse.data);
      }
    } catch (error) {
      console.error("Hata:", error);
      Alert.alert("Hata", "Veriler alınırken bir sorun oluştu");
    } finally {
      setLoading(false);
    }
  };

  const getDegerlendirme = (testName: string, value: number) => {
    if (!kilavuz || !Array.isArray(kilavuz)) return [];
  
    return kilavuz.map(k => {
      const referans = k.referans[testName as keyof KilavuzReference];
      
      // Referans değeri yoksa veya min/max değerleri yoksa
      if (!referans || !referans.min || !referans.max) {
        return {
          kilavuzAdi: k.kilavuzAdi,
          ageRange: k.ageRange,
          resultSymbol: "none", // Yeni durum: değer yok
          found: false
        };
      }
  
      let resultSymbol = "same";
      if (value < referans.min) resultSymbol = "down";
      else if (value > referans.max) resultSymbol = "up";
  
      return {
        kilavuzAdi: k.kilavuzAdi,
        ageRange: k.ageRange,
        resultSymbol,
        found: true
      };
    });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  if (!tahlil) {
    return (
      <View style={styles.centered}>
        <Ionicons name="warning-outline" size={50} color="#dc3545" />
        <Text style={styles.errorText}>Tahlil detayları bulunamadı.</Text>
      </View>
    );
  }

  const immunoglobulins = [
    { name: "IgA", value: tahlil.degerler.IgA },
    { name: "IgM", value: tahlil.degerler.IgM },
    { name: "IgG", value: tahlil.degerler.IgG },
    { name: "IgG1", value: tahlil.degerler.IgG1 },
    { name: "IgG2", value: tahlil.degerler.IgG2 },
    { name: "IgG3", value: tahlil.degerler.IgG3 },
    { name: "IgG4", value: tahlil.degerler.IgG4 },
  ];

  // Yardımcı fonksiyon: Değerin durumu
  const getDurum = (testName: string, value: number): { durum: string; renk: string; ikon: string } => {
    if (!kilavuz || !kilavuz.references || kilavuz.references.length === 0) {
      return { durum: "Bilgi yok", renk: "#555", ikon: "help-circle-outline" };
    }

    // Kullanıcının yaşına uygun referansı bul
    const reference = kilavuz.references.find(
      (ref) => ref.ageMin <= tahlil.yasAy && ref.ageMax >= tahlil.yasAy
    );

    if (!reference) {
      return { durum: "Bilgi yok", renk: "#555", ikon: "help-circle-outline" };
    }

    const testRef = reference[testName as keyof KilavuzReference];
    if (!testRef) {
      return { durum: "Bilgi yok", renk: "#555", ikon: "help-circle-outline" };
    }

    if (typeof testRef !== 'number' && value < testRef.min) {
      return { durum: "Düşük", renk: "#F44336", ikon: "arrow-down-circle" };
    } else if (typeof testRef !== 'number' && value > testRef.max) {
      return { durum: "Yüksek", renk: "#4CAF50", ikon: "arrow-up-circle" };
    } else {
      return { durum: "Normal", renk: "#1E88E5", ikon: "checkmark-circle" };
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="document-text-outline" size={28} color="#fff" />
        <Text style={styles.headerTitle}>Tahlil Detayı</Text>
      </View>

      {/* Tarih ve Kullanıcı Bilgileri */}
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={20} color="#0066cc" />
          <Text style={styles.infoText}>
            Tarih: {new Date(tahlil.tarih).toLocaleDateString("tr-TR")}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="person-outline" size={20} color="#0066cc" />
          <Text style={styles.infoText}>
            Kullanıcı: {tahlil.kullanici.isim} {tahlil.kullanici.soyisim}
          </Text>
        </View>
      </View>

      {/* Tahlil Sonuçları */}
      <View style={styles.resultsContainer}>
        {immunoglobulins.map((ig, index) => {
          const degerlendirmeler = getDegerlendirme(ig.name, ig.value);
          
          return (
            <View key={index} style={styles.resultCard}>
              <Ionicons name="analytics-outline" size={24} color="#28a745" />
              <View style={styles.resultTextContainer}>
                <Text style={styles.resultName}>{ig.name}</Text>
                <Text style={styles.resultValue}>{ig.value} g/l</Text>
                
                {/* Kılavuz Değerlendirmeleri */}
                <View style={styles.kilavuzContainer}>
                  {degerlendirmeler.map((k, i) => (
                    <View key={i} style={styles.kilavuzItem}>
                      <Ionicons
                        name={
                          k.found
                            ? k.resultSymbol === "up"
                              ? "arrow-up-circle"
                              : k.resultSymbol === "down"
                              ? "arrow-down-circle"
                              : k.resultSymbol === "none"
                              ? "remove-circle-outline"
                              : "swap-horizontal"
                            : "alert-circle-outline"
                        }
                        size={20}
                        color={
                          k.found
                            ? k.resultSymbol === "up"
                              ? "#F44336"
                              : k.resultSymbol === "down"
                              ? "#4CAF50"
                              : k.resultSymbol === "none"
                              ? "#999999"
                              : "#1E88E5"
                            : "#dc3545"
                        }
                      />
                      <Text
                        style={[
                          styles.kilavuzText,
                          k.resultSymbol === "none" && {
                            color: "#999999",
                            fontStyle: "italic"
                          }
                        ]}
                      >
                        {k.kilavuzAdi} ({k.ageRange} ay)
                        {k.resultSymbol === "none" && " - Referans değeri yok"}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          );
        })}
      </View>

      {/* Ekstra Bilgi veya Eylemler */}
      <TouchableOpacity style={styles.button} onPress={() => {/* Ekstra eylemler ekleyebilirsiniz */}}>
        <Ionicons name="information-circle-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.buttonText}>Daha Fazla Bilgi</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const screenWidth = Dimensions.get("window").width - 32;

const styles = StyleSheet.create({
  container: { 
    flexGrow: 1, 
    backgroundColor: "#f0f4f7",
    padding: 16 
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f4f7",
    padding: 16,
  },
  errorText: {
    fontSize: 18,
    color: "#dc3545",
    marginTop: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0066cc",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    marginLeft: 12,
  },
  infoCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    
    // Gölge efektleri
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 8,
  },
  resultsContainer: {
    marginBottom: 24,
  },
  resultCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,

    // Gölge efektleri
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  resultTextContainer: {
    marginLeft: 12,
    flex: 1, // Durum kısmının sağa itilmesini sağlar
  },
  resultName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0066cc",
  },
  resultValue: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  kilavuzContainer: {
    marginTop: 8,
  },
  kilavuzItem: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  kilavuzText: {
    fontSize: 14,
    marginLeft: 4,
    color: "#555",
  },
  durumContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  durumText: {
    fontSize: 14,
    marginLeft: 4,
    fontWeight: "500",
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#28a745",
    padding: 14,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",

    // Gölge efektleri
    shadowColor: "#28a745",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,

    marginBottom: 24,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
