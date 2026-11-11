import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { useAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { supabase } from '../supabase/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Slider from '@react-native-community/slider';

const { width } = Dimensions.get('window');
const DEFAULT_COVER = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=60';

export default function FullScreenPlayer() {
  const audioUrl = useMemo(() => {
    const { data } = supabase.storage.from('music/background').getPublicUrl('background.mp3');
    return data.publicUrl;
  }, []);

  const coverUrl = useMemo(() => {
    const { data } = supabase.storage.from('music/background').getPublicUrl('cover.webp');
    return data.publicUrl || DEFAULT_COVER;
  }, []);

  const player = useAudioPlayer(audioUrl);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(1); // Evitar división por cero

  useEffect(() => {
    async function initPlayer() {
      await setAudioModeAsync({
        playsInSilentMode: true,
        interruptionMode: 'mixWithOthers',
      });

      player.loop = true;
      player.volume = 0.4;

      const estadoGuardado = await AsyncStorage.getItem('@estado_musica');
      if (estadoGuardado === 'apagado') {
        player.pause();
        setIsPlaying(false);
      } else {
        player.play();
        setIsPlaying(true);
      }
    }

    initPlayer();

    // Intervalo para actualizar el progreso de la canción
    const interval = setInterval(() => {
      if (player && player.currentTime !== undefined) {
        setCurrentTime(player.currentTime);
        if (player.duration) setDuration(player.duration);
      }
    }, 500);

    return () => {
      clearInterval(interval);
      player.pause();
    };
  }, [player]);

  const togglePlay = async () => {
    if (isPlaying) {
      player.pause();
      setIsPlaying(false);
      await AsyncStorage.setItem('@estado_musica', 'apagado');
    } else {
      player.play();
      setIsPlaying(true);
      await AsyncStorage.setItem('@estado_musica', 'encendido');
    }
  };

  // Adelantar o retroceder 10 segundos
  const skipTime = (seconds) => {
    const newTime = Math.max(0, Math.min(currentTime + seconds, duration));
    player.seekTo(newTime);
    setCurrentTime(newTime);
  };

  // Formatear segundos a formato MM:SS
  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const remainingSeconds = Math.floor(secs % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <View style={styles.container}>
      {/* Carátula grande estilo álbum */}
      <Image source={{ uri: coverUrl }} style={styles.coverImage} />

      {/* Información de la pista */}
      <View style={styles.infoContainer}>
        <Text style={styles.songTitle}>Background Track</Text>
        <Text style={styles.artistName}>Supabase Audio Experience</Text>
      </View>

      {/* Barra de progreso interactiva (Slider) */}
      <View style={styles.progressContainer}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration}
          value={currentTime}
          onSlidingComplete={(value) => player.seekTo(value)}
          minimumTrackTintColor="#1DB954"
          maximumTrackTintColor="#535353"
          thumbTintColor="#FFFFFF"
        />
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
      </View>

      {/* Controles de reproducción */}
      <View style={styles.controlsContainer}>
        {/* Retroceder 10s */}
        <TouchableOpacity onPress={() => skipTime(-10)} style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>⏮ -10s</Text>
        </TouchableOpacity>

        {/* Play / Pause Principal */}
        <TouchableOpacity style={styles.playButton} onPress={togglePlay} activeOpacity={0.8}>
          <Text style={styles.playButtonIcon}>{isPlaying ? '⏸' : '▶'}</Text>
        </TouchableOpacity>

        {/* Adelantar 10s */}
        <TouchableOpacity onPress={() => skipTime(10)} style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>+10s ⏭</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Fondo oscuro tipo Spotify
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  coverImage: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: 12,
    backgroundColor: '#282828',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  infoContainer: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  songTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  artistName: {
    color: '#B3B3B3',
    fontSize: 16,
    marginTop: 5,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 20,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  timeText: {
    color: '#A7A7A7',
    fontSize: 12,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    gap: 30,
  },
  playButton: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    backgroundColor: '#1DB954',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonIcon: {
    fontSize: 30,
    color: '#FFFFFF',
    marginLeft: 3,
  },
  secondaryButton: {
    padding: 10,
  },
  secondaryButtonText: {
    color: '#B3B3B3',
    fontSize: 14,
    fontWeight: '600',
  },
});