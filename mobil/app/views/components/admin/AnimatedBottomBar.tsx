import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const ITEMS = [
    { route: 'AdminHome', icon: 'home-outline' },
    { route: 'KilavuzList', icon: 'book-outline' },
    { route: 'HastaTahlilArama', icon: 'search-outline' },
];

const { width } = Dimensions.get('window');
const TAB_WIDTH = width / ITEMS.length;

const AnimatedBottomBar = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const ballAnimation = useRef(new Animated.Value(0)).current;

    const getSelectedIndex = () => {
        return ITEMS.findIndex(item => item.route === route.name) || 0;
    };

    useEffect(() => {
        Animated.spring(ballAnimation, {
            toValue: getSelectedIndex(),
            useNativeDriver: true,
            tension: 100,
            friction: 10
        }).start();
    }, [route]);

    const translateX = ballAnimation.interpolate({
        inputRange: [0, ITEMS.length - 1],
        outputRange: [0, TAB_WIDTH * (ITEMS.length - 1)]
    });

    return (
        <View style={styles.container}>
            <Animated.View 
                style={[
                    styles.ball,
                    {
                        transform: [{ translateX }]
                    }
                ]} 
            />
            {ITEMS.map((item, index) => (
                <TouchableOpacity
                    key={item.route}
                    style={styles.tab}
                    onPress={() => navigation.navigate(item.route as never)}
                >
                    <Ionicons
                        name={item.icon as any}
                        size={28}
                        color={route.name === item.route ? '#fff' : 'rgba(255,255,255,0.5)'}
                    />
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#3F51B5',
        marginHorizontal: 8,
        marginBottom: 8,
        borderRadius: 16,
        height: 64,
        position: 'relative',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    ball: {
        position: 'absolute',
        width: TAB_WIDTH,
        height: '100%',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 16,
    },
    tab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default AnimatedBottomBar;
