import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme, Surface } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TicketBottomNav = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const theme = useTheme();
    const insets = useSafeAreaInsets();

    const navItems = [
        {
            id: 'Home',
            label: 'হোম',
            icon: 'home-outline',
            activeIcon: 'home',
            screen: 'ETicketHome',
        },
        {
            id: 'BuyTicket',
            label: 'টিকিট কিনুন',
            icon: 'ticket-confirmation-outline',
            activeIcon: 'ticket-confirmation',
            screen: 'BuyTicket',
        },
        {
            id: 'Profile',
            label: 'প্রোফাইল',
            icon: 'account-outline',
            activeIcon: 'account',
            screen: 'Profile',
        },
        {
            id: 'PurchaseHistory',
            label: 'ক্রয়কৃত টিকেট',
            icon: 'history',
            activeIcon: 'history', // Material icons has only one history? actually history is enough
            screen: 'PurchaseHistory',
        },
        {
            id: 'VerifyTicket',
            label: 'যাচাই',
            icon: 'check-decagram-outline',
            activeIcon: 'check-decagram',
            screen: 'VerifyTicket',
        },
    ];

    return (
        <Surface
            style={[
                styles.container,
                {
                    paddingBottom: Math.max(insets.bottom, 12),
                    backgroundColor: theme.colors.surface,
                    borderTopColor: theme.colors.outlineVariant,
                },
            ]}
            elevation={4}
        >
            <View style={styles.navContent}>
                {navItems.map((item) => {
                    const isActive = route.name === item.screen;
                    return (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.navItem}
                            onPress={() => navigation.navigate(item.screen)}
                            activeOpacity={0.7}
                        >
                            <View style={[
                                styles.iconContainer,
                                isActive && { backgroundColor: theme.colors.iconTint12 }
                            ]}>
                                <Icon
                                    name={isActive ? item.activeIcon : item.icon}
                                    size={24}
                                    color={isActive ? theme.colors.primary : theme.colors.onSurfaceVariant}
                                />
                            </View>
                            <Text
                                style={[
                                    styles.label,
                                    { color: isActive ? theme.colors.primary : theme.colors.onSurfaceVariant },
                                    isActive && { fontFamily: 'AnekBangla_700Bold' }
                                ]}
                            >
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </Surface>
    );
};

const styles = StyleSheet.create({
    container: {
        borderTopWidth: 1,
        paddingTop: 10,
        paddingHorizontal: 10,
    },
    navContent: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 48,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    label: {
        fontSize: 11,
        fontFamily: 'AnekBangla_500Medium',
    },
});

export default TicketBottomNav;
