import { Video, ResizeMode } from "expo-av";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useState, useRef, useEffect } from "react";
import { COLORS } from "@/constants/theme";

interface AudioImageProps {
  videoUrl: string;
  imageUrl?: string;
  isPlaying: boolean;
}

export default function AudioVideo({ videoUrl, imageUrl, isPlaying }: AudioImageProps) {
  const [isBuffering, setIsBuffering] = useState(true);
  const [bufferingTimedOut, setBufferingTimedOut] = useState(false);
  const videoRef = useRef<Video>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.playAsync();
      } else {
        videoRef.current.pauseAsync();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    // Reset states for new video
    setIsBuffering(true);
    setBufferingTimedOut(false);

    // Set a timeout to hide the buffering indicator
    const timer = setTimeout(() => {
      setBufferingTimedOut(true);
    }, 5000); // 5-second timeout

    return () => clearTimeout(timer);
  }, [videoUrl]);

  return (
    <View style={styles.audioImageContainer}>
      <Video
        ref={videoRef}
        source={{ uri: videoUrl }}
        posterSource={imageUrl ? { uri: imageUrl } : undefined}
        usePoster={!!imageUrl}
        style={styles.audioImage}
        resizeMode={ResizeMode.COVER}
        isLooping
        isMuted
        onPlaybackStatusUpdate={(status) => {
          if (status.isLoaded) {
            setIsBuffering(status.isBuffering);
          } else {
            setIsBuffering(true);
          }
        }}
      />
      {isBuffering && !bufferingTimedOut && (
        <View style={styles.bufferingOverlay}>
          <ActivityIndicator size="large" color={COLORS.white} />
        </View>
      )}
      <LinearGradient
        colors={["rgba(0,0,0,0.7)", "transparent", "rgba(0,0,0,0.7)"]}
        style={styles.imageGradient}
        pointerEvents="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  audioImageContainer: {
    position: "relative",
    width: "100%",
    height: 250,
    overflow: "hidden",
    backgroundColor: '#000',
  },
  audioImage: {
    ...StyleSheet.absoluteFillObject,
  },
  imageGradient: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  bufferingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  }
});
