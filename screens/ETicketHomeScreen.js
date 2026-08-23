import React, { useLayoutEffect } from 'react';
import { View, StyleSheet, Pressable, Dimensions, ScrollView, ImageBackground, Image } from 'react-native';
import { Text, useTheme, Surface } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAppTheme } from '../ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const options = [
  { title: 'টিকিট ক্রয়', icon: 'ticket-confirmation', screen: 'BuyTicket' },
  { title: 'টিকিট যাচাই', icon: 'ticket-account', screen: 'VerifyTicket' },
  { title: 'ট্রেন ইনফো', icon: 'train', screen: 'TrainInfo' },
  { title: 'প্রোফাইল', icon: 'account', screen: 'Profile' },
  { title: 'ক্রয়কৃত টিকেট', icon: 'history', screen: 'PurchaseHistory' },
  { title: 'পাসওয়ার্ড পরিবর্তন', icon: 'lock-reset', screen: 'ChangePassword' },
  { title: 'হেল্পলাইন', icon: 'headset', screen: 'Helpline' },
  { title: 'শর্তাবলী', icon: 'file-document-outline', screen: 'Terms' },
];



const ETicketHomeScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { heroTheme } = useAppTheme();
  const styles = getStyles(theme, insets);


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

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {options.map((item, index) => (
            <Surface
              key={index}
              style={styles.cardSurface}
              elevation={2}
            >
              <Pressable
                onPress={() => navigation.navigate(item.screen)}
                style={({ pressed }) => [
                  styles.pressable,
                  pressed && styles.pressed
                ]}
                android_ripple={{ color: 'rgba(0,0,0,0.05)' }}
              >
                <View style={styles.iconBox}>
                  <Icon name={item.icon} size={24} color={theme.colors.primary} />
                </View>
                <Text style={styles.title}>{item.title}</Text>
              </Pressable>
            </Surface>
          ))}
        </View>

        <View style={styles.brandingSection}>
          <Text style={styles.brandingText}>পাওয়ার্ড বাই</Text>
          <Image
            source={require('../assets/br_logo.png')}
            style={styles.brLogo}
            resizeMode="contain"
          />
          <Text style={styles.brText}>বাংলাদেশ রেলওয়ে</Text>

          <View style={styles.miniDisclaimer}>
            <Text style={styles.miniDisclaimerText}>
              এটি বাংলাদেশ রেলওয়েরই টিকেটিং পোর্টাল। তাই এটি সম্পূর্ণ নিরাপদ।
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const getStyles = (theme, insets) => {
  const { width } = Dimensions.get('window');
  const horizontalPadding = 12;
  const gap = 10;
  const cardWidth = (width - (horizontalPadding * 2) - (gap * 3)) / 3;

  return StyleSheet.create({
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
      padding: horizontalPadding,
      paddingBottom: 40,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center', // Centered alignment
    },
    cardSurface: {
      width: cardWidth,
      height: cardWidth * 1.05, // Slightly taller for better icon/text fit
      borderRadius: 18,
      marginBottom: gap,
      marginHorizontal: gap / 2, // Spacing for centered layout
      backgroundColor: theme.colors.surface,
      overflow: 'hidden',
    },
    pressable: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 8,
    },
    pressed: {
      opacity: 0.9,
      backgroundColor: 'rgba(0,0,0,0.02)',
    },
    iconBox: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: theme.colors.iconTint08,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
    },
    title: {
      fontSize: 11,
      fontFamily: 'AnekBangla_800ExtraBold',
      textAlign: 'center',
      color: theme.colors.onSurface,
      letterSpacing: -0.2,
      lineHeight: 14,
    },
    brandingSection: {
      marginTop: 20,
      alignItems: 'center',
      paddingBottom: 20,
      opacity: 0.6,
    },
    brandingText: {
      fontSize: 10,
      fontFamily: 'AnekBangla_700Bold',
      color: theme.colors.onSurfaceVariant,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 8,
    },
    brLogo: {
      width: 50,
      height: 50,
      marginBottom: 6,
    },
    brText: {
      fontSize: 12,
      fontFamily: 'AnekBangla_800ExtraBold',
      color: theme.colors.primary,
      letterSpacing: 0.5,
    },
    miniDisclaimer: {
      marginTop: 16,
      paddingHorizontal: 20,
      opacity: 0.8,
    },
    miniDisclaimerText: {
      fontSize: 10,
      fontFamily: 'AnekBangla_500Medium',
      color: theme.colors.onSurfaceVariant,
      textAlign: 'center',
      lineHeight: 14,
      flex: 1,
    },
  });
};

export default ETicketHomeScreen;
