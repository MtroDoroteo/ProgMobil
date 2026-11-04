import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/connect';

import Login from './windows/LoginScreen';
import Registro from './windows/RegistroScreen';
import Recuperar from './windows/RecuperarContra';
import Home from './windows/Home';
import Perfil from './windows/Perfil';
import Entrenamientos from './windows/Entrenamientos';

import { estilosApp, opcionesMenuInferior } from './Styles/AppStyles'; 
import { colores } from './Styles/HomeStyles';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// =========================================================================
// NAVEGADOR DE PESTAÑAS (Solo para usuarios autenticados)
// =========================================================================
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        ...opcionesMenuInferior,
        tabBarIcon: ({ color, size }) => {
          // 1. Definimos un ícono de interrogación por si la ruta no coincide
          let iconName = 'help-circle'; 

          // 2. Validamos las rutas exactamente como están en los Tab.Screen
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Entrenamientos') {
            iconName = 'dumbbell';
          } else if (route.name === 'Perfil') {
            iconName = 'account-cog-outline';
          }
          // 3. Usamos la variable 'size' de React Navigation para evitar conflictos
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Entrenamientos" component={Entrenamientos} />
      <Tab.Screen name="Perfil" component={Perfil} />
    </Tab.Navigator>
  );
}

// =========================================================================
// NAVEGADOR PRINCIPAL (Manejo de Sesión)
// =========================================================================
export default function App() {
  const [usuario, setUsuario] = useState(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
    });

    return unsubscribe;
  }, []);

  // Esperar a que Firebase compruebe la sesión
  if (usuario === undefined) {
    return (
      <View style={estilosApp.cargandoContenedor}>
        <ActivityIndicator size="large" color={colores.naranja} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {usuario ? (
          /* --- FLUJO DE USUARIO LOGUEADO --- */
          <Stack.Screen name="Main" component={MainTabs} />
        ) : (
          /* --- FLUJO DE AUTENTICACIÓN --- */
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Registro" component={Registro} />
            <Stack.Screen name="Recuperar" component={Recuperar} />
            <Stack.Screen name="Entrenamientos" component={Entrenamientos} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}