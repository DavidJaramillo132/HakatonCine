<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4 max-w-2xl">
      <div class="bg-white rounded-xl shadow-lg p-8">
        <h1 class="text-3xl font-bold text-[#8B0000] mb-2 text-center">
          🎫 {{ qrGenerado ? 'Tu Código QR' : 'Completa tu Reserva' }}
        </h1>
        <p v-if="!qrGenerado" class="text-center text-gray-600 mb-6">
          {{ peliculaSeleccionada ? `Has seleccionado: ${peliculaSeleccionada.titulo}` : 'Selecciona una película y función' }}
        </p>

        <!-- Formulario de Información -->
        <div v-if="!qrGenerado" class="space-y-6">
          <!-- Información del Usuario Autenticado -->
          <div v-if="usuarioActual" class="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 class="font-bold text-lg text-gray-800 mb-4">👤 Tu Información</h3>
            <div class="space-y-2 text-sm">
              <div>
                <span class="font-medium text-gray-700">Nombre:</span>
                <p class="text-gray-900">{{ usuarioActual.nombre }}</p>
              </div>
              <div>
                <span class="font-medium text-gray-700">Correo:</span>
                <p class="text-gray-900">{{ usuarioActual.correo }}</p>
              </div>
              <div v-if="usuarioActual.carrera">
                <span class="font-medium text-gray-700">Carrera:</span>
                <p class="text-gray-900">{{ usuarioActual.carrera }}</p>
              </div>
            </div>
          </div>

          <!-- Película Seleccionada (si viene de cartelera) -->
          <div v-if="peliculaSeleccionada" class="bg-gradient-to-r from-[#8B0000] to-[#A52A2A] rounded-lg p-6 text-white">
            <div class="flex gap-4 items-center">
              <img 
                v-if="peliculaSeleccionada.poster_url"
                :src="peliculaSeleccionada.poster_url" 
                :alt="peliculaSeleccionada.titulo"
                class="w-20 h-28 object-cover rounded-lg shadow-lg"
              />
              <div class="flex-1">
                <h3 class="font-bold text-xl mb-2">🎬 {{ peliculaSeleccionada.titulo }}</h3>
                <div class="text-sm space-y-1 opacity-90">
                  <p v-if="peliculaSeleccionada.duracion_min">⏱️ {{ peliculaSeleccionada.duracion_min }} min</p>
                  <p v-if="peliculaSeleccionada.genero">🎭 {{ peliculaSeleccionada.genero }}</p>
                  <p v-if="peliculaSeleccionada.clasificacion">🔞 {{ peliculaSeleccionada.clasificacion }}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Película *
            </label>
            <select
              v-model="formulario.pelicula_id"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent"
            >
              <option value="">Seleccionar película...</option>
              <option v-for="pelicula in peliculas" :key="pelicula.id" :value="pelicula.id">
                {{ pelicula.titulo }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Función (Fecha y Hora) *
            </label>
            <select
              v-model="formulario.funcion_id"
              required
              :disabled="!formulario.pelicula_id"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent disabled:opacity-50"
            >
              <option value="">Seleccionar función...</option>
              <option v-for="funcion in funcionesFiltradas" :key="funcion.id" :value="funcion.id">
                📅 {{ formatearFecha(funcion.fecha) }} - 🕐 {{ funcion.hora_inicio }}
              </option>
            </select>
            <p v-if="!formulario.pelicula_id" class="text-sm text-gray-500 mt-1">
              Primero selecciona una película
            </p>
            <p v-else-if="funcionesFiltradas.length === 0" class="text-sm text-orange-600 mt-1">
              ⚠️ No hay funciones disponibles para esta película
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Número de Asientos *
            </label>
            <input
              v-model.number="formulario.asientos"
              type="number"
              min="1"
              max="10"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent"
              placeholder="1"
            />
            <p class="text-sm text-gray-500 mt-1">Máximo 10 asientos por reserva</p>
          </div>

          <button
            @click="generarQR"
            :disabled="!formularioValido"
            class="w-full bg-[#8B0000] text-white py-4 rounded-lg font-semibold text-lg hover:bg-[#A52A2A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
          >
            🎫 Generar Mi Código QR
          </button>
          
          <button
            @click="router.push('/cartelera')"
            class="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            ← Volver a Cartelera
          </button>
        </div>

        <!-- QR Generado -->
        <div v-else class="space-y-6">
          <div class="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <p class="text-green-800 font-medium">
              ✅ ¡QR Generado Exitosamente!
            </p>
          </div>

          <!-- Información de la Reserva -->
          <div class="bg-gray-50 rounded-lg p-6 space-y-3">
            <h3 class="font-bold text-lg text-gray-800 mb-4">📋 Información de la Reserva</h3>
            <div class="grid grid-cols-2 gap-3 text-sm">
              <div class="col-span-2">
                <span class="font-medium text-gray-700">Nombre:</span>
                <p class="text-gray-900">{{ usuarioActual?.nombre }}</p>
              </div>
              <div class="col-span-2">
                <span class="font-medium text-gray-700">Correo:</span>
                <p class="text-gray-900">{{ usuarioActual?.correo }}</p>
              </div>
              <div v-if="usuarioActual?.carrera" class="col-span-2">
                <span class="font-medium text-gray-700">Carrera:</span>
                <p class="text-gray-900">{{ usuarioActual.carrera }}</p>
              </div>
              <div class="col-span-2">
                <span class="font-medium text-gray-700">Película:</span>
                <p class="text-gray-900">{{ peliculaSeleccionada?.titulo }}</p>
              </div>
              <div>
                <span class="font-medium text-gray-700">Fecha:</span>
                <p class="text-gray-900">{{ formatearFecha(funcionSeleccionada?.fecha || '') }}</p>
              </div>
              <div>
                <span class="font-medium text-gray-700">Hora:</span>
                <p class="text-gray-900">{{ funcionSeleccionada?.hora_inicio }}</p>
              </div>
              <div>
                <span class="font-medium text-gray-700">Asientos:</span>
                <p class="text-gray-900">{{ formulario.asientos }}</p>
              </div>
              <div>
                <span class="font-medium text-gray-700">ID Reserva:</span>
                <p class="text-gray-900 text-xs">{{ reservaId }}</p>
              </div>
            </div>
          </div>

          <!-- Código QR -->
          <div class="bg-white border-4 border-[#8B0000] rounded-lg p-8 flex justify-center">
            <canvas ref="qrCanvas" class="max-w-full"></canvas>
          </div>

          <!-- Botones de Acción -->
          <div class="space-y-3">
            <button
              @click="descargarQR"
              class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              📥 Descargar QR
            </button>
            
            <button
              @click="router.push('/cartelera')"
              class="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              🎬 Ver Más Películas
            </button>
            
            <button
              @click="reiniciar"
              class="w-full bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
            >
              🔄 Generar Nueva Reserva
            </button>
          </div>

          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
            <p class="font-medium mb-2">💡 Instrucciones:</p>
            <ul class="list-disc list-inside space-y-1">
              <li>Descarga o guarda una captura del código QR</li>
              <li>Presenta este QR en la entrada del cine</li>
              <li>El personal escaneará tu código para validar tu entrada</li>
              <li>Llega 15 minutos antes del inicio de la función</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import QRCode from 'qrcode'
import { supabase } from '../lib/connectSupabase'
import type { IPelicula } from '../interface/IPeliculas'
import type { Funcion } from '../interface/IFuncion'

const router = useRouter()
const route = useRoute()

// Referencias
const qrCanvas = ref<HTMLCanvasElement | null>(null)
const qrGenerado = ref(false)
const reservaId = ref('')
const usuarioActual = ref<any>(null)

// Datos
const peliculas = ref<IPelicula[]>([])
const funciones = ref<Funcion[]>([])

// Formulario (solo película, función y asientos)
const formulario = ref({
  pelicula_id: '',
  funcion_id: '',
  asientos: 1
})

// Computeds
const formularioValido = computed(() => {
  return (
    usuarioActual.value &&
    formulario.value.pelicula_id !== '' &&
    formulario.value.funcion_id !== '' &&
    formulario.value.asientos > 0
  )
})

const funcionesFiltradas = computed(() => {
  if (!formulario.value.pelicula_id) return []
  return funciones.value.filter(f => f.pelicula_id === formulario.value.pelicula_id)
})

const peliculaSeleccionada = computed(() => {
  return peliculas.value.find(p => p.id === formulario.value.pelicula_id)
})

const funcionSeleccionada = computed(() => {
  return funciones.value.find(f => f.id === formulario.value.funcion_id)
})

// Cargar datos
onMounted(async () => {
  await verificarAutenticacion()
  await cargarPeliculas()
  await cargarFunciones()
  
  // Si viene una película preseleccionada desde la URL
  const peliculaIdQuery = route.query.pelicula_id as string
  if (peliculaIdQuery) {
    formulario.value.pelicula_id = peliculaIdQuery
  }
})

// Verificar que el usuario esté autenticado
const verificarAutenticacion = async () => {
  const userId = localStorage.getItem('userId')
  
  if (!userId) {
    alert('Debes iniciar sesión para generar un código QR')
    router.push('/login')
    return
  }

  try {
    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    
    usuarioActual.value = usuario
  } catch (error) {
    console.error('Error obteniendo usuario:', error)
    alert('Error al cargar información del usuario')
    router.push('/login')
  }
}

const cargarPeliculas = async () => {
  try {
    const { data, error } = await supabase
      .from('peliculas')
      .select('*')
      .order('titulo', { ascending: true })

    if (error) throw error
    peliculas.value = data || []
  } catch (error) {
    console.error('Error cargando películas:', error)
  }
}

const cargarFunciones = async () => {
  try {
    const { data, error } = await supabase
      .from('funciones')
      .select('*')
      .gte('fecha', new Date().toISOString().split('T')[0])
      .order('fecha', { ascending: true })

    if (error) throw error
    funciones.value = data || []
  } catch (error) {
    console.error('Error cargando funciones:', error)
  }
}

const generarQR = async () => {
  if (!usuarioActual.value) {
    alert('Debes iniciar sesión para generar un código QR')
    router.push('/login')
    return
  }

  try {
    console.log('Iniciando generación de QR...')
    
    // 1. Crear reserva con el usuario autenticado
    const { data: reservaData, error: reservaError } = await supabase
      .from('reservas')
      .insert({
        usuario_id: usuarioActual.value.id,
        funcion_id: formulario.value.funcion_id,
        asientos: formulario.value.asientos,
        estado: 'activa'
      })
      .select()
      .single()

    if (reservaError) {
      console.error('Error creando reserva:', reservaError)
      throw reservaError
    }

    console.log('Reserva creada:', reservaData)
    reservaId.value = reservaData.id

    // 2. Preparar datos para el QR (incluye toda la información del usuario)
    const qrData = {
      reserva_id: reservaData.id,
      usuario_id: usuarioActual.value.id,
      nombre: usuarioActual.value.nombre,
      correo: usuarioActual.value.correo,
      carrera: usuarioActual.value.carrera || '',
      pelicula: peliculaSeleccionada.value?.titulo,
      fecha: funcionSeleccionada.value?.fecha,
      hora: funcionSeleccionada.value?.hora_inicio,
      asientos: formulario.value.asientos,
      creado_en: new Date().toISOString()
    }

    const qrString = JSON.stringify(qrData)
    console.log('Datos del QR:', qrData)
    console.log('String del QR:', qrString)

    // 3. Guardar ticket QR en base de datos PRIMERO
    const { error: ticketError } = await supabase
      .from('tickets_qr')
      .insert({
        reserva_id: reservaData.id,
        codigo_qr: qrString,
        estado: 'activo',
        fecha_generacion: new Date().toISOString()
      })

    if (ticketError) {
      console.error('Error guardando ticket:', ticketError)
      throw ticketError
    }

    console.log('Ticket guardado en BD')

    // 4. Marcar como generado para mostrar el canvas
    qrGenerado.value = true

    // 5. Esperar a que el DOM se actualice completamente
    await nextTick()
    
    // Pequeño delay adicional para asegurar que el canvas esté en el DOM
    await new Promise(resolve => setTimeout(resolve, 100))

    if (!qrCanvas.value) {
      console.error('Canvas no encontrado en el DOM después de nextTick')
      throw new Error('No se pudo encontrar el elemento canvas')
    }

    console.log('Canvas encontrado, generando QR visual...')
    await QRCode.toCanvas(qrCanvas.value, qrString, {
      width: 300,
      margin: 2,
      color: {
        dark: '#8B0000',
        light: '#FFFFFF'
      }
    })

    console.log('✅ QR generado exitosamente en el canvas')
    alert('✅ ¡Reserva creada y QR generado exitosamente!')
    
  } catch (error) {
    console.error('Error generando QR:', error)
    alert('Error al generar el código QR: ' + (error as Error).message)
    // Revertir el estado si hubo error
    qrGenerado.value = false
    reservaId.value = ''
  }
}

const descargarQR = () => {
  if (qrCanvas.value) {
    const link = document.createElement('a')
    link.download = `ticket-${reservaId.value}.png`
    link.href = qrCanvas.value.toDataURL()
    link.click()
  }
}

const reiniciar = () => {
  formulario.value = {
    pelicula_id: '',
    funcion_id: '',
    asientos: 1
  }
  qrGenerado.value = false
  reservaId.value = ''
}

const formatearFecha = (fecha: string) => {
  if (!fecha) return ''
  return new Date(fecha + 'T00:00:00').toLocaleDateString('es-ES', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>
