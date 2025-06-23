// import * as TaskManager from 'expo-task-manager';
// import * as Location from 'expo-location';
// import * as Notifications from 'expo-notifications';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { getDistance } from 'geolib';
// import { Platform } from 'react-native';

// const LOCATION_TASK_NAME = 'background-location-task';
// const CHECKPOINTS_STORAGE_KEY = 'audivia-checkpoints-storage';
// const NOTIFICATION_TIMESTAMPS_KEY = 'audivia-notification-timestamps';
// const NOTIFICATION_DISTANCE_THRESHOLD = 20;
// const NOTIFICATION_COOLDOWN_MS = 10 * 60 * 1000; // 10 minutes
// const CHECKPOINT_NOTIFICATION_CATEGORY_ID = 'checkpoint-arrival';
// export const STOP_TOUR_ACTION_ID = 'stop-tour-action';

// // This function needs to be called once when the app initializes.
// export const setupNotificationActions = () => {
//   // Create a custom notification channel for Android with vibration
//   if (Platform.OS === 'android') {
//     Notifications.setNotificationChannelAsync('checkpoint-alerts', {
//       name: 'Checkpoint Alerts',
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 1000, 500, 1000, 500, 1000, 500, 1000],
//       sound: 'default',
//     });
//   }

//   Notifications.setNotificationCategoryAsync(CHECKPOINT_NOTIFICATION_CATEGORY_ID, [
//     {
//       identifier: STOP_TOUR_ACTION_ID,
//       buttonTitle: 'Dừng Tour',
//       options: {
//         isDestructive: true,
//         opensAppToForeground: false,
//       },
//     },
//   ]);
// };

// // Configure notification handler for when the app is in the foreground
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: false,
//   }),
// });

// // Define the background task
// TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
//   if (error) {
//     console.error('Background location task error:', error);
//     return;
//   }
//   if (data) {
//     try {
//       const { locations } = data as { locations: Location.LocationObject[] };
//       const currentLocation = locations[0];

//       // --- Location Validation ---
//       const locationAge = Date.now() - currentLocation.timestamp;
//       if (locationAge > 10000) { // 10 seconds tolerance for staleness
//         console.log(`Ignoring stale location update (age: ${Math.round(locationAge / 1000)}s)`);
//         return;
//       }
//       if (currentLocation.coords.accuracy == null || currentLocation.coords.accuracy > 50) {
//         console.log(`Ignoring inaccurate location update (accuracy: ${currentLocation.coords.accuracy?.toFixed(1) ?? 'unknown'}m)`);
//         return;
//       }
//       // --- End Validation ---

//       const storedData = await AsyncStorage.getItem(CHECKPOINTS_STORAGE_KEY);
//       const timestampsData = await AsyncStorage.getItem(NOTIFICATION_TIMESTAMPS_KEY);
//       const notificationTimestamps = timestampsData ? JSON.parse(timestampsData) : {};

//       if (!storedData) {
//         return; // No data to process
//       }

//       const { checkpoints, tourId } = JSON.parse(storedData);
//       if (!currentLocation || !checkpoints || checkpoints.length === 0 || !tourId) return;

//       // --- New Logic: Find the single nearest checkpoint first ---
//       let nearestCheckpoint = null;
//       let minDistance = Infinity;

//       for (const checkpoint of checkpoints) {
//         const distance = getDistance(
//           { latitude: currentLocation.coords.latitude, longitude: currentLocation.coords.longitude },
//           { latitude: checkpoint.latitude, longitude: checkpoint.longitude }
//         );

//         if (distance < minDistance) {
//           minDistance = distance;
//           nearestCheckpoint = checkpoint;
//         }
//       }

//       // --- Now, check if we should notify for the nearest one ---
//       if (nearestCheckpoint && minDistance <= NOTIFICATION_DISTANCE_THRESHOLD) {
//         const lastNotified = notificationTimestamps[nearestCheckpoint.id] || 0;
//         const hasCooledDown = (Date.now() - lastNotified) > NOTIFICATION_COOLDOWN_MS;

