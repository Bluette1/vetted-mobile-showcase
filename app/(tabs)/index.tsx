import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { usePets } from '../../src/contexts/PetContext';
import { useAuth } from '../../src/contexts/AuthContext';
import { Card, CardContent } from '../../src/components/Card';
import { Bell, Heart, TrendingUp } from 'lucide-react-native';
import PetSwitcher from '../../src/components/PetSwitcher';

export default function HomeScreen() {
    const { user } = useAuth();
    const { activePet, reminders, insights, loading } = usePets();
    const [refreshing, setRefreshing] = React.useState(false);

    const upcomingReminders = reminders.filter(r => !r.completed).slice(0, 3);

    const onRefresh = React.useCallback(() => {
        // In a real app, you'd trigger a reload here
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    }, []);

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <View style={styles.header}>
                <Text style={styles.greeting}>Hi, {user?.name || 'there'} 👋</Text>
                <Text style={styles.subtitle}>Here's how your pet is doing today</Text>
            </View>

            <PetSwitcher />

            {activePet ? (
                <>
                    {/* Upcoming Reminders */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Bell size={18} color="#6b7280" />
                            <Text style={styles.sectionTitle}>Upcoming</Text>
                        </View>

                        {upcomingReminders.length === 0 ? (
                            <Card>
                                <CardContent>
                                    <Text style={styles.emptyText}>No upcoming reminders — all caught up! 🎉</Text>
                                </CardContent>
                            </Card>
                        ) : (
                            upcomingReminders.map(r => (
                                <Card key={r.id}>
                                    <CardContent style={styles.reminderContent}>
                                        <View>
                                            <Text style={styles.reminderTitle}>{r.title}</Text>
                                            <Text style={styles.reminderSubtitle}>{r.date} · {r.time}</Text>
                                        </View>
                                        <View style={styles.badge}>
                                            <Text style={styles.badgeText}>{r.type}</Text>
                                        </View>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </View>

                    {/* Insights */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <TrendingUp size={18} color="#6b7280" />
                            <Text style={styles.sectionTitle}>Insights</Text>
                        </View>

                        {insights.map(insight => (
                            <Card key={insight.id} style={{ borderLeftWidth: 4, borderLeftColor: insight.type === 'gentle_alert' ? '#fde68a' : '#6ee7b7' }}>
                                <CardContent>
                                    <Text style={styles.insightText}>
                                        <Text style={{ fontSize: 18 }}>{insight.icon}</Text> {insight.message}
                                    </Text>
                                    <Text style={styles.insightDisclaimer}>
                                        💡 These insights are based on patterns, not diagnoses. Always consult your vet.
                                    </Text>
                                </CardContent>
                            </Card>
                        ))}
                    </View>

                    {/* Quick wellness prompt */}
                    <Card style={styles.wellnessCard}>
                        <CardContent style={styles.wellnessContent}>
                            <Heart size={20} color="#3b82f6" />
                            <View>
                                <Text style={styles.wellnessTitle}>Daily wellness check-in</Text>
                                <Text style={styles.wellnessSubtitle}>How is {activePet.name} feeling today?</Text>
                            </View>
                        </CardContent>
                    </Card>
                </>
            ) : !loading && (
                <View style={styles.centered}>
                    <Text style={styles.emptyText}>No pets found. Add your first pet in the Pets tab!</Text>
                </View>
            )}

            {/* Bottom padding for ScrollView */}
            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    header: {
        marginBottom: 24,
        marginTop: 8,
    },
    greeting: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
    },
    subtitle: {
        fontSize: 14,
        color: '#6b7280',
        marginTop: 4,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 8,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: '#6b7280',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    reminderContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    reminderTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1f2937',
    },
    reminderSubtitle: {
        fontSize: 12,
        color: '#6b7280',
        marginTop: 2,
    },
    badge: {
        backgroundColor: '#f3f4f6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#4b5563',
    },
    insightText: {
        fontSize: 14,
        color: '#1f2937',
        lineHeight: 20,
    },
    insightDisclaimer: {
        fontSize: 11,
        color: '#9ca3af',
        fontStyle: 'italic',
        marginTop: 8,
    },
    wellnessCard: {
        backgroundColor: '#eff6ff',
        borderColor: '#bfdbfe',
    },
    wellnessContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    wellnessTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1e40af',
    },
    wellnessSubtitle: {
        fontSize: 12,
        color: '#3b82f6',
    },
    emptyText: {
        textAlign: 'center',
        color: '#9ca3af',
        fontSize: 14,
        fontStyle: 'italic',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    }
});
