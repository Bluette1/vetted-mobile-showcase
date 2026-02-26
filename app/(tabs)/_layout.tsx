import React from 'react';
import { Tabs } from 'expo-router';
import { Home, PawPrint, HeartPulse, Bell, MoreHorizontal } from 'lucide-react-native';
import { Colors } from '../../src/constants/Colors';

export default function TabLayout() {
    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: Colors.primary,
            tabBarInactiveTintColor: Colors.mutedForeground,
            tabBarStyle: {
                borderTopWidth: 1,
                borderTopColor: Colors.border,
                height: 65,
                paddingBottom: 10,
                paddingTop: 10,
                backgroundColor: '#fff',
            },
            tabBarLabelStyle: {
                fontFamily: 'Nunito_700Bold',
                fontSize: 11,
            },
            headerShown: true,
            headerStyle: {
                backgroundColor: '#fff',
                elevation: 0,
                shadowOpacity: 0,
                borderBottomWidth: 1,
                borderBottomColor: Colors.border,
            },
            headerTitleStyle: {
                fontFamily: 'Nunito_800ExtraBold',
                fontSize: 18,
                color: Colors.foreground,
            },
        }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <Home size={22} color={color} strokeWidth={2.5} />,
                }}
            />
            <Tabs.Screen
                name="pets"
                options={{
                    title: 'Pets',
                    tabBarIcon: ({ color }) => <PawPrint size={22} color={color} strokeWidth={2.5} />,
                }}
            />
            <Tabs.Screen
                name="health"
                options={{
                    title: 'Health',
                    tabBarIcon: ({ color }) => <HeartPulse size={22} color={color} strokeWidth={2.5} />,
                }}
            />
            <Tabs.Screen
                name="reminders"
                options={{
                    title: 'Reminders',
                    tabBarIcon: ({ color }) => <Bell size={22} color={color} strokeWidth={2.5} />,
                }}
            />
            <Tabs.Screen
                name="more"
                options={{
                    title: 'More',
                    tabBarIcon: ({ color }) => <MoreHorizontal size={22} color={color} strokeWidth={2.5} />,
                }}
            />
        </Tabs>
    );
}
