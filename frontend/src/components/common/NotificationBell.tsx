import { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { socketService } from '../../services/socketService';
import { getUserNotifications, markNotificationAsRead, getUnreadNotificationCount, markAllNotificationsAsRead, Notification } from '../../services/api/notification';

interface NotificationBellProps {
  isLoggedIn: boolean;
}

export default function NotificationBell({ isLoggedIn }: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadNotifications = async () => {
    if (!isLoggedIn) return;
    
    try {
      setLoading(true);
      const [notificationsData, count] = await Promise.all([
        getUserNotifications(20),
        getUnreadNotificationCount()
      ]);
      setNotifications(notificationsData);
      setUnreadCount(count);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      const token = localStorage.getItem('token');
      if (token) {
        socketService.connect(token)
          .then(() => {
            console.log('Socket connected for notifications');
          })
          .catch((error) => {
            console.error('Failed to connect socket:', error);
          });

        socketService.onNewNotification((newNotification) => {
          console.log('New notification received:', newNotification);
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
        });

        loadNotifications();
      }
    } else {
      socketService.disconnect();
      setNotifications([]);
      setUnreadCount(0);
    }

    return () => {
      socketService.offNewNotification();
    };
  }, [isLoggedIn]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.is_read) {
      try {
        await markNotificationAsRead(notification._id);
        setNotifications(prev => 
          prev.map(n => 
            n._id === notification._id ? { ...n, is_read: true } : n
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return;
    
    try {
      await markAllNotificationsAsRead();
      setNotifications(prev => 
        prev.map(n => ({ ...n, is_read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  if (!isLoggedIn) return null;

  return (
    <div className="relative">
      <button
        className="relative p-2 rounded-full hover:bg-pink-100 transition"
        onClick={() => setOpen((o) => !o)}
        aria-label="Thông báo"
      >
        <Bell className="w-6 h-6 text-pink-400" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-80 max-h-96 bg-white shadow-xl rounded-xl border border-pink-100 z-50 overflow-hidden"
        >
          <div className="p-4 border-b bg-pink-50">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-800">
                Thông báo {unreadCount > 0 && `(${unreadCount} mới)`}
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-xs bg-pink-500 text-white px-2 py-1 rounded hover:bg-pink-600 transition"
                >
                  Đánh dấu tất cả đã đọc
                </button>
              )}
            </div>
          </div>
          <div className="max-h-72 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-pink-500 border-t-transparent"></div>
                <p className="text-gray-500 mt-2">Đang tải...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-gray-500 text-center">Không có thông báo nào.</div>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification._id} 
                  className={`p-4 border-b last:border-b-0 hover:bg-pink-50 transition cursor-pointer ${
                    !notification.is_read ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      notification.is_read ? 'bg-gray-300' : 'bg-blue-500'
                    }`}></div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-700">{notification.content}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(notification.created_at).toLocaleString('vi-VN')}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}