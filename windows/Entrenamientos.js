// ============================================================
// Perfil.js
// Pantalla de perfil del usuario (React Native).
// Los estilos viven en PerfilStyles.js.
// ============================================================
import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { estilos, colores, medidas } from '../Styles/PerfilStyles';

// ------------------------------------------------------------
// 1. DATOS DE EJEMPLO
// Por ahora son datos fijos para replicar el diseño.
// Más adelante se reemplazan por los datos reales del usuario
// guardados en Firebase (por ejemplo, con useEffect + getDoc).
// ------------------------------------------------------------
const usuario = {
  nombre: 'Alex Rivera',
  usuario: '@alex_rivera',
  avatar: null, // URL de la foto; si es null se muestra la inicial del nombre
  verificado: true,
};

// Estadísticas sociales (se dibujan con un divisor entre cada una)
const estadisticasSociales = [
  { id: 'seguidores', valor: 200, etiqueta: 'Followers' },
  { id: 'siguiendo', valor: 100, etiqueta: 'Following' },
  { id: 'siguiendo2', valor: 50, etiqueta: 'Following' },
];

const racha = { dias: 68 };
const marcaPersonal = { distancia: '10km', tiempo: '48:15' };

// Resumen semanal.
// "proporcion" va de 0 a 1: qué tan alta es la barra respecto al máximo.
// Con 0 se dibuja la barra gris (día sin actividad).
const resumenSemanal = {
  tiempoTotal: '7h 35m',
  sesiones: 4,
  dias: [
    { id: 'd1', letra: 'M', proporcion: 0.78 },
    { id: 'd2', letra: 'M', proporcion: 1 },
    { id: 'd3', letra: 'J', proporcion: 0 },
    { id: 'd4', letra: 'V', proporcion: 0.7 },
    { id: 'd5', letra: 'S', proporcion: 0 },
    { id: 'd6', letra: 'D', proporcion: 0 },
    { id: 'd7', letra: 'L', proporcion: 0 },
  ],
};

// Lista de entrenamientos recientes
const entrenamientos = [
  {
    id: 'e1',
    emoji: '🏃',
    nombre: 'Carrera Matutina',
    fecha: 'Lun 8 Oct',
    hora: '11:30',
    distancia: '8.5 km',
    duracion: '58 min',
    calorias: 890,
  },
  {
    id: 'e2',
    emoji: '🚴',
    nombre: 'Ciclismo',
    fecha: 'Dom 7 Oct',
    hora: '09:15',
    distancia: '25 km',
    duracion: '1h 12m',
    calorias: 650,
  },
  {
    id: 'e3',
    emoji: '🏋️',
    nombre: 'Gimnasio',
    fecha: 'Vie 5 Oct',
    hora: '18:00',
    distancia: null, // el gimnasio no tiene distancia
    duracion: '1h 15m',
    calorias: 420,
  },
];

// ------------------------------------------------------------
// 2. COMPONENTES PEQUEÑOS (dentro del mismo archivo)
// ------------------------------------------------------------

// Una estadística social: número arriba, etiqueta abajo
const EstadisticaSocial = ({ valor, etiqueta }) => (
  <View style={estilos.redItem}>
    <Text style={estilos.redValor}>{valor}</Text>
    <Text style={estilos.redEtiqueta}>{etiqueta}</Text>
  </View>
);

// Una barra de la gráfica semanal
const BarraDia = ({ letra, proporcion }) => {
  const tieneActividad = proporcion > 0;

  // Con actividad: altura proporcional. Sin actividad: barra gris completa.
  const altura = tieneActividad
    ? medidas.alturaBarra * proporcion
    : medidas.alturaBarra;

  return (
    <View style={estilos.barraColumna}>
      <View
        style={[
          estilos.barra,
          tieneActividad ? estilos.barraLlena : estilos.barraVacia,
          { height: altura },
        ]}
      />
      <Text style={estilos.barraDia}>{letra}</Text>
    </View>
  );
};

// Una tarjeta de la lista de entrenamientos recientes
const TarjetaEntrenamiento = ({ numero, entrenamiento, onPress }) => {
  // Armamos la segunda línea: "11:30 | 8.5 km - 58 min | 🔥 890 cal"
  const distancia = entrenamiento.distancia
    ? `${entrenamiento.distancia} - `
    : '';
  const detalle = `${entrenamiento.hora} | ${distancia}${entrenamiento.duracion} | 🔥 ${entrenamiento.calorias} cal`;

  return (
    <TouchableOpacity
      style={estilos.entrenoTarjeta}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Número de posición en la lista */}
      <Text style={estilos.entrenoNumero}>{numero}</Text>

      {/* Título + fecha, y debajo el detalle */}
      <View style={estilos.entrenoInfo}>
        <Text style={estilos.entrenoTitulo} numberOfLines={1}>
          {entrenamiento.emoji} {entrenamiento.nombre}
          <Text style={estilos.entrenoFecha}> - {entrenamiento.fecha}</Text>
        </Text>
        <Text style={estilos.entrenoDetalle}>{detalle}</Text>
      </View>

      {/* Flecha a la derecha */}
      <Text style={estilos.entrenoFlecha}>›</Text>
    </TouchableOpacity>
  );
};

