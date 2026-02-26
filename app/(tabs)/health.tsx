import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { usePets } from '../../src/contexts/PetContext';
import { Card, CardContent } from '../../src/components/Card';
import { Plus, Syringe, Pill, Stethoscope, FileText, X } from 'lucide-react-native';
import PetSwitcher from '../../src/components/PetSwitcher';
import { Picker } from '@react-native-picker/picker';

const typeIcons: Record<string, any> = {
    vaccination: Syringe,
    medication: Pill,
    vet_visit: Stethoscope,
    note: FileText,
};

const typeColors: Record<string, string> = {
    vaccination: '#f3e8ff', // lavender-ish
    medication: '#ecfdf5', // mint-ish
    vet_visit: '#f0f9ff', // sky-ish
    note: '#fff7ed', // peach-ish
};

const iconColors: Record<string, string> = {
    vaccination: '#9333ea',
    medication: '#059669',
    vet_visit: '#0284c7',
    note: '#ea580c',
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
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Health Records</Text>
                <TouchableOpacity style={styles.addButton} onPress={() => setModalOpen(true)}>
                    <Plus size={18} color="#fff" />
                    <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
            </View>

            <PetSwitcher />

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer}>
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
                                    <View style={[styles.iconBox, { backgroundColor: typeColors[record.type] || '#f3f4f6' }]}>
                                        <IconComp size={20} color={iconColors[record.type] || '#6b7280'} />
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
                                <X size={24} color="#000" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.form}>
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
                            <TextInput style={styles.input} value={form.title} onChangeText={t => setForm(f => ({ ...f, title: t }))} placeholder="Rabies Shot" />

                            <Text style={styles.label}>Description</Text>
                            <TextInput style={styles.input} value={form.description} onChangeText={t => setForm(f => ({ ...f, description: t }))} multiline placeholder="Annual booster..." />

                            <Text style={styles.label}>Date</Text>
                            <TextInput style={styles.input} value={form.date} onChangeText={t => setForm(f => ({ ...f, date: t }))} placeholder="2024-02-26" />

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
    tabsContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    tab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        backgroundColor: '#f3f4f6',
    },
    tabActive: {
        backgroundColor: '#000',
    },
    tabText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#4b5563',
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
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    recordInfo: {
        flex: 1,
    },
    recordTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
    },
    recordDesc: {
        fontSize: 13,
        color: '#6b7280',
        marginTop: 4,
    },
    recordDate: {
        fontSize: 11,
        color: '#9ca3af',
        marginTop: 8,
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
