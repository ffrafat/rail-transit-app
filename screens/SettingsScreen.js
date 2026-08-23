import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, ScrollView, ImageBackground, Text as RNText } from 'react-native';
import { Text, Button, Card, useTheme, Surface, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import DropdownSelector from '../components/DropdownSelector';
import { useAppTheme } from '../ThemeContext';
import { useTrainData } from '../DataContext';
import { HERO_THEMES } from '../constants/heroThemes';
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { engToBengaliDigit } from '../utils/bengali';

const stationList = ['ঢাকা', 'তেজগাঁও', 'বিমানবন্দর', 'নরসিংদী', 'মেথিকান্দা', 'দৌলতকান্দি', 'ভৈরব'];

const formatBengaliDate = (timestamp) => {
  if (!timestamp) return 'কখনো নয়';
  const date = new Date(timestamp);
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yy = String(date.getFullYear()).slice(-2);
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');

  const formatted = `${dd}/${mm}/${yy} • ${hh}:${min}`;
  return engToBengaliDigit(formatted);
};

const formatRelativeTime = (timestamp) => {
  if (!timestamp) return 'কখনো নয়';
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);

  if (mins < 1) return 'এইমাত্র';
  if (mins < 60) return `${mins} মিনিট আগে`;
  if (hours < 24) return `${hours} ঘণ্টা আগে`;
  return `${days} দিন আগে`;
};

