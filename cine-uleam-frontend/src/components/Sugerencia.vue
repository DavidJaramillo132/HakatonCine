<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
        <div>
          <h1 class="text-3xl md:text-4xl font-extrabold text-gray-900">Enviar sugerencia</h1>
          <p class="mt-2 text-gray-600 max-w-2xl">
            Selecciona la película que deseas sugerir para la cartelera y agrega un mensaje opcional para el administrador.
          </p>
        </div>
        <RouterLink
          to="/cartelera"
          class="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-5 py-3 rounded-xl font-semibold shadow-sm hover:bg-gray-50 transition-all duration-200"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Volver a la cartelera
        </RouterLink>
      </div>

      <div class="bg-white rounded-2xl shadow-xl p-6 md:p-10 space-y-8">
        <section>
          <h2 class="text-xl font-bold text-gray-900 mb-4">Buscar y filtrar películas</h2>
          <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div class="lg:col-span-2">
              <label for="busquedaApi" class="block text-sm font-medium text-gray-700 mb-2">Buscar película en la API</label>
              <div class="flex flex-col sm:flex-row gap-3">
                <input
                  id="busquedaApi"
                  v-model="busquedaApi"
                  type="text"
                  placeholder="Ingresa al menos 3 caracteres"
                  class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B0000] focus:border-transparent transition duration-200"
                  @keyup.enter="buscarPeliculasApi(true)"
                />
                <button
                  type="button"
                  @click="buscarPeliculasApi(true)"
                  :disabled="loading || busquedaApi.trim().length < 3"
                  class="inline-flex items-center justify-center bg-[#8B0000] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#A52A2A] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {{ loading ? 'Buscando...' : 'Buscar en la API' }}
                </button>
              </div>
              <p class="text-sm text-gray-500 mt-2">Utiliza palabras clave (ej. "Spider-Man", "Interestelar").</p>
            </div>

            <div>
              <label for="filtroTitulo" class="block text-sm font-medium text-gray-700 mb-2">Filtrar resultados</label>
              <input
                id="filtroTitulo"
                v-model="filtroTitulo"
                type="text"
                placeholder="Filtrar por título cargado"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B0000] focus:border-transparent transition duration-200"
              />
            </div>

            <div>
              <label for="genero" class="block text-sm font-medium text-gray-700 mb-2">Género</label>
              <select
                id="genero"
                v-model="filtroGenero"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B0000] focus:border-transparent transition duration-200"
              >
                <option value="">Todos los géneros</option>
                <option v-for="genero in generosDisponibles" :key="genero" :value="genero">{{ genero }}</option>
              </select>
            </div>

            <div>
              <label for="clasificacion" class="block text-sm font-medium text-gray-700 mb-2">Clasificación</label>
              <select
                id="clasificacion"
                v-model="filtroClasificacion"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B0000] focus:border-transparent transition duration-200"
              >
                <option value="">Todas las clasificaciones</option>
                <option v-for="clasificacion in clasificacionesDisponibles" :key="clasificacion" :value="clasificacion">
                  {{ clasificacion }}
                </option>
              </select>
            </div>
          </div>

          <p v-if="textoResultados" class="mt-4 text-sm text-gray-500">{{ textoResultados }}</p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-gray-900 mb-4">Selecciona la película</h2>

          <div v-if="loading" class="py-10 text-center">
            <div class="inline-block animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-[#8B0000]"></div>
            <p class="mt-4 text-gray-500">Buscando películas en la API...</p>
          </div>

          <div v-else-if="error" class="py-8 px-6 bg-red-50 border border-red-200 rounded-2xl text-red-700">
            <p class="font-semibold mb-3">No fue posible cargar las películas.</p>
            <p class="text-sm">{{ error }}</p>
            <button
              @click="buscarPeliculasApi(true)"
              class="mt-4 bg-[#8B0000] text-white px-5 py-3 rounded-lg font-semibold hover:bg-[#A52A2A] transition-colors"
            >
              Reintentar
            </button>
          </div>

          <div v-else>
            <div v-if="peliculasFiltradas.length" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              <label
                v-for="pelicula in peliculasFiltradas"
                :key="pelicula.id"
                class="flex items-start gap-4 border border-gray-200 rounded-2xl p-4 cursor-pointer hover:border-[#8B0000] transition-colors"
              >
                <input
                  type="radio"
                  name="pelicula"
                  class="mt-1 h-4 w-4 text-[#8B0000] focus:ring-[#8B0000]"
                  :value="pelicula.id"
                  v-model="peliculaSeleccionadaId"
                />
                <div class="space-y-2">
                  <p class="text-lg font-semibold text-gray-900">{{ pelicula.titulo }}</p>
                  <div class="flex flex-wrap gap-2 text-xs text-gray-600">
                    <span v-if="pelicula.genero" class="bg-gray-100 px-2.5 py-1 rounded-full">{{ pelicula.genero }}</span>
                    <span v-if="pelicula.clasificacion" class="bg-yellow-100 text-yellow-800 px-2.5 py-1 rounded-full font-semibold">
                      {{ pelicula.clasificacion }}
                    </span>
                    <span v-if="pelicula.duracion_min" class="bg-gray-100 px-2.5 py-1 rounded-full">{{ pelicula.duracion_min }} min</span>
                  </div>
                  <p v-if="pelicula.sinopsis" class="text-sm text-gray-500 line-clamp-3">{{ pelicula.sinopsis }}</p>
                </div>
              </label>
            </div>

            <div v-if="peliculasFiltradas.length && puedeCargarMas" class="mt-6 text-center">
              <button
                type="button"
                @click="cargarMasPeliculas"
                :disabled="cargandoMas"
                class="inline-flex items-center justify-center bg-gray-100 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {{ cargandoMas ? 'Cargando más...' : 'Cargar más resultados' }}
              </button>
            </div>

            <div v-else class="py-10 text-center border-2 border-dashed border-gray-200 rounded-2xl">
              <p v-if="peliculas.length === 0" class="text-gray-500">Ingresa un título en el buscador superior y presiona "Buscar en la API".</p>
              <p v-else class="text-gray-500">No encontramos películas que coincidan con los filtros seleccionados.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 class="text-xl font-bold text-gray-900 mb-4">Mensaje para el administrador</h2>
          <textarea
            v-model="mensaje"
            rows="4"
            placeholder="Cuéntanos por qué te gustaría ver esta película o agrega detalles adicionales (opcional)"
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B0000] focus:border-transparent transition duration-200"
          ></textarea>
        </section>

        <div class="space-y-4">
          <div v-if="formError" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
            {{ formError }}
          </div>

          <div v-if="formSuccess" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
            {{ formSuccess }}
          </div>

          <button
            @click="enviarSugerencia"
            :disabled="enviando"
            class="w-full md:w-auto bg-[#8B0000] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#A52A2A] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {{ enviando ? 'Enviando sugerencia...' : 'Enviar sugerencia' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { supabase } from '../lib/connectSupabase'

