import { View, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../ThemeContext';
import { engToBengaliDigit } from '../utils/bengali';

const getBengaliTimeFromString = (time24h) => {
  if (!time24h) return '';
  let [hours, minutes] = time24h.split(':').map(Number);
  hours = hours % 12 || 12;
  return `${engToBengaliDigit(hours.toString().padStart(2, '0'))}:${engToBengaliDigit(minutes.toString().padStart(2, '0'))}`;
};

const TrainCard = ({ train, highlight, passed }) => {
  const navigation = useNavigation();
  const theme = useTheme();
  const { heroTheme } = useAppTheme();

  const trainNo = train['Train No.'] || '';
  const trainName = train['Train Name'] || '';
  const dayNight = train['Day Night Time'] || ''; // Now specifically AM or PM
  const time = getBengaliTimeFromString(train['From Station Time']);
  const offDay = train['Off Day']?.trim();

  const styles = getStyles(theme, highlight, passed);

  // Define dynamic colors to avoid StyleSheet property access issues
  const iconColors = {
    info: highlight ? '#FFFFFF' : passed ? 'rgba(7, 93, 55, 0.6)' : theme.colors.onSecondaryContainer,
    route: highlight ? 'rgba(255,255,255,0.8)' : passed ? 'rgba(7, 93, 55, 0.5)' : theme.colors.onSurfaceVariant,
    offDay: highlight ? '#FFFFFF' : passed ? 'rgba(7, 93, 55, 0.5)' : theme.colors.outline,
  };

  const CardContent = () => (
    <View style={styles.content}>
      {/* Vertical Accent Line */}
      {!highlight && !passed && <View style={styles.accentLine} />}

      {/* Left Section */}
      <View style={styles.leftSection}>
        <View style={styles.header}>
          <View style={styles.trainNoBox}>
            <Text style={styles.trainNoText}>{trainNo}</Text>
          </View>
          <Text style={styles.trainName} numberOfLines={1}>{trainName}</Text>
        </View>

        <View style={styles.routeRow}>
          <View style={styles.smallIconBox}>
            <Icon name="map-marker-path" size={16} color={iconColors.route} />
          </View>
          <Text style={styles.routeText} numberOfLines={1}>
            {train['Start Station']} → {train['End Station']}
          </Text>
        </View>

        {offDay && (
          <View style={styles.offDayRow}>
            <View style={styles.smallIconBox}>
              <Icon name="calendar-remove" size={14} color={iconColors.offDay} />
            </View>
            <Text style={styles.offDayText}>{offDay}বার</Text>
          </View>
        )}
      </View>

      <View style={styles.rightSection}>
        <View style={styles.timeContainer}>
          <Text style={styles.time}>{time}</Text>
          <Text style={styles.dayNight}>{dayNight}</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('TrainDetails', { trainNo })}
          style={[styles.btn, styles.btnInfo]}
        >
          <Icon
            name="chevron-right"
            size={highlight ? 20 : 18}
            color={iconColors.info}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (highlight) {
    return (
      <View style={styles.card}>
        {heroTheme.image ? (
          <>
            <ImageBackground
              source={heroTheme.image}
              style={StyleSheet.absoluteFill}
              resizeMode="cover"
            />
            {/* Layer 1: Dark shadow matching header icons */}
            <LinearGradient
              colors={['rgba(0,0,0,0.5)', 'transparent']}
              style={StyleSheet.absoluteFill}
            />
            {/* Layer 2: Theme color tint matching header (85% opacity) */}
            <LinearGradient
              colors={heroTheme.colors}
              style={StyleSheet.absoluteFill}
              opacity={0.85}
            />
          </>
        ) : (
          <LinearGradient
            colors={heroTheme.colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        )}
        <CardContent />
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <CardContent />
    </View>
  );
};

const getStyles = (theme, highlight, passed) => {
  const cardBg = highlight ? theme.colors.primary : passed ? theme.colors.iconTint08 : theme.colors.surface;
  const textColor = highlight ? '#FFFFFF' : passed ? 'rgba(7, 93, 55, 0.8)' : theme.colors.onSurface;
  const mutedColor = highlight ? 'rgba(255,255,255,0.8)' : passed ? 'rgba(7, 93, 55, 0.6)' : theme.colors.onSurfaceVariant;

  return StyleSheet.create({
    card: {
      marginHorizontal: 12,
      marginVertical: 8,
      borderRadius: 18,
      backgroundColor: highlight ? 'transparent' : cardBg,
      elevation: highlight ? 4 : passed ? 0 : 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: highlight ? 0.1 : passed ? 0 : 0.08,
      shadowRadius: highlight ? 4 : passed ? 0 : 15,
      borderWidth: 1,
      borderColor: highlight ? 'rgba(255,255,255,0.2)' : passed ? theme.colors.iconTint12 : 'rgba(0,0,0,0.03)',
      overflow: 'hidden',
    },
    content: {
      flexDirection: 'row',
      padding: highlight ? 20 : 18,
      alignItems: 'center',
    },
    leftSection: {
      flex: 1,
      justifyContent: 'center',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: highlight ? 8 : 4,
    },
    trainNoBox: {
      backgroundColor: highlight ? 'rgba(255,255,255,0.2)' : passed ? theme.colors.iconTint10 : theme.colors.primaryContainer,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      marginRight: 10,
    },
    trainNoText: {
      fontSize: 11,
      fontFamily: 'AnekBangla_800ExtraBold',
      color: highlight ? '#FFFFFF' : theme.colors.onPrimaryContainer,
      letterSpacing: 0.5,
    },
    trainName: {
      fontSize: highlight ? 18 : 16,
      fontFamily: 'AnekBangla_800ExtraBold',
      color: textColor,
      flex: 1,
    },
    routeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    routeText: {
      fontSize: 13,
      fontFamily: 'AnekBangla_600SemiBold',
      color: mutedColor,
      marginLeft: 10,
      flex: 1,
    },
    smallIconBox: {
      width: 28,
      height: 28,
      borderRadius: 8,
      backgroundColor: highlight ? 'rgba(255,255,255,0.15)' : theme.colors.iconTint08,
      justifyContent: 'center',
      alignItems: 'center',
    },
    offDayRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: highlight ? 4 : 2,
    },
    offDayText: {
      fontSize: 11,
      fontFamily: 'AnekBangla_700Bold',
      color: highlight ? '#FFFFFF' : passed ? 'rgba(7, 93, 55, 0.7)' : theme.colors.outline,
      marginLeft: 10,
    },
    rightSection: {
      flexDirection: highlight ? 'column' : 'row',
      alignItems: highlight ? 'flex-end' : 'center',
      justifyContent: 'center',
      marginLeft: highlight ? 16 : 8,
    },
    timeContainer: {
      alignItems: 'flex-end',
      marginBottom: highlight ? 8 : 0,
      marginRight: highlight ? 0 : 8,
    },
    dayNight: {
      fontSize: highlight ? 14 : 12,
      fontFamily: 'AnekBangla_800ExtraBold',
      color: highlight ? 'rgba(255,255,255,0.7)' : theme.colors.outline,
      textTransform: 'uppercase',
      letterSpacing: highlight ? 1 : 0.5,
      marginTop: highlight ? 2 : 1,
    },
    time: {
      fontSize: highlight ? 28 : 22,
      fontFamily: 'AnekBangla_800ExtraBold',
      color: highlight ? '#FFFFFF' : passed ? 'rgba(7, 93, 55, 0.85)' : theme.colors.primary,
      letterSpacing: -1,
      lineHeight: highlight ? 32 : 26,
    },

    actions: {
      flexDirection: 'row',
      marginTop: 4,
    },
    btn: {
      width: highlight ? 36 : 28,
      height: highlight ? 36 : 28,
      borderRadius: highlight ? 18 : 14,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: highlight ? 8 : 4,
    },
    btnInfo: {
      backgroundColor: highlight ? 'rgba(255, 255, 255, 0.2)' : passed ? theme.colors.iconTint10 : theme.colors.primaryContainer,
      borderWidth: highlight ? 1 : 0,
      borderColor: highlight ? 'rgba(255, 255, 255, 0.3)' : 'transparent',
      opacity: highlight ? 1 : 0.8,
      marginRight: highlight ? 2 : 0, // Slight nudge for alignment
    },
  });
};

export default TrainCard;
