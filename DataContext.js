import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAlert } from './AlertContext';
import NetInfo from '@react-native-community/netinfo';
import bundledData from './assets/trainDetails.json';
import localNotice from './assets/notice.json';

const DataContext = createContext();

// 10 second timeout helper for fetch
const fetchWithTimeout = async (url, options = {}, timeout = 10000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
        const response = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(id);
        return response;
    } catch (e) {
        clearTimeout(id);
        throw e;
    }
};

export const DataProvider = ({ children }) => {
    const [trainData, setTrainData] = useState(bundledData);
    const [version, setVersion] = useState(bundledData._metadata?.version || '0');
    const [loading, setLoading] = useState(false);
    const [updateAvailable, setUpdateAvailable] = useState(false);
    const [lastChecked, setLastChecked] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    const { showAlert } = useAlert();
    const [notices, setNotices] = useState(() => {
        const base = Array.isArray(localNotice) ? localNotice.filter(n => n.enabled) : (localNotice?.enabled ? [localNotice] : []);
        return base.map(n => ({
            id: n.id,
            title: n.title || '',
            message: n.message || n.text || '',
            action: n.action || n.btnText || '',
            link: n.link || n.url || ''
        }));
    });

    const BASE_URL = 'https://raw.githubusercontent.com/ffrafat/rail-transit-app/refs/heads/main/assets';

    useEffect(() => {
        const init = async () => {
            const currentVersion = await loadData();
            await autoCheckUpdates(currentVersion);
        };
        init();
    }, []);

    const loadData = async () => {
        const bundledVersion = bundledData._metadata?.version || '0';
        try {
            const storedData = await AsyncStorage.getItem('train_data_v2');
            const storedLastChecked = await AsyncStorage.getItem('last_update_check');
            const storedLastUpdated = await AsyncStorage.getItem('last_update_success');

            if (storedLastChecked) setLastChecked(parseInt(storedLastChecked));
            if (storedLastUpdated) setLastUpdated(parseInt(storedLastUpdated));

            if (storedData) {
                const parsedData = JSON.parse(storedData);
                const storedVersion = parsedData._metadata?.version || '0';

                if (storedVersion > bundledVersion) {
                    setTrainData(parsedData);
                    setVersion(storedVersion);
                    return storedVersion; // return the actual effective version
                } else {
                    await AsyncStorage.removeItem('train_data_v2');
                }
            }
        } catch (error) {
            console.error('Error loading local data:', error);
        }
        return bundledVersion; // fallback to bundled version
    };

    // currentVersion is passed from loadData() to avoid reading stale React state
    const autoCheckUpdates = async (currentVersion) => {
        try {
            await fetchNotice();
            const lastCheck = await AsyncStorage.getItem('last_update_check');
            const now = Date.now();
            const ONE_DAY = 24 * 60 * 60 * 1000;

            if (!lastCheck || now - parseInt(lastCheck) > ONE_DAY) {
                const response = await fetchWithTimeout(`${BASE_URL}/version.json`, { headers: { 'Cache-Control': 'no-cache' } }, 5000);
                if (response.ok) {
                    const remote = await response.json();
                    if (remote.version > currentVersion) {
                        setUpdateAvailable(remote.version);
                    }
                    await AsyncStorage.setItem('last_update_check', now.toString());
                    setLastChecked(now);
                }
            }
        } catch (e) {
            console.log('Background update check failed:', e.message);
        }
    };

    const fetchNotice = async () => {
        try {
            const dismissedLogStr = await AsyncStorage.getItem('dismissed_notices_log');
            const dismissedLog = dismissedLogStr ? JSON.parse(dismissedLogStr) : {};
            const NOW = Date.now();
            const ONE_DAY = 24 * 60 * 60 * 1000;

            const OPENSHEET_URL = 'https://opensheet.elk.sh/1lTyZqxeUvkAEkqZ-W_wciuboS2K5np7Ximr_DdsSCpI/Notice';
            // Use short timeout for notices as they are secondary
            const response = await fetchWithTimeout(OPENSHEET_URL, {}, 5000);
            if (!response.ok) return;

            const remoteData = await response.json();
            const remoteNotices = Array.isArray(remoteData) ? remoteData : [remoteData];

            const activeNotices = remoteNotices.filter(item => {
                if (!item.id || item.enabled !== 'TRUE') return false;
                const dismissedAt = dismissedLog[item.id];
                if (dismissedAt && (NOW - dismissedAt < ONE_DAY)) return false;
                return true;
            }).map(item => ({
                id: item.id,
                title: item.title || '',
                message: item.message || item.text || '',
                action: item.action || item.btnText || '',
                link: item.link || item.url || ''
            }));

            setNotices(activeNotices);
        } catch (e) {
            console.log('Notice fetch failed or timed out:', e.message);
        }
    };

    const dismissNotice = async (id) => {
        try {
            const dismissedLogStr = await AsyncStorage.getItem('dismissed_notices_log');
            const dismissedLog = dismissedLogStr ? JSON.parse(dismissedLogStr) : {};
            dismissedLog[id] = Date.now();
            await AsyncStorage.setItem('dismissed_notices_log', JSON.stringify(dismissedLog));
            setNotices(prev => prev.filter(n => n.id !== id));
        } catch (e) {
            console.error(e);
        }
    };

    const performDirectUpdate = async () => {
        setLoading(true);
        try {
            const response = await fetchWithTimeout(`${BASE_URL}/trainDetails.json`, { headers: { 'Cache-Control': 'no-cache' } }, 20000);
            if (!response.ok) throw new Error('Download failed');
            const newData = await response.json();
            const now = Date.now();
            await AsyncStorage.setItem('train_data_v2', JSON.stringify(newData));
            await AsyncStorage.setItem('last_update_success', now.toString());
            setTrainData(newData);
            setVersion(newData._metadata?.version || '0');
            setLastUpdated(now);
            setUpdateAvailable(false);
            showAlert('সফল', 'সময়সূচি সফলভাবে আপডেট করা হয়েছে।', [], 'check-circle-outline');
            return true;
        } catch (error) {
            console.error('Update download failed:', error);
            showAlert('আপডেট ব্যর্থ', 'সার্ভার থেকে সঠিক তথ্য নামানো যায়নি।', [], 'alert-circle-outline');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const checkForUpdates = useCallback(async (isManual = false) => {
        if (loading) return;
        setLoading(true);
        try {
            const netState = await NetInfo.fetch();
            if (!netState.isConnected) {
                if (isManual) {
                    showAlert('ইন্টারনেট সংযোগ নেই', 'অনুগ্রহ করে ইন্টারনেটে সংযুক্ত হয়ে আবার চেষ্টা করুন।', [], 'wifi-off');
                }
                setLoading(false);
                return;
            }

            const vResponse = await fetchWithTimeout(`${BASE_URL}/version.json`, { headers: { 'Cache-Control': 'no-cache' } }, 10000);
            if (!vResponse.ok) throw new Error('Version check response not OK');
            const remote = await vResponse.json();

            if (remote.version > version) {
                if (isManual) {
                    showAlert('নতুন আপডেট পাওয়া গেছে', `নতুন সময়সূচি (v${remote.version}) পাওয়া গেছে। আপনি কি আপডেট করতে চান?`, [
                        { text: 'না', style: 'cancel' },
                        { text: 'হ্যাঁ, আপডেট করুন', onPress: () => performDirectUpdate() }
                    ], 'cloud-download-outline');
                } else {
                    setUpdateAvailable(remote.version);
                }
            } else if (isManual) {
                showAlert('কোনো আপডেট নেই', 'আপনার অ্যাপে সর্বশেষ সময়সূচি দেওয়া আছে।', [], 'check-circle-outline');
            }
            const checkTime = Date.now();
            await AsyncStorage.setItem('last_update_check', checkTime.toString());
            setLastChecked(checkTime);
        } catch (error) {
            console.error('Manual check failed:', error);
            if (isManual) showAlert('আপডেট চেক ব্যর্থ', 'সার্ভারের সাথে সংযোগ করা যাচ্ছে না। কিছুক্ষণ পর আবার চেষ্টা করুন।', [], 'alert-outline');
        } finally {
            setLoading(false);
        }
    }, [version, loading]);

    const resetToFactory = async () => {
        try {
            await AsyncStorage.removeItem('train_data_v2');
            await AsyncStorage.removeItem('last_update_success');
            await AsyncStorage.removeItem('dismissed_notices_log');
            setTrainData(bundledData);
            setVersion(bundledData._metadata?.version || '0');
            setLastUpdated(null);
            setUpdateAvailable(false);
            showAlert('রিসেট সফল', 'অ্যাপটি অরিজিনাল অবস্থায় ফিরে এসেছে।', [], 'restart');
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <DataContext.Provider value={{
            trains: trainData, version, loading, updateAvailable, lastChecked, lastUpdated, notices, dismissNotice, checkForUpdates, performDirectUpdate, resetToFactory
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useTrainData = () => useContext(DataContext);
