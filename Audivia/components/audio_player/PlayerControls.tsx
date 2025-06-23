import { View, TouchableOpacity, ActivityIndicator } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import styles from "@/styles/audio_player"
import { COLORS } from "@/constants/theme"

interface PlayerControlsProps {
  isPlaying: boolean
  isBuffering?: boolean
  onPlayPause: () => void
  onPrevious: () => void
  onNext: () => void
}

export default function PlayerControls({
  isPlaying,
  isBuffering,
  onPlayPause,
  onPrevious,
  onNext,
}: PlayerControlsProps) {
  return (
    <View style={styles.playerContainer}>
      {/* Control Buttons */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.controlButton} onPress={onPrevious} disabled={isBuffering}>
          <Ionicons name="play-skip-back" size={28} color={COLORS.darkGrey} />
        </TouchableOpacity>

        <View style={styles.playPauseButton}>
          {isBuffering ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <TouchableOpacity onPress={onPlayPause}>
              <Ionicons name={isPlaying ? "pause" : "play"} size={32} color="#fff" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.controlButton} onPress={onNext} disabled={isBuffering}>
          <Ionicons name="play-skip-forward" size={28} color={COLORS.darkGrey} />
        </TouchableOpacity>
      </View>
    </View>
  )
}