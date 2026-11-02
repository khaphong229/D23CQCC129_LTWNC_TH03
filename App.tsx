import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SyncProvider } from './src/context/SyncContext';
import { AppDataProvider } from './src/context/AppDataContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <SyncProvider>
        <AppDataProvider>
          <StatusBar barStyle="dark-content" />
          <AppNavigator />
        </AppDataProvider>
      </SyncProvider>
    </SafeAreaProvider>
  );
}

