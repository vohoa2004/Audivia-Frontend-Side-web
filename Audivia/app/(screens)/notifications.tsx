// import { View, Text, StyleSheet, FlatList, TouchableOpacity, Button } from "react-native";
// import React, { useEffect, useState } from "react";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { getNotificationsByUser, updateStatusNotification, deleteNotification } from "@/services/notification";
// import { useUser } from "@/hooks/useUser";
// import { router } from "expo-router";
// import { useNotificationCount } from "@/hooks/useNotificationCount";
// import { useNavigation } from '@react-navigation/native';
// import { navigate } from "expo-router/build/global-state/routing";
// import { Ionicons } from "@expo/vector-icons";
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import Swipeable from 'react-native-gesture-handler/Swipeable';
// import { notificationSignalRService } from "@/services/notificationSignalR";
// import Animated, { FadeOut } from 'react-native-reanimated';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// interface Notification {
//     id: string
//     content: string
//     type: string
//     isRead: boolean
//     createdAt: Date
//     tourId: string
//     timeAgo: string
//     userId: string
// }

// interface NotificationItemProps extends Notification {
//     onPress: () => void;
//     onDelete: (notificationId: string) => void;
// }

// const NotificationItem: React.FC<NotificationItemProps> = ({ id, content, type, isRead, createdAt, tourId, timeAgo, onPress, onDelete }) => {
//     const renderRightActions = () => {
//         return (
//             <TouchableOpacity
//                 style={styles.deleteButton}
//                 onPress={() => onDelete(id)}
//             >
//                 <Ionicons name="trash-outline" size={24} color="white" />
//             </TouchableOpacity>
//         );
//     };

//     return (
//         <Swipeable
//             renderRightActions={renderRightActions}
//             rightThreshold={40}
//         >
//             <TouchableOpacity onPress={onPress}>
//                 <View style={[styles.item, !isRead && styles.unreadItem]}>
//                     <Text style={[styles.title, !isRead && styles.unreadText]}>{type}</Text>
//                     <Text style={[styles.message, !isRead && styles.unreadText]}>{content}</Text>
//                     <Text style={styles.timeAgo}>{timeAgo}</Text>
//                 </View>
//             </TouchableOpacity>
//         </Swipeable>
//     );
// };

// export default function Notifications() {
//     const [notifications, setNotifications] = useState<Notification[]>([])
//     const [isLoading, setIsLoading] = useState(true)
//     const { user } = useUser()
//     const { unreadCount, loadUnreadCount } = useNotificationCount()
//     const navigation = useNavigation();
//     const onGoBack = () => {
//         navigation.goBack();
//       };
//     useEffect(() => {
//         if (user?.id) {
//             fetchNotificationsByUser(user.id)
//         }
//     }, [user?.id])

//     // Tách riêng useEffect cho việc đăng ký SignalR event
//     useEffect(() => {
//         // Đăng ký event handler
//         notificationSignalRService.onDeleteNotification(handleDeleteFromSignalR)

//         // Cleanup function để hủy đăng ký khi component unmount
//         return () => {
//             notificationSignalRService.removeDeleteNotificationCallback(handleDeleteFromSignalR)
//         }
//     }, []) // Empty dependency array vì handleDeleteFromSignalR là stable function

//     const fetchNotificationsByUser = async (userId: string) => {
//         try {
//             setIsLoading(true)
//             const response = await getNotificationsByUser(userId)
//             setNotifications(response || [])
//         } catch (error) {
//             console.log("Error while fetching notifications ", error)
//         } finally {
//             setIsLoading(false)
//         }
//     }
//     const handleDeleteByUser = async (notificationId: string) => {
//         try {
//             await deleteNotification(notificationId); // gọi server để xóa
//             setNotifications(prev => prev.filter(n => n.id !== notificationId));
//         } catch (error) {
//             console.log("Error deleting notification:", error)
//         }
//     }
//     const handleDeleteFromSignalR = (notificationId: string) => {
//         console.log("realtime delete: ", notificationId);
        
