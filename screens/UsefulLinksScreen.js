import React, { useLayoutEffect } from 'react';
import { View, StyleSheet, Pressable, Linking, ScrollView, ImageBackground, Dimensions } from 'react-native';
import { Text, useTheme, Surface } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useAppTheme } from '../ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const links = [
  {
    title: 'নরসিংদী রেলওয়ে প্যাসেঞ্জারস কম্যুনিটি',
    subtitle: 'ফেসবুক গ্রুপ',
    icon: 'facebook',
    url: 'https://www.facebook.com/groups/315866319072545',
  },
  {
    title: 'রেল ট্রানজিট অ্যাপ চ্যাট গ্রুপ',
    subtitle: 'মেসেঞ্জার কমিউনিটি',
    icon: 'facebook-messenger',
    url: 'https://m.me/ch/AbZHGHvKxV-t7BW1/?send_source=cm%3Acopy_invite_link',
  },
  {
    title: 'পূর্বাঞ্চল ট্রেনের সময়সূচি',
    subtitle: 'বাংলাদেশ রেলওয়ে',
    icon: 'calendar-clock-outline',
    url: 'https://railway.portal.gov.bd/site/page/988258c9-5f11-4719-91e2-fbc898d4c2a9/-%E0%A6%AA%E0%A7%82%E0%A6%B0%E0%A7%8D%E0%A6%AC%E0%A6%BE%E0%A6%9E%E0%A7%8D%E0%A6%9A%E0%A6%B2%E0%A7%87%E0%A6%B0-%E0%A6%9F%E0%A7%8D%E0%A6%B0%E0%A7%87%E0%A6%A8%E0%A7%87%E0%A6%B0-%E0%A6%B8%E0%A6%AE%E0%A7%9F%E0%A6%B8%E0%A7%82%E0%A6%9A%E0%A6%BF',
  },
  {
    title: 'পূর্বাঞ্চল ট্রেনের ভাড়ার তালিকা',
    subtitle: 'বাংলাদেশ রেলওয়ে',
    icon: 'currency-bdt',
    url: 'https://railway.portal.gov.bd/site/files/e290cbe6-88c6-445d-b7bd-28ee288f6a0a/%E0%A6%9F%E0%A6%BF%E0%A6%9F%E0%A7%87%E0%A6%B0-%E0%A6%AE%E0%A7%82%E0%A6%B2%E0%A7%8D%E0%A6%AF-%E0%A6%A4%E0%A6%BE%E0%A6%B2%E0%A6%BF%E0%A6%95%E0%A6%BE-(%E0%A6%AA%E0%A7%82%E0%A6%B0%E0%A7%8D%E0%A6%AC%E0%A6%BE%E0%A6%9E%E0%A7%8D%E0%A6%9A%E0%A6%B2)',
  },
];

const UsefulLinksScreen = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { heroTheme } = useAppTheme();
  const styles = getStyles(theme, insets);


  const handlePress = (url) => {
    Linking.openURL(url).catch((err) => console.warn('Error opening URL:', err));
  };

  const HeaderContent = () => (
    <View style={styles.headerTitleWrapper}>
      {/* Title handled by navigation */}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <View style={styles.headerGradientContainer}>
          {heroTheme.image ? (
            <ImageBackground
              source={heroTheme.image}
              style={styles.headerBackgroundImage}
              resizeMode="cover"
            >
              <LinearGradient
                colors={['rgba(0,0,0,0.5)', 'transparent']}
                style={StyleSheet.absoluteFill}
              />
              <LinearGradient
                colors={heroTheme.colors}
                style={[styles.headerGradient, { backgroundColor: 'transparent' }]}
                opacity={0.85}
              >
                <HeaderContent />
              </LinearGradient>
            </ImageBackground>
          ) : (
            <LinearGradient
              colors={heroTheme.colors}
              style={styles.headerGradient}
            >
              <HeaderContent />
            </LinearGradient>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {links.map((item, index) => (
          <Surface key={index} style={styles.card} elevation={2}>
            <Pressable
              style={({ pressed }) => [
                styles.pressable,
                pressed && { backgroundColor: theme.colors.surfaceVariant },
              ]}
              onPress={() => handlePress(item.url)}
              android_ripple={{ color: 'rgba(0,0,0,0.05)' }}
            >
              <View style={styles.iconBox}>
                <Icon name={item.icon} size={24} color={theme.colors.primary} />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>{item.subtitle}</Text>
              </View>
              <Icon name="chevron-right" size={20} color={theme.colors.outline} />
            </Pressable>
          </Surface>
        ))}
      </ScrollView>
    </View>
  );
};

const getStyles = (theme, insets) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerWrapper: {
    backgroundColor: theme.colors.background,
  },
  headerGradientContainer: {
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
    backgroundColor: theme.colors.primary,
  },
  headerBackgroundImage: {
    width: '100%',
  },
  headerGradient: {
    paddingTop: insets.top + 40,
    paddingBottom: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleWrapper: {
    height: 30,
  },
  scrollContent: {
    padding: 14,
    paddingTop: 18,
    paddingBottom: 40,
  },
  card: {
    borderRadius: 20,
    marginBottom: 12,
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    borderWidth: 0,
  },
  pressable: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: theme.colors.iconTint08,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: 'AnekBangla_800ExtraBold',
    color: theme.colors.onSurface,
    marginBottom: 2,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    fontFamily: 'AnekBangla_700Bold',
    opacity: 0.8,
  },
});

export default UsefulLinksScreen;
