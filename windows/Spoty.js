
import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView
} from 'react-native';

import { WebView } from 'react-native-webview';

import {
  doc,
  getDoc
} from 'firebase/firestore';

import { db } from '../firebase/connect';

export default function SpotifyScreen() {

  const [embedUrl, setEmbedUrl] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  // Obtener enlace desde Firebase
  useEffect(() => {

    const obtenerCancion = async () => {

      try {

        // Colección: canciones
        // Documento: spotify

        const referencia = doc(db, 'canciones', 'spotify');

        const resultado = await getDoc(referencia);

        if (!resultado.exists()) {
          throw new Error('No existe el documento de Spotify');
        }

        const data = resultado.data();

        const spotifyUrl = data.spotify_url;

        if (!spotifyUrl) {
          throw new Error('No hay enlace de Spotify');
        }

        // Convertir enlace a Embed
        const url = new URL(spotifyUrl);

        if (url.hostname !== 'open.spotify.com') {
          throw new Error('Enlace de Spotify no válido');
        }

        const partes = url.pathname
          .split('/')
          .filter(Boolean);

        const tipos = [
          'track',
          'album',
          'playlist',
          'artist',
          'show',
          'episode'
        ];

        const tipo = partes[0];
        const id = partes[1];

        if (!tipos.includes(tipo) || !id) {
          throw new Error('Enlace no válido');
        }

        setEmbedUrl(
          `https://open.spotify.com/embed/${tipo}/${id}?utm_source=generator&theme=0`
        );

      } catch (err) {

        setError(err.message);

      } finally {

        setCargando(false);

      }

    };

    obtenerCancion();

  }, []);

  return (

    <ScrollView style={styles.fondo}>

      <View style={styles.contenedor}>

        <Text style={styles.titulo}>
          Mi música
        </Text>

        <Text style={styles.descripcion}>
          Escucha tu música favorita
        </Text>

        {cargando ? (

          <ActivityIndicator
            size="large"
            color="#1DB954"
          />

        ) : error ? (

          <Text style={styles.error}>
            {error}
          </Text>

        ) : embedUrl ? (

          <View style={styles.reproductor}>

            <WebView
  source={{
    uri: embedUrl
  }}

  style={styles.webview}

  javaScriptEnabled={true}
  domStorageEnabled={true}

  allowsInlineMediaPlayback={true}
  mediaPlaybackRequiresUserAction={false}

  setSupportMultipleWindows={false}
  javaScriptCanOpenWindowsAutomatically={true}

  thirdPartyCookiesEnabled={true}
  sharedCookiesEnabled={true}

  onError={(event) => {
    console.log('Error WebView:', event.nativeEvent);
  }}

  onHttpError={(event) => {
    console.log('Error HTTP:', event.nativeEvent);
  }}

  onLoadEnd={() => {
    console.log('Spotify cargado');
  }}

  startInLoadingState={true}
/>

          </View>

        ) : null}

      </View>

    </ScrollView>

  );

}

const styles = StyleSheet.create({

  fondo: {
    flex: 1,
    backgroundColor: '#101010'
  },

  contenedor: {
    flex: 1,
    padding: 20,
    paddingTop: 55
  },

  titulo: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold'
  },

  descripcion: {
    color: '#AAAAAA',
    fontSize: 14,
    marginTop: 8,
    marginBottom: 30
  },

  reproductor: {
    height: 352,
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#181818'
  },

  webview: {
    flex: 1,
    backgroundColor: '#181818'
  },

  error: {
    color: '#FF6B6B',
    textAlign: 'center',
    marginTop: 30
  }

});
