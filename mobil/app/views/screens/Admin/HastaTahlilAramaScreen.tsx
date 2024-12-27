import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  FlatList,
} from "react-native";
import api from "../../../services/api";
import { useNavigation } from "@react-navigation/native";
import { AdminStackParamList } from "../../../navigation/AdminNavigator";
import { StackNavigationProp } from "@react-navigation/stack";
import DropDownPicker from "react-native-dropdown-picker";
import { Ionicons } from "@expo/vector-icons";
import FilterButtons from "../../components/FilterButtons";
import SearchBox from "../../../views/components/SearchBox";
import ResultCard from "../../../views/components/ResultCard";
import AnimatedBottomBar from "../../components/admin/AnimatedBottomBar";
import AdminHeader from "../../components/admin/AdminHeader";

type AdminNavigationProp = StackNavigationProp<
  AdminStackParamList,
  "AdminTabs"
>;

interface User {
  _id: string;
  isim: string;
  soyisim: string;
  yasAy: number;
}

interface Tahlil {
  _id: string;
  tarih: string;
  degerler: { [key: string]: number };
  trend?: { [key: string]: string };
  yasAy: number;
}

const statusColors = {
  up: "#F44336",     // Kırmızı
  down: "#4CAF50",   // Yeşil
  same: "#1E88E5",   // Mavi
};

const TABLE_HEADERS = ["Tarih", "Mevcut", "Önceki", "Durum"];

const Tablo = ({
  sortedTahliller,
  selectedTest,
}: {
  sortedTahliller: Tahlil[];
  selectedTest: string;
}) => {
  const renderHeader = () => (
    <View style={styles.tableHeader}>
      {TABLE_HEADERS.map((header, index) => (
        <View key={index} style={styles.headerCell}>
          <Text style={styles.headerText}>{header}</Text>
        </View>
      ))}
    </View>
  );

  const renderItem = ({ item, index }: { item: Tahlil; index: number }) => {
    const dateObj = new Date(item.tarih);
    const tarihStr = dateObj.toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const mevcutDeger = item.degerler[selectedTest];
    const mevcutDegerStr = mevcutDeger != null ? mevcutDeger : "-";

    let oncekiDegerStr = "-";
    let durum: keyof typeof statusColors = "same";

    if (index < sortedTahliller.length - 1) {
      // Listenin son elemanı değilse, bir sonraki tahlil ile karşılaştır
      const onceki = sortedTahliller[index + 1].degerler[selectedTest];
      oncekiDegerStr = onceki != null ? onceki.toString() : "-";

      if (mevcutDeger != null && onceki != null) {
        if (mevcutDeger > onceki) durum = "up";
        else if (mevcutDeger < onceki) durum = "down";
        else durum = "same";
      } else {
        durum = "same";
      }
    }

    return (
      <View
        style={[
          styles.tableRow,
          index % 2 === 0 ? styles.evenRow : styles.oddRow,
        ]}
      >
        <View style={styles.cell}>
          <Text style={styles.cellText}>{tarihStr}</Text>
        </View>
        <View style={styles.cell}>
          <Text style={styles.cellText}>{mevcutDegerStr}</Text>
        </View>
        <View style={styles.cell}>
          <Text style={styles.cellText}>{oncekiDegerStr}</Text>
        </View>
        <View style={styles.cell}>
          <Ionicons
            name={
              durum === "up"
                ? "arrow-up-circle"
                : durum === "down"
                ? "arrow-down-circle"
                : "swap-horizontal"
            }
            size={20}
            color={statusColors[durum]}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.tableContainer}>
      {renderHeader()}
      <FlatList
        data={sortedTahliller}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <Text style={styles.noDataText}>Veri bulunamadı.</Text>
        }
        scrollEnabled={false}
      />
    </View>
  );
};

