// TahlilEkleScreen.tsx

import React, { useState, useCallback, useRef, memo } from "react";
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
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api from "../../../services/api"; // axios vs.

const SearchContainer = memo(
  ({
    searchInputRef,
    searchText,
    setSearchText,
    setFoundUsers,
    setShowCreateUserModal,
    handleSearchUser,
  }: {
    searchInputRef: React.RefObject<TextInput>;
    searchText: string;
    setSearchText: React.Dispatch<React.SetStateAction<string>>;
    setFoundUsers: React.Dispatch<
      React.SetStateAction<{ _id: string; isim: string; soyisim: string }[]>
    >;
    setShowCreateUserModal: React.Dispatch<React.SetStateAction<boolean>>;
    handleSearchUser: () => void;
  }) => (
    <View style={styles.searchWrapper}>
      <View style={styles.searchContainer}>
        <Ionicons
          name="person-add-outline"
          size={24}
          color="#0066cc"
          style={styles.icon}
        />
        <TextInput
          ref={searchInputRef}
          style={styles.input}
          placeholder="Kullanıcı adı giriniz"
          value={searchText}
          onChangeText={(text) => {
            setSearchText(text);
            // Remove automatic search trigger here
          }}
          placeholderTextColor="#999"
          autoCorrect={false}
          autoCapitalize="words"
          returnKeyType="search"
          onSubmitEditing={handleSearchUser}
          blurOnSubmit={false} // Prevents keyboard from dismissing
        />
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => {
            setSearchText("");
            setFoundUsers([]);
            searchInputRef.current?.focus(); // Tekrar odaklan
          }}
          activeOpacity={0.7}
          disabled={searchText.length === 0}
        >
          <Ionicons
            name="close-circle"
            size={24}
            color="#dc3545"
            style={{ opacity: searchText.length > 0 ? 1 : 0 }}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.addNewUserButton}
        onPress={() => setShowCreateUserModal(true)}
      >
        <Ionicons name="person-add" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  )
);

