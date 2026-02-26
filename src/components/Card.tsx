import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface CardProps {
    children: React.ReactNode;
    style?: ViewStyle;
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
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
        marginBottom: 12,
        overflow: 'hidden',
    },
    content: {
        padding: 16,
    },
});
