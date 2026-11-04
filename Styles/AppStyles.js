import { StyleSheet, Platform } from 'react-native';
import { colores } from './HomeStyles'; // Ajusta la ruta si HomeStyles está en otra carpeta

export const estilosApp = StyleSheet.create({
  cargandoContenedor: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colores.fondo,
  },
});

export const opcionesMenuInferior = {
  headerShown: false,
  tabBarActiveTintColor: colores.naranja,
  tabBarInactiveTintColor: colores.texto,
  tabBarStyle: {
    backgroundColor: colores.blanco,
    borderTopWidth: 1,
    borderTopColor: colores.pista,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    height: Platform.OS === 'ios' ? 85 : 65,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 10,
  },
  tabBarLabelStyle: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
};