import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Switch } from 'react-native';
import { usePets } from '../../src/contexts/PetContext';
import { Card, CardContent } from '../../src/components/Card';
import { Plus, Check, Clock, X, Bell } from 'lucide-react-native';
import PetSwitcher from '../../src/components/PetSwitcher';
import { Picker } from '@react-native-picker/picker';
import { scheduleReminderNotification } from '../../src/services/notifications';

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
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Reminders</Text>
                <TouchableOpacity style={styles.addButton} onPress={() => setModalOpen(true)}>
                    <Plus size={18} color="#fff" />
                    <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
            </View>

            <PetSwitcher />

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Upcoming</Text>
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
                                <View style={styles.reminderHeader}>
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
                                        <Check size={16} color="#fff" />
                                        <Text style={styles.doneButtonText}>Done</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.snoozeButton} onPress={() => snooze(r.id)}>
                                        <Clock size={16} color="#6b7280" />
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
                                <Check size={18} color="#059669" />
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
                                <X size={24} color="#000" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.form}>
                            <Text style={styles.label}>Title</Text>
                            <TextInput
                                style={styles.input}
                                value={form.title}
                                onChangeText={t => setForm(f => ({ ...f, title: t }))}
                                placeholder="Give medication..."
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

                            <Text style={styles.label}>Date</Text>
                            <TextInput
                                style={styles.input}
                                value={form.date}
                                onChangeText={t => setForm(f => ({ ...f, date: t }))}
                                placeholder="YYYY-MM-DD"
                            />

                            <Text style={styles.label}>Time</Text>
                            <TextInput
                                style={styles.input}
                                value={form.time}
                                onChangeText={t => setForm(f => ({ ...f, time: t }))}
                                placeholder="HH:MM"
                            />

                            <View style={styles.switchRow}>
                                <Text style={styles.label}>Recurring</Text>
                                <Switch
                                    value={form.recurring}
                                    onValueChange={v => setForm(f => ({ ...f, recurring: v }))}
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
        backgroundColor: '#fff',
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    addButton: {
        backgroundColor: '#000',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        gap: 4,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: '#6b7280',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 12,
    },
    reminderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    reminderTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
    },
    reminderTime: {
        fontSize: 13,
        color: '#6b7280',
        marginTop: 2,
    },
    typeBadge: {
        backgroundColor: '#f3f4f6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    typeBadgeText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#4b5563',
        textTransform: 'capitalize',
    },
    actionRow: {
        flexDirection: 'row',
        gap: 8,
    },
    doneButton: {
        flex: 1,
        backgroundColor: '#000',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 8,
        gap: 6,
    },
    doneButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    snoozeButton: {
        flex: 1,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#d1d5db',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 8,
        gap: 6,
    },
    snoozeButtonText: {
        color: '#374151',
        fontSize: 14,
        fontWeight: '600',
    },
    doneContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    reminderDate: {
        fontSize: 12,
        color: '#9ca3af',
    },
    emptyText: {
        textAlign: 'center',
        color: '#9ca3af',
        fontStyle: 'italic',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: '80%',
        padding: 24,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    form: {
        flex: 1,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
        marginTop: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        overflow: 'hidden',
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
    },
    saveButton: {
        backgroundColor: '#000',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 32,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    }
});
