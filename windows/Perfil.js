import React, { useEffect, useState } from 'react';

import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';

import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { estilos, colores, medidas } from '../Styles/PerfilStyles';
import { signOut } from 'firebase/auth';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/connect';

import { supabase } from '../supabase/supabase'

// ------------------------------------------------------------
// 1. ESTRUCTURA ESPERADA DEL DOCUMENTO EN FIRESTORE
// Colección: "usuarios"  (el uid de Authentication va en "uid_usuario")
//
// {
//   uid_usuario: "abc123...",
//   nombre: "Alex Rivera",
//   user: "@alex_rivera",
//   photo: "https://...",           // o null / vacío si no tiene foto
//   followers: 354,
//   following: 148,
//   racha: 68,                      // días seguidos
//   pr: { distancia: "10km", tiempo: "48:15" },
//   stats: {
//     tiempoTotal: "7h 35m",
//     sesiones: 4,
//     dias: [ { letra: "L", proporcion: 0.78 }, ... ]   // 7 días, proporcion de 0 a 1
//   },
//   entrenamientos: [
//     { emoji: "🏃", nombre: "Carrera Matutina", fecha: "Lun 8 Oct",
//       hora: "11:30", distancia: "8.5 km", duracion: "58 min", calorias: 890 },
//     ...
//   ]
// }
// ------------------------------------------------------------

// Si "fecha" se guardó como Timestamp de Firestore, la convertimos a texto.
// Si ya es texto (ej. "Lun 8 Oct"), se deja tal cual.
const textoFecha = (fecha) => {
  if (fecha && typeof fecha.toDate === 'function') {
    return fecha
      .toDate()
      .toLocaleDateString('es-MX', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      });
  }
  return fecha ?? '';
};

// ------------------------------------------------------------
// 2. COMPONENTES PEQUEÑOS (dentro del mismo archivo)
// ------------------------------------------------------------

// Una estadística social: número arriba, etiqueta abajo
const EstadisticaSocial = ({ valor, etiqueta }) => (
  <View style={estilos.redItem}>
    <Text style={estilos.redValor}>{valor}</Text>
    <Text style={estilos.redEtiqueta}>{etiqueta}</Text>
  </View>
);

// Una barra de la gráfica semanal
const BarraDia = ({ letra, proporcion }) => {
  const tieneActividad = proporcion > 0;

  // Con actividad: altura proporcional. Sin actividad: barra gris completa.
  const altura = tieneActividad
    ? medidas.alturaBarra * proporcion
    : medidas.alturaBarra;

  return (
    <View style={estilos.barraColumna}>
      <View
        style={[
          estilos.barra,
          tieneActividad ? estilos.barraLlena : estilos.barraVacia,
          { height: altura },
        ]}
      />
      <Text style={estilos.barraDia}>{letra}</Text>
    </View>
  );
};

// Una tarjeta de la lista de entrenamientos recientes
const TarjetaEntrenamiento = ({ numero, entrenamiento, onPress }) => {
  // Armamos la segunda línea: "11:30 | 8.5 km - 58 min | 🔥 890 cal"
  const distancia = entrenamiento.distancia
    ? `${entrenamiento.distancia} - `
    : '';
  const detalle = `${entrenamiento.hora} | ${distancia}${entrenamiento.duracion} | 🔥 ${entrenamiento.calorias} cal`;

  return (
    <TouchableOpacity
      style={estilos.entrenoTarjeta}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Número de posición en la lista */}
      <Text style={estilos.entrenoNumero}>{numero}</Text>

      {/* Título + fecha, y debajo el detalle */}
      <View style={estilos.entrenoInfo}>
        <Text style={estilos.entrenoTitulo} numberOfLines={1}>
          {entrenamiento.emoji} {entrenamiento.nombre}
          <Text style={estilos.entrenoFecha}>
            {' '}
            - {textoFecha(entrenamiento.fecha)}
          </Text>
        </Text>
        <Text style={estilos.entrenoDetalle}>{detalle}</Text>
      </View>

      {/* Flecha a la derecha */}
      <Text style={estilos.entrenoFlecha}>›</Text>
    </TouchableOpacity>
  );
};

