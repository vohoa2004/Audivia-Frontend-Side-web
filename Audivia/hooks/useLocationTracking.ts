// import { useState, useEffect } from 'react';
// import { startLocationTracking, stopLocationTracking } from '../services/locationNotification';

// export const useLocationTracking = () => {
//   const [isTracking, setIsTracking] = useState(false);

//   const startTracking = async (checkpoints: any, tourId: any) => {
//     await startLocationTracking(checkpoints, tourId);
//     setIsTracking(true);
//   };

//   const stopTracking = async () => {
//     await stopLocationTracking();
//     setIsTracking(false);
//   };

//   // Optional: Automatically stop tracking when the component unmounts
//   useEffect(() => {
//     return () => {
//       if (isTracking) {
//         stopLocationTracking();
//       }
//     };
//   }, [isTracking]);

//   return { isTracking, startTracking, stopTracking };
// }; 