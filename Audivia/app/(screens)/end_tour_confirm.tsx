import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { router, useLocalSearchParams } from 'expo-router';
import { useLocationTracking } from '@/hooks/useLocationTracking';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const EndTourScreen = () => {
  const { tourId } = useLocalSearchParams()
  const { stopTracking } = useLocationTracking();
  
  const onFinish = async () => {
    console.log("Tour ended. Stopping location tracking...");
    await stopTracking();
    console.log("Location tracking stopped.");
    router.push(`/(screens)/finish_tour?tourId=${tourId}`);
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <Ionicons name="checkmark" size={40} color="#fff" />
        </View>
        
        <Text style={styles.endTourText}>Kết thúc tour</Text>
        
        <View style={styles.contentContainer}>
          <Text style={styles.congratsText}>Chúc mừng!</Text>
          <Text style={styles.messageText}>
            Bạn vừa hoàn thành chuyến tham quan 
          </Text>
        </View>

        <TouchableOpacity  onPress={onFinish}>
          <LinearGradient
              colors={[COLORS.primary, COLORS.purpleGradient]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
              >
                <Text style={[styles.buttonText, { backgroundColor: 'transparent' }]}>Tiếp tục</Text>
            </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 24,
    width: width - 40,
    alignItems: 'center',
    paddingVertical: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#00A9CE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#00A9CE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  endTourText: {
    color: '#00A9CE',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
    letterSpacing: 1,
  },
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  congratsText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  messageText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EndTourScreen;