interface PeliculaSugerencia {
  id: string
  titulo: string
  sinopsis?: string
  genero?: string
  clasificacion?: string
  duracion_min?: number
  poster_url?: string
}

const API_KEY = '34e63b5b'
const API_BASE_URL = 'https://www.omdbapi.com/'

const peliculas = ref<PeliculaSugerencia[]>([])
const loading = ref(false)
const cargandoMas = ref(false)
const error = ref<string | null>(null)

const busquedaApi = ref('')
const filtroTitulo = ref('')
const filtroGenero = ref('')
const filtroClasificacion = ref('')

const generosDisponibles = ref<string[]>([])
const clasificacionesDisponibles = ref<string[]>([])

const totalResultados = ref(0)
const paginaActual = ref(0)

const peliculaSeleccionadaId = ref('')
const mensaje = ref('')

const enviando = ref(false)
const formError = ref('')
const formSuccess = ref('')

const limpiarFiltrosDisponibles = () => {
  generosDisponibles.value = []
  clasificacionesDisponibles.value = []
}

const actualizarFiltrosDisponibles = () => {
  const generos = new Set<string>()
  const clasificaciones = new Set<string>()

  peliculas.value.forEach(pelicula => {
    if (pelicula.genero) {
      pelicula.genero
        .split(',')
        .map(genero => genero.trim())
        .filter(Boolean)
        .forEach(genero => generos.add(genero))
    }

    if (pelicula.clasificacion) {
      clasificaciones.add(pelicula.clasificacion)
    }
  })

  generosDisponibles.value = Array.from(generos).sort()
  clasificacionesDisponibles.value = Array.from(clasificaciones).sort()
}

