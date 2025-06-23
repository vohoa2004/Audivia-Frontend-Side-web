// import React, { useCallback, useEffect, useState } from 'react';
// import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity, Linking, Platform } from 'react-native';
// // import MapView, { Marker, Polyline, PROVIDER_GOOGLE, Region } from 'react-native-maps';
// import { Tour } from '@/models';
// import * as Location from 'expo-location';
// import { COLORS } from '@/constants/theme';
// import { Ionicons } from '@expo/vector-icons';
// import { router } from 'expo-router';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// let MapView: any, Marker: any, Polyline: any, PROVIDER_GOOGLE: any, Region: any;
// if (Platform.OS !== 'web') {
//     try {
//         const MapModule = require('react-native-maps');
//         MapView = MapModule.default;
//         Marker = MapModule.Marker;
//         Polyline = MapModule.Polyline;
//         PROVIDER_GOOGLE = MapModule.PROVIDER_GOOGLE;
//         Region = MapModule.Region;
//     } catch (error) {
//         console.warn('react-native-maps not available:', error);
//     }
// }

// interface TourCustomMapProps {
//     tour: Tour;
//     height?: number;
// }

// interface RouteInfo {
//     distance: string;
//     duration: string;
// }

// interface MapRegion {
//     latitude: number;
//     longitude: number;
//     latitudeDelta: number;
//     longitudeDelta: number;
// }

// export const TourCustomMap: React.FC<TourCustomMapProps> = ({ tour, height = 300 }) => {
//     if (Platform.OS === 'web') {
//         return (
//             <View style={[styles.container, { height }]}>
//                 <View style={styles.webFallback}>
//                     <Ionicons name="map-outline" size={48} color={COLORS.primary} />
//                     <Text style={styles.webFallbackText}>Bản đồ chỉ khả dụng trên thiết bị di động</Text>
//                     <Text style={styles.webFallbackSubtext}>Vui lòng sử dụng ứng dụng di động để xem bản đồ tour</Text>
//                 </View>
//             </View>
//         );
//     }
//     const [mapRegion, setMapRegion] = useState<MapRegion | null>(null);
//     const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
//     const [loadingUserLocation, setLoadingUserLocation] = useState<boolean>(true);
//     const [loadingMapData, setLoadingMapData] = useState<boolean>(true);
//     const [routeCoordinates, setRouteCoordinates] = useState<{ latitude: number, longitude: number }[]>([]);
//     const [routeInfo, setRouteInfo] = useState<RouteInfo>({ distance: '', duration: '' });

//     const fetchRoute = useCallback(async (start: Location.LocationObject, end: { latitude: number, longitude: number }) => {
//         const cacheKey = `ROUTE_CACHE_CUSTOM_${tour.id}`;
//         try {
//             const cachedData = await AsyncStorage.getItem(cacheKey);
//             if (cachedData) {
//                 const parsedData = JSON.parse(cachedData);
//                 setRouteCoordinates(parsedData.routeCoordinates);
//                 setRouteInfo(parsedData.routeInfo);
//                 return;
//             }

//             const accessToken = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;
//             const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${start.coords.longitude},${start.coords.latitude};${end.longitude},${end.latitude}?geometries=geojson&access_token=${accessToken}`;

//             const res = await fetch(url);
//             const json = await res.json();

//             if (json.routes && json.routes.length > 0) {
//                 const route = json.routes[0];
//                 const coords = route.geometry.coordinates.map(([lon, lat]: [number, number]) => ({
//                     latitude: lat,
//                     longitude: lon,
//                 }));

//                 const newRouteInfo = {
//                     distance: (route.distance / 1000).toFixed(2), // km
//                     duration: Math.round(route.duration / 60).toString(), // phút
//                 };

