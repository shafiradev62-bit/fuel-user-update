import { db } from '../db.js';
import { fcmTokens, notifications, customers } from '../shared/schema.js';
import { eq, and, sql } from 'drizzle-orm';
import firebaseService from './firebase.service.js';

class NotificationService {
  
  async registerToken(customerId, token, deviceType = 'web') {
    try {
      // Deactivate old tokens for this customer and device type
      await db.update(fcmTokens)
        .set({ isActive: false })
        .where(and(
          eq(fcmTokens.customerId, customerId),
          eq(fcmTokens.deviceType, deviceType)
        ));

      // Insert new token
      const [newToken] = await db.insert(fcmTokens).values({
        customerId,
        token,
        deviceType,
        isActive: true
      }).returning();

      console.log(`✅ FCM token registered for customer ${customerId}`);
      return newToken;
    } catch (error) {
      console.error('❌ Failed to register FCM token:', error);
      throw error;
    }
  }

  async getActiveTokens(customerId) {
    try {
      const tokens = await db.select()
        .from(fcmTokens)
        .where(and(
          eq(fcmTokens.customerId, customerId),
          eq(fcmTokens.isActive, true)
        ));

      return tokens.map(t => t.token);
    } catch (error) {
      console.error('❌ Failed to get active tokens:', error);
      return [];
    }
  }

  async sendToCustomer(customerId, title, body, data = {}) {
    try {
      const tokens = await this.getActiveTokens(customerId);
      
      if (tokens.length === 0) {
        console.log(`⚠️ No active tokens for customer ${customerId}`);
        return { success: false, reason: 'No active tokens' };
      }

      // Send notification via Firebase
      let result;
      if (tokens.length === 1) {
        result = await firebaseService.sendNotification(tokens[0], title, body, data);
      } else {
        result = await firebaseService.sendMulticast(tokens, title, body, data);
      }

      // Store notification in database
      await db.insert(notifications).values({
        customerId,
        title,
        body,
        data: JSON.stringify(data),
        isRead: false
      });

      return result;
    } catch (error) {
      console.error('❌ Failed to send notification to customer:', error);
      throw error;
    }
  }

  async sendOrderNotification(customerId, orderId, status) {
    const messages = {
      confirmed: {
        title: 'Order Confirmed! 🎉',
        body: 'Your fuel order has been confirmed and is being prepared.'
      },
      preparing: {
        title: 'Order Being Prepared 🔧',
        body: 'Your fuel friend is preparing your order.'
      },
      on_the_way: {
        title: 'Fuel Friend On The Way! 🚗',
        body: 'Your fuel friend is heading to your location.'
      },
      delivered: {
        title: 'Order Delivered! ✅',
        body: 'Your fuel has been delivered successfully.'
      },
      cancelled: {
        title: 'Order Cancelled ❌',
        body: 'Your order has been cancelled.'
      }
    };

    const message = messages[status] || {
      title: 'Order Update',
      body: `Your order status has been updated to ${status}`
    };

    return await this.sendToCustomer(customerId, message.title, message.body, {
      type: 'order_update',
      orderId,
      status
    });
  }

  async sendPromotionNotification(customerId, title, body, promoData = {}) {
    return await this.sendToCustomer(customerId, title, body, {
      type: 'promotion',
      ...promoData
    });
  }

  async getCustomerNotifications(customerId, limit = 20) {
    try {
      const customerNotifications = await db.select()
        .from(notifications)
        .where(eq(notifications.customerId, customerId))
        .orderBy(sql`${notifications.createdAt} DESC`)
        .limit(limit);

      return customerNotifications;
    } catch (error) {
      console.error('❌ Failed to get customer notifications:', error);
      return [];
    }
  }

  async markAsRead(notificationId, customerId) {
    try {
      await db.update(notifications)
        .set({ isRead: true })
        .where(and(
          eq(notifications.id, notificationId),
          eq(notifications.customerId, customerId)
        ));

      return { success: true };
    } catch (error) {
      console.error('❌ Failed to mark notification as read:', error);
      throw error;
    }
  }

  async sendTestNotification(customerId) {
    return await this.sendToCustomer(
      customerId,
      'Test Notification 🔔',
      'Push notifications are working perfectly!',
      { type: 'test' }
    );
  }
}

export default new NotificationService();