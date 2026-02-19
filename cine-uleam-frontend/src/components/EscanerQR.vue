<template>
  <div class="min-h-screen bg-gray-50 py-4 md:py-8">
    <div class="container mx-auto px-2 md:px-4 max-w-4xl">
      <div class="bg-white rounded-xl shadow-lg p-4 md:p-8">
        <h1 class="text-2xl md:text-3xl font-bold text-[#8B0000] mb-4 md:mb-6 text-center">
          <i class="fa-solid fa-camera mr-2"></i>Escáner de QR
        </h1>

        <!-- Modo Cámara -->
        <div class="space-y-4 md:space-y-6">
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4 text-xs md:text-sm text-blue-800">
            <p class="font-medium mb-1 md:mb-0">Instrucciones:</p>
            <ul class="list-disc list-inside space-y-0.5 md:space-y-1 text-xs md:text-sm">
              <li>Permite el acceso a la cámara</li>
              <li>Apunta hacia el código QR</li>
              <li>Se detectará automáticamente</li>
            </ul>
          </div>

          <div class="relative bg-black rounded-lg overflow-hidden" style="aspect-ratio: 4/3;">
            <video
              ref="videoElement"
              class="w-full h-full object-cover"
              autoplay
              playsinline
              muted
            ></video>
            
            <div v-if="escaneando" class="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div class="border-4 border-[#8B0000] rounded-lg" style="width: 60%; max-width: 250px; aspect-ratio: 1;">
                <div class="w-full h-full border-2 border-white border-dashed animate-pulse"></div>
              </div>
            </div>

            <!-- Indicador de estado -->
            <div v-if="escaneando" class="absolute top-2 left-2 right-2 md:top-4 md:left-4 md:right-4">
              <div class="bg-[#8B0000] text-white px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium inline-block">
                Buscando código QR...
              </div>
            </div>
          </div>

          <div class="flex gap-2 md:gap-4">
            <button
              v-if="!escaneando"
              @click="iniciarEscaneo"
              class="flex-1 bg-[#8B0000] text-white py-2.5 md:py-3 rounded-lg font-semibold text-sm md:text-base hover:bg-[#A52A2A] transition-colors"
            >
              Iniciar
            </button>
            <button
              v-else
              @click="detenerEscaneo"
              class="flex-1 bg-red-600 text-white py-2.5 md:py-3 rounded-lg font-semibold text-sm md:text-base hover:bg-red-700 transition-colors"
            >
              Detener
            </button>
          </div>
        </div>

        <!-- Resultado del Escaneo -->
        <div v-if="resultado" class="mt-4 md:mt-8 space-y-4 md:space-y-6">
          <div
            :class="[
              'rounded-lg p-4 md:p-6 border-2',
              resultado.valido
                ? 'bg-green-50 border-green-500'
                : 'bg-red-50 border-red-500'
            ]"
          >
            <div class="text-center mb-3 md:mb-4">
              <i
                :class="[
                  'text-5xl md:text-6xl',
                  resultado.valido ? 'fa-solid fa-circle-check text-green-500' : 'fa-solid fa-circle-xmark text-red-500'
                ]"
              ></i>
              <h2
                :class="[
                  'text-xl md:text-2xl font-bold mt-2',
                  resultado.valido ? 'text-green-800' : 'text-red-800'
                ]"
              >
                {{ resultado.valido ? '¡ENTRADA VÁLIDA!' : 'ENTRADA INVÁLIDA' }}
              </h2>
            </div>

            <p
              :class="[
                'text-center mb-3 md:mb-4 text-sm md:text-base',
                resultado.valido ? 'text-green-700' : 'text-red-700'
              ]"
            >
              {{ resultado.mensaje }}
            </p>

            <!-- Información del Usuario -->
            <div v-if="resultado.valido && resultado.datos" class="bg-white rounded-lg p-4 md:p-6 space-y-3 md:space-y-4">
              <h3 class="font-bold text-base md:text-lg text-gray-800 border-b pb-2">
                <i class="fa-solid fa-user mr-2"></i>Información del Asistente
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-xs md:text-sm">
                <div class="col-span-1 md:col-span-1">
                  <span class="font-medium text-gray-600">Nombre:</span>
                  <p class="text-gray-900 font-semibold text-sm md:text-lg">{{ resultado.datos.nombre }}</p>
                </div>
                
                <div class="col-span-1 md:col-span-1">
                  <span class="font-medium text-gray-600">Correo:</span>
                  <p class="text-gray-900 break-all">{{ resultado.datos.correo }}</p>
                </div>

                <div v-if="resultado.datos.carrera" class="col-span-1 md:col-span-2">
                  <span class="font-medium text-gray-600">Carrera:</span>
                  <p class="text-gray-900">{{ resultado.datos.carrera }}</p>
                </div>
              </div>

              <div class="border-t pt-3 md:pt-4">
                <h4 class="font-bold text-sm md:text-base text-gray-800 mb-2 md:mb-3"><i class="fa-solid fa-film mr-2"></i>Detalles de la Función</h4>
                <div class="grid grid-cols-2 gap-3 md:gap-4 text-xs md:text-sm">
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
                    <span class="font-medium text-gray-600">ID:</span>
                    <p class="text-gray-900 text-xs font-mono break-all">{{ resultado.datos.reserva_id }}</p>
                  </div>
                </div>
              </div>

              <div v-if="resultado.datos.creado_en" class="text-xs text-gray-500 text-center pt-2 border-t">
                QR generado: {{ new Date(resultado.datos.creado_en).toLocaleString('es-ES') }}
              </div>
            </div>

            <!-- Botón de Confirmación -->
            <div v-if="resultado.valido && !resultado.confirmado" class="mt-4 md:mt-6">
              <button
                @click="confirmarEntrada"
                class="w-full bg-green-600 text-white py-3 md:py-4 rounded-lg font-bold text-base md:text-lg hover:bg-green-700 transition-colors"
              >
                ✓ CONFIRMAR ENTRADA
              </button>
            </div>

            <div v-if="resultado.confirmado" class="mt-4 md:mt-6 bg-green-100 border border-green-300 rounded-lg p-3 md:p-4 text-center">
              <p class="text-green-800 font-bold text-sm md:text-base">✓ Entrada confirmada exitosamente</p>
              <p class="text-green-700 text-xs md:text-sm mt-1">
                {{ new Date().toLocaleString('es-ES') }}
              </p>
            </div>
          </div>

          <button
            @click="resetearEscaneo"
            class="w-full bg-[#8B0000] text-white py-2.5 md:py-3 rounded-lg font-semibold text-sm md:text-base hover:bg-[#A52A2A] transition-colors"
          >
            <i class="fa-solid fa-rotate mr-2"></i>Escanear Siguiente
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
//import { BrowserQRCodeReader } from '@zxing/browser'
import { BrowserMultiFormatReader } from '@zxing/browser'

