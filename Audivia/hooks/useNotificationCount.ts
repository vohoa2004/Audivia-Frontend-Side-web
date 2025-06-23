// hooks/useNotificationCount.ts
import { useEffect, useState } from "react";
import { useUser } from "./useUser";
import { notificationSignalRService } from "@/services/notificationSignalR";
import { countUnreadNotifications } from "@/services/notification";

export const useNotificationCount = () => {
  const { user } = useUser();
  const [unreadCount, setUnreadCount] = useState(0);

  // Hàm lấy số lượng thông báo từ database
  const loadUnreadCount = async () => {
    if (!user?.id) return;
    try {
      const count = await countUnreadNotifications(user.id);
      console.log('Loaded unread count from API:', count);
      setUnreadCount(count);
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        // Load số lượng thông báo từ database khi vào app
        await loadUnreadCount();
        
        // Đăng ký callback để cập nhật số lượng thông báo khi có thông báo mới
        notificationSignalRService.onUnreadCountChange = (count: number) => {
          console.log('SignalR callback received count:', count);
          // Force update state ngay lập tức
          setUnreadCount(prevCount => {
            console.log('Updating unreadCount from', prevCount, 'to', count);
            return count;
          });
        };
      } catch (error) {
        console.error('Error initializing notification count:', error);
      }
    };

    initialize();

    return () => {
      // Chỉ giảm số lượng listener, không stop connection
      notificationSignalRService.stop();
    };
  }, [user?.id]);

  // Log khi unreadCount thay đổi
  useEffect(() => {
    console.log('unreadCount changed to:', unreadCount);
  }, [unreadCount]);

  return { 
    unreadCount,
    loadUnreadCount
  };
};


















// import { useState, useEffect, useCallback } from 'react';
// import { getNotificationsByUser } from '@/services/notification';
// import { useUser } from './useUser';
// import { AppState } from 'react-native';

// export const useNotificationCount = () => {
//     const [unreadCount, setUnreadCount] = useState(0);
//     const { user } = useUser();

//     const fetchUnreadCount = useCallback(async () => {
//         if (!user?.id) return;
//         try {
//             const notifications = await getNotificationsByUser(user.id);
//             const unread = notifications.filter((n: any) => !n.isRead).length;
//             setUnreadCount(unread);
//         } catch (error) {
//             console.log('Error fetching notification count:', error);
//         }
//     }, [user?.id]);

//     // Function to manually update count
//     const updateCount = useCallback((increment: number = 0) => {
//         setUnreadCount(prev => {
//             const newCount = Math.max(0, prev + increment);
//             console.log('Updating notification count:', { prev, increment, newCount });
//             return newCount;
//         });
//     }, []);

//     // Function to refresh count from server
//     const refreshCount = useCallback(async () => {
//         await fetchUnreadCount();
//     }, [fetchUnreadCount]);

//     useEffect(() => {
//         // Fetch initial count
//         fetchUnreadCount();

//         // Listen for app state changes
//         const subscription = AppState.addEventListener('change', (nextAppState) => {
//             if (nextAppState === 'active') {
//                 fetchUnreadCount();
//             }
//         });

//         return () => {
//             subscription.remove();
//         };
//     }, [fetchUnreadCount]);

//     return { 
//         unreadCount, 
//         refreshCount,
//         updateCount 
//     };
// }; 