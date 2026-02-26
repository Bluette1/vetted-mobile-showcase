import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { Colors } from '../constants/Colors';

const LoginScreen = ({ onSignupLink }: { onSignupLink: () => void }) => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await login(email, password);
        } catch (e: any) {
            setError(e.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image
                    source={require('../assets/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.title}>Welcome back</Text>
                <Text style={styles.subtitle}>Sign in to care for your pets</Text>
            </View>

            <View style={styles.form}>
                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder="you@example.com"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholderTextColor={Colors.mutedForeground}
                />

                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholderTextColor={Colors.mutedForeground}
                />

                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Sign In</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity onPress={onSignupLink}>
                    <Text style={styles.footerText}>
                        Don't have an account? <Text style={styles.linkText}>Sign up</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        backgroundColor: Colors.background,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 16,
    },
    title: {
        fontSize: 28,
        fontFamily: 'Nunito_800ExtraBold',
        color: Colors.foreground,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'Nunito_400Regular',
        color: Colors.mutedForeground,
        marginTop: 4,
    },
    form: {
        width: '100%',
    },
    label: {
        fontSize: 14,
        fontFamily: 'Nunito_700Bold',
        color: Colors.foreground,
        marginBottom: 8,
        marginTop: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        fontFamily: 'Nunito_400Regular',
        backgroundColor: Colors.card,
    },
    button: {
        backgroundColor: Colors.primary,
        borderRadius: 12,
        padding: 18,
        alignItems: 'center',
        marginTop: 32,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Nunito_700Bold',
    },
    errorText: {
        color: Colors.destructive,
        fontSize: 14,
        fontFamily: 'Nunito_600SemiBold',
        marginBottom: 16,
    },
    footerText: {
        textAlign: 'center',
        marginTop: 24,
        fontSize: 14,
        fontFamily: 'Nunito_400Regular',
        color: Colors.mutedForeground,
    },
    linkText: {
        color: Colors.primary,
        fontFamily: 'Nunito_700Bold',
    },
});

export default LoginScreen;
