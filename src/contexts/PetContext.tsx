import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Pet, HealthRecord, Reminder, WellnessEntry, TrainingGoal, Insight } from '../types';
import { api } from '../services/api';

interface PetContextType {
    pets: Pet[];
    activePet: Pet | null;
    setActivePetId: (id: string) => void;
    addPet: (pet: Omit<Pet, 'id'>) => void;
    updatePet: (pet: Pet) => void;
    healthRecords: HealthRecord[];
    addHealthRecord: (r: Omit<HealthRecord, 'id'>) => void;
    reminders: Reminder[];
    addReminder: (r: Omit<Reminder, 'id'>) => void;
    updateReminder: (r: Reminder) => void;
    wellnessEntries: WellnessEntry[];
    addWellnessEntry: (e: Omit<WellnessEntry, 'id'>) => void;
    trainingGoals: TrainingGoal[];
    addTrainingGoal: (g: Omit<TrainingGoal, 'id'>) => void;
    recordGoalProgress: (id: string) => Promise<void>;
    deleteTrainingGoal: (id: string) => Promise<void>;
    insights: Insight[];
    loading: boolean;
}

const PetContext = createContext<PetContextType | undefined>(undefined);

export const PetProvider = ({ children }: { children: ReactNode }) => {
    const [pets, setPets] = useState<Pet[]>([]);
    const [activePetId, setActivePetId] = useState('');
    const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [wellnessEntries, setWellnessEntries] = useState<WellnessEntry[]>([]);
    const [trainingGoals, setTrainingGoals] = useState<TrainingGoal[]>([]);
    const [insights, setInsights] = useState<Insight[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch pets on mount
    useEffect(() => {
        const fetchPets = async () => {
            try {
                const data = await api.getPets();
                setPets(data);
                if (data.length > 0) setActivePetId(data[0].id);
            } catch (e) {
                console.error('Failed to fetch pets', e);
            } finally {
                setLoading(false);
            }
        };
        fetchPets();
    }, []);

    // Fetch pet-specific data when active pet changes
    useEffect(() => {
        if (!activePetId) return;
        const fetchData = async () => {
            try {
                const [hr, rm, we, tg, ins] = await Promise.all([
                    api.getHealthRecords(activePetId),
                    api.getReminders(activePetId),
                    api.getWellnessEntries(activePetId),
                    api.getTrainingGoals(activePetId),
                    api.getInsights(activePetId),
                ]);
                setHealthRecords(hr);
                setReminders(rm);
                setWellnessEntries(we);
                setTrainingGoals(tg);
                setInsights(ins);
            } catch (e) {
                console.error('Failed to fetch pet data', e);
            }
        };
        fetchData();
    }, [activePetId]);

    const activePet = pets.find(p => p.id === activePetId) || null;

    const addPet = async (pet: Omit<Pet, 'id'>) => {
        const newPet = await api.addPet(pet);
        setPets(prev => [...prev, newPet]);
    };

    const updatePet = async (pet: Pet) => {
        const updated = await api.updatePet(pet);
        setPets(prev => prev.map(p => p.id === updated.id ? updated : p));
    };

    const addHealthRecord = async (r: Omit<HealthRecord, 'id'>) => {
        const record = await api.addHealthRecord(r);
        setHealthRecords(prev => [record, ...prev]);
    };

    const addReminder = async (r: Omit<Reminder, 'id'>) => {
        const reminder = await api.addReminder(r);
        setReminders(prev => [...prev, reminder]);
    };

    const updateReminder = async (r: Reminder) => {
        const updated = await api.updateReminder(r);
        setReminders(prev => prev.map(x => x.id === updated.id ? updated : x));
    };

    const addWellnessEntry = async (e: Omit<WellnessEntry, 'id'>) => {
        const entry = await api.addWellnessEntry(e);
        setWellnessEntries(prev => [...prev, entry]);
        if (activePetId) {
            api.getInsights(activePetId).then(setInsights).catch(console.error);
        }
    };

    const addTrainingGoal = async (g: Omit<TrainingGoal, 'id'>) => {
        const goal = await api.addTrainingGoal(g);
        setTrainingGoals(prev => [...prev, goal]);
    };

    const recordGoalProgress = async (id: string) => {
        const updated = await api.recordGoalProgress(id);
        setTrainingGoals(prev => prev.map(x => x.id === updated.id ? updated : x));
    };

    const deleteTrainingGoal = async (id: string) => {
        await api.deleteTrainingGoal(id);
        setTrainingGoals(prev => prev.filter(x => x.id !== id));
    };

    return (
        <PetContext.Provider value={{
            pets, activePet, setActivePetId, addPet, updatePet,
            healthRecords, addHealthRecord,
            reminders, addReminder, updateReminder,
            wellnessEntries, addWellnessEntry,
            trainingGoals, addTrainingGoal,
            recordGoalProgress, deleteTrainingGoal,
            insights, loading,
        }}>
            {children}
        </PetContext.Provider>
    );
};

export const usePets = () => {
    const ctx = useContext(PetContext);
    if (!ctx) throw new Error('usePets must be used within PetProvider');
    return ctx;
};