import { supabase } from '../lib/connectSupabase'

// Referencias
const videoElement = ref<HTMLVideoElement | null>(null)
const escaneando = ref(false)

// Escáner
let codeReader: BrowserMultiFormatReader | null = null
let videoStream: MediaStream | null = null

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
    codeReader = new BrowserMultiFormatReader()

    // Obtener dispositivos de video
    const videoInputDevices = await BrowserMultiFormatReader.listVideoInputDevices()

    if (!videoInputDevices || videoInputDevices.length === 0) {
      throw new Error('No se encontró ninguna cámara')
    }

    // Seleccionar la cámara apropiada
    let selectedDeviceId: string
    
    // En móviles, buscar la cámara trasera (environment)
    // En desktop, usar la primera disponible
    const backCamera = videoInputDevices.find(device => 
      device.label.toLowerCase().includes('back') || 
      device.label.toLowerCase().includes('rear') ||
      device.label.toLowerCase().includes('environment')
    )
    
    if (backCamera) {
      selectedDeviceId = backCamera.deviceId
      console.log('Usando cámara trasera:', backCamera.label)
    } else {
      // Si no encuentra cámara trasera, usar la última (generalmente es la trasera en móviles)
      const lastCamera = videoInputDevices[videoInputDevices.length - 1]
      if (!lastCamera) throw new Error('No se encontró un dispositivo de cámara válido')
      selectedDeviceId = lastCamera.deviceId
      console.log('Usando cámara:', lastCamera.label)
    }

    // Verificar que el elemento <video> exista
    if (!videoElement.value) {
      throw new Error('Elemento de video no inicializado')
    }

    // Iniciar escaneo continuo
    codeReader.decodeFromVideoDevice(selectedDeviceId, videoElement.value, async (result, error) => {
      if (result) {
        const qrText = result.getText()
        // Detener temporalmente el escaneo para procesar
        detenerEscaneo()
        await procesarQR(qrText)
      }

      // Ignorar errores normales de "no se encontró código"
      // Solo registrar errores reales de la cámara o del sistema
      if (error && !error.message.includes('No MultiFormat Readers') && error.name !== 'NotFoundException') {
        console.error('Error en el escaneo:', error)
      }
    })
  } catch (error) {
    console.error('Error iniciando escaneo:', error)
    alert('Error al acceder a la cámara: ' + (error as Error).message)
    escaneando.value = false
  }
}

// Detener escaneo
const detenerEscaneo = () => {
  if (codeReader) {
    // Detener el stream de video manualmente
    if (videoElement.value && videoElement.value.srcObject) {
      const stream = videoElement.value.srcObject as MediaStream
      stream.getTracks().forEach((track: MediaStreamTrack) => track.stop())
      videoElement.value.srcObject = null
    }
  }
  
  if (videoStream) {
    videoStream.getTracks().forEach((track: MediaStreamTrack) => track.stop())
    videoStream = null
  }
  
  escaneando.value = false
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
      .from('tickets_qr')
      .select('*')
      .eq('reserva_id', qrData.reserva_id)
      .single()

    if (ticketError || !ticketData) {
      console.error('Error buscando ticket:', ticketError)
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
        mensaje: 'Este código QR ya ha sido utilizado'
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
        mensaje: 'Este código QR ha expirado'
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
    
    // Agregar al historial también cuando hay error
    agregarAlHistorial({
      valido: false,
      nombre: 'Error',
      pelicula: 'Error de procesamiento',
      timestamp: new Date().toISOString()
    })
  }
}

// Confirmar entrada
const confirmarEntrada = async () => {
  if (!resultado.value?.datos?.reserva_id) return

  try {
    // Actualizar estado del ticket a "usado"
    const { error: ticketError } = await supabase
      .from('tickets_qr')
      .update({
        estado: 'usado',
        verificado_en: new Date().toISOString()
      })
      .eq('reserva_id', resultado.value.datos.reserva_id)

    if (ticketError) {
      console.error('Error actualizando ticket:', ticketError)
      throw ticketError
    }

    // Actualizar estado de la reserva a "asistida"
    const { error: reservaError } = await supabase
      .from('reservas')
      .update({
        estado: 'asistida'
      })
      .eq('id', resultado.value.datos.reserva_id)

    if (reservaError) {
      console.error('Error actualizando reserva:', reservaError)
      throw reservaError
    }

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
const resetearEscaneo = async () => {
  resultado.value = null
  
  // Reiniciar el escaneo automáticamente
  await new Promise(resolve => setTimeout(resolve, 500)) // Pequeño delay
  await iniciarEscaneo()
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
