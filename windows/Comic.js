import React, { useEffect, useRef, useState } from 'react';

import {
  View,
  Text,
  StatusBar,
  FlatList,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import ImagenZoom from '../components/ImagenZoom';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { estilos, colores } from '../Styles/ComicStyles';
import { supabase } from '../supabase/supabase';

export default function Comic() {

  // ESTADOS
  const [imagenes, setImagenes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [paginaActual, setPaginaActual] = useState(0);

  // Indica si la imagen actual está ampliada (bloquea el carrusel)
  const [zoomActivo, setZoomActivo] = useState(false);

  // Tamaño real del área del carrusel (se mide con onLayout)
  const [tamano, setTamano] = useState({ ancho: 0, alto: 0 });

  // Referencia a la lista para moverla con los botones
  const listaRef = useRef(null);

  useEffect(() => {
    cargarComic();
  }, []);

  // CARGAR IMÁGENES DESDE SUPABASE
  const cargarComic = async () => {

    try {

      setCargando(true);

      const { data, error } = await supabase
        .storage
        .from('comics')
        .list('comic1', { limit: 100 });

      if (error) {
        console.log('Error al consultar Storage:', error);
        return;
      }

      if (!data || data.length === 0) {
        setImagenes([]);
        return;
      }

      // Filtrar únicamente imágenes
      const archivos = data.filter(item =>
        /\.(jpg|jpeg|png|webp)$/i.test(item.name)
      );

      // Orden "natural": 2.jpg va antes que 10.jpg
      archivos.sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { numeric: true })
      );

      // Generar URLs públicas
      const paginas = archivos.map(item => {

        const { data: urlData } = supabase
          .storage
          .from('comics')
          .getPublicUrl(`comic1/${item.name}`);

        return {
          id: item.name,
          url: urlData.publicUrl
        };

      });

      setImagenes(paginas);

    } catch (error) {

      console.log('Error inesperado:', error);

    } finally {

      setCargando(false);

    }

  };

  // MEDIR EL ÁREA DEL CARRUSEL
  const alMedir = (e) => {
    const { width, height } = e.nativeEvent.layout;
    setTamano({ ancho: width, alto: height });
  };

  // ACTUALIZAR PÁGINA AL TERMINAR DE DESLIZAR
  const alTerminarDeslizar = (e) => {
    const indice = Math.round(
      e.nativeEvent.contentOffset.x / tamano.ancho
    );
    setPaginaActual(indice);
  };

  // IR A UNA PÁGINA (botones anterior / siguiente)
  const irAPagina = (indice) => {
    if (indice < 0 || indice >= imagenes.length) return;
    listaRef.current?.scrollToIndex({ index: indice, animated: true });
    setPaginaActual(indice);
  };

  // CONTROL DE LOS BOTONES (después de declarar los estados)
  const esPrimera = paginaActual === 0;
  const esUltima = paginaActual === imagenes.length - 1;

  // Los botones se bloquean en los extremos o mientras hay zoom
  const bloquearAnterior = esPrimera || zoomActivo;
  const bloquearSiguiente = esUltima || zoomActivo;

  return (

      <GestureHandlerRootView style={{ flex: 1 }}>

    <SafeAreaView style={estilos.contenedor}>

      <StatusBar
        barStyle="dark-content"
        backgroundColor={colores.fondo}
      />

      {/* TÍTULO */}
      <View style={estilos.encabezado}>
        <Text style={estilos.titulo}>Comic</Text>
      </View>

      {/* BODY */}
      <View style={estilos.body}>

        {cargando ? (

          <ActivityIndicator size="large" color="#000" />

        ) : imagenes.length === 0 ? (

          <Text style={estilos.textoVacio}>
            No se encontraron páginas del cómic.
          </Text>

        ) : (

          <>
            {/* CARRUSEL */}
            <View style={estilos.carrusel} onLayout={alMedir}>

              {tamano.ancho > 0 && (
                <FlatList
                  ref={listaRef}
                  data={imagenes}
                  keyExtractor={(item) => item.id}
                  horizontal
                  pagingEnabled
                  scrollEnabled={!zoomActivo}
                  showsHorizontalScrollIndicator={false}
                  onMomentumScrollEnd={alTerminarDeslizar}
                  getItemLayout={(_, index) => ({
                    length: tamano.ancho,
                    offset: tamano.ancho * index,
                    index
                  })}
                  renderItem={({ item }) => (

                    <ImagenZoom
                      uri={item.url}
                      ancho={tamano.ancho}
                      alto={tamano.alto}
                      alCambiarZoom={setZoomActivo}
                    />

                  )}
                />
              )}

            </View>

            {/* BARRA DE PROGRESO */}
            <View style={estilos.barraFondo}>
              <View
                style={[
                  estilos.barraProgreso,
                  { width: `${((paginaActual + 1) / imagenes.length) * 100}%` }
                ]}
              />
            </View>

            {/* CONTROLES */}
            <View style={estilos.controles}>

              <TouchableOpacity
                style={[
                  estilos.boton,
                  bloquearAnterior && estilos.botonDeshabilitado
                ]}
                onPress={() => irAPagina(paginaActual - 1)}
                disabled={bloquearAnterior}
              >
                <Text style={estilos.textoBoton}>‹</Text>
              </TouchableOpacity>

              <Text style={estilos.indicador}>
                {paginaActual + 1} / {imagenes.length}
              </Text>

              <TouchableOpacity
                style={[
                  estilos.boton,
                  bloquearSiguiente && estilos.botonDeshabilitado
                ]}
                onPress={() => irAPagina(paginaActual + 1)}
                disabled={bloquearSiguiente}
              >
                <Text style={estilos.textoBoton}>›</Text>
              </TouchableOpacity>

            </View>
          </>

        )}

      </View>

    </SafeAreaView>

      </GestureHandlerRootView>


  );

}