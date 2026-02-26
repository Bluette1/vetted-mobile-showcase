import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Dimensions } from 'react-native';
import { usePets } from '../../src/contexts/PetContext';
import { Card, CardContent } from '../../src/components/Card';
import { Plus, Edit2, X } from 'lucide-react-native';
import PetSwitcher from '../../src/components/PetSwitcher';
import { LineChart } from 'react-native-chart-kit';
import { Picker } from '@react-native-picker/picker';

const screenWidth = Dimensions.get('window').width;

export default function PetsScreen() {
    const { pets, activePet, addPet, updatePet } = usePets();
    const [modalOpen, setModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({
        name: '',
        species: 'dog' as 'dog' | 'cat',
        breed: '',
        dob: '',
        weight: '',
        notes: ''
    });

    const openAdd = () => {
        setEditMode(false);
        setForm({ name: '', species: 'dog', breed: '', dob: '', weight: '', notes: '' });
        setModalOpen(true);
    };

    const openEdit = () => {
        if (!activePet) return;
        setEditMode(true);
        setForm({
            name: activePet.name,
            species: activePet.species,
            breed: activePet.breed,
            dob: activePet.dob,
            weight: String(activePet.weight),
            notes: activePet.notes
        });
        setModalOpen(true);
    };

    const handleSave = () => {
        if (editMode && activePet) {
            updatePet({ ...activePet, ...form, weight: Number(form.weight) });
        } else {
            addPet({
                ...form,
                weight: Number(form.weight),
                weightHistory: [{ date: new Date().toISOString().split('T')[0], weight: Number(form.weight) }],
                avatar: form.species === 'dog' ? '🐕' : '🐈'
            });
        }
        setModalOpen(false);
    };

    const chartData = {
        labels: (activePet?.weightHistory || []).slice(-5).map(h => h.date.split('-').slice(1).join('/')),
        datasets: [{
            data: (activePet?.weightHistory || []).slice(-5).map(h => h.weight),
            color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
            strokeWidth: 2
        }],
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>My Pets</Text>
                <TouchableOpacity style={styles.addButton} onPress={openAdd}>
                    <Plus size={18} color="#fff" />
                    <Text style={styles.addButtonText}>Add Pet</Text>
                </TouchableOpacity>
            </View>

            <PetSwitcher />

            {activePet && (
                <>
                    <Card>
                        <CardContent>
                            <View style={styles.petItemHeader}>
                                <View style={styles.petInfoMain}>
                                    <Text style={styles.avatar}>{activePet.avatar}</Text>
                                    <View>
                                        <Text style={styles.petName}>{activePet.name}</Text>
                                        <Text style={styles.petSubtitle}>{activePet.species} · {activePet.breed}</Text>
                                    </View>
                                </View>
                                <TouchableOpacity style={styles.editIcon} onPress={openEdit}>
                                    <Edit2 size={16} color="#6b7280" />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.statsGrid}>
                                <View style={styles.statBox}>
                                    <Text style={styles.statLabel}>Weight</Text>
                                    <Text style={styles.statValue}>{activePet.weight} kg</Text>
                                </View>
                                <View style={styles.statBox}>
                                    <Text style={styles.statLabel}>Born</Text>
                                    <Text style={styles.statValue}>{activePet.dob}</Text>
                                </View>
                                <View style={styles.statBox}>
                                    <Text style={styles.statLabel}>Species</Text>
                                    <Text style={[styles.statValue, { textTransform: 'capitalize' }]}>{activePet.species}</Text>
                                </View>
                            </View>

                            {activePet.notes ? (
                                <Text style={styles.notes}>"{activePet.notes}"</Text>
                            ) : null}
                        </CardContent>
                    </Card>

                    {activePet.weightHistory && activePet.weightHistory.length > 0 && (
                        <Card>
                            <CardContent>
                                <Text style={styles.cardHeader}>Weight History</Text>
                                <LineChart
                                    data={chartData}
                                    width={screenWidth - 64}
                                    height={180}
                                    chartConfig={{
                                        backgroundColor: '#fff',
                                        backgroundGradientFrom: '#fff',
                                        backgroundGradientTo: '#fff',
                                        decimalPlaces: 1,
                                        color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                                        labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                                        style: { borderRadius: 16 },
                                        propsForDots: { r: "4", strokeWidth: "2", stroke: "#3b82f6" }
                                    }}
                                    bezier
                                    style={styles.chart}
                                />
                            </CardContent>
                        </Card>
                    )}
                </>
            )}

            {/* Add/Edit Modal */}
            <Modal visible={modalOpen} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{editMode ? 'Edit Pet' : 'Add New Pet'}</Text>
                            <TouchableOpacity onPress={() => setModalOpen(false)}>
                                <X size={24} color="#000" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.form}>
                            <Text style={styles.label}>Name</Text>
                            <TextInput style={styles.input} value={form.name} onChangeText={t => setForm(f => ({ ...f, name: t }))} placeholder="Pet Name" />

                            <Text style={styles.label}>Species</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={form.species}
                                    onValueChange={(v) => setForm(f => ({ ...f, species: v }))}
                                >
                                    <Picker.Item label="Dog 🐕" value="dog" />
                                    <Picker.Item label="Cat 🐈" value="cat" />
                                </Picker>
                            </View>

                            <Text style={styles.label}>Breed</Text>
                            <TextInput style={styles.input} value={form.breed} onChangeText={t => setForm(f => ({ ...f, breed: t }))} placeholder="Golden Retriever" />

                            <Text style={styles.label}>Date of Birth</Text>
                            <TextInput style={styles.input} value={form.dob} onChangeText={t => setForm(f => ({ ...f, dob: t }))} placeholder="2022-05-15" />

                            <Text style={styles.label}>Weight (kg)</Text>
                            <TextInput style={styles.input} value={form.weight} onChangeText={t => setForm(f => ({ ...f, weight: t }))} keyboardType="numeric" placeholder="12.5" />

                            <Text style={styles.label}>Notes</Text>
                            <TextInput style={[styles.input, { height: 80 }]} value={form.notes} onChangeText={t => setForm(f => ({ ...f, notes: t }))} multiline placeholder="Favorite treat is apple..." />

                            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                                <Text style={styles.saveButtonText}>Save</Text>
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
        color: '#000',
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
    petItemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    petInfoMain: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    avatar: {
        fontSize: 40,
    },
    petName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
    },
    petSubtitle: {
        fontSize: 14,
        color: '#6b7280',
        textTransform: 'capitalize',
    },
    editIcon: {
        padding: 8,
    },
    statsGrid: {
        flexDirection: 'row',
        gap: 8,
    },
    statBox: {
        flex: 1,
        backgroundColor: '#f9fafb',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#f3f4f6',
    },
    statLabel: {
        fontSize: 11,
        color: '#6b7280',
        marginBottom: 4,
    },
    statValue: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1f2937',
    },
    notes: {
        fontSize: 14,
        color: '#6b7280',
        fontStyle: 'italic',
        marginTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
        paddingTop: 12,
    },
    cardHeader: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 16,
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
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
        height: '90%',
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