//                 setRouteCoordinates(coords);
//                 setRouteInfo(newRouteInfo);
//                 await AsyncStorage.setItem(cacheKey, JSON.stringify({ routeCoordinates: coords, routeInfo: newRouteInfo }));
//             } else {
//                 throw new Error("Mapbox API error: " + (json.message || "No routes found"));
//             }
//         } catch (error) {
//             console.error("Error fetching Mapbox route for custom map:", error);
//             // Draw straight line as a fallback
//             setRouteCoordinates([
//                 { latitude: start.coords.latitude, longitude: start.coords.longitude },
//                 { latitude: end.latitude, longitude: end.longitude }
//             ]);
//             setRouteInfo({ distance: "N/A", duration: "N/A" });
//         } finally {
//             setLoadingMapData(false);
//         }
//     }, [tour.id]);

//     useEffect(() => {
//         let locationSubscription: Location.LocationSubscription | null = null;

//         const watchUserLocation = async () => {
//             setLoadingUserLocation(true);
//             try {
//                 const { status } = await Location.requestForegroundPermissionsAsync();
//                 if (status !== 'granted') {
//                     console.error('Location permission not granted');
//                     setLoadingUserLocation(false);
//                     return;
//                 }

//                 locationSubscription = await Location.watchPositionAsync(
//                     {
//                         accuracy: Location.Accuracy.BestForNavigation,
//                         timeInterval: 1000,
//                         distanceInterval: 5,
//                     },
//                     (location) => {
//                         setUserLocation(location);
//                         setLoadingUserLocation(false);
//                     }
//                 );
//             } catch (error) {
//                 console.error('Error watching user location:', error);
//                 setLoadingUserLocation(false);
//             }
//         };

//         watchUserLocation();

//         return () => {
//             locationSubscription?.remove();
//         };
//     }, []);

//     useEffect(() => {
//         if (!tour) {
//             setLoadingMapData(false);
//             return;
//         }

//         if (tour.startLatitude && tour.startLongitude) {
//             setMapRegion({
//                 latitude: tour.startLatitude,
//                 longitude: tour.startLongitude,
//                 latitudeDelta: 0.02, // Zoom out a bit to see both points
//                 longitudeDelta: 0.02,
//             });

//             if (userLocation) {
//                 setLoadingMapData(true);
//                 fetchRoute(userLocation, { latitude: tour.startLatitude, longitude: tour.startLongitude });
//             } else {
//                 setLoadingMapData(false);
//             }
//         } else {
//             setLoadingMapData(false);
//         }
//     }, [tour, userLocation, fetchRoute]);

//     const handleOpenDirections = () => {
//         if (tour.startLatitude && tour.startLongitude && userLocation) {
//             const webUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.coords.latitude},${userLocation.coords.longitude}&destination=${tour.startLatitude},${tour.startLongitude}&travelmode=walking`;
//             Linking.canOpenURL(webUrl)
//                 .then(supported => {
//                     if (!supported) {
//                         console.log('Can\'t handle url: ' + webUrl);
//                     } else {
//                         return Linking.openURL(webUrl);
//                     }
//                 })
//                 .catch(err => console.error('An error occurred', err));
//         }
//     };

//     const handleViewCustomMap = () => {
//         router.push({
//             pathname: "/(screens)/tour_custom_map_details",
//             params: { tourId: tour.id }
//         });
//     };

//     if (loadingUserLocation || loadingMapData) {
//         return <ActivityIndicator size="large" color={COLORS.primary} style={{ height }} />;
//     }

