import React from 'react';
import { View, StyleSheet, ScrollView, Linking, ImageBackground, Image, Pressable } from 'react-native';
import { Text, useTheme, Button, Surface } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useAppTheme } from '../ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AboutScreen = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { heroTheme } = useAppTheme();
  const styles = getStyles(theme, insets);

  const openLink = async (url) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) await Linking.openURL(url);
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
        {/* Developer Card - Now First */}
        <Surface style={styles.card} elevation={2}>
          <View style={styles.devHeader}>
            <View style={styles.devPicWrapper}>
              <Image source={require('../assets/dev.png')} style={styles.devPic} />
            </View>
            <View style={styles.devInfo}>
              <Text style={styles.devName}>ফয়সাল ফারুকী রাফাত</Text>
              <Text style={styles.devRole}>অ্যাপ ডেভেলপার</Text>
            </View>
          </View>

          <View style={styles.contactRow}>
            <Pressable
              style={({ pressed }) => [styles.contactItem, pressed && styles.pressed]}
              onPress={() => openLink('mailto:ff@rafat.cc')}
            >
              <View style={styles.contactIcon}>
                <Icon name="email-outline" size={18} color={theme.colors.primary} />
              </View>
              <Text style={styles.contactText}>ff@rafat.cc</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.contactItem, pressed && styles.pressed]}
              onPress={() => openLink('https://rafat.cc')}
            >
              <View style={styles.contactIcon}>
                <Icon name="web" size={18} color={theme.colors.primary} />
              </View>
              <Text style={styles.contactText}>rafat.cc</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.contactItem, pressed && styles.pressed]}
              onPress={() => openLink('https://facebook.com/fslfrqrft')}
            >
              <View style={styles.contactIcon}>
                <Icon name="facebook" size={18} color={theme.colors.primary} />
              </View>
              <Text style={styles.contactText}>Facebook</Text>
            </Pressable>
          </View>
        </Surface>

        {/* App Info Card */}
        <Surface style={styles.card} elevation={2}>
          <View style={styles.appHeader}>
            <View style={styles.appIconContainer}>
              <Image source={require('../assets/icon.png')} style={styles.appIcon} />
            </View>
            <View style={styles.appNameContainer}>
              <Text style={styles.appName}>রেল ট্রানজিট</Text>
              <View style={styles.versionPill}>
                <Text style={styles.versionText}>ভার্সন ২.২.১</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.compactInfo}>
            <Text style={styles.compactText}>
              রেল ট্রানজিট অ্যাপটি ট্রেন যাত্রীদের যাতায়াতে সহায়তা করার জন্য তৈরি একটি ব্যক্তিগত ও স্বেচ্ছাসেবী উদ্যোগ।
            </Text>
          </View>

          <View style={styles.divider} />

          {/* New formal disclaimer for Play Store compliance */}
          <View style={styles.disclaimerSection}>
            <View style={styles.disclaimerHeader}>
              <Icon name="alert-circle-outline" size={20} color={theme.colors.error} />
              <Text style={styles.disclaimerTitle}>বিশেষ সতর্কবার্তা</Text>
            </View>
            <Text style={styles.disclaimerText}>
              এই অ্যাপটি বাংলাদেশ রেলওয়ে বা কোনো সরকারি প্রতিষ্ঠানের অফিশিয়াল অ্যাপ নয়। আমরা বাংলাদেশ রেলওয়ে বা সরকারের সাথে কোনোভাবে যুক্ত নই এবং এই অ্যাপটি কোনো সরকারি প্রতিষ্ঠানের প্রতিনিধিত্ব করে না।
            </Text>

            <View style={[styles.divider, { backgroundColor: 'rgba(0,0,0,0.05)', marginVertical: 12 }]} />

            <View style={styles.disclaimerHeader}>
              <Icon name="database-search-outline" size={20} color={theme.colors.primary} />
              <Text style={[styles.disclaimerTitle, { color: theme.colors.primary }]}>তথ্যের উৎস</Text>
            </View>
            <Text style={styles.disclaimerText}>
              এই অ্যাপে দেখানো ট্রেনের সময়সূচী এবং টিকেট সংক্রান্ত সকল তথ্য বাংলাদেশ রেলওয়ের অফিশিয়াল ওয়েবসাইট এবং সর্বসাধারণের জন্য উন্মুক্ত বিভিন্ন বিশ্বস্ত মাধ্যম থেকে সংগ্রহ করা হয়েছে। তথ্যের অফিশিয়াল উৎসসমূহ:
            </Text>

            <View style={styles.sourceList}>
              <Pressable onPress={() => openLink('https://www.railway.gov.bd')} style={styles.sourceItem}>
                <Icon name="link-variant" size={14} color={theme.colors.primary} />
                <Text style={styles.sourceLinkText}>বাংলাদেশ রেলওয়ে ওয়েবসাইট</Text>
              </Pressable>
              <Pressable onPress={() => openLink('https://eticket.railway.gov.bd')} style={styles.sourceItem}>
                <Icon name="link-variant" size={14} color={theme.colors.primary} />
                <Text style={styles.sourceLinkText}>টিকেট বুকিং পোর্টাল</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.privacySection}>
            <View style={styles.lockIconContainer}>
              <Icon name="shield-check" size={20} color={theme.colors.primary} />
            </View>
            <Text style={styles.privacyText}>আপনার তথ্য সম্পূর্ণ সুরক্ষিত</Text>
            <Button
              mode="contained"
              onPress={() => openLink('https://transit.rafat.cc/privacy-policy')}
              style={styles.privacyButton}
              labelStyle={styles.privacyButtonLabel}
              compact
            >
              গোপনীয়তা নীতি
            </Button>
          </View>
        </Surface>

        <View style={styles.footer}>
          <Text style={styles.footerText}>ভালোবাসা দিয়ে তৈরি ❤️ সারা বাংলাদেশের জন্য</Text>
          <Text style={styles.copyrightText}>© ২০২৬ ফয়সাল ফারুকী রাফাত</Text>
        </View>
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
    backgroundColor: '#075d37',
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
    borderRadius: 24,
    backgroundColor: theme.colors.surface,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    marginBottom: 14,
  },
  appHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  appIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: 'transparent',
    marginRight: 14,
  },
  appIcon: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  appNameContainer: {
    flex: 1,
  },
  appName: {
    fontSize: 20,
    fontFamily: 'AnekBangla_800ExtraBold',
    color: theme.colors.onSurface,
    letterSpacing: -0.5,
  },
  versionPill: {
    backgroundColor: 'rgba(65, 171, 93, 0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  versionText: {
    fontSize: 11,
    fontFamily: 'AnekBangla_800ExtraBold',
    color: theme.colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginVertical: 14,
  },
  compactInfo: {
    marginBottom: 4,
  },
  compactText: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    lineHeight: 20,
    textAlign: 'justify',
  },
  bold: {
    fontFamily: 'AnekBangla_800ExtraBold',
    color: theme.colors.primary,
  },
  privacySection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  lockIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(65, 171, 93, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  privacyText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'AnekBangla_700Bold',
    color: theme.colors.onSurface,
  },
  privacyButton: {
    borderRadius: 10,
    backgroundColor: theme.colors.primary,
  },
  privacyButtonLabel: {
    color: '#FFFFFF',
    fontFamily: 'AnekBangla_800ExtraBold',
    fontSize: 12,
  },
  devHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  devPicWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: 'rgba(65, 171, 93, 0.1)',
    marginRight: 14,
  },
  devPic: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
  },
  devInfo: {
    flex: 1,
  },
  devName: {
    fontSize: 18,
    fontFamily: 'AnekBangla_800ExtraBold',
    color: theme.colors.onSurface,
    letterSpacing: -0.5,
  },
  devRole: {
    fontSize: 12,
    fontFamily: 'AnekBangla_700Bold',
    color: theme.colors.onSurfaceVariant,
    marginTop: 2,
  },
  contactRow: {
    flexDirection: 'row',
    gap: 8,
  },
  contactItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(65, 171, 93, 0.05)',
    gap: 6,
  },
  pressed: {
    backgroundColor: 'rgba(65, 171, 93, 0.15)',
    opacity: 0.8,
  },
  contactIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(65, 171, 93, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactText: {
    fontSize: 11,
    fontFamily: 'AnekBangla_800ExtraBold',
    color: theme.colors.onSurface,
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
    opacity: 0.6,
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'AnekBangla_700Bold',
    color: theme.colors.onSurfaceVariant,
  },
  copyrightText: {
    fontSize: 10,
    fontFamily: 'AnekBangla_700Bold',
    color: theme.colors.onSurfaceVariant,
    marginTop: 4,
    opacity: 0.7,
  },
  disclaimerSection: {
    backgroundColor: 'rgba(186, 26, 26, 0.05)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(186, 26, 26, 0.1)',
  },
  disclaimerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  disclaimerTitle: {
    fontSize: 15,
    fontFamily: 'AnekBangla_800ExtraBold',
    color: theme.colors.error,
  },
  disclaimerText: {
    fontSize: 13,
    fontFamily: 'AnekBangla_500Medium',
    color: theme.colors.onSurfaceVariant,
    lineHeight: 18,
    marginBottom: 10,
  },
  sourceList: {
    gap: 8,
    marginBottom: 10,
  },
  sourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.5)',
    padding: 8,
    borderRadius: 8,
  },
  sourceLinkText: {
    fontSize: 12,
    fontFamily: 'AnekBangla_700Bold',
    color: theme.colors.primary,
    flex: 1,
  },
  disclaimerNotice: {
    fontSize: 11,
    fontFamily: 'AnekBangla_700Bold',
    color: theme.colors.onSurfaceVariant,
    opacity: 0.8,
    lineHeight: 16,
    fontStyle: 'italic',
  },
});

export default AboutScreen;
