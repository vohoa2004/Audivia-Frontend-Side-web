// import React, { useCallback, useEffect, useState } from 'react';
// import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity, Linking, Platform, Modal, ScrollView } from 'react-native';
// // import MapView, { Marker, Polyline, PROVIDER_GOOGLE, Region } from 'react-native-maps';
// import { Checkpoint, Tour } from '@/models';
// import * as Location from 'expo-location';
// import { COLORS } from '@/constants/theme';
// import { Ionicons } from '@expo/vector-icons';
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

// interface UserLocationMapProps {
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

// const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
//     const R = 6371; // Radius of the earth in km
//     const dLat = (lat2 - lat1) * Math.PI / 180;
//     const dLon = (lon2 - lon1) * Math.PI / 180;
//     const a =
//         Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//         Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
//         Math.sin(dLon / 2) * Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     return R * c; // Distance in km
// };

// export const TourMap: React.FC<UserLocationMapProps> = ({ tour, height = 300 }) => {
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
//     const [routeCoordinates, setRouteCoordinates] = useState<{ latitude: number, longitude: number }[]>([]);
//     const [routeInfo, setRouteInfo] = useState<RouteInfo>({ distance: '', duration: '' });
//     const [loadingMapData, setLoadingMapData] = useState<boolean>(true);
//     const [loadingUserLocation, setLoadingUserLocation] = useState<boolean>(true);
//     const [isDirectionsModalVisible, setIsDirectionsModalVisible] = useState(false);
//     const [selectedOrigin, setSelectedOrigin] = useState<'user' | string>('user');
//     const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
//     const [closestCheckpoint, setClosestCheckpoint] = useState<Checkpoint | null>(null);

//     const fetchRoute = useCallback(async (checkpoints: Checkpoint[]) => {
//         if (!tour || checkpoints.length < 2) {
//             setRouteCoordinates([]);
//             setRouteInfo({ distance: "N/A", duration: "N/A" });
//             return;
//         }

//         const cacheKey = `ROUTE_CACHE_${tour.id}_MAPBOX`;
//         try {
//             const cachedData = await AsyncStorage.getItem(cacheKey);
//             if (cachedData) {
//                 const parsedData = JSON.parse(cachedData);
//                 setRouteCoordinates(parsedData.routeCoordinates);
//                 setRouteInfo(parsedData.routeInfo);
//                 console.log(`Loaded Mapbox route from cache for tour ${tour.id}`);
//                 setLoadingMapData(false);
//                 return;
//             }

//             const accessToken = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;
//             let allCoordinates = [];
//             let totalDistance = 0;
//             let totalDuration = 0;

//             for (let i = 0; i < checkpoints.length - 1; i++) {
//                 const start = checkpoints[i];
//                 const end = checkpoints[i + 1];
//                 const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?geometries=geojson&access_token=${accessToken}`;

//                 const res = await fetch(url);
//                 const json = await res.json();

//                 if (json.routes && json.routes.length > 0) {
//                     const route = json.routes[0];
//                     const segmentCoords = route.geometry.coordinates.map(([lon, lat]: [number, number]) => ({
//                         latitude: lat,
//                         longitude: lon,
//                     }));

//                     if (i > 0) segmentCoords.shift();

//                     allCoordinates.push(...segmentCoords);
//                     totalDistance += route.distance;
//                     totalDuration += route.duration;
//                 } else {
//                     throw new Error("Mapbox API error: " + (json.message || "No routes found"));
//                 }
//             }

//             const routeInfo = {
//                 distance: (totalDistance / 1000).toFixed(2), // km
//                 duration: Math.round(totalDuration / 60).toString(), // phút
//             };

//             setRouteCoordinates(allCoordinates);
//             setRouteInfo(routeInfo);

//             await AsyncStorage.setItem(cacheKey, JSON.stringify({ routeCoordinates: allCoordinates, routeInfo }));
//             console.log(`Saved Mapbox route to cache for tour ${tour.id}`);
//         } catch (error) {
//             console.error("Error fetching Mapbox route or caching:", error);
//             setRouteCoordinates([]);
//             setRouteInfo({ distance: "N/A", duration: "N/A" });
//         } finally {
//             setLoadingMapData(false);
//         }
//     }, [tour]);


//     useEffect(() => {
//         if (userLocation && tour.checkpoints && tour.checkpoints.length > 0) {
//             let nearestCheckpoint: Checkpoint | null = null;
//             let minDistance = Infinity;

//             tour.checkpoints.forEach(checkpoint => {
//                 const distance = getDistance(
//                     userLocation.coords.latitude,
//                     userLocation.coords.longitude,
//                     checkpoint.latitude,
//                     checkpoint.longitude
//                 );
//                 if (distance < minDistance) {
//                     minDistance = distance;
//                     nearestCheckpoint = checkpoint;
//                 }
//             });
//             setClosestCheckpoint(nearestCheckpoint);
//         }
//     }, [userLocation, tour.checkpoints]);

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

