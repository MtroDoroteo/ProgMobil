/**
 * HomeStyles.js
 * -----------------------------------------------------------------------------
 * Estilos de la pantalla Home. Se mantienen separados de Home.js para que la
 * lógica (Firebase, estado, navegación) no se mezcle con la presentación.
 * También incluye los estilos del menú inferior (BottomMenu.js).
 *
 * Exporta:
 *  - colores : paleta de la app (cámbiala aquí y se actualiza toda la pantalla)
 *  - medidas : constantes de layout que Home.js también necesita para cálculos
 *              (por ejemplo, el ancho de las tarjetas del carrusel)
 *  - estilos : StyleSheet con todos los estilos de la pantalla y del menú inferior
 * -----------------------------------------------------------------------------
 */
import { StyleSheet, Platform } from 'react-native';

// ---------------------------------------------------------------------------
// PALETA DE COLORES
// ---------------------------------------------------------------------------
export const colores = {
  fondo: '#F6F7F9',
  blanco: '#FFFFFF',
  texto: '#111114',
  textoSuave: '#8E8E93',
  naranja: '#122C63', // inicio del degradado
  coral: '#124363', // final del degradado
  duraznoClaro: '#cbecfd', // fondo de la "píldora" de racha
  duraznoSuave: '#FFF4E5', // fondo de la tarjeta destacada (PR)
  bordeDestacado: '#6bb1f2',
  oscuro: '#2f2f49', // fondo de la tarjeta de entrenamiento
  pista: '#E6E8EC', // parte "vacía" del anillo, puntos inactivos y borde del menú
  error: '#D64545',
};

// ---------------------------------------------------------------------------
// MEDIDAS COMPARTIDAS CON Home.js
// ---------------------------------------------------------------------------
export const medidas = {
  margenHorizontal: 24,
  separacionTarjetas: 12,
  anchoTarjetaResumen: 240,
  tamanoAnillo: 96,
  grosorAnillo: 10,
};

// Sombra suave reutilizable para las tarjetas blancas
const sombraTarjeta = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 8,
  elevation: 2,
};

