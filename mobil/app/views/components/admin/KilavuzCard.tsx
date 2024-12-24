import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface KilavuzCardProps {
  isAddCard?: boolean;
  kilavuzAdi?: string;
  onPress: () => void;
  onDelete?: () => void;
}

const KilavuzCard = ({ isAddCard, kilavuzAdi, onPress, onDelete }: KilavuzCardProps) => {
  return (
    <View style={styles.cardContainer}>
      {isAddCard ? (
        <TouchableOpacity style={[styles.card, styles.addCard]} onPress={onPress}>
          <Ionicons name="add-circle-outline" size={40} color="#3F51B5" />
          <Text style={[styles.cardText, styles.addCardText]}>Kılavuz Ekle</Text>
        </TouchableOpacity>
      ) : (
        <>
          <TouchableOpacity style={styles.card} onPress={onPress}>
            <Ionicons name="book-outline" size={40} color="#3F51B5" />
            <Text style={styles.cardText}>{kilavuzAdi || "Kılavuz"}</Text>
          </TouchableOpacity>
          {onDelete && (
            <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
              <Ionicons name="trash-outline" size={24} color="#F44336" />
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    marginHorizontal: 6,
    marginVertical: 6,
    position: 'relative',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  addCard: {
    backgroundColor: '#E8EAF6',
    borderWidth: 3,
    borderStyle: 'dashed',
    borderColor: '#3F51B5',
  },
  cardText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
    textAlign: 'center',
  },
  addCardText: {
    color: '#3F51B5',
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});

export default KilavuzCard;
