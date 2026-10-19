import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StudyProvider } from './src/context/StudyContext';
import { AppNavigator } from './src/navigation/AppNavigator';

function App() {
  return (
    <SafeAreaProvider>
      <StudyProvider>
        <StatusBar barStyle="dark-content" />
        <AppNavigator />
      </StudyProvider>
    </SafeAreaProvider>
  );
}

export default App;
