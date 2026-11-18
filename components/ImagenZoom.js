import React, { useState } from 'react';

import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS
} from 'react-native-reanimated';

const ESCALA_MAXIMA = 4;   // zoom máximo con pellizco
const ESCALA_DOBLE_TOQUE = 2; // zoom al hacer doble toque

export default function ImagenZoom({ uri, ancho, alto, alCambiarZoom }) {

  // ESTADO JS: indica si la imagen está ampliada
  const [ampliada, setAmpliada] = useState(false);

  // VALORES COMPARTIDOS (se animan en el hilo de UI)
  const escala = useSharedValue(1);
  const escalaGuardada = useSharedValue(1);
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const xGuardada = useSharedValue(0);
  const yGuardada = useSharedValue(0);

  // AVISAR AL PADRE (para bloquear/desbloquear el carrusel)
  const avisarZoom = (activo) => {
    setAmpliada(activo);
    if (alCambiarZoom) alCambiarZoom(activo);
  };

  // LIMITAR UN VALOR ENTRE -máximo y +máximo
  const limitar = (valor, maximo) => {
    'worklet';
    return Math.min(Math.max(valor, -maximo), maximo);
  };

  // VOLVER AL TAMAÑO ORIGINAL
  const reiniciar = () => {
    'worklet';
    escala.value = withTiming(1);
    x.value = withTiming(0);
    y.value = withTiming(0);
    escalaGuardada.value = 1;
    xGuardada.value = 0;
    yGuardada.value = 0;
    runOnJS(avisarZoom)(false);
  };

  // GESTO: PELLIZCO (zoom)
  const pellizco = Gesture.Pinch()
    .onStart(() => {
      // bloquea el carrusel mientras se hace zoom
      runOnJS(avisarZoom)(true);
    })
    .onUpdate((e) => {
      escala.value = Math.min(
        Math.max(escalaGuardada.value * e.scale, 1),
        ESCALA_MAXIMA
      );
    })
    .onEnd(() => {
      // si queda en tamaño original, se reinicia todo
      if (escala.value <= 1) {
        reiniciar();
        return;
      }

      escalaGuardada.value = escala.value;

      // evita que la imagen quede fuera de los bordes
      const maxX = (ancho * escala.value - ancho) / 2;
      const maxY = (alto * escala.value - alto) / 2;
      const nuevoX = limitar(x.value, maxX);
      const nuevoY = limitar(y.value, maxY);

      x.value = withTiming(nuevoX);
      y.value = withTiming(nuevoY);
      xGuardada.value = nuevoX;
      yGuardada.value = nuevoY;
    });

  // GESTO: ARRASTRE (solo activo cuando la imagen está ampliada)
  const arrastre = Gesture.Pan()
    .enabled(ampliada)
    .onUpdate((e) => {
      const maxX = (ancho * escala.value - ancho) / 2;
      const maxY = (alto * escala.value - alto) / 2;

      x.value = limitar(xGuardada.value + e.translationX, maxX);
      y.value = limitar(yGuardada.value + e.translationY, maxY);
    })
    .onEnd(() => {
      xGuardada.value = x.value;
      yGuardada.value = y.value;
    });

  // GESTO: DOBLE TOQUE (acercar / volver al original)
  const dobleToque = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd((_e, exito) => {
      if (!exito) return;

      if (escala.value > 1) {
        reiniciar();
      } else {
        escala.value = withTiming(ESCALA_DOBLE_TOQUE);
        escalaGuardada.value = ESCALA_DOBLE_TOQUE;
        runOnJS(avisarZoom)(true);
      }
    });

  // TODOS LOS GESTOS A LA VEZ
  const gestos = Gesture.Simultaneous(pellizco, arrastre, dobleToque);

  // ESTILO ANIMADO DE LA IMAGEN
  const estiloAnimado = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value },
      { translateY: y.value },
      { scale: escala.value }
    ]
  }));

  return (

    <GestureDetector gesture={gestos}>

      <Animated.View
        style={[{
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          width: ancho,
          height: alto
        }]}
      >
        <Animated.Image
          source={{ uri }}
          style={[{
            width: '100%',
            height: '100%'
            }, estiloAnimado]}
          resizeMode="contain"
          onError={(error) =>
            console.log('Error al mostrar imagen:', uri, error.nativeEvent)
          }
        />
      </Animated.View>

    </GestureDetector>

  );

}