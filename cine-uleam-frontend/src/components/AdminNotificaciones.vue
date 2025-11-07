<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-[#8B0000] text-white shadow-lg">
      <div class="container mx-auto px-6 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold">Sugerencias de Películas</h1>
            <p class="text-gray-200 mt-1">Gestiona las sugerencias enviadas por los estudiantes</p>
          </div>
          <RouterLink
            to="/admin"
            class="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-5 py-3 rounded-xl font-semibold transition-all duration-200"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Volver al Panel
          </RouterLink>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-6 py-8">
      <!-- Filtros y estadísticas -->
      <div class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="flex items-center gap-4">
          <button
            @click="filtroLeidas = null"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors',
              filtroLeidas === null
                ? 'bg-[#8B0000] text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            ]"
          >
            Todas ({{ notificaciones.length }})
          </button>
          <button
            @click="filtroLeidas = false"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors',
              filtroLeidas === false
                ? 'bg-[#8B0000] text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            ]"
          >
            No leídas ({{ notificacionesNoLeidas.length }})
          </button>
          <button
            @click="filtroLeidas = true"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors',
              filtroLeidas === true
                ? 'bg-[#8B0000] text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            ]"
          >
            Leídas ({{ notificacionesLeidas.length }})
          </button>
        </div>
        <button
          @click="marcarTodasComoLeidas"
          :disabled="notificacionesNoLeidas.length === 0 || marcandoTodas"
          class="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ marcandoTodas ? 'Marcando...' : 'Marcar todas como leídas' }}
        </button>
      </div>

      <!-- Indicador de carga -->
      <div v-if="cargando" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B0000]"></div>
        <p class="ml-4 text-gray-600">Cargando sugerencias...</p>
      </div>

      <!-- Mensaje cuando no hay notificaciones -->
      <div
        v-else-if="notificacionesFiltradas.length === 0"
        class="bg-white rounded-xl shadow-md p-12 text-center"
      >
        <svg
          class="mx-auto h-16 w-16 text-gray-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">No hay sugerencias</h3>
        <p class="text-gray-600">
          {{ filtroLeidas === false ? 'No hay sugerencias sin leer' : 'No hay sugerencias para mostrar' }}
        </p>
      </div>

      <!-- Lista de notificaciones -->
      <div v-else class="space-y-4">
        <div
          v-for="notificacion in notificacionesFiltradas"
          :key="notificacion.id"
          :class="[
            'bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg',
            !notificacion.leida ? 'border-l-4 border-[#8B0000]' : 'border-l-4 border-transparent'
          ]"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <h3 class="text-lg font-bold text-gray-900">{{ notificacion.titulo }}</h3>
                <span
                  v-if="!notificacion.leida"
                  class="px-2 py-1 bg-[#8B0000] text-white text-xs font-semibold rounded-full"
                >
                  Nueva
                </span>
              </div>
              <div class="text-gray-600 whitespace-pre-line mb-4">{{ notificacion.mensaje }}</div>
              <div class="flex items-center gap-4 text-sm text-gray-500">
                <span v-if="notificacion.enviada_en">
                  <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {{ formatearFecha(notificacion.enviada_en) }}
                </span>
              </div>
            </div>
            <div class="flex flex-col gap-2">
              <button
                v-if="!notificacion.leida"
                @click="marcarComoLeida(notificacion.id)"
                :disabled="marcandoLeida === notificacion.id"
                class="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ marcandoLeida === notificacion.id ? 'Marcando...' : 'Marcar como leída' }}
              </button>
              <button
                v-else
                @click="marcarComoNoLeida(notificacion.id)"
                :disabled="marcandoLeida === notificacion.id"
                class="px-4 py-2 bg-gray-400 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ marcandoLeida === notificacion.id ? 'Marcando...' : 'Marcar como no leída' }}
              </button>
              <button
                @click="eliminarNotificacion(notificacion.id)"
                :disabled="eliminando === notificacion.id"
                class="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ eliminando === notificacion.id ? 'Eliminando...' : 'Eliminar' }}
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
import { supabase } from '../lib/connectSupabase'
import type { Notificacion } from '../interface/INotificacion'

