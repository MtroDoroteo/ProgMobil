// registroStyles.js
// Estilos de la pantalla de registro ("Crear Cuenta").
// Se mantienen separados de la lógica para facilitar cambios de diseño.

import { StyleSheet } from 'react-native';

// ─────────────────────────────────────────────
// 1. PALETA DE COLORES
//    Centralizada aquí: si cambia la marca, solo editas este bloque.
// ─────────────────────────────────────────────
export const colors = {
  primary: '#12265E',       // Azul marino: título, bordes, botón, link
  background: '#FFFFFF',    // Fondo de la pantalla
  iconBox: '#DCE3EE',       // Fondo del recuadro que contiene el ícono
  placeholder: '#6B7280',   // Gris del texto de ayuda
  text: '#12265E',          // Texto que escribe el usuario
  iconColor: '#374151',     // Color de los íconos
  buttonText: '#FFFFFF',    // Texto del botón
  footerText: '#111827',    // Texto "¿Ya tienes cuenta?"
  error: '#B91C1C',         // Mensajes de error
};

// Alturas y radios reutilizados en varios elementos
const INPUT_HEIGHT = 58;
const RADIUS = 30;

export default StyleSheet.create({
  // ─────────────────────────────────────────────
  // 2. CONTENEDORES
  // ─────────────────────────────────────────────

  // SafeAreaView principal: evita que el contenido quede bajo el notch
  safeArea: {
    flex: 1,
  },

  // Contenedor del scroll: el contenido crece para ocupar toda la pantalla
  // (así el link del footer queda abajo aunque no haya scroll)
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },

  // Bloque superior: título + formulario
  formWrapper: {
    paddingTop: 0,
  },

  // ─────────────────────────────────────────────
  // 3. TÍTULO
  // ─────────────────────────────────────────────
  title: {
    fontSize: 38,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 44,
  },

  logo:{
    width:200,
    height:200,
    alignSelf:"center",
    marginTop:100,
  },

  // ─────────────────────────────────────────────
  // 4. CAMPOS DE TEXTO
  // ─────────────────────────────────────────────

  // Fila completa del campo: borde azul + esquinas redondeadas
  inputContainer: {
    flexDirection: 'row',        // ícono a la izquierda, input al centro, ojo a la derecha
    alignItems: 'center',
    height: INPUT_HEIGHT,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: RADIUS,
    backgroundColor: colors.background,
    marginBottom: 16,
    overflow: 'hidden',          // recorta el recuadro del ícono con el radio del borde
  },

  // Variante cuando el campo tiene error (borde rojo)
  inputContainerError: {
    borderColor: colors.error,
  },

  // Recuadro gris-azulado que contiene el ícono
  iconBox: {
    width: 64,
    height: '100%',
    backgroundColor: colors.iconBox,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // El TextInput ocupa todo el espacio restante
  input: {
    flex: 1,
    fontSize: 19,
    color: colors.text,
    paddingHorizontal: 10,
  },

  // Botón del ojo (mostrar/ocultar contraseña)
  eyeButton: {
    paddingHorizontal: 16,
    height: '100%',
    justifyContent: 'center',
  },

  // Texto de error debajo del campo
  errorText: {
    color: colors.error,
    fontSize: 13,
    marginTop: -10,
    marginBottom: 12,
    marginLeft: 6,
  },

  // ─────────────────────────────────────────────
  // 5. BOTÓN "REGISTRARSE"
  // ─────────────────────────────────────────────
  button: {
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },

  // Botón deshabilitado mientras se envía el formulario
  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: colors.buttonText,
    fontSize: 20,
    fontWeight: '600',
  },

  // ─────────────────────────────────────────────
  // 6. FOOTER: "¿Ya tienes cuenta? Inicia sesión aquí"
  // ─────────────────────────────────────────────
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    paddingVertical: 28,
  },

  footerText: {
    fontSize: 17,
    color: colors.footerText,
  },

  footerLink: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.primary,
  },
});
