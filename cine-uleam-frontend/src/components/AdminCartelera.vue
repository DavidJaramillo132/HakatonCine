<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-[#8B0000] text-white shadow-lg">
      <div class="container mx-auto px-6 py-6">
        <h1 class="text-3xl font-bold">Panel de Administración - Cine ULEAM</h1>
        <p class="text-gray-200 mt-1">Gestión de cartelera y funciones</p>
      </div>
    </div>

    <div class="container mx-auto px-6 py-8">
      <!-- Botón de acceso a notificaciones -->
      <div class="mb-6">
        <RouterLink
          to="/admin/notificaciones"
          class="inline-flex items-center gap-2 bg-[#8B0000] text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-[#A52A2A] transition-all duration-200"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          Ver Sugerencias
        </RouterLink>
      </div>

      <!-- Estadísticas Dashboard -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        <div class="bg-white rounded-xl shadow-md p-6 ">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm font-medium">Reservas Hoy</p>
              <p class="text-3xl font-bold text-gray-800 mt-2">{{ stats.reservasHoy }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-md p-6 ">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm font-medium">Películas Activas</p>
              <p class="text-3xl font-bold text-gray-800 mt-2">{{ stats.peliculasActivas }}</p>
            </div>

          </div>
        </div>


      </div>

      <!-- Tabs de Gestión -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <div class="border-b border-gray-200">
          <nav class="flex -mb-px">
            <button
              @click="activeTab = 'peliculas'"
              :class="[
                'px-6 py-4 text-sm font-medium border-b-2 transition-colors',
                activeTab === 'peliculas'
                  ? 'border-[#8B0000] text-[#8B0000]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Gestión de Películas
            </button>
            <button
              @click="activeTab = 'funciones'"
              :class="[
                'px-6 py-4 text-sm font-medium border-b-2 transition-colors',
                activeTab === 'funciones'
                  ? 'border-[#8B0000] text-[#8B0000]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Programación de Horarios
            </button>
          </nav>
        </div>

        <div class="p-6">
          <!-- Tab: Gestión de Películas -->
          <div v-if="activeTab === 'peliculas'" class="space-y-6">
            <!-- Búsqueda API o Manual -->
            <div class="bg-gray-50 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Añadir Nueva Película</h3>
              
              <div class="flex gap-4 mb-4">
                <button
                  @click="modoAgregar = 'api'"
                  :class="[
                    'flex-1 py-3 px-4 rounded-lg font-medium transition-all',
                    modoAgregar === 'api'
                      ? 'bg-[#8B0000] text-white shadow-lg'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  ]"
                >
                   Buscar en OMDb API
                </button>
                <button
                  @click="modoAgregar = 'manual'"
                  :class="[
                    'flex-1 py-3 px-4 rounded-lg font-medium transition-all',
                    modoAgregar === 'manual'
                      ? 'bg-[#8B0000] text-white shadow-lg'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  ]"
                >
                  Ingresar Manualmente
                </button>
              </div>

              <!-- Modo API -->
              <div v-if="modoAgregar === 'api'" class="space-y-4">
                <div class="flex gap-4">
                  <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Buscar película por título..."
                    class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent"
                    @keyup.enter="buscarPeliculaAPI"
                  />
                  <button
                    @click="buscarPeliculaAPI"
                    :disabled="isSearching"
                    class="bg-[#8B0000] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#A52A2A] transition-colors disabled:opacity-50"
                  >
                    {{ isSearching ? 'Buscando...' : 'Buscar' }}
                  </button>
                </div>

                <!-- Resultados de búsqueda -->
                <div v-if="resultadosBusqueda.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    v-for="pelicula in resultadosBusqueda"
                    :key="pelicula.imdbID"
                    class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
                    @click="seleccionarPeliculaAPI(pelicula)"
                  >
                    <div class="flex gap-4">
                      <img
                        :src="pelicula.Poster !== 'N/A' ? pelicula.Poster : '/placeholder-movie.jpg'"
                        :alt="pelicula.Title"
                        class="w-20 h-28 object-cover rounded"
                      />
                      <div class="flex-1">
                        <h4 class="font-semibold text-gray-800">{{ pelicula.Title }}</h4>
                        <p class="text-sm text-gray-600">{{ pelicula.Year }}</p>
                        <p class="text-sm text-gray-500 mt-1">{{ pelicula.Type }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Modo Manual / Formulario -->
              <div v-if="modoAgregar === 'manual' || peliculaSeleccionada" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Título *</label>
                    <input
                      v-model="formPelicula.titulo"
                      type="text"
                      required
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Director *</label>
                    <input
                      v-model="formPelicula.director"
                      type="text"
                      required
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Duración (min) *</label>
                    <input
                      v-model="formPelicula.duracion_min"
                      type="number"
                      required
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Género *</label>
                    <input
                      v-model="formPelicula.genero"
                      type="text"
                      required
                      placeholder="Ej: Acción, Drama, Comedia"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Clasificación *</label>
                    <select
                      v-model="formPelicula.clasificacion"
                      required
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent"
                    >
                      <option value="">Seleccionar...</option>
                      <option value="A">A - Todo público</option>
                      <option value="B">B - Mayores de 12 años</option>
                      <option value="C">C - Mayores de 15 años</option>
                      <option value="D">D - Mayores de 18 años</option>
                    </select>
                  </div>
                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1">URL del Póster</label>
                    <input
                      v-model="formPelicula.poster_url"
                      type="url"
                      placeholder="https://..."
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent"
                    />
                  </div>
            
                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Sinopsis *</label>
                    <textarea
                      v-model="formPelicula.sinopsis"
                      rows="4"
                      required
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent"
                    ></textarea>
                  </div>
                </div>

                <div class="flex gap-4">
                  <button
                    @click="guardarPelicula"
                    class="bg-[#8B0000] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#A52A2A] transition-colors"
                  >
                    Guardar Película
                  </button>
                  <button
                    @click="cancelarFormulario"
                    class="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-400 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>

            <!-- Lista de Películas -->
            <div>
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Cartelera Actual</h3>
              
              <!-- Indicador de carga -->
              <div v-if="isLoadingPeliculas" class="flex justify-center items-center py-12">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B0000]"></div>
                <p class="ml-4 text-gray-600">Cargando películas...</p>
              </div>
              
              <!-- Mensaje cuando no hay películas -->
              <div v-else-if="peliculas.length === 0" class="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
                <svg class="mx-auto h-12 w-12 text-blue-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
                <h3 class="text-lg font-semibold text-gray-700 mb-2">No hay películas en la cartelera</h3>
                <p class="text-gray-600 mb-4">Agrega tu primera película usando el formulario de arriba</p>
                <button
                  @click="modoAgregar = 'api'; activeTab = 'peliculas'"
                  class="bg-[#8B0000] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#A52A2A] transition-colors"
                >
                  Agregar Película
                </button>
              </div>
              
              <!-- Grid de películas -->
              <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div
                  v-for="pelicula in peliculas"
                  :key="pelicula.id"
                  class="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <img
                    :src="pelicula.poster_url || 'https://via.placeholder.com/300x450?text=Sin+Poster'"
                    :alt="pelicula.titulo"
                    class="w-full h-64 object-cover"
                    @error="(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x450?text=Sin+Poster'"
                  />
                  <div class="p-4">
                    <h4 class="font-bold text-lg text-gray-800">{{ pelicula.titulo }}</h4>
                    <p class="text-sm text-gray-600 mt-1">{{ pelicula.duracion_min }} min • {{ pelicula.clasificacion }}</p>
                    <p class="text-sm text-gray-500 mt-1">{{ pelicula.genero }}</p>
                    <p class="text-sm text-gray-700 mt-2 line-clamp-2">{{ pelicula.sinopsis }}</p>
                    
                    <div class="flex gap-2 mt-4">
                      <button
                        @click="editarPelicula(pelicula)"
                        class="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        @click="eliminarPelicula(pelicula.id)"
                        class="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tab: Programación de Horarios -->
          <div v-if="activeTab === 'funciones'" class="space-y-6">
            <div class="bg-gray-50 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Programar Nueva Función</h3>
              
              <div class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Película *</label>
                    <select
                      v-model="formFuncion.pelicula_id"
                      required
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent"
                    >
                      <option value="">Seleccionar película...</option>
                      <option v-for="pelicula in peliculas" :key="pelicula.id" :value="pelicula.id">
                        {{ pelicula.titulo }}
                      </option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Fecha *</label>
                    <input
                      v-model="formFuncion.fecha"
                      type="date"
                      required
                      :min="fechaMinima"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Hora de Inicio *</label>
                    <input
                      v-model="formFuncion.hora_inicio"
                      type="time"
                      required
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Sala *</label>
                    <select
                      v-model="formFuncion.sala_id"
                      required
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent"
                    >
                      <option value="">Seleccionar sala...</option>
                      <option v-for="sala in salas" :key="sala.id" :value="sala.id">
                        {{ sala.nombre }} (Capacidad: {{ sala.capacidad }})
                      </option>
                    </select>
                  </div>
                </div>

                <div v-if="errorHorario" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {{ errorHorario }}
                </div>

                <div class="flex gap-4">
                  <button
                    @click="guardarFuncion"
                    class="bg-[#8B0000] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#A52A2A] transition-colors"
                  >
                    Programar Función
                  </button>
                  <button
                    @click="cancelarFormularioFuncion"
                    class="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-400 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>

            <!-- Lista de Funciones Programadas -->
            <div>
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Funciones Programadas</h3>
              <div class="space-y-4">
                <div
                  v-for="funcion in funciones"
                  :key="funcion.id"
                  class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex-1">
                      <h4 class="font-bold text-gray-800">{{ obtenerTituloPelicula(funcion.pelicula_id) }}</h4>
                      <div class="flex gap-4 mt-2 text-sm text-gray-600">
                        <span>{{ formatearFecha(funcion.fecha) }}</span>
                        <span>{{ funcion.hora_inicio }} - {{ funcion.hora_fin }}</span>
                        <span>{{ obtenerNombreSala(funcion.sala_id) }}</span>
                      </div>
                    </div>
                    <div class="flex gap-2">
                      <button
                        @click="eliminarFuncion(funcion.id)"
                        class="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { supabase } from '../lib/connectSupabase'