// ------------------------------------------------------------
// 3. PANTALLA PRINCIPAL
// "navigation" llega por props si usas React Navigation.
// ------------------------------------------------------------
export default function Perfil({ navigation }) {
  // Datos del usuario traídos de Firestore (null mientras carga)
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [subiendoFoto, setSubiendoFoto] = useState(false);

  // ----------------------------------------------------------
  // 3.1 Traer el documento del usuario desde Firestore
  // Buscamos en "usuarios" el documento cuyo campo "uid_usuario"
  // sea igual al uid del usuario que inició sesión.
  // ----------------------------------------------------------
  useEffect(() => {
    let activo = true; // evita actualizar el estado si la pantalla ya se cerró

    const cargarPerfil = async () => {
      try {
        const uid = auth.currentUser?.uid;
        if (!uid) {
          throw new Error('No hay una sesión activa.');
        }

        const consulta = query(
          collection(db, 'usuarios'),
          where('uid_usuario', '==', uid)
        );
        const resultado = await getDocs(consulta);

        if (resultado.empty) {
          throw new Error('No se encontró el perfil del usuario.');
        }

        // Tomamos el primer (y único) documento encontrado
        if (activo) setDatos(resultado.docs[0].data());
      } catch (e) {
        console.error(e);
        if (activo) setError(e.message);
      } finally {
        if (activo) setCargando(false);
      }
    };

    cargarPerfil();
    return () => {
      activo = false;
    };
  }, []);

  // ----------------------------------------------------------
  // 3.2 Cerrar sesión
  // Va dentro del componente para poder usar "navigation".
  // ----------------------------------------------------------
  const cerrarSesion = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login');
    } catch (e) {
      console.error(e);
    }
  };

  // ----------------------------------------------------------
  // 3.2 Cambiar foto de perfil
  // Va dentro del componente para poder usar "navigation".
  // ----------------------------------------------------------
  


