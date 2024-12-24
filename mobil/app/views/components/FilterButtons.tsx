// src/views/components/FilterButtons.tsx

import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

interface TimeFilter {
  key: string;
  label: string;
}

interface FilterButtonsProps {
  timeFilters: TimeFilter[];
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
}

const FilterButtons: React.FC<FilterButtonsProps> = ({
  timeFilters,
  selectedFilter,
  setSelectedFilter,
}) => {
  return (
    <View style={styles.modernFilterContainer}>
      {timeFilters.map((filter) => (
        <TouchableOpacity
          key={filter.key}
          style={[
            styles.modernFilterButton,
            selectedFilter === filter.key && styles.modernFilterButtonActive,
          ]}
          onPress={() => setSelectedFilter(filter.key)}
          accessibilityLabel={`Filtre seçimi: ${filter.label}`}
        >
          <Text
            style={[
              styles.modernFilterText,
              selectedFilter === filter.key && styles.modernFilterTextActive,
            ]}
          >
            {filter.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  modernFilterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2, // Android için gölge
    shadowColor: "#000", // iOS için gölge
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  modernFilterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    minWidth: 100,
    alignItems: "center",
  },
  modernFilterButtonActive: {
    backgroundColor: "#3F51B5",
  },
  modernFilterText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  modernFilterTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default FilterButtons;
