<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4 max-w-4xl">
      <div class="bg-white rounded-xl shadow-lg p-8">
        <h1 class="text-3xl font-bold text-[#8B0000] mb-6 text-center">
          📷 Escáner de QR - Validación de Entrada
        </h1>

        <!-- Opciones de Escaneo -->
        <div class="flex gap-4 mb-6">
          <button
            @click="modoEscaneo = 'camara'"
            :class="[
              'flex-1 py-3 px-4 rounded-lg font-medium transition-all',
              modoEscaneo === 'camara'
                ? 'bg-[#8B0000] text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            ]"
          >
            📷 Escanear con Cámara
          </button>
          <button
            @click="modoEscaneo = 'manual'"
            :class="[
              'flex-1 py-3 px-4 rounded-lg font-medium transition-all',
              modoEscaneo === 'manual'
                ? 'bg-[#8B0000] text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            ]"
          >
            ⌨️ Ingreso Manual
          </button>
        </div>

        <!-- Modo Cámara -->
        <div v-if="modoEscaneo === 'camara'" class="space-y-6">
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
            <p class="font-medium">💡 Instrucciones:</p>
            <ul class="list-disc list-inside mt-2 space-y-1">
              <li>Permite el acceso a la cámara cuando se solicite</li>
              <li>Apunta la cámara hacia el código QR</li>
              <li>El sistema detectará y validará automáticamente</li>
            </ul>
          </div>

          <div class="relative bg-black rounded-lg overflow-hidden" style="aspect-ratio: 4/3;">
            <video
              ref="videoElement"
              class="w-full h-full object-cover"
              autoplay
              playsinline
            ></video>
            
            <div v-if="escaneando" class="absolute inset-0 flex items-center justify-center">
              <div class="border-4 border-[#8B0000] rounded-lg" style="width: 250px; height: 250px;">
                <div class="w-full h-full border-2 border-white border-dashed animate-pulse"></div>
              </div>
            </div>
          </div>

          <div class="flex gap-4">
            <button
              v-if="!escaneando"
              @click="iniciarEscaneo"
              class="flex-1 bg-[#8B0000] text-white py-3 rounded-lg font-semibold hover:bg-[#A52A2A] transition-colors"
            >
              ▶️ Iniciar Escaneo
            </button>
            <button
              v-else
              @click="detenerEscaneo"
              class="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              ⏹️ Detener Escaneo
            </button>
          </div>
        </div>

        <!-- Modo Manual -->
        <div v-if="modoEscaneo === 'manual'" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Pegar contenido del QR o ID de Reserva:
            </label>
            <textarea
              v-model="qrManual"
              rows="4"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent font-mono text-sm"
              placeholder="Pega aquí el contenido del QR o ingresa el ID de la reserva..."
            ></textarea>
          </div>

          <button
            @click="procesarQRManual"
            :disabled="!qrManual.trim()"
            class="w-full bg-[#8B0000] text-white py-3 rounded-lg font-semibold hover:bg-[#A52A2A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🔍 Validar Código
          </button>
        </div>

        <!-- Resultado del Escaneo -->
        <div v-if="resultado" class="mt-8 space-y-6">
          <div
            :class="[
              'rounded-lg p-6 border-2',
              resultado.valido
                ? 'bg-green-50 border-green-500'
                : 'bg-red-50 border-red-500'
            ]"
          >
            <div class="text-center mb-4">
              <span class="text-6xl">{{ resultado.valido ? '✅' : '❌' }}</span>
              <h2
                :class="[
                  'text-2xl font-bold mt-2',
                  resultado.valido ? 'text-green-800' : 'text-red-800'
                ]"
              >
                {{ resultado.valido ? '¡ENTRADA VÁLIDA!' : 'ENTRADA INVÁLIDA' }}
              </h2>
            </div>

            <p
              :class="[
                'text-center mb-4',
                resultado.valido ? 'text-green-700' : 'text-red-700'
              ]"
            >
              {{ resultado.mensaje }}
            </p>

            <!-- Información del Usuario -->
            <div v-if="resultado.valido && resultado.datos" class="bg-white rounded-lg p-6 space-y-4">
              <h3 class="font-bold text-lg text-gray-800 border-b pb-2">
                👤 Información del Asistente
              </h3>
              
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div class="col-span-2 md:col-span-1">
                  <span class="font-medium text-gray-600">Nombre:</span>
                  <p class="text-gray-900 font-semibold text-lg">{{ resultado.datos.nombre }}</p>
                </div>
                
                <div class="col-span-2 md:col-span-1">
                  <span class="font-medium text-gray-600">Correo:</span>
                  <p class="text-gray-900">{{ resultado.datos.correo }}</p>
                </div>

                <div v-if="resultado.datos.carrera" class="col-span-2">
                  <span class="font-medium text-gray-600">Carrera:</span>
                  <p class="text-gray-900">{{ resultado.datos.carrera }}</p>
                </div>
              </div>

              <div class="border-t pt-4">
                <h4 class="font-bold text-gray-800 mb-3">🎬 Detalles de la Función</h4>
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div class="col-span-2">
                    <span class="font-medium text-gray-600">Película:</span>
                    <p class="text-gray-900 font-semibold">{{ resultado.datos.pelicula }}</p>
                  </div>
                  
                  <div>
                    <span class="font-medium text-gray-600">Fecha:</span>
                    <p class="text-gray-900">{{ formatearFecha(resultado.datos.fecha) }}</p>
                  </div>
                  
                  <div>
                    <span class="font-medium text-gray-600">Hora:</span>
                    <p class="text-gray-900">{{ resultado.datos.hora }}</p>
                  </div>
                  
                  <div>
                    <span class="font-medium text-gray-600">Asientos:</span>
                    <p class="text-gray-900">{{ resultado.datos.asientos }}</p>
                  </div>

                  <div>
                    <span class="font-medium text-gray-600">ID Reserva:</span>
                    <p class="text-gray-900 text-xs font-mono">{{ resultado.datos.reserva_id }}</p>
                  </div>
                </div>
              </div>

              <div v-if="resultado.datos.creado_en" class="text-xs text-gray-500 text-center pt-2 border-t">
                QR generado: {{ new Date(resultado.datos.creado_en).toLocaleString('es-ES') }}
              </div>
            </div>

            <!-- Botón de Confirmación -->
            <div v-if="resultado.valido && !resultado.confirmado" class="mt-6">
              <button
                @click="confirmarEntrada"
                class="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors"
              >
                ✓ CONFIRMAR ENTRADA
              </button>
            </div>

            <div v-if="resultado.confirmado" class="mt-6 bg-green-100 border border-green-300 rounded-lg p-4 text-center">
              <p class="text-green-800 font-bold">✓ Entrada confirmada exitosamente</p>
              <p class="text-green-700 text-sm mt-1">
                {{ new Date().toLocaleString('es-ES') }}
              </p>
            </div>
          </div>

          <button
            @click="resetearEscaneo"
            class="w-full bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
          >
            🔄 Escanear Otro Código
          </button>
        </div>

        <!-- Historial de Escaneos -->
        <div v-if="historial.length > 0" class="mt-8">
          <h3 class="text-lg font-bold text-gray-800 mb-4">📋 Historial de Escaneos</h3>
          <div class="space-y-2">
            <div
              v-for="(item, index) in historial"
              :key="index"
              :class="[
                'p-4 rounded-lg border text-sm',
                item.valido
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              ]"
            >
              <div class="flex justify-between items-center">
                <div>
                  <span class="font-semibold">{{ item.nombre || 'Desconocido' }}</span>
                  <span class="mx-2">-</span>
                  <span class="text-gray-600">{{ item.pelicula || 'N/A' }}</span>
                </div>
                <span :class="item.valido ? 'text-green-600' : 'text-red-600'">
                  {{ item.valido ? '✓' : '✗' }}
                </span>
              </div>
              <div class="text-xs text-gray-500 mt-1">
                {{ new Date(item.timestamp).toLocaleString('es-ES') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { BrowserQRCodeReader } from '@zxing/browser'
import { supabase } from '../lib/connectSupabase'

// Referencias
const videoElement = ref<HTMLVideoElement | null>(null)
const modoEscaneo = ref<'camara' | 'manual'>('camara')
const escaneando = ref(false)
const qrManual = ref('')

// Escáner
let codeReader: BrowserQRCodeReader | null = null
let stream: MediaStream | null = null

// Resultado
const resultado = ref<{
  valido: boolean
  mensaje: string
  datos?: any
  confirmado?: boolean
} | null>(null)

// Historial
const historial = ref<any[]>([])

// Iniciar escaneo con cámara
const iniciarEscaneo = async () => {
  try {
    escaneando.value = true
    codeReader = new BrowserQRCodeReader()

    // Obtener dispositivos de video
    const videoInputDevices = await codeReader.listVideoInputDevices()
    
    if (videoInputDevices.length === 0) {
      throw new Error('No se encontró ninguna cámara')
    }

    // Usar la primera cámara disponible
    const selectedDeviceId = videoInputDevices[0].deviceId

    // Iniciar escaneo continuo
    codeReader.decodeFromVideoDevice(
      selectedDeviceId,
      videoElement.value!,
      async (result, error) => {
        if (result) {
          const qrText = result.getText()
          await procesarQR(qrText)
          detenerEscaneo()
        }
        
        if (error && !(error.name === 'NotFoundException')) {
          console.error('Error en el escaneo:', error)
        }
      }
    )
  } catch (error) {
    console.error('Error iniciando escaneo:', error)
    alert('Error al acceder a la cámara: ' + (error as Error).message)
    escaneando.value = false
  }
}

// Detener escaneo
const detenerEscaneo = () => {
  if (codeReader) {
    codeReader.reset()
  }
  
  if (stream) {
    stream.getTracks().forEach(track => track.stop())
  }
  
  escaneando.value = false
}

// Procesar QR manual
const procesarQRManual = async () => {
  await procesarQR(qrManual.value)
}

// Procesar contenido del QR
const procesarQR = async (qrText: string) => {
  try {
    let qrData: any

    // Intentar parsear como JSON
    try {
      qrData = JSON.parse(qrText)
    } catch {
      // Si no es JSON, asumir que es un ID de reserva
      qrData = { reserva_id: qrText.trim() }
    }

    // Validar en la base de datos
    const { data: ticketData, error: ticketError } = await supabase
      .from('ticket_qr')
      .select('*')
      .eq('reserva_id', qrData.reserva_id)
      .single()

    if (ticketError || !ticketData) {
      resultado.value = {
        valido: false,
        mensaje: 'Código QR no encontrado o inválido'
      }
      
      agregarAlHistorial({
        valido: false,
        nombre: 'Desconocido',
        pelicula: 'N/A',
        timestamp: new Date().toISOString()
      })
      return
    }

    // Verificar estado del ticket
    if (ticketData.estado === 'usado') {
      resultado.value = {
        valido: false,
        mensaje: '⚠️ Este código QR ya ha sido utilizado'
      }
      
      agregarAlHistorial({
        valido: false,
        nombre: qrData.nombre || 'Desconocido',
        pelicula: qrData.pelicula || 'N/A',
        timestamp: new Date().toISOString()
      })
      return
    }

    if (ticketData.estado === 'expirado') {
      resultado.value = {
        valido: false,
        mensaje: '⚠️ Este código QR ha expirado'
      }
      
      agregarAlHistorial({
        valido: false,
        nombre: qrData.nombre || 'Desconocido',
        pelicula: qrData.pelicula || 'N/A',
        timestamp: new Date().toISOString()
      })
      return
    }

    // QR válido
    resultado.value = {
      valido: true,
      mensaje: 'Código verificado correctamente',
      datos: qrData,
      confirmado: false
    }

    agregarAlHistorial({
      valido: true,
      nombre: qrData.nombre,
      pelicula: qrData.pelicula,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error procesando QR:', error)
    resultado.value = {
      valido: false,
      mensaje: 'Error al procesar el código QR'
    }
  }
}

// Confirmar entrada
const confirmarEntrada = async () => {
  if (!resultado.value?.datos?.reserva_id) return

  try {
    // Actualizar estado del ticket a "usado"
    const { error: ticketError } = await supabase
      .from('ticket_qr')
      .update({
        estado: 'usado',
        verificado_en: new Date().toISOString()
      })
      .eq('reserva_id', resultado.value.datos.reserva_id)

    if (ticketError) throw ticketError

    // Actualizar estado de la reserva a "asistida"
    const { error: reservaError } = await supabase
      .from('reservas')
      .update({
        estado: 'asistida'
      })
      .eq('id', resultado.value.datos.reserva_id)

    if (reservaError) throw reservaError

    // Marcar como confirmado
    if (resultado.value) {
      resultado.value.confirmado = true
    }

    alert('✓ Entrada confirmada exitosamente')
  } catch (error) {
    console.error('Error confirmando entrada:', error)
    alert('Error al confirmar la entrada: ' + (error as Error).message)
  }
}

// Resetear escaneo
const resetearEscaneo = () => {
  resultado.value = null
  qrManual.value = ''
}

// Agregar al historial
const agregarAlHistorial = (item: any) => {
  historial.value.unshift(item)
  if (historial.value.length > 10) {
    historial.value.pop()
  }
}

// Formatear fecha
const formatearFecha = (fecha: string) => {
  if (!fecha) return ''
  return new Date(fecha + 'T00:00:00').toLocaleDateString('es-ES', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Limpiar al desmontar
onUnmounted(() => {
  detenerEscaneo()
})
</script>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
