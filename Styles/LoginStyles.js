// LoginStyles.js
// Hoja de estilos correspondiente a la pantalla Login.js

import { StyleSheet } from 'react-native';

// Paleta de colores usada en el diseño
const COLORS = {
  azulOscuro: '#122C63', // Color principal (título, botón, enlaces)
  textoGris: '#374151', // Texto de labels
  placeholder: '#9CA3AF', // Color del texto placeholder
  bordeInput: '#122C63', // Borde de los inputs
  fondoIcono: '#DCE3EE', // Fondo del contenedor del icono dentro del input
  blanco: '#FFFFFF',
};

const styles = StyleSheet.create({
  // Contenedor raíz que respeta los márgenes seguros del dispositivo
  safeArea: {
    flex: 1,
  },

  // Utilidad para que el KeyboardAvoidingView ocupe todo el espacio
  flex: {
    flex: 1,
  },

  // Contenido desplazable con padding general
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 100, // Espacio reservado arriba para el logo
    paddingBottom: 40,
  },

  //Estilo del icono logo
  logo:{
    width:150,
    height:150,
    alignSelf:"center",
    marginTop:25,
    marginBottom:25,
  },

  // Título principal "Iniciar Sesión"
  titulo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.azulOscuro,
    textAlign: 'center',
    marginBottom: 8,
  },

  // Subtítulo "Bienvenido, ingresa tus datos"
  subtitulo: {
    fontSize: 16,
    color: COLORS.textoGris,
    textAlign: 'center',
    marginBottom: 32,
  },

  // Etiqueta encima de cada input (Usuario/Correo, Contraseña)
  label: {
    fontSize: 15,
    color: COLORS.textoGris,
    marginBottom: 8,
    marginTop: 8,
  },

  // Contenedor del input (borde redondeado tipo "pill")
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.bordeInput,
    borderRadius: 30,
    backgroundColor: COLORS.blanco,
    marginBottom: 20,
    overflow: 'hidden',
  },

  // Contenedor del icono a la izquierda dentro del input
  iconWrapper: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.fondoIcono,
  },

  // Campo de texto
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    paddingHorizontal: 12,
  },

  // Icono de mostrar/ocultar contraseña (extremo derecho)
  eyeIcon: {
    paddingHorizontal: 16,
  },

  // Contenedor del enlace "¿Olvidaste tu contraseña?"
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 32,
  },

  forgotPasswordText: {
    fontSize: 14,
    color: COLORS.azulOscuro,
    textDecorationLine: 'underline',
    fontWeight: '500',
  },

  // Botón principal "Iniciar Sesión"
  loginButton: {
    backgroundColor: COLORS.azulOscuro,
    borderRadius: 30,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },

  loginButtonText: {
    color: COLORS.blanco,
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Contenedor del texto "¿No tienes una cuenta? Regístrate"
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  registerText: {
    fontSize: 14,
    color: COLORS.textoGris,
  },

  registerLink: {
    fontSize: 14,
    color: COLORS.azulOscuro,
    fontWeight: 'bold',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    paddingVertical: 28,
  },

  footerText: {
    fontSize: 17,
    color: '#111827',
  },

  footerLink: {
    fontSize: 17,
    fontWeight: '700',
    color: '#12265E',
  },
});

export default styles;
