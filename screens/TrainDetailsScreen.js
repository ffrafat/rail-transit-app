import React, { useLayoutEffect, useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, ImageBackground, TouchableOpacity, Share } from 'react-native';
import { Text, useTheme, Surface } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../ThemeContext';
import { useTrainData } from '../DataContext';
import { toBengaliDigits } from '../utils/bengali';

const TrainDetailsScreen = ({ route, navigation }) => {
  const trainNo = route.params?.trainNo;
  const [details, setDetails] = useState(null);
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { heroTheme } = useAppTheme();
  const { trains } = useTrainData();
  const styles = getStyles(theme, insets);

  useEffect(() => {
    if (trainNo && trains[trainNo]) {
      const trainDetails = trains[trainNo];
      if (trainDetails.disabled === true) {
        setDetails(null);
      } else {
        setDetails(trainDetails);
      }
    } else {
      setDetails(null);
    }
  }, [trainNo, trains]);

  const formatToBengaliTime = (timeStr) => {
    if (!timeStr || timeStr === '—' || timeStr.trim() === '') return '—';
    const parts = timeStr.split(':');
    if (parts.length !== 2) return toBengaliDigits(timeStr);

    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const period = hours >= 12 ? 'PM' : 'AM';
    let displayHours = hours % 12;
    if (displayHours === 0) displayHours = 12;

    const formattedHours = toBengaliDigits(displayHours.toString().padStart(2, '0'));
    const formattedMinutes = toBengaliDigits(minutes.toString().padStart(2, '0'));

    return `${formattedHours}:${formattedMinutes} ${period}`;
  };

  const formatToBengaliDuration = (durationStr) => {
    if (!durationStr || durationStr === '—' || durationStr === '00:00' || durationStr.trim() === '') return '—';
    const parts = durationStr.split(':');
    if (parts.length !== 2) return toBengaliDigits(durationStr);

    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);

    let result = '';
    if (hours > 0) {
      result += `${toBengaliDigits(hours)} ঘণ্টা `;
      if (minutes > 0) {
        result += `${toBengaliDigits(parts[1])} মিনিট`;
      }
    } else {
      result += `${toBengaliDigits(parts[1])} মিনিট`;
    }
    return result.trim();
  };

  const handleShare = async () => {
    if (!details) return;

    const runsOnText = Array.isArray(details.runsOn) ? details.runsOn.join(', ') : 'তথ্য নেই';
    const allDays = ['শনি', 'রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহস্পতি', 'শুক্র'];
    const offDaysText = Array.isArray(details.runsOn)
      ? allDays.filter(d => !details.runsOn.includes(d)).join(', ')
      : '';
    const stops = Array.isArray(details.routes) ? details.routes : [];
    const stopsText = stops
      .map(s => `📍 ${s.station}\n   আগমন: ${formatToBengaliTime(s.arrival)} | ছাড়ে: ${formatToBengaliTime(s.departure)}`)
      .join('\n');

    const message = [
      `🚆 ${details.name} (${toBengaliDigits(trainNo)})`,
      '',
      `চলাচলের দিন: ${runsOnText}`,
      offDaysText ? `বন্ধের দিন: ${offDaysText}বার` : null,
      '',
      stopsText,
      '',
      `মোট সময়কাল: ${formatToBengaliDuration(details.totalDuration)}`,
      '',
      '📲 রেল ট্রানজিট অ্যাপ ডাউনলোড করুন:',
      'https://play.google.com/store/apps/details?id=cc.rafat.narsingditransit',
    ].filter(line => line !== null).join('\n');

    try {
      await Share.share({ message });
    } catch (e) {
      console.warn('Share failed:', e);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `${details?.name || 'ট্রেন'} (${toBengaliDigits(trainNo)})`,
      headerRight: () => (
        details ? (
          <TouchableOpacity onPress={handleShare} style={styles.shareBtn} activeOpacity={0.7}>
            <Icon name="share-variant" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        ) : null
      ),
    });
  }, [navigation, details, trainNo]);

  const HeaderContent = () => (
    <View style={styles.headerTitleWrapper}>
      {/* Title handled by navigation */}
    </View>
  );

  if (!details) {
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
        <View style={styles.fallbackContainer}>
          <Text style={styles.fallbackText}>
            দুঃখিত! ট্রেনের বিস্তারিত তথ্য পাওয়া যায়নি।
          </Text>
        </View>
      </View>
    );
  }

  const runsOn = Array.isArray(details.runsOn)
    ? details.runsOn.join(', ')
    : 'তথ্য নেই';

  // Calculate off days: days not in runsOn array
  const allBnDays = ['শনি', 'রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহস্পতি', 'শুক্র'];
  const offDays = Array.isArray(details.runsOn)
    ? allBnDays.filter(d => !details.runsOn.includes(d)).join(', ')
    : '';

  const routeStops = Array.isArray(details.routes) ? details.routes : [];

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
        <Surface style={styles.infoCard} elevation={2}>
          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Icon name="calendar-check" size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>চলাচলের দিন</Text>
              <Text style={styles.infoValue}>{runsOn}</Text>
            </View>
          </View>
        </Surface>

        {offDays && (
          <View style={styles.offDayCard}>
            <View style={styles.infoRow}>
              <View style={styles.offDayIconBox}>
                <Icon name="calendar-remove" size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.offDayLabel}>বন্ধের দিন</Text>
                <Text style={styles.offDayValue}>{offDays}বার</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.sectionHeader}>
          <View style={styles.sectionIconBox}>
            <Icon name="train-car" size={20} color={theme.colors.primary} />
          </View>
          <Text style={styles.sectionTitle}>স্টপেজসমূহ</Text>
        </View>

        {routeStops.length > 0 ? (
          routeStops.map((stop, index) => (
            <Surface key={index} style={styles.stopCard} elevation={2}>
              <View style={styles.stationHeader}>
                <View style={styles.stationIconBox}>
                  <Icon name="map-marker" size={18} color={theme.colors.primary} />
                </View>
                <Text style={styles.station}>{stop.station}</Text>
              </View>

              <View style={[styles.stopDetailsRow, { marginBottom: 4 }]}>
                <View style={styles.stopDetail}>
                  <View style={styles.smallIconBox}>
                    <Icon name="clock-outline" size={16} color={theme.colors.primary} />
                  </View>
                  <View>
                    <Text style={styles.detailLabel}>আগমন</Text>
                    <Text style={styles.detailValue}>{formatToBengaliTime(stop.arrival)}</Text>
                  </View>
                </View>

                <View style={styles.stopDetail}>
                  <View style={styles.smallIconBox}>
                    <Icon name="clock-check-outline" size={16} color={theme.colors.primary} />
                  </View>
                  <View>
                    <Text style={styles.detailLabel}>ছাড়ে</Text>
                    <Text style={styles.detailValue}>{formatToBengaliTime(stop.departure)}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.stopDetailsRow}>
                <View style={styles.stopDetail}>
                  <View style={styles.smallIconBox}>
                    <Icon name="timer-sand" size={16} color={theme.colors.primary} />
                  </View>
                  <View>
                    <Text style={styles.detailLabel}>বিরতি</Text>
                    <Text style={styles.detailValue}>{formatToBengaliDuration(stop.halt)}</Text>
                  </View>
                </View>

                <View style={styles.stopDetail}>
                  <View style={styles.smallIconBox}>
                    <Icon name="clock-time-four-outline" size={16} color={theme.colors.primary} />
                  </View>
                  <View>
                    <Text style={styles.detailLabel}>সময়কাল</Text>
                    <Text style={styles.detailValue}>{formatToBengaliDuration(stop.duration)}</Text>
                  </View>
                </View>
              </View>
            </Surface>
          ))
        ) : (
          <Text style={styles.fallbackText}>স্টপেজ তথ্য পাওয়া যায়নি।</Text>
        )}

        <Surface style={styles.durationCard} elevation={2}>
          <View style={styles.durationIconBox}>
            <Icon name="clock-check-outline" size={22} color={theme.colors.primary} />
          </View>
          <View>
            <Text style={styles.durationLabel}>মোট সময়কাল</Text>
            <Text style={styles.durationValue}>{formatToBengaliDuration(details.totalDuration)}</Text>
          </View>
        </Surface>
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
  shareBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    padding: 12,
    paddingTop: 12,
    paddingBottom: 30,
  },
  fallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  fallbackText: {
    fontSize: 15,
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    fontFamily: 'AnekBangla_700Bold',
  },
  infoCard: {
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: theme.colors.iconTint08,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    fontFamily: 'AnekBangla_800ExtraBold',
    color: theme.colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 0,
  },
  infoValue: {
    fontSize: 15,
    fontFamily: 'AnekBangla_700Bold',
    color: theme.colors.onSurface,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 10,
    gap: 8,
  },
  sectionIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: theme.colors.iconTint08,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'AnekBangla_800ExtraBold',
    color: theme.colors.onSurface,
    letterSpacing: -0.3,
  },
  stopCard: {
    borderRadius: 18,
    backgroundColor: theme.colors.surface,
    padding: 12,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  stationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  stationIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: theme.colors.iconTint08,
    justifyContent: 'center',
    alignItems: 'center',
  },
  station: {
    fontSize: 16,
    fontFamily: 'AnekBangla_800ExtraBold',
    color: theme.colors.onSurface,
    letterSpacing: -0.3,
  },
  stopDetailsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
  },
  stopDetail: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  smallIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: theme.colors.iconTint08,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 10,
    fontFamily: 'AnekBangla_800ExtraBold',
    color: theme.colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: -2,
  },
  detailValue: {
    fontSize: 13,
    fontFamily: 'AnekBangla_700Bold',
    color: theme.colors.onSurface,
  },
  durationCard: {
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    padding: 16,
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  durationIconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: theme.colors.iconTint08,
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationLabel: {
    fontSize: 11,
    fontFamily: 'AnekBangla_800ExtraBold',
    color: theme.colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  durationValue: {
    fontSize: 17,
    fontFamily: 'AnekBangla_800ExtraBold',
    color: theme.colors.onSurface,
    letterSpacing: -0.4,
  },
  offDayCard: {
    borderRadius: 20,
    backgroundColor: theme.colors.iconTint08,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.iconTint10,
  },
  offDayIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: theme.colors.iconTint12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  offDayLabel: {
    fontSize: 11,
    fontFamily: 'AnekBangla_800ExtraBold',
    color: theme.colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  offDayValue: {
    fontSize: 15,
    fontFamily: 'AnekBangla_700Bold',
    color: theme.colors.onSurface,
  },
});


export default TrainDetailsScreen;
