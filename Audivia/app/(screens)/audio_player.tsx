import { useState, useEffect, useCallback } from "react"
import { ActivityIndicator, SafeAreaView, ScrollView, View } from "react-native"
import styles from "@/styles/audio_player"
import AudioHeader from "../../components/audio_player/AudioHeader"
import AudioImage from "../../components/audio_player/AudioImage"
import PlayerControls from "../../components/audio_player/PlayerControls"
import Transcript from "../../components/audio_player/Transcript"
import { router, useLocalSearchParams } from "expo-router"
import { Audio, AVPlaybackStatus, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av"
import { getNextAudioByCheckpointId, getPrevAudioByCheckpointId, getTourAudioByCheckpointId, getTourById } from "@/services/tour"
import { getTourCheckpointById } from "@/services/tour_checkpoint"
import { createCheckpointProgress, getByTourProgressAndCheckpoint, updateCheckpointProgress } from "@/services/progress"
import { useUser } from "@/hooks/useUser"
import AudioVideo from "../../components/audio_player/AudioImage"

interface AudioData {
  id: string;
  fileUrl: string;
  image: string;
  transcript: string;
  videoUrl: string;
}

export default function AudioPlayerScreen() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const params = useLocalSearchParams<{ checkpointId: string; characterId: string; tourProgressId: string; tourId: string }>();
  const { checkpointId, characterId, tourProgressId, tourId } = params;
  const [audioData, setAudioData] = useState<AudioData | null>(null);
  const [checkpointImage, setCheckpointImage] = useState<string | undefined>();
  const { user } = useUser();
  const [currentProgress, setCurrentProgress] = useState(0);
  const [currentAudioDataForCleanup, setCurrentAudioDataForCleanup] = useState<AudioData | null>(null);

  useEffect(() => {
    const fetchCheckpointImage = async () => {
      setCheckpointImage(undefined);
      if (checkpointId) {
        try {
          const checkpointDetails = await getTourCheckpointById(checkpointId);
          if (checkpointDetails && checkpointDetails.images && checkpointDetails.images.length > 0) {
            setCheckpointImage(checkpointDetails.images[0].imageUrl);
          }
        } catch (error) {
          console.error("Failed to fetch checkpoint image:", error);
        }
      }
    };

    fetchCheckpointImage();
  }, [checkpointId]);

  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
    console.log("current checkpoint: ", checkpointId)
  }, []);

  const saveTrackProgress = useCallback(async (progressSecs: number, trackData: AudioData) => {
    if (!user?.id || !params.checkpointId || !trackData.id || !params.tourProgressId) {
      console.log('SaveTrackProgress: Missing critical IDs.', {
        userId: user?.id, checkpointId: params.checkpointId, audioId: trackData.id, tourProgressId: params.tourProgressId
      });
      return;
    }
    try {
      const existingCheckpointData = await getByTourProgressAndCheckpoint(params.tourProgressId, params.checkpointId);
      const existingCheckpointProgress = existingCheckpointData.response;

      const soundStatus = await sound?.getStatusAsync();
      const durationMillis = (soundStatus as AVPlaybackStatus & { durationMillis?: number })?.durationMillis;
      const totalDurationSecs = durationMillis ? Math.ceil(durationMillis / 1000) : 0;
      const isCompleted = totalDurationSecs > 0 && progressSecs >= totalDurationSecs - 2;

      if (existingCheckpointProgress) {
        if (progressSecs > existingCheckpointProgress.progressSeconds || (isCompleted && !existingCheckpointProgress.isCompleted)) {
          const progressDataToUpdate = {
            progressSeconds: progressSecs,
            isCompleted: existingCheckpointProgress.isCompleted || isCompleted,
            lastListenedTime: new Date().toISOString()
          };
          await updateCheckpointProgress(existingCheckpointProgress.id, progressDataToUpdate);
        }
      } else {
        const progressDataToCreate = {
          userTourProgressId: params.tourProgressId,
          tourCheckpointId: params.checkpointId,
          checkpointAudioId: trackData.id,
          progressSeconds: progressSecs,
          isCompleted: isCompleted,
          lastListenedTime: new Date().toISOString()
        };
        await createCheckpointProgress(progressDataToCreate);
      }
    } catch (error) {
      console.error('Error in saveTrackProgress:', error);
    }
  }, [user?.id, params.checkpointId, params.tourProgressId, sound]);

  useEffect(() => {
    const fetchAndSetAudioData = async () => {
      if (checkpointId && characterId) {
        const response = await getTourAudioByCheckpointId(checkpointId, characterId)
        if (response && response.response) {
          setCurrentAudioDataForCleanup(audioData);
          setAudioData(response.response)
        } else {
          setCurrentAudioDataForCleanup(audioData);
          setAudioData(null)
        }
      }
    }
    fetchAndSetAudioData()
  }, [checkpointId, characterId]);

  useEffect(() => {
    let isMounted = true;

    const loadSound = async () => {
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }

      setCurrentProgress(0);
      setIsPlaying(false);

      if (!audioData?.fileUrl) {
        return;
      }

      setIsBuffering(true);

      try {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: audioData.fileUrl },
          {
            shouldPlay: false,
            androidImplementation: 'MediaPlayer',
          },
          onPlaybackStatusUpdate
        );
        if (isMounted) {
          setSound(newSound);
        }
      } catch (error) {
        console.error("Error loading sound:", error);
        if (isMounted) {
          setSound(null);
          setIsBuffering(false);
        }
      }
    };

    loadSound();

    return () => {
      isMounted = false;
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [audioData]);

  const onPlaybackStatusUpdate = async (status: AVPlaybackStatus) => {
    if (!status.isLoaded) {
      if (status.error) {
        console.error(`Playback Error: ${status.error}`);
        setIsPlaying(false);
        setIsBuffering(false);
      }
      return;
    }

    setIsBuffering(status.isBuffering);
    setIsPlaying(status.isPlaying);
    setCurrentProgress(Math.ceil(status.positionMillis / 1000));

    if (status.didJustFinish) {
      if (user?.id && checkpointId && audioData?.id && tourProgressId) {
        const soundStatus = await sound?.getStatusAsync();
        const durationMillis = (soundStatus as AVPlaybackStatus & { durationMillis?: number })?.durationMillis;

        if (durationMillis) {
          const totalDuration = Math.ceil(durationMillis / 1000);
          console.log(`Track finished. Total duration: ${totalDuration}s. Marking as complete.`);
          await saveTrackProgress(totalDuration, audioData);
        } else {
          console.warn("Audio finished but durationMillis is not available. Progress might not be marked as complete accurately.");
        }
      }
    }
  };

  const prepareForTrackChangeOrExit = async () => {
    if (sound) {
      if (currentProgress > 0 && audioData) {
        console.log(`Explicit Save: Saving progress for ${audioData.id} at ${currentProgress}s`);
        await saveTrackProgress(currentProgress, audioData);
      }
      console.log(`Explicit Unload: Unloading sound for ${audioData?.id}`);
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }
    setCurrentProgress(0);
    setIsPlaying(false);
  };

  const togglePlayPause = async () => {
    if (!sound || isBuffering) return;
    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
    // We don't set isPlaying here, we let onPlaybackStatusUpdate handle it for a single source of truth
  };

  const handleNextAudio = async () => {
    await prepareForTrackChangeOrExit();
    const res = await getNextAudioByCheckpointId(checkpointId);
    if (res.response?.id) {
      router.setParams({ checkpointId: res.response.tourCheckpointId });
    } else {
      console.log("No next audio found or no ID in response.");
    }
  };

  const handlePrevAudio = async () => {
    await prepareForTrackChangeOrExit();
    const res = await getPrevAudioByCheckpointId(checkpointId);
    if (res.response?.id) {
      router.setParams({ checkpointId: res.response.tourCheckpointId });
    } else {
      console.log("No previous audio found or no ID in response.");
    }
  };

  const handleBack = async () => {
    await prepareForTrackChangeOrExit();
    router.back();
  };

  if (!audioData) {
    return (
      <SafeAreaView style={styles.container}>
        <AudioHeader onBackPress={handleBack} checkpointId={checkpointId as string} />
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <AudioHeader onBackPress={handleBack} checkpointId={checkpointId as string} />
      <AudioVideo
        videoUrl={audioData.videoUrl}
        imageUrl={checkpointImage}
        isPlaying={isPlaying}
      />
      <PlayerControls
        isBuffering={isBuffering}
        isPlaying={isPlaying}
        onPlayPause={togglePlayPause}
        onNext={handleNextAudio}
        onPrevious={handlePrevAudio}
      />
      <ScrollView style={{ flex: 1, margin: 20 }} showsVerticalScrollIndicator={false}>
        <Transcript text={audioData.transcript} />
      </ScrollView>
    </SafeAreaView>
  );
}