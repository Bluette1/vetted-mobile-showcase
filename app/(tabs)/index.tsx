import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import { usePets } from '../../src/contexts/PetContext';

export default function HomeScreen() {
    const { user } = useAuth();
    const { activePet } = usePets();

    return (
        <View style={styles.container}>
            <Text style={styles.greeting}>Hi, {user?.name || 'there'} 👋</Text>
            <Text style={styles.subtitle}>Here's how your pet is doing today</Text>

            {activePet ? (
                <View style={styles.card}>
                    <Text style={styles.petName}>Active Pet: {activePet.name}</Text>
                </View>
            ) : (
                <Text style={styles.empty}>No active pet selected</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: '#fff',
    },
    greeting: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 16,
        color: '#6b7280',
        marginTop: 4,
    },
    card: {
        marginTop: 24,
        padding: 16,
        borderRadius: 12,
        backgroundColor: '#f3f4f6',
    },
    petName: {
        fontSize: 18,
        fontWeight: '600',
    },
    empty: {
        marginTop: 24,
        color: '#9ca3af',
        fontStyle: 'italic',
    }
});