//     return (
//         <View style={[styles.container, { height }]}>
//             {mapRegion && (
//                 <MapView provider={PROVIDER_GOOGLE} style={styles.map} region={mapRegion} showsUserLocation={false}>
//                     {userLocation && (
//                         <Marker coordinate={{ latitude: userLocation.coords.latitude, longitude: userLocation.coords.longitude }} title="Vị trí của bạn">
//                             <View style={styles.userMarker}><View style={styles.userMarkerDot} /></View>
//                         </Marker>
//                     )}
//                     {tour.startLatitude && tour.startLongitude && (
//                         <Marker coordinate={{ latitude: tour.startLatitude, longitude: tour.startLongitude }} title="Điểm bắt đầu tour">
//                             <View style={[styles.checkpointMarker, styles.startMarker]} />
//                         </Marker>
//                     )}
//                     {routeCoordinates.length > 1 && (
//                         <Polyline coordinates={routeCoordinates} strokeWidth={4} strokeColor={COLORS.primary} lineDashPattern={[1]} />
//                     )}
//                 </MapView>
//             )}
//             {routeInfo.distance && routeInfo.duration && (
//                 <View style={styles.routeInfoContainer}>
//                     <View style={styles.routeInfoItem}>
//                         <Ionicons name="walk-outline" size={16} color="#FFF" />
//                         <Text style={styles.routeInfoText}>{routeInfo.distance !== "N/A" ? `${routeInfo.distance} km` : "N/A"}</Text>
//                     </View>
//                     <View style={styles.routeInfoItem}>
//                         <Ionicons name="time-outline" size={16} color="#FFF" />
//                         <Text style={styles.routeInfoText}>{routeInfo.duration !== "N/A" ? `${routeInfo.duration} phút` : "N/A"}</Text>
//                     </View>
//                 </View>
//             )}
//             {userLocation && (
//                 <TouchableOpacity
//                     style={styles.directionsButton}
//                     onPress={handleOpenDirections}>
//                     <Ionicons name="navigate" size={20} color="#FFF" />
//                     <Text style={styles.directionsButtonText}>Chỉ đường</Text>
//                 </TouchableOpacity>
//             )}
//             {tour.customMapImages && tour.customMapImages.length > 0 && (
//                 <TouchableOpacity
//                     style={styles.customMapButton}
//                     onPress={handleViewCustomMap}>
//                     <Text style={styles.customMapButtonText}>Chi tiết sơ đồ tham quan</Text>
//                 </TouchableOpacity>
//             )}
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: { width: '100%', borderRadius: 12, overflow: 'hidden' },
//     map: { ...StyleSheet.absoluteFillObject },
//     userMarker: { width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(0, 122, 255, 0.2)', justifyContent: 'center', alignItems: 'center' },
//     userMarkerDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.primary },
//     checkpointMarker: { alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: 15, borderWidth: 2, borderColor: '#FFF' },
//     startMarker: { backgroundColor: COLORS.primary, borderColor: '#FFF', width: 34, height: 34, borderRadius: 17, borderWidth: 3 },
//     routeInfoContainer: { position: 'absolute', top: 10, left: 10, backgroundColor: 'rgba(0, 0, 0, 0.7)', borderRadius: 12, padding: 8, flexDirection: 'row', justifyContent: 'space-between' },
//     routeInfoItem: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 8 },
//     routeInfoText: { color: '#FFF', marginLeft: 4, fontWeight: '600' },
//     directionsButton: { position: 'absolute', bottom: 80, right: 10, backgroundColor: COLORS.primary, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 2 },
//     directionsButtonText: { color: '#FFF', fontWeight: 'bold', marginLeft: 4 },
//     customMapButton: {
//         position: 'absolute',
//         bottom: 10,
//         left: 16,
//         right: 16,
//         backgroundColor: COLORS.primary,
//         paddingVertical: 16,
//         paddingHorizontal: 20,
//         borderRadius: 12,
//         alignItems: 'center',
//         elevation: 3,
//     },
//     customMapButtonText: {
//         color: '#FFF',
//         fontSize: 18,
//         fontWeight: 'bold',
//     },
//     webFallback: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: 20,
//         backgroundColor: '#f8f9fa',
//     },
//     webFallbackText: {
//         fontSize: 16,
//         fontWeight: '600',
//         color: '#333',
//         textAlign: 'center',
//         marginTop: 16,
//         marginBottom: 8,
//     },
//     webFallbackSubtext: {
//         fontSize: 14,
//         color: '#666',
//         textAlign: 'center',
//         lineHeight: 20,
//     },
// }); 