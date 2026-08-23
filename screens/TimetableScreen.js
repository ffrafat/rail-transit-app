import React, { useEffect, useState, useLayoutEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text as RNText,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Linking,
  Share,
} from 'react-native';
import {
  Button,
  Surface,
  useTheme,
} from 'react-native-paper';
import { useAlert } from '../AlertContext';
import { useNavigation } from '@react-navigation/native';
import TrainCard from '../components/TrainCard';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import PulsingTimerIcon from '../components/PulsingTimerIcon';
import SearchableModalSelector from '../components/SearchableModalSelector';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useAppTheme } from '../ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import useUpdatePrompt from '../hooks/useUpdatePrompt';
import { useFavorites } from '../FavoritesContext';

import { useTrainData } from '../DataContext';
import { engToBengaliDigit } from '../utils/bengali';

const bengaliDays = {
  Sunday: 'রবি',
  Monday: 'সোম',
  Tuesday: 'মঙ্গল',
  Wednesday: 'বুধ',
  Thursday: 'বৃহস্পতি',
  Friday: 'শুক্র',
  Saturday: 'শনি',
};

const bengaliMonths = {
  January: 'জানুয়ারি',
  February: 'ফেব্রুয়ারি',
  March: 'মার্চ',
  April: 'এপ্রিল',
  May: 'মে',
  June: 'জুন',
  July: 'জুলাই',
  August: 'আগস্ট',
  September: 'সেপ্টেম্বর',
  October: 'অক্টোবর',
  November: 'নভেম্বর',
  December: 'ডিসেম্বর',
};

const getBengaliTime = (date) => {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? 'অপ.' : 'পূ.';
  hours = hours % 12 || 12;
  return {
    time: `${engToBengaliDigit(hours.toString().padStart(2, '0'))}:${engToBengaliDigit(minutes.toString().padStart(2, '0'))}`,
    period: period
  };
};

const getBengaliDate = (date) => {
  const day = engToBengaliDigit(date.getDate());
  const month = bengaliMonths[date.toLocaleDateString('en-US', { month: 'long' })];
  const year = engToBengaliDigit(date.getFullYear());
  return `${day} ${month}, ${year}`;
};

