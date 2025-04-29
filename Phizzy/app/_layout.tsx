import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, createContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-reanimated';

// Create theme context
export const ThemeContext = createContext({
  themeColor: '#4A2DBB',
  setThemeColor: (color: string) => {},
});

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [themeColor, setThemeColor] = useState('#4A2DBB');
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    // Load saved theme color
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme) {
          setThemeColor(savedTheme);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };
    loadTheme();
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ themeColor, setThemeColor }}>
      <ThemeProvider value={DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="auth" options={{ headerShown: false }} />
          <Stack.Screen name="access-code" options={{ headerShown: false }} />
          <Stack.Screen name="verify-info" options={{ headerShown: false }} />
          <Stack.Screen name="create-account" options={{ headerShown: false }} />
          <Stack.Screen name="build-profile" options={{ headerShown: false }} />
          <Stack.Screen name="pick-theme" options={{ headerShown: false }} />
          <Stack.Screen name="week1" options={{ headerShown: false }} />
          <Stack.Screen name="week2" options={{ headerShown: false }} />
          <Stack.Screen name="week3" options={{ headerShown: false }} />
          <Stack.Screen name="week4" options={{ headerShown: false }} />
          <Stack.Screen name="squat" options={{ headerShown: false }} />
          <Stack.Screen name="parent-code" options={{ headerShown: false }} />
          <Stack.Screen name="play" options={{ headerShown: false }} />
          <Stack.Screen name="upload-complete" options={{ headerShown: false }} />
          <Stack.Screen name="map" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="light" />
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
