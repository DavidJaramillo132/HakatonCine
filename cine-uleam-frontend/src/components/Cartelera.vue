<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-12">
        <div class="text-center md:text-left">
          <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3">
            Cartelera de Películas
          </h1>
          <p class="text-lg text-gray-600">
            Descubre las películas en cartelera
          </p>
        </div>
        <RouterLink
          to="/sugerencia"
          class="inline-flex items-center justify-center gap-2 bg-[#8B0000] text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-[#A52A2A] hover:scale-105 transition-all duration-200"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Crear sugerencia
        </RouterLink>
      </div>

      <!-- Filtros -->
      <div class="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Filtro de Género -->
          <div>
            <label for="genero" class="block text-sm font-medium text-gray-700 mb-2">
              Género
            </label>
            <select 
              id="genero" 
              v-model="filtroGenero"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B0000] focus:border-transparent transition duration-200"
            >
              <option value="">Todos los generos</option>
              <option value="Acción">Acción</option>
              <option value="Comedia">Comedia</option>
              <option value="Drama">Drama</option>
              <option value="Terror">Terror</option>
              <option value="Ciencia Ficción">Ciencia Ficción</option>
              <option value="Romance">Romance</option>
              <option value="Aventura">Aventura</option>
            </select>
          </div>

          <!-- Filtro de Clasificación -->
          <div>
            <label for="clasificacion" class="block text-sm font-medium text-gray-700 mb-2">
              Clasificación
            </label>
            <select 
              id="clasificacion" 
              v-model="filtroClasificacion"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B0000] focus:border-transparent transition duration-200"
            >
              <option value="">Todas las clasificaciones</option>
              <option value="ATP">ATP</option>
              <option value="+13">+13</option>
              <option value="+16">+16</option>
              <option value="+18">+18</option>
            </select>
          </div>

          <!-- Búsqueda -->
          <div>
            <label for="busqueda" class="block text-sm font-medium text-gray-700 mb-2">
              Buscar película
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input 
                id="busqueda"
                type="text" 
                v-model="busqueda" 
                placeholder="Buscar por título..."
                class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B0000] focus:border-transparent transition duration-200"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#8B0000]"></div>
        <p class="mt-4 text-lg text-gray-600">Cargando películas...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
        <svg class="mx-auto h-12 w-12 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-red-700 text-lg mb-4">{{ error }}</p>
        <button 
          @click="cargarPeliculas" 
          class="bg-[#8B0000] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#A52A2A] hover:scale-105 transition-all duration-200"
        >
          Reintentar
        </button>
      </div>

      <!-- Grid de Películas -->
      <div v-else-if="peliculasFiltradas.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div 
          v-for="pelicula in peliculasFiltradas" 
          :key="pelicula.id" 
          class="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
        >
          <!-- Poster -->
          <div class="relative group overflow-hidden aspect-[2/3]">
            <img 
              :src="pelicula.poster_url || 'https://via.placeholder.com/300x450?text=Sin+Poster'" 
              :alt="pelicula.titulo"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <!-- Overlay con botones -->
            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-80 transition-all duration-300 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
              <button 
                @click="verDetalles(pelicula)" 
                class="bg-white text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 transform hover:scale-105"
              >
                Ver Detalles
              </button>
              <button 
                @click="reservar(pelicula)" 
                class="bg-[#8B0000] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#A52A2A] transition-all duration-200 transform hover:scale-105"
              >
                Reservar
              </button>
            </div>
          </div>

          <!-- Info de la Película -->
          <div class="p-5">
            <h3 class="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
              {{ pelicula.titulo }}
            </h3>
            
            <!-- Metadata -->
            <div class="flex flex-wrap gap-2 mb-3">
              <span v-if="pelicula.duracion_min" class="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                {{ pelicula.duracion_min }} min
              </span>
              <span v-if="pelicula.clasificacion" class="text-xs bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-semibold">
                {{ pelicula.clasificacion }}
              </span>
            </div>

            <!-- Género -->
            <div v-if="pelicula.genero" class="mb-3">
              <span class="inline-block bg-[#8B0000] text-white text-xs px-3 py-1 rounded-full font-semibold">
                {{ pelicula.genero }}
              </span>
            </div>

            <!-- Sinopsis -->
            <p v-if="pelicula.sinopsis" class="text-sm text-gray-600 line-clamp-3 mb-3">
              {{ pelicula.sinopsis }}
            </p>

            <!-- Director -->
            <div v-if="pelicula.director" class="text-sm text-gray-500">
              <span class="font-semibold">Director:</span> {{ pelicula.director }}
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-20">
        <svg class="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
        </svg>
        <p class="text-xl text-gray-500">No se encontraron películas</p>
        <p class="text-gray-400 mt-2">Intenta ajustar los filtros de búsqueda</p>
      </div>
    </div>

    <!-- Modal de Detalles -->
    <div 
      v-if="peliculaSeleccionada" 
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      @click="cerrarModal"
    >
      <div 
        class="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl"
        @click.stop
      >
        <!-- Botón Cerrar -->
        <button 
          @click="cerrarModal"
          class="absolute top-4 right-4 bg-[#8B0000] text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#A52A2A] transition-all duration-200 z-10 shadow-lg"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <!-- Contenido del Modal -->
        <div class="grid grid-cols-1 md:grid-cols-5 gap-6 p-8">
          <!-- Poster -->
          <div class="md:col-span-2">
            <img 
              :src="peliculaSeleccionada.poster_url || 'https://via.placeholder.com/300x450?text=Sin+Poster'" 
              :alt="peliculaSeleccionada.titulo"
              class="w-full rounded-xl shadow-lg"
            />
          </div>

          <!-- Información -->
          <div class="md:col-span-3 space-y-4">
            <h2 class="text-3xl font-extrabold text-gray-900">
              {{ peliculaSeleccionada.titulo }}
            </h2>
            
            <!-- Metadata -->
            <div class="flex flex-wrap gap-2">
              <span v-if="peliculaSeleccionada.duracion_min" class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm">
                {{ peliculaSeleccionada.duracion_min }} min
              </span>
              <span v-if="peliculaSeleccionada.clasificacion" class="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg text-sm font-semibold">
                {{ peliculaSeleccionada.clasificacion }}
              </span>
            </div>

            <!-- Género -->
            <div v-if="peliculaSeleccionada.genero">
              <span class="text-sm font-semibold text-gray-700">Género:</span>
              <span class="ml-2 inline-block bg-[#8B0000] text-white px-3 py-1 rounded-full text-sm">
                {{ peliculaSeleccionada.genero }}
              </span>
            </div>

            <!-- Director -->
            <div v-if="peliculaSeleccionada.director" class="text-gray-700">
              <span class="font-semibold">Director:</span> {{ peliculaSeleccionada.director }}
            </div>

            <!-- Sinopsis -->
            <div v-if="peliculaSeleccionada.sinopsis">
              <h3 class="text-xl font-bold text-gray-900 mb-2">Sinopsis</h3>
              <p class="text-gray-600 leading-relaxed">
                {{ peliculaSeleccionada.sinopsis }}
              </p>
            </div>

            <!-- Botón de Reserva -->
            <div class="pt-4">
              <button 
                @click="reservar(peliculaSeleccionada)" 
                class="w-full bg-[#8B0000] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#A52A2A] hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Reservar Entradas
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/connectSupabase'
import type { IPelicula } from '../interface/IPeliculas'