const TimetableScreen = () => {
  const {
    themeMode,
    heroTheme,
    defaultFrom,
    defaultTo,
    setDefaultFrom,
    setDefaultTo
  } = useAppTheme();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const styles = getStyles(theme, insets);
  useUpdatePrompt();
  const navigation = useNavigation();
  const { favorites } = useFavorites();
  const { trains: trainData, updateAvailable, version, checkForUpdates, performDirectUpdate, notices, dismissNotice } = useTrainData();
  const { showAlert } = useAlert();

  const [from, setFrom] = useState(defaultFrom || 'ঢাকা');
  const [to, setTo] = useState(defaultTo || 'চট্টগ্রাম');
  const [trains, setTrains] = useState([]);
  const [hasShownUpdatePopup, setHasShownUpdatePopup] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [passedTrains, setPassedTrains] = useState([]);

  // Sync with global defaults when they load from storage
  useEffect(() => {
    if (defaultFrom && defaultTo) {
      setFrom(defaultFrom);
      setTo(defaultTo);
    }
  }, [defaultFrom, defaultTo]);

  const NoticeCard = ({ noticeItem }) => {
    if (!noticeItem) return null;
    const bgColor = theme.colors.primaryContainer + '25'; // Light primary background
    const accentColor = theme.colors.primary;

    return (
      <Surface style={[styles.noticeCard, { backgroundColor: bgColor, borderColor: theme.colors.primaryContainer, borderWidth: 1 }]} elevation={0}>
        <View style={[styles.noticeIconBox, { backgroundColor: theme.colors.primaryContainer + '40' }]}>
          <Icon name="information-variant" size={22} color={accentColor} />
        </View>
        <View style={styles.noticeContent}>
          {noticeItem.title ? (
            <RNText style={[styles.noticeTitle, { color: accentColor }]}>{noticeItem.title}</RNText>
          ) : null}
          <RNText style={[styles.noticeText, { color: theme.colors.onSurfaceVariant }]}>{noticeItem.message}</RNText>
          {noticeItem.link && noticeItem.action && (
            <TouchableOpacity
              style={[styles.noticeActionBtn, { borderColor: accentColor }]}
              onPress={() => Linking.openURL(noticeItem.link)}
            >
              <RNText style={[styles.noticeActionText, { color: accentColor }]}>
                {noticeItem.action}
              </RNText>
              <Icon name="chevron-right" size={14} color={accentColor} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          onPress={() => dismissNotice(noticeItem.id)}
          style={[styles.noticeDismissBtn, { backgroundColor: theme.colors.primaryContainer + '30' }]}
          activeOpacity={0.7}
        >
          <Icon name="close" size={18} color={accentColor} />
        </TouchableOpacity>
      </Surface>
    );
  };

  useEffect(() => {
    if (updateAvailable && !hasShownUpdatePopup) {
      showAlert(
        'নতুন আপডেট পাওয়া গেছে',
        `নতুন সময়সূচি (v${updateAvailable}) পাওয়া গেছে। আপনি কি এখনই আপডেট করতে চান?`,
        [
          { text: 'এখনই না', style: 'cancel' },
          {
            text: 'আপডেট করুন',
            onPress: async () => {
              await performDirectUpdate();
            }
          },
        ],
        'cloud-download-outline'
      );
      setHasShownUpdatePopup(true);
    }
  }, [updateAvailable, hasShownUpdatePopup]);

  // Use favorites for dropdown, sorted alphabetically
  const LOCATIONS = favorites.length > 0
    ? [...favorites].sort((a, b) => a.localeCompare(b, 'bn'))
    : ['ঢাকা', 'বিমানবন্দর', 'নরসিংদী', 'মেথিকান্দা', 'ভৈরব', 'সিলেট', 'চট্টগ্রাম'];

  // Handlers with validation and global persistence
  const handleFromChange = (newFrom) => {
    if (newFrom === to) {
      setTo(from);
      setDefaultTo(from);
    }
    setFrom(newFrom);
    setDefaultFrom(newFrom);
  };

  const handleToChange = (newTo) => {
    if (newTo === from) {
      setFrom(to);
      setDefaultFrom(to);
    }
    setTo(newTo);
    setDefaultTo(newTo);
  };

  const handleSwap = () => {
    const tempFrom = from;
    const tempTo = to;
    setFrom(tempTo);
    setTo(tempFrom);
    setDefaultFrom(tempTo);
    setDefaultTo(tempFrom);
  };

  // Main data processing logic
  const processTrains = useCallback(() => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const engToday = days[date.getDay()];
    const todayBn = bengaliDays[engToday]; // Get full Bengali day name to match JSON
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    // All Bengali day abbreviations in order
    const allBnDays = ['শনি', 'রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহস্পতি', 'শুক্র'];

    const filtered = Object.entries(trainData).filter(([key]) => key !== '_metadata').reduce((acc, [trainNo, details]) => {
      // Skip disabled trains
      if (details.disabled === true) return acc;

      const routes = details.routes;
      const fromIndex = routes.findIndex(r => r.station.trim().normalize() === from);
      const toIndex = routes.findIndex(r => r.station.trim().normalize() === to);

      // 1. Must contain both stations and 'to' must be after 'from'
      if (fromIndex !== -1 && toIndex !== -1 && toIndex > fromIndex) {
        const fromStop = routes[fromIndex];

        // 2. Off-Day Logic: Check if current day is in runsOn array
        const isOff = !details.runsOn.includes(todayBn);

        if (!isOff) {
          const departureTimeStr = fromStop.departure || fromStop.arrival;
          if (departureTimeStr) {
            const [h, m] = departureTimeStr.split(':').map(Number);
            const trainTime = new Date(date);
            trainTime.setHours(h, m, 0, 0);

            // Calculate off-days: days not in runsOn array
            const offDays = allBnDays.filter(d => !details.runsOn.includes(d));
            const offDayLabel = offDays.length > 0 ? offDays.join(', ') : '';

            // Map to the structure expected by TrainCard
            acc.push({
              'Train No.': trainNo,
              'Train Name': details.name,
              'From Station Time': departureTimeStr,
              'Day Night Time': h >= 12 ? 'PM' : 'AM',
              'Start Station': routes[0].station,
              'End Station': routes[routes.length - 1].station,
              'Off Day': offDayLabel,
              __trainTime: trainTime,
            });
          }
        }
      }
      return acc;
    }, []);

    // Sort by time
    const sorted = filtered.sort((a, b) => a.__trainTime - b.__trainTime);

    if (isToday) {
      const upcoming = sorted.filter(t => t.__trainTime >= now);
      const passed = sorted.filter(t => t.__trainTime < now).reverse();
      setTrains(upcoming);
      setPassedTrains(passed);
    } else {
      setTrains(sorted);
      setPassedTrains([]);
    }
  }, [from, to, date, trainData]);

  useEffect(() => {
    processTrains();
  }, [processTrains]);

  // Re-filter every minute if it's "today"
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      if (date.toDateString() === now.toDateString()) {
        processTrains();
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [processTrains, date]);

  const handleShareRoute = async () => {
    const allTrains = [...trains, ...passedTrains].sort((a, b) => a.__trainTime - b.__trainTime);
    if (allTrains.length === 0) {
      showAlert('কোনো ট্রেন নেই', 'শেয়ার করার জন্য এই রুটে কোনো ট্রেন পাওয়া যায়নি।', [], 'alert-circle-outline');
      return;
    }

    const lines = allTrains.map(t => {
      const { time, period } = getBengaliTime(t.__trainTime);
      const offDay = t['Off Day'] ? ` (${t['Off Day']}বার বন্ধ)` : '';
      return `🚆 ${t['Train No.']} - ${t['Train Name']}\n   ছাড়ে: ${time} ${period}${offDay}`;
    }).join('\n\n');

    const message = `${from} → ${to}\nতারিখ: ${getBengaliDate(date)}\n\n${lines}\n\n📲 রেল ট্রানজিট অ্যাপ ডাউনলোড করুন:\nhttps://play.google.com/store/apps/details?id=cc.rafat.narsingditransit`;

    try {
      await Share.share({ message });
    } catch (e) {
      console.warn('Share failed:', e);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.navHeaderRight}>
          <TouchableOpacity
            style={styles.navShareBtn}
            activeOpacity={0.7}
            onPress={handleShareRoute}
          >
            <Icon name="share-variant" size={17} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navDatePill}
            activeOpacity={0.7}
            onPress={() => setShowDatePicker(true)}
          >
            <RNText style={styles.navDateText}>{getBengaliDate(date)}</RNText>
            <Icon name="chevron-down" size={14} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, date, styles, trains, passedTrains, from, to]);

  const getNextDepartureIn = () => {
    if (!trains?.length) return '';
    const now = new Date();
    const trainTime = trains[0].__trainTime;
    let diff = trainTime - now;
    if (diff < 0) return '';

    const hrs = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);

    let parts = [];
    if (hrs > 0) parts.push(`${engToBengaliDigit(hrs)} ঘণ্টা`);
    if (mins >= 0) parts.push(`${engToBengaliDigit(mins)} মিনিট`);
    return parts.join(' ');
  };

  const HeaderContent = () => (
    <>
      {Array.isArray(trains) && trains.length > 0 && date.toDateString() === new Date().toDateString() && (
        <View style={styles.headerCountdownWrapper}>
          <RNText style={styles.headerCountdownLabel}>পরবর্তী ট্রেন</RNText>
          <View style={styles.countdownValueRow}>
            <PulsingTimerIcon size={18} color="#FFFFFF" />
            <RNText style={styles.headerCountdownValue}>
              {getNextDepartureIn()}
              <RNText style={styles.headerCountdownSuffixInline}> পর</RNText>
            </RNText>
          </View>
        </View>
      )}
    </>
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

        <Surface style={styles.floatingSelector} elevation={2}>
          <View style={styles.selectorRow}>
            <View style={styles.stationBlock}>
              <View style={styles.hintRow}>
                <RNText style={styles.selectorHint}>যাত্রা</RNText>
              </View>
              <SearchableModalSelector
                options={LOCATIONS}
                selected={from}
                onChange={handleFromChange}
                label="যাত্রা শুরু"
                onNavigateToAllStations={() => navigation.navigate('সকল স্টেশন')}
              />
            </View>

            <View style={styles.swapBtnWrapper}>
              <TouchableOpacity
                style={styles.swapBtn}
                activeOpacity={0.8}
                onPress={handleSwap}
              >
                <Icon name="swap-horizontal" size={22} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.stationBlock}>
              <View style={[styles.hintRow, { justifyContent: 'flex-end' }]}>
                <RNText style={styles.selectorHint}>গন্তব্য</RNText>
              </View>
              <SearchableModalSelector
                options={LOCATIONS}
                selected={to}
                onChange={handleToChange}
                label="গন্তব্য স্টেশন"
                onNavigateToAllStations={() => navigation.navigate('সকল স্টেশন')}
              />
            </View>
          </View>
        </Surface>
      </View>

      {trains.length === 0 && passedTrains.length === 0 && (
        <View style={styles.emptyState}>
          <Icon name="calendar-question" size={64} color={theme.colors.outlineVariant} />
          <RNText style={styles.emptyText}>এই রুটে কোনো ট্রেন নেই</RNText>
        </View>
      )}

      {(trains.length > 0 || (trains.length === 0 && passedTrains.length > 0)) && (
        <FlatList
          data={[
            ...(updateAvailable ? [{ type: 'updateBanner' }] : []),
            ...(trains.length === 0 ? (notices || []).map(n => ({ type: 'notice', item: n })) : []),
            ...trains.reduce((acc, item, index) => {
              acc.push({ type: index === 0 ? 'hero' : 'train', item });
              if (index === 0) {
                (notices || []).forEach(n => acc.push({ type: 'notice', item: n }));
              }
              return acc;
            }, []),
            ...(passedTrains.length > 0 ? [{ type: 'passedHeader' }] : []),
            ...passedTrains.map(item => ({ type: 'passed', item })),
          ]}
          keyExtractor={(item, index) => item.type + (item.item?.['Train No.'] || index)}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            if (item.type === 'updateBanner') return (
              <TouchableOpacity
                style={styles.updateBanner}
                onPress={() => performDirectUpdate()}
              >
                <LinearGradient
                  colors={['#FF9800', '#F57C00']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.updateBannerGradient}
                >
                  <Icon name="cloud-download-outline" size={20} color="white" />
                  <RNText style={styles.updateBannerText}>নতুন সময়সূচি পাওয়া গেছে! আপডেট করুন</RNText>
                  <Icon name="chevron-right" size={20} color="white" />
                </LinearGradient>
              </TouchableOpacity>
            );
            if (item.type === 'notice') return <NoticeCard noticeItem={item.item} />;
            if (item.type === 'hero') return <TrainCard train={item.item} highlight />;
            if (item.type === 'train') return <TrainCard train={item.item} />;
            if (item.type === 'passedHeader') return (
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                  <Icon name="clock-check-outline" size={20} color={theme.colors.outline} />
                  <RNText style={styles.passedHeaderText}>ছেড়ে যাওয়া ট্রেন</RNText>
                </View>
                <View style={styles.headerLine} />
              </View>
            );
            if (item.type === 'passed') return <TrainCard train={item.item} passed />;
            return null;
          }}
          ListFooterComponent={
            <View style={styles.listFooter}>
              <View style={styles.footerContent}>
                <RNText style={styles.listFooterText}>
                  নিজ দায়িত্বে ব্যবহার করবেন। তথ্যে কোন ভুল থাকলে ডেভেলপার দায়ী নয়। অফিশিয়াল তথ্যের জন্য railway.gov.bd ভিজিট করুন।
                </RNText>
              </View>
            </View>
          }
        />
      )}

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="calendar"
          accentColor={theme.colors.primary}
          onChange={(event, selectedDate) => {
            if (event.type === 'set' && selectedDate) setDate(selectedDate);
            setShowDatePicker(false);
          }}
        />
      )}
    </View>
  );
};

