// ResultCard.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface KilavuzDegerlendirmesi {
  kilavuzAdi: string;
  resultSymbol: string;
  ageRange: string;
  found: boolean;
}

interface ResultCardProps {
  item: any; // Tahlil tipi olmalı, örneğin: Tahlil
  selectedTest: string | null;
  navigation: any;
  kilavuzDegerlendirmesi: KilavuzDegerlendirmesi[];
  trendSymbol: string; // "up", "down", "same"
  trendColor: string;
  displayValue: string;
  onDelete?: (id: string) => void; // Silme fonksiyonu
}

// Yardımcı fonksiyon: Trend sembolüne göre Ionicon ismi döner
const getTrendIconName = (trend: string): "arrow-up-circle" | "arrow-down-circle" | "swap-horizontal" | "remove-circle" => {
  switch (trend) {
    case "up":
      return "arrow-up-circle";
    case "down":
      return "arrow-down-circle";
    case "same":
      return "swap-horizontal";
    default:
      return "remove-circle"; // Varsayılan ikon
  }
};

// Yardımcı fonksiyon: Trend sembolüne göre renk döner
const getTrendColor = (trend: string): string => {
  switch (trend) {
    case "up":
      return "#F44336"; // Kırmızı
    case "down":
      return "#4CAF50"; // Yeşil
    case "same":
      return "#1E88E5"; // Mavi
    default:
      return "#555"; // Varsayılan renk
  }
};

const ResultCard: React.FC<ResultCardProps> = ({
  item,
  selectedTest,
  navigation,
  kilavuzDegerlendirmesi,
  trendSymbol,
  trendColor,
  displayValue,
  onDelete,
}) => {
  const date = new Date(item.tarih);
  const dayAndMonth = date.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
  });
  const timeStr = date.toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const trendIconName = getTrendIconName(trendSymbol);
  const iconColor = getTrendColor(trendSymbol);

  const missingReferences = kilavuzDegerlendirmesi.length === 0;

  return (
    <View style={styles.modernCard}>
      <View style={styles.cardHeader}>
        <View style={styles.dateContainer}>
          <Text style={styles.modernDateText}>{dayAndMonth}</Text>
          <Text style={styles.modernTimeText}>{timeStr}</Text>
        </View>
        <View style={styles.headerActions}>
          <View style={styles.badgeContainer}>
            <Text style={styles.modernBadge}>
              {displayValue}{' '}
              <Ionicons name={trendIconName} size={20} color={iconColor} />
            </Text>
          </View>
          {onDelete && (
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={() => onDelete(item._id)}
            >
              <Ionicons name="trash-outline" size={22} color="#dc3545" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {missingReferences ? (
        <Text style={styles.noReferenceText}>
          Bu test için referans değeri bulunamadı
        </Text>
      ) : (
        <View style={styles.kilavuzContainer}>
          {kilavuzDegerlendirmesi
            .filter(k => k.found) // Sadece referans değeri olan kılavuzları göster
            .map((k, i) => (
              <View key={i} style={styles.kilavuzItem}>
                <Ionicons
                  name={
                    k.resultSymbol === "up"
                      ? "arrow-up-circle"
                      : k.resultSymbol === "down"
                      ? "arrow-down-circle"
                      : "swap-horizontal"
                  }
                  size={20}
                  color={
                    k.resultSymbol === "up"
                      ? "#F44336"
                      : k.resultSymbol === "down"
                      ? "#4CAF50"
                      : "#1E88E5"
                  }
                />
                <Text style={styles.kilavuzText}>
                  {k.kilavuzAdi} ({k.ageRange} ay)
                </Text>
              </View>
            ))}
        </View>
      )}

      <TouchableOpacity
        style={styles.modernButton}
        onPress={() => navigation.navigate("TahlilDetay", { tahlilId: item._id })}
      >
        <Ionicons name="eye-outline" size={20} color="#fff" style={styles.buttonIcon} />
        <Text style={styles.modernButtonText}>Detayları Görüntüle</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  modernCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  modernDateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  modernTimeText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  badgeContainer: {
    backgroundColor: '#E3F2FD',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  modernBadge: {
    fontSize: 14,
    color: '#1976D2',
    fontWeight: '500',
  },
  kilavuzContainer: {
    marginTop: 12,
    marginBottom: 16,
  },
  kilavuzItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  kilavuzText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
    flex: 1, // Metin uzunsa düzgün görünmesi için
  },
  modernButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3F51B5',
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
  },
  buttonIcon: {
    marginRight: 8,
  },
  modernButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deleteButton: {
    padding: 4,
  },
  dateContainer: {
    flex: 1,
  },
  noReferenceText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
    textAlign: "center",
    marginVertical: 8,
  },
});

export default ResultCard;
