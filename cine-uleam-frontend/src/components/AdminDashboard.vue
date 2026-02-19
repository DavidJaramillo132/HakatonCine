<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-[#8B0000] text-white shadow-lg">
      <div class="container mx-auto px-6 py-6">
        <h1 class="text-3xl font-bold">Dashboard Administrativo - Cine ULEAM</h1>
        <p class="text-gray-200 mt-1">Estadísticas y análisis de ocupación</p>
      </div>
    </div>

    <div class="container mx-auto px-6 py-8">
      <!-- Botones de navegación -->
      <div class="mb-6 flex flex-wrap gap-4">
        <RouterLink
          to="/admin/cartelera"
          class="inline-flex items-center gap-2 bg-[#8B0000] text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-[#A52A2A] transition-all duration-200"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
          </svg>
          Gestión de Cartelera
        </RouterLink>
        <RouterLink
          to="/admin/encuestas"
          class="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-green-700 transition-all duration-200"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          Gestión de Encuestas
        </RouterLink>
        <RouterLink
          to="/admin/notificaciones"
          class="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-purple-700 transition-all duration-200"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          Ver Sugerencias
        </RouterLink>
        <RouterLink
          to="/admin/salas"
          class="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-orange-600 transition-all duration-200"
        >
          <i class="fa-solid fa-building"></i>
          Gestión de Salas
        </RouterLink>
        <button
          @click="cargarDatos"
          class="inline-flex items-center gap-2 bg-white text-[#8B0000] px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-gray-100 transition-all duration-200 border-2 border-[#8B0000]"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Actualizar Datos
        </button>
      </div>

      <!-- Mensaje de carga -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B0000]"></div>
        <p class="mt-4 text-gray-600">Cargando datos...</p>
      </div>

      <!-- Mensaje de error -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p class="text-red-700">{{ error }}</p>
      </div>

      <!-- Contenido del Dashboard -->
      <div v-else>
        <!-- Tarjetas de Estadísticas Generales -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-xl shadow-md p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-500 text-sm font-medium">Total Asientos Ocupados</p>
                <p class="text-3xl font-bold text-gray-800 mt-2">{{ estadisticas.totalAsientosOcupados }}</p>
              </div>
              <div class="bg-blue-100 rounded-full p-3">
                <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-md p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-500 text-sm font-medium">Promedio Ocupación</p>
                <p class="text-3xl font-bold text-gray-800 mt-2">{{ estadisticas.promedioOcupacion }}%</p>
              </div>
              <div class="bg-green-100 rounded-full p-3">
                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-md p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-500 text-sm font-medium">Sala Más Ocupada</p>
                <p class="text-2xl font-bold text-gray-800 mt-2">{{ estadisticas.salaMasOcupada || 'N/A' }}</p>
              </div>
              <div class="bg-yellow-100 rounded-full p-3">
                <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-md p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-500 text-sm font-medium">Funciones Analizadas</p>
                <p class="text-3xl font-bold text-gray-800 mt-2">{{ ocupacionData.length }}</p>
              </div>
              <div class="bg-purple-100 rounded-full p-3">
                <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Filtros -->
        <div class="bg-white rounded-xl shadow-md p-6 mb-8">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Filtros</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Película</label>
              <select
                v-model="filtros.pelicula"
                @change="aplicarFiltros"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent"
              >
                <option value="">Todas las películas</option>
                <option v-for="pelicula in peliculas" :key="pelicula" :value="pelicula">{{ pelicula }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Sala</label>
              <select
                v-model="filtros.sala"
                @change="aplicarFiltros"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent"
              >
                <option value="">Todas las salas</option>
                <option v-for="sala in salas" :key="sala" :value="sala">{{ sala }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Fecha Inicio</label>
              <input
                v-model="filtros.fechaInicio"
                type="date"
                @change="aplicarFiltros"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Fecha Fin</label>
              <input
                v-model="filtros.fechaFin"
                type="date"
                @change="aplicarFiltros"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <!-- Gráfico de barras visual -->
        <div class="bg-white rounded-xl shadow-md p-6 mb-8">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Ocupación por Sala</h3>
          <div class="space-y-4">
            <div v-for="sala in datosGraficoSalas" :key="sala.nombre" class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="font-medium text-gray-700">{{ sala.nombre }}</span>
                <span class="text-gray-600">{{ sala.porcentaje }}% ocupado ({{ sala.funcionesTotal }} funciones)</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-8">
                <div
                  :style="{ width: sala.porcentaje + '%' }"
                  :class="getColorClass(sala.porcentaje)"
                  class="h-8 rounded-full flex items-center justify-end pr-3 text-white text-xs font-semibold transition-all duration-500"
                >
                  <span v-if="parseFloat(sala.porcentaje) > 10">{{ sala.asientosOcupados }}/{{ sala.capacidadTotal }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        
        <!-- Tabla de datos detallados -->
        <div class="bg-white rounded-xl shadow-md overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 class="text-lg font-semibold text-gray-800">Detalle de Ocupación por Función</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Película
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sala
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Horario
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Asientos Ocupados
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Capacidad
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ocupación
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(item, index) in ocupacionFiltrada" :key="index" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ item.pelicula }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {{ item.sala }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatearFecha(item.fecha) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatearHora(item.hora_inicio) }} - {{ formatearHora(item.hora_fin) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ item.asientos_ocupados }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ item.capacidad }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <span class="text-sm font-semibold text-gray-900">{{ item.porcentaje_ocupacion }}%</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getEstadoBadgeClass(item.porcentaje_ocupacion)" class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full">
                      {{ getEstadoTexto(item.porcentaje_ocupacion) }}
                    </span>
                  </td>
                </tr>
                <tr v-if="ocupacionFiltrada.length === 0">
                  <td colspan="8" class="px-6 py-8 text-center text-gray-500">
                    No hay datos disponibles con los filtros seleccionados
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { supabase } from '../lib/connectSupabase';
import type { IOcupacion } from '../interface/IOcupacion';

// Estados
const ocupacionData = ref<IOcupacion[]>([]);
const loading = ref(true);
const error = ref('');

// Filtros
const filtros = ref({
  pelicula: '',
  sala: '',
  fechaInicio: '',
  fechaFin: ''
});

// Computed - Películas únicas
const peliculas = computed(() => {
  const peliculasUnicas = [...new Set(ocupacionData.value.map(item => item.pelicula))];
  return peliculasUnicas.sort();
});

// Computed - Salas únicas
const salas = computed(() => {
  const salasUnicas = [...new Set(ocupacionData.value.map(item => item.sala))];
  return salasUnicas.sort();
});

// Computed - Datos filtrados
const ocupacionFiltrada = computed(() => {
  let datos = [...ocupacionData.value];

  if (filtros.value.pelicula) {
    datos = datos.filter(item => item.pelicula === filtros.value.pelicula);
  }

  if (filtros.value.sala) {
    datos = datos.filter(item => item.sala === filtros.value.sala);
  }

  if (filtros.value.fechaInicio) {
    datos = datos.filter(item => item.fecha >= filtros.value.fechaInicio);
  }

  if (filtros.value.fechaFin) {
    datos = datos.filter(item => item.fecha <= filtros.value.fechaFin);
  }

  return datos.sort((a, b) => {
    const fechaComp = b.fecha.localeCompare(a.fecha);
    if (fechaComp !== 0) return fechaComp;
    return a.hora_inicio.localeCompare(b.hora_inicio);
  });
});

// Computed - Estadísticas
const estadisticas = computed(() => {
  const datos = ocupacionFiltrada.value;
  
  if (datos.length === 0) {
    return {
      totalAsientosOcupados: 0,
      promedioOcupacion: 0,
      salaMasOcupada: '',
      funcionesTotales: 0
    };
  }

  const totalAsientosOcupados = datos.reduce((sum, item) => sum + item.asientos_ocupados, 0);
  const promedioOcupacion = datos.reduce((sum, item) => sum + item.porcentaje_ocupacion, 0) / datos.length;

  // Calcular sala más ocupada
  const ocupacionPorSala = datos.reduce((acc, item) => {
    if (!acc[item.sala]) {
      acc[item.sala] = { total: 0, count: 0 };
    }
    acc[item.sala].total += item.porcentaje_ocupacion;
    acc[item.sala].count++;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  const salaMasOcupada = Object.entries(ocupacionPorSala).reduce((max, [sala, datos]) => {
    const promedio = datos.total / datos.count;
    return promedio > max.promedio ? { sala, promedio } : max;
  }, { sala: '', promedio: 0 }).sala;

  return {
    totalAsientosOcupados,
    promedioOcupacion: promedioOcupacion.toFixed(2),
    salaMasOcupada,
    funcionesTotales: datos.length
  };
});

// Computed - Datos para gráfico de películas
const datosGraficoPeliculas = computed(() => {
  const datos = ocupacionFiltrada.value;
  
  const agrupadoPorPelicula = datos.reduce((acc, item) => {
    if (!acc[item.pelicula]) {
      acc[item.pelicula] = {
        nombre: item.pelicula,
        asientosOcupados: 0,
        count: 0
      };
    }
    acc[item.pelicula].asientosOcupados += item.asientos_ocupados;
    acc[item.pelicula].count++;
    return acc;
  }, {} as Record<string, { nombre: string; asientosOcupados: number; count: number }>);

  const peliculasArray = Object.values(agrupadoPorPelicula);
  const maxAsientos = Math.max(...peliculasArray.map(p => p.asientosOcupados), 1);

  return peliculasArray.map(pelicula => ({
    nombre: pelicula.nombre,
    asientosOcupados: pelicula.asientosOcupados,
    funcionesTotal: pelicula.count,
    porcentaje: ((pelicula.asientosOcupados / maxAsientos) * 100).toFixed(2)
  })).sort((a, b) => b.asientosOcupados - a.asientosOcupados).slice(0, 10); // Top 10 películas
});

// Computed - Datos para gráfico de salas
const datosGraficoSalas = computed(() => {
  const datos = ocupacionFiltrada.value;
  
  const agrupadoPorSala = datos.reduce((acc, item) => {
    if (!acc[item.sala]) {
      acc[item.sala] = {
        nombre: item.sala,
        asientosOcupados: 0,
        capacidadTotal: item.capacidad,
        count: 0
      };
    }
    acc[item.sala].asientosOcupados += item.asientos_ocupados;
    acc[item.sala].count++;
    return acc;
  }, {} as Record<string, { nombre: string; asientosOcupados: number; capacidadTotal: number; count: number }>);

  return Object.values(agrupadoPorSala).map(sala => ({
    nombre: sala.nombre,
    asientosOcupados: sala.asientosOcupados,
    capacidadTotal: sala.capacidadTotal * sala.count,
    funcionesTotal: sala.count,
    porcentaje: ((sala.asientosOcupados / (sala.capacidadTotal * sala.count)) * 100).toFixed(2)
  })).sort((a, b) => parseFloat(b.porcentaje) - parseFloat(a.porcentaje));
});

// Funciones
async function cargarDatos() {
  loading.value = true;
  error.value = '';

  try {
    const { data, error: supabaseError } = await supabase
      .from('vista_ocupacion')
      .select('*')
      .order('fecha', { ascending: false });

    if (supabaseError) throw supabaseError;

    ocupacionData.value = data || [];
  } catch (err: any) {
    error.value = err.message || 'Error al cargar los datos de ocupación';
    console.error('Error cargando datos:', err);
  } finally {
    loading.value = false;
  }
}

function aplicarFiltros() {
  // Los computed properties se actualizarán automáticamente
}

function formatearFecha(fecha: string): string {
  const date = new Date(fecha);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function formatearHora(hora: string): string {
  // Si la hora viene en formato HH:MM:SS o HH:MM
  const partes = hora.split(':');
  if (partes.length >= 2) {
    return `${partes[0]}:${partes[1]}`;
  }
  return hora;
}

function getColorClass(porcentaje: number | string): string {
  const valor = typeof porcentaje === 'string' ? parseFloat(porcentaje) : porcentaje;
  
  if (valor >= 90) return 'bg-red-500';
  if (valor >= 70) return 'bg-orange-500';
  if (valor >= 50) return 'bg-yellow-500';
  if (valor >= 30) return 'bg-green-500';
  return 'bg-blue-500';
}

function getEstadoBadgeClass(porcentaje: number): string {
  if (porcentaje >= 90) return 'bg-red-100 text-red-800';
  if (porcentaje >= 70) return 'bg-orange-100 text-orange-800';
  if (porcentaje >= 50) return 'bg-yellow-100 text-yellow-800';
  if (porcentaje >= 30) return 'bg-green-100 text-green-800';
  return 'bg-blue-100 text-blue-800';
}

function getEstadoTexto(porcentaje: number): string {
  if (porcentaje >= 90) return 'Lleno';
  if (porcentaje >= 70) return 'Muy Ocupado';
  if (porcentaje >= 50) return 'Ocupado';
  if (porcentaje >= 30) return 'Moderado';
  return 'Disponible';
}

// Lifecycle
onMounted(() => {
  cargarDatos();
});
</script>

<style scoped>
/* Animaciones suaves para las barras */
.transition-all {
  transition: all 0.5s ease-in-out;
}
</style>