const getStyles = (theme, insets) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerWrapper: {
    // Removed zIndex: 100 to avoid covering the transparent navigation header
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
    paddingTop: insets.top + 60, // Account for transparent header height
    paddingBottom: 75,
    paddingHorizontal: 20,
  },
  navHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginRight: 10,
  },
  navShareBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navDatePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  navDateText: {
    fontSize: 12,
    fontFamily: 'AnekBangla_800ExtraBold',
    color: '#FFFFFF',
    marginRight: 4,
  },
  headerCountdownWrapper: {
    alignItems: 'center',
    marginVertical: 4,
  },
  countdownValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  headerCountdownLabel: {
    fontSize: 12,
    fontFamily: 'AnekBangla_800ExtraBold',
    color: 'rgba(255, 255, 255, 0.8)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  headerCountdownValue: {
    fontSize: 22,
    fontFamily: 'AnekBangla_800ExtraBold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  headerCountdownSuffixInline: {
    fontSize: 12,
    fontFamily: 'AnekBangla_800ExtraBold',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  floatingSelector: {
    marginTop: -55,
    marginHorizontal: 12,
    backgroundColor: theme.colors.surface,
    borderRadius: 24,
    padding: 16,
    paddingTop: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    elevation: 4,
  },
  selectorRow: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stationBlock: {
    flex: 1,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surfaceVariant,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  dropdownText: {
    fontSize: 16,
    fontFamily: 'AnekBangla_700Bold',
    color: theme.colors.onSurface,
    flex: 1,
  },
  selectorHint: {
    fontSize: 11,
    fontFamily: 'AnekBangla_800ExtraBold',
    color: theme.colors.outline,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginHorizontal: 4,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  swapBtnWrapper: {
    paddingTop: 20, // To align with the dropdown pills
    marginHorizontal: 12,
  },
  swapBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  listContainer: {
    paddingTop: 4, // Further reduced to move cards significantly higher up
    paddingBottom: 30,
  },
  updateBanner: {
    marginHorizontal: 12,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  updateBannerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 10,
  },
  updateBannerText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'AnekBangla_700Bold',
    color: 'white',
  },
  nextTrainBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    marginHorizontal: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.iconTint08,
  },
  timerIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.iconTint08,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  bannerInfo: {
    flex: 1,
  },
  nextTrainLabel: {
    fontSize: 11,
    fontFamily: 'AnekBangla_800ExtraBold',
    color: theme.colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    opacity: 0.8,
  },
  countdownText: {
    fontSize: 18,
    fontFamily: 'AnekBangla_800ExtraBold',
    color: theme.colors.onSurface,
    marginTop: 2,
  },
  liveStatus: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  liveText: {
    fontSize: 10,
    fontFamily: 'AnekBangla_800ExtraBold',
    color: theme.colors.primary,
    textTransform: 'uppercase',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 8,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.iconTint12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    marginRight: 10,
    borderWidth: 1,
    borderColor: theme.colors.iconTint15,
  },
  sectionHeaderText: {
    fontSize: 13,
    fontFamily: 'AnekBangla_800ExtraBold',
    color: theme.colors.primary,
    marginLeft: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  passedHeaderText: {
    fontSize: 13,
    fontFamily: 'AnekBangla_800ExtraBold',
    color: theme.colors.outline,
    marginLeft: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  headerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.outlineVariant,
    opacity: 0.5,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    fontFamily: 'AnekBangla_700Bold',
    color: theme.colors.outline,
  },
  allPassedContainer: {
    alignItems: 'center',
    padding: 30,
    marginTop: 20,
  },
  allPassedText: {
    fontSize: 20,
    fontFamily: 'AnekBangla_700Bold',
    color: theme.colors.onSurface,
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  tomorrowBtn: {
    borderRadius: 14,
    paddingVertical: 4,
  },
  centeredList: {
    padding: 12,
  },
  listFooter: {
    padding: 20,
    alignItems: 'center',
  },
  noticeCard: {
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  noticeIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  noticeContent: {
    flex: 1,
    gap: 4,
  },
  noticeTitle: {
    fontSize: 15,
    fontFamily: 'AnekBangla_800ExtraBold',
    marginBottom: -2,
  },
  noticeText: {
    fontSize: 14,
    fontFamily: 'AnekBangla_600SemiBold',
    lineHeight: 20,
  },
  noticeActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 4,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
  },
  noticeActionText: {
    fontSize: 12,
    fontFamily: 'AnekBangla_700Bold',
  },
  noticeDismissBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    opacity: 0.6,
  },
  listFooterText: {
    fontSize: 11,
    fontFamily: 'AnekBangla_500Medium',
    color: theme.colors.outline,
    textAlign: 'center',
    flexShrink: 1,
  },
});

export default TimetableScreen;