//         const setupMapAndRoute = async () => {
//             setLoadingMapData(true);
//             if (tour.checkpoints?.length > 0) {
//                 const firstCheckpoint = tour.checkpoints[0];
//                 setMapRegion({
//                     latitude: firstCheckpoint.latitude,
//                     longitude: firstCheckpoint.longitude,
//                     latitudeDelta: 0.01,
//                     longitudeDelta: 0.01,
//                 });

//                 if (tour.checkpoints.length > 1) {
//                     await fetchRoute(tour.checkpoints);
//                 } else {
//                     setLoadingMapData(false);
//                 }
//             } else if (userLocation) {
//                 setMapRegion({
//                     latitude: userLocation.coords.latitude,
//                     longitude: userLocation.coords.longitude,
//                     latitudeDelta: 0.01,
//                     longitudeDelta: 0.01,
//                 });
//                 setLoadingMapData(false);
//             } else {
//                 setLoadingMapData(false);
//             }
//         };

//         setupMapAndRoute();
//     }, [tour, userLocation, fetchRoute]);

//     const handleOpenDirectionsModal = () => {
//         if (closestCheckpoint) {
//             setSelectedOrigin('user');
//             setSelectedDestination(closestCheckpoint.id);
//             setIsDirectionsModalVisible(true);
//         }
//     };

//     const handleStartNavigation = () => {
//         if (!selectedDestination || !selectedOrigin || !tour.checkpoints) return;

//         const destinationCheckpoint = tour.checkpoints.find(cp => cp.id === selectedDestination);
//         if (!destinationCheckpoint) return;

//         let originCoords = '';
//         if (selectedOrigin === 'user' && userLocation) {
//             originCoords = `${userLocation.coords.latitude},${userLocation.coords.longitude}`;
//         } else {
//             const originCheckpoint = tour.checkpoints.find(cp => cp.id === selectedOrigin);
//             if (!originCheckpoint) return;
//             originCoords = `${originCheckpoint.latitude},${originCheckpoint.longitude}`;
//         }

//         const destinationCoords = `${destinationCheckpoint.latitude},${destinationCheckpoint.longitude}`;
//         console.log("CHECK: ", originCoords, destinationCoords)
//         const webUrl = `https://www.google.com/maps/dir/?api=1&origin=${originCoords}&destination=${destinationCoords}&travelmode=walking`;
//         console.log(webUrl)
//         // alert(webUrl)
//         Linking.canOpenURL(webUrl)
//             .then(supported => {
//                 if (!supported) {
//                     console.log('Can\'t handle url: ' + webUrl);
//                     // Có thể chuyển hướng sang Google Maps trên web nếu ứng dụng không được cài đặt
//                     Linking.openURL('https://www.google.com/maps/dir/?api=1&origin=LAT,LON&destination=LAT,LON&travelmode=walking');
//                 } else {
//                     return Linking.openURL(webUrl);
//                 }
//             })
//             .catch(err => console.error('An error occurred', err));
//         setIsDirectionsModalVisible(false);
//     };

//     if (loadingMapData || loadingUserLocation) {
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
//                     {tour?.checkpoints?.map((checkpoint, index) => {
//                         const isStart = index === 0;
//                         const isEnd = index === (tour.checkpoints.length - 1);
//                         const markerStyle = isStart ? styles.startMarker : isEnd ? styles.endMarker : styles.regularMarker;
//                         return (
//                             <Marker key={checkpoint.id} coordinate={{ latitude: checkpoint.latitude, longitude: checkpoint.longitude }} title={checkpoint.title} description={checkpoint.description}>
//                                 <View style={[styles.checkpointMarker, markerStyle]}>{!isStart && !isEnd && (<Text style={styles.markerText}>{index + 1}</Text>)}</View>
//                             </Marker>
//                         );
//                     })}
//                     {routeCoordinates.length > 1 && (<Polyline coordinates={routeCoordinates} strokeWidth={4} strokeColor={COLORS.primary} lineDashPattern={[1]} />)}
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
//             {tour?.checkpoints?.length > 0 && userLocation && (
//                 <TouchableOpacity
//                     style={styles.directionsButton}
//                     onPress={handleOpenDirectionsModal}>
//                     <Ionicons name="navigate" size={20} color="#FFF" />
//                     <Text style={styles.directionsButtonText}>Chỉ đường</Text>
//                 </TouchableOpacity>
//             )}
//             <Modal
//                 animationType="slide"
//                 transparent={true}
//                 visible={isDirectionsModalVisible}
//                 onRequestClose={() => setIsDirectionsModalVisible(false)}>
//                 <View style={styles.modalContainer}>
//                     <View style={styles.modalContent}>
//                         <Text style={styles.modalTitle}>Chọn điểm đi và đến</Text>

