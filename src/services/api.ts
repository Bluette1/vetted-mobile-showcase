/**
 * API Service Layer for Mobile — connects to the Laravel backend.
 * Falls back to mock data for portfolio/showcase purposes.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Pet, HealthRecord, Reminder, WellnessEntry, TrainingGoal, Insight, User } from '../types';
import * as mock from './mockData';

// Set to true to always use mock data, or false to try the real API
const USE_MOCK = true;

// Use your computer's local IP for real device testing, or 10.0.2.2 for Android Emulator
const BASE = 'http://10.0.2.2:8000/api';

const getToken = async () => await AsyncStorage.getItem('vetted_token') || '';

const getHeaders = async (extra: Record<string, string> = {}) => {
    const token = await getToken();
    return {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...extra,
    };
};

const handleResponse = async <T>(res: Response): Promise<T> => {
    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `API error ${res.status}`);
    }
    const json = await res.json();
    return json.data !== undefined ? json.data : json;
};

// Helper to delay response for simulation
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const api = {
    // ── Auth ──
    async login(email: string, password: string): Promise<{ user: User; token: string }> {
        if (USE_MOCK) {
            await delay(800);
            return {
                user: { id: 'u1', name: 'Mary Showcase', email: 'mary@example.com' },
                token: 'mock_token'
            };
        }
        const res = await fetch(`${BASE}/login`, {
            method: 'POST',
            headers: await getHeaders(),
            body: JSON.stringify({ email, password }),
        });
        return handleResponse(res);
    },

    async signup(name: string, email: string, password: string): Promise<{ user: User; token: string }> {
        if (USE_MOCK) {
            await delay(800);
            return {
                user: { id: 'u1', name, email },
                token: 'mock_token'
            };
        }
        const res = await fetch(`${BASE}/register`, {
            method: 'POST',
            headers: await getHeaders(),
            body: JSON.stringify({ name, email, password, password_confirmation: password }),
        });
        return handleResponse(res);
    },

    async logout(): Promise<void> {
        if (USE_MOCK) return;
        await fetch(`${BASE}/logout`, { method: 'POST', headers: await getHeaders() }).catch(() => { });
    },

    async getUser(): Promise<User> {
        if (USE_MOCK) {
            return { id: 'u1', name: 'Mary Showcase', email: 'mary@example.com' };
        }
        const res = await fetch(`${BASE}/user`, { headers: await getHeaders() });
        return handleResponse(res);
    },

    // ── Pets ──
    async getPets(): Promise<Pet[]> {
        if (USE_MOCK) {
            await delay(500);
            return mock.mockPets;
        }
        try {
            const res = await fetch(`${BASE}/pets`, { headers: await getHeaders() });
            return await handleResponse(res);
        } catch (e) {
            console.warn('API failed, falling back to mock data:', e);
            return mock.mockPets;
        }
    },

    async addPet(pet: Omit<Pet, 'id'>): Promise<Pet> {
        if (USE_MOCK) {
            return { ...pet, id: Math.random().toString() } as Pet;
        }
        const res = await fetch(`${BASE}/pets`, {
            method: 'POST',
            headers: await getHeaders(),
            body: JSON.stringify(pet),
        });
        return handleResponse(res);
    },

    async updatePet(pet: Pet): Promise<Pet> {
        if (USE_MOCK) return pet;
        const res = await fetch(`${BASE}/pets/${pet.id}`, {
            method: 'PUT',
            headers: await getHeaders(),
            body: JSON.stringify(pet),
        });
        return handleResponse(res);
    },

    async deletePet(id: string): Promise<void> {
        if (USE_MOCK) return;
        const res = await fetch(`${BASE}/pets/${id}`, { method: 'DELETE', headers: await getHeaders() });
        return handleResponse(res);
    },

    async getPetTrends(id: string): Promise<any> {
        if (USE_MOCK) {
            const pet = mock.mockPets.find(p => p.id === id);
            return pet?.weightHistory || [];
        }
        const res = await fetch(`${BASE}/pets/${id}/trends`, { headers: await getHeaders() });
        return handleResponse(res);
    },

    // ── Health Records ──
    async getHealthRecords(petId: string): Promise<HealthRecord[]> {
        if (USE_MOCK) {
            return mock.mockHealthRecords.filter(r => r.petId === petId);
        }
        try {
            const res = await fetch(`${BASE}/pets/${petId}/health-records`, { headers: await getHeaders() });
            return await handleResponse(res);
        } catch (e) {
            return mock.mockHealthRecords.filter(r => r.petId === petId);
        }
    },

    async addHealthRecord(record: Omit<HealthRecord, 'id'>): Promise<HealthRecord> {
        if (USE_MOCK) {
            return { ...record, id: Math.random().toString() } as HealthRecord;
        }
        const res = await fetch(`${BASE}/pets/${record.petId}/health-records`, {
            method: 'POST',
            headers: await getHeaders(),
            body: JSON.stringify(record),
        });
        return handleResponse(res);
    },

    async updateHealthRecord(record: HealthRecord): Promise<HealthRecord> {
        if (USE_MOCK) return record;
        const res = await fetch(`${BASE}/health-records/${record.id}`, {
            method: 'PUT',
            headers: await getHeaders(),
            body: JSON.stringify(record),
        });
        return handleResponse(res);
    },

    async deleteHealthRecord(id: string): Promise<void> {
        if (USE_MOCK) return;
        const res = await fetch(`${BASE}/health-records/${id}`, { method: 'DELETE', headers: await getHeaders() });
        return handleResponse(res);
    },

    // ── Reminders ──
    async getReminders(petId: string): Promise<Reminder[]> {
        if (USE_MOCK) {
            return mock.mockReminders.filter(r => r.petId === petId);
        }
        try {
            const res = await fetch(`${BASE}/pets/${petId}/reminders`, { headers: await getHeaders() });
            return await handleResponse(res);
        } catch (e) {
            return mock.mockReminders.filter(r => r.petId === petId);
        }
    },

    async addReminder(reminder: Omit<Reminder, 'id'>): Promise<Reminder> {
        if (USE_MOCK) {
            return { ...reminder, id: Math.random().toString(), completed: false, snoozed: false } as Reminder;
        }
        const res = await fetch(`${BASE}/pets/${reminder.petId}/reminders`, {
            method: 'POST',
            headers: await getHeaders(),
            body: JSON.stringify(reminder),
        });
        return handleResponse(res);
    },

    async updateReminder(reminder: Reminder): Promise<Reminder> {
        if (USE_MOCK) return reminder;
        const res = await fetch(`${BASE}/reminders/${reminder.id}`, {
            method: 'PUT',
            headers: await getHeaders(),
            body: JSON.stringify(reminder),
        });
        return handleResponse(res);
    },

    async deleteReminder(id: string): Promise<void> {
        if (USE_MOCK) return;
        const res = await fetch(`${BASE}/reminders/${id}`, { method: 'DELETE', headers: await getHeaders() });
        return handleResponse(res);
    },

    // ── Wellness ──
    async getWellnessEntries(petId: string): Promise<WellnessEntry[]> {
        if (USE_MOCK) {
            return mock.mockWellnessEntries.filter(e => e.petId === petId);
        }
        const res = await fetch(`${BASE}/pets/${petId}/wellness`, { headers: await getHeaders() });
        return handleResponse(res);
    },

    async addWellnessEntry(entry: Omit<WellnessEntry, 'id'>): Promise<WellnessEntry> {
        if (USE_MOCK) {
            return { ...entry, id: Math.random().toString() } as WellnessEntry;
        }
        const res = await fetch(`${BASE}/pets/${entry.petId}/wellness`, {
            method: 'POST',
            headers: await getHeaders(),
            body: JSON.stringify(entry),
        });
        return handleResponse(res);
    },

    // ── Training ──
    async getTrainingGoals(petId: string): Promise<TrainingGoal[]> {
        if (USE_MOCK) {
            return mock.mockTrainingGoals.filter(g => g.petId === petId);
        }
        const res = await fetch(`${BASE}/pets/${petId}/goals`, { headers: await getHeaders() });
        return handleResponse(res);
    },

    async addTrainingGoal(goal: Omit<TrainingGoal, 'id'>): Promise<TrainingGoal> {
        if (USE_MOCK) {
            return { ...goal, id: Math.random().toString() } as TrainingGoal;
        }
        const res = await fetch(`${BASE}/pets/${goal.petId}/goals`, {
            method: 'POST',
            headers: await getHeaders(),
            body: JSON.stringify(goal),
        });
        return handleResponse(res);
    },

    async recordGoalProgress(goalId: string): Promise<TrainingGoal> {
        if (USE_MOCK) {
            const goal = mock.mockTrainingGoals.find(g => g.id === goalId);
            if (goal) goal.currentCount++;
            return goal as TrainingGoal;
        }
        const res = await fetch(`${BASE}/goals/${goalId}/progress`, {
            method: 'POST',
            headers: await getHeaders(),
        });
        return handleResponse(res);
    },

    async deleteTrainingGoal(id: string): Promise<void> {
        if (USE_MOCK) return;
        const res = await fetch(`${BASE}/goals/${id}`, { method: 'DELETE', headers: await getHeaders() });
        return handleResponse(res);
    },

    // ── Insights ──
    async getInsights(petId: string): Promise<Insight[]> {
        if (USE_MOCK) {
            return mock.mockInsights.filter(i => i.petId === petId);
        }
        try {
            const res = await fetch(`${BASE}/pets/${petId}/insights`, { headers: await getHeaders() });
            return await handleResponse(res);
        } catch (e) {
            return mock.mockInsights.filter(i => i.petId === petId);
        }
    },

    // ── Sharing ──
    async generateShareLink(petId: string) {
        if (USE_MOCK) {
            return { url: `https://vetted.app/share/pet/${petId}` };
        }
        const res = await fetch(`${BASE}/pets/${petId}/share`, {
            method: 'POST',
            headers: await getHeaders(),
        });
        return handleResponse(res);
    }
};