const router = useRouter()

// Estado
const peliculas = ref<IPelicula[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const peliculaSeleccionada = ref<IPelicula | null>(null)

// Filtros
const busqueda = ref('')
const filtroGenero = ref('')
const filtroClasificacion = ref('')

// Cargar películas desde Supabase
const cargarPeliculas = async () => {
  try {
    loading.value = true
    error.value = null

    const { data, error: supabaseError } = await supabase
      .from('peliculas')
      .select('*')
      .order('titulo', { ascending: true })

    if (supabaseError) throw supabaseError

    peliculas.value = data || []
  } catch (err) {
    error.value = 'Error al cargar las películas. Por favor, intenta de nuevo.'
    console.error('Error:', err)
  } finally {
    loading.value = false
  }
}

// Películas filtradas
const peliculasFiltradas = computed(() => {
  return peliculas.value.filter(pelicula => {
    const coincideBusqueda = pelicula.titulo.toLowerCase().includes(busqueda.value.toLowerCase())
    const coincideGenero = !filtroGenero.value || pelicula.genero === filtroGenero.value
    const coincideClasificacion = !filtroClasificacion.value || pelicula.clasificacion === filtroClasificacion.value

    return coincideBusqueda && coincideGenero && coincideClasificacion
  })
})

// Funciones
const verDetalles = (pelicula: IPelicula) => {
  peliculaSeleccionada.value = pelicula
}

const cerrarModal = () => {
  peliculaSeleccionada.value = null
}

const reservar = (pelicula: IPelicula) => {
  // Verificar autenticación
  const userId = localStorage.getItem('userId')
  
  if (!userId) {
    alert('Debes iniciar sesión para hacer una reserva')
    router.push('/login')
    return
  }
  
  // Redirigir a generar QR con la película preseleccionada
  router.push({
    path: '/generar-qr',
    query: { pelicula_id: pelicula.id }
  })
  
  cerrarModal()
}

// Lifecycle
onMounted(() => {
  cargarPeliculas()
})
</script>