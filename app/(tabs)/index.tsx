import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { usePets } from '../../src/contexts/PetContext';
import { useAuth } from '../../src/contexts/AuthContext';
import { Card, CardContent } from '../../src/components/Card';
import { Bell, Heart, TrendingUp } from 'lucide-react-native';
import PetSwitcher from '../../src/components/PetSwitcher';
import { Colors } from '../../src/constants/Colors';

export default function HomeScreen() {
    const { user } = useAuth();
    const { activePet, reminders, insights, loading } = usePets();
    const [refreshing, setRefreshing] = React.useState(false);

    const upcomingReminders = reminders.filter(r => !r.completed).slice(0, 3);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    }, []);

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
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
                            <Bell size={18} color={Colors.mutedForeground} strokeWidth={2.5} />
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
                            <TrendingUp size={18} color={Colors.mutedForeground} strokeWidth={2.5} />
                            <Text style={styles.sectionTitle}>Insights</Text>
                        </View>

                        {insights.map(insight => (
                            <Card key={insight.id} style={{ borderLeftWidth: 6, borderLeftColor: insight.type === 'gentle_alert' ? Colors.peach : Colors.mint }}>
                                <CardContent>
                                    <Text style={styles.insightText}>
                                        <Text style={{ fontSize: 20 }}>{insight.icon}</Text> {insight.message}
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
                            <View style={styles.heartIconCircle}>
                                <Heart size={20} color={Colors.primary} fill={Colors.primary} />
                            </View>
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

            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    contentContainer: {
        padding: 20,
    },
    header: {
        marginBottom: 24,
    },
    greeting: {
        fontSize: 26,
        fontFamily: 'Nunito_800ExtraBold',
        color: Colors.foreground,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'Nunito_400Regular',
        color: Colors.mutedForeground,
        marginTop: 4,
    },
    section: {
        marginBottom: 28,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
        gap: 10,
    },
    sectionTitle: {
        fontSize: 13,
        fontFamily: 'Nunito_800ExtraBold',
        color: Colors.mutedForeground,
        textTransform: 'uppercase',
        letterSpacing: 1.2,
    },
    reminderContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    reminderTitle: {
        fontSize: 16,
        fontFamily: 'Nunito_700Bold',
        color: Colors.foreground,
    },
    reminderSubtitle: {
        fontSize: 13,
        fontFamily: 'Nunito_400Regular',
        color: Colors.mutedForeground,
        marginTop: 2,
    },
    badge: {
        backgroundColor: Colors.secondary,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeText: {
        fontSize: 11,
        fontFamily: 'Nunito_700Bold',
        color: Colors.foreground,
        textTransform: 'capitalize',
    },
    insightText: {
        fontSize: 15,
        fontFamily: 'Nunito_600SemiBold',
        color: Colors.foreground,
        lineHeight: 22,
    },
    insightDisclaimer: {
        fontSize: 12,
        fontFamily: 'Nunito_400Regular',
        color: Colors.mutedForeground,
        fontStyle: 'italic',
        marginTop: 10,
    },
    wellnessCard: {
        backgroundColor: Colors.secondary,
        borderColor: Colors.secondary,
        borderWidth: 0,
    },
    wellnessContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    heartIconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    wellnessTitle: {
        fontSize: 15,
        fontFamily: 'Nunito_700Bold',
        color: Colors.foreground,
    },
    wellnessSubtitle: {
        fontSize: 13,
        fontFamily: 'Nunito_400Regular',
        color: Colors.foreground,
        opacity: 0.8,
    },
    emptyText: {
        textAlign: 'center',
        color: Colors.mutedForeground,
        fontSize: 15,
        fontFamily: 'Nunito_400Regular',
        fontStyle: 'italic',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 60,
    }
});