const notificaciones = ref<Notificacion[]>([])
const cargando = ref(true)
const filtroLeidas = ref<boolean | null>(null)
const marcandoLeida = ref<string | null>(null)
const eliminando = ref<string | null>(null)
const marcandoTodas = ref(false)

const notificacionesFiltradas = computed(() => {
  if (filtroLeidas.value === null) {
    return notificaciones.value
  }
  return notificaciones.value.filter(n => n.leida === filtroLeidas.value)
})

const notificacionesNoLeidas = computed(() => {
  return notificaciones.value.filter(n => !n.leida)
})

const notificacionesLeidas = computed(() => {
  return notificaciones.value.filter(n => n.leida)
})

const cargarNotificaciones = async () => {
  try {
    cargando.value = true
    const usuarioId = localStorage.getItem('userId')
    
    if (!usuarioId) {
      throw new Error('No se encontró el ID del usuario')
    }

    // Los administradores ven todas las sugerencias (tipo 'recomendacion')
    // sin filtrar por usuario_id, ya que las sugerencias son para todos los admins
    // Nota: Usamos 'recomendacion' porque es el tipo permitido en el constraint de la BD
    const { data, error } = await supabase
      .from('notificaciones')
      .select('*')
      .eq('tipo', 'recomendacion')
      .order('enviada_en', { ascending: false })

    if (error) throw error

    notificaciones.value = (data || []).map(n => ({
      ...n,
      leida: n.leida || false
    }))
  } catch (error) {
    console.error('Error cargando notificaciones:', error)
    alert('Error al cargar las sugerencias: ' + (error as Error).message)
  } finally {
    cargando.value = false
  }
}

const marcarComoLeida = async (id: string) => {
  try {
    marcandoLeida.value = id
    const { error } = await supabase
      .from('notificaciones')
      .update({ leida: true })
      .eq('id', id)

    if (error) throw error

    const notificacion = notificaciones.value.find(n => n.id === id)
    if (notificacion) {
      notificacion.leida = true
    }
  } catch (error) {
    console.error('Error marcando como leída:', error)
    alert('Error al marcar la sugerencia como leída')
  } finally {
    marcandoLeida.value = null
  }
}

const marcarComoNoLeida = async (id: string) => {
  try {
    marcandoLeida.value = id
    const { error } = await supabase
      .from('notificaciones')
      .update({ leida: false })
      .eq('id', id)

    if (error) throw error

    const notificacion = notificaciones.value.find(n => n.id === id)
    if (notificacion) {
      notificacion.leida = false
    }
  } catch (error) {
    console.error('Error marcando como no leída:', error)
    alert('Error al marcar la sugerencia como no leída')
  } finally {
    marcandoLeida.value = null
  }
}

const marcarTodasComoLeidas = async () => {
  try {
    marcandoTodas.value = true
    const idsNoLeidas = notificacionesNoLeidas.value.map(n => n.id)

    if (idsNoLeidas.length === 0) return

    const { error } = await supabase
      .from('notificaciones')
      .update({ leida: true })
      .in('id', idsNoLeidas)

    if (error) throw error

    notificaciones.value.forEach(n => {
      if (!n.leida) {
        n.leida = true
      }
    })
  } catch (error) {
    console.error('Error marcando todas como leídas:', error)
    alert('Error al marcar todas las sugerencias como leídas')
  } finally {
    marcandoTodas.value = false
  }
}

const eliminarNotificacion = async (id: string) => {
  if (!confirm('¿Estás seguro de eliminar esta sugerencia?')) return

  try {
    eliminando.value = id
    const { error } = await supabase
      .from('notificaciones')
      .delete()
      .eq('id', id)

    if (error) throw error

    notificaciones.value = notificaciones.value.filter(n => n.id !== id)
  } catch (error) {
    console.error('Error eliminando notificación:', error)
    alert('Error al eliminar la sugerencia')
  } finally {
    eliminando.value = null
  }
}

const formatearFecha = (fecha: string | undefined) => {
  if (!fecha) return 'Fecha no disponible'
  
  try {
    const date = new Date(fecha)
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return fecha
  }
}

onMounted(() => {
  cargarNotificaciones()
})
</script>

