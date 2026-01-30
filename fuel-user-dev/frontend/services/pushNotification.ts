// Temporarily disable push notifications for build
// import { messaging, getToken, onMessage } from './firebase.ts';
import { apiRegisterFCMToken } from './api';

class PushNotificationService {
  private vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
  
  async requestPermission(): Promise<boolean> {
    try {
      if (!('Notification' in window)) return false;
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  async getRegistrationToken(): Promise<string | null> {
    try {
      // Temporarily disabled for build
      console.warn('Firebase messaging temporarily disabled');
      return null;
    } catch (error) {
      console.error('Error getting registration token:', error);
      return null;
    }
  }

  async initializePushNotifications(customerId?: string): Promise<string | null> {
    try {
      if (!('Notification' in window)) {
        console.warn('This browser does not support notifications');
        return null;
      }

      const hasPermission = await this.requestPermission();
      if (!hasPermission) {
        console.warn('Notification permission denied');
        return null;
      }

      const token = await this.getRegistrationToken();
      
      if (token && customerId) {
        await this.registerTokenWithBackend(customerId, token);
        this.setupForegroundMessageListener();
        this.registerServiceWorker();
      }

      return token;
    } catch (error) {
      console.error('Error initializing push notifications:', error);
      return null;
    }
  }

  private async registerTokenWithBackend(customerId: string, token: string) {
    try {
      const deviceType = this.getDeviceType();
      await apiRegisterFCMToken(customerId, token, deviceType);
      console.log('FCM token registered with backend');
    } catch (error) {
      console.error('Error registering FCM token with backend:', error);
    }
  }

  private getDeviceType(): string {
    const userAgent = navigator.userAgent;
    if (/Android/i.test(userAgent)) return 'android';
    if (/iPhone|iPad|iPod/i.test(userAgent)) return 'ios';
    return 'web';
  }

  private setupForegroundMessageListener() {
    // Temporarily disabled
    console.log('Foreground message listener disabled for build');
  }

  private async registerServiceWorker() {
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        console.log('Service Worker registered:', registration);
      }
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }

  private showNotification(title: string, body: string, icon?: string) {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: icon || '/logo.png',
        badge: '/logo.png',
        tag: 'fuelfriendly-notification'
      });
    }
  }

  async sendTestNotification(): Promise<boolean> {
    try {
      this.showNotification(
        'Test Notification',
        'Push notifications are working!',
        '/logo.png'
      );
      return true;
    } catch (error) {
      console.error('Error sending test notification:', error);
      return false;
    }
  }

  getPermissionStatus(): NotificationPermission {
    return Notification.permission;
  }

  isSupported(): boolean {
    return 'Notification' in window && 'serviceWorker' in navigator;
  }
}

export const pushNotificationService = new PushNotificationService();