import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';

interface MoodCardProps {
    mood: string;
    imageSource: any;
    backgroundColor: string;
    onPress: () => void;
}

const MoodCard: React.FC<MoodCardProps> = ({ mood, imageSource, backgroundColor, onPress }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={[styles.card, { backgroundColor }]} onPress={onPress}>
                <Image source={imageSource} style={[styles.image, { tintColor: '#fff' }]} resizeMode='contain' />
            </TouchableOpacity>
            <Text style={styles.moodText}>{mood}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginRight: 16,
    },
    card: {
        width: 100,
        height: 100,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
    },
    image: {
        width: 50,
        height: 50,
    },
    moodText: {
        marginTop: 8,
        fontSize: 16,
        color: '#212121',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default MoodCard;