import type { IPelicula } from '../interface/IPeliculas'
import type { Funcion } from '../interface/IFuncion'
import type { Sala } from '../interface/ISala'

// Estados
const activeTab = ref('peliculas')
const modoAgregar = ref<'api' | 'manual'>('api')
const searchQuery = ref('')
const isSearching = ref(false)
const isLoadingPeliculas = ref(true)
const resultadosBusqueda = ref<any[]>([])
const peliculaSeleccionada = ref(false)
const errorHorario = ref('')
const peliculaEditando = ref<string | null>(null)

// Datos desde Supabase
const stats = reactive({
  ocupacionTotal: 0,
  reservasHoy: 0,
  peliculasActivas: 0,
  funcionesHoy: 0
})

const peliculas = ref<IPelicula[]>([])
const funciones = ref<Funcion[]>([])
const salas = ref<Sala[]>([])

// Formularios
const formPelicula = reactive({
  titulo: '',
  director: '',
  duracion_min: 0,
  genero: '',
  clasificacion: '',
  poster_url: '',
  sinopsis: '',
  fecha_inicio: '',
  fecha_fin: ''
})

const formFuncion = reactive({
  pelicula_id: '',
  sala_id: '',
  fecha: '',
  hora_inicio: '',
  hora_fin: ''
})

