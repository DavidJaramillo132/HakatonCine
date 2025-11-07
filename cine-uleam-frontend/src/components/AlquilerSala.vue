<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
          🎭 Alquiler de Sala
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Solicita el alquiler de la sala de cine para eventos académicos e institucionales
        </p>
      </div>

      <!-- Vista de Administrador -->
      <div v-if="isAdmin" class="space-y-6">
        <!-- Panel de Filtros -->
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Filtros</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Filtro de Estado -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Estado</label>
              <select
                v-model="filtroEstado"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8102E] focus:border-transparent"
              >
                <option value="">Todos los estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="aprobado">Aprobado</option>
                <option value="rechazado">Rechazado</option>
              </select>
            </div>

            <!-- Filtro de Fecha Inicio -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Fecha Desde</label>
              <input
                v-model="filtroFechaDesde"
                type="date"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8102E] focus:border-transparent"
              />
            </div>

            <!-- Filtro de Fecha Fin -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Fecha Hasta</label>
              <input
                v-model="filtroFechaHasta"
                type="date"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8102E] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <!-- Tabla de Solicitudes -->
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-[#C8102E]">
                <tr>
                  <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Evento</th>
                  <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Solicitante</th>
                  <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Facultad</th>
                  <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Fecha/Hora</th>
                  <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Asistentes</th>
                  <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Estado</th>
                  <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="solicitud in solicitudesFiltradas"
                  :key="solicitud.id"
                  class="hover:bg-gray-50 transition-colors"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ solicitud.nombre_evento }}</div>
                    <div class="text-sm text-gray-500 line-clamp-1">{{ solicitud.descripcion }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ solicitud.usuario?.nombre || 'N/A' }}</div>
                    <div class="text-sm text-gray-500">{{ solicitud.usuario?.correo || '' }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ solicitud.facultad || 'N/A' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>{{ formatearFecha(solicitud.fecha_inicio) }}</div>
                    <div class="text-gray-500">{{ formatearHora(solicitud.fecha_inicio) }} - {{ formatearHora(solicitud.fecha_fin) }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ solicitud.asistentes_estimados || 'N/A' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      :class="[
                        'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                        solicitud.estado === 'aprobado' ? 'bg-green-100 text-green-800' : 
                        solicitud.estado === 'rechazado' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'
                      ]"
                    >
                      {{ estadoTexto[solicitud.estado] }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      v-if="solicitud.estado === 'pendiente'"
                      @click="aprobarSolicitud(solicitud.id)"
                      class="text-[#006847] hover:text-[#005238] transition-colors font-semibold"
                    >
                      ✅ Aprobar
                    </button>
                    <button
                      v-if="solicitud.estado === 'pendiente'"
                      @click="rechazarSolicitud(solicitud.id)"
                      class="text-[#C8102E] hover:text-[#A00D25] transition-colors font-semibold"
                    >
                      ❌ Rechazar
                    </button>
                    <button
                      @click="verDetalles(solicitud)"
                      class="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      👁️ Ver
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Empty State -->
          <div v-if="solicitudesFiltradas.length === 0" class="text-center py-12">
            <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p class="text-gray-500">No hay solicitudes con los filtros seleccionados</p>
          </div>
        </div>
      </div>

      <!-- Vista de Usuario Normal -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Formulario de Solicitud -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-2xl shadow-lg p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Nueva Solicitud de Alquiler</h2>
            
            <form @submit.prevent="enviarSolicitud" class="space-y-6">
              <!-- Nombre del Solicitante (Auto-completado) -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Solicitante *
                </label>
                <input
                  v-model="formulario.nombre_solicitante"
                  type="text"
                  required
                  readonly
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#C8102E] focus:border-transparent"
                />
              </div>

              <!-- Facultad o Unidad Académica -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Facultad o Unidad Académica *
                </label>
                <input
                  v-model="formulario.facultad"
                  type="text"
                  required
                  placeholder="Ej: Facultad de Ciencias de la Ingeniería"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8102E] focus:border-transparent"
                />
              </div>

              <!-- Nombre del Evento -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Evento *
                </label>
                <input
                  v-model="formulario.nombre_evento"
                  type="text"
                  required
                  placeholder="Ej: Conferencia de Inteligencia Artificial"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8102E] focus:border-transparent"
                />
              </div>

              <!-- Descripción -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Descripción Breve del Evento *
                </label>
                <textarea
                  v-model="formulario.descripcion"
                  required
                  rows="4"
                  placeholder="Describe brevemente el propósito y contenido del evento..."
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8102E] focus:border-transparent resize-none"
                ></textarea>
              </div>

              <!-- Fecha y Hora de Inicio -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Inicio *
                  </label>
                  <input
                    v-model="formulario.fecha_inicio"
                    type="date"
                    required
                    :min="fechaMinima"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8102E] focus:border-transparent"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Hora de Inicio *
                  </label>
                  <input
                    v-model="formulario.hora_inicio"
                    type="time"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8102E] focus:border-transparent"
                  />
                </div>
              </div>

              <!-- Fecha y Hora de Finalización -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Finalización *
                  </label>
                  <input
                    v-model="formulario.fecha_fin"
                    type="date"
                    required
                    :min="formulario.fecha_inicio || fechaMinima"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8102E] focus:border-transparent"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Hora de Finalización *
                  </label>
                  <input
                    v-model="formulario.hora_fin"
                    type="time"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8102E] focus:border-transparent"
                  />
                </div>
              </div>

              <!-- Cantidad de Asistentes -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Cantidad Estimada de Asistentes *
                </label>
                <input
                  v-model.number="formulario.asistentes_estimados"
                  type="number"
                  required
                  min="1"
                  placeholder="Ej: 50"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8102E] focus:border-transparent"
                />
              </div>

              <!-- Archivo Adjunto -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Archivo Adjunto (Opcional)
                </label>
                <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-[#C8102E] transition-colors">
                  <div class="space-y-1 text-center">
                    <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <div class="flex text-sm text-gray-600">
                      <label for="archivo" class="relative cursor-pointer bg-white rounded-md font-medium text-[#C8102E] hover:text-[#A00D25] focus-within:outline-none">
                        <span>Subir archivo</span>
                        <input
                          id="archivo"
                          ref="archivoInput"
                          type="file"
                          accept="image/*,.pdf"
                          @change="handleFileSelect"
                          class="sr-only"
                        />
                      </label>
                      <p class="pl-1">o arrastra y suelta</p>
                    </div>
                    <p class="text-xs text-gray-500">PNG, JPG, PDF hasta 10MB</p>
                    <p v-if="archivoSeleccionado" class="text-sm text-green-600 font-medium">
                      ✓ {{ archivoSeleccionado.name }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Mensajes de Error/Success -->
              <div v-if="mensajeError" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                ⚠️ {{ mensajeError }}
              </div>

              <div v-if="mensajeSuccess" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                ✅ {{ mensajeSuccess }}
              </div>

              <!-- Botón de Envío -->
              <button
                type="submit"
                :disabled="isSubmitting"
                class="w-full bg-[#006847] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#005238] hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span v-if="!isSubmitting">📋 Solicitar Alquiler</span>
                <span v-else class="flex items-center gap-2">
                  <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enviando...
                </span>
              </button>
            </form>
          </div>
        </div>

        <!-- Mis Solicitudes -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
            <h3 class="text-xl font-bold text-gray-900 mb-4">Mis Solicitudes</h3>
            <div class="space-y-4 max-h-96 overflow-y-auto">
              <div
                v-for="solicitud in misSolicitudes"
                :key="solicitud.id"
                class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div class="flex items-start justify-between mb-2">
                  <h4 class="font-semibold text-gray-900 text-sm">{{ solicitud.nombre_evento }}</h4>
                  <span
                    :class="[
                      'px-2 py-1 text-xs font-semibold rounded-full',
                      solicitud.estado === 'aprobado' ? 'bg-green-100 text-green-800' : 
                      solicitud.estado === 'rechazado' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'
                    ]"
                  >
                    {{ estadoTexto[solicitud.estado] }}
                  </span>
                </div>
                <p class="text-xs text-gray-600 mb-2">{{ formatearFecha(solicitud.fecha_inicio) }}</p>
                <p class="text-xs text-gray-500 line-clamp-2">{{ solicitud.descripcion }}</p>
              </div>
              <div v-if="misSolicitudes.length === 0" class="text-center py-8 text-gray-500 text-sm">
                No tienes solicitudes aún
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Detalles -->
    <div
      v-if="solicitudDetalle"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="cerrarDetalles"
    >
      <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-bold text-gray-900">Detalles de la Solicitud</h3>
            <button
              @click="cerrarDetalles"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="space-y-4">
            <div>
              <label class="text-sm font-medium text-gray-700">Evento</label>
              <p class="text-gray-900 font-semibold">{{ solicitudDetalle.nombre_evento }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Solicitante</label>
              <p class="text-gray-900">{{ solicitudDetalle.usuario?.nombre }}</p>
              <p class="text-gray-600 text-sm">{{ solicitudDetalle.usuario?.correo }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Facultad</label>
              <p class="text-gray-900">{{ solicitudDetalle.facultad || 'N/A' }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Descripción</label>
              <p class="text-gray-900">{{ solicitudDetalle.descripcion || 'N/A' }}</p>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-sm font-medium text-gray-700">Fecha/Hora Inicio</label>
                <p class="text-gray-900">{{ formatearFecha(solicitudDetalle.fecha_inicio) }} {{ formatearHora(solicitudDetalle.fecha_inicio) }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700">Fecha/Hora Fin</label>
                <p class="text-gray-900">{{ formatearFecha(solicitudDetalle.fecha_fin) }} {{ formatearHora(solicitudDetalle.fecha_fin) }}</p>
              </div>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Asistentes Estimados</label>
              <p class="text-gray-900">{{ solicitudDetalle.asistentes_estimados || 'N/A' }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Estado</label>
              <span
                :class="[
                  'px-3 py-1 inline-flex text-sm font-semibold rounded-full',
                  solicitudDetalle.estado === 'aprobado' ? 'bg-green-100 text-green-800' : 
                  solicitudDetalle.estado === 'rechazado' ? 'bg-red-100 text-red-800' : 
                  'bg-yellow-100 text-yellow-800'
                ]"
              >
                {{ estadoTexto[solicitudDetalle.estado] }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Notificación de Éxito -->
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="mostrarNotificacion"
        class="fixed bottom-4 right-4 bg-white rounded-lg shadow-2xl border-2 border-green-500 p-6 z-50 max-w-md animate-bounce"
      >
        <div class="flex items-center gap-4">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <div>
            <h4 class="font-bold text-gray-900">{{ notificacionTitulo }}</h4>
            <p class="text-sm text-gray-600">{{ notificacionMensaje }}</p>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { supabase } from '../lib/connectSupabase'
import type { IAlquilerEvento } from '../interface/IAlquiler'

// Estado
const isAdmin = ref(false)
const usuarioActual = ref<any>(null)
const isSubmitting = ref(false)
const mensajeError = ref('')
const mensajeSuccess = ref('')
const archivoSeleccionado = ref<File | null>(null)
const archivoInput = ref<HTMLInputElement | null>(null)
const solicitudDetalle = ref<IAlquilerEvento | null>(null)

// Filtros (Admin)
const filtroEstado = ref('')
const filtroFechaDesde = ref('')
const filtroFechaHasta = ref('')

// Solicitudes
const todasLasSolicitudes = ref<IAlquilerEvento[]>([])
const misSolicitudes = ref<IAlquilerEvento[]>([])

// Notificaciones
const mostrarNotificacion = ref(false)
const notificacionTitulo = ref('')
const notificacionMensaje = ref('')

// Formulario
const formulario = reactive({
  nombre_solicitante: '',
  facultad: '',
  nombre_evento: '',
  descripcion: '',
  fecha_inicio: '',
  hora_inicio: '',
  fecha_fin: '',
  hora_fin: '',
  asistentes_estimados: 0
})

const estadoTexto = {
  pendiente: 'Pendiente',
  aprobado: 'Aprobado',
  rechazado: 'Rechazado'
}

const fechaMinima = computed(() => {
  return new Date().toISOString().split('T')[0]
})

// Solicitudes filtradas (Admin)
const solicitudesFiltradas = computed(() => {
  let filtradas = todasLasSolicitudes.value

  if (filtroEstado.value) {
    filtradas = filtradas.filter(s => s.estado === filtroEstado.value)
  }

  if (filtroFechaDesde.value) {
    filtradas = filtradas.filter(s => s.fecha_inicio >= filtroFechaDesde.value)
  }

  if (filtroFechaHasta.value) {
    filtradas = filtradas.filter(s => s.fecha_inicio <= filtroFechaHasta.value)
  }

  return filtradas.sort((a, b) => {
    const fechaA = new Date(a.created_at || 0).getTime()
    const fechaB = new Date(b.created_at || 0).getTime()
    return fechaB - fechaA
  })
})

// Cargar datos
onMounted(async () => {
  await verificarUsuario()
  await cargarSolicitudes()
})

const verificarUsuario = async () => {
  const userId = localStorage.getItem('userId')
  const userRole = localStorage.getItem('userRole')

  if (!userId) {
    alert('Debes iniciar sesión para acceder a esta sección')
    window.location.href = '/login'
    return
  }

  isAdmin.value = userRole === 'admin'

  try {
    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error

    usuarioActual.value = usuario
    formulario.nombre_solicitante = usuario.nombre
  } catch (error) {
    console.error('Error cargando usuario:', error)
  }
}

const cargarSolicitudes = async () => {
  try {
    if (isAdmin.value) {
      // Cargar todas las solicitudes con información de usuario
      const { data: solicitudesData, error: solicitudesError } = await supabase
        .from('alquiler_eventos')
        .select('*')
        .order('created_at', { ascending: false })

      if (solicitudesError) throw solicitudesError

      // Cargar información de usuarios para cada solicitud
      if (solicitudesData) {
        const userIds = [...new Set(solicitudesData.map(s => s.usuario_id))]
        const { data: usuariosData } = await supabase
          .from('usuarios')
          .select('id, nombre, correo, carrera')
          .in('id', userIds)

        // Combinar datos
        todasLasSolicitudes.value = solicitudesData.map(solicitud => ({
          ...solicitud,
          usuario: usuariosData?.find(u => u.id === solicitud.usuario_id)
        }))
      }
    } else {
      // Cargar solo las solicitudes del usuario
      const userId = localStorage.getItem('userId')
      const { data, error } = await supabase
        .from('alquiler_eventos')
        .select('*')
        .eq('usuario_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      misSolicitudes.value = data || []
    }
  } catch (error) {
    console.error('Error cargando solicitudes:', error)
  }
}

// Manejo de archivo
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    if (file.size > 10 * 1024 * 1024) {
      mensajeError.value = 'El archivo no puede ser mayor a 10MB'
      return
    }
    archivoSeleccionado.value = file
  }
}

// Enviar solicitud
const enviarSolicitud = async () => {
  mensajeError.value = ''
  mensajeSuccess.value = ''
  isSubmitting.value = true

  try {
    const userId = localStorage.getItem('userId')
    if (!userId) throw new Error('Usuario no autenticado')

    // Combinar fecha y hora
    const fechaInicioCompleta = new Date(`${formulario.fecha_inicio}T${formulario.hora_inicio}`)
    const fechaFinCompleta = new Date(`${formulario.fecha_fin}T${formulario.hora_fin}`)

    // Validar que la fecha de fin sea posterior a la de inicio
    if (fechaFinCompleta <= fechaInicioCompleta) {
      mensajeError.value = 'La fecha y hora de finalización debe ser posterior a la de inicio'
      isSubmitting.value = false
      return
    }

    // Usar el ID de usuario directamente (debe coincidir con la tabla usuarios)
    // Crear solicitud
    const { data: solicitud, error: solicitudError } = await supabase
      .from('alquiler_eventos')
      .insert({
        usuario_id: userId,
        nombre_evento: formulario.nombre_evento,
        descripcion: formulario.descripcion,
        facultad: formulario.facultad,
        fecha_inicio: fechaInicioCompleta.toISOString(),
        fecha_fin: fechaFinCompleta.toISOString(),
        asistentes_estimados: formulario.asistentes_estimados,
        estado: 'pendiente'
      })
      .select()
      .single()

    if (solicitudError) throw solicitudError

    // Subir archivo si existe
    if (archivoSeleccionado.value && solicitud) {
      const fileExt = archivoSeleccionado.value.name.split('.').pop()
      const fileName = `${solicitud.id}_${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('alquiler-archivos')
        .upload(fileName, archivoSeleccionado.value)

      if (!uploadError) {
        // Obtener URL pública (si el bucket es público) o crear signed URL
        let archivoUrl = ''
        try {
          const { data: urlData } = supabase.storage
            .from('alquiler-archivos')
            .getPublicUrl(fileName)
          archivoUrl = urlData.publicUrl
        } catch {
          // Si el bucket es privado, crear signed URL (válida por 1 año)
          const { data: signedUrl } = await supabase.storage
            .from('alquiler-archivos')
            .createSignedUrl(fileName, 31536000) // 1 año en segundos
          archivoUrl = signedUrl?.signedUrl || fileName
        }

        await supabase
          .from('alquiler_archivos')
          .insert({
            evento_id: solicitud.id,
            archivo_url: archivoUrl
          })
      }
    }

    mensajeSuccess.value = '¡Solicitud enviada exitosamente! Se revisará pronto.'
    
    // Limpiar formulario
    formulario.facultad = ''
    formulario.nombre_evento = ''
    formulario.descripcion = ''
    formulario.fecha_inicio = ''
    formulario.hora_inicio = ''
    formulario.fecha_fin = ''
    formulario.hora_fin = ''
    formulario.asistentes_estimados = 0
    archivoSeleccionado.value = null
    if (archivoInput.value) archivoInput.value.value = ''

    // Recargar solicitudes
    await cargarSolicitudes()
  } catch (error: any) {
    console.error('Error enviando solicitud:', error)
    mensajeError.value = error.message || 'Error al enviar la solicitud'
  } finally {
    isSubmitting.value = false
  }
}

// Aprobar solicitud
const aprobarSolicitud = async (id: string) => {
  try {
    const { error } = await supabase
      .from('alquiler_eventos')
      .update({ estado: 'aprobado' })
      .eq('id', id)

    if (error) throw error

    mostrarNotificacionExito('Solicitud Aprobada', 'La solicitud ha sido aprobada exitosamente')
    await cargarSolicitudes()
  } catch (error: any) {
    console.error('Error aprobando solicitud:', error)
    alert('Error al aprobar la solicitud')
  }
}

// Rechazar solicitud
const rechazarSolicitud = async (id: string) => {
  if (!confirm('¿Estás seguro de rechazar esta solicitud?')) return

  try {
    const { error } = await supabase
      .from('alquiler_eventos')
      .update({ estado: 'rechazado' })
      .eq('id', id)

    if (error) throw error

    mostrarNotificacionExito('Solicitud Rechazada', 'La solicitud ha sido rechazada')
    await cargarSolicitudes()
  } catch (error: any) {
    console.error('Error rechazando solicitud:', error)
    alert('Error al rechazar la solicitud')
  }
}

// Ver detalles
const verDetalles = async (solicitud: IAlquilerEvento) => {
  // Cargar información completa del usuario si no está disponible
  if (!solicitud.usuario) {
    const { data: usuario } = await supabase
      .from('usuarios')
      .select('nombre, correo, carrera')
      .eq('id', solicitud.usuario_id)
      .single()

    solicitud.usuario = usuario
  }
  solicitudDetalle.value = solicitud
}

const cerrarDetalles = () => {
  solicitudDetalle.value = null
}

// Notificaciones
const mostrarNotificacionExito = (titulo: string, mensaje: string) => {
  notificacionTitulo.value = titulo
  notificacionMensaje.value = mensaje
  mostrarNotificacion.value = true

  setTimeout(() => {
    mostrarNotificacion.value = false
  }, 3000)
}

// Formateo
const formatearFecha = (fecha: string) => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatearHora = (fecha: string) => {
  return new Date(fecha).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

* {
  font-family: 'Poppins', sans-serif;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

</style>

