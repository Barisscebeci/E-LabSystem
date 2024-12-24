// src/views/components/SearchBox.tsx

import React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Text,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface User {
  _id: string;
  isim: string;
  soyisim: string;
}

interface SearchBoxProps {
  searchText: string;
  setSearchText: (text: string) => void;
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;
  loading: boolean;
  users: User[];
  handleSelectUser: (user: User) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  searchText,
  setSearchText,
  selectedUser,
  setSelectedUser,
  loading,
  users,
  handleSelectUser,
}) => {
  return (
    <View style={styles.searchBoxContainer}>
      <View style={styles.searchInputWrapper}>
        <Ionicons name="search-outline" size={24} color="#666" />
        <TextInput
          style={styles.modernSearchInput}
          placeholder="Hasta adı veya soyadı ile ara..."
          value={searchText}
          onChangeText={(text) => {
            setSearchText(text);
            if (selectedUser) {
              setSelectedUser(null);
            }
          }}
          placeholderTextColor="#999"
          editable={!selectedUser}
          accessibilityLabel="Hasta arama kutusu"
        />
        {selectedUser && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => {
              setSelectedUser(null);
              setSearchText("");
            }}
            accessibilityLabel="Aramayı temizle"
          >
            <Ionicons name="close-circle" size={24} color="#FF5252" />
          </TouchableOpacity>
        )}
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#3F51B5" />
        </View>
      )}

      {users.length > 0 && !selectedUser && (
        <View style={styles.resultsContainer}>
          <FlatList
            data={users}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.userItem}
                onPress={() => handleSelectUser(item)}
                accessibilityLabel={`Hasta seçimi: ${item.isim} ${item.soyisim}`}
              >
                <Ionicons
                  name="person-outline"
                  size={20}
                  color="#666"
                  style={styles.userIcon}
                />
                <Text style={styles.userItemText}>
                  {item.isim} {item.soyisim}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchBoxContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  searchInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  modernSearchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 16,
    color: "#333",
  },
  clearButton: {
    padding: 4,
  },
  loadingContainer: {
    paddingVertical: 8,
    alignItems: "center",
  },
  resultsContainer: {
    marginTop: 12,
    maxHeight: 200,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f8f9fa",
    marginBottom: 8,
  },
  userIcon: {
    marginRight: 12,
  },
  userItemText: {
    fontSize: 16,
    color: "#333",
  },
});

export default SearchBox;
