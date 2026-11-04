// ============================================================
// PerfilStyles.js
// Estilos de la pantalla Perfil.
// Se mantienen separados de la lógica (Perfil.js).
// ============================================================
import { StyleSheet, Platform } from 'react-native';

// ------------------------------------------------------------
// 1. COLORES
// Todos los colores de la pantalla en un solo lugar para poder
// cambiarlos fácilmente (o unirlos con los de HomeStyles).
// ------------------------------------------------------------
export const colores = {
  fondo: '#F3F5FA',            // fondo general de la pantalla
  blanco: '#FFFFFF',
  textoPrincipal: '#1C1C2E',   // títulos y números
  textoSecundario: '#7B8394',  // @usuario, etiquetas, fechas
  borde: '#D9DEE8',            // borde del avatar y divisores
  azul: '#2F6DB5',             // botón "Editar Perfil"
  azulRachaFondo: '#D4ECFB',   // tarjeta de racha
  azulRachaTexto: '#2F7AE0',   // texto "¡68 días!"
  duraznoFondo: '#FEEFD9',     // tarjeta de marca personal
  marino: '#14285F',           // barras con actividad
  grisBarra: '#E7E9EF',        // barras sin actividad
  fondoOscuro: '#2A2A45',      // contenedor de entrenamientos recientes
  verde: '#34C759',            // insignia de verificado
};

// ------------------------------------------------------------
// 2. MEDIDAS
// Tamaños que se reutilizan en varios lugares.
// ------------------------------------------------------------
export const medidas = {
  paddingPantalla: 16,  // margen lateral de toda la pantalla
  radioTarjeta: 20,     // esquinas redondeadas de las tarjetas
  tamanoAvatar: 80,     // diámetro de la foto de perfil
  anchoBarra: 30,       // ancho de cada barra semanal
  alturaBarra: 72,      // altura máxima de las barras semanales
};

// Sombra suave y reutilizable (iOS usa shadow*, Android usa elevation)
const sombraSuave = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  android: {
    elevation: 2,
  },
});

