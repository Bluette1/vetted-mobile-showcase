import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Dimensions } from 'react-native';
import { usePets } from '../../src/contexts/PetContext';
import { Card, CardContent } from '../../src/components/Card';
import { Plus, Edit2, X } from 'lucide-react-native';
import PetSwitcher from '../../src/components/PetSwitcher';
import { LineChart } from 'react-native-chart-kit';
import { Picker } from '@react-native-picker/picker';
import { Colors } from '../../src/constants/Colors';

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
            color: (opacity = 1) => Colors.primary,
            strokeWidth: 3
        }],
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
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
                                    <View style={styles.avatarCircle}>
                                        <Text style={styles.avatar}>{activePet.avatar}</Text>
                                    </View>
                                    <View>
                                        <Text style={styles.petName}>{activePet.name}</Text>
                                        <Text style={styles.petSubtitle}>{activePet.species} · {activePet.breed}</Text>
                                    </View>
                                </View>
                                <TouchableOpacity style={styles.editIcon} onPress={openEdit}>
                                    <View style={styles.editIconCircle}>
                                        <Edit2 size={16} color={Colors.mutedForeground} />
                                    </View>
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
                                <Text style={styles.cardHeader}>Weight History (kg)</Text>
                                <LineChart
                                    data={chartData}
                                    width={screenWidth - 72}
                                    height={180}
                                    chartConfig={{
                                        backgroundColor: '#fff',
                                        backgroundGradientFrom: '#fff',
                                        backgroundGradientTo: '#fff',
                                        decimalPlaces: 1,
                                        color: (opacity = 1) => Colors.primary,
                                        labelColor: (opacity = 1) => Colors.mutedForeground,
                                        style: { borderRadius: 16 },
                                        propsForDots: { r: "5", strokeWidth: "2", stroke: Colors.primary },
                                        propsForBackgroundLines: { stroke: Colors.border, strokeDasharray: "" }
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
                                <X size={24} color={Colors.foreground} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
                            <Text style={styles.label}>Name</Text>
                            <TextInput style={styles.input} value={form.name} onChangeText={t => setForm(f => ({ ...f, name: t }))} placeholder="Pet Name" placeholderTextColor={Colors.mutedForeground} />

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
                            <TextInput style={styles.input} value={form.breed} onChangeText={t => setForm(f => ({ ...f, breed: t }))} placeholder="Golden Retriever" placeholderTextColor={Colors.mutedForeground} />

                            <Text style={styles.label}>Date of Birth</Text>
                            <TextInput style={styles.input} value={form.dob} onChangeText={t => setForm(f => ({ ...f, dob: t }))} placeholder="2022-05-15" placeholderTextColor={Colors.mutedForeground} />

                            <Text style={styles.label}>Weight (kg)</Text>
                            <TextInput style={styles.input} value={form.weight} onChangeText={t => setForm(f => ({ ...f, weight: t }))} keyboardType="numeric" placeholder="12.5" placeholderTextColor={Colors.mutedForeground} />

                            <Text style={styles.label}>Notes</Text>
                            <TextInput style={[styles.input, { height: 100 }]} value={form.notes} onChangeText={t => setForm(f => ({ ...f, notes: t }))} multiline placeholder="Favorite treat is apple..." placeholderTextColor={Colors.mutedForeground} textAlignVertical="top" />

                            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                                <Text style={styles.saveButtonText}>Save Details</Text>
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
    petItemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    petInfoMain: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    avatarCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Colors.muted,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        fontSize: 32,
    },
    petName: {
        fontSize: 20,
        fontFamily: 'Nunito_800ExtraBold',
        color: Colors.foreground,
    },
    petSubtitle: {
        fontSize: 15,
        fontFamily: 'Nunito_400Regular',
        color: Colors.mutedForeground,
        textTransform: 'capitalize',
    },
    editIconCircle: {
        padding: 10,
        borderRadius: 20,
        backgroundColor: Colors.muted,
    },
    statsGrid: {
        flexDirection: 'row',
        gap: 10,
    },
    statBox: {
        flex: 1,
        backgroundColor: Colors.secondary,
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 11,
        fontFamily: 'Nunito_700Bold',
        color: Colors.foreground,
        opacity: 0.6,
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    statValue: {
        fontSize: 15,
        fontFamily: 'Nunito_800ExtraBold',
        color: Colors.foreground,
    },
    notes: {
        fontSize: 14,
        fontFamily: 'Nunito_400Regular',
        color: Colors.mutedForeground,
        fontStyle: 'italic',
        marginTop: 20,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        paddingTop: 16,
    },
    cardHeader: {
        fontSize: 16,
        fontFamily: 'Nunito_700Bold',
        color: Colors.foreground,
        marginBottom: 16,
    },
    chart: {
        marginLeft: -16,
        borderRadius: 16,
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
        height: '92%',
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
