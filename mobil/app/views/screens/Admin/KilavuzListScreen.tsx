// KilavuzListScreen.tsx

import React, { useEffect, useState, useCallback, memo } from "react";
import { View, FlatList, StyleSheet, Alert } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import api from "../../../services/api";
import KilavuzCard from "../../components/admin/KilavuzCard";
import AdminHeader from "../../components/admin/AdminHeader";
import LoadingIndicator from "../../components/common/LoadingIndicator";
import EmptyState from "../../components/common/EmptyState";
import AnimatedBottomBar from "../../components/admin/AnimatedBottomBar";

type Kilavuz = {
  _id: string;
  yasAraligi?: string;
  kilavuzAdi?: string;
};

type AdminNavigatorParamList = {
  KilavuzList: undefined;
  KilavuzOlustur: undefined;
  KilavuzDetay: { kilavuzId: string };
};

export default function KilavuzListScreen() {
  const [kilavuzlar, setKilavuzlar] = useState<Kilavuz[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation<NavigationProp<AdminNavigatorParamList>>();

  useEffect(() => {
    fetchKilavuzlar();
  }, []);

  const fetchKilavuzlar = async () => {
    try {
      const response = await api.get("/kilavuzlar");
      setKilavuzlar(response.data);
    } catch (err) {
      console.error("Kılavuzları çekerken hata:", err);
      Alert.alert("Hata", "Kılavuzlar alınırken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteKilavuz = async (kilavuz: Kilavuz) => {
    Alert.alert(
      "Kılavuz Sil",
      `${
        kilavuz.kilavuzAdi || "Bu"
      } kılavuzu silmek istediğinize emin misiniz?`,
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Sil",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/kilavuzlar/${kilavuz._id}`);
              setKilavuzlar((prev) =>
                prev.filter((k) => k._id !== kilavuz._id)
              );
              Alert.alert("Başarılı", "Kılavuz silindi.");
            } catch (err) {
              console.error("Kılavuz silinirken hata:", err);
              Alert.alert("Hata", "Kılavuz silinirken bir hata oluştu.");
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Kilavuz | { _id: "add" } }) => {
    if (item._id === "add") {
      return (
        <KilavuzCard
          isAddCard
          onPress={() => navigation.navigate("KilavuzOlustur")}
        />
      );
    }

    return (
      <KilavuzCard
        kilavuzAdi={(item as Kilavuz).kilavuzAdi}
        onPress={() =>
          navigation.navigate("KilavuzDetay", { kilavuzId: item._id })
        }
        onDelete={() => handleDeleteKilavuz(item as Kilavuz)}
      />
    );
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={[{ _id: "add" }, ...kilavuzlar]}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={<AdminHeader title="Kılavuz Listesi" />}
        ListEmptyComponent={
          <EmptyState
            icon="book-outline"
            message="Henüz hiç kılavuz eklenmemiş"
            description="Yeni bir kılavuz eklemek için + butonuna tıklayın"
          />
        }
      />
      <AnimatedBottomBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f7",
  },
  listContent: {
    padding: 16,
    marginTop: 16,
    paddingBottom: 32,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
});
