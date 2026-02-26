import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../constants/Colors';

interface CardProps {
    children: React.ReactNode;
    style?: ViewStyle | ViewStyle[];
}

export const Card = ({ children, style }: CardProps) => (
    <View style={[styles.card, style]}>
        {children}
    </View>
);

export const CardContent = ({ children, style }: CardProps) => (
    <View style={[styles.content, style]}>
        {children}
    </View>
);

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.card,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        marginBottom: 16,
        overflow: 'hidden',
    },
    content: {
        padding: 16,
    },
});
