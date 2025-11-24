import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/contexts/AuthContext';
import { DreamProvider } from './src/contexts/DreamContext';
import { XPColors } from './src/theme/colors';

export default function App() {
  return (
    <AuthProvider>
      <DreamProvider>
        <NavigationContainer
          onReady={() => {
            console.log('NavigationContainer está pronto');
          }}
        >
          <StatusBar style="light" backgroundColor={XPColors.background} />
          <AppNavigator />
        </NavigationContainer>
      </DreamProvider>
    </AuthProvider>
  );
}