const SettingsScreen = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const styles = getStyles(theme, insets);
  const {
    themeMode,
    setThemeMode,
    heroTheme,
    setHeroTheme
  } = useAppTheme();
  const {
    checkForUpdates,
    version,
    loading,
    updateAvailable,
    lastChecked,
    lastUpdated
  } = useTrainData();

  const HeaderContent = () => (
    <View style={styles.headerTitleWrapper}>
      {/* Title is handled by navigation header */}
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

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Update Card */}
        <Surface style={styles.surface} elevation={1}>
          <View style={styles.headerRow}>
            <View style={styles.iconBoxWrapper}>
              <View style={[styles.iconBox, { backgroundColor: theme.colors.iconTint08 }]}>
                <Icon name="cloud-sync-outline" size={22} color={theme.colors.primary} />
              </View>
              {updateAvailable && <View style={styles.redDot} />}
            </View>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={styles.headerText}>তথ্য আপডেট</Text>
              {updateAvailable && (
                <View style={styles.newBadge}>
                  <Text style={styles.newBadgeText}>NEW</Text>
                </View>
              )}
            </View>
          </View>

          <Text style={styles.description}>
            {updateAvailable
              ? 'সার্ভারে নতুন তথ্য পাওয়া গেছে। অনুগ্রহ করে আপডেট করে নিন।'
              : 'অ্যাপের সময়সূচি অনলাইনে আপডেট করতে এই বাটনটি ব্যবহার করুন।'}
          </Text>

          <View style={styles.metadataRow}>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>সর্বশেষ আপডেট</Text>
              <Text style={styles.metadataValue}>{formatBengaliDate(lastUpdated)}</Text>
            </View>
            <View style={styles.metadataDivider} />
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>ডেটাবেজ ভার্সন</Text>
              <Text style={styles.metadataValue}>{version}</Text>
            </View>
          </View>

          <Button
            mode={updateAvailable ? "contained" : "outlined"}
            onPress={() => checkForUpdates(true)}
            loading={loading}
            disabled={loading}
            style={[
              styles.actionBtn,
              !updateAvailable && { borderColor: theme.colors.primary, borderWidth: 1.5 }
            ]}
            labelStyle={[
              styles.btnLabel,
              { color: updateAvailable ? 'white' : theme.colors.primary }
            ]}
          >
            {updateAvailable ? "এখনই আপডেট করুন" : "আপডেট চেক করুন"}
          </Button>
        </Surface>

        {/* Theme selection card */}
        <Surface style={styles.surface} elevation={1}>
          <View style={styles.headerRow}>
            <View style={[styles.iconBox, { backgroundColor: theme.colors.iconTint08 }]}>
              <Icon name="palette-outline" size={22} color={theme.colors.primary} />
            </View>
            <Text style={styles.headerText}>কালার মোড</Text>
          </View>

          <View style={styles.themeToggleRow}>
            <Button
              mode={themeMode === 'light' ? 'contained' : 'text'}
              onPress={() => setThemeMode('light')}
              style={styles.themeBtn}
              icon="weather-sunny"
              labelStyle={{ fontFamily: 'AnekBangla_700Bold' }}
              compact
            >
              লাইট
            </Button>
            <Button
              mode={themeMode === 'dark' ? 'contained' : 'text'}
              onPress={() => setThemeMode('dark')}
              style={styles.themeBtn}
              icon="weather-night"
              labelStyle={{ fontFamily: 'AnekBangla_700Bold' }}
              compact
            >
              ডার্ক
            </Button>
          </View>
        </Surface>

        {/* Hero Theme Selection */}
        <Surface style={styles.surface} elevation={1}>
          <View style={styles.headerRow}>
            <View style={[styles.iconBox, { backgroundColor: theme.colors.iconTint08 }]}>
              <Icon name="image-outline" size={22} color={theme.colors.primary} />
            </View>
            <Text style={styles.headerText}>ব্যাকগ্রাউন্ড থিম</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.heroThemeScroll}>
            {HERO_THEMES.map((t) => {
              const isActive = heroTheme.id === t.id;
              return (
                <TouchableOpacity
                  key={t.id}
                  onPress={() => setHeroTheme(t)}
                  activeOpacity={0.8}
                  style={[
                    styles.heroThemeCard,
                    isActive && styles.heroThemeCardActive
                  ]}
                >
                  <View style={styles.heroThemePreviewContainer}>
                    {t.image ? (
                      <ImageBackground
                        source={t.image}
                        style={styles.heroThemePreview}
                        imageStyle={{ borderRadius: 10 }}
                      >
                        <LinearGradient
                          colors={['rgba(0,0,0,0.5)', 'transparent']}
                          style={StyleSheet.absoluteFill}
                        />
                        <LinearGradient
                          colors={t.colors}
                          style={StyleSheet.absoluteFill}
                          opacity={0.85}
                        />
                        {isActive && (
                          <View style={styles.selectionOverlay}>
                            <Icon name="check-circle" size={24} color="#FFFFFF" />
                          </View>
                        )}
                      </ImageBackground>
                    ) : (
                      <LinearGradient
                        colors={t.colors}
                        style={styles.heroThemePreview}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        {isActive && (
                          <View style={styles.selectionOverlay}>
                            <Icon name="check-circle" size={24} color="#FFFFFF" />
                          </View>
                        )}
                      </LinearGradient>
                    )}
                  </View>
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.heroThemeName,
                      isActive && styles.heroThemeNameActive
                    ]}
                  >
                    {t.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Surface>

        {/* Sections below moved above locally within the single chunk */}
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
    // Basic wrapper
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
  content: {
    padding: 12,
    paddingVertical: 16,
    paddingBottom: 40,
  },
  surface: {
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    borderWidth: 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: theme.colors.iconTint08,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 0,
  },
  iconBoxWrapper: {
    marginRight: 12,
    position: 'relative',
  },
  redDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.notificationAccent,
    borderWidth: 1.5,
    borderColor: theme.colors.surface,
  },
  headerText: {
    fontSize: 17,
    fontFamily: 'AnekBangla_800ExtraBold',
    color: theme.colors.onSurface,
    letterSpacing: -0.5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  half: {
    width: '47%',
  },
  label: {
    fontSize: 11,
    fontFamily: 'AnekBangla_800ExtraBold',
    marginBottom: 8,
    color: theme.colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  actionBtn: {
    borderRadius: 12,
    marginTop: 0,
    height: 42,
    justifyContent: 'center',
  },
  btnLabel: {
    fontSize: 14,
    fontFamily: 'AnekBangla_800ExtraBold',
    paddingVertical: 0,
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 13,
    color: theme.colors.onSurfaceVariant,
    marginBottom: 12,
    lineHeight: 18,
    fontFamily: 'AnekBangla_600SemiBold',
  },
  metadataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
    opacity: 0.8,
  },
  metadataItem: {
    flex: 1,
    alignItems: 'center',
  },
  metadataDivider: {
    width: 1,
    height: 20,
    backgroundColor: theme.colors.outlineVariant,
    opacity: 0.5,
  },
  metadataLabel: {
    fontSize: 9,
    fontFamily: 'AnekBangla_800ExtraBold',
    color: theme.colors.primary,
    textTransform: 'uppercase',
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  metadataValue: {
    fontSize: 12,
    fontFamily: 'AnekBangla_700Bold',
    color: theme.colors.onSurface,
  },
  themeToggleRow: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: 12,
    padding: 4,
  },
  themeBtn: {
    flex: 1,
    borderRadius: 10,
  },
  heroThemeScroll: {
    paddingVertical: 4,
    paddingRight: 20,
    gap: 12,
  },
  heroThemeCard: {
    width: 95,
    alignItems: 'center',
    borderRadius: 14,
    padding: 2,
    opacity: 0.6,
  },
  heroThemeCardActive: {
    opacity: 1,
  },
  heroThemePreviewContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 6,
    width: '100%',
    height: 52,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  heroThemePreview: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectionOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroThemeName: {
    fontSize: 10,
    fontFamily: 'AnekBangla_800ExtraBold',
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
  },
  heroThemeNameActive: {
    color: theme.colors.primary,
    fontFamily: 'AnekBangla_800ExtraBold',
  },
  newBadge: {
    backgroundColor: theme.colors.notificationAccent,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  newBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'AnekBangla_700Bold',
  },
});

export default SettingsScreen;