// ------------------------------------------------------------
// 3. ESTILOS
// ------------------------------------------------------------
export const estilos = StyleSheet.create({
  // ---------- Contenedor principal ----------
  contenedor: {
    flex: 1,
    backgroundColor: colores.fondo,
  },

  // Contenido interno del ScrollView
  scrollContenido: {
    paddingHorizontal: medidas.paddingPantalla,
    paddingBottom: 32,
  },

  // ---------- Encabezado fijo (título + ajustes) ----------
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: medidas.paddingPantalla,
    paddingVertical: 12,
  },
  // Espacio vacío a la izquierda para que el título quede centrado
  encabezadoEspacio: {
    width: 32,
  },
  encabezadoTitulo: {
    fontSize: 20,
    fontWeight: '700',
    color: colores.textoPrincipal,
  },
  botonAjustes: {
    width: 32,
    alignItems: 'flex-end',
  },
  iconoAjustes: {
    fontSize: 22,
  },

  // ---------- Bloque de perfil (avatar + nombre + botón) ----------
  perfilFila: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  avatarContenedor: {
    width: medidas.tamanoAvatar,
    height: medidas.tamanoAvatar,
    marginRight: 16,
  },
  avatar: {
    width: medidas.tamanoAvatar,
    height: medidas.tamanoAvatar,
    borderRadius: medidas.tamanoAvatar / 2,
    borderWidth: 3,
    borderColor: colores.borde,
  },
  // Se muestra cuando el usuario aún no tiene foto
  avatarPlaceholder: {
    backgroundColor: colores.blanco,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInicial: {
    fontSize: 32,
    fontWeight: '700',
    color: colores.azul,
  },
  // Circulito verde con palomita (esquina superior derecha del avatar)
  insignia: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colores.verde,
    borderWidth: 2,
    borderColor: colores.blanco,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insigniaTexto: {
    color: colores.blanco,
    fontSize: 12,
    fontWeight: '800',
  },
  perfilInfo: {
    flex: 1,
    alignItems: 'flex-start',
  },
  nombre: {
    fontSize: 22,
    fontWeight: '700',
    color: colores.textoPrincipal,
  },
  usuario: {
    fontSize: 15,
    color: colores.textoSecundario,
    marginTop: 2,
  },
  botonEditar: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colores.azul,
    backgroundColor: colores.blanco,
  },
  botonEditarTexto: {
    fontSize: 15,
    fontWeight: '600',
    color: colores.azul,
  },

  // ---------- Fila de estadísticas sociales ----------
  redesFila: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  redItem: {
    flex: 1,
    alignItems: 'center',
  },
  redValor: {
    fontSize: 20,
    fontWeight: '700',
    color: colores.textoPrincipal,
  },
  redEtiqueta: {
    fontSize: 14,
    color: colores.textoSecundario,
    marginTop: 2,
  },
  // Línea vertical entre estadísticas
  redDivisor: {
    width: 1,
    height: 36,
    backgroundColor: colores.borde,
  },

  // ---------- Tarjetas: Racha y Marca personal ----------
  tarjetasFila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  tarjetaRacha: {
    flex: 1,
    marginRight: 8,
    padding: 14,
    borderRadius: medidas.radioTarjeta,
    backgroundColor: colores.azulRachaFondo,
  },
  tarjetaMarca: {
    flex: 1,
    marginLeft: 8,
    padding: 14,
    borderRadius: medidas.radioTarjeta,
    backgroundColor: colores.duraznoFondo,
  },
  tarjetaTitulo: {
    fontSize: 14,
    color: colores.textoPrincipal,
  },
  tarjetaValorFila: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  tarjetaEmoji: {
    fontSize: 22,
    marginRight: 6,
  },
  tarjetaValorRacha: {
    fontSize: 22,
    fontWeight: '800',
    color: colores.azulRachaTexto,
  },
  tarjetaValorMarca: {
    fontSize: 20,
    fontWeight: '800',
    color: colores.textoPrincipal,
  },
  tarjetaSubtitulo: {
    fontSize: 14,
    color: colores.textoPrincipal,
  },

  // ---------- Estadísticas semanales ----------
  semanaTarjeta: {
    marginTop: 20,
    padding: 16,
    borderRadius: medidas.radioTarjeta,
    backgroundColor: colores.blanco,
    ...sombraSuave,
  },
  semanaTitulo: {
    fontSize: 17,
    fontWeight: '700',
    color: colores.textoPrincipal,
  },
  semanaResumenFila: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  semanaResumen: {
    fontSize: 15,
    color: colores.textoPrincipal,
  },
  semanaSeparador: {
    width: 1,
    height: 16,
    backgroundColor: colores.borde,
    marginHorizontal: 12,
  },
  // Fila con las 7 barras (una por día)
  barrasFila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 16,
  },
  barraColumna: {
    alignItems: 'center',
  },
  barra: {
    width: medidas.anchoBarra,
    borderRadius: 8,
  },
  barraLlena: {
    backgroundColor: colores.marino,
  },
  barraVacia: {
    backgroundColor: colores.grisBarra,
  },
  barraDia: {
    marginTop: 8,
    fontSize: 14,
    color: colores.textoPrincipal,
  },

  // ---------- Entrenamientos recientes ----------
  entrenosContenedor: {
    marginTop: 20,
    padding: 14,
    borderRadius: medidas.radioTarjeta + 4,
    backgroundColor: colores.fondoOscuro,
  },
  entrenosTitulo: {
    fontSize: 18,
    fontWeight: '700',
    color: colores.blanco,
    marginBottom: 12,
  },
  entrenoTarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
    borderRadius: 16,
    backgroundColor: colores.blanco,
  },
  entrenoNumero: {
    fontSize: 16,
    fontWeight: '700',
    color: colores.textoPrincipal,
    marginRight: 12,
  },
  entrenoInfo: {
    flex: 1,
  },
  entrenoTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: colores.textoPrincipal,
  },
  // Fecha dentro del título, con menos peso visual
  entrenoFecha: {
    fontSize: 14,
    fontWeight: '400',
    color: colores.textoSecundario,
  },
  entrenoDetalle: {
    fontSize: 13,
    color: colores.textoSecundario,
    marginTop: 4,
  },
  entrenoFlecha: {
    fontSize: 26,
    color: colores.textoPrincipal,
    marginLeft: 8,
  },

  centrado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colores.fondo,
  },
  errorTexto: {
    textAlign: 'center',
    paddingHorizontal: 24,
  },

});