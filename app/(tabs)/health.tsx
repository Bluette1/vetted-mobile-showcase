import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { usePets } from '../../src/contexts/PetContext';
import { Card, CardContent } from '../../src/components/Card';
import { Plus, Syringe, Pill, Stethoscope, FileText, X } from 'lucide-react-native';
import PetSwitcher from '../../src/components/PetSwitcher';
import { Picker } from '@react-native-picker/picker';
import { Colors } from '../../src/constants/Colors';

const typeIcons: Record<string, any> = {
    vaccination: Syringe,
    medication: Pill,
    vet_visit: Stethoscope,
    note: FileText,
};

const typeColors: Record<string, string> = {
    vaccination: '#F0E7FF', // lavender light
    medication: '#E6FFFA', // mint light
    vet_visit: '#EBF8FF', // sky light
    note: '#FFF5EB', // peach light
};

const iconColors: Record<string, string> = {
    vaccination: '#8B5CF6',
    medication: '#319795',
    vet_visit: '#3182CE',
    note: '#DD6B20',
};

export default function HealthScreen() {
    const { healthRecords, addHealthRecord, activePet } = usePets();
    const [modalOpen, setModalOpen] = useState(false);
    const [filter, setFilter] = useState('all');
    const [form, setForm] = useState({
        type: 'vaccination' as any,
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
    });

    const filtered = filter === 'all' ? healthRecords : healthRecords.filter(r => r.type === filter);

    const handleSave = () => {
        if (!activePet) return;
        addHealthRecord({ ...form, petId: activePet.id });
        setModalOpen(false);
        setForm({ type: 'vaccination', title: '', description: '', date: new Date().toISOString().split('T')[0] });
    };

    const FilterTab = ({ value, label }: { value: string, label: string }) => (
        <TouchableOpacity
            onPress={() => setFilter(value)}
            style={[styles.tab, filter === value && styles.tabActive]}
        >
            <Text style={[styles.tabText, filter === value && styles.tabTextActive]}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.header}>
                <Text style={styles.title}>Health Records</Text>
                <TouchableOpacity style={styles.addButton} onPress={() => setModalOpen(true)}>
                    <Plus size={18} color="#fff" />
                    <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
            </View>

            <PetSwitcher />

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer} contentContainerStyle={styles.tabsScrollContent}>
                <FilterTab value="all" label="All" />
                <FilterTab value="vaccination" label="Vaccines" />
                <FilterTab value="medication" label="Meds" />
                <FilterTab value="vet_visit" label="Visits" />
                <FilterTab value="note" label="Notes" />
            </ScrollView>

            <View style={styles.recordList}>
                {filtered.length === 0 ? (
                    <Card>
                        <CardContent>
                            <Text style={styles.emptyText}>No records yet. Tap + to add one.</Text>
                        </CardContent>
                    </Card>
                ) : (
                    filtered.map(record => {
                        const IconComp = typeIcons[record.type] || FileText;
                        return (
                            <Card key={record.id}>
                                <CardContent style={styles.recordContent}>
                                    <View style={[styles.iconBox, { backgroundColor: typeColors[record.type] || Colors.muted }]}>
                                        <IconComp size={20} color={iconColors[record.type] || Colors.mutedForeground} strokeWidth={2.5} />
                                    </View>
                                    <View style={styles.recordInfo}>
                                        <Text style={styles.recordTitle}>{record.title}</Text>
                                        {record.description ? <Text style={styles.recordDesc}>{record.description}</Text> : null}
                                        <Text style={styles.recordDate}>{record.date}</Text>
                                    </View>
                                </CardContent>
                            </Card>
                        );
                    })
                )}
            </View>

            <Modal visible={modalOpen} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Add Health Record</Text>
                            <TouchableOpacity onPress={() => setModalOpen(false)}>
                                <X size={24} color={Colors.foreground} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
                            <Text style={styles.label}>Type</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={form.type}
                                    onValueChange={(v) => setForm(f => ({ ...f, type: v }))}
                                >
                                    <Picker.Item label="Vaccination" value="vaccination" />
                                    <Picker.Item label="Medication" value="medication" />
                                    <Picker.Item label="Vet Visit" value="vet_visit" />
                                    <Picker.Item label="Note" value="note" />
                                </Picker>
                            </View>

                            <Text style={styles.label}>Title</Text>
                            <TextInput style={styles.input} value={form.title} onChangeText={t => setForm(f => ({ ...f, title: t }))} placeholder="Rabies Shot" placeholderTextColor={Colors.mutedForeground} />

                            <Text style={styles.label}>Description</Text>
                            <TextInput style={[styles.input, { height: 100 }]} value={form.description} onChangeText={t => setForm(f => ({ ...f, description: t }))} multiline placeholder="Annual booster..." placeholderTextColor={Colors.mutedForeground} textAlignVertical="top" />

                            <Text style={styles.label}>Date</Text>
                            <TextInput style={styles.input} value={form.date} onChangeText={t => setForm(f => ({ ...f, date: t }))} placeholder="2024-02-26" placeholderTextColor={Colors.mutedForeground} />

                            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                                <Text style={styles.saveButtonText}>Save Record</Text>
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
    tabsContainer: {
        marginBottom: 24,
    },
    tabsScrollContent: {
        gap: 10,
        paddingRight: 20,
    },
    tab: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 25,
        backgroundColor: Colors.card,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    tabActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    tabText: {
        fontSize: 14,
        fontFamily: 'Nunito_700Bold',
        color: Colors.mutedForeground,
    },
    tabTextActive: {
        color: '#fff',
    },
    recordList: {
        gap: 4,
    },
    recordContent: {
        flexDirection: 'row',
        gap: 16,
        alignItems: 'flex-start',
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    recordInfo: {
        flex: 1,
    },
    recordTitle: {
        fontSize: 16,
        fontFamily: 'Nunito_700Bold',
        color: Colors.foreground,
    },
    recordDesc: {
        fontSize: 14,
        fontFamily: 'Nunito_400Regular',
        color: Colors.mutedForeground,
        marginTop: 4,
        lineHeight: 20,
    },
    recordDate: {
        fontSize: 12,
        fontFamily: 'Nunito_600SemiBold',
        color: Colors.mutedForeground,
        marginTop: 10,
        opacity: 0.8,
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
