import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Switch } from 'react-native';
import { usePets } from '../../src/contexts/PetContext';
import { Card, CardContent } from '../../src/components/Card';
import { Plus, Check, Clock, X, Bell } from 'lucide-react-native';
import PetSwitcher from '../../src/components/PetSwitcher';
import { Picker } from '@react-native-picker/picker';
import { scheduleReminderNotification } from '../../src/services/notifications';
import { Colors } from '../../src/constants/Colors';

export default function RemindersScreen() {
    const { reminders, addReminder, updateReminder, activePet } = usePets();
    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState({
        title: '',
        type: 'custom' as any,
        date: new Date().toISOString().split('T')[0],
        time: '09:00',
        recurring: false
    });

    const handleSave = async () => {
        if (!activePet) return;

        // Schedule local notification
        await scheduleReminderNotification(
            `Reminder for ${activePet.name}`,
            form.title,
            form.date,
            form.time
        );

        addReminder({
            ...form,
            petId: activePet.id,
            completed: false,
            snoozed: false
        });

        setModalOpen(false);
        setForm({
            title: '',
            type: 'custom',
            date: new Date().toISOString().split('T')[0],
            time: '09:00',
            recurring: false
        });
    };

    const markDone = (id: string) => {
        const r = reminders.find(x => x.id === id);
        if (r) updateReminder({ ...r, completed: true });
    };

    const snooze = (id: string) => {
        const r = reminders.find(x => x.id === id);
        if (r) updateReminder({ ...r, snoozed: true });
    };

    const pending = reminders.filter(r => !r.completed);
    const done = reminders.filter(r => r.completed);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.header}>
                <Text style={styles.title}>Reminders</Text>
                <TouchableOpacity style={styles.addButton} onPress={() => setModalOpen(true)}>
                    <Plus size={18} color="#fff" />
                    <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
            </View>

            <PetSwitcher />

            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Bell size={18} color={Colors.mutedForeground} strokeWidth={2.5} />
                    <Text style={styles.sectionTitle}>Upcoming</Text>
                </View>

                {pending.length === 0 ? (
                    <Card>
                        <CardContent>
                            <Text style={styles.emptyText}>All done! No pending reminders. 🎉</Text>
                        </CardContent>
                    </Card>
                ) : (
                    pending.map(r => (
                        <Card key={r.id} style={r.snoozed ? { opacity: 0.6 } : undefined}>
                            <CardContent>
                                <View style={styles.reminderItemHeader}>
                                    <View>
                                        <Text style={styles.reminderTitle}>{r.title}</Text>
                                        <Text style={styles.reminderTime}>{r.date} · {r.time} {r.recurring ? '🔄' : ''}</Text>
                                    </View>
                                    <View style={styles.typeBadge}>
                                        <Text style={styles.typeBadgeText}>{r.type}</Text>
                                    </View>
                                </View>

                                <View style={styles.actionRow}>
                                    <TouchableOpacity style={styles.doneButton} onPress={() => markDone(r.id)}>
                                        <Check size={16} color="#fff" strokeWidth={3} />
                                        <Text style={styles.doneButtonText}>Done</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.snoozeButton} onPress={() => snooze(r.id)}>
                                        <Clock size={16} color={Colors.foreground} />
                                        <Text style={styles.snoozeButtonText}>Snooze</Text>
                                    </TouchableOpacity>
                                </View>
                            </CardContent>
                        </Card>
                    ))
                )}
            </View>

            {done.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Completed</Text>
                    {done.map(r => (
                        <Card key={r.id} style={{ opacity: 0.6 }}>
                            <CardContent style={styles.doneContent}>
                                <View style={styles.checkCircle}>
                                    <Check size={14} color={Colors.success} strokeWidth={3} />
                                </View>
                                <View>
                                    <Text style={[styles.reminderTitle, { textDecorationLine: 'line-through' }]}>{r.title}</Text>
                                    <Text style={styles.reminderDate}>{r.date}</Text>
                                </View>
                            </CardContent>
                        </Card>
                    ))}
                </View>
            )}

            {/* Add Modal */}
            <Modal visible={modalOpen} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>New Reminder</Text>
                            <TouchableOpacity onPress={() => setModalOpen(false)}>
                                <X size={24} color={Colors.foreground} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
                            <Text style={styles.label}>What should we remind you about?</Text>
                            <TextInput
                                style={styles.input}
                                value={form.title}
                                onChangeText={t => setForm(f => ({ ...f, title: t }))}
                                placeholder="Give medication..."
                                placeholderTextColor={Colors.mutedForeground}
                            />

                            <Text style={styles.label}>Type</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={form.type}
                                    onValueChange={(v) => setForm(f => ({ ...f, type: v }))}
                                >
                                    <Picker.Item label="Vaccination" value="vaccination" />
                                    <Picker.Item label="Medication" value="medication" />
                                    <Picker.Item label="Custom" value="custom" />
                                </Picker>
                            </View>

                            <View style={styles.dateTimeGrid}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.label}>Date</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={form.date}
                                        onChangeText={t => setForm(f => ({ ...f, date: t }))}
                                        placeholder="YYYY-MM-DD"
                                        placeholderTextColor={Colors.mutedForeground}
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.label}>Time</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={form.time}
                                        onChangeText={t => setForm(f => ({ ...f, time: t }))}
                                        placeholder="HH:MM"
                                        placeholderTextColor={Colors.mutedForeground}
                                    />
                                </View>
                            </View>

                            <View style={styles.switchRow}>
                                <View>
                                    <Text style={[styles.label, { marginTop: 0 }]}>Recurring</Text>
                                    <Text style={styles.switchSubtitle}>Repeat this reminder</Text>
                                </View>
                                <Switch
                                    value={form.recurring}
                                    onValueChange={v => setForm(f => ({ ...f, recurring: v }))}
                                    trackColor={{ false: Colors.border, true: Colors.primary }}
                                    thumbColor="#fff"
                                />
                            </View>

                            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                                <Text style={styles.saveButtonText}>Save Reminder</Text>
                            </TouchableOpacity>
                            <View style={{ height: 40 }} />
                        </ScrollView>
                    </View>
                </View>
            </Modal>

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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontFamily: 'Nunito_800ExtraBold',
        color: Colors.foreground,
    },
    addButton: {
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        gap: 6,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 14,
        fontFamily: 'Nunito_700Bold',
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
    reminderItemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    reminderTitle: {
        fontSize: 16,
        fontFamily: 'Nunito_700Bold',
        color: Colors.foreground,
    },
    reminderTime: {
        fontSize: 14,
        fontFamily: 'Nunito_400Regular',
        color: Colors.mutedForeground,
        marginTop: 4,
    },
    typeBadge: {
        backgroundColor: Colors.secondary,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    typeBadgeText: {
        fontSize: 11,
        fontFamily: 'Nunito_700Bold',
        color: Colors.foreground,
        textTransform: 'capitalize',
    },
    actionRow: {
        flexDirection: 'row',
        gap: 10,
    },
    doneButton: {
        flex: 1,
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        gap: 8,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    doneButtonText: {
        color: '#fff',
        fontSize: 14,
        fontFamily: 'Nunito_700Bold',
    },
    snoozeButton: {
        flex: 1,
        backgroundColor: Colors.card,
        borderWidth: 1,
        borderColor: Colors.border,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        gap: 8,
    },
    snoozeButtonText: {
        color: Colors.foreground,
        fontSize: 14,
        fontFamily: 'Nunito_700Bold',
    },
    doneContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    checkCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: Colors.mint,
        justifyContent: 'center',
        alignItems: 'center',
    },
    reminderDate: {
        fontSize: 12,
        fontFamily: 'Nunito_400Regular',
        color: Colors.mutedForeground,
    },
    emptyText: {
        textAlign: 'center',
        color: Colors.mutedForeground,
        fontFamily: 'Nunito_400Regular',
        fontStyle: 'italic',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        height: '84%',
        padding: 24,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    modalTitle: {
        fontSize: 22,
        fontFamily: 'Nunito_800ExtraBold',
        color: Colors.foreground,
    },
    form: {
        flex: 1,
    },
    label: {
        fontSize: 14,
        fontFamily: 'Nunito_700Bold',
        color: Colors.foreground,
        marginBottom: 8,
        marginTop: 18,
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        fontFamily: 'Nunito_400Regular',
        backgroundColor: Colors.background,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: Colors.background,
    },
    dateTimeGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 24,
        padding: 16,
        backgroundColor: Colors.background,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    switchSubtitle: {
        fontSize: 12,
        fontFamily: 'Nunito_400Regular',
        color: Colors.mutedForeground,
        marginTop: 2,
    },
    saveButton: {
        backgroundColor: Colors.primary,
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 36,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Nunito_700Bold',
    }
});
