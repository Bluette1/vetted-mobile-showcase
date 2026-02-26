import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import { Card, CardContent } from '../../src/components/Card';
import { LogOut, User, Settings, Shield, HelpCircle, ChevronRight } from 'lucide-react-native';
import { Colors } from '../../src/constants/Colors';

export default function MoreScreen() {
    const { logout, user } = useAuth();

    const handleLogout = () => {
        Alert.alert(
            "Sign Out",
            "Are you sure you want to sign out?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Sign Out", onPress: logout, style: "destructive" }
            ]
        );
    };

    const MenuItem = ({ icon: Icon, title, onPress, color = Colors.foreground }: any) => (
        <TouchableOpacity style={styles.menuItem} onPress={onPress}>
            <View style={styles.menuItemLeft}>
                <View style={[styles.iconCircle, { backgroundColor: Colors.muted }]}>
                    <Icon size={20} color={color} />
                </View>
                <Text style={styles.menuItemTitle}>{title}</Text>
            </View>
            <ChevronRight size={20} color={Colors.mutedForeground} />
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.profileSection}>
                <View style={styles.avatarLarge}>
                    <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'U'}</Text>
                </View>
                <Text style={styles.userName}>{user?.name || 'User'}</Text>
                <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
                <TouchableOpacity style={styles.editProfileButton}>
                    <Text style={styles.editProfileText}>Edit Profile</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Account</Text>
                <Card>
                    <CardContent style={{ padding: 0 }}>
                        <MenuItem icon={User} title="Personal Information" />
                        <View style={styles.separator} />
                        <MenuItem icon={Shield} title="Security & Privacy" />
                        <View style={styles.separator} />
                        <MenuItem icon={Settings} title="App Settings" />
                    </CardContent>
                </Card>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Support</Text>
                <Card>
                    <CardContent style={{ padding: 0 }}>
                        <MenuItem icon={HelpCircle} title="Help Center" />
                        <View style={styles.separator} />
                        <MenuItem icon={Shield} title="Terms of Service" />
                    </CardContent>
                </Card>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <LogOut size={20} color={Colors.destructive} />
                <Text style={styles.logoutButtonText}>Sign Out</Text>
            </TouchableOpacity>

            <Text style={styles.versionText}>Version 1.0.0 (Build 1)</Text>
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
    profileSection: {
        alignItems: 'center',
        marginVertical: 30,
    },
    avatarLarge: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    avatarText: {
        fontSize: 32,
        fontFamily: 'Nunito_800ExtraBold',
        color: '#fff',
    },
    userName: {
        fontSize: 22,
        fontFamily: 'Nunito_800ExtraBold',
        color: Colors.foreground,
    },
    userEmail: {
        fontSize: 14,
        fontFamily: 'Nunito_400Regular',
        color: Colors.mutedForeground,
        marginTop: 4,
    },
    editProfileButton: {
        marginTop: 16,
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: Colors.secondary,
    },
    editProfileText: {
        fontSize: 13,
        fontFamily: 'Nunito_700Bold',
        color: Colors.foreground,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 13,
        fontFamily: 'Nunito_800ExtraBold',
        color: Colors.mutedForeground,
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        marginBottom: 12,
        marginLeft: 4,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconCircle: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuItemTitle: {
        fontSize: 15,
        fontFamily: 'Nunito_700Bold',
        color: Colors.foreground,
    },
    separator: {
        height: 1,
        backgroundColor: Colors.border,
        marginLeft: 64,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        padding: 16,
        borderRadius: 12,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: Colors.border,
        marginTop: 8,
    },
    logoutButtonText: {
        fontSize: 16,
        fontFamily: 'Nunito_700Bold',
        color: Colors.destructive,
    },
    versionText: {
        textAlign: 'center',
        marginTop: 30,
        fontSize: 12,
        fontFamily: 'Nunito_400Regular',
        color: Colors.mutedForeground,
        opacity: 0.6,
    }
});
