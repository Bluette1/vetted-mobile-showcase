import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { usePets } from '../contexts/PetContext';

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
        gap: 8,
    },
    button: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonActive: {
        backgroundColor: '#000',
        borderColor: '#000',
    },
    buttonOutline: {
        backgroundColor: '#fff',
        borderColor: '#d1d5db',
    },
    text: {
        fontSize: 14,
        fontWeight: '600',
    },
    textActive: {
        color: '#fff',
    },
    textOutline: {
        color: '#374151',
    },
});

export default PetSwitcher;
