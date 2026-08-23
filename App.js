import 'react-native-gesture-handler';
import 'react-native-reanimated';
import React, { useEffect } from 'react';
import { Text, View, ActivityIndicator, StatusBar, Image } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { lightTheme as customLightTheme, darkTheme as customDarkTheme } from './theme';
import MainNavigator from './navigation/MainNavigator';
import { ThemeProvider, useAppTheme } from './ThemeContext';
import { FavoritesProvider } from './FavoritesContext';
import { useFonts } from 'expo-font';

import { DataProvider } from './DataContext';
import { AlertProvider } from './AlertContext';
import usePushNotifications from './hooks/usePushNotifications';

function PushNotificationSetup() {
  usePushNotifications();
  return null;
}

// Safe default font setting
const setGlobalFont = () => {
  if (Text.defaultProps == null) {
    Text.defaultProps = {};
  }
  Text.defaultProps.style = { fontFamily: 'AnekBangla_400Regular' };
};

function MainApp() {
  const { isDark } = useAppTheme();
  const finalTheme = isDark ? customDarkTheme : customLightTheme;

  let [fontsLoaded, fontError] = useFonts({
    'AnekBangla_400Regular': require('./assets/fonts/AnekBangla-Regular.ttf'),
    'AnekBangla_500Medium': require('./assets/fonts/AnekBangla-Medium.ttf'),
    'AnekBangla_600SemiBold': require('./assets/fonts/AnekBangla-SemiBold.ttf'),
    'AnekBangla_700Bold': require('./assets/fonts/AnekBangla-Bold.ttf'),
    'AnekBangla_800ExtraBold': require('./assets/fonts/AnekBangla-ExtraBold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      setGlobalFont();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded && !fontError) {
    const bgColor = isDark ? '#0a1f0f' : '#f7fbf1';
    const accentColor = isDark ? '#41ab5d' : '#075d37';

    return (
      <View style={{
        flex: 1,
        backgroundColor: bgColor,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40
      }}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={bgColor} />
        <View style={{ marginBottom: 40, alignItems: 'center' }}>
          <Image
            source={require('./assets/icon.png')}
            style={{
              width: 160,
              height: 160,
              borderRadius: 40,
              marginBottom: 20
            }}
            resizeMode="contain"
          />
          <Text style={{
            fontSize: 26,
            fontWeight: 'bold',
            color: accentColor,
            marginBottom: 10
          }}>
            রেল ট্রানজিট
          </Text>
          <Text style={{
            fontSize: 16,
            color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
            textAlign: 'center',
            letterSpacing: 0.5
          }}>
            আপনার যাত্রা আরও সহজ করতে...
          </Text>
        </View>
        <View style={{ marginTop: 20 }}>
          <ActivityIndicator color={accentColor} size="large" />
        </View>
      </View>
    );
  }

  return (
    <PaperProvider theme={finalTheme}>
      <AlertProvider>
        <DataProvider>
          <FavoritesProvider>
            <PushNotificationSetup />
            <MainNavigator />
          </FavoritesProvider>
        </DataProvider>
      </AlertProvider>
    </PaperProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}
