import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const ConnectionStatus = () => {
  const [connectionState, setConnectionState] = useState<HubConnectionState | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ... existing code ...
  /*
  useEffect(() => {
    // Lấy trạng thái kết nối hiện tại
    setConnectionState(signalRService.getConnectionState());

    // Đăng ký lắng nghe thay đổi trạng thái
    const handleConnectionStateChange = (state: HubConnectionState) => {
      setConnectionState(state);
    };

    // Đăng ký lắng nghe lỗi kết nối
    const handleConnectionError = (errorMessage: string) => {
      setError(errorMessage);
    };

    signalRService.onConnectionStateChange(handleConnectionStateChange);
    signalRService.onConnectionError(handleConnectionError);

    // Cleanup khi component unmount
    return () => {
      signalRService.removeConnectionStateCallback(handleConnectionStateChange);
      signalRService.removeConnectionErrorCallback(handleConnectionError);
    };
  }, []);
  */
  // ... existing code ...
  /*
  const handleRetry = async () => {
    setError(null);
    try {
      await signalRService.checkAndReconnect();
    } catch (error) {
      setError('Không thể kết nối lại. Vui lòng thử lại sau.');
      console.error('Error reconnecting SignalR:', error);
    }
  };
  */
  // ... existing code ...

  if (!connectionState) return null;

  const getStatusColor = () => {
    switch (connectionState) {
      case HubConnectionState.Connected:
        return '#4CAF50'; // Green
      case HubConnectionState.Connecting:
      case HubConnectionState.Reconnecting:
        return '#FFC107'; // Yellow
      case HubConnectionState.Disconnected:
      case HubConnectionState.Disconnecting:
        return '#F44336'; // Red
      default:
        return '#9E9E9E'; // Grey
    }
  };

  const getStatusText = () => {
    switch (connectionState) {
      case HubConnectionState.Connected:
        return 'Đã kết nối';
      case HubConnectionState.Connecting:
        return 'Đang kết nối...';
      case HubConnectionState.Reconnecting:
        return 'Đang kết nối lại...';
      case HubConnectionState.Disconnected:
        return 'Mất kết nối';
      case HubConnectionState.Disconnecting:
        return 'Đang ngắt kết nối...';
      default:
        return 'Không xác định';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: getStatusColor() }]}>
      <Text style={styles.text}>{getStatusText()}</Text>
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={handleRetry} style={styles.retryButton}>
            <Ionicons name="refresh" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 11,
    marginRight: 8,
  },
  retryButton: {
    padding: 4,
  },
}); 