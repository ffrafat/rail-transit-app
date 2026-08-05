# Rail Transit (রেল ট্রানজিট)

Unofficial, open-source (MIT) React Native / Expo app for Bangladesh Railway commuters. Solo-maintained by Faisal F Rafat. Published on Play Store as `cc.rafat.narsingditransit`. All user-facing text is Bangla.

## Stack

- Expo SDK 54, React Native 0.81, React 19, React Navigation 7 (drawer + native-stack)
- UI: `react-native-paper` (MD3 theme) + `expo-linear-gradient` + `@expo/vector-icons` (MaterialCommunityIcons)
- Font: Anek Bangla (loaded via `expo-font` in `App.js`, applied globally through `Text.defaultProps`)
- Storage: `@react-native-async-storage/async-storage` for all local persistence (no SQL/DB)
- `react-native-webview` for the entire e-ticket section (thin wrappers around eticket.railway.gov.bd)

## Architecture

Four context providers wrap the app (nesting order in `App.js`): `AlertProvider` > `DataProvider` > `FavoritesProvider`, with `ThemeProvider` outermost (wraps `MainApp` which reads theme before fonts load).

- **`ThemeContext.js`** — light/dark mode, "hero" background theme (`constants/heroThemes.js`: default/islamic/abstract), and default from/to stations. Persisted to AsyncStorage.
- **`DataContext.js`** — owns `trainDetails.json` data, OTA update checking/downloading, and notice fetching. See "Data & content pipeline" below.
- **`FavoritesContext.js`** — favorite stations list (min 2 enforced), persisted, defaults to 7 seed stations.
- **`AlertContext.js`** — renders a single global `CustomAlert` modal; call `showAlert(title, message, buttons, icon)` instead of RN's `Alert` for anything user-facing (keeps Bangla styling consistent).

Navigation (`navigation/MainNavigator.js`): a `Stack.Navigator` holds `DrawerHome` (the `Drawer.Navigator` with Timetable/Settings/E-Ticket/Links/Stations/About) plus a top-level `TrainDetails` screen. The e-ticket drawer item mounts `ticketscreens/TicketNavigator.js`, a separate native-stack for the WebView pages, each of which renders `ThemedHeader` + the WebView + `TicketBottomNav`.

## Data & content pipeline

- `assets/trainDetails.json` is bundled at build time; `_metadata.version` is a date-coded string (`YYMM.DD.NNN`, e.g. `2603.04.001`).
- At runtime, `DataContext` compares that version against `https://raw.githubusercontent.com/ffrafat/rail-transit-app/refs/heads/main/assets/version.json`. If remote is newer, it offers/performs an OTA download of `trainDetails.json` from the same GitHub raw path and caches it in AsyncStorage (`train_data_v2`) — this is how schedule corrections ship **without** an app store release. Editing the two JSON files on `main` and pushing is sufficient.
- In-app notices come from an `opensheet.elk.sh` proxy over a Google Sheet (`Notice` tab); `assets/notice.json` is the bundled fallback. Rows need `id` + `enabled === 'TRUE'`. Dismissals are logged per-id in AsyncStorage for 24h suppression.
- `validate_train_data.js` / `.py` cross-check `halt`/`duration` fields in `trainDetails.json` against consecutive arrival/departure times — run after hand-editing the schedule to catch typos.
- `clean_json.js` normalizes/trims station name strings across the dataset (Unicode `.normalize()` — station name matching elsewhere in the app relies on this being consistent).

## Design system ("Premium Emerald")

Full reference: `v2_MAINTENANCE_GUIDE.md`. Summary:
- Primary accent `#075d37` (light) / `#41ab5d` (dark); backgrounds are tinted green, not pure white/black (`theme.js`).
- Every screen follows the same header pattern: a rounded-bottom gradient/`ImageBackground` hero (using the active `heroTheme`) with `insets.top + 40` padding, then content below. Copy this pattern (see any screen in `screens/`) rather than inventing a new header style.
- Fonts: `AnekBangla_400Regular` through `_800ExtraBold`; headers get `700Bold`/`800ExtraBold`, body gets `400Regular`/`500Medium`.
- Icon boxes are a recurring motif: ~38-44px rounded square, `rgba(65, 171, 93, 0.08)` background, centered MaterialCommunityIcon in primary color.

## Conventions

- Bangla digits/dates/times are hand-converted (see `engToBengaliDigit`/`toBengaliDigits` helpers duplicated in `TimetableScreen.js`, `TrainCard.js`, `TrainDetailsScreen.js`, `SettingsScreen.js`) — no i18n library is used.
- Station names are matched by exact string equality after `.trim().normalize()`; any new station data must go through the same normalization or lookups will silently fail.
- Screens are plain function components with a `getStyles(theme, insets)` factory at the bottom of the file — follow this per-file pattern rather than extracting a shared stylesheet.
- No test suite or CI config exists in this repo — changes are validated manually (and via the `run` skill / dev server) before shipping.

## Build & release

```bash
eas build --platform android --profile preview --local   # local APK for testing
eas build --platform android --profile production         # AAB for Play Store
```
Version bumps: `app.json` `version` and `package.json` `version` should move together; `android.versionCode` in `app.json` is NOT the source of truth — `eas.json` sets `appVersionSource: "remote"` and the `production` profile has `autoIncrement: true`, so EAS manages `versionCode` remotely at build time. `assets/version.json` is a separate, independent version stream for the schedule-data OTA mechanism — don't conflate the two.

**Android target SDK**: managed via the `expo-build-properties` config plugin in `app.json` (`android.compileSdkVersion` / `android.targetSdkVersion`), explicitly pinned rather than left to Expo's default. Google requires the target API level to stay within ~1 year of the latest Android release or new app updates get blocked — when a new Android version ships, check whether the installed Expo SDK's default (`expo-modules-core`'s `ProjectConfiguration.kt` embeds the default) has moved past the pinned value, and bump the `expo-build-properties` config accordingly before it becomes a Play Console compliance warning.
