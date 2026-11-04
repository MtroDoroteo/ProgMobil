
export const colores = {
  fondo: '#F6F7F9',
  blanco: '#FFFFFF',
  texto: '#111114',
  textoSuave: '#8E8E93',
  naranja: '#122C63',
  coral: '#124363',
  duraznoClaro: '#cbecfd',
  duraznoSuave: '#FFF4E5',
  bordeDestacado: '#6bb1f2',
  oscuro: '#2f2f49',
  pista: '#E6E8EC',
  error: '#D64545',
};

export const menuStyles = {
  overlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },

  menu: {
    width: '78%',
    maxWidth: 330,
    height: '100%',
    backgroundColor: colores.fondo,
    paddingTop: 55,
    paddingHorizontal: 22,
  },

  encabezado: {
    backgroundColor: colores.naranja,
    borderRadius: 18,
    padding: 20,
    marginBottom: 28,
  },

  titulo: {
    color: colores.blanco,
    fontSize: 22,
    fontWeight: 'bold',
  },

  subtitulo: {
    color: '#DCEBFF',
    fontSize: 13,
    marginTop: 6,
  },

  seccion: {
    color: colores.textoSuave,
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 8,
    letterSpacing: 1,
  },

  opcion: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 5,
  },

  opcionActiva: {
    backgroundColor: colores.duraznoClaro,
  },

  textoOpcion: {
    color: colores.texto,
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 14,
  },

  textoActivo: {
    color: colores.naranja,
    fontWeight: 'bold',
  },

  separador: {
    height: 1,
    backgroundColor: colores.pista,
    marginVertical: 18,
  },

  cerrar: {
    marginTop: 'auto',
    marginBottom: 35,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },

  textoCerrar: {
    color: colores.error,
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 12,
  },
};