const cambiarFotoPerfil = async () => {
  try {
    if (subiendoFoto) return;

    const uid = auth.currentUser?.uid;

    if (!uid) {
      throw new Error('No hay usuario activo en Firebase.');
    }

    // 1. Solicitar permisos
    const permiso =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permiso.granted) {
      alert('Necesitas permitir el acceso a la galería.');
      return;
    }

    // 2. Abrir galería
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (resultado.canceled) return;

    setSubiendoFoto(true);

    const imagen = resultado.assets[0];

    // 3. Leer imagen directamente desde su URI
    const base64 = await FileSystem.readAsStringAsync(
      imagen.uri,
      {
        encoding: 'base64',
      }
    );

    if (!base64 || base64.length < 1000) {
      throw new Error('No se pudo leer correctamente la imagen.');
    }

    // 4. Convertir Base64 a bytes
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    // 5. Validar formato
    const mimeType = imagen.mimeType || 'image/jpeg';

    const extensiones = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
    };

    const extension = extensiones[mimeType];

    if (!extension) {
      throw new Error('Formato de imagen no compatible.');
    }

    // 6. Nombre utilizando UID
    const nombreArchivo = `${uid}.${extension}`;

    // 7. Subir a Supabase
    const { data, error } = await supabase.storage
      .from('perfiles')
      .upload(nombreArchivo, bytes, {
        contentType: mimeType,
        upsert: true,
      });

    if (error) throw error;

    // 8. Obtener URL pública
    const { data: urlData } = supabase.storage
      .from('perfiles')
      .getPublicUrl(data.path);

    const urlFoto = `${urlData.publicUrl}?v=${Date.now()}`;

    // 9. Buscar documento Firestore
    const consulta = query(
      collection(db, 'usuarios'),
      where('uid_usuario', '==', uid)
    );

    const resultadoFirestore = await getDocs(consulta);

    if (resultadoFirestore.empty) {
      throw new Error('No se encontró el perfil.');
    }

    // 10. Guardar URL en Firestore
    await updateDoc(resultadoFirestore.docs[0].ref, {
      photo: urlFoto,
    });

    // 11. Actualizar perfil
    setDatos(anterior => ({
      ...anterior,
      photo: urlFoto,
    }));

    alert('¡Foto actualizada correctamente!');

  } catch (error) {
    console.error('Error al subir fotografía:', error);
    alert(error.message || 'No se pudo subir la fotografía.');
  } finally {
    setSubiendoFoto(false);
  }
};




  // ----------------------------------------------------------
  // 3.3 Pantallas de carga y de error
  // ----------------------------------------------------------
  if (cargando) {
    return (
      <SafeAreaView style={estilos.centrado}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (error || !datos) {
    return (
      <SafeAreaView style={estilos.centrado}>
        <Text style={estilos.errorTexto}>
          {error || 'No se pudo cargar el perfil.'}
        </Text>
      </SafeAreaView>
    );
  }

  // ----------------------------------------------------------
  // 3.4 Datos listos: los sacamos del documento con valores
  // por defecto, por si algún campo aún no existe en Firestore.
  // ----------------------------------------------------------
  const nombre = datos.nombre ?? '';
  const usuario = datos.user ?? '';
  const avatar = datos.photo || null; // si es null se muestra la inicial
  const inicial = nombre.charAt(0).toUpperCase();

  // Estadísticas sociales (se dibujan con un divisor entre cada una)
  const estadisticasSociales = [
    { id: 'seguidores', valor: datos.followers ?? 0, etiqueta: 'Followers' },
    { id: 'siguiendo', valor: datos.following ?? 0, etiqueta: 'Following' },
  ];

  const racha = datos.racha ?? 0;
  const marcaPersonal = datos.pr ?? {};

  // Resumen semanal. "proporcion" va de 0 a 1 (0 = barra gris, sin actividad)
  const resumenSemanal = datos.stats ?? {};
  const diasSemana = resumenSemanal.dias ?? [];

  const entrenamientos = datos.entrenamientos ?? [];

  return (
    <SafeAreaView style={estilos.contenedor}>
      <StatusBar barStyle="dark-content" backgroundColor={colores.fondo} />

      {/* ---------- Contenido con scroll ---------- */}
      <ScrollView
        contentContainerStyle={estilos.scrollContenido}
        showsVerticalScrollIndicator={false}
      >
        {/* ===== Avatar, nombre y botón Editar Perfil ===== */}
        <View style={estilos.perfilFila}>
          <View style={estilos.avatarContenedor}>
            {avatar ? (
              <Image source={{ uri: avatar }} style={estilos.avatar} />
            ) : (
              <View style={[estilos.avatar, estilos.avatarPlaceholder]}>
                <Text style={estilos.avatarInicial}>{inicial}</Text>
              </View>
            )}

            {/* Insignia verde de verificado (solo si el campo "verificado" es true) */}
            {datos.verificado === true && (
              <View style={estilos.insignia}>
                <Text style={estilos.insigniaTexto}>✓</Text>
              </View>
            )}
          </View>

          <View style={estilos.perfilInfo}>
            <Text style={estilos.nombre}>{nombre}</Text>
            <Text style={estilos.usuario}>{usuario}</Text>

            <TouchableOpacity
              style={estilos.botonEditar}
              onPress={cambiarFotoPerfil} // Aquí se cierra sesión
            >
              <Text style={estilos.botonEditarTexto}>Editar Perfil</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ===== Estadísticas sociales (columnas con divisores) ===== */}
        <View style={estilos.redesFila}>
          {estadisticasSociales.map((item, indice) => (
            <React.Fragment key={item.id}>
              {/* Divisor vertical antes de la 2ª estadística */}
              {indice > 0 && <View style={estilos.redDivisor} />}
              <EstadisticaSocial valor={item.valor} etiqueta={item.etiqueta} />
            </React.Fragment>
          ))}
        </View>

        {/* ===== Tarjetas: Racha actual y Marca personal ===== */}
        <View style={estilos.tarjetasFila}>
          {/* Racha actual (azul) */}
          <View style={estilos.tarjetaRacha}>
            <Text style={estilos.tarjetaTitulo}>Racha Actual</Text>
            <View style={estilos.tarjetaValorFila}>
              <Text style={estilos.tarjetaEmoji}>🔥</Text>
              <Text style={estilos.tarjetaValorRacha}>¡{racha} días!</Text>
            </View>
            <Text style={estilos.tarjetaSubtitulo}>Mantenla viva!</Text>
          </View>

          {/* Marca personal (durazno) */}
          <View style={estilos.tarjetaMarca}>
            <Text style={estilos.tarjetaTitulo}>🏆 Marca Personal PR</Text>
            <View style={estilos.tarjetaValorFila}>
              <Text style={estilos.tarjetaEmoji}>🏆</Text>
              <Text style={estilos.tarjetaValorMarca}>
                {marcaPersonal.distancia ?? '--'}: {marcaPersonal.tiempo ?? '--'}
              </Text>
            </View>
            <Text style={estilos.tarjetaSubtitulo}>Nuevo Récord!</Text>
          </View>
        </View>

        {/* ===== Estadísticas semanales (gráfica de barras) ===== */}
        <View style={estilos.semanaTarjeta}>
          <Text style={estilos.semanaTitulo}>📊 Estadísticas Semanales</Text>

          {/* Tiempo total | número de sesiones */}
          <View style={estilos.semanaResumenFila}>
            <Text style={estilos.semanaResumen}>
              {resumenSemanal.tiempoTotal ?? '0h 0m'}
            </Text>
            <View style={estilos.semanaSeparador} />
            <Text style={estilos.semanaResumen}>
              Sessions: {resumenSemanal.sesiones ?? 0}
            </Text>
          </View>

          {/* Una barra por día */}
          <View style={estilos.barrasFila}>
            {diasSemana.map((dia, indice) => (
              <BarraDia
                key={`${dia.letra}-${indice}`}
                letra={dia.letra}
                proporcion={dia.proporcion ?? 0}
              />
            ))}
          </View>
        </View>

        {/* ===== Entrenamientos recientes ===== */}
        <View style={estilos.entrenosContenedor}>
          <Text style={estilos.entrenosTitulo}>Entrenamientos Recientes</Text>

          {entrenamientos.map((entrenamiento, indice) => (
            <TarjetaEntrenamiento
              key={entrenamiento.id ?? String(indice)}
              numero={indice + 1}
              entrenamiento={entrenamiento}
              onPress={() =>
                navigation?.navigate('DetalleEntrenamiento', {
                  id: entrenamiento.id ?? indice,
                })
              }
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}