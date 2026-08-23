import React from 'react';
import { Alert, Linking, View, Text, Image, useColorScheme, ImageBackground, StyleSheet, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { NavigationContainer, DefaultTheme as NavDefaultTheme, DarkTheme as NavDarkTheme } from '@react-navigation/native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useState, useEffect } from 'react';

import { LinearGradient } from 'expo-linear-gradient';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from 'react-native-paper';
import { useAppTheme } from '../ThemeContext';

// Main Screen Imports
import SettingsScreen from '../screens/SettingsScreen';
import TimetableScreen from '../screens/TimetableScreen';
import AboutScreen from '../screens/AboutScreen';
import AllStationsScreen from '../screens/AllStationsScreen';

import UsefulLinksScreen from '../screens/UsefulLinksScreen';




// ETicket Related Screens
import ETicketHomeScreen from '../screens/ETicketHomeScreen';
import TicketNavigator from '../ticketscreens/TicketNavigator';

// Train Details Page Import
import TrainDetailsScreen from '../screens/TrainDetailsScreen';


const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const playStoreLink = 'market://details?id=cc.rafat.narsingditransit';
const devProfileLink = 'https://play.google.com/store/apps/dev?id=8574740223570326359';

function CustomDrawerContent(props) {
  const theme = useTheme();
  const { heroTheme } = useAppTheme();
  const isDark = theme.dark;

  const getGreetingConfig = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { label: 'সুপ্রভাত', icon: 'weather-sunset-up' };
    if (hour < 17) return { label: 'শুভ অপরাহ্ন', icon: 'weather-sunny' };
    if (hour < 21) return { label: 'শুভ সন্ধ্যা', icon: 'weather-sunset-down' };
    return { label: 'শুভ রাত্রি', icon: 'weather-night' };
  };

  const greeting = getGreetingConfig();

  const DrawerWrapper = ({ children }) => {
    if (heroTheme.image) {
      return (
        <ImageBackground source={heroTheme.image} style={{ flex: 1 }} resizeMode="cover">
          <LinearGradient
            colors={['rgba(0,0,0,0.5)', 'transparent']}
            style={StyleSheet.absoluteFill}
          />
          <LinearGradient
            colors={heroTheme.colors}
            style={StyleSheet.absoluteFill}
            opacity={0.85}
          />
          <View style={{ flex: 1 }}>
            {children}
          </View>
        </ImageBackground>
      );
    }
    return (
      <View style={{ flex: 1, backgroundColor: isDark ? '#121212' : '#FFFFFF' }}>
        <LinearGradient
          colors={heroTheme.colors}
          style={StyleSheet.absoluteFill}
        />
        {children}
      </View>
    );
  };

  return (
    <DrawerWrapper>
      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 80 }}>
        {/* Greeting Section */}
        <View style={drawerStyles.greetingContainer}>
          <View style={drawerStyles.greetingIconBox}>
            <Icon name={greeting.icon} size={24} color="#FFFFFF" />
          </View>
          <Text style={drawerStyles.greetingText}>{greeting.label}</Text>
        </View>

        <View style={drawerStyles.menuContainer}>
          <DrawerItem
            label="সময়সূচী"
            labelStyle={drawerStyles.itemLabel}
            icon={({ focused }) => (
              <View style={[drawerStyles.iconBox, focused && { backgroundColor: 'rgba(255, 255, 255, 0.25)' }]}>
                <Icon name="train" color="#FFFFFF" size={22} />
              </View>
            )}
            onPress={() => props.navigation.navigate('সময়সূচী')}
            focused={props.state.index === props.state.routes.findIndex(r => r.name === 'সময়সূচী')}
            activeTintColor="#FFFFFF"
            activeBackgroundColor="rgba(255, 255, 255, 0.15)"
          />

          <DrawerItem
            label="সকল স্টেশন"
            labelStyle={drawerStyles.itemLabel}
            icon={({ focused }) => (
              <View style={[drawerStyles.iconBox, focused && { backgroundColor: 'rgba(255, 255, 255, 0.25)' }]}>
                <Icon name="map-marker-multiple" color="#FFFFFF" size={22} />
              </View>
            )}
            onPress={() => props.navigation.navigate('সকল স্টেশন')}
            focused={props.state.index === props.state.routes.findIndex(r => r.name === 'সকল স্টেশন')}
            activeTintColor="#FFFFFF"
            activeBackgroundColor="rgba(255, 255, 255, 0.15)"
          />



          <DrawerItem
            label="রেলওয়ে ই-টিকিট"
            labelStyle={drawerStyles.itemLabel}
            icon={({ focused }) => (
              <View style={[drawerStyles.iconBox, focused && { backgroundColor: 'rgba(255, 255, 255, 0.25)' }]}>
                <Icon name="ticket-confirmation" color="#FFFFFF" size={22} />
              </View>
            )}
            onPress={() => props.navigation.navigate('রেলওয়ে ই-টিকিট')}
            activeTintColor="#FFFFFF"
            activeBackgroundColor="rgba(255, 255, 255, 0.15)"
            focused={props.state.index === props.state.routes.findIndex(r => r.name === 'রেলওয়ে ই-টিকিট')}
          />

          <DrawerItem
            label="প্রয়োজনীয় লিংকসমূহ"
            labelStyle={drawerStyles.itemLabel}
            icon={({ focused }) => (
              <View style={[drawerStyles.iconBox, focused && { backgroundColor: 'rgba(255, 255, 255, 0.25)' }]}>
                <Icon name="bookmark-multiple" color="#FFFFFF" size={22} />
              </View>
            )}
            onPress={() => props.navigation.navigate('প্রয়োজনীয় লিংকসমূহ')}
            activeTintColor="#FFFFFF"
            activeBackgroundColor="rgba(255, 255, 255, 0.15)"
            focused={props.state.index === props.state.routes.findIndex(r => r.name === 'প্রয়োজনীয় লিংকসমূহ')}
          />

          <DrawerItem
            label="সেটিংস"
            labelStyle={drawerStyles.itemLabel}
            icon={({ focused }) => (
              <View style={[drawerStyles.iconBox, focused && { backgroundColor: 'rgba(255, 255, 255, 0.25)' }]}>
                <Icon name="cog" color="#FFFFFF" size={22} />
              </View>
            )}
            onPress={() => props.navigation.navigate('সেটিংস')}
            focused={props.state.index === props.state.routes.findIndex(r => r.name === 'সেটিংস')}
            activeTintColor="#FFFFFF"
            activeBackgroundColor="rgba(255, 255, 255, 0.15)"
          />

          <DrawerItem
            label="আমাদের সম্পর্কে"
            labelStyle={drawerStyles.itemLabel}
            icon={({ focused }) => (
              <View style={[drawerStyles.iconBox, focused && { backgroundColor: 'rgba(255, 255, 255, 0.25)' }]}>
                <Icon name="information-outline" color="#FFFFFF" size={22} />
              </View>
            )}
            onPress={() => props.navigation.navigate('আমাদের সম্পর্কে')}
            activeTintColor="#FFFFFF"
            activeBackgroundColor="rgba(255, 255, 255, 0.15)"
            focused={props.state.index === props.state.routes.findIndex(r => r.name === 'আমাদের সম্পর্কে')}
          />

          <DrawerItem
            label="৫ স্টার রিভিউ দিন"
            labelStyle={drawerStyles.itemLabel}
            icon={() => (
              <View style={drawerStyles.iconBox}>
                <Icon name="star-outline" color="#FFFFFF" size={22} />
              </View>
            )}
            onPress={() => Linking.openURL(playStoreLink)}
          />
        </View>
      </DrawerContentScrollView>
    </DrawerWrapper>
  );
}

