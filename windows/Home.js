import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore';

// IMPORTANTE: ajusta esta ruta a donde exportas `auth` y `db` en tu proyecto.
import { auth, db } from '../firebase/connect';
import { colores, estilos, medidas } from '../Styles/HomeStyles';

// ---------------------------------------------------------------------------
// NOMBRES DE RUTAS DE NAVEGACIÓN
// Centralizados aquí: si cambias el nombre de una pantalla, solo se edita esto.
// ---------------------------------------------------------------------------
const RUTAS = {
  // NUEVO: rutas de las pestañas del menú inferior (deben coincidir con tu navegador)
  home: 'Home',
  rutinas: 'Rutinas',
  progreso: 'Progreso',
  perfil: 'Perfil',

  notificaciones: 'Notificaciones',
  rutina: 'Rutina', // pantalla que ejecuta el entrenamiento
  explorarRutinas: 'ExplorarRutinas',
  registrarMedidas: 'RegistroMedidas',
  historial: 'Historial',
};

// Accesos rápidos (se pueden agregar o quitar sin tocar el JSX)
const ACCESOS_RAPIDOS = [
  { id: 'explorar', etiqueta: 'Explorar\nRutinas', ruta: RUTAS.explorarRutinas },
  { id: 'medidas', etiqueta: 'Registrar\nMedidas / Peso', ruta: RUTAS.registrarMedidas },
  { id: 'historial', etiqueta: 'Historial', ruta: RUTAS.historial },
];

// ---------------------------------------------------------------------------
// FUNCIONES AUXILIARES
// ---------------------------------------------------------------------------

/** Devuelve solo el primer nombre: "Doroteo Pérez" -> "Doroteo" */
const primerNombre = (nombreCompleto) =>
  (nombreCompleto || '').trim().split(' ')[0];

/** Texto de la racha con singular/plural y mensaje cuando es 0 */
const textoRacha = (dias) => {
  if (!dias) return '¡Empieza tu racha hoy!';
  return dias === 1 ? '1 día seguido' : `${dias} días seguidos`;
};

// ---------------------------------------------------------------------------
// COMPONENTES PEQUEÑOS (solo se usan en esta pantalla)
// ---------------------------------------------------------------------------

/**
 * Botón con fondo degradado naranja -> coral.
 * El degradado se dibuja con react-native-svg para no depender de otra librería.
 * `idGradiente` debe ser único por botón.
 */
function BotonDegradado({ texto, onPress, idGradiente }) {
  return (
    <TouchableOpacity
      style={estilos.botonDegradado}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Svg height="100%" width="100%" style={{ position: 'absolute' }}>
        <Defs>
          <LinearGradient id={idGradiente} x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor={colores.naranja} />
            <Stop offset="1" stopColor={colores.coral} />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill={`url(#${idGradiente})`} />
      </Svg>
      <Text style={estilos.textoBotonDegradado}>{texto}</Text>
    </TouchableOpacity>
  );
}

/**
 * Anillo de progreso circular.
 *  - actual: valor alcanzado (ej. 3)
 *  - meta:   valor objetivo (ej. 5)
 */
