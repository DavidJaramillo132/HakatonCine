<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-[#8B0000] text-white shadow-lg">
      <div class="container mx-auto px-6 py-6">
        <h1 class="text-3xl font-bold">Gestión de Salas - Cine ULEAM</h1>
        <p class="text-gray-200 mt-1">Administra las salas disponibles</p>
      </div>
    </div>

    <div class="container mx-auto px-6 py-8">
      <!-- Botones de navegación -->
      <div class="mb-6 flex flex-wrap gap-4">
        <RouterLink
          to="/admin"
          class="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-blue-700 transition-all duration-200"
        >
          <i class="fa-solid fa-gauge-high"></i>
          Dashboard
        </RouterLink>
        <RouterLink
          to="/admin/cartelera"
          class="inline-flex items-center gap-2 bg-[#8B0000] text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-[#A52A2A] transition-all duration-200"
        >
          <i class="fa-solid fa-film"></i>
          Gestión de Cartelera
        </RouterLink>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Formulario crear / editar -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
            <h2 class="text-xl font-bold text-gray-900 mb-5">
              {{ editandoId ? 'Editar Sala' : 'Nueva Sala' }}
            </h2>

            <form @submit.prevent="guardarSala" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                <input
                  v-model="form.nombre"
                  type="text"
                  required
                  placeholder="Ej: Sala Principal"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Capacidad *</label>
                <input
                  v-model.number="form.capacidad"
                  type="number"
                  required
                  min="1"
                  placeholder="Ej: 100"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                <input
                  v-model="form.ubicacion"
                  type="text"
                  placeholder="Ej: Edificio A, Piso 2"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent"
                />
              </div>

              <!-- Mensajes -->
              <div v-if="mensajeError" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                <i class="fa-solid fa-triangle-exclamation mr-1"></i>{{ mensajeError }}
              </div>
              <div v-if="mensajeExito" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                <i class="fa-solid fa-circle-check mr-1"></i>{{ mensajeExito }}
              </div>

              <div class="flex gap-3 pt-2">
                <button
                  type="submit"
                  :disabled="guardando"
                  class="flex-1 bg-[#8B0000] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#A52A2A] transition-colors disabled:opacity-50"
                >
                  {{ guardando ? 'Guardando...' : editandoId ? 'Actualizar' : 'Crear Sala' }}
                </button>
                <button
                  v-if="editandoId"
                  type="button"
                  @click="cancelarEdicion"
                  class="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Lista de salas -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <div class="flex items-center justify-between mb-5">
              <h2 class="text-xl font-bold text-gray-900">Salas Registradas</h2>
              <span class="bg-[#8B0000] text-white text-sm font-semibold px-3 py-1 rounded-full">
                {{ salas.length }} sala{{ salas.length !== 1 ? 's' : '' }}
              </span>
            </div>

            <!-- Cargando -->
            <div v-if="cargando" class="flex justify-center items-center py-12">
              <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-[#8B0000]"></div>
              <p class="ml-3 text-gray-500">Cargando salas...</p>
            </div>

            <!-- Vacío -->
            <div v-else-if="salas.length === 0" class="text-center py-12">
              <i class="fa-solid fa-building-circle-xmark text-5xl text-gray-300 mb-4"></i>
              <p class="text-gray-500 font-medium">No hay salas registradas</p>
              <p class="text-gray-400 text-sm mt-1">Crea la primera sala usando el formulario</p>
            </div>

            <!-- Tabla -->
            <div v-else class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-gray-200">
                    <th class="text-left py-3 px-4 font-semibold text-gray-600">Nombre</th>
                    <th class="text-left py-3 px-4 font-semibold text-gray-600">Capacidad</th>
                    <th class="text-left py-3 px-4 font-semibold text-gray-600">Ubicación</th>
                    <th class="text-right py-3 px-4 font-semibold text-gray-600">Acciones</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr
                    v-for="sala in salas"
                    :key="sala.id"
                    class="hover:bg-gray-50 transition-colors"
                    :class="{ 'bg-yellow-50': editandoId === sala.id }"
                  >
                    <td class="py-3 px-4 font-medium text-gray-800">
                      <i class="fa-solid fa-building mr-2 text-[#8B0000]"></i>{{ sala.nombre }}
                    </td>
                    <td class="py-3 px-4 text-gray-600">
                      <span class="inline-flex items-center gap-1">
                        <i class="fa-solid fa-chair text-gray-400"></i>
                        {{ sala.capacidad }} asientos
                      </span>
                    </td>
                    <td class="py-3 px-4 text-gray-500">{{ sala.ubicacion || '—' }}</td>
                    <td class="py-3 px-4 text-right space-x-2">
                      <button
                        @click="editarSala(sala)"
                        class="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                      >
                        <i class="fa-solid fa-pen-to-square mr-1"></i>Editar
                      </button>
                      <button
                        @click="eliminarSala(sala.id, sala.nombre)"
                        class="text-red-600 hover:text-red-800 font-medium transition-colors"
                      >
                        <i class="fa-solid fa-trash mr-1"></i>Eliminar
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { supabase } from '../lib/connectSupabase'
import type { Sala } from '../interface/ISala'

const salas = ref<Sala[]>([])
const cargando = ref(true)
const guardando = ref(false)
const editandoId = ref<string | null>(null)
const mensajeError = ref('')
const mensajeExito = ref('')

const form = reactive({
  nombre: '',
  capacidad: 0,
  ubicacion: ''
})

const limpiarMensajes = () => {
  mensajeError.value = ''
  mensajeExito.value = ''
}

const mostrarExito = (msg: string) => {
  mensajeExito.value = msg
  mensajeError.value = ''
  setTimeout(() => { mensajeExito.value = '' }, 3000)
}

const cargarSalas = async () => {
  try {
    cargando.value = true
    const { data, error } = await supabase
      .from('salas')
      .select('*')
      .order('nombre', { ascending: true })

    if (error) throw error
    salas.value = data || []
  } catch (err) {
    console.error('Error cargando salas:', err)
    mensajeError.value = 'No se pudieron cargar las salas'
  } finally {
    cargando.value = false
  }
}

const guardarSala = async () => {
  limpiarMensajes()
  if (!form.nombre.trim() || form.capacidad < 1) {
    mensajeError.value = 'Nombre y capacidad son obligatorios'
    return
  }

  guardando.value = true
  try {
    const payload = {
      nombre: form.nombre.trim(),
      capacidad: form.capacidad,
      ubicacion: form.ubicacion.trim() || null
    }

    if (editandoId.value) {
      const { error } = await supabase
        .from('salas')
        .update(payload)
        .eq('id', editandoId.value)

      if (error) throw error
      mostrarExito('Sala actualizada correctamente')
    } else {
      const { error } = await supabase
        .from('salas')
        .insert([payload])

      if (error) throw error
      mostrarExito('Sala creada correctamente')
    }

    cancelarEdicion()
    await cargarSalas()
  } catch (err) {
    console.error('Error guardando sala:', err)
    mensajeError.value = 'Error al guardar la sala: ' + (err as Error).message
  } finally {
    guardando.value = false
  }
}

const editarSala = (sala: Sala) => {
  editandoId.value = sala.id
  form.nombre = sala.nombre
  form.capacidad = sala.capacidad
  form.ubicacion = sala.ubicacion || ''
  limpiarMensajes()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const cancelarEdicion = () => {
  editandoId.value = null
  form.nombre = ''
  form.capacidad = 0
  form.ubicacion = ''
  limpiarMensajes()
}

const eliminarSala = async (id: string, nombre: string) => {
  if (!confirm(`¿Eliminar la sala "${nombre}"? Esta acción no se puede deshacer.`)) return

  try {
    const { error } = await supabase
      .from('salas')
      .delete()
      .eq('id', id)

    if (error) throw error
    mostrarExito('Sala eliminada correctamente')
    await cargarSalas()
  } catch (err) {
    console.error('Error eliminando sala:', err)
    mensajeError.value = 'Error al eliminar la sala: ' + (err as Error).message
  }
}

onMounted(cargarSalas)
</script>