// Drawer wrapped in its own navigator
function DrawerContentNavigator() {
  const theme = useTheme();
  const { heroTheme } = useAppTheme();
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        drawerActiveTintColor: theme.colors.primary,
        drawerInactiveTintColor: theme.colors.onSurfaceVariant,
        drawerLabelStyle: { marginLeft: -16 },
        headerStyle: {
          backgroundColor: heroTheme.statusBar,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerShadowVisible: false,
        headerTintColor: theme.colors.onPrimary,
        headerTitleStyle: {
          fontFamily: 'AnekBangla_800ExtraBold',
          fontSize: 20
        },
      }}
    >
      <Drawer.Screen
        name="সময়সূচী"
        component={TimetableScreen}
        options={{
          headerTransparent: true,
          headerStyle: { backgroundColor: 'transparent' },
          headerTintColor: '#FFFFFF',
        }}
      />
      <Drawer.Screen
        name="সেটিংস"
        component={SettingsScreen}
        options={{
          headerTransparent: true,
          headerStyle: { backgroundColor: 'transparent' },
          headerTintColor: '#FFFFFF',
        }}
      />
      <Drawer.Screen
        name="রেলওয়ে ই-টিকিট"
        component={TicketNavigator}
        options={{
          headerTransparent: true,
          headerStyle: { backgroundColor: 'transparent' },
          headerTintColor: '#FFFFFF',
        }}
      />
      <Drawer.Screen
        name="প্রয়োজনীয় লিংকসমূহ"
        component={UsefulLinksScreen}
        options={{
          headerTransparent: true,
          headerStyle: { backgroundColor: 'transparent' },
          headerTintColor: '#FFFFFF',
        }}
      />
      <Drawer.Screen
        name="সকল স্টেশন"
        component={AllStationsScreen}
        options={{
          headerTransparent: true,
          headerStyle: { backgroundColor: 'transparent' },
          headerTintColor: '#FFFFFF',
        }}
      />
      <Drawer.Screen
        name="আমাদের সম্পর্কে"
        component={AboutScreen}
        options={{
          headerTransparent: true,
          headerStyle: { backgroundColor: 'transparent' },
          headerTintColor: '#FFFFFF',
        }}
      />

    </Drawer.Navigator>
  );
}

