import { Slot, Stack } from 'expo-router';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';
import { PetProvider } from '../src/contexts/PetContext';
import { useEffect, useState } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { ActivityIndicator, View, Platform, Text } from 'react-native';
import { registerForPushNotificationsAsync } from '../src/services/notifications';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import {
    useFonts,
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold
} from '@expo-google-fonts/nunito';

SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

function RootLayoutNav() {
    const { user, loading: authLoading } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    const [fontsLoaded, fontError] = useFonts({
        Nunito_400Regular,
        Nunito_600SemiBold,
        Nunito_700Bold,
        Nunito_800ExtraBold,
    });

    useEffect(() => {
        registerForPushNotificationsAsync();
    }, []);

    useEffect(() => {
        if (fontsLoaded || fontError) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontError]);

    useEffect(() => {
        if (authLoading || !fontsLoaded) return;

        const inAuthGroup = segments[0] === '(tabs)';

        if (!user && inAuthGroup) {
            // Redirect to login if NOT authenticated and trying to access tabs
            router.replace('/login');
        } else if (user && segments[0] === 'login') {
            // Redirect to home if authenticated and trying to access login
            router.replace('/(tabs)');
        }
    }, [user, authLoading, segments, fontsLoaded]);

    if (authLoading || !fontsLoaded) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    return (
        <PetProvider>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="login" options={{ title: 'Login' }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
        </PetProvider>
    );
}

export default function RootLayout() {
    return (
        <AuthProvider>
            <RootLayoutNav />
        </AuthProvider>
    );
}
