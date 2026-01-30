import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

class FirebaseService {
  constructor() {
    this.initialized = false;
    this.init();
  }

  init() {
    try {
      if (admin.apps.length === 0) {
        // Initialize with service account key or default credentials
        if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
          const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            projectId: process.env.FIREBASE_PROJECT_ID
          });
        } else {
          // Use default credentials (for production deployment)
          admin.initializeApp({
            projectId: process.env.FIREBASE_PROJECT_ID || 'fuelflow-asi'
          });
        }
        
        this.initialized = true;
        console.log('✅ Firebase Admin SDK initialized');
      }
    } catch (error) {
      console.error('❌ Firebase Admin SDK initialization failed:', error.message);
      this.initialized = false;
    }
  }

  async sendNotification(token, title, body, data = {}) {
    if (!this.initialized) {
      throw new Error('Firebase Admin SDK not initialized');
    }

    try {
      const message = {
        token,
        notification: {
          title,
          body
        },
        data: {
          ...data,
          timestamp: Date.now().toString()
        },
        android: {
          notification: {
            icon: 'ic_notification',
            color: '#3AC36C'
          }
        },
        apns: {
          payload: {
            aps: {
              badge: 1,
              sound: 'default'
            }
          }
        }
      };

      const response = await admin.messaging().send(message);
      console.log('✅ Notification sent successfully:', response);
      return { success: true, messageId: response };
    } catch (error) {
      console.error('❌ Failed to send notification:', error);
      throw error;
    }
  }

  async sendMulticast(tokens, title, body, data = {}) {
    if (!this.initialized) {
      throw new Error('Firebase Admin SDK not initialized');
    }

    try {
      const message = {
        tokens,
        notification: {
          title,
          body
        },
        data: {
          ...data,
          timestamp: Date.now().toString()
        }
      };

      const response = await admin.messaging().sendMulticast(message);
      console.log(`✅ Multicast sent: ${response.successCount}/${tokens.length} successful`);
      
      return {
        success: true,
        successCount: response.successCount,
        failureCount: response.failureCount,
        responses: response.responses
      };
    } catch (error) {
      console.error('❌ Failed to send multicast:', error);
      throw error;
    }
  }

  async validateToken(token) {
    if (!this.initialized) {
      return false;
    }

    try {
      await admin.messaging().send({
        token,
        data: { test: 'true' }
      }, true); // dry run
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default new FirebaseService();