export default function MainNavigator() {
  const theme = useTheme();
  const { heroTheme } = useAppTheme();
  const isDark = theme.dark;

  const MyNavTheme = {
    ...(isDark ? NavDarkTheme : NavDefaultTheme),
    colors: {
      ...(isDark ? NavDarkTheme.colors : NavDefaultTheme.colors),
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.onSurface,
      border: theme.colors.outlineVariant,
      notification: theme.colors.error,
    },
  };

  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer theme={MyNavTheme}>

        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="DrawerHome" component={DrawerContentNavigator} />




          <Stack.Screen
            name="TrainDetails"
            component={TrainDetailsScreen}
            options={{
              headerShown: true,
              title: 'ট্রেনের বিস্তারিত',
              headerTransparent: true,
              headerStyle: { backgroundColor: 'transparent' },
              headerTintColor: '#FFFFFF',
              headerTitleStyle: {
                fontFamily: 'AnekBangla_800ExtraBold',
                fontSize: 20
              },
            }}
          />
        </Stack.Navigator>

      </NavigationContainer>
    </>
  );
}

const drawerStyles = StyleSheet.create({
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 10,
    gap: 14,
  },
  greetingIconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  greetingText: {
    fontSize: 22,
    fontFamily: 'AnekBangla_800ExtraBold',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  menuContainer: {
    paddingTop: 10,
    paddingHorizontal: 8,
  },
  itemLabel: {
    fontSize: 16,
    fontFamily: 'AnekBangla_800ExtraBold',
    marginLeft: 8,
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: 12,
    marginHorizontal: 16,
  },

});