const normalizarDetalle = (detalle: any, fallback: any): PeliculaSugerencia | null => {
  const base = detalle && detalle.Response !== 'False' ? detalle : null
  const id = base?.imdbID || fallback?.imdbID
  const titulo = base?.Title || fallback?.Title

  if (!id || !titulo) {
    return null
  }

  const runtime = base?.Runtime || ''
  const runtimeMatch = runtime.match(/(\d+)/)

  const genero = base?.Genre && base.Genre !== 'N/A' ? base.Genre : undefined
  const clasificacion = base?.Rated && base.Rated !== 'N/A' ? base.Rated : undefined
  const sinopsis = base?.Plot && base.Plot !== 'N/A' ? base.Plot : undefined
  const duracion = runtimeMatch ? Number(runtimeMatch[1]) : undefined
  const poster = base?.Poster && base.Poster !== 'N/A'
    ? base.Poster
    : fallback?.Poster && fallback.Poster !== 'N/A'
      ? fallback.Poster
      : undefined

  return {
    id,
    titulo,
    genero,
    clasificacion,
    sinopsis,
    duracion_min: duracion,
    poster_url: poster
  }
}

const obtenerPeliculasPorPagina = async (pagina: number): Promise<PeliculaSugerencia[]> => {
  const termino = busquedaApi.value.trim()
  const url = `${API_BASE_URL}?s=${encodeURIComponent(termino)}&type=movie&page=${pagina}&apikey=${API_KEY}`

  const respuesta = await fetch(url)

  if (!respuesta.ok) {
    throw new Error('No se pudo consultar la API externa.')
  }

  const data = await respuesta.json()

  if (data.Response === 'False') {
    throw new Error(data.Error || 'No se encontraron resultados con ese título.')
  }

  totalResultados.value = parseInt(data.totalResults, 10) || (Array.isArray(data.Search) ? data.Search.length : 0)

  const detalles = await Promise.all(
    (data.Search || []).map(async (item: any) => {
      try {
        const detalleResponse = await fetch(`${API_BASE_URL}?i=${item.imdbID}&plot=short&apikey=${API_KEY}`)
        const detalleData = await detalleResponse.json()
        return normalizarDetalle(detalleData, item)
      } catch (detalleError) {
        console.warn('No se pudo obtener detalle de la película:', detalleError)
        return normalizarDetalle(null, item)
      }
    })
  )

  return detalles.filter((pelicula): pelicula is PeliculaSugerencia => Boolean(pelicula))
}

const buscarPeliculasApi = async (reset = true) => {
  formError.value = ''
  formSuccess.value = ''
  error.value = null

  const termino = busquedaApi.value.trim()

  if (termino.length < 3) {
    error.value = 'Ingresa al menos 3 caracteres para buscar una película.'
    peliculas.value = []
    limpiarFiltrosDisponibles()
    return
  }

  if (reset) {
    loading.value = true
    peliculas.value = []
    peliculaSeleccionadaId.value = ''
    filtroTitulo.value = ''
    filtroGenero.value = ''
    filtroClasificacion.value = ''
    totalResultados.value = 0
    paginaActual.value = 0
    limpiarFiltrosDisponibles()
  } else {
    cargandoMas.value = true
  }

  try {
    const paginaObjetivo = reset ? 1 : paginaActual.value + 1
    const nuevasPeliculas = await obtenerPeliculasPorPagina(paginaObjetivo)

    if (reset) {
      peliculas.value = nuevasPeliculas
    } else {
      const existentes = new Set(peliculas.value.map(pelicula => pelicula.id))
      nuevasPeliculas.forEach(pelicula => {
        if (!existentes.has(pelicula.id)) {
          peliculas.value.push(pelicula)
        }
      })
    }

    paginaActual.value = paginaObjetivo
    actualizarFiltrosDisponibles()

    if (!peliculas.value.length) {
      error.value = 'No se encontraron películas con ese título. Intenta con otra búsqueda.'
    }
  } catch (err: any) {
    console.error('Error al buscar películas en la API:', err)
    error.value = err.message || 'No se pudo obtener información de la API. Intenta nuevamente.'
  } finally {
    if (reset) {
      loading.value = false
    } else {
      cargandoMas.value = false
    }
  }
}