//         if (hasCooledDown) {
//           console.log(`User is near the closest checkpoint "${nearestCheckpoint.title}" (${minDistance.toFixed(1)}m) and cooldown has passed. Notifying.`);

//           await Notifications.scheduleNotificationAsync({
//             content: {
//               title: "Bạn đã tới một điểm đến!",
//               body: `Bạn đang ở rất gần ${nearestCheckpoint.title}. Mở ứng dụng để nghe audio cùng Audi nhé.`,
//               sound: Platform.OS === 'ios' ? 'notification_sound.wav' : undefined,
//               data: { tourId: tourId, checkpointId: nearestCheckpoint.id },
//               categoryIdentifier: CHECKPOINT_NOTIFICATION_CATEGORY_ID,
//               vibrate: Platform.OS === 'android' ? [0, 1000, 500, 1000, 500, 1000, 500, 1000] : undefined,
//             },
//             trigger: Platform.OS === 'android' ? { channelId: 'checkpoint-alerts' } : null,
//           });

//           // Update the timestamp for this checkpoint and save it
//           notificationTimestamps[nearestCheckpoint.id] = Date.now();
//           await AsyncStorage.setItem(NOTIFICATION_TIMESTAMPS_KEY, JSON.stringify(notificationTimestamps));
//         } else {
//           console.log(`User is near "${nearestCheckpoint.title}", but it's on cooldown. Skipping.`);
//         }
//       }

//     } catch (taskError) {
//       console.error('Error inside background task:', taskError);
//     }
//   }
// });

// export const startLocationTracking = async (tripCheckpoints: any[], tourId: string) => {
//   const isTracking = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
//   if (isTracking) {
//     console.log("A previous location tracking task was running. Stopping it before starting a new one.");
//     await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
//   }

//   console.log("Requesting permissions...");
//   const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
//   if (foregroundStatus !== 'granted') {
//     alert('Foreground location permission is required.');
//     return;
//   }

//   const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
//   if (backgroundStatus !== 'granted') {
//     alert('Background location permission must be set to "Allow all the time" for checkpoint alerts.');
//     return;
//   }

//   const dataToStore = {
//     checkpoints: tripCheckpoints,
//     tourId: tourId,
//   };
//   await AsyncStorage.setItem(CHECKPOINTS_STORAGE_KEY, JSON.stringify(dataToStore));

//   console.log("Starting background location updates with high-frequency settings...");
//   await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
//     // Highest possible accuracy for GPS. This is battery-intensive.
//     accuracy: Location.Accuracy.BestForNavigation,

//     // Request updates every 1 second. This is the key for real-time feel.
//     timeInterval: 1000,

//     // Notify for any movement, relying on timeInterval for frequency.
//     distanceInterval: 0,

//     // --- Enhancements for Real-Time Tracking ---
//     activityType: Location.ActivityType.Fitness, // Helps iOS prioritize updates for walking.
//     pausesUpdatesAutomatically: false, // Prevents iOS from pausing updates to save power.
//     // -----------------------------------------

//     showsBackgroundLocationIndicator: true,
//     foregroundService: {
//       notificationTitle: "Audivia đang dẫn tour!",
//       notificationBody: "Theo dõi vị trí của bạn để thông báo khi tới các điểm dừng. Audivia sẽ tự động ngưng theo dõi vị trí khi bạn chọn Kết thúc Tour",
//     }
//   });
//   console.log('High-accuracy location tracking started.');
// };

// export const stopLocationTracking = async () => {
//   const isTracking = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
//   if (isTracking) {
//     await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
//     console.log("Stopped location updates.");
//   }
//   await AsyncStorage.removeItem(CHECKPOINTS_STORAGE_KEY);
//   await AsyncStorage.removeItem(NOTIFICATION_TIMESTAMPS_KEY);
//   console.log('Location tracking stopped and checkpoints cleared.');
// };