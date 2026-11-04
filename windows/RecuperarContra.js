import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from "../firebase/connect.js";

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  ImageBackground,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import styles from '../Styles/LoginStyles';

const Recuperar = ({ navigation }) => {
  const [usuario, setUsuario] = useState('');

  // Función que se ejecuta al presionar el botón "Iniciar Sesión"
  const handleIniciarSesion = async () => {

    if(!usuario.trim()){
      Alert.alert(
        "Campos vacios",
        "Por favor, llena todos los campos"
      );
      return;
    }

    try{

      const envio = await sendPasswordResetEmail(
        auth,
        usuario
      );

      Alert.alert("Enviado", "Se ha enviado un correo electrónico para el reseteo de tu contraseña, revisa la carpeta de SPAM en caso de no visualizarlos");
      navigation.navigate('Login');
    } catch (error){
        console.log(error)
        Alert.alert("ERROR", "Error desconocido")
    }

  };

  // Función que navega (o se activa) al presionar "¿Olvidaste tu contraseña?"
  const handleOlvideContrasena = () => {
    // Aquí se agregaría la navegación a la pantalla de recuperación de contraseña
    console.log('Olvidó su contraseña');
  };

  // Función que navega al presionar "Regístrate"
  const handleRegistro = () => {
    // Aquí se agregaría la navegación a la pantalla de registro
    navigation.navigate('Registro');
  };

  return (
    <ImageBackground
      source={{
        uri:"https://template.canva.com/EAGT8mv6VSA/2/0/900w--jcJGjC9rZw.jpg"
      }}
      style={styles.safeArea}
      resizeMode="cover"
    >
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* ---------- LOGO ---------- */}
          <Image
            source={{
              uri:"https://i.imgur.com/UScHfpW.png"
            }}
            style={styles.logo}
          ></Image>

          {/* ---------- TÍTULO Y SUBTÍTULO ---------- */}
          <Text style={styles.titulo}>OLVIDÉ LA CONTRASEÑA</Text>
          <Text style={styles.subtitulo}>Ingresa tu correo electronico para recuperar la contraseña</Text>

          {/* ---------- CAMPO: USUARIO / CORREO ---------- */}
          <Text style={styles.label}>Usuario/Correo</Text>
          <View style={styles.inputContainer}>
            {/* Icono de usuario a la izquierda */}
            <View style={styles.iconWrapper}>
              <Ionicons name="person-outline" size={22} color="#6B7280" />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico o Usuario"
              placeholderTextColor="#9CA3AF"
              value={usuario}
              onChangeText={setUsuario}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {/* ---------- BOTÓN: INICIAR SESIÓN ---------- */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleIniciarSesion}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>Recuperar</Text>
          </TouchableOpacity>

          {/* ── Footer: enlace a inicio de sesión ── */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>¿Ya tienes cuenta? </Text>
            <TouchableOpacity onPress={() => navigation?.navigate('Login')}>
              <Text style={styles.footerLink}>Inicia sesión aquí</Text>
            </TouchableOpacity>
          </View>
          
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>

    </ImageBackground>
  );
};

export default Recuperar;