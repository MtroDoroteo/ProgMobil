import React, { useEffect, useState } from 'react';

import {
  View,
  ActivityIndicator,
  TouchableOpacity,
  Image
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/connect';

import Login from './windows/LoginScreen';
import Registro from './windows/RegistroScreen';
import Recuperar from './windows/RecuperarContra';
import SpotifyScreen from './windows/Spoty';
import Home from './windows/Home';
import Perfil from './windows/Perfil';
import Entrenamientos from './windows/Entrenamientos';
import Menu from './windows/Menu';
import Comic from './windows/Comic';

import { estilosApp, opcionesMenuInferior } from './Styles/AppStyles';
import { colores } from './Styles/HomeStyles';

import { StatusBar } from 'expo-status-bar';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// =====================================================
// NAVEGADOR DE PESTAÑAS
// =====================================================

function MainTabs() {

  const [menuVisible, setMenuVisible] = useState(false);
  const [pantallaActiva, setPantallaActiva] = useState('Home');

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          ...opcionesMenuInferior,

          // Encabezado superior
          headerShown: true,

          headerStyle: {
            backgroundColor: colores.blanco,
          },

          headerTintColor: colores.texto,

          headerTitleStyle: {
            fontWeight: 'bold',
          },

          headerShadowVisible: false,

          headerTitle: route.name,

          // Botón hamburguesa
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => setMenuVisible(true)}
              style={{ marginLeft: 15, padding: 5 }}
            >
              <MaterialCommunityIcons
                name="menu"
                size={28}
                color={colores.texto}
              />
            </TouchableOpacity>
          ),

          // Iconos del menú inferior
          tabBarIcon: ({ color, size }) => {

            let iconName = 'help-circle';

            if (route.name === 'Home') {
              iconName = 'https://uewftnxhdybtgadpkuvb.supabase.co/storage/v1/object/public/assest/icons/10751558.png';
            } else if (route.name === 'Entrenamientos') {
              iconName = 'https://uewftnxhdybtgadpkuvb.supabase.co/storage/v1/object/public/assest/icons/2780119.png';
            } else if (route.name === 'Perfil') {
              iconName = 'https://cdn-icons-png.flaticon.com/512/5987/5987424.png';
            } else if (route.name === 'Spoty'){
              iconName = 'https://uewftnxhdybtgadpkuvb.supabase.co/storage/v1/object/public/assest/icons/Spotify_icon.svg.webp';
            }

            return (
              <Image
              source = {{
                uri:iconName
              }}
              style={{
                width:32,
                height:32
              }}
              resizeMode='cover'
              />
            );
          },
        })}
      >

        <Tab.Screen
          name="Home"
          component={Home}
          listeners={{
            focus: () => setPantallaActiva('Home'),
          }}
        />

        <Tab.Screen
          name="Entrenamientos"
          component={Entrenamientos}
          listeners={{
            focus: () => setPantallaActiva('Entrenamientos'),
          }}
        />

        <Tab.Screen
          name="Spoty"
          component={SpotifyScreen}
          listeners={{
            focus: () => setPantallaActiva('Spoty'),
          }}
        />

        <Tab.Screen
          name="Comic"
          component={Comic}
          listeners={{
            focus: () => setPantallaActiva('Comic'),
          }}
        />

        <Tab.Screen
          name="Perfil"
          component={Perfil}
          listeners={{
            focus: () => setPantallaActiva('Perfil'),
          }}
        />

      </Tab.Navigator>

      {/* MENÚ GLOBAL */}
      <Menu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onNavigate={(pantalla) => {
          setMenuVisible(false);
          setPantallaActiva(pantalla);
          // La navegación se realiza desde el componente Menu
        }}
        navigationRef={null}
        pantallaActiva={pantallaActiva}
      />

    </>
  );
}

// =====================================================
// NAVEGADOR PRINCIPAL Y FIREBASE
// =====================================================

export default function App() {

  const [usuario, setUsuario] = useState(undefined);

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
    });

    return unsubscribe;

  }, []);

  // Esperar comprobación de Firebase
  if (usuario === undefined) {

    return (
      <View style={estilosApp.cargandoContenedor}>
        <ActivityIndicator
          size="large"
          color={colores.naranja}
        />
        <StatusBar hidden={true} />
      </View>
    );
  }

  return (
    <NavigationContainer>

      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >

        {usuario ? (

          <Stack.Screen
            name="Main"
            component={MainTabs}
          />

        ) : (

          <>
            <Stack.Screen
              name="Login"
              component={Login}
            />

            <Stack.Screen
              name="Registro"
              component={Registro}
            />

            <Stack.Screen
              name="Recuperar"
              component={Recuperar}
            />

            <Stack.Screen
              name="Comic"
              component={Comic}
            />
          </>

        )}

      </Stack.Navigator>

    </NavigationContainer>
  );
}
