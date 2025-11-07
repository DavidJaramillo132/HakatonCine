<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4 max-w-2xl">
      <div class="bg-white rounded-xl shadow-lg p-8">
        <h1 class="text-3xl font-bold text-[#8B0000] mb-6 text-center">
          🎫 Generador de QR - Reserva
        </h1>

        <!-- Formulario de Información -->
        <div v-if="!qrGenerado" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nombre Completo *
            </label>
            <input
              v-model="formulario.nombre"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent"
              placeholder="Ej: Juan Pérez García"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Correo Electrónico *
            </label>
            <input
              v-model="formulario.correo"
              type="email"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent"
              placeholder="juan.perez@uleam.edu.ec"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Carrera
            </label>
            <input
              v-model="formulario.carrera"
              type="text"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent"
              placeholder="Ej: Ingeniería en Sistemas"
            />
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
              Función *
            </label>
            <select
              v-model="formulario.funcion_id"
              required
              :disabled="!formulario.pelicula_id"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent disabled:opacity-50"
            >
              <option value="">Seleccionar función...</option>
              <option v-for="funcion in funcionesFiltradas" :key="funcion.id" :value="funcion.id">
                {{ formatearFecha(funcion.fecha) }} - {{ funcion.hora_inicio }}
              </option>
            </select>
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
          </div>

          <button
            @click="generarQR"
            :disabled="!formularioValido"
            class="w-full bg-[#8B0000] text-white py-4 rounded-lg font-semibold text-lg hover:bg-[#A52A2A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🎫 Generar Código QR
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
                <p class="text-gray-900">{{ formulario.nombre }}</p>
              </div>
              <div class="col-span-2">
                <span class="font-medium text-gray-700">Correo:</span>
                <p class="text-gray-900">{{ formulario.correo }}</p>
              </div>
              <div v-if="formulario.carrera" class="col-span-2">
                <span class="font-medium text-gray-700">Carrera:</span>
                <p class="text-gray-900">{{ formulario.carrera }}</p>
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
              class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              📥 Descargar QR
            </button>
            
            <button
              @click="reiniciar"
              class="w-full bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
            >
              🔄 Generar Nuevo QR
            </button>
          </div>

          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
            <p class="font-medium mb-2">💡 Instrucciones:</p>
            <ul class="list-disc list-inside space-y-1">
              <li>Descarga o guarda una captura del código QR</li>
              <li>Presenta este QR en la entrada del cine</li>
              <li>El personal escaneará tu código para validar tu entrada</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import QRCode from 'qrcode'
import { supabase } from '../lib/connectSupabase'
import type { IPelicula } from '../interface/IPeliculas'
import type { Funcion } from '../interface/IFuncion'

// Referencias
const qrCanvas = ref<HTMLCanvasElement | null>(null)
const qrGenerado = ref(false)
const reservaId = ref('')

// Datos
const peliculas = ref<IPelicula[]>([])
const funciones = ref<Funcion[]>([])

// Formulario
const formulario = ref({
  nombre: '',
  correo: '',
  carrera: '',
  pelicula_id: '',
  funcion_id: '',
  asientos: 1
})

// Computeds
const formularioValido = computed(() => {
  return (
    formulario.value.nombre.trim() !== '' &&
    formulario.value.correo.trim() !== '' &&
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
  await cargarPeliculas()
  await cargarFunciones()
})

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
  try {
    // 1. Crear usuario si no existe
    const { data: usuarioData, error: usuarioError } = await supabase
      .from('usuario')
      .upsert({
        nombre: formulario.value.nombre,
        correo: formulario.value.correo,
        carrera: formulario.value.carrera,
        rol: 'estudiante'
      }, {
        onConflict: 'correo',
        ignoreDuplicates: false
      })
      .select()
      .single()

    if (usuarioError) throw usuarioError

    const usuarioId = usuarioData.id

    // 2. Crear reserva
    const { data: reservaData, error: reservaError } = await supabase
      .from('reservas')
      .insert({
        usuario_id: usuarioId,
        funcion_id: formulario.value.funcion_id,
        asientos: formulario.value.asientos,
        estado: 'activa'
      })
      .select()
      .single()

    if (reservaError) throw reservaError

    reservaId.value = reservaData.id

    // 3. Preparar datos para el QR
    const qrData = {
      reserva_id: reservaData.id,
      nombre: formulario.value.nombre,
      correo: formulario.value.correo,
      carrera: formulario.value.carrera,
      pelicula: peliculaSeleccionada.value?.titulo,
      fecha: funcionSeleccionada.value?.fecha,
      hora: funcionSeleccionada.value?.hora_inicio,
      asientos: formulario.value.asientos,
      creado_en: new Date().toISOString()
    }

    const qrString = JSON.stringify(qrData)

    // 4. Generar código QR visual
    if (qrCanvas.value) {
      await QRCode.toCanvas(qrCanvas.value, qrString, {
        width: 300,
        margin: 2,
        color: {
          dark: '#8B0000',
          light: '#FFFFFF'
        }
      })
    }

    // 5. Guardar ticket QR en base de datos
    const { error: ticketError } = await supabase
      .from('ticket_qr')
      .insert({
        reserva_id: reservaData.id,
        codigo_qr: qrString,
        estado: 'activo',
        fecha_generacion: new Date().toISOString()
      })

    if (ticketError) throw ticketError

    qrGenerado.value = true
  } catch (error) {
    console.error('Error generando QR:', error)
    alert('Error al generar el código QR: ' + (error as Error).message)
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
    nombre: '',
    correo: '',
    carrera: '',
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
