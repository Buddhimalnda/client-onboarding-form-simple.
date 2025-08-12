import { getToken, onMessage, Messaging } from 'firebase/messaging';
import { getFirebaseMessaging } from '../firebase';
import { AuthService } from './auth.service';

export class FCMService {
  private static messaging: Messaging | null = null;

  // Initialize FCM
  static async initialize(): Promise<void> {
    try {
      this.messaging = await getFirebaseMessaging();
      if (this.messaging) {
        console.log('FCM initialized successfully');
      }
    } catch (error) {
      console.error('Error initializing FCM:', error);
    }
  }

  // Request notification permission
  static async requestPermission(): Promise<NotificationPermission> {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      console.log('Notification permission:', permission);
      return permission;
    }
    return 'denied';
  }

  // Get FCM token
  static async getToken(): Promise<string | null> {
    try {
      if (!this.messaging) {
        await this.initialize();
      }

      if (!this.messaging) {
        throw new Error('Messaging not initialized');
      }

      const permission = await this.requestPermission();
      if (permission !== 'granted') {
        console.log('Notification permission denied');
        return null;
      }

      const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
      if (!vapidKey) {
        throw new Error('VAPID key not found');
      }

      const token = await getToken(this.messaging, {
        vapidKey: vapidKey,
      });

      if (token) {
        console.log('FCM Token received:', token);
        return token;
      } else {
        console.log('No registration token available.');
        return null;
      }
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  }

  // Save FCM token to backend
  static async saveFCMTokenToBackend(userToken: string, device: string = 'web'): Promise<boolean> {
    try {
      const fcmToken = await this.getToken();
      if (!fcmToken) {
        console.error('No FCM token available');
        return false;
      }

      await AuthService.saveFCMToken({
        token: userToken,
        fcmToken: fcmToken,
        device: device
      });

      console.log('FCM token saved to backend successfully');
      return true;
    } catch (error) {
      console.error('Error saving FCM token to backend:', error);
      return false;
    }
  }

  // Listen for foreground messages
  static async onMessageListener(): Promise<void> {
    try {
      if (!this.messaging) {
        await this.initialize();
      }

      if (!this.messaging) {
        throw new Error('Messaging not initialized');
      }

      onMessage(this.messaging, (payload) => {
        console.log('Message received in foreground: ', payload);
        
        // Display notification
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(payload.notification?.title || 'New Message', {
            body: payload.notification?.body,
            icon: payload.notification?.icon || '/icon-192x192.png',
            data: payload.data
          });
        }
      });
    } catch (error) {
      console.error('Error setting up message listener:', error);
    }
  }

  // Get device info
  static getDeviceInfo(): string {
    const userAgent = navigator.userAgent;
    if (/android/i.test(userAgent)) {
      return 'android-web';
    } else if (/iPad|iPhone|iPod/.test(userAgent)) {
      return 'ios-web';
    } else {
      return 'desktop-web';
    }
  }
}