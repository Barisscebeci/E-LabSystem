import React, { useContext, useState } from 'react';
import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  Dimensions,
  Image,
  Animated,
} from 'react-native';
import { AuthContext } from '../../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import Card from '../../components/Card';
import MoodCard from '../../components/MoodCard';
import { MaterialIcons, Ionicons } from '@expo/vector-icons'; // İkonlar için import

export default function HomeScreen() {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation<any>();

  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const moods = [
    {
      mood: 'Mutlu',
      image: require('../../../../assets/happy.png'),
      backgroundColor: '#FFD54F',
      suggestions: ['Günün tadını çıkarın!', 'Sevdiklerinize zaman ayırın.', 'Mutluluğunuzu paylaşın.'],
    },
    {
      mood: 'Sakin',
      image: require('../../../../assets/calm.png'),
      backgroundColor: '#4FC3F7',
      suggestions: ['Meditasyon yapın.', 'Doğada yürüyüş yapın.', 'Derin nefes alın.'],
    },
    {
      mood: 'Rahat',
      image: require('../../../../assets/yin-yang.png'),
      backgroundColor: '#A5D6A7',
      suggestions: ['Bir kitap okuyun.', 'Sıcak bir duş alın.', 'Favori müziğinizi dinleyin.'],
    },
    {
      mood: 'Odaklanmış',
      image: require('../../../../assets/focus.png'),
      backgroundColor: '#9575CD',
      suggestions: ['Görev listenizi düzenleyin.', 'Sessiz bir ortam bulun.', 'Dikkat dağıtıcıları ortadan kaldırın.'],
    },
  ];

  // Saat bazlı selamlama
  const currentHour = new Date().getHours();
  let greeting = 'Merhaba';

  if (currentHour >= 6 && currentHour < 12) {
    greeting = 'Günaydın';
  } else if (currentHour >= 12 && currentHour < 18) {
    greeting = 'İyi öğlenler';
  } else if (currentHour >= 18 && currentHour < 24) {
    greeting = 'İyi akşamlar';
  } else {
    greeting = 'İyi geceler';
  }

  // Ekran boyutlarını alma (Dimensions window özelliği)
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => { /* Menü ikonu tıklandığında yapılacak işlem */ }}>
          <MaterialIcons name="menu" size={28} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { /* Kullanıcı resmi tıklandığında yapılacak işlem */ }}>
          <Image source={require('../../../../assets/user.png')} style={styles.userImage} />
        </TouchableOpacity>
      </View>

      {/* Hoşgeldiniz Mesajı */}
      <View style={styles.greetingContainer}>
        <Text style={styles.welcomeText}>{greeting},</Text>
        <Text style={styles.userName}>{user ? user.isim : 'Kullanıcı'}!</Text>
      </View>

      {/* Soru */}
      <Text style={styles.questionText}>Bugün nasıl hissediyorsunuz?</Text>

      {/* Mood Seçimi */}
      <View style={styles.moodContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {moods.map((item, index) => (
            <MoodCard
              key={index}
              mood={item.mood}
              imageSource={item.image}
              backgroundColor={item.backgroundColor}
              onPress={() => {
                setSelectedMood(item.mood);
                setModalVisible(true);
              }}
            />
          ))}
        </ScrollView>
      </View>

      {/* Modal */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            {selectedMood && (
              <>
                <Text style={styles.modalTitle}>{selectedMood} hissediyorsunuz</Text>
                {moods.find(m => m.mood === selectedMood)?.suggestions.map((suggestion, idx) => (
                  <View key={idx} style={styles.suggestionContainer}>
                    <Ionicons name="checkmark-circle-outline" size={20} color="#28a745" />
                    <Text style={styles.modalText}>{suggestion}</Text>
                  </View>
                ))}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Ionicons name="close-circle-outline" size={24} color="#fff" style={{ marginRight: 8 }} />
                  <Text style={styles.closeButtonText}>Kapat</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Cardlar */}
      <Card
        onPress={() => navigation.navigate('YeniTahlilEkle')}
        title="Tahlil Ekleyin ve Sağlığınızı Takip Edin"
        description="Sonuçlarınızı kaydedin ve çevrimdışı olduğunuzda bile erişim sağlayın."
        imageSource={require('../../../../assets/add-analyses.png')}
        icon={<Ionicons name="add-circle-outline" size={24} color="#fff" />}
      />

      <Card
        onPress={() => navigation.navigate('TestsNavigator')}
        title="Tahlil Sonuçlarını Görüntüleyin"
        backgroundColor='#FFAB91'
        description="Daha önce eklediğiniz tahlil sonuçlarını görüntüleyin."
        imageSource={require('../../../../assets/sonuc-goruntule.png')}
        icon={<Ionicons name="eye-outline" size={24} color="#fff" />}
      />

      {/* Ekstra Boşluk */}
      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
    backgroundColor: '#f0f4f7',
    paddingBottom: 24,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingTop: 54,
  },
  userImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 16,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0066cc',
    marginLeft: 8,
  },
  questionText: {
    fontSize: 20,
    marginTop: 24,
    fontWeight: '600',
    color: '#333',
  },
  moodContainer: {
    marginTop: 16,
    height: 180,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    color: '#333',
  },
  suggestionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalText: {
    fontSize: 16,
    color: '#555',
    marginLeft: 8,
  },
  closeButton: {
    flexDirection: 'row',
    backgroundColor: '#0066cc',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    width: '80%',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
