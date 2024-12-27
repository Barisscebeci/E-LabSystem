import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import {
  useRoute,
  useNavigation,
  RouteProp,
  NavigationProp,
} from "@react-navigation/native";
import api from "../../../services/api";
import { Ionicons } from "@expo/vector-icons";

type RootStackParamList = {
  ReferansDetay: { reference: any };
  ReferansEkleScreen: { kilavuzId: string };
  ReferansGuncelleScreen: { kilavuzId: string; reference: any };
};

type ReferansGuncelleScreenRouteProp = RouteProp<
  RootStackParamList,
  "ReferansGuncelleScreen"
>;

interface Reference {
  _id: string;
  ageMin: number;
  ageMax: number;
  IgA: { min: number; max: number } | null;
  IgM: { min: number; max: number } | null;
  IgG: { min: number; max: number } | null;
  IgG1: { min: number; max: number } | null;
  IgG2: { min: number; max: number } | null;
  IgG3: { min: number; max: number } | null;
  IgG4: { min: number; max: number } | null;
}

export default function ReferansGuncelleScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<ReferansGuncelleScreenRouteProp>();
  const { kilavuzId, reference } = route.params;

  const [loading, setLoading] = useState<boolean>(false);

  // Form alanlarını dinamik olarak yönetmek için yapılandırma objesi
  const formFields = [
    { label: "Yaş Aralığı (Min)", key: "ageMin", value: reference.ageMin },
    { label: "Yaş Aralığı (Max)", key: "ageMax", value: reference.ageMax },
    { label: "IgA Min", key: "IgA.min", value: reference.IgA?.min ?? "" },
    { label: "IgA Max", key: "IgA.max", value: reference.IgA?.max ?? "" },
    { label: "IgM Min", key: "IgM.min", value: reference.IgM?.min ?? "" },
    { label: "IgM Max", key: "IgM.max", value: reference.IgM?.max ?? "" },
    { label: "IgG Min", key: "IgG.min", value: reference.IgG?.min ?? "" },
    { label: "IgG Max", key: "IgG.max", value: reference.IgG?.max ?? "" },
    { label: "IgG1 Min", key: "IgG1.min", value: reference.IgG1?.min ?? "" },
    { label: "IgG1 Max", key: "IgG1.max", value: reference.IgG1?.max ?? "" },
    { label: "IgG2 Min", key: "IgG2.min", value: reference.IgG2?.min ?? "" },
    { label: "IgG2 Max", key: "IgG2.max", value: reference.IgG2?.max ?? "" },
    { label: "IgG3 Min", key: "IgG3.min", value: reference.IgG3?.min ?? "" },
    { label: "IgG3 Max", key: "IgG3.max", value: reference.IgG3?.max ?? "" },
    { label: "IgG4 Min", key: "IgG4.min", value: reference.IgG4?.min ?? "" },
    { label: "IgG4 Max", key: "IgG4.max", value: reference.IgG4?.max ?? "" },
    // Diğer immunoglobulinler için ek alanlar ekleyebilirsiniz
  ];

  // Form verilerini yönetmek için state objesi
  const [formData, setFormData] = useState<{ [key: string]: string }>(() => {
    const initialData: { [key: string]: string } = {};
    formFields.forEach((field) => {
      initialData[field.key] =
        field.value !== null && field.value !== undefined
          ? field.value.toString()
          : "";
    });
    return initialData;
  });

  // Form alanlarını dinamik olarak oluşturmak için fonksiyon
  const renderFormFields = () => {
    return formFields.map((field, index) => {
      const handleChange = (text: string) => {
        setFormData({ ...formData, [field.key]: text });
      };

      // Her ikili için ayrı container
      if (index % 2 === 0) {
        const nextField = formFields[index + 1];
        return (
          <View key={index} style={styles.row}>
            {/* Mevcut alan */}
            <View style={styles.halfInputContainer}>
              <Ionicons
                name="arrow-down-circle-outline"
                size={20}
                color="#28a745"
                style={styles.iconSmall}
              />
              <TextInput
                placeholder={field.label}
                style={styles.halfInput}
                value={formData[field.key]}
                onChangeText={handleChange}
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
            </View>

            {/* Bir sonraki alan */}
            {nextField && (
              <View style={styles.halfInputContainer}>
                <Ionicons
                  name="arrow-up-circle-outline"
                  size={20}
                  color="#dc3545"
                  style={styles.iconSmall}
                />
                <TextInput
                  placeholder={nextField.label}
                  style={styles.halfInput}
                  value={formData[nextField.key]}
                  onChangeText={(text) =>
                    setFormData({ ...formData, [nextField.key]: text })
                  }
                  keyboardType="numeric"
                  placeholderTextColor="#999"
                />
              </View>
            )}
          </View>
        );
      } else {
        return null;
      }
    });
  };

  // Form verilerini dinamik olarak güncellemek için fonksiyon
  const constructUpdateData = () => {
    const updateData: any = {};
    Object.keys(formData).forEach((key) => {
      const value = formData[key].trim();
      if (value === "") {
        // Boş alanları güncelleme verilerinden çıkar
        return;
      }

      const keys = key.split(".");
      if (keys.length === 1) {
        updateData[key] = Number(formData[key]);
      } else if (keys.length === 2) {
        if (!updateData[keys[0]]) {
          updateData[keys[0]] = {};
        }
        updateData[keys[0]][keys[1]] = Number(formData[key]);
      }
    });
    return updateData;
  };

  async function handleUpdate() {
    // Yaş aralığı alanlarının dolu ve geçerli olup olmadığını kontrol edin
    if (!formData["ageMin"] || isNaN(Number(formData["ageMin"]))) {
      Alert.alert(
        "Hata",
        "Yaş aralığı min alanı doğru şekilde doldurulmalıdır."
      );
      return;
    }

    if (!formData["ageMax"] || isNaN(Number(formData["ageMax"]))) {
      Alert.alert(
        "Hata",
        "Yaş aralığı max alanı doğru şekilde doldurulmalıdır."
      );
      return;
    }

    // Diğer alanlar boş olabileceği için sadece doldurulmuş olanların sayısal olup olmadığını kontrol edin
    for (const key in formData) {
      if (key === "ageMin" || key === "ageMax") continue; // Bu alanları atla

      if (formData[key].trim() !== "" && isNaN(Number(formData[key]))) {
        Alert.alert("Hata", `${key} alanı sayısal bir değer olmalıdır.`);
        return;
      }
    }

    const updateData = constructUpdateData();

    setLoading(true);
    try {
      await api.put(
        `/kilavuzlar/${kilavuzId}/references/${reference._id}`,
        updateData
      );
      Alert.alert("Başarılı", "Referans güncellendi.");
      navigation.goBack();
    } catch (err) {
      console.error("Referans güncellenirken hata:", err);
      Alert.alert("Hata", "Referans güncellenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>Referans Güncelle</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {renderFormFields()}

          {/* Güncelle Butonu */}
          <TouchableOpacity style={styles.button} onPress={handleUpdate}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons
                  name="save-outline"
                  size={24}
                  color="#fff"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.buttonText}>Güncelle</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f7",
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#28a745",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  backButton: {
    marginRight: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
  },
  form: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,

    // Gölge efektleri
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  halfInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    width: "48%",
    backgroundColor: "#f9fafb",
  },
  iconSmall: {
    marginRight: 4,
  },
  halfInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#28a745",
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
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
    fontSize: 18,
    fontWeight: "600",
  },
});
