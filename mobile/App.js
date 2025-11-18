import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import CaptureScreen from './src/screens/CaptureScreen';
import LibraryScreen from './src/screens/LibraryScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Tab = createBottomTabNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#f6f7fb',
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navTheme}>
        <StatusBar style="dark" />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: '#4338CA',
            tabBarInactiveTintColor: '#94a3b8',
            tabBarStyle: {
              backgroundColor: '#ffffff',
              borderTopColor: '#e2e8f0',
            },
            tabBarIcon: ({ color, size }) => {
              const map = {
                Capture: 'create-outline',
                Library: 'albums-outline',
                Settings: 'settings-outline',
              };
              const icon = map[route.name] || 'ellipse-outline';
              return <Ionicons name={icon} size={size} color={color} />;
            },
          })}
        >
          <Tab.Screen name="Capture" component={CaptureScreen} />
          <Tab.Screen name="Library" component={LibraryScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