const fechaMinima = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

// Cargar datos iniciales
onMounted(async () => {
  await cargarPeliculas()
  await cargarFunciones()
  await cargarSalas()
  await cargarEstadisticas()
})

// Cargar películas desde Supabase
const cargarPeliculas = async () => {
  try {
    isLoadingPeliculas.value = true
    console.log('Cargando películas...')
    const { data, error } = await supabase
      .from('peliculas')
      .select('*')
      .order('creada_en', { ascending: false })

    if (error) {
      console.error('Error de Supabase:', error)
      throw error
    }
    
    console.log('Películas cargadas:', data)
    peliculas.value = data || []
    console.log('Total de películas:', peliculas.value.length)
  } catch (error) {
    console.error('Error cargando películas:', error)
    alert('Error al cargar películas: ' + (error as Error).message)
  } finally {
    isLoadingPeliculas.value = false
  }
}

// Cargar funciones desde Supabase
const cargarFunciones = async () => {
  try {
    const { data, error } = await supabase
      .from('funciones')
      .select('*')
      .order('fecha', { ascending: true })
      .order('hora_inicio', { ascending: true })

    if (error) throw error
    funciones.value = data || []
  } catch (error) {
    console.error('Error cargando funciones:', error)
  }
}

// Cargar salas desde Supabase
const cargarSalas = async () => {
  try {
    const { data, error } = await supabase
      .from('sala')
      .select('*')
      .order('nombre', { ascending: true })

    if (error) throw error
    salas.value = data || []
  } catch (error) {
    console.error('Error cargando salas:', error)
  }
}

