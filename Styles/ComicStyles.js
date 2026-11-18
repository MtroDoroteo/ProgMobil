// ComicStyles.js
// Estilos de la pantalla Comic (colores, medidas y estilos)

import { StyleSheet } from 'react-native';

// ---------- COLORES ----------
export const colores = {
  fondo: '#FFFFFF',
  texto: '#111111',
  borde: '#E5E5E5',
};

// ---------- MEDIDAS ----------
export const medidas = {
  paddingHorizontal: 20,
  tamanoTitulo: 20,
};

// ---------- ESTILOS ----------
export const estilos = StyleSheet.create({
  // Contenedor principal de toda la pantalla
  contenedor: {
    flex: 1,
    backgroundColor: colores.fondo,
  },

  // Zona del título (arriba)
  encabezado: {
    paddingHorizontal: medidas.paddingHorizontal,
    paddingVertical: 0,
    borderBottomWidth: 1,
    borderBottomColor: colores.borde,
  },

  // Texto "Comic"
  titulo: {
    fontSize: medidas.tamanoTitulo,
    fontWeight: 'bold',
    color: colores.texto,
  },

  // Espacio donde irá el contenido (ocupa todo lo que queda de pantalla)
  body: {
    flex: 1,
    paddingHorizontal: medidas.paddingHorizontal,
    paddingVertical: 0,
  },

    // CARRUSEL
  carrusel: {
    flex: 1
  },

  pagina: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },

  imagenPagina: {
    width: '100%',
    height: '100%'
  },

  // BARRA DE PROGRESO
  barraFondo: {
    height: 4,
    backgroundColor: '#DDD',
    marginHorizontal: 20,
    borderRadius: 2,
    overflow: 'hidden'
  },

  barraProgreso: {
    height: '100%',
    backgroundColor: '#000'
  },

  // CONTROLES
  controles: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12
  },

  boton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EEE',
    alignItems: 'center',
    justifyContent: 'center'
  },

  botonDeshabilitado: {
    opacity: 0.3
  },

  textoBoton: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000'
  },

  indicador: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000'
  },

  textoVacio: {
    textAlign: 'center',
    marginTop: 20
  },
});