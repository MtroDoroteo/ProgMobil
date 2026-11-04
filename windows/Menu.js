import { signOut } from 'firebase/auth';
import { auth } from '../firebase/connect';
import { Alert } from 'react-native';
import React, { useEffect, useRef } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  Pressable,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { colores, menuStyles } from '../Styles/MenuStyles';

export default function Menu({
  visible,
  onClose,
  onNavigate,
  pantallaActiva,
}) {

  const desplazamiento = useRef(
    new Animated.Value(-350)
  ).current;

  useEffect(() => {
    Animated.timing(desplazamiento, {
      toValue: visible ? 0 : -350,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const navegar = (pantalla) => {
  onClose();

  if (pantalla !== pantallaActiva) {
    onNavigate(pantalla);
  }
};

  const opciones = [
  {
    titulo: 'Inicio',
    icono: 'home-outline',
    pantalla: 'Home',
  },
  {
    titulo: 'Entrenamientos',
    icono: 'barbell-outline',
    pantalla: 'Entrenamientos',
  },
  {
    titulo: 'Perfil',
    icono: 'person-outline',
    pantalla: 'Perfil',
  },
];
const cerrarSesion = async () => {
  try {
    await signOut(auth);
    onClose();
  } catch (error) {
    Alert.alert(
      'Error',
      'No se pudo cerrar la sesión.'
    );
    console.log(error);
  }
};
  const renderOpcion = (opcion) => {
    const activa = pantallaActiva === opcion.pantalla;

    return (
      <TouchableOpacity
        key={opcion.pantalla}
        style={[
          menuStyles.opcion,
          activa && menuStyles.opcionActiva,
        ]}
        onPress={() => navegar(opcion.pantalla)}
      >
        <Ionicons
          name={opcion.icono}
          size={22}
          color={
            activa
              ? colores.naranja
              : colores.textoSuave
          }
        />

        <Text
          style={[
            menuStyles.textoOpcion,
            activa && menuStyles.textoActivo,
          ]}
        >
          {opcion.titulo}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={onClose}
        statusBarTranslucent
      >
        <View style={menuStyles.overlay}>

          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={onClose}
          />

          <Animated.View
            style={[
              menuStyles.menu,
              {
                transform: [
                  { translateX: desplazamiento },
                ],
              },
            ]}
          >

            <View style={menuStyles.encabezado}>
              <Text style={menuStyles.titulo}>
                MINEGYM
              </Text>

              <Text style={menuStyles.subtitulo}>
                Tu progreso, tu entrenamiento.
              </Text>
            </View>

            <Text style={menuStyles.seccion}>
              MENÚ PRINCIPAL
            </Text>

            {opciones.map(renderOpcion)}

            <TouchableOpacity
  style={menuStyles.cerrar}
  onPress={cerrarSesion}
>
  <Ionicons
    name="log-out-outline"
    size={22}
    color={colores.error}
  />

  <Text style={menuStyles.textoCerrar}>
    Cerrar sesión
  </Text>
</TouchableOpacity>

          </Animated.View>
        </View>
      </Modal>
    </>
  );
}