const cargarMasPeliculas = async () => {
  if (cargandoMas.value || loading.value) return
  if (peliculas.value.length >= totalResultados.value) return

  await buscarPeliculasApi(false)
}

const peliculasFiltradas = computed(() => {
  return peliculas.value.filter(pelicula => {
    const coincideTitulo = !filtroTitulo.value || pelicula.titulo.toLowerCase().includes(filtroTitulo.value.toLowerCase())

    const coincideGenero = !filtroGenero.value || (
      pelicula.genero?.split(',').map(genero => genero.trim().toLowerCase()).includes(filtroGenero.value.toLowerCase())
    )

    const coincideClasificacion = !filtroClasificacion.value || pelicula.clasificacion === filtroClasificacion.value

    return coincideTitulo && coincideGenero && coincideClasificacion
  })
})

const puedeCargarMas = computed(() => {
  if (!peliculas.value.length) return false
  if (totalResultados.value === 0) return false
  return peliculas.value.length < totalResultados.value
})

const textoResultados = computed(() => {
  if (!peliculas.value.length) return ''
  const total = totalResultados.value || peliculas.value.length
  return `Mostrando ${peliculasFiltradas.value.length} de ${total} resultados disponibles`
})

const enviarSugerencia = async () => {
  formError.value = ''
  formSuccess.value = ''

  if (!peliculaSeleccionadaId.value) {
    formError.value = 'Selecciona la película que deseas sugerir.'
    return
  }

  const usuarioId = localStorage.getItem('userId')
  const usuarioNombre = localStorage.getItem('userName') || 'Usuario'
  const usuarioRol = localStorage.getItem('userRole')

  if (!usuarioId) {
    formError.value = 'Necesitas iniciar sesión con tu cuenta institucional para enviar una sugerencia.'
    return
  }

  if (usuarioRol !== 'estudiante') {
    formError.value = 'Solo los estudiantes pueden enviar sugerencias.'
    return
  }

  const peliculaSeleccionada = peliculas.value.find(pelicula => pelicula.id === peliculaSeleccionadaId.value)

  if (!peliculaSeleccionada) {
    formError.value = 'La película seleccionada ya no está disponible. Intenta nuevamente.'
    return
  }

  enviando.value = true

  try {
    const comentario = mensaje.value.trim()

    const mensajeNotificacion = [
      `Película sugerida: ${peliculaSeleccionada.titulo}`,
      peliculaSeleccionada.genero ? `Género: ${peliculaSeleccionada.genero}` : null,
      peliculaSeleccionada.clasificacion ? `Clasificación: ${peliculaSeleccionada.clasificacion}` : null,
      comentario ? `Comentario del estudiante: ${comentario}` : 'Sin comentario adicional.',
      `Enviada por: ${usuarioNombre}`
    ]
      .filter(Boolean)
      .join('\n')

    // Insertar la sugerencia directamente en la tabla de notificaciones
    // Los administradores verán todas las sugerencias en su vista
    // Nota: Usamos 'recomendacion' porque es el tipo permitido en el constraint de la BD
    const { error: notificacionError } = await supabase
      .from('notificaciones')
      .insert([{
        usuario_id: usuarioId, // Guardamos el ID del estudiante que envió la sugerencia
        titulo: 'Sugerencia de película',
        mensaje: mensajeNotificacion,
        tipo: 'recomendacion', // Usamos 'recomendacion' que está permitido en el constraint
        leida: false
      }])

    if (notificacionError) throw notificacionError

    formSuccess.value = '¡Listo! Tu sugerencia fue enviada al equipo administrador.'
    mensaje.value = ''
    peliculaSeleccionadaId.value = ''
  } catch (err: any) {
    console.error('Error al enviar la sugerencia:', err)
    formError.value = err.message || 'No se pudo enviar la sugerencia. Intenta nuevamente.'
  } finally {
    enviando.value = false
  }
}
</script>

<style scoped>
.line-clamp-3 {
  line-clamp: 3;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