export const estilos = StyleSheet.create({
  // -------------------------------------------------------------------------
  // CONTENEDORES GENERALES
  // -------------------------------------------------------------------------
  pantalla: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  contenido: {
    paddingTop: 12,
    paddingBottom: 40, // espacio extra para que la barra de pestañas no tape el final
  },
  centrado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  textoError: {
    fontSize: 16,
    color: colores.error,
    textAlign: 'center',
    marginBottom: 16,
  },
  botonReintentar: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: colores.naranja,
  },
  textoBotonReintentar: {
    color: colores.blanco,
    fontWeight: '700',
    fontSize: 15,
  },

  // -------------------------------------------------------------------------
  // ENCABEZADO (avatar + saludo + racha + notificaciones)
  // -------------------------------------------------------------------------
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: medidas.margenHorizontal,
    marginBottom: 24,
  },
  encabezadoIzquierda: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarAnillo: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: colores.naranja,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  // Círculo interior: aquí se colocará la foto de perfil más adelante
  avatarInterior: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colores.pista,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarInicial: {
    fontSize: 24,
    fontWeight: '700',
    color: colores.textoSuave,
  },
  saludoContenedor: {
    flex: 1,
    alignItems: 'flex-start',
  },
  saludo: {
    fontSize: 26,
    fontWeight: '800',
    color: colores.texto,
    marginBottom: 6,
  },
  rachaPildora: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: colores.duraznoClaro,
  },
  rachaTexto: {
    fontSize: 15,
    fontWeight: '600',
    color: colores.texto,
  },
  botonNotificaciones: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Espacio reservado para el ícono de campana
  iconoCampana: {
    width: 28,
    height: 28,
  },
  puntoNotificacion: {
    position: 'absolute',
    top: 8,
    right: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colores.coral,
  },

  // -------------------------------------------------------------------------
  // TÍTULOS DE SECCIÓN
  // -------------------------------------------------------------------------
  tituloSeccion: {
    fontSize: 18,
    fontWeight: '700',
    color: colores.texto,
    paddingHorizontal: medidas.margenHorizontal,
    marginBottom: 12,
  },
  seccion: {
    marginBottom: 28,
  },

  // Contenido de los carruseles horizontales (deja el margen lateral)
  carruselContenido: {
    paddingHorizontal: medidas.margenHorizontal,
  },

  // -------------------------------------------------------------------------
  // ENTRENAMIENTO DEL DÍA
  // -------------------------------------------------------------------------
  tarjetaEntreno: {
    backgroundColor: colores.oscuro,
    borderRadius: 22,
    padding: 24,
    marginRight: medidas.separacionTarjetas,
  },
  entrenoTitulo: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '800',
    color: colores.blanco,
    marginBottom: 20,
  },
  entrenoEstadisticas: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  estadistica: {
    flex: 1,
    alignItems: 'center',
  },
  // Espacio reservado para el ícono de cada estadística (cronómetro, pesa, barras)
  iconoEstadistica: {
    width: 28,
    height: 28,
    marginBottom: 6,
  },
  estadisticaValor: {
    fontSize: 20,
    fontWeight: '800',
    color: colores.blanco,
  },
  estadisticaEtiqueta: {
    fontSize: 13,
    color: '#C7C7CC',
    marginTop: 2,
  },
  entrenoDescansoTexto: {
    fontSize: 15,
    lineHeight: 21,
    color: '#C7C7CC',
  },

  // Botón con degradado (el degradado se dibuja con react-native-svg)
  botonDegradado: {
    height: 52,
    borderRadius: 14,
    overflow: 'hidden', // recorta el degradado con el borde redondeado
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoBotonDegradado: {
    fontSize: 17,
    fontWeight: '700',
    color: colores.blanco,
  },

  // -------------------------------------------------------------------------
  // RESUMEN DE PROGRESO SEMANAL
  // -------------------------------------------------------------------------
  tarjetaResumen: {
    width: medidas.anchoTarjetaResumen,
    minHeight: 190,
    backgroundColor: colores.blanco,
    borderRadius: 18,
    padding: 16,
    marginRight: medidas.separacionTarjetas,
    alignItems: 'center',
    justifyContent: 'center',
    ...sombraTarjeta,
  },
  tarjetaResumenDestacada: {
    backgroundColor: colores.duraznoSuave,
    borderWidth: 2,
    borderColor: colores.bordeDestacado,
  },
  tarjetaResumenTitulo: {
    fontSize: 17,
    color: colores.texto,
    textAlign: 'center',
    marginBottom: 10,
  },
  // Espacio reservado para el ícono de la tarjeta destacada (pesa)
  iconoResumen: {
    width: 28,
    height: 28,
    marginBottom: 8,
  },
  resumenValor: {
    fontSize: 22,
    fontWeight: '800',
    color: colores.texto,
    marginTop: 6,
  },

  // Anillo de progreso (días entrenados)
  anilloContenedor: {
    width: medidas.tamanoAnillo,
    height: medidas.tamanoAnillo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  anilloTextoContenedor: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  anilloTextoActual: {
    fontSize: 20,
    fontWeight: '800',
    color: colores.texto,
  },
  anilloTextoMeta: {
    fontSize: 20,
    fontWeight: '500',
    color: colores.textoSuave,
  },

  // Indicador de página (puntos) del carrusel de resumen
  puntos: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },
  punto: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colores.pista,
    marginHorizontal: 3,
  },
  puntoActivo: {
    width: 22,
    backgroundColor: colores.naranja,
  },

  // -------------------------------------------------------------------------
  // ACCESOS RÁPIDOS
  // -------------------------------------------------------------------------
  accesoRapido: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colores.blanco,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginRight: medidas.separacionTarjetas,
    ...sombraTarjeta,
  },
  // Espacio reservado para el ícono del acceso rápido
  iconoAcceso: {
    width: 26,
    height: 26,
    marginRight: 10,
  },
  accesoRapidoTexto: {
    fontSize: 15,
    fontWeight: '700',
    color: colores.texto,
  },

  // -------------------------------------------------------------------------
  // SIGUIENTE RETO
  // -------------------------------------------------------------------------
  tarjetaReto: {
    marginHorizontal: medidas.margenHorizontal,
    backgroundColor: colores.blanco,
    borderRadius: 18,
    padding: 18,
    ...sombraTarjeta,
  },
  retoEncabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  // Espacio reservado para el ícono del reto (barra de dominadas)
  iconoReto: {
    width: 32,
    height: 32,
    marginRight: 12,
  },
  retoTitulo: {
    flex: 1,
    fontSize: 19,
    fontWeight: '800',
    color: colores.texto,
  },
  retoMensaje: {
    fontSize: 15,
    lineHeight: 21,
    color: colores.texto,
  },

  // -------------------------------------------------------------------------
  // MENÚ INFERIOR (usado por BottomMenu.js)
  // -------------------------------------------------------------------------
  // Contenedor general: fila fija en la parte de abajo
  menuContenedor: {
    flexDirection: 'row',
    backgroundColor: colores.blanco,
    borderTopWidth: 1,
    borderTopColor: colores.pista,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 24 : 10, // espacio extra por la barra del iPhone
    // Sombra suave hacia arriba
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 10,
  },
  // Cada pestaña ocupa el mismo ancho
  menuPestana: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Línea naranja superior de la pestaña activa
  menuIndicadorActivo: {
    position: 'absolute',
    top: -10,
    width: '55%',
    height: 3,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    backgroundColor: colores.naranja,
  },
  // Texto de cada pestaña
  menuEtiqueta: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '500',
    color: colores.texto,
  },
  // Texto de la pestaña activa
  menuEtiquetaActiva: {
    color: colores.naranja,
    fontWeight: '700',
  },
});