// Cargar estadísticas
const cargarEstadisticas = async () => {
  try {
    // Contar películas activas
    const { count: peliculasCount } = await supabase
      .from('peliculas')
      .select('*', { count: 'exact', head: true })
    
    stats.peliculasActivas = peliculasCount || 0

    // Contar funciones de hoy
    const hoy = new Date().toISOString().split('T')[0]
    const { count: funcionesCount } = await supabase
      .from('funciones')
      .select('*', { count: 'exact', head: true })
      .eq('fecha', hoy)
    
    stats.funcionesHoy = funcionesCount || 0

    // Contar reservas de hoy (si existe tabla de reservas)
    const { count: reservasCount } = await supabase
      .from('reservas')
      .select('*', { count: 'exact', head: true })
      .gte('creada_en', hoy)
    
    stats.reservasHoy = reservasCount || 0
  } catch (error) {
    console.error('Error cargando estadísticas:', error)
  }
}

// Función para buscar películas en OMDb API
const buscarPeliculaAPI = async () => {
  if (!searchQuery.value.trim()) return

  isSearching.value = true
  try {
    const apiKey = '34e63b5b'
    const response = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(searchQuery.value)}&apikey=${apiKey}`)
    const data = await response.json()

    if (data.Response === 'True') {
      resultadosBusqueda.value = data.Search
    } else {
      alert('No se encontraron películas')
      resultadosBusqueda.value = []
    }
  } catch (error) {
    console.error('Error buscando película:', error)
    alert('Error al buscar película')
  } finally {
    isSearching.value = false
  }
}


const seleccionarPeliculaAPI = async (pelicula: any) => {
  try {
    // Obtener detalles completos de la película
    const apiKey = '34e63b5b'
    const response = await fetch(`https://www.omdbapi.com/?i=${pelicula.imdbID}&apikey=${apiKey}`)
    const data = await response.json()
    
    if (data.Response === 'True') {
      formPelicula.titulo = data.Title
      formPelicula.director = data.Director
      formPelicula.duracion_min = parseInt(data.Runtime) || 0
      formPelicula.genero = data.Genre.split(',')[0].trim()
      formPelicula.clasificacion = data.Rated
      formPelicula.poster_url = data.Poster !== 'N/A' ? data.Poster : ''
      formPelicula.sinopsis = data.Plot
      
      peliculaSeleccionada.value = true
      resultadosBusqueda.value = []
    }
  } catch (error) {
    console.error('Error obteniendo detalles:', error)
  }
}

const guardarPelicula = async () => {
  // Validar formulario
  if (!formPelicula.titulo || !formPelicula.sinopsis) {
    alert('Por favor completa todos los campos requeridos')
    return
  }
  
  try {
    const peliculaData = {
      titulo: formPelicula.titulo,
      director: formPelicula.director,
      duracion_min: formPelicula.duracion_min,
      genero: formPelicula.genero,
      clasificacion: formPelicula.clasificacion,
      poster_url: formPelicula.poster_url,
      sinopsis: formPelicula.sinopsis,
      fecha_inicio: formPelicula.fecha_inicio || null,
      fecha_fin: formPelicula.fecha_fin || null
    }

    if (peliculaEditando.value) {
      // Actualizar película existente
      const { error } = await supabase
        .from('peliculas')
        .update(peliculaData)
        .eq('id', peliculaEditando.value)

      if (error) throw error
      alert('Película actualizada correctamente')
    } else {
      // Crear nueva película
      const { error } = await supabase
        .from('peliculas')
        .insert([peliculaData])

      if (error) throw error
      alert('Película guardada correctamente')
    }

    await cargarPeliculas()
    await cargarEstadisticas()
    cancelarFormulario()
  } catch (error) {
    console.error('Error guardando película:', error)
    alert('Error al guardar la película')
  }
}

const editarPelicula = (pelicula: IPelicula) => {
  formPelicula.titulo = pelicula.titulo
  formPelicula.director = pelicula.director || ''
  formPelicula.duracion_min = pelicula.duracion_min || 0
  formPelicula.genero = pelicula.genero || ''
  formPelicula.clasificacion = pelicula.clasificacion || ''
  formPelicula.poster_url = pelicula.poster_url || ''
  formPelicula.sinopsis = pelicula.sinopsis || ''
  formPelicula.fecha_inicio = pelicula.fecha_inicio || ''
  formPelicula.fecha_fin = pelicula.fecha_fin || ''
  
  peliculaEditando.value = pelicula.id
  modoAgregar.value = 'manual'
  peliculaSeleccionada.value = true
}

const eliminarPelicula = async (id: string) => {
  if (!confirm('¿Estás seguro de eliminar esta película?')) return

  try {
    const { error } = await supabase
      .from('peliculas')
      .delete()
      .eq('id', id)

    if (error) throw error
    
    alert('Película eliminada correctamente')
    await cargarPeliculas()
    await cargarEstadisticas()
  } catch (error) {
    console.error('Error eliminando película:', error)
    alert('Error al eliminar la película')
  }
}

const cancelarFormulario = () => {
  formPelicula.titulo = ''
  formPelicula.director = ''
  formPelicula.duracion_min = 0
  formPelicula.genero = ''
  formPelicula.clasificacion = ''
  formPelicula.poster_url = ''
  formPelicula.sinopsis = ''
  formPelicula.fecha_inicio = ''
  formPelicula.fecha_fin = ''
  peliculaSeleccionada.value = false
  peliculaEditando.value = null
  resultadosBusqueda.value = []
  searchQuery.value = ''
}

// Funciones para Horarios
const calcularHoraFin = (horaInicio: string, duracionMin: number): string => {
  const [horas, minutos] = horaInicio.split(':').map(Number)
  const fecha = new Date()
  fecha.setHours(horas || 0, minutos || 0, 0)
  fecha.setMinutes(fecha.getMinutes() + duracionMin)
  
  return fecha.toTimeString().slice(0, 5)
}

const validarSolapamiento = () => {
  const { fecha, hora_inicio, sala_id, pelicula_id } = formFuncion
  
  if (!fecha || !hora_inicio || !sala_id || !pelicula_id) return true
  
  const peliculaActual = peliculas.value.find(p => p.id === pelicula_id)
  if (!peliculaActual || !peliculaActual.duracion_min) return true
  
  const inicioNuevo = new Date(`${fecha}T${hora_inicio}`)
  const finNuevo = new Date(inicioNuevo.getTime() + peliculaActual.duracion_min * 60000)
  
  for (const funcion of funciones.value) {
    if (funcion.fecha === fecha && funcion.sala_id === sala_id) {
      const inicioExistente = new Date(`${funcion.fecha}T${funcion.hora_inicio}`)
      const finExistente = new Date(`${funcion.fecha}T${funcion.hora_fin}`)
      
      if (inicioNuevo < finExistente && finNuevo > inicioExistente) {
        const salaNombre = salas.value.find(s => s.id === sala_id)?.nombre || 'esta sala'
        errorHorario.value = `Ya existe una función programada en ${salaNombre} que se solapa con este horario`
        return false
      }
    }
  }
  
  errorHorario.value = ''
  return true
}

const guardarFuncion = async () => {
  if (!validarSolapamiento()) {
    return
  }
  
  try {
    const peliculaActual = peliculas.value.find(p => p.id === formFuncion.pelicula_id)
    if (!peliculaActual || !peliculaActual.duracion_min) {
      alert('Error: No se pudo obtener la duración de la película')
      return
    }

    const hora_fin = calcularHoraFin(formFuncion.hora_inicio, peliculaActual.duracion_min)
    
    const funcionData = {
      pelicula_id: formFuncion.pelicula_id,
      sala_id: formFuncion.sala_id,
      fecha: formFuncion.fecha,
      hora_inicio: formFuncion.hora_inicio,
      hora_fin: hora_fin
    }

    const { error } = await supabase
      .from('funciones')
      .insert([funcionData])

    if (error) throw error
    
    alert('Función programada correctamente')
    await cargarFunciones()
    await cargarEstadisticas()
    cancelarFormularioFuncion()
  } catch (error) {
    console.error('Error guardando función:', error)
    alert('Error al programar la función')
  }
}

const eliminarFuncion = async (id: string) => {
  if (!confirm('¿Estás seguro de eliminar esta función?')) return

  try {
    const { error } = await supabase
      .from('funciones')
      .delete()
      .eq('id', id)

    if (error) throw error
    
    alert('Función eliminada correctamente')
    await cargarFunciones()
    await cargarEstadisticas()
  } catch (error) {
    console.error('Error eliminando función:', error)
    alert('Error al eliminar la función')
  }
}

const cancelarFormularioFuncion = () => {
  formFuncion.pelicula_id = ''
  formFuncion.sala_id = ''
  formFuncion.fecha = ''
  formFuncion.hora_inicio = ''
  formFuncion.hora_fin = ''
  errorHorario.value = ''
}

// Helpers
const obtenerTituloPelicula = (id: string) => {
  return peliculas.value.find(p => p.id === id)?.titulo || 'Película no encontrada'
}

const obtenerNombreSala = (id: string) => {
  return salas.value.find(s => s.id === id)?.nombre || 'Sala no encontrada'
}

const formatearFecha = (fecha: string) => {
  return new Date(fecha + 'T00:00:00').toLocaleDateString('es-ES', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>