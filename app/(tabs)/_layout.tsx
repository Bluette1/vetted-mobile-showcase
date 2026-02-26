import React from 'react';
import { Tabs } from 'expo-router';
import { Home, PawPrint, HeartPulse, Bell, MoreHorizontal } from 'lucide-react-native';

export default function TabLayout() {
    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: '#3b82f6',
            tabBarInactiveTintColor: '#6b7280',
            tabBarStyle: {
                borderTopWidth: 1,
                borderTopColor: '#e5e7eb',
                height: 60,
                paddingBottom: 8,
                paddingTop: 8,
            },
            headerShown: true,
            headerStyle: {
                backgroundColor: '#fff',
            },
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <Home size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="pets"
                options={{
                    title: 'Pets',
                    tabBarIcon: ({ color }) => <PawPrint size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="health"
                options={{
                    title: 'Health',
                    tabBarIcon: ({ color }) => <HeartPulse size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="reminders"
                options={{
                    title: 'Reminders',
                    tabBarIcon: ({ color }) => <Bell size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="more"
                options={{
                    title: 'More',
                    tabBarIcon: ({ color }) => <MoreHorizontal size={24} color={color} />,
                }}
            />
        </Tabs>
    );
}