//         removeNotificationFromState(notificationId); // chỉ cập nhật UI
//     }
//     const removeNotificationFromState = async (notificationId: string) => {
//         setNotifications(prev => prev.filter(n => n.id !== notificationId));
//         await loadUnreadCount();
//     }
//     const navigateToProfile = (userId: string) => {
//         router.push({
//           pathname: "/profile",
//           params: { userId },
//         });
//       };
//     const handleNotificationPress = async (item: Notification) => {
//         if (!item.isRead) {
//             setNotifications(prevNotifications => 
//                 prevNotifications.map(notification => 
//                     notification.id === item.id 
//                         ? { ...notification, isRead: true }
//                         : notification
//                 )
//             );

//             if (item.tourId) {
//                 router.push(`/detail_tour?tourId=${item.tourId}`)
//             } else {
//                 router.push('/history_transaction')
//             }

//             try {
//                 await updateStatusNotification({ 
//                     notificationId: item.id, 
//                     userId: user?.id as string, 
//                     isRead: true 
//                 });
                
//            //     await loadUnreadCount();
//             } catch (error) {
//                 console.log("Error updating notification status:", error);
//                 setNotifications(prevNotifications => 
//                     prevNotifications.map(notification => 
//                         notification.id === item.id 
//                             ? { ...notification, isRead: false }
//                             : notification
//                     )
//                 );
//               //  await loadUnreadCount();
//             }
//         } else {
//             if (item.type == "Bài viết"){
//                 navigateToProfile(item.userId as string)
//             }
//             else if (item.tourId) {
//                 router.push(`/detail_tour?tourId=${item.tourId}`)
//             } else {
//                 router.push('/history_transaction')
//             }
//         }


//     };

//     const renderItem = ({ item }: { item: Notification }) => (
//         <NotificationItem 
//             {...item} 
//             onPress={() => handleNotificationPress(item)}
//             onDelete={handleDeleteByUser}
//         />
//     );

//     return (
//         <GestureHandlerRootView style={{ flex: 1 }}>
//             <SafeAreaView style={styles.container}>
//                 <View style={styles.headerContainer}>
//                     <TouchableOpacity onPress={onGoBack}>
//                         <Ionicons name="arrow-back" size={24} color="#000" />
//                     </TouchableOpacity>
//                     <Text style={styles.header}>Thông báo</Text>
//                 </View>

//                 {isLoading ? (
//                     <View style={styles.centerContent}>
//                         <Text>Loading...</Text>
//                     </View>
//                 ) : notifications.length === 0 ? (
//                     <View style={styles.centerContent}>
//                         <Text style={styles.emptyText}>No notifications yet</Text>
//                     </View>
//                 ) : (
//                     <FlatList
//                         data={notifications}
//                         keyExtractor={(item) => item.id}
//                         renderItem={renderItem}
//                     />
//                 )}
//             </SafeAreaView>
//         </GestureHandlerRootView>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: '#f6f8fa',
//       paddingHorizontal: 16,
//     },
//     headerContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'flex-start', // or 'space-between' if you want spacing
//     //    paddingHorizontal: 16,
//      //   paddingTop: 20,
//       //  paddingBottom: 10,


//       },
//     header: {
//         fontSize: 22,
//         fontWeight: "700",
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//         paddingHorizontal: 16,
//         paddingTop: 20,
//         paddingBottom: 10,
//         borderBottomWidth: 1,
//         borderBottomColor: "#f0f0f0",
//         marginBottom: 20
//     },
//     item: {
//       backgroundColor: '#fff',
//       padding: 16,
//       marginBottom: 12,
//       borderRadius: 10,
//       shadowColor: '#000',
//       shadowOpacity: 0.05,
//       shadowRadius: 5,
//       elevation: 2,
//     },
//     title: {
//       fontSize: 16,
//       fontWeight: '600',
//     },
//     message: {
//       fontSize: 14,
//       color: '#555',
//       marginTop: 4,
//     },
//     unreadItem: {
//       backgroundColor: '#f0f7ff',
//       borderLeftWidth: 3,
//       borderLeftColor: '#007AFF',
//     },
//     unreadText: {
//       fontWeight: '700',
//     },
//     timeAgo: {
//       fontSize: 12,
//       color: '#888',
//       marginTop: 8,
//       fontStyle: 'italic',
//     },
//     centerContent: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     emptyText: {
//         fontSize: 16,
//         color: '#666',
//     },
//     deleteButton: {
//         backgroundColor: '#ff3b30',
//         justifyContent: 'center',
//         alignItems: 'center',
//         width: 80,
//         height: '100%',
//     },
//   });