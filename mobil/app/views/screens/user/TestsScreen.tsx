import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { TestsStackParamList } from "../../../navigation/TestsNavigator";
import api from "../../../services/api";
import { LineChart } from "react-native-chart-kit";
import DropDownPicker from "react-native-dropdown-picker";
import { Ionicons } from "@expo/vector-icons"; // İkonlar için import

interface Tahlil {
  _id: string;
  kullanici: string;
  tarih: string;
  degerler: {
    IgA: number;
    IgM: number;
    IgG: number;
    IgG1: number;
    IgG2: number;
    IgG3: number;
    IgG4: number;
  };
  createdAt: string;
  updatedAt: string;
}

type TestsScreenNavigationProp = StackNavigationProp<
  TestsStackParamList,
  "TestsHome"
>;

type Props = {
  navigation: TestsScreenNavigationProp;
};

const timeFilters = [
  { key: "today", label: "Bugün" },
  { key: "week", label: "Bu Hafta" },
  { key: "month", label: "Bu Ay" },
  { key: "all", label: "Tüm Zamanlar" },
];

const testKeys = ["IgA", "IgM", "IgG", "IgG1", "IgG2", "IgG3", "IgG4"];

export default function TestsScreen({ navigation }: Props) {
  const [tests, setTests] = useState<Tahlil[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("week"); // Varsayılan olarak "Bu Hafta"
  const [selectedTest, setSelectedTest] = useState<string | null>(null); // Başlangıçta null
  const [open, setOpen] = useState(false); // Dropdown açık mı kapalı mı
  const [userAge, setUserAge] = useState<number | null>(null);

  interface Kilavuz {
    referansDegerler: {
      [key: string]: {
        min: number;
        max: number;
      };
    };
  }

  const [kilavuz, setKilavuz] = useState<Kilavuz | null>(null);
  const [items, setItems] = useState([
    ...testKeys.map((key) => ({ label: key, value: key })),
    { label: "Tüm Değerler", value: "all" },
  ]);

  useEffect(() => {
    fetchTests();
  }, []);

  useEffect(() => {
    const fetchUserAndKilavuz = async () => {
      try {
        // Kullanıcı profilini çek
        const userResponse = await api.get("/users/me");
        const age = userResponse.data.yas;
        setUserAge(age);

        // Yaşa göre kılavuzu çek
        const kilavuzResponse = await api.get(
          `/kilavuzlar/yasaraligi?age=${age}`
        );
        setKilavuz(kilavuzResponse.data);
      } catch (error) {
        console.error("Kullanıcı veya kılavuz getirme hatası:", error);
        Alert.alert("Hata", "Kullanıcı bilgileri veya kılavuz alınamadı.");
      }
    };

    fetchUserAndKilavuz();
  }, []);

  async function handleDeleteTest(testId: string) {
    Alert.alert(
      "Silme İşlemi",
      "Bu tahlili silmek istediğinize emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Sil",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              const response = await api.delete(`/tahliller/${testId}`);
              console.log("Silme API yanıtı:", response.data);

              // Silinen testi state'den kaldır
              setTests((prevTests) =>
                prevTests.filter((test) => test._id !== testId)
              );

              Alert.alert("Başarılı", "Tahlil başarıyla silindi.");
            } catch (err) {
              console.error("Tahlil silinirken hata:", err);
              Alert.alert("Hata", "Tahlil silinirken bir hata oluştu.");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  }

  const fetchTests = async () => {
    try {
      const response = await api.get("/tahliller");
      let fetchedTests: Tahlil[] = response.data;

      // Tarihe göre sırala (en eski en üstte)
      fetchedTests.sort((a, b) => {
        return new Date(a.tarih).getTime() - new Date(b.tarih).getTime();
      });

      fetchedTests.reverse();

      setTests(fetchedTests);
    } catch (error) {
      console.error("Tahlilleri getirirken hata oluştu:", error);
      Alert.alert("Hata", "Tahliller alınırken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const screenWidth = Dimensions.get("window").width - 32;

  // Filtreleme fonksiyonları
  const now = new Date();
  const filteredTests = tests.filter((t) => {
    const testDate = new Date(t.tarih);

    if (selectedFilter === "today") {
      return (
        testDate.getDate() === now.getDate() &&
        testDate.getMonth() === now.getMonth() &&
        testDate.getFullYear() === now.getFullYear()
      );
    } else if (selectedFilter === "week") {
      const diff = now.getTime() - testDate.getTime();
      const diffDays = diff / (1000 * 3600 * 24);
      return diffDays <= 7;
    } else if (selectedFilter === "month") {
      return (
        testDate.getMonth() === now.getMonth() &&
        testDate.getFullYear() === now.getFullYear()
      );
    } else {
      return true;
    }
  });

  let dailyAverages: { date: string; average: number }[] = [];
  let statusText = "";
  let dataValues: number[] = [];
  let labels: string[] = [];

  // "Bugün" filtresi seçiliyse, ortalama yerine tüm tahlilleri tek tek göster
  if (selectedFilter === "today") {
    const testsOfToday = filteredTests;
    if (testsOfToday.length > 0 && selectedTest !== null) {
      // Tek bir test değeri seçilmişse
      if (selectedTest !== "all") {
        dataValues = testsOfToday.map(
          (t) => t.degerler[selectedTest as keyof typeof t.degerler]
        );
        labels = testsOfToday.map((t) => {
          const time = new Date(t.createdAt).toLocaleTimeString("tr-TR", {
            hour: "2-digit",
            minute: "2-digit",
          });
          return time;
        });
      } else {
        // Tüm değerler seçiliyse ortalama al ama günlük ortalama yerine her test için ayrı nokta
        dataValues = testsOfToday.map((t) => {
          const values = Object.values(t.degerler);
          return values.reduce((a, b) => a + b, 0) / values.length;
        });
        labels = testsOfToday.map((t) => {
          const time = new Date(t.createdAt).toLocaleTimeString("tr-TR", {
            hour: "2-digit",
            minute: "2-digit",
          });
          return time;
        });
      }

      // Genel durum için ortalama hesapla
      const averageOfAll =
        dataValues.length > 0
          ? dataValues.reduce((a, b) => a + b, 0) / dataValues.length
          : 0;
      if (averageOfAll < 10) {
        statusText = "Düşük";
      } else if (averageOfAll > 30) {
        statusText = "Yüksek";
      } else {
        statusText = "Normal";
      }
    }
  } else {
    // Diğer filtrelerde (hafta, ay, tüm zamanlar) eski mantık: günlük ortalama
    if (selectedTest !== null && selectedTest !== "all") {
      dailyAverages = calculateDailyAverages(filteredTests, selectedTest);
      dataValues = dailyAverages.map((d) => d.average);
      labels = dailyAverages.map((d) => d.date);

      const averageOfAll =
        dataValues.length > 0
          ? dataValues.reduce((a, b) => a + b, 0) / dataValues.length
          : 0;
      if (averageOfAll < 10) {
        statusText = "Düşük";
      } else if (averageOfAll > 30) {
        statusText = "Yüksek";
      } else {
        statusText = "Normal";
      }
    } else if (selectedTest === "all") {
      dailyAverages = calculateDailyAveragesAll(filteredTests);
      dataValues = dailyAverages.map((d) => d.average);
      labels = dailyAverages.map((d) => d.date);

      const averageOfAll =
        dataValues.length > 0
          ? dataValues.reduce((a, b) => a + b, 0) / dataValues.length
          : 0;
      if (averageOfAll < 10) {
        statusText = "Düşük";
      } else if (averageOfAll > 30) {
        statusText = "Yüksek";
      } else {
        statusText = "Normal";
      }
    }
  }

  // Fonksiyonlar
  function calculateDailyAverages(
    tests: Tahlil[],
    testKey: string
  ): { date: string; average: number }[] {
    const groupedByDay: { [key: string]: number[] } = {};

    tests.forEach((t) => {
      const d = new Date(t.tarih);
      const dayStr = d.toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
      });
      if (!groupedByDay[dayStr]) {
        groupedByDay[dayStr] = [];
      }
      groupedByDay[dayStr].push(t.degerler[testKey as keyof typeof t.degerler]);
    });

    const averages: { date: string; average: number }[] = [];
    for (const day in groupedByDay) {
      const vals = groupedByDay[day];
      const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
      averages.push({ date: day, average: avg });
    }

    // Tarihe göre sıralama (en eski tarih başa gelsin)
    averages.sort((a, b) => {
      const dateA = new Date(a.date + " " + now.getFullYear());
      const dateB = new Date(b.date + " " + now.getFullYear());
      return dateA.getTime() - dateB.getTime();
    });

    return averages;
  }

  function calculateDailyAveragesAll(
    tests: Tahlil[]
  ): { date: string; average: number }[] {
    const groupedByDay: { [key: string]: number[] } = {};

    tests.forEach((t) => {
      const d = new Date(t.tarih);
      const dayStr = d.toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
      });
      if (!groupedByDay[dayStr]) {
        groupedByDay[dayStr] = [];
      }
      const values = Object.values(t.degerler);
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      groupedByDay[dayStr].push(avg);
    });

    const averages: { date: string; average: number }[] = [];
    for (const day in groupedByDay) {
      const vals = groupedByDay[day];
      const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
      averages.push({ date: day, average: avg });
    }

    averages.sort((a, b) => {
      const dateA = new Date(a.date + " " + now.getFullYear());
      const dateB = new Date(b.date + " " + now.getFullYear());
      return dateA.getTime() - dateB.getTime();
    });

    return averages;
  }

  // Trend hesaplaması yapan fonksiyon
  const getTrendIcon = (currentValue: number, previousValue: number | null) => {
    if (previousValue === null) {
      // Önceki test yoksa sabit (↔)
      return (
        <Ionicons
          name="swap-horizontal-outline"
          size={20}
          color="#555"
          style={{ marginLeft: 4 }}
        />
      );
    }
    if (currentValue > previousValue) {
      return (
        <Ionicons
          name="arrow-up-circle-outline"
          size={20}
          color="#3F51B5" // Renk değiştirildi
          style={{ marginLeft: 4 }}
        />
      );
    } else if (currentValue < previousValue) {
      return (
        <Ionicons
          name="arrow-down-circle-outline"
          size={20}
          color="#3F51B5" // Renk değiştirildi
          style={{ marginLeft: 4 }}
        />
      );
    } else {
      return (
        <Ionicons
          name="remove-circle-outline"
          size={20}
          color="#555"
          style={{ marginLeft: 4 }}
        />
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (tests.length === 0) {
    return (
      <View style={styles.centered}>
        <Ionicons name="information-circle-outline" size={50} color="#666" />
        <Text style={styles.noDataText}>Henüz tahlil bulunmamaktadır.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="analytics-outline" size={28} color="#fff" />
        <Text style={styles.headerTitle}>Tahlil Yönetimi</Text>
      </View>

      {/* Zaman filtresi butonları */}
      <View style={styles.filterContainer}>
        {timeFilters.map((tf) => (
          <TouchableOpacity
            key={tf.key}
            style={[
              styles.filterButton,
              selectedFilter === tf.key && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedFilter(tf.key)}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedFilter === tf.key && styles.filterButtonTextActive,
              ]}
            >
              {tf.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Dropdown Menü */}
      <View style={styles.dropdownContainer}>
        <Text style={styles.dropDownLabel}>Tahlil Seçiniz:</Text>
        <DropDownPicker
          open={open}
          value={selectedTest}
          items={items}
          setOpen={setOpen}
          setValue={setSelectedTest}
          setItems={setItems}
          placeholder="Bir tahlil seçiniz..."
          style={styles.dropDown}
          dropDownContainerStyle={styles.dropDownContainer}
          labelStyle={styles.dropDownLabel}
          selectedItemLabelStyle={styles.dropDownSelectedLabel}
          arrowIconStyle={styles.arrowIcon}
          tickIconStyle={styles.tickIcon}
          zIndex={1000} // DropDownPicker için zIndex ayarı
        />
      </View>

      {/* Grafik alanı */}
      <View style={styles.chartContainer}>
        {dataValues.length > 0 ? (
          <LineChart
            data={{
              labels: labels,
              datasets: [
                {
                  data: dataValues.filter((val) => !isNaN(val)), // NaN filtreleme
                  color: (opacity = 1) => `rgba(0, 102, 204, ${opacity})`,
                  strokeWidth: 2,
                },
              ],
            }}
            width={screenWidth}
            height={220}
            yAxisSuffix=""
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
              backgroundColor: "#ffffff",
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              decimalPlaces: 1, // sayının ondalık basamak sayısı
              color: (opacity = 1) => `rgba(0, 102, 204, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "4",
                strokeWidth: "2",
                stroke: "#ff9800", // Turuncu renk
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        ) : (
          <Text style={styles.noDataText}>Bu filtre için veri bulunamadı.</Text>
        )}
      </View>

      {/* Genel durum bildirimi */}
      {dataValues.length > 0 && (
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryText}>
            {selectedTest !== "all" ? `${selectedTest}` : "Tüm Değerler"}{" "}
            değeriniz genel olarak:{" "}
            <Text
              style={{
                color:
                  statusText === "Düşük"
                    ? "#dc3545"
                    : statusText === "Yüksek"
                    ? "#28a745"
                    : "#3F51B5",
                fontWeight: "bold",
              }}
            >
              {statusText}
            </Text>
          </Text>
        </View>
      )}

      {/* Detaylı Liste (Filtrelenen testleri göster) */}
      {filteredTests.map((item, index) => {
        const date = new Date(item.tarih);
        const dayAndMonth = date.toLocaleDateString("tr-TR", {
          day: "numeric",
          month: "long",
        });
        const time = new Date(item.createdAt).toLocaleTimeString("tr-TR", {
          hour: "2-digit",
          minute: "2-digit",
        });

        let trendSymbol = "↔";
        let trendColor = "#555";

        // Dinamik değer kontrolü
        let currentValue: number | null = null;
        if (selectedTest && selectedTest !== "all") {
          // Eğer değer tanımlıysa, kullan; değilse null olarak ayarla
          currentValue =
            item.degerler?.[selectedTest as keyof typeof item.degerler] ?? null;
        } else {
          // Tüm değerler seçiliyse, ortalamayı al
          const vals = Object.values(item.degerler || {});
          currentValue =
            vals.length > 0
              ? vals.reduce((a, b) => a + b, 0) / vals.length
              : null;
        }

        // Bir sonraki test değeri varsa karşılaştırma yap
        if (index < filteredTests.length - 1) {
          const nextTest = filteredTests[index + 1];
          let nextValue: number;
          if (selectedTest && selectedTest !== "all") {
            nextValue =
              nextTest.degerler[selectedTest as keyof typeof nextTest.degerler];
          } else {
            const vals = Object.values(nextTest.degerler);
            nextValue = vals.reduce((a, b) => a + b, 0) / vals.length;
          }

          if (currentValue !== null && currentValue > nextValue) {
            trendSymbol = "↑"; // Artış
            trendColor = "#3F51B5"; // Yeni renk
          } else if (currentValue !== null && currentValue < nextValue) {
            trendSymbol = "↓"; // Azalış
            trendColor = "#3F51B5"; // Yeni renk
          } else {
            trendSymbol = "↔";
            trendColor = "#1E88E5"; // Mavi-Gri
          }
        }

        return (
          <View key={item._id} style={styles.item}>
            <View style={styles.itemHeader}>
              <Text style={styles.dateText}>{dayAndMonth}</Text>
              <Text style={styles.timeText}>{time}</Text>
            </View>

            <View style={styles.itemContent}>
              <View style={styles.valueContainer}>
                <Ionicons name="analytics-outline" size={20} color="#000" />
                {currentValue !== null ? (
                  <Text style={styles.valueText}>
                    {selectedTest && selectedTest !== "all"
                      ? `${selectedTest}: ${currentValue.toFixed(1)} g/l`
                      : `Ortalama: ${currentValue.toFixed(1)} g/l`}
                  </Text>
                ) : (
                  <Text style={[styles.valueText, { color: "#999" }]}>
                    {selectedTest && selectedTest !== "all"
                      ? `${selectedTest}: Değer mevcut değil`
                      : "Ortalama hesaplanamadı"}
                  </Text>
                )}
              </View>
              {getTrendIcon(
                currentValue ?? 0,
                index < filteredTests.length - 1
                  ? filteredTests[index + 1].degerler[
                      selectedTest as keyof Tahlil["degerler"]
                    ] ?? null
                  : null
              )}
            </View>

            <View style={styles.cardButtonsContainer}>
              {/* Tahlil Görüntüle Butonu */}
              <TouchableOpacity
                style={styles.viewButton}
                onPress={() =>
                  navigation.navigate("TestDetails", { testId: item._id })
                }
                accessibilityLabel="Tahlili Görüntüle"
              >
                <Ionicons
                  name="eye-outline"
                  size={20}
                  color="#fff"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.viewButtonText}>Görüntüle</Text>
              </TouchableOpacity>

              {/* Tahlil Sil Butonu */}
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteTest(item._id)}
                accessibilityLabel="Tahlili Sil"
              >
                <Ionicons name="trash-outline" size={20} color="#fff" />
                <Text style={styles.deleteButtonText}>Sil</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f7",
  },
  contentContainer: {
    paddingBottom: 20, // Alt kısımda boşluk bırakmak için
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3F51B5", // Header arka plan rengini #3F51B5 yaptık
    padding: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
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
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 16,
    marginBottom: 16,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  filterButtonActive: {
    backgroundColor: "#3F51B5", // Aktif filtre butonunun arka plan rengini #3F51B5 yaptık
  },
  filterButtonText: {
    color: "#333",
    fontWeight: "600",
  },
  filterButtonTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
  dropdownContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    zIndex: 1000, // DropDownPicker için zIndex ayarı
  },
  dropDown: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
  },
  dropDownContainer: {
    backgroundColor: "#fff",
    maxHeight: 400,
    borderColor: "#ccc",
  },
  dropDownLabel: {
    color: "#333",
    fontSize: 16,
    marginBottom: 8,
  },
  dropDownSelectedLabel: {
    color: "#000",
    fontWeight: "bold",
  },
  arrowIcon: {
    width: 20,
    height: 20,
    tintColor: "#333",
  },
  tickIcon: {
    width: 20,
    height: 20,
    tintColor: "#000",
  },
  chartContainer: {
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  summaryText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  item: {
    backgroundColor: "#fff",
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  dateText: {
    fontSize: 20,
    color: "#333",
    fontWeight: "bold",
  },
  timeText: {
    fontSize: 18,
    color: "#666",
  },
  itemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  valueText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 8,
  },
  trendSymbol: {
    fontSize: 20,
    fontWeight: "bold",
  },
  cardButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  viewButton: {
    flexDirection: "row",
    backgroundColor: "#ff9800", // Görüntüle butonu rengi sabit kalacak
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginRight: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  viewButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  deleteButton: {
    flexDirection: "row",
    backgroundColor: "#3F51B5", // Sil butonu arka plan rengini #3F51B5 yaptık
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginLeft: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 4,
  },
  noDataText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f4f7",
    padding: 16,
  },
});