function AnilloProgreso({ actual, meta }) {
  const { tamanoAnillo: tamano, grosorAnillo: grosor } = medidas;
  const radio = (tamano - grosor) / 2;
  const circunferencia = 2 * Math.PI * radio;

  // Proporción entre 0 y 1 (nunca pasa de 1 aunque entrenen más días que la meta)
  const proporcion = meta > 0 ? Math.min(actual / meta, 1) : 0;
  const desplazamiento = circunferencia * (1 - proporcion);

  return (
    <View style={estilos.anilloContenedor}>
      <Svg width={tamano} height={tamano}>
        <Defs>
          <LinearGradient id="gradienteAnillo" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={colores.naranja} />
            <Stop offset="1" stopColor={colores.coral} />
          </LinearGradient>
        </Defs>

        {/* Pista de fondo (círculo gris completo) */}
        <Circle
          cx={tamano / 2}
          cy={tamano / 2}
          r={radio}
          stroke={colores.pista}
          strokeWidth={grosor}
          fill="none"
        />

        {/* Progreso (arco con degradado); rotation -90 hace que inicie arriba */}
        <Circle
          cx={tamano / 2}
          cy={tamano / 2}
          r={radio}
          stroke="url(#gradienteAnillo)"
          strokeWidth={grosor}
          strokeLinecap="round"
          strokeDasharray={`${circunferencia} ${circunferencia}`}
          strokeDashoffset={desplazamiento}
          rotation="-90"
          origin={`${tamano / 2}, ${tamano / 2}`}
          fill="none"
        />
      </Svg>

      {/* Texto centrado: "3/5" */}
      <View style={estilos.anilloTextoContenedor}>
        <Text style={estilos.anilloTextoActual}>{actual}</Text>
        <Text style={estilos.anilloTextoMeta}>/{meta}</Text>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// PANTALLA PRINCIPAL
// ---------------------------------------------------------------------------
export default function Home({ navigation }) {
  const { width } = useWindowDimensions();

  // --- Estado ---------------------------------------------------------------
  const [perfil, setPerfil] = useState(null); // documento usuarios/{uid}
  const [entrenamientos, setEntrenamientos] = useState([]); // subcolección del día
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [intento, setIntento] = useState(0); // al cambiar, se vuelven a abrir las suscripciones
  const [paginaResumen, setPaginaResumen] = useState(0); // punto activo del carrusel de resumen

  // --- Conexión con Firebase ------------------------------------------------
  useEffect(() => {
    setCargando(true);
    setError(null);

    // Funciones para cancelar las suscripciones de Firestore al limpiar el efecto
    let cancelarPerfil = () => {};
    let cancelarEntrenamientos = () => {};

    // 1) Esperamos a que Firebase Auth nos diga quién es el usuario actual
    const cancelarAuth = onAuthStateChanged(auth, (usuario) => {
      // Si cambia la sesión, cerramos las suscripciones anteriores
      cancelarPerfil();
      cancelarEntrenamientos();

      if (!usuario) {
        // Normalmente el navegador raíz ya manda al Login cuando no hay sesión
        setPerfil(null);
        setEntrenamientos([]);
        setCargando(false);
        return;
      }

      // 2) Perfil y progreso del usuario (tiempo real)
      cancelarPerfil = onSnapshot(
        doc(db, 'usuarios', usuario.uid),
        (snap) => {
          setPerfil(snap.exists() ? snap.data() : {});
          setCargando(false);
        },
        (err) => {
          console.error('Error al leer el perfil:', err);
          setError('No pudimos cargar tu información. Revisa tu conexión.');
          setCargando(false);
        }
      );

      // 3) Entrenamientos del día, ordenados por el campo "orden" (tiempo real)
      const consulta = query(
        collection(db, 'usuarios', usuario.uid, 'entrenamientosDelDia'),
        orderBy('orden')
      );
      cancelarEntrenamientos = onSnapshot(
        consulta,
        (snap) => {
          setEntrenamientos(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        },
        (err) => {
          console.error('Error al leer los entrenamientos:', err);
          setError('No pudimos cargar tus entrenamientos.');
        }
      );
    });

    // Limpieza: evita fugas de memoria al salir de la pantalla
    return () => {
      cancelarAuth();
      cancelarPerfil();
      cancelarEntrenamientos();
    };
  }, [intento]);

  // --- Datos derivados ------------------------------------------------------
  const nombre =
    primerNombre(perfil?.nombre) ||
    primerNombre(auth.currentUser?.displayName) ||
    'Atleta';

  /**
   * Tarjetas del carrusel "Resumen de Progreso Semanal".
   * Se construyen según los datos disponibles: si el usuario aún no tiene PR,
   * esa tarjeta simplemente no aparece.
   */
  const tarjetasResumen = useMemo(() => {
    const tarjetas = [
      {
        id: 'dias',
        tipo: 'anillo',
        titulo: 'Días entrenados esta semana:',
        actual: perfil?.diasEntrenados ?? 0,
        meta: perfil?.metaSemanal ?? 5,
      },
    ];

    if (perfil?.ultimoPR) {
      const { ejercicio, valor, unidad } = perfil.ultimoPR;
      tarjetas.push({
        id: 'pr',
        tipo: 'destacada',
        titulo: `Nuevo PR en ${ejercicio}:`,
        valor: `${valor} ${unidad || ''}`.trim(),
      });
    }

    // Tarjetas adicionales definidas desde Firestore (opcional)
    (perfil?.tarjetasExtra || []).forEach((extra, i) => {
      tarjetas.push({
        id: `extra-${i}`,
        tipo: 'simple',
        titulo: extra.titulo,
        valor: extra.valor,
      });
    });

    return tarjetas;
  }, [perfil]);

  // --- Manejadores ----------------------------------------------------------

  /** Calcula qué tarjeta del resumen está visible para marcar el punto activo */
  const alDesplazarResumen = (evento) => {
    const x = evento.nativeEvent.contentOffset.x;
    const paso = medidas.anchoTarjetaResumen + medidas.separacionTarjetas;
    setPaginaResumen(Math.round(x / paso));
  };

  /** Abre la pantalla de la rutina enviando el id del entrenamiento elegido */
  const comenzarRutina = (entrenamiento) =>
    navigation.navigate(RUTAS.rutina, { entrenamientoId: entrenamiento.id });

  // Si hay un solo entrenamiento ocupa todo el ancho; si hay varios, deja asomar el siguiente
  const anchoTarjetaEntreno =
    entrenamientos.length > 1
      ? width * 0.87
      : width - medidas.margenHorizontal * 2;

  // --- Estados de carga y error --------------------------------------------
  if (cargando) {
    return (
      <SafeAreaView style={[estilos.pantalla, estilos.centrado]}>
        <ActivityIndicator size="large" color={colores.naranja} />
      </SafeAreaView>
    );
  }

  if (error && !perfil) {
    return (
      <SafeAreaView style={[estilos.pantalla, estilos.centrado]}>
        <Text style={estilos.textoError}>{error}</Text>
        <TouchableOpacity
          style={estilos.botonReintentar}
          onPress={() => setIntento((n) => n + 1)}
        >
          <Text style={estilos.textoBotonReintentar}>Reintentar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // --- Interfaz -------------------------------------------------------------
  return (
    <SafeAreaView style={estilos.pantalla} edges={['top']}>
      {/* ===================== ENCABEZADO (fijo) ===================== */}
      <View style={estilos.encabezado}>
        <View style={estilos.encabezadoIzquierda}>
          {/* Avatar: toca para ir al perfil */}
          <TouchableOpacity
            style={estilos.avatarAnillo}
            onPress={() => navigation.navigate(RUTAS.perfil)}
          >
            <View style={estilos.avatarInterior}>
              {/* TODO: imagen -> foto de perfil. Cuando la tengas, usa:
                  <Image source={{ uri: perfil.fotoURL }} style={{ width: 60, height: 60 }} />
                  Mientras tanto se muestra la inicial del nombre. */}
              <Text style={estilos.avatarInicial}>
                {nombre.charAt(0).toUpperCase()}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={estilos.saludoContenedor}>
            <Text style={estilos.saludo} numberOfLines={1}>
              ¡Hola, {nombre}!
            </Text>
            <View style={estilos.rachaPildora}>
              <Text style={estilos.rachaTexto}>
                🔥 {textoRacha(perfil?.rachaDias)}
              </Text>
            </View>
          </View>
        </View>

        {/* Campana de notificaciones */}
        <TouchableOpacity
          style={estilos.botonNotificaciones}
          onPress={() => navigation.navigate(RUTAS.notificaciones)}
        >
          {/* TODO: imagen -> ícono de campana */}
          <View style={estilos.iconoCampana} />
          {perfil?.notificacionesSinLeer > 0 && (
            <View style={estilos.puntoNotificacion} />
          )}
        </TouchableOpacity>
      </View>

      {/* ===================== CONTENIDO CON SCROLL ===================== */}
      <ScrollView
        contentContainerStyle={estilos.contenido}
        showsVerticalScrollIndicator={false}
      >
        {/* ===================== ENTRENAMIENTO DEL DÍA ===================== */}
        <View style={estilos.seccion}>
          <Text style={estilos.tituloSeccion}>Entrenamiento del Día</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={estilos.carruselContenido}
            snapToInterval={anchoTarjetaEntreno + medidas.separacionTarjetas}
            decelerationRate="fast"
          >
            {entrenamientos.length === 0 ? (
              // Sin entrenamientos asignados: día de descanso
              <View style={[estilos.tarjetaEntreno, { width: anchoTarjetaEntreno }]}>
                <Text style={estilos.entrenoTitulo}>Hoy toca descansar</Text>
                <Text style={estilos.entrenoDescansoTexto}>
                  No tienes entrenamientos programados. Si quieres moverte,
                  explora las rutinas disponibles.
                </Text>
              </View>
            ) : (
              entrenamientos.map((entreno) => (
                // TODO: imagen -> fondo de la tarjeta (foto de la espalda). Se puede
                // agregar con <ImageBackground> envolviendo el contenido de la tarjeta.
                <View
                  key={entreno.id}
                  style={[estilos.tarjetaEntreno, { width: anchoTarjetaEntreno }]}
                >
                  <Text style={estilos.entrenoTitulo}>{entreno.titulo}</Text>

                  {/* Estadísticas: tiempo, ejercicios e intensidad */}
                  <View style={estilos.entrenoEstadisticas}>
                    <View style={estilos.estadistica}>
                      {/* TODO: imagen -> ícono de cronómetro */}
                      <View style={estilos.iconoEstadistica} />
                      <Text style={estilos.estadisticaValor}>
                        ~{entreno.tiempoEstimado} min
                      </Text>
                      <Text style={estilos.estadisticaEtiqueta}>Tiempo estimado</Text>
                    </View>

                    <View style={estilos.estadistica}>
                      {/* TODO: imagen -> ícono de pesa */}
                      <View style={estilos.iconoEstadistica} />
                      <Text style={estilos.estadisticaValor}>
                        {entreno.numEjercicios}
                      </Text>
                      <Text style={estilos.estadisticaEtiqueta}>ejercicios</Text>
                    </View>

                    <View style={estilos.estadistica}>
                      {/* TODO: imagen -> ícono de barras de intensidad */}
                      <View style={estilos.iconoEstadistica} />
                      <Text style={estilos.estadisticaValor}>
                        {entreno.intensidad}
                      </Text>
                      <Text style={estilos.estadisticaEtiqueta}>Intensidad</Text>
                    </View>
                  </View>

                  <BotonDegradado
                    texto="Comenzar Rutina"
                    idGradiente={`degradado-${entreno.id}`}
                    onPress={() => comenzarRutina(entreno)}
                  />
                </View>
              ))
            )}
          </ScrollView>
        </View>

        {/* ===================== RESUMEN DE PROGRESO SEMANAL ===================== */}
        <View style={estilos.seccion}>
          <Text style={estilos.tituloSeccion}>Resumen de Progreso Semanal</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={estilos.carruselContenido}
            snapToInterval={medidas.anchoTarjetaResumen + medidas.separacionTarjetas}
            decelerationRate="fast"
            onScroll={alDesplazarResumen}
            scrollEventThrottle={16}
          >
            {tarjetasResumen.map((tarjeta) => (
              <View
                key={tarjeta.id}
                style={[
                  estilos.tarjetaResumen,
                  tarjeta.tipo === 'destacada' && estilos.tarjetaResumenDestacada,
                ]}
              >
                {/* TODO: imagen -> ícono de pesa en la tarjeta destacada (PR) */}
                {tarjeta.tipo === 'destacada' && <View style={estilos.iconoResumen} />}

                <Text style={estilos.tarjetaResumenTitulo}>{tarjeta.titulo}</Text>

                {tarjeta.tipo === 'anillo' ? (
                  <AnilloProgreso actual={tarjeta.actual} meta={tarjeta.meta} />
                ) : (
                  <Text style={estilos.resumenValor}>{tarjeta.valor}</Text>
                )}
              </View>
            ))}
          </ScrollView>

          {/* Puntos indicadores: uno por cada tarjeta */}
          <View style={estilos.puntos}>
            {tarjetasResumen.map((tarjeta, i) => (
              <View
                key={tarjeta.id}
                style={[estilos.punto, i === paginaResumen && estilos.puntoActivo]}
              />
            ))}
          </View>
        </View>

        {/* ===================== ACCESOS RÁPIDOS ===================== */}
        <View style={estilos.seccion}>
          <Text style={estilos.tituloSeccion}>Accesos Rápidos</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={estilos.carruselContenido}
          >
            {ACCESOS_RAPIDOS.map((acceso) => (
              <TouchableOpacity
                key={acceso.id}
                style={estilos.accesoRapido}
                onPress={() => navigation.navigate(acceso.ruta)}
                activeOpacity={0.8}
              >
                {/* TODO: imagen -> ícono del acceso rápido */}
                <View style={estilos.iconoAcceso} />
                <Text style={estilos.accesoRapidoTexto}>{acceso.etiqueta}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ===================== SIGUIENTE RETO ===================== */}
        {/* Solo se muestra si el usuario tiene un reto semanal en Firestore */}
        {perfil?.retoSemanal?.titulo ? (
          <View style={estilos.seccion}>
            <Text style={estilos.tituloSeccion}>Siguiente Reto</Text>

            <View style={estilos.tarjetaReto}>
              <View style={estilos.retoEncabezado}>
                {/* TODO: imagen -> ícono del reto (barra de dominadas) */}
                <View style={estilos.iconoReto} />
                <Text style={estilos.retoTitulo}>
                  Reto Semanal: {perfil.retoSemanal.titulo}
                </Text>
              </View>

              <Text style={estilos.retoMensaje}>
                El éxito se construye día a día. ¡Sigue así, {nombre}!
              </Text>
            </View>
          </View>
        ) : null}
      </ScrollView>

    </SafeAreaView>
  );
}