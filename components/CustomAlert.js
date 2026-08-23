import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { Text, Surface, Button, useTheme, Divider } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CustomAlert = ({
    visible,
    title,
    message,
    buttons = [],
    onDismiss,
    icon = "information-outline"
}) => {
    const theme = useTheme();

    if (!visible) return null;

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onDismiss}
        >
            <View style={styles.overlay}>
                <Surface style={[
                    styles.container,
                    { backgroundColor: theme.dark ? theme.colors.elevation.level3 : theme.colors.surface }
                ]} elevation={5}>
                    <View style={styles.content}>
                        {icon && (
                            <View style={[styles.iconWrapper, { backgroundColor: theme.colors.primaryContainer + '30' }]}>
                                <Icon name={icon} size={30} color={theme.colors.primary} />
                            </View>
                        )}

                        {title && <Text style={styles.title}>{title}</Text>}
                        {message && <Text style={[styles.message, { color: theme.colors.onSurfaceVariant }]}>{message}</Text>}
                    </View>

                    <Divider style={[styles.divider, { backgroundColor: theme.colors.outlineVariant }]} />

                    <View style={styles.buttonRow}>
                        {buttons.length > 0 ? (
                            buttons.map((btn, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => {
                                        if (btn.onPress) btn.onPress();
                                        onDismiss();
                                    }}
                                    style={[
                                        styles.button,
                                        index < buttons.length - 1 && styles.buttonBorder,
                                        { borderRightColor: theme.colors.outlineVariant }
                                    ]}
                                >
                                    <Text style={[
                                        styles.buttonText,
                                        {
                                            color: btn.style === 'cancel' ? theme.colors.outline : theme.colors.primary,
                                            fontFamily: btn.style === 'cancel' ? 'AnekBangla_500Medium' : 'AnekBangla_700Bold'
                                        }
                                    ]}>
                                        {btn.text}
                                    </Text>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <TouchableOpacity onPress={onDismiss} style={styles.button}>
                                <Text style={[styles.buttonText, { color: theme.colors.primary }]}>ঠিক আছে</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </Surface>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    container: {
        width: '100%',
        maxWidth: 320,
        borderRadius: 24,
        overflow: 'hidden',
    },
    content: {
        paddingTop: 24,
        paddingBottom: 20,
        paddingHorizontal: 24,
        alignItems: 'center',
    },
    iconWrapper: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontFamily: 'AnekBangla_800ExtraBold',
        textAlign: 'center',
        marginBottom: 8,
    },
    message: {
        fontSize: 15,
        fontFamily: 'AnekBangla_500Medium',
        textAlign: 'center',
        lineHeight: 22,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    buttonRow: {
        flexDirection: 'row',
        height: 52,
    },
    button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonBorder: {
        borderRightWidth: 1,
    },
    buttonText: {
        fontSize: 16,
    },
});

export default CustomAlert;