export default function TahlilEkleScreen() {
  // Kullanıcı arama alanları
  const [searchText, setSearchText] = useState("");
  const [foundUsers, setFoundUsers] = useState<
    { _id: string; isim: string; soyisim: string }[]
  >([]);
  const [selectedUser, setSelectedUser] = useState<{
    _id: string;
    isim: string;
    soyisim: string;
  } | null>(null);
  const [loadingSearch, setLoadingSearch] = useState(false);

  // Tahlil değerleri (Tek girişli)
  const [IgA, setIgA] = useState("");
  const [IgM, setIgM] = useState("");
  const [IgG, setIgG] = useState("");
  const [IgG1, setIgG1] = useState("");
  const [IgG2, setIgG2] = useState("");
  const [IgG3, setIgG3] = useState("");
  const [IgG4, setIgG4] = useState("");

  const [loadingAdd, setLoadingAdd] = useState(false);

  // Yeni Kullanıcı Oluşturma Modal Durumu
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [newUserIsim, setNewUserIsim] = useState("");
  const [newUserSoyisim, setNewUserSoyisim] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserSifre, setNewUserSifre] = useState("");
  const [newUserDogumTarihi, setNewUserDogumTarihi] = useState("");
  const [newUserTelefon, setNewUserTelefon] = useState("");
  const [loadingCreateUser, setLoadingCreateUser] = useState(false);

  const searchInputRef = useRef<TextInput>(null);

  // Kullanıcı arama fonksiyonu
  const handleSearchUser = useCallback(async () => {
    if (!searchText.trim()) {
      Alert.alert("Uyarı", "Lütfen arama için bir isim giriniz.");
      return;
    }

    try {
      setLoadingSearch(true);
      // API isteği
      const res = await api.get(
        `/admin/users/search?isim=${encodeURIComponent(searchText.trim())}`
      );
      if (res.data.length === 0) {
        Alert.alert(
          "Sonuç Yok",
          "Aramanıza uygun kullanıcı bulunamadı. Yeni bir kullanıcı oluşturmak ister misiniz?",
          [
            { text: "İptal", style: "cancel" },
            { text: "Evet", onPress: () => setShowCreateUserModal(true) },
          ]
        );
      } else {
        setFoundUsers(res.data);
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        Alert.alert(
          "Sonuç Yok",
          "Aramanıza uygun kullanıcı bulunamadı. Yeni bir kullanıcı oluşturmak ister misiniz?",
          [
            { text: "İptal", style: "cancel" },
            { text: "Evet", onPress: () => setShowCreateUserModal(true) },
          ]
        );
      } else {
        Alert.alert("Hata", "Kullanıcı aranırken sorun oluştu.");
        console.error(err);
      }
    } finally {
      setLoadingSearch(false);
    }
  }, [searchText]);

  // Tahlil ekleme (kaydet) fonksiyonu
  const handleAddTahlil = useCallback(async () => {
    if (!selectedUser) {
      Alert.alert("Uyarı", "Lütfen tahlil eklenecek kullanıcıyı seçin.");
      return;
    }
  
    // Boşluk kontrolü yapıp sadece dolu değerleri ekleyen yardımcı fonksiyon
    const parseValueOrNull = (value: string) => {
      const trimmed = value.trim();
      if (trimmed === "") return null; // İsterseniz direk return null diyebilirsiniz
      const parsed = parseFloat(trimmed);
      return isNaN(parsed) ? null : parsed;
    };
  
    // "degerler" nesnesini dinamik olarak sadece doldurulmuş alanlarla oluşturmak
    const degerlerPayload: Record<string, number | null> = {};
  
    const IgAValue = parseValueOrNull(IgA);
    if (IgAValue !== null) degerlerPayload.IgA = IgAValue;
  
    const IgMValue = parseValueOrNull(IgM);
    if (IgMValue !== null) degerlerPayload.IgM = IgMValue;
  
    const IgGValue = parseValueOrNull(IgG);
    if (IgGValue !== null) degerlerPayload.IgG = IgGValue;
  
    const IgG1Value = parseValueOrNull(IgG1);
    if (IgG1Value !== null) degerlerPayload.IgG1 = IgG1Value;
  
    const IgG2Value = parseValueOrNull(IgG2);
    if (IgG2Value !== null) degerlerPayload.IgG2 = IgG2Value;
  
    const IgG3Value = parseValueOrNull(IgG3);
    if (IgG3Value !== null) degerlerPayload.IgG3 = IgG3Value;
  
    const IgG4Value = parseValueOrNull(IgG4);
    if (IgG4Value !== null) degerlerPayload.IgG4 = IgG4Value;
  
    const payload = {
      kullaniciId: selectedUser._id,
      tarih: new Date().toISOString(),
      degerler: degerlerPayload,
    };
  
    try {
      setLoadingAdd(true);
      // API isteği
      await api.post("/tahliller", payload);
      Alert.alert("Başarılı", "Tahlil başarıyla eklendi.");
      // Formu resetleyebilir veya başka bir ekrana yönlendirebilirsiniz
      resetForm();
    } catch (err) {
      Alert.alert("Hata", "Tahlil ekleme işleminde sorun oluştu.");
      console.error(err);
    } finally {
      setLoadingAdd(false);
    }
  }, [selectedUser, IgA, IgM, IgG, IgG1, IgG2, IgG3, IgG4]);

  // Formu sıfırlama fonksiyonu
  const resetForm = useCallback(() => {
    setSearchText("");
    setFoundUsers([]);
    setSelectedUser(null);
    setIgA("");
    setIgM("");
    setIgG("");
    setIgG1("");
    setIgG2("");
    setIgG3("");
    setIgG4("");
  }, []);

  // Yeni kullanıcı formunu sıfırlama
  const resetCreateUserForm = useCallback(() => {
    setNewUserIsim("");
    setNewUserSoyisim("");
    setNewUserEmail("");
    setNewUserSifre("");
    setNewUserDogumTarihi("");
    setNewUserTelefon("");
  }, []);

  // Yeni kullanıcı oluşturma fonksiyonu
  const handleCreateUser = useCallback(async () => {
    // Form doğrulaması
    if (
      !newUserIsim.trim() ||
      !newUserSoyisim.trim() ||
      !newUserEmail.trim() ||
      !newUserSifre.trim()
    ) {
      Alert.alert("Hata", "Gerekli tüm alanları doldurun.");
      return;
    }

    // Email formatı kontrolü
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(newUserEmail)) {
      Alert.alert("Hata", "Geçerli bir email adresi giriniz.");
      return;
    }

    // Doğum tarihi formatı kontrolü (gg/aa/yyyy)
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/(\d{4})$/;
    if (newUserDogumTarihi && !dateRegex.test(newUserDogumTarihi)) {
      Alert.alert("Hata", "Doğum tarihini gg/aa/yyyy formatında giriniz.");
      return;
    }

    const payload = {
      isim: newUserIsim.trim(),
      soyisim: newUserSoyisim.trim(),
      email: newUserEmail.trim(),
      sifre: newUserSifre,
      dogumTarihi: newUserDogumTarihi.trim(),
      telefon: newUserTelefon.trim(),
    };

    try {
      setLoadingCreateUser(true);
      const res = await api.post("/admin/users/create", payload);
      Alert.alert("Başarılı", "Yeni kullanıcı başarıyla oluşturuldu.");
      setSelectedUser(res.data.user);
      setShowCreateUserModal(false);
      resetCreateUserForm();
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        Alert.alert("Hata", err.response.data.message);
      } else {
        Alert.alert("Hata", "Yeni kullanıcı oluşturulurken bir sorun oluştu.");
      }
      console.error(err);
    } finally {
      setLoadingCreateUser(false);
    }
  }, [
    newUserIsim,
    newUserSoyisim,
    newUserEmail,
    newUserSifre,
    newUserDogumTarihi,
    newUserTelefon,
    resetCreateUserForm,
  ]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="always" // "handled" yerine "always" deneyin
      >
        <Text style={styles.title}>Tahlil Ekle (Admin)</Text>

        <SearchContainer
          searchInputRef={searchInputRef}
          searchText={searchText}
          setSearchText={setSearchText}
          setFoundUsers={setFoundUsers}
          setShowCreateUserModal={setShowCreateUserModal}
          handleSearchUser={handleSearchUser}
        />

        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearchUser}
        >
          {loadingSearch ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.searchButtonText}>Kullanıcı Ara</Text>
          )}
        </TouchableOpacity>

        {/* Arama sonucu listesi */}
        {foundUsers.length > 0 && (
          <View style={styles.foundUsersContainer}>
            {foundUsers.map((user) => (
              <TouchableOpacity
                key={user._id}
                style={[
                  styles.userButton,
                  selectedUser?._id === user._id && styles.selectedUserButton,
                ]}
                onPress={() => {
                  setSelectedUser(user);
                  setFoundUsers([]); // Kullanıcı seçildiğinde arama sonuçlarını gizle
                }}
              >
                <Ionicons
                  name={
                    selectedUser?._id === user._id
                      ? "checkmark-circle"
                      : "ellipse-outline"
                  }
                  size={20}
                  color={selectedUser?._id === user._id ? "#28a745" : "#ccc"}
                  style={styles.userIcon}
                />
                <Text
                  style={[
                    styles.userButtonText,
                    selectedUser?._id === user._id &&
                      styles.selectedUserButtonText,
                  ]}
                >
                  {user.isim} {user.soyisim}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {selectedUser ? (
          <View style={styles.selectedUserContainer}>
            <Ionicons
              name="checkmark-circle"
              size={24}
              color="#28a745"
              style={styles.selectedUserIcon}
            />
            <Text style={styles.selectedUserText}>
              Seçili Kullanıcı: {selectedUser.isim} {selectedUser.soyisim}
            </Text>
          </View>
        ) : null}

        {/* Immunoglobulin Değerleri */}
        <Text style={styles.sectionTitle}>
          Immunoglobulin Değerleri (g/l)
        </Text>

        {/* IgA */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>IgA</Text>
          <View style={styles.singleInputContainer}>
            <Ionicons
              name="arrow-down-circle-outline"
              size={20}
              color="#28a745"
              style={styles.iconSmall}
            />
            <TextInput
              placeholder="IgA değeri"
              style={styles.singleInput}
              value={IgA}
              onChangeText={setIgA}
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* IgM */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>IgM</Text>
          <View style={styles.singleInputContainer}>
            <Ionicons
              name="arrow-down-circle-outline"
              size={20}
              color="#28a745"
              style={styles.iconSmall}
            />
            <TextInput
              placeholder="IgM değeri"
              style={styles.singleInput}
              value={IgM}
              onChangeText={setIgM}
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* IgG */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>IgG</Text>
          <View style={styles.singleInputContainer}>
            <Ionicons
              name="arrow-down-circle-outline"
              size={20}
              color="#28a745"
              style={styles.iconSmall}
            />
            <TextInput
              placeholder="IgG değeri"
              style={styles.singleInput}
              value={IgG}
              onChangeText={setIgG}
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* IgG1 */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>IgG1</Text>
          <View style={styles.singleInputContainer}>
            <Ionicons
              name="arrow-down-circle-outline"
              size={20}
              color="#28a745"
              style={styles.iconSmall}
            />
            <TextInput
              placeholder="IgG1 değeri"
              style={styles.singleInput}
              value={IgG1}
              onChangeText={setIgG1}
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* IgG2 */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>IgG2</Text>
          <View style={styles.singleInputContainer}>
            <Ionicons
              name="arrow-down-circle-outline"
              size={20}
              color="#28a745"
              style={styles.iconSmall}
            />
            <TextInput
              placeholder="IgG2 değeri"
              style={styles.singleInput}
              value={IgG2}
              onChangeText={setIgG2}
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* IgG3 */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>IgG3</Text>
          <View style={styles.singleInputContainer}>
            <Ionicons
              name="arrow-down-circle-outline"
              size={20}
              color="#28a745"
              style={styles.iconSmall}
            />
            <TextInput
              placeholder="IgG3 değeri"
              style={styles.singleInput}
              value={IgG3}
              onChangeText={setIgG3}
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* IgG4 */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>IgG4</Text>
          <View style={styles.singleInputContainer}>
            <Ionicons
              name="arrow-down-circle-outline"
              size={20}
              color="#28a745"
              style={styles.iconSmall}
            />
            <TextInput
              placeholder="IgG4 değeri"
              style={styles.singleInput}
              value={IgG4}
              onChangeText={setIgG4}
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Tahlil Kaydet Butonu */}
        <TouchableOpacity style={styles.addButton} onPress={handleAddTahlil}>
          {loadingAdd ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Ionicons
                name="save-outline"
                size={24}
                color="#fff"
                style={styles.addButtonIcon}
              />
              <Text style={styles.addButtonText}>Tahlili Kaydet</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Yeni Kullanıcı Oluşturma Modal'ı */}
        <Modal
          visible={showCreateUserModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowCreateUserModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Yeni Kullanıcı Oluştur</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="İsim"
                value={newUserIsim}
                onChangeText={setNewUserIsim}
                placeholderTextColor="#999"
              />
              <TextInput
                style={styles.modalInput}
                placeholder="Soyisim"
                value={newUserSoyisim}
                onChangeText={setNewUserSoyisim}
                placeholderTextColor="#999"
              />
              <TextInput
                style={styles.modalInput}
                placeholder="Email"
                value={newUserEmail}
                onChangeText={setNewUserEmail}
                keyboardType="email-address"
                placeholderTextColor="#999"
              />
              <TextInput
                style={styles.modalInput}
                placeholder="Şifre"
                value={newUserSifre}
                onChangeText={setNewUserSifre}
                secureTextEntry
                placeholderTextColor="#999"
              />
              <TextInput
                style={styles.modalInput}
                placeholder="Doğum Tarihi (gg/aa/yyyy)"
                value={newUserDogumTarihi}
                onChangeText={setNewUserDogumTarihi}
                placeholderTextColor="#999"
              />
              <TextInput
                style={styles.modalInput}
                placeholder="Telefon (isteğe bağlı)"
                value={newUserTelefon}
                onChangeText={setNewUserTelefon}
                keyboardType="phone-pad"
                placeholderTextColor="#999"
              />
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleCreateUser}
                >
                  {loadingCreateUser ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.modalButtonText}>Oluştur</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalCancelButton]}
                  onPress={() => setShowCreateUserModal(false)}
                >
                  <Text style={styles.modalButtonText}>İptal</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 24,
    textAlign: "center",
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#0066cc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#f9fafb",
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  clearButton: {
    padding: 4,
  },
  addNewUserButton: {
    backgroundColor: "#28a745",
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  searchButton: {
    backgroundColor: "#0066cc",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  foundUsersContainer: {
    marginBottom: 16,
  },
  userButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  selectedUserButton: {
    borderColor: "#28a745",
    backgroundColor: "#e6ffe6",
  },
  userIcon: {
    marginRight: 8,
  },
  userButtonText: {
    fontSize: 16,
    color: "#333",
  },
  selectedUserButtonText: {
    color: "#28a745",
    fontWeight: "600",
  },
  selectedUserContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#e6ffe6",
    padding: 12,
    borderRadius: 8,
  },
  selectedUserIcon: {
    marginRight: 8,
  },
  selectedUserText: {
    fontSize: 16,
    color: "#28a745",
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0066cc",
    marginTop: 16,
    marginBottom: 8,
  },
  sectionContainer: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  singleInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: "#f9fafb",
  },
  iconSmall: {
    marginRight: 4,
  },
  singleInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  addButton: {
    flexDirection: "row",
    backgroundColor: "#28a745",
    paddingVertical: 14,
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
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  addButtonIcon: {
    marginRight: 8,
  },
  // Modal Stilleri
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: "#333",
    marginBottom: 12,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    backgroundColor: "#28a745",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  modalCancelButton: {
    backgroundColor: "#dc3545",
    marginLeft: 8,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
