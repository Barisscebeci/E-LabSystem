
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { useRoute, useNavigation, RouteProp, NavigationProp } from "@react-navigation/native";
import api from "../../../services/api";
import { Ionicons } from '@expo/vector-icons';

interface Reference {
  _id: string;
  ageMin: number;
  ageMax: number;
  IgA: { min: number; max: number };
  // Diğer immunoglobulinler ve gerekli özellikler
}

type RootStackParamList = {
  ReferansDetay: { reference: any; kilavuzId: string };
  ReferansEkleScreen: { kilavuzId: string };
  ReferansGuncelleScreen: { kilavuzId: string; reference: Reference };
};

export default function KilavuzDetayScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<{ params: { kilavuzId: string } }, 'params'>>();
  const { kilavuzId } = route.params;

  interface Kilavuz {
    kilavuzAdi: string;
    references: Array<Reference>;
  }

  const [kilavuz, setKilavuz] = useState<Kilavuz | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchKilavuz();
  }, []);

  async function fetchKilavuz() {
    try {
      setLoading(true);
      const response = await api.get(`/kilavuzlar/${kilavuzId}`);
      setKilavuz(response.data);
    } catch (error) {
      console.error("Kılavuz detayı alınırken hata:", error);
      Alert.alert("Hata", "Kılavuz bilgisi alınırken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchKilavuz();
    setRefreshing(false);
  };

  // Referans güncelleme işlevi
  function handleUpdateReference(reference: Reference) {
    navigation.navigate("ReferansGuncelleScreen", { kilavuzId, reference });
  }

  // Referans silme işlevi
  async function handleDeleteReference(referenceId: string) {
    Alert.alert(
      "Referans Sil",
      "Bu referansı silmek istediğinize emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Sil",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/kilavuzlar/${kilavuzId}/references/${referenceId}`);
              setKilavuz((prevKilavuz) => ({
                ...prevKilavuz!,
                references: prevKilavuz!.references.filter((ref: Reference) => ref._id !== referenceId),
              }));
              Alert.alert("Başarılı", "Referans silindi.");
            } catch (err) {
              console.error("Referans silinirken hata:", err);
              Alert.alert("Hata", "Referans silinirken bir hata oluştu.");
            }
          },
        },
      ]
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  if (!kilavuz) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Kılavuz bilgisi alınamadı.</Text>
      </View>
    );
  }

  function renderReference({ item }: { item: Reference }) {
    return (
      <TouchableOpacity
        style={styles.referenceCard}
        onPress={() => handlePressReference(item)}
      >
        <View style={styles.referenceHeader}>
          <Ionicons name="calendar-outline" size={20} color="#0066cc" />
          <Text style={styles.referenceTitle}>
            {item.ageMin} - {item.ageMax} Ay
          </Text>
        </View>
        <View style={styles.referenceInfo}>
          {/* Ek bilgi alanları buraya eklenebilir */}
        </View>
        <View style={styles.referenceActions}>
          <TouchableOpacity onPress={() => handleUpdateReference(item)}>
            <Ionicons name="create-outline" size={36} color="#28a745" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDeleteReference(item._id)}>
            <Ionicons name="trash-outline" size={36} color="#dc3545" />
          </TouchableOpacity>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#ccc" style={styles.chevronIcon} />
      </TouchableOpacity>
    );
  }

  function handlePressReference(refItem: Reference) {
    navigation.navigate("ReferansDetay", { reference: refItem , kilavuzId });

  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="book-outline" size={28} color="#fff" />
        <Text style={styles.kilavuzTitle}>{kilavuz.kilavuzAdi}</Text>
      </View>

      <FlatList
        data={kilavuz.references}
        keyExtractor={(ref: Reference) => ref._id}
        renderItem={renderReference}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0066cc']} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="information-circle-outline" size={50} color="#ccc" />
            <Text style={styles.emptyText}>Hiç referans eklenmemiş.</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("ReferansEkleScreen", { kilavuzId })}
      >
        <Ionicons name="add-circle-outline" size={24} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.buttonText}>Yeni Referans Ekle</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f4f7" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f4f7",
  },
  errorText: {
    fontSize: 16,
    color: "#dc3545",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0066cc",
    padding: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  kilavuzTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    marginLeft: 12,
  },
  referenceCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  referenceHeader: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  referenceTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
    color: "#333",
  },
  referenceInfo: {
    // Ek bilgi alanları için boş bırakıldı
    flex: 2,
  },
  referenceActions: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  chevronIcon: {
    marginLeft: 8,
  },
  addButton: {
    flexDirection: "row",
    backgroundColor: "#28a745",
    padding: 16,
    borderRadius: 12,
    margin: 16,
    justifyContent: "center",
    alignItems: "center",

    // Gölge efektleri
    shadowColor: "#28a745",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: "#999",
    marginTop: 12,
  },
});
