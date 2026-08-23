import React, { useState, useMemo } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TextInput,
    ImageBackground,
    Linking,
} from 'react-native';
import { Text, Surface, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../ThemeContext';
import { useFavorites } from '../FavoritesContext';
import { useTrainData } from '../DataContext';

const stationMapLinks = {
    'ভৈরব': 'https://maps.app.goo.gl/VtrF4pZNouEjXxNq5',
    'দৌলতকান্দি': 'https://maps.app.goo.gl/bZhhDN3uCNr9Vjc96',
    'শ্রীনিধি': 'https://maps.app.goo.gl/8SpgP6FeVBXwdQhE9',
    'মেথিকান্দা': 'https://maps.app.goo.gl/rkwX8jNLXM4X1sxS6',
    'হাঁটুভাঙ্গা': 'https://maps.app.goo.gl/psDsbn8kq4A1wD9K9',
    'খানাবাড়ী': 'https://maps.app.goo.gl/uUqtANxtPHGPJVFz8',
    'আমীরগঞ্জ': 'https://maps.app.goo.gl/x8SyBMFud1dX2XVT8',
    'নরসিংদী': 'https://maps.app.goo.gl/rAFXRWJdat5jgMw88',
    'জিনারদী': 'https://maps.app.goo.gl/NzWCGarJoBkWcrKRA',
    'ঘোড়াশাল': 'https://maps.app.goo.gl/skdUg3ZNxNpWSBud6',
    'আড়িখোলা': 'https://maps.app.goo.gl/u8j3jgAFXSn2b1S67',
    'পূবাইল': 'https://maps.app.goo.gl/eJLYEcaJUiWBQsvf8',
    'টঙ্গী': 'https://maps.app.goo.gl/xfp9SuNM7UTdc8Yd9',
    'বিমানবন্দর': 'https://maps.app.goo.gl/f8nuZu5gjd65ytU69',
    'ক্যান্টনমেন্ট': 'https://maps.app.goo.gl/wAVDamtjAcvZ65MA8',
    'তেজগাঁও': 'https://maps.app.goo.gl/Lq9ocMoAcywR2z4KA',
    'ঢাকা': 'https://maps.app.goo.gl/199jR4HkTmhb4TXX6',
};

const AllStationsScreen = () => {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const { heroTheme } = useAppTheme();
    const { favorites, toggleFavorite, isFavorite } = useFavorites();
    const { trains: trainData } = useTrainData();
    const [searchQuery, setSearchQuery] = useState('');

    const openMap = (url) => {
        Linking.openURL(url).catch((err) => console.warn('Cannot open map:', err));
    };

    // Extract all unique stations from context data
    const allStations = useMemo(() => {
        const stationsSet = new Set();
        Object.entries(trainData).forEach(([key, train]) => {
            if (key === '_metadata' || train.disabled === true) return;
            train.routes.forEach(stop => {
                stationsSet.add(stop.station.trim().normalize());
            });
        });
        return Array.from(stationsSet).sort((a, b) => a.localeCompare(b, 'bn'));
    }, [trainData]);

    // Filter stations based on search query
    const filteredStations = useMemo(() => {
        if (!searchQuery.trim()) return allStations;
        return allStations.filter(station =>
            station.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [allStations, searchQuery]);

    // Separate favorites and non-favorites
    const favoriteStations = filteredStations.filter(s => isFavorite(s));
    const otherStations = filteredStations.filter(s => !isFavorite(s));

    const renderStation = ({ item }) => {
        const favorite = isFavorite(item);
        return (
            <Surface style={styles.stationCard} elevation={1}>
                <View style={styles.stationContent}>
                    <View style={styles.stationIconBox}>
                        <Icon name="map-marker" size={20} color={theme.colors.primary} />
                    </View>
                    <Text style={styles.stationName}>{item}</Text>
                    {stationMapLinks[item] && (
                        <TouchableOpacity
                            onPress={() => openMap(stationMapLinks[item])}
                            style={styles.locationButton}
                            activeOpacity={0.7}
                        >
                            <Icon name="directions" size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        onPress={() => toggleFavorite(item)}
                        style={styles.favoriteButton}
                        activeOpacity={0.7}
                    >
                        <Icon
                            name={favorite ? 'minus-circle-outline' : 'plus-circle-outline'}
                            size={26}
                            color={favorite ? '#E53935' : theme.colors.primary}
                        />
                    </TouchableOpacity>
                </View>
            </Surface>
        );
    };

    const renderSectionHeader = (title) => (
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
        </View>
    );

    const styles = getStyles(theme, insets);

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

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Icon name="magnify" size={18} color={theme.colors.outline} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="স্টেশন খুঁজুন..."
                    placeholderTextColor={theme.colors.outline}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
                        <Icon name="close-circle" size={18} color={theme.colors.outline} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Stations List */}
            <FlatList
                data={[
                    ...(favoriteStations.length > 0 ? [{ type: 'header', title: 'নির্বাচিত স্টেশনসমূহ' }] : []),
                    ...favoriteStations.map(s => ({ type: 'station', station: s })),
                    ...(favoriteStations.length > 0 && otherStations.length > 0 ? [{ type: 'divider' }] : []),
                    ...(otherStations.length > 0 ? [{ type: 'header', title: 'অন্যান্য সকল স্টেশন' }] : []),
                    ...otherStations.map(s => ({ type: 'station', station: s })),
                ]}
                keyExtractor={(item, index) => item.type + (item.station || index)}
                renderItem={({ item }) => {
                    if (item.type === 'header') return renderSectionHeader(item.title);
                    if (item.type === 'divider') return <View style={styles.divider} />;
                    if (item.type === 'station') return renderStation({ item: item.station });
                    return null;
                }}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Icon name="map-marker-off" size={48} color={theme.colors.outline} />
                        <Text style={styles.emptyText}>কোন স্টেশন পাওয়া যায়নি</Text>
                    </View>
                }
            />
        </View>
    );
};

const getStyles = (theme, insets) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    headerWrapper: {
        backgroundColor: 'transparent',
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
        height: 30, // Maintains structure without visible content
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 8,
        paddingHorizontal: 12,
        borderRadius: 12,
        elevation: 2,
        height: 44,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        fontFamily: 'AnekBangla_500Medium',
        color: theme.colors.onSurface,
        paddingVertical: 0,
        height: '100%',
    },
    clearButton: {
        padding: 4,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: insets.bottom + 16,
    },
    sectionHeader: {
        paddingVertical: 6,
        paddingHorizontal: 4,
    },
    sectionTitle: {
        fontSize: 14,
        fontFamily: 'AnekBangla_700Bold',
        color: theme.colors.primary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    stationCard: {
        marginBottom: 8,
        borderRadius: 12,
        backgroundColor: theme.colors.surface,
    },
    stationContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    stationIconBox: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: theme.colors.primaryContainer,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    stationName: {
        flex: 1,
        fontSize: 15,
        fontFamily: 'AnekBangla_600SemiBold',
        color: theme.colors.onSurface,
    },
    locationButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    favoriteButton: {
        padding: 6,
    },
    divider: {
        height: 1,
        backgroundColor: theme.colors.outlineVariant,
        marginVertical: 8,
        opacity: 0.5,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 48,
    },
    emptyText: {
        fontSize: 16,
        fontFamily: 'AnekBangla_500Medium',
        color: theme.colors.outline,
        marginTop: 16,
    },
});

export default AllStationsScreen;
