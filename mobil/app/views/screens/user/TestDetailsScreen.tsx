import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { TestsStackParamList } from "../../../navigation/TestsNavigator";
import api from "../../../services/api";
import { Ionicons } from "@expo/vector-icons";

type Props = StackScreenProps<TestsStackParamList, "TestDetails">;

interface Tahlil {
  _id: string;
  tarih: string;
  degerler: {
    [key: string]: number | undefined;
    IgA?: number;
    IgM?: number;
    IgG?: number;
    IgG1?: number;
    IgG2?: number;
    IgG3?: number;
    IgG4?: number;
  };
  createdAt: string;
  updatedAt: string;
  kullanici: string;
}

export default function TestDetailsScreen({ route }: Props) {
  const { testId } = route.params;
  const [testDetails, setTestDetails] = useState<Tahlil | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Edit mode
  const [editMode, setEditMode] = useState<boolean>(false);

  // Değerler (string)
  const [values, setValues] = useState<{ [key: string]: string }>({});

  // Previous test for trend calculation
  const [previousTest, setPreviousTest] = useState<Tahlil | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Tüm testleri çek
      const allTestsResponse = await api.get("/tahliller");
      const allTests: Tahlil[] = allTestsResponse.data;

      // Testleri tarihe göre sırala (en eski en başta)
      allTests.sort(
        (a, b) => new Date(a.tarih).getTime() - new Date(b.tarih).getTime()
      );

      // Mevcut test ve bir önceki testi bul
      const currentTestIndex = allTests.findIndex(
        (test) => test._id === testId
      );
      if (currentTestIndex === -1) {
        throw new Error("Test bulunamadı.");
      }

      const currentTest = allTests[currentTestIndex];
      const prevTest =
        currentTestIndex > 0 ? allTests[currentTestIndex - 1] : null;

      setTestDetails(currentTest);
      setPreviousTest(prevTest);

      // Mevcut degerler -> string'e çevir
      const newVals: { [key: string]: string } = {};
      Object.keys(currentTest.degerler).forEach((key) => {
        newVals[key] = currentTest.degerler[key]?.toString() || "";
      });
      setValues(newVals);
    } catch (error) {
      Alert.alert("Hata", "Test detayları alınırken bir hata oluştu.");
      console.error("Verileri getirirken hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  };

  // Tek bir Ig alanını silmek
  const handleDeleteImmunoglobulin = (igKey: string) => {
    Alert.alert(
      `${igKey} Değerini Sil`,
      `Bu değeri silmek istediğinize emin misiniz?`,
      [
        { text: "Vazgeç", style: "cancel" },
        {
          text: "Sil",
          style: "destructive",
          onPress: async () => {
            if (!testDetails) return;

            // Yeni degerler objesi oluştur
            let newDegerler = { ...testDetails.degerler };
            delete newDegerler[igKey]; // IgA vs. sil
            if (!Object.keys(newDegerler).length) {
              // Keep as empty object instead of undefined
              newDegerler = {};
            }

            try {
              // Sunucuya PUT isteği: degerler alanını güncellenmiş gönder
              const payload = {
                tarih: testDetails.tarih,
                degerler: newDegerler,
              };

              const res = await api.put(`/tahliller/${testId}`, payload);
              // Ekrandaki state'i güncelle
              setTestDetails(res.data.tahlil);

              // Edit mode'daki values'tan da silmek istersek:
              const newValues = { ...values };
              delete newValues[igKey];
              setValues(newValues);

              Alert.alert("Başarılı", `${igKey} değeri silindi.`);
            } catch (err) {
              Alert.alert("Hata", "Değer silinirken bir sorun oluştu.");
              console.error(err);
            }
          },
        },
      ]
    );
  };

  // Kaydet (editMode'dan)
  const handleSave = async () => {
    if (!testDetails) return;

    // Değerleri parse et
    const newDegerler: { [key: string]: number } = {};
    Object.keys(values).forEach((k) => {
      const numVal = parseFloat(values[k]);
      if (!isNaN(numVal)) {
        newDegerler[k] = numVal;
      }
    });

    const payload = {
      tarih: testDetails.tarih, // Tarihi değişmiyorsa aynı
      degerler: newDegerler,
    };

    try {
      const res = await api.put(`/tahliller/${testId}`, payload);
      Alert.alert("Başarılı", "Tahlil güncellendi.");
      setTestDetails(res.data.tahlil);

      // Edit mode kapat
      setEditMode(false);
    } catch (err) {
      Alert.alert("Hata", "Tahlil güncellenirken bir sorun oluştu.");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3F51B5" />
      </View>
    );
  }

  if (!testDetails) {
    return (
      <View style={styles.centered}>
        <Ionicons name="warning-outline" size={50} color="#dc3545" />
        <Text style={styles.errorText}>Test detayları bulunamadı.</Text>
      </View>
    );
  }

  const immunoKeys = Object.keys(testDetails.degerler || {}); // (IgA, IgM, vs.)
  const testDateStr = new Date(testDetails.tarih).toLocaleString("tr-TR");

  // Trend Hesaplama Fonksiyonu
  const getTrend = (key: string): "up" | "down" | "same" | null => {
    if (!previousTest || previousTest.degerler[key] === undefined) {
      return null;
    }

    const currentVal = testDetails.degerler[key];
    const prevVal = previousTest.degerler[key];

    if (currentVal === undefined || prevVal === undefined) {
      return null;
    }

    if (currentVal > prevVal) {
      return "up";
    } else if (currentVal < prevVal) {
      return "down";
    } else {
      return "same";
    }
  };

  // Trend İkonu Alma Fonksiyonu
  const getTrendIcon = (trend: "up" | "down" | "same" | null) => {
    switch (trend) {
      case "up":
        return (
          <Ionicons name="arrow-up-circle-outline" size={36} color="#B71C1C" />
        );
      case "down":
        return (
          <Ionicons
            name="arrow-down-circle-outline"
            size={36}
            color="#4CAF50"
          />
        );
      case "same":
        return (
          <Ionicons name="swap-horizontal-outline" size={36} color="#2196F3" />
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Ionicons name="document-text-outline" size={28} color="#fff" />
        <Text style={styles.headerTitle}>Test Detayı</Text>
      </View>

      {/* Tarih bilgisi */}
      <View style={styles.infoCard}>
        <Text style={styles.infoText}>Tarih: {testDateStr}</Text>
      </View>

      {/* DEĞERLER */}
      {immunoKeys.map((key, idx) => {
        const trend = getTrend(key);
        const trendIcon = getTrendIcon(trend);

        if (!editMode) {
          // Normal görüntü
          return (
            <View key={idx} style={styles.rowCard}>
              <View style={styles.rowContent}>
                <Text style={styles.igLabel}>{key}</Text>
                <Text style={styles.igValue}>
                  {testDetails.degerler[key]} g/l
                </Text>
              </View>

              {/* Trend İkonu */}
              {trendIcon}

              {/* Tek değer silme ikonu */}
              <TouchableOpacity onPress={() => handleDeleteImmunoglobulin(key)}>
                <Ionicons name="trash-outline" size={36} color="#3F51B5" />
              </TouchableOpacity>
            </View>
          );
        } else {
          // Edit mode -> TextInput
          return (
            <View key={idx} style={styles.editRow}>
              <Text style={styles.editLabel}>{key}:</Text>
              <TextInput
                style={styles.editInput}
                keyboardType="numeric"
                value={values[key]}
                onChangeText={(val) =>
                  setValues((prev) => ({ ...prev, [key]: val }))
                }
              />
              {/* Trend İkonu */}
              {trendIcon}

              {/* Sil butonu */}
              <TouchableOpacity onPress={() => handleDeleteImmunoglobulin(key)}>
                <Ionicons name="trash-outline" size={24} color="#3F51B5" />
              </TouchableOpacity>
            </View>
          );
        }
      })}

      {/* Aşağıda “Düzenle” - “Kaydet/Vazgeç” butonları */}
      {!editMode ? (
        // Düzenle butonu
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.editButton]}
            onPress={() => setEditMode(true)}
          >
            <Ionicons
              name="create-outline"
              size={24}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.buttonText}>Düzenle</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Kaydet / Vazgeç butonları
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={handleSave}
          >
            <Ionicons
              name="save-outline"
              size={20}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.buttonText}>Kaydet</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => {
              setEditMode(false);
              // Değerleri geri yükleyelim
              const revertVals: { [key: string]: string } = {};
              Object.keys(testDetails.degerler).forEach((k) => {
                revertVals[k] = testDetails.degerler[k]?.toString() || "";
              });
              setValues(revertVals);
            }}
          >
            <Ionicons
              name="close-circle-outline"
              size={20}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.buttonText}>Vazgeç</Text>
          </TouchableOpacity>
        </View>
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
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3F51B5", // Header arka plan rengini #3F51B5 yaptık
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
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
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  infoText: {
    fontSize: 20,
    color: "#333",
    marginBottom: 4,
  },
  rowCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    justifyContent: "space-between",
  },
  rowContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  igLabel: {
    fontSize: 20,
    fontWeight: "600",
    color: "#3F51B5", // IgA vs. label rengini #3F51B5 yaptık
    marginRight: 24,
  },
  igValue: {
    fontSize: 20,
    color: "#555",
  },
  editRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  editLabel: {
    fontSize: 20,
    fontWeight: "600",
    color: "#3F51B5", // IgA vs. label rengini #3F51B5 yaptık
    width: 60,
  },
  editInput: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 20,
    marginRight: 12,
  },
  buttonContainer: {
    width: "100%", // Buton container'ının tüm genişliği kaplaması
    alignItems: "stretch", // Butonun genişlemeye izin vermesi
    marginTop: 8,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: "100%", // Butonun tüm genişliği kaplaması
    justifyContent: "center", // İçeriğin ortalanması
  },
  editButton: {
    backgroundColor: "#3F51B5", // Düzenle butonu arka plan rengini #3F51B5 yaptık
  },
  saveButton: {
    backgroundColor: "#3F51B5", // Kaydet butonu yeşil
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  cancelButton: {
    backgroundColor: "#F44336", // Vazgeç butonu gri
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    marginLeft: 8,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#fff",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
});
