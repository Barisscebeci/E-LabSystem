import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // İkon eklemek için
import api from "../../../services/api"; // API hizmeti

export default function ReferansDetayScreen() {
  type RouteParams = {
    reference: Reference;
    kilavuzId: string;
  };

  const route = useRoute<RouteProp<{ params: RouteParams }, "params">>();
  const { reference, kilavuzId } = route.params;

  // Kontrol amacıyla loglama
  console.log("Referans Detay Ekranı Parametreleri:", route.params);

  // Eğer kilavuzId undefined ise kullanıcıya hata göster
  if (!kilavuzId) {
    Alert.alert("Hata", "Kilavuz ID bulunamadı.");
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Kilavuz ID bulunamadı.</Text>
      </View>
    );
  }

  const [currentReference, setCurrentReference] = useState(reference);
  const [loading, setLoading] = useState(false);

  const immunoglobulins = [
    { name: "IgA", value: currentReference.IgA },
    { name: "IgM", value: currentReference.IgM },
    { name: "IgG", value: currentReference.IgG },
    { name: "IgG1", value: currentReference.IgG1 },
    { name: "IgG2", value: currentReference.IgG2 },
    { name: "IgG3", value: currentReference.IgG3 },
    { name: "IgG4", value: currentReference.IgG4 },
  ];

  // Belirli bir immunoglobulinin değerlerini silme işlevi
  interface Immunoglobulin {
    min: number;
    max: number;
  }

  interface Reference {
    _id: string;
    ageMin: number;
    ageMax: number;
    IgA?: Immunoglobulin;
    IgM?: Immunoglobulin;
    IgG?: Immunoglobulin;
    IgG1?: Immunoglobulin;
    IgG2?: Immunoglobulin;
    IgG3?: Immunoglobulin;
    IgG4?: Immunoglobulin;
  }

  async function handleDeleteImmunoglobulin(igName: keyof Reference) {
    Alert.alert(
      "Silme İşlemi",
      `${igName} tahlil değerlerini silmek istediğinize emin misiniz?`,
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Sil",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              const updateData: Partial<Reference> = {};
              updateData[igName] = undefined; // undefined yerine null yap

              console.log("Güncelleme verisi:", updateData);

              const response = await api.put(
                `/kilavuzlar/${kilavuzId}/references/${currentReference._id}`,
                updateData
              );

              console.log("API yanıtı:", response.data);

              // Güncellenmiş referansı state'e set et
              const updatedReference = response.data.kilavuz.references.find(
                (ref: Reference) => ref._id === currentReference._id
              );
              setCurrentReference(updatedReference);

              Alert.alert("Başarılı", `${igName} tahlil değerleri silindi.`);
            } catch (err) {
              console.error(
                `Referansın ${igName} tahlil değerleri silinirken hata:`,
                err
              );
              Alert.alert(
                "Hata",
                `${igName} tahlil değerleri silinirken bir hata oluştu.`
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="document-text-outline" size={28} color="#fff" />
        <Text style={styles.title}>Referans Detayı</Text>
      </View>

      {/* Yaş Aralığı Kartı */}
      <View style={styles.card}>
        <Text style={styles.rangeText}>
          {currentReference.ageMin} - {currentReference.ageMax} Ay Aralığı
        </Text>
      </View>

      {/* Immunoglobulinler Container */}
      <View style={styles.immunoContainer}>
        {immunoglobulins.map((ig, index) => (
          <View key={index} style={styles.immunoCard}>
            <Ionicons name="analytics-outline" size={24} color="#0066cc" />
            <View style={styles.immunoTextContainer}>
              <Text style={styles.immunoName}>{ig.name}</Text>
              <Text style={styles.immunoRange}>
                {ig.value
                  ? `${ig.value.min} - ${ig.value.max} g/l`
                  : "Değerler boş"}
              </Text>
            </View>
            {/* Silme Butonu */}
            <TouchableOpacity
              onPress={() =>
                handleDeleteImmunoglobulin(ig.name as keyof Reference)
              }
            >
              <Ionicons name="trash-outline" size={24} color="#dc3545" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Yükleniyor Göstergesi */}
      {loading && (
        <ActivityIndicator
          size="large"
          color="#0066cc"
          style={styles.loadingIndicator}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f0f4f7",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0066cc",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    marginLeft: 12,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,

    // Gölge efektleri
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,

    marginBottom: 16,
  },
  rangeText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  immunoContainer: {
    flexDirection: "column",
    gap: 12,
  },
  immunoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,

    // Gölge efektleri
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,

    justifyContent: "space-between",
  },
  immunoTextContainer: {
    marginLeft: 12,
    flex: 1, // Metin alanının genişlemesini sağlar
  },
  immunoName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0066cc",
  },
  immunoRange: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  loadingIndicator: {
    marginTop: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#dc3545",
    textAlign: "center",
    marginTop: 20,
  },
});
