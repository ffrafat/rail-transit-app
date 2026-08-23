import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import messaging from '@react-native-firebase/messaging';

import App from './App';

// Must be registered at module scope so Android can deliver notifications
// received while the app is backgrounded or fully killed.
messaging().setBackgroundMessageHandler(async () => {});

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
