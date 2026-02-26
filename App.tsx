import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, StatusBar, View, Text, ActivityIndicator } from 'react-native';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { PetProvider } from './src/contexts/PetContext';
import LoginScreen from './src/screens/LoginScreen';

const RootApp = () => {
  const { user, loading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState('login');

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!user) {
    return <LoginScreen onSignupLink={() => setCurrentScreen('signup')} />;
  }

  return (
    <PetProvider>
      <View style={styles.container}>
        <Text style={styles.welcomeText}>Welcome, {user.name}!</Text>
        <Text style={styles.infoText}>Your Pet wellness tracker is being migrated...</Text>
      </View>
    </PetProvider>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <RootApp />
      </SafeAreaView>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
});