// ------------------------------------------------------------
// 3. PANTALLA PRINCIPAL
// "navigation" llega por props si usas React Navigation.
// ------------------------------------------------------------
export default function Perfil({ navigation }) {
  // Si no hay foto, mostramos la primera letra del nombre
  const inicial = usuario.nombre.charAt(0).toUpperCase();

  return (
    <SafeAreaView style={estilos.contenedor}>
      <StatusBar barStyle="dark-content" backgroundColor={colores.fondo} />

      {/* ---------- Encabezado fijo (fuera del ScrollView) ---------- */}
      <View style={estilos.encabezado}>
        <View style={estilos.encabezadoEspacio} />
        <Text style={estilos.encabezadoTitulo}>Perfil</Text>
        <TouchableOpacity
          style={estilos.botonAjustes}
          onPress={() => navigation?.navigate('Ajustes')} // pantalla de ajustes
        >
          <Text style={estilos.iconoAjustes}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* ---------- Contenido con scroll ---------- */}
      <ScrollView
        contentContainerStyle={estilos.scrollContenido}
        showsVerticalScrollIndicator={false}
      >
        {/* ===== Avatar, nombre y botón Editar Perfil ===== */}
        <View style={estilos.perfilFila}>
          <View style={estilos.avatarContenedor}>
            {usuario.avatar ? (
              <Image source={{ uri: usuario.avatar }} style={estilos.avatar} />
            ) : (
              <View style={[estilos.avatar, estilos.avatarPlaceholder]}>
                <Text style={estilos.avatarInicial}>{inicial}</Text>
              </View>
            )}

            {/* Insignia verde de verificado */}
            {usuario.verificado && (
              <View style={estilos.insignia}>
                <Text style={estilos.insigniaTexto}>✓</Text>
              </View>
            )}
          </View>

          <View style={estilos.perfilInfo}>
            <Text style={estilos.nombre}>{usuario.nombre}</Text>
            <Text style={estilos.usuario}>{usuario.usuario}</Text>

            <TouchableOpacity
              style={estilos.botonEditar}
              onPress={() => navigation?.navigate('EditarPerfil')}
            >
              <Text style={estilos.botonEditarTexto}>Editar Perfil</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ===== Estadísticas sociales (3 columnas con divisores) ===== */}
        <View style={estilos.redesFila}>
          {estadisticasSociales.map((item, indice) => (
            <React.Fragment key={item.id}>
              {/* Divisor vertical antes de la 2ª y 3ª estadística */}
              {indice > 0 && <View style={estilos.redDivisor} />}
              <EstadisticaSocial valor={item.valor} etiqueta={item.etiqueta} />
            </React.Fragment>
          ))}
        </View>

        {/* ===== Tarjetas: Racha actual y Marca personal ===== */}
        <View style={estilos.tarjetasFila}>
          {/* Racha actual (azul) */}
          <View style={estilos.tarjetaRacha}>
            <Text style={estilos.tarjetaTitulo}>Racha Actual</Text>
            <View style={estilos.tarjetaValorFila}>
              <Text style={estilos.tarjetaEmoji}>🔥</Text>
              <Text style={estilos.tarjetaValorRacha}>¡{racha.dias} días!</Text>
            </View>
            <Text style={estilos.tarjetaSubtitulo}>Mantenla viva!</Text>
          </View>

          {/* Marca personal (durazno) */}
          <View style={estilos.tarjetaMarca}>
            <Text style={estilos.tarjetaTitulo}>🏆 Marca Personal PR</Text>
            <View style={estilos.tarjetaValorFila}>
              <Text style={estilos.tarjetaEmoji}>🏆</Text>
              <Text style={estilos.tarjetaValorMarca}>
                {marcaPersonal.distancia}: {marcaPersonal.tiempo}
              </Text>
            </View>
            <Text style={estilos.tarjetaSubtitulo}>Nuevo Récord!</Text>
          </View>
        </View>

        {/* ===== Estadísticas semanales (gráfica de barras) ===== */}
        <View style={estilos.semanaTarjeta}>
          <Text style={estilos.semanaTitulo}>📊 Estadísticas Semanales</Text>

          {/* Tiempo total | número de sesiones */}
          <View style={estilos.semanaResumenFila}>
            <Text style={estilos.semanaResumen}>{resumenSemanal.tiempoTotal}</Text>
            <View style={estilos.semanaSeparador} />
            <Text style={estilos.semanaResumen}>
              {resumenSemanal.sesiones} Sessions: {resumenSemanal.sesiones}
            </Text>
          </View>

          {/* Una barra por día */}
          <View style={estilos.barrasFila}>
            {resumenSemanal.dias.map((dia) => (
              <BarraDia
                key={dia.id}
                letra={dia.letra}
                proporcion={dia.proporcion}
              />
            ))}
          </View>
        </View>

        {/* ===== Entrenamientos recientes ===== */}
        <View style={estilos.entrenosContenedor}>
          <Text style={estilos.entrenosTitulo}>Entrenamientos Recientes</Text>

          {entrenamientos.map((entrenamiento, indice) => (
            <TarjetaEntrenamiento
              key={entrenamiento.id}
              numero={indice + 1}
              entrenamiento={entrenamiento}
              onPress={() =>
                navigation?.navigate('DetalleEntrenamiento', {
                  id: entrenamiento.id,
                })
              }
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}