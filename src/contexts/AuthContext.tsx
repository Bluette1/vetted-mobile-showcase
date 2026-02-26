import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkToken = async () => {
            try {
                const token = await AsyncStorage.getItem('vetted_token');
                if (token) {
                    const u = await api.getUser();
                    setUser(u);
                }
            } catch (error) {
                await AsyncStorage.removeItem('vetted_token');
            } finally {
                setLoading(false);
            }
        };
        checkToken();
    }, []);

    const login = async (email: string, password: string) => {
        const { user: u, token } = await api.login(email, password);
        await AsyncStorage.setItem('vetted_token', token);
        setUser(u);
    };

    const signup = async (name: string, email: string, password: string) => {
        const { user: u, token } = await api.signup(name, email, password);
        await AsyncStorage.setItem('vetted_token', token);
        setUser(u);
    };

    const logout = async () => {
        try {
            await api.logout();
        } catch (e) {
            // Ignore logout errors
        }
        setUser(null);
        await AsyncStorage.removeItem('vetted_token');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
