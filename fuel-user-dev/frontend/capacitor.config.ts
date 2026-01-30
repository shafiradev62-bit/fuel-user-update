import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fuelfriendly.app',
  appName: 'FuelFriendly',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    // For development: use local IP to access from mobile devices
    // url: 'http://192.168.0.160:5173', // Uncomment for mobile testing
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
      launchAutoHide: true,
      backgroundColor: '#ffffff',
      androidSplashResourceName: 'splash',
      showSpinner: false
    },
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '915622810812-41c4udago6s6he0nu6euplt91hupaoil.apps.googleusercontent.com',
      forceCodeForRefreshToken: true
    }
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true,
    loggingBehavior: 'debug'
  }
};

export default config;
