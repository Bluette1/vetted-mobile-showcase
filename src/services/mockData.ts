import type { Pet, HealthRecord, Reminder, WellnessEntry, TrainingGoal, Insight } from '../types';

export const mockPets: Pet[] = [
    {
        id: '1',
        name: 'Luna',
        species: 'dog',
        breed: 'Golden Retriever',
        dob: '2021-03-15',
        weight: 28,
        weightHistory: [
            { date: '2025-09-01', weight: 26 },
            { date: '2025-10-01', weight: 27 },
            { date: '2025-11-01', weight: 27.5 },
            { date: '2025-12-01', weight: 28 },
            { date: '2026-01-01', weight: 28 },
            { date: '2026-02-01', weight: 28 },
        ],
        notes: 'Loves belly rubs and playing fetch',
        avatar: '🐕',
    },
    {
        id: '2',
        name: 'Mochi',
        species: 'cat',
        breed: 'British Shorthair',
        dob: '2022-08-20',
        weight: 5.2,
        weightHistory: [
            { date: '2025-09-01', weight: 4.8 },
            { date: '2025-10-01', weight: 5.0 },
            { date: '2025-11-01', weight: 5.1 },
            { date: '2025-12-01', weight: 5.2 },
            { date: '2026-01-01', weight: 5.2 },
            { date: '2026-02-01', weight: 5.2 },
        ],
        notes: 'Enjoys sunbeams and chin scratches',
        avatar: '🐈',
    },
];

export const mockHealthRecords: HealthRecord[] = [
    { id: 'h1', petId: '1', type: 'vaccination', title: 'Rabies Vaccine', description: 'Annual rabies booster', date: '2026-01-15' },
    { id: 'h2', petId: '1', type: 'vet_visit', title: 'Annual Checkup', description: 'All clear — healthy and happy!', date: '2026-01-15' },
    { id: 'h3', petId: '1', type: 'medication', title: 'Flea Prevention', description: 'Monthly flea and tick treatment', date: '2026-02-01' },
    { id: 'h4', petId: '2', type: 'vaccination', title: 'FVRCP Vaccine', description: 'Core vaccine booster', date: '2025-12-10' },
    { id: 'h5', petId: '2', type: 'note', title: 'Slight sneezing', description: 'Noticed occasional sneezing, monitoring', date: '2026-02-05' },
];

export const mockReminders: Reminder[] = [
    { id: 'r1', petId: '1', title: 'Flea treatment', type: 'medication', date: '2026-02-15', time: '09:00', recurring: true, completed: false, snoozed: false },
    { id: 'r2', petId: '1', title: 'Annual checkup', type: 'custom', date: '2026-03-15', time: '14:00', recurring: false, completed: false, snoozed: false },
    { id: 'r3', petId: '2', title: 'Deworming', type: 'medication', date: '2026-02-20', time: '10:00', recurring: true, completed: false, snoozed: false },
    { id: 'r4', petId: '1', title: 'Rabies booster', type: 'vaccination', date: '2027-01-15', time: '10:00', recurring: false, completed: false, snoozed: false },
];

const generateWellnessData = (petId: string): WellnessEntry[] => {
    const entries: WellnessEntry[] = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        entries.push({
            id: `w-${petId}-${i}`,
            petId,
            date: date.toISOString().split('T')[0],
            appetite: Math.floor(Math.random() * 3) + 3,
            energy: Math.floor(Math.random() * 3) + 3,
            mood: Math.floor(Math.random() * 3) + 3,
            bathroom: Math.floor(Math.random() * 2) + 4,
            activity: Math.floor(Math.random() * 3) + 3,
            notes: '',
        });
    }
    return entries;
};

export const mockWellnessEntries: WellnessEntry[] = [
    ...generateWellnessData('1'),
    ...generateWellnessData('2'),
];

export const mockTrainingGoals: TrainingGoal[] = [
    { id: 't1', petId: '1', title: 'Leash walking', type: 'habit', targetCount: 7, currentCount: 5, completed: false },
    { id: 't2', petId: '1', title: 'Sit & stay', type: 'skill', targetCount: 7, currentCount: 4, completed: false },
    { id: 't3', petId: '2', title: 'Litter box routine', type: 'habit', targetCount: 7, currentCount: 6, completed: false },
];

export const mockInsights: Insight[] = [
    { id: 'i1', petId: '1', message: "Luna's energy levels have been consistently high this week — great job keeping her active! 🎉", type: 'info', icon: '⚡', date: '2026-02-11' },
    { id: 'i2', petId: '1', message: "Flea treatment is due in 4 days. Make sure you have it ready!", type: 'gentle_alert', icon: '💊', date: '2026-02-11' },
    { id: 'i3', petId: '2', message: "Mochi's appetite has been steady — she seems to be doing well.", type: 'info', icon: '😸', date: '2026-02-11' },
];