export default function HastaTahlilAramaScreen() {
  const [searchText, setSearchText] = useState("");
  const navigation = useNavigation<AdminNavigationProp>();

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [tahliller, setTahliller] = useState<Tahlil[]>([]);
  const [loading, setLoading] = useState(false);

  const [kilavuzlar, setKilavuzlar] = useState<any[]>([]);

  const timeFilters = [
    { key: "week", label: "Bu Hafta" },
    { key: "month", label: "Bu Ay" },
    { key: "all", label: "Tüm Zamanlar" },
  ];
  const [selectedFilter, setSelectedFilter] = useState("week");
  const testKeys = ["IgA", "IgM", "IgG", "IgG1", "IgG2", "IgG3", "IgG4"];
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    ...testKeys.map((key) => ({ label: key, value: key })),
    { label: "Tüm Değerler", value: "all" },
  ]);

  useEffect(() => {
    fetchKilavuzlar();
  }, []);

  const fetchKilavuzlar = async () => {
    try {
      const res = await api.get("/kilavuzlar");
      setKilavuzlar(res.data);
    } catch (error) {
      console.error("Kılavuzları getirirken hata:", error);
      Alert.alert("Hata", "Kılavuzlar alınırken bir hata oluştu.");
    }
  };

  const handleSearch = async () => {
    if (searchText.trim().length === 0) {
      setUsers([]);
      return;
    }

    setLoading(true);
    try {
      const parts = searchText.trim().split(" ");
      let isim = "";
      let soyisim = "";
      if (parts.length === 1) {
        isim = parts[0];
      } else if (parts.length > 1) {
        isim = parts[0];
        soyisim = parts.slice(1).join(" ");
      }

      const response = await api.get(
        `/admin/users/search?isim=${encodeURIComponent(
          isim
        )}&soyisim=${encodeURIComponent(soyisim)}`
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Kullanıcı arama hatası:", error);
      Alert.alert("Hata", "Kullanıcı aranırken hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch();
    }, 300); // 300ms gecikme

    return () => clearTimeout(delayDebounceFn);
  }, [searchText]);

  const handleSelectUser = async (user: User) => {
    setSelectedUser(user);
    setSearchText(`${user.isim} ${user.soyisim}`.trim());
    setUsers([]);
    setLoading(true);
    try {
      const res = await api.get(`/tahliller/user/${user._id}`); // Güncellenmiş endpoint
      setTahliller(res.data);
    } catch (error) {
      console.error("Tahlil getirme hatası:", error);
      Alert.alert("Hata", "Tahliller getirilirken hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const calculateTrends = (tests: Tahlil[]) => {
    if (tests.length === 0) return [];
    return tests.map((tahlil, index) => {
      if (index === tests.length - 1) {
        // Listenin son elemanı için trend sembolü sabit
        return {
          ...tahlil,
          trend: {
            IgA: "same",
            IgM: "same",
            IgG: "same",
            IgG1: "same",
            IgG2: "same",
            IgG3: "same",
            IgG4: "same",
          },
        };
      } else {
        const next = tests[index + 1];
        const trend: { [key: string]: string } = {};
        const keys = ["IgA", "IgM", "IgG", "IgG1", "IgG2", "IgG3", "IgG4"];
        const calcTrend = (current: number, next: number) => {
          if (current > next) return "up";
          else if (current < next) return "down";
          else return "same";
        };
        keys.forEach((k) => {
          const current = tahlil.degerler[k];
          const previous = next.degerler[k];
          trend[k] = calcTrend(current, previous);
          console.log(`Trend for ${k} at index ${index}: ${trend[k]}`);
        });
        return { ...tahlil, trend };
      }
    });
  };

  const tahlillerWithTrend = calculateTrends(tahliller);

  const now = new Date();
  const filteredTahliller = tahlillerWithTrend.filter((t) => {
    const testDate = new Date(t.tarih);
    if (selectedFilter === "week") {
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

  // Sıralamayı büyük tarihli (en yeni) yapıyoruz
  const sortedTahliller = [...filteredTahliller].sort(
    (a, b) => new Date(b.tarih).getTime() - new Date(a.tarih).getTime()
  );

  const evaluateValueAcrossKilavuzlar = (
    kilavuzlarData: any[],
    userAy: number,
    testKey: string,
    userValue: number
  ) => {
    const results: {
      kilavuzAdi: string;
      resultSymbol: string;
      ageRange: string;
      found: boolean;
    }[] = [];

    kilavuzlarData.forEach((kilavuz) => {
      const refObj = kilavuz.references.find(
        (r: any) => userAy >= r.ageMin && userAy <= r.ageMax
      );
      
      if (!refObj) return;

      // Referans değerini kontrol et
      const testRef = refObj[testKey];
      // Referans değeri yoksa, bu kılavuzu sonuçlara ekleme
      if (!testRef || !testRef.min || !testRef.max) {
        return;
      }

      // Değer karşılaştırması
      let resultSymbol = "same";
      if (userValue < testRef.min) resultSymbol = "down";
      else if (userValue > testRef.max) resultSymbol = "up";

      results.push({
        kilavuzAdi: kilavuz.kilavuzAdi,
        resultSymbol,
        ageRange: `${refObj.ageMin}-${refObj.ageMax}`,
        found: true
      });
    });

    return results;
  };

  const calculateDailyAverages = (
    tests: Tahlil[],
    testKey: string
  ): { date: string; average: number }[] => {
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
      groupedByDay[dayStr].push(t.degerler[testKey]);
    });

    const averages: { date: string; average: number }[] = [];
    for (const day in groupedByDay) {
      const vals = groupedByDay[day];
      const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
      averages.push({ date: day, average: avg });
    }

    averages.sort((a, b) => {
      const dateA = new Date(`${a.date} ${now.getFullYear()}`);
      const dateB = new Date(`${b.date} ${now.getFullYear()}`);
      return dateA.getTime() - dateB.getTime();
    });
    return averages;
  };

  const calculateDailyAveragesAll = (
    tests: Tahlil[]
  ): { date: string; average: number }[] => {
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
      const dateA = new Date(`${a.date} ${now.getFullYear()}`);
      const dateB = new Date(`${b.date} ${now.getFullYear()}`);
      return dateA.getTime() - dateB.getTime();
    });
    return averages;
  };

  let dailyAverages: { date: string; average: number }[] = [];
  let dataValues: number[] = [];
  let labels: string[] = [];
  let statusText = "";

  if (selectedTest && sortedTahliller.length > 0) {
    if (selectedTest !== "all") {
      dailyAverages = calculateDailyAverages(sortedTahliller, selectedTest);
    } else {
      dailyAverages = calculateDailyAveragesAll(sortedTahliller);
    }
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

  const safeDataValues = dataValues.map((val) => {
    if (typeof val !== "number" || isNaN(val)) {
      return 0; // veya dilediğiniz fallback değer
    }
    return val;
  });

  const screenWidth = Dimensions.get("window").width - 32;

  const handleDeleteTahlil = async (tahlilId: string) => {
    Alert.alert("Tahlil Sil", "Bu tahlili silmek istediğinize emin misiniz?", [
      {
        text: "İptal",
        style: "cancel",
      },
      {
        text: "Sil",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/tahliller/${tahlilId}`);
            setTahliller((prevTahliller) =>
              prevTahliller.filter((t) => t._id !== tahlilId)
            );
            Alert.alert("Başarılı", "Tahlil başarıyla silindi.");
          } catch (error: any) {
            console.error("Tahlil silme hatası:", error);
            Alert.alert(
              "Hata",
              error.response?.data?.message ||
                "Tahlil silinirken bir hata oluştu."
            );
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        <AdminHeader title="Hasta Tahlil Arama" />

        <SearchBox
          searchText={searchText}
          setSearchText={setSearchText}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          loading={loading}
          users={users}
          handleSelectUser={handleSelectUser}
        />

        {/* Kullanıcı seçildiyse ve Tahliller mevcutsa */}
        {selectedUser && sortedTahliller.length > 0 && (
          <View>
            {/* Zaman filtreleri */}
            <FilterButtons
              timeFilters={timeFilters}
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
            />

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
                dropDownContainerStyle={styles.dropDownInnerContainer}
                labelStyle={styles.dropDownLabelStyle}
                selectedItemLabelStyle={styles.dropDownSelectedLabel}
                arrowIconStyle={styles.arrowIcon}
                tickIconStyle={styles.tickIcon}
              />
            </View>

            {/* Tablo */}
            {selectedTest && sortedTahliller.length > 0 && (
              <ScrollView horizontal style={{ marginTop: 8 }}>
                <Tablo
                  sortedTahliller={sortedTahliller}
                  selectedTest={selectedTest}
                />
              </ScrollView>
            )}

            {/* Detaylı Kartlar */}
            <View style={{ marginTop: 16 }}>
              {sortedTahliller.map((item, index) => {
                const testValue =
                  selectedTest && selectedTest !== "all"
                    ? item.degerler[selectedTest]
                    : null;

                let kilavuzDegerlendirmesi = [];

                if (
                  selectedTest &&
                  selectedTest !== "all" &&
                  testValue != null
                ) {
                  kilavuzDegerlendirmesi = evaluateValueAcrossKilavuzlar(
                    kilavuzlar,
                    selectedUser.yasAy, // kullanıcının ay cinsinden yaşı
                    selectedTest, // örn. "IgA"
                    testValue // örn. 3.0
                  );
                }

                let trendSymbol = "same";
                let trendColor = "#555";
                if (index < sortedTahliller.length - 1) {
                  // Listenin son elemanı değilse, bir sonraki tahlil ile karşılaştır
                  const next = sortedTahliller[index + 1];
                  const currentValue =
                    selectedTest && selectedTest !== "all"
                      ? item.degerler[selectedTest]
                      : 0;
                  const nextValue =
                    selectedTest && selectedTest !== "all"
                      ? next.degerler[selectedTest]
                      : 0;
                  if (currentValue > nextValue) {
                    trendSymbol = "up";
                    trendColor = "#dc3545"; // Kırmızı
                  } else if (currentValue < nextValue) {
                    trendSymbol = "down";
                    trendColor = "#28a745"; // Yeşil
                  }
                }

                const displayValue =
                  selectedTest && selectedTest !== "all"
                    ? `${selectedTest}: ${
                        testValue != null ? testValue : "-"
                      }`
                    : "Ortalama: 0.0";

                return (
                  <ResultCard
                    key={item._id}
                    item={item}
                    selectedTest={selectedTest}
                    navigation={navigation}
                    kilavuzDegerlendirmesi={kilavuzDegerlendirmesi}
                    trendSymbol={trendSymbol}
                    trendColor={trendColor}
                    displayValue={displayValue}
                    onDelete={handleDeleteTahlil} // Silme fonksiyonunu geçiriyoruz
                  />
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>
      <AnimatedBottomBar />
    </View>
  );
}

const screenWidth = Dimensions.get("window").width - 32;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f7",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    marginTop: 16,
  },
  dropdownContainer: {
    marginBottom: 16,
    zIndex: 1000, // DropDownPicker için z-index ayarı
  },
  dropDown: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
  },
  dropDownInnerContainer: {
    backgroundColor: "#fff",
    maxHeight: 400,
    borderColor: "#ccc",
  },
  dropDownLabel: {
    fontSize: 16,
    marginBottom: 4,
    color: "#333",
  },
  dropDownLabelStyle: {
    color: "#333",
    fontSize: 16,
  },
  dropDownSelectedLabel: {
    color: "#0066cc",
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
    tintColor: "#0066cc",
  },
  chartContainer: {
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  noDataText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginVertical: 8,
  },
  tableContainer: {
    marginTop: 16,
    backgroundColor: "#fff",
    width: screenWidth,
    borderRadius: 8,
    overflow: "hidden",
    elevation: 4, // Android için gölge
    shadowColor: "#000", // iOS için gölge
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    width: screenWidth,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  headerCell: {
    flex: 1,
    alignItems: "center",
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 12,
  },
  evenRow: {
    backgroundColor: "#fafafa",
  },
  oddRow: {
    backgroundColor: "#fff",
  },
  cell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cellText: {
    fontSize: 15,
    color: "#555",
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
    marginHorizontal: 10,
  },
});
