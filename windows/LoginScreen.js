import { signInWithEmailAndPassword } from 'firebase/auth';
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

const Login = ({ navigation }) => {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [ocultarPassword, setOcultarPassword] = useState(true);

  // Función que se ejecuta al presionar el botón "Iniciar Sesión"
  const handleIniciarSesion = async () => {

    if(!usuario.trim() || !password.trim()){
      Alert.alert(
        "Campos vacios",
        "Por favor, llena todos los campos"
      );
      return;
    }

    try{
      await signInWithEmailAndPassword(auth, usuario.trim(), password);
    } catch (error){
      if(error.code === "auth/invalid-email"){
        Alert.alert("ERROR", "Ingresa un e-mail válido.");
      } else if(error.code === "auth/user-disabled"){
        Alert.alert("ERROR", "El usuario ha sido inabilidado.")
      } else if(error.code === "auth/too-many-requests"){
        Alert.alert("ERROR", "Has falldo demasiado la contraseña, intenta mas tarde.")
      } else if(error.code === "auth/invalid-credential"){
        Alert.alert("ERROR", "E-mail o contraseña incorrecto.")
      } else {
        console.log(error)
        Alert.alert("ERROR", "Error desconocido")
      }
    }

  };

  // Función que navega (o se activa) al presionar "¿Olvidaste tu contraseña?"
  const handleOlvideContrasena = () => {
    navigation.navigate('Recuperar')
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
          <Text style={styles.titulo}>INICIO DE SESIÓN</Text>
          <Text style={styles.subtitulo}>BIENVENIDOS</Text>

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

          {/* ---------- CAMPO: CONTRASEÑA ---------- */}
          <Text style={styles.label}>Contraseña</Text>
          <View style={styles.inputContainer}>
            {/* Icono de candado a la izquierda */}
            <View style={styles.iconWrapper}>
              <Ionicons name="lock-closed-outline" size={22} color="#6B7280" />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={ocultarPassword}
            />
            {/* Botón para mostrar/ocultar contraseña */}
            <TouchableOpacity
              onPress={() => setOcultarPassword(!ocultarPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={ocultarPassword ? 'eye-off-outline' : 'eye-outline'}
                size={22}
                color="#6B7280"
              />
            </TouchableOpacity>
          </View>

          {/* ---------- ENLACE: OLVIDASTE TU CONTRASEÑA ---------- */}
          <TouchableOpacity
            onPress={handleOlvideContrasena}
            style={styles.forgotPasswordContainer}
          >
            <Text style={styles.forgotPasswordText}>
              ¿Olvidaste tu contraseña?
            </Text>
          </TouchableOpacity>

          {/* ---------- BOTÓN: INICIAR SESIÓN ---------- */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleIniciarSesion}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
          </TouchableOpacity>

          {/* ---------- ENLACE: REGISTRO ---------- */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>¿No tienes una cuenta? </Text>
            <TouchableOpacity onPress={handleRegistro}>
              <Text style={styles.registerLink}>Regístrate</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>

    </ImageBackground>
  );
};

export default Login;