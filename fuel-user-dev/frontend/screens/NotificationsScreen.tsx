import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MoreVertical, Trash2, CheckCircle, XCircle, Mail, User, CreditCard } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import { apiGetNotifications, apiMarkNotificationAsRead } from '../services/api';
import { useAppContext } from '../context/AppContext';
import TapEffectButton from '../components/TapEffectButton';

interface Notification {
  id: string;
  title: string;
  body: string;
  data?: string;
  isRead: boolean;
  sentAt: string;
  createdAt: string;
}

const NotificationsScreen = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppContext();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteMenu, setShowDeleteMenu] = useState<string | null>(null);

  const loadNotifications = async () => {
    try {
      const data = await apiGetNotifications();
      setNotifications(data);
      console.log('Notifications loaded:', data.length);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setLoading(false);
      return;
    }
    loadNotifications();
  }, [isAuthenticated, user]);

  useEffect(() => {
    const handleClickOutside = () => {
      setShowDeleteMenu(null);
    };

    if (showDeleteMenu) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showDeleteMenu]);

  if (!isAuthenticated || !user) {
    return (
      <AnimatedPage>
        <div className="bg-white min-h-screen">
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
            <TapEffectButton onClick={() => navigate("/home")} className="p-2 -ml-2">
              <img src="/Back.png" alt="Back" className="w-5 h-5" />
            </TapEffectButton>
            <h1 className="text-lg font-semibold text-gray-900">Notifications</h1>
            <div className="w-10"></div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Login Required</h3>
              <p className="text-gray-600 mb-8 max-w-sm">
                Please login to view your notifications.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="bg-[#3AC36C] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#2ea85a] transition-colors"
              >
                Login Now
              </button>
            </div>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  const markAsRead = async (notificationId: string) => {
    try {
      await apiMarkNotificationAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    setShowDeleteMenu(null);
  };

  const handleMenuClick = (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation();
    setShowDeleteMenu(showDeleteMenu === notificationId ? null : notificationId);
  };

  const getIcon = (notification: Notification) => {
    const data = notification.data ? JSON.parse(notification.data) : {};
    const type = data.type || 'info';

    switch (type) {
      case 'order_confirmed':
      case 'order_delivered':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'order_cancelled':
        return <XCircle className="w-6 h-6 text-red-500" />;
      case 'payment':
        return <CreditCard className="w-6 h-6 text-orange-500" />;
      case 'account':
        return <User className="w-6 h-6 text-gray-600" />;
      default:
        return <Mail className="w-6 h-6 text-blue-500" />;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const groupNotificationsByTime = (notifications: Notification[]) => {
    const groups: Record<string, Notification[]> = {
      'Today': [],
      'Yesterday': [],
      'Last week': [],
      'Older': []
    };

    notifications.forEach(notification => {
      const date = new Date(notification.sentAt);
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        groups['Today'].push(notification);
      } else if (diffDays === 1) {
        groups['Yesterday'].push(notification);
      } else if (diffDays <= 7) {
        groups['Last week'].push(notification);
      } else {
        groups['Older'].push(notification);
      }
    });

    // Remove empty groups
    Object.keys(groups).forEach(key => {
      if (groups[key].length === 0) {
        delete groups[key];
      }
    });

    return groups;
  };

  if (loading) {
    return (
      <AnimatedPage>
        <div className="bg-white dark:bg-black min-h-screen">
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-800">
            <TapEffectButton onClick={() => navigate("/home")} className="p-2 -ml-2">
              <img src="/Back.png" alt="Back" className="w-5 h-5" />
            </TapEffectButton>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h1>
            <div className="w-10"></div>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500 dark:text-gray-400">Loading notifications...</div>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  const groupedNotifications = groupNotificationsByTime(notifications);

  return (
    <AnimatedPage>
      <div className="bg-white dark:bg-black min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-800">
          <TapEffectButton
            onClick={() => navigate("/home")}
            className="p-2 -ml-2"
          >
            <img src="/Back.png" alt="Back" className="w-5 h-5" />
          </TapEffectButton>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h1>
          <div className="w-10"></div>
        </div>

        {/* Notifications List */}
        <div className="px-4 py-4">
          {Object.keys(groupedNotifications).length === 0 ? (
            <div className="text-center py-12">
              <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No notifications yet</p>
            </div>
          ) : (
            Object.entries(groupedNotifications).map(([section, sectionNotifications]) => (
              <div key={section} className="mb-6">
                <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">{section}</h2>
                <div className="space-y-3">
                  {sectionNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`relative cursor-pointer ${notification.isRead ? 'opacity-70' : ''
                        }`}
                      onClick={() => !notification.isRead && markAsRead(notification.id)}
                    >
                      <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <div className="flex-shrink-0 mt-1">
                          {getIcon(notification)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                              {notification.title}
                            </h3>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {notification.body}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {formatTime(notification.sentAt)}
                          </p>
                        </div>
                        <div className="relative">
                          <button
                            onClick={(e) => handleMenuClick(e, notification.id)}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors"
                          >
                            <MoreVertical className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                          </button>

                          {showDeleteMenu === notification.id && (
                            <div className="absolute right-0 top-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 min-w-48">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                                className="w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-900 text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-3" />
                                Delete this notification
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AnimatedPage>
  );
};

export default NotificationsScreen;