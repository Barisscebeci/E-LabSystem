import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ViewStyle, TextStyle, ImageStyle } from 'react-native';

interface CardProps {
    onPress: () => void;
    title: string;
    description: string;
    imageSource: any;
    backgroundColor?: string;
    icon?: string;
    containerStyle?: ViewStyle;
    textStyle?: TextStyle;
}

const Card: React.FC<CardProps> = ({
    onPress,
    title,
    description,
    imageSource,
    backgroundColor = '#A5D6A7', // Varsayılan arka plan rengi
    icon,
    containerStyle,
    textStyle,
}) => {
    return (
        <TouchableOpacity style={[styles.card, containerStyle, { backgroundColor }]} onPress={onPress}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.cardText, textStyle]}>{title}</Text>
                    <Text style={styles.cardDescription}>{description}</Text>
                    {icon && <Text style={styles.iconStyle}>{icon}</Text>}
                </View>
                <Image
                    source={imageSource}
                    style={styles.imageStyle}
                    resizeMode='contain'
                />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: 18,
        marginTop: 24,
        borderRadius: 20,
        elevation: 5,
        shadowColor: '#000', // iOS gölge efekti
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        width: '100%',
        height: 'auto',
        alignItems: 'center',
    },
    cardText: {
        fontSize: 22,
        color: '#212121',
        fontWeight: 'bold',
    },
    cardDescription: {
        fontSize: 14,
        color: '#616161',
        marginTop: 8,
    },
    imageStyle: {
        width: 120,
        height: 120,
        marginLeft: 'auto',
    },
    iconStyle: {
        fontSize: 32,
        marginTop: 8,
        color: '#3F51B5',
        fontWeight: 'bold',
    },
});

export default Card;
