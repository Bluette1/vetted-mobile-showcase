import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { usePets } from '../contexts/PetContext';
import { Colors } from '../constants/Colors';

const PetSwitcher = () => {
    const { pets, activePet, setActivePetId } = usePets();

    if (pets.length <= 1) return null;

    return (
        <View style={styles.container}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {pets.map(pet => {
                    const isActive = activePet?.id === pet.id;
                    return (
                        <TouchableOpacity
                            key={pet.id}
                            onPress={() => setActivePetId(pet.id)}
                            style={[
                                styles.button,
                                isActive ? styles.buttonActive : styles.buttonOutline
                            ]}
                        >
                            <Text style={[styles.text, isActive ? styles.textActive : styles.textOutline]}>
                                {pet.avatar} {pet.name}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    scrollContent: {
        gap: 10,
        paddingRight: 20,
    },
    button: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 25,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    buttonOutline: {
        backgroundColor: Colors.card,
        borderColor: Colors.border,
    },
    text: {
        fontSize: 14,
        fontFamily: 'Nunito_700Bold',
    },
    textActive: {
        color: '#fff',
    },
    textOutline: {
        color: Colors.foreground,
    },
});

export default PetSwitcher;
