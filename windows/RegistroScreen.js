import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import styles, { colors } from '../Styles/RegistroStyles';

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/connect';

import { registrarUsuario } from '../firebase/services';


// `navigation` llega como prop si usas React Navigation
export default function Registro({ navigation }) {
  // ─────────────────────────────────────────────
  // 1. ESTADO DEL FORMULARIO
  // ─────────────────────────────────────────────
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');

  // Controla si la contraseña se ve o se oculta (ícono del ojo)
  const [verPassword, setVerPassword] = useState(false);

  // Errores por campo: { nombre: '...', correo: '...', ... }
  const [errores, setErrores] = useState({});

  // Estado de carga mientras se envía el registro
  const [cargando, setCargando] = useState(false);

  // ─────────────────────────────────────────────
  // 2. VALIDACIÓN
  //    Devuelve true si todo está correcto.
  // ─────────────────────────────────────────────
  const validar = () => {
    const nuevosErrores = {};

    if (confirmar !== password) {
      nuevosErrores.confirmar = 'Las contraseñas no coinciden';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // ─────────────────────────────────────────────
  // 3. ENVÍO DEL REGISTRO
  // ─────────────────────────────────────────────
  const handleRegistro = async () => {
    if (!validar()) return;

    setCargando(true);
    try {

      const credencial = await createUserWithEmailAndPassword(
        auth,
        correo,
        password
      );

      await registrarUsuario(credencial.user.uid, nombre, correo);

      Alert.alert('¡Listo!', 'Tu cuenta fue creada correctamente.');


      navigation.navigate('Login'); // ajusta el nombre a tu ruta de login
    } catch (error) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          alert('Este correo electrónico ya está registrado.');
          break;
        case 'auth/invalid-email':
          alert('El correo electrónico ingresado no es válido.');
          break;
        case 'auth/weak-password':
          alert('La contraseña es muy débil. Debe tener al menos 6 caracteres.');
          break;
        case 'auth/operation-not-allowed':
          alert('El registro por correo/contraseña no está habilitado en Firebase Console.');
          break;
        case 'auth/network-request-failed':
          alert('Error de red. Comprueba tu conexión a internet.');
          break;
        default:
          alert('Ocurrió un error insospechado al crear la cuenta.');
          console.error(error.code, error.message);
          break;
      }
    } finally {
      setCargando(false);
    }
  };

  // ─────────────────────────────────────────────
  // 4. INTERFAZ
  // ─────────────────────────────────────────────
  return (
  
    <ImageBackground
      source={{
        uri:"https://template.canva.com/EAGT8mv6VSA/2/0/900w--jcJGjC9rZw.jpg"
      }}
      style={styles.safeArea}
      resizeMode="cover"
    >
  
  <SafeAreaView style={styles.safeArea}>
      {/* Sube el formulario cuando aparece el teclado */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled" // permite tocar botones con el teclado abierto
          showsVerticalScrollIndicator={false}
        >

          <Image
            source={{
              uri:"https://i.imgur.com/UScHfpW.png"
            }}
            style={styles.logo}
          ></Image>

          {/* ── Bloque superior: título + campos + botón ── */}
          <View style={styles.formWrapper}>
            
            <Text style={styles.title}>Crear Cuenta</Text>

            {/* Campo: Nombre completo */}
            <View
              style={[
                styles.inputContainer,
                errores.nombre && styles.inputContainerError,
              ]}
            >
              <View style={styles.iconBox}>
                <Ionicons name="person-outline" size={30} color={colors.iconColor} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Nombre Completo"
                placeholderTextColor={colors.placeholder}
                value={nombre}
                onChangeText={setNombre}
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>
            {errores.nombre && <Text style={styles.errorText}>{errores.nombre}</Text>}

            {/* Campo: Correo electrónico */}
            <View
              style={[
                styles.inputContainer,
                errores.correo && styles.inputContainerError,
              ]}
            >
              <View style={styles.iconBox}>
                <Ionicons name="mail-outline" size={30} color={colors.iconColor} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Correo Electrónico"
                placeholderTextColor={colors.placeholder}
                value={correo}
                onChangeText={setCorreo}
                keyboardType="email-address" // teclado con @
                autoCapitalize="none"        // los correos no llevan mayúscula inicial
                autoCorrect={false}
                returnKeyType="next"
              />
            </View>
            {errores.correo && <Text style={styles.errorText}>{errores.correo}</Text>}

            {/* Campo: Contraseña (con botón de ojo) */}
            <View
              style={[
                styles.inputContainer,
                errores.password && styles.inputContainerError,
              ]}
            >
              <View style={styles.iconBox}>
                <Ionicons name="lock-closed-outline" size={30} color={colors.iconColor} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor={colors.placeholder}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!verPassword} // oculta el texto si verPassword es false
                autoCapitalize="none"
                returnKeyType="next"
              />
              {/* Alterna la visibilidad de la contraseña */}
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setVerPassword(!verPassword)}
                accessibilityLabel={verPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                <Ionicons
                  name={verPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={26}
                  color={colors.iconColor}
                />
              </TouchableOpacity>
            </View>
            {errores.password && <Text style={styles.errorText}>{errores.password}</Text>}

            {/* Campo: Confirmar contraseña */}
            <View
              style={[
                styles.inputContainer,
                errores.confirmar && styles.inputContainerError,
              ]}
            >
              <View style={styles.iconBox}>
                <Ionicons name="lock-closed-outline" size={30} color={colors.iconColor} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Confirmar Contraseña"
                placeholderTextColor={colors.placeholder}
                value={confirmar}
                onChangeText={setConfirmar}
                secureTextEntry={!verPassword} // usa el mismo estado que la contraseña
                autoCapitalize="none"
                returnKeyType="done"
                onSubmitEditing={handleRegistro} // enviar con la tecla "listo"
              />
            </View>
            {errores.confirmar && <Text style={styles.errorText}>{errores.confirmar}</Text>}

            {/* Botón: Registrarse */}
            <TouchableOpacity
              style={[styles.button, cargando && styles.buttonDisabled]}
              onPress={handleRegistro}
              disabled={cargando} // evita doble envío
              activeOpacity={0.85}
            >
              {cargando ? (
                <ActivityIndicator color={colors.buttonText} />
              ) : (
                <Text style={styles.buttonText}>Registrarse</Text>
              )}
            </TouchableOpacity>
          </View>

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
}