//                         <Text style={styles.selectorLabel}>Xuất phát từ:</Text>
//                         <ScrollView style={styles.optionsScrollView}>
//                             <TouchableOpacity
//                                 style={[styles.optionButton, selectedOrigin === 'user' && styles.optionButtonSelected]}
//                                 onPress={() => setSelectedOrigin('user')}>
//                                 <Text style={[styles.optionText, selectedOrigin === 'user' && styles.optionTextSelected]}>Vị trí của bạn</Text>
//                             </TouchableOpacity>
//                             {tour.checkpoints.map(cp => (
//                                 <TouchableOpacity
//                                     key={`origin-${cp.id}`}
//                                     style={[styles.optionButton, selectedOrigin === cp.id && styles.optionButtonSelected]}
//                                     onPress={() => setSelectedOrigin(cp.id)}>
//                                     <Text style={[styles.optionText, selectedOrigin === cp.id && styles.optionTextSelected]}>{cp.title}</Text>
//                                 </TouchableOpacity>
//                             ))}
//                         </ScrollView>

//                         <Text style={styles.selectorLabel}>Điểm đến:</Text>
//                         <ScrollView style={styles.optionsScrollView}>
//                             {tour.checkpoints.map(cp => (
//                                 <TouchableOpacity
//                                     key={`dest-${cp.id}`}
//                                     style={[styles.optionButton, selectedDestination === cp.id && styles.optionButtonSelected]}
//                                     onPress={() => setSelectedDestination(cp.id)}>
//                                     <Text style={[styles.optionText, selectedDestination === cp.id && styles.optionTextSelected]}>{cp.title}</Text>
//                                 </TouchableOpacity>
//                             ))}
//                         </ScrollView>

//                         <View style={styles.modalActions}>
//                             <TouchableOpacity style={[styles.modalButton, styles.closeButton]} onPress={() => setIsDirectionsModalVisible(false)}>
//                                 <Text style={styles.modalButtonText}>Đóng</Text>
//                             </TouchableOpacity>
//                             <TouchableOpacity style={[styles.modalButton, styles.startButton]} onPress={handleStartNavigation}>
//                                 <Text style={styles.modalButtonText}>Bắt đầu</Text>
//                             </TouchableOpacity>
//                         </View>
//                     </View>
//                 </View>
//             </Modal>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: { width: '100%', borderRadius: 12, overflow: 'hidden' },
//     map: { ...StyleSheet.absoluteFillObject },
//     userMarker: { width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(0, 122, 255, 0.2)', justifyContent: 'center', alignItems: 'center' },
//     userMarkerDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.primary },
//     checkpointMarker: { alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: 15, borderWidth: 2, borderColor: '#FFF' },
//     regularMarker: { backgroundColor: '#000' },
//     startMarker: { backgroundColor: COLORS.primary, borderColor: '#FFF', width: 34, height: 34, borderRadius: 17, borderWidth: 3 },
//     endMarker: { backgroundColor: 'red', borderColor: '#FFF', width: 34, height: 34, borderRadius: 17, borderWidth: 3 },
//     markerText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
//     directionsButton: { position: 'absolute', bottom: 10, right: 10, backgroundColor: COLORS.primary, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 2 },
//     directionsButtonText: { color: '#FFF', fontWeight: 'bold', marginLeft: 4 },
//     routeInfoContainer: { position: 'absolute', top: 10, left: 10, backgroundColor: 'rgba(0, 0, 0, 0.7)', borderRadius: 12, padding: 8, flexDirection: 'row', justifyContent: 'space-between' },
//     routeInfoItem: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 8 },
//     routeInfoText: { color: '#FFF', marginLeft: 4, fontWeight: '600' },
//     modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
//     modalContent: { width: '90%', backgroundColor: 'white', borderRadius: 20, padding: 20, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
//     modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
//     selectorLabel: { fontSize: 16, fontWeight: '600', alignSelf: 'flex-start', marginTop: 10, marginBottom: 5 },
//     optionsScrollView: { width: '100%', maxHeight: 150, borderWidth: 1, borderColor: '#eee', borderRadius: 10, marginBottom: 10 },
//     optionButton: { paddingVertical: 12, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
//     optionButtonSelected: { backgroundColor: COLORS.primary },
//     optionText: { fontSize: 16, color: '#333' },
//     optionTextSelected: { color: '#FFF', fontWeight: 'bold' },
//     modalActions: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 20 },
//     modalButton: { borderRadius: 10, paddingVertical: 12, paddingHorizontal: 20, flex: 1, marginHorizontal: 5 },
//     startButton: { backgroundColor: COLORS.primary },
//     closeButton: { backgroundColor: '#ccc' },
//     modalButtonText: { color: 'white', fontWeight: 'bold', textAlign: 'center', fontSize: 16 },
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