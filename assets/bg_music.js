import React, { useEffect, useState, useMemo } from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { supabase } from '../supabase/supabase';

// URLs de ejemplo para las bocinas (puedes cambiarlas por tus propios PNGs en Supabase)
const ICON_ON = 'https://img.icons8.com/ios-filled/50/4CAF50/high-volume.png'; // Bocina con sonido
const ICON_OFF = 'https://img.icons8.com/ios-filled/50/F44336/mute.png';      // Bocina silenciada

export default function BackgroundMusic() {
  const audioUrl = useMemo(() => {
    const { data } = supabase
      .storage
      .from('music')
      .getPublicUrl('background.mp3');
    return data.publicUrl;
  }, []);

  const player = useAudioPlayer(audioUrl);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    async function iniciarMusica() {
      await setAudioModeAsync({
        playsInSilentMode: true,
        interruptionMode: 'mixWithOthers',
      });

      player.loop = true;
      player.volume = 0.1;
      player.play();
      setIsPlaying(true);
    }

    iniciarMusica();

    return () => {
      player.pause();
    };
  }, [player]);

  const cambiarAudio = () => {
    if (isPlaying) {
      player.pause();
      setIsPlaying(false);
    } else {
      player.play();
      setIsPlaying(true);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.button, isPlaying ? styles.buttonActive : styles.buttonInactive]} 
        onPress={cambiarAudio}
        activeOpacity={0.8}
      >
        <Image 
          source={{ uri: isPlaying ? ICON_ON : ICON_OFF }} 
          style={styles.icon} 
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonActive: {
  },
  buttonInactive: {
  },
  icon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
});