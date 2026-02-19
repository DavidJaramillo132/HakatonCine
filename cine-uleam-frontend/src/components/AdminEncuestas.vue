<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-[#8B0000] text-white shadow-lg">
      <div class="container mx-auto px-6 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold">Gestión de Encuestas</h1>
            <p class="text-gray-200 mt-1">Crea y administra encuestas para los estudiantes</p>
          </div>
          <div class="flex gap-3">
            <RouterLink
              to="/admin"
              class="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-5 py-3 rounded-xl font-semibold transition-all duration-200"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Dashboard
            </RouterLink>
            <RouterLink
              to="/admin/cartelera"
              class="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-5 py-3 rounded-xl font-semibold transition-all duration-200"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
              Cartelera
            </RouterLink>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-6 py-8">
      <!-- Botón para crear nueva encuesta -->
      <div class="mb-6">
        <button
          @click="mostrarFormulario = true"
          class="inline-flex items-center gap-2 bg-[#8B0000] text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-[#A52A2A] transition-all duration-200"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Nueva Encuesta
        </button>
      </div>

      <!-- Modal para crear encuesta -->
      <div v-if="mostrarFormulario" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-2xl font-bold text-gray-800">{{ editando ? 'Editar Encuesta' : 'Nueva Encuesta' }}</h2>
              <button @click="cerrarFormulario" class="text-gray-500 hover:text-gray-700">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form @submit.prevent="guardarEncuesta" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Pregunta *</label>
                <input
                  v-model="formulario.pregunta"
                  type="text"
                  required
                  placeholder="¿Te gustaría que proyectáramos más películas de acción?"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Fecha de cierre (opcional)</label>
                <input
                  v-model="formulario.fecha_cierre"
                  type="datetime-local"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent"
                />
                <p class="text-xs text-gray-500 mt-1">Si no se especifica, la encuesta no tendrá fecha de cierre</p>
              </div>

              <div class="flex gap-3 pt-4">
                <button
                  type="submit"
                  :disabled="guardando"
                  class="flex-1 bg-[#8B0000] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#A52A2A] transition-colors disabled:opacity-50"
                >
                  {{ guardando ? 'Guardando...' : (editando ? 'Actualizar' : 'Crear Encuesta') }}
                </button>
                <button
                  type="button"
                  @click="cerrarFormulario"
                  class="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Mensaje de carga -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B0000]"></div>
        <p class="mt-4 text-gray-600">Cargando encuestas...</p>
      </div>

      <!-- Lista de encuestas -->
      <div v-else class="grid grid-cols-1 gap-6">
        <div
          v-for="encuesta in encuestas"
          :key="encuesta.id"
          class="bg-white rounded-xl shadow-md overflow-hidden"
        >
          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <h3 class="text-xl font-bold text-gray-800">{{ encuesta.pregunta }}</h3>
                  <span
                    :class="estaActiva(encuesta) ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                    class="px-3 py-1 text-xs font-semibold rounded-full"
                  >
                    {{ estaActiva(encuesta) ? 'Activa' : 'Cerrada' }}
                  </span>
                </div>
                <div class="flex gap-4 text-sm text-gray-500">
                  <span><i class="fa-solid fa-calendar-days mr-1"></i>Creada: {{ formatearFecha(encuesta.fecha_creacion) }}</span>
                  <span v-if="encuesta.fecha_cierre"><i class="fa-solid fa-lock mr-1"></i>Cierra: {{ formatearFecha(encuesta.fecha_cierre) }}</span>
                  <span v-else><i class="fa-solid fa-infinity mr-1"></i>Sin fecha de cierre</span>
                </div>
              </div>
              <div class="flex gap-2">
                <button
                  @click="editarEncuesta(encuesta)"
                  class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Editar"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  @click="eliminarEncuesta(encuesta.id)"
                  class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Eliminar"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Estadísticas -->
            <div v-if="estadisticas[encuesta.id]" class="mt-4 bg-gray-50 rounded-lg p-4">
              <h4 class="font-semibold text-gray-700 mb-3">Estadísticas</h4>
              <div class="grid grid-cols-3 gap-4 mb-4">
                <div class="text-center">
                  <p class="text-2xl font-bold text-gray-800">{{ estadisticas[encuesta.id].total }}</p>
                  <p class="text-sm text-gray-600">Total respuestas</p>
                </div>
                <div class="text-center">
                  <p class="text-2xl font-bold text-green-600">{{ estadisticas[encuesta.id].si }}</p>
                  <p class="text-sm text-gray-600">Sí ({{ getPorcentaje(encuesta.id, 'si') }}%)</p>
                </div>
                <div class="text-center">
                  <p class="text-2xl font-bold text-red-600">{{ estadisticas[encuesta.id].no }}</p>
                  <p class="text-sm text-gray-600">No ({{ getPorcentaje(encuesta.id, 'no') }}%)</p>
                </div>
              </div>
              
              <!-- Barra de progreso -->
              <div v-if="estadisticas[encuesta.id].total > 0" class="w-full h-8 bg-gray-200 rounded-full overflow-hidden flex">
                <div
                  :style="{ width: getPorcentaje(encuesta.id, 'si') + '%' }"
                  class="bg-green-500 flex items-center justify-center text-white text-xs font-semibold"
                >
                  <span v-if="getPorcentaje(encuesta.id, 'si') > 10">SÍ {{ getPorcentaje(encuesta.id, 'si') }}%</span>
                </div>
                <div
                  :style="{ width: getPorcentaje(encuesta.id, 'no') + '%' }"
                  class="bg-red-500 flex items-center justify-center text-white text-xs font-semibold"
                >
                  <span v-if="getPorcentaje(encuesta.id, 'no') > 10">NO {{ getPorcentaje(encuesta.id, 'no') }}%</span>
                </div>
              </div>
              <p v-else class="text-center text-gray-500 text-sm">Sin respuestas aún</p>
            </div>
          </div>
        </div>

        <div v-if="encuestas.length === 0" class="text-center py-12">
          <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p class="text-gray-500 text-lg">No hay encuestas creadas</p>
          <p class="text-gray-400 text-sm mt-2">Crea tu primera encuesta para comenzar</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { supabase } from '../lib/connectSupabase';
import type { IEncuesta } from '../interface/IEncuesta';

// Estados
const encuestas = ref<IEncuesta[]>([]);
const loading = ref(true);
const guardando = ref(false);
const mostrarFormulario = ref(false);
const editando = ref(false);

// Formulario
const formulario = ref({
  id: '',
  pregunta: '',
  fecha_cierre: ''
});

// Estadísticas por encuesta
const estadisticas = ref<Record<string, { total: number; si: number; no: number }>>({});

// Funciones
async function cargarEncuestas() {
  loading.value = true;
  try {
    const { data, error } = await supabase
      .from('encuestas')
      .select('*')
      .order('fecha_creacion', { ascending: false });

    if (error) throw error;

    encuestas.value = data || [];
    
    // Cargar estadísticas para cada encuesta
    for (const encuesta of encuestas.value) {
      await cargarEstadisticas(encuesta.id);
    }
  } catch (error: any) {
    console.error('Error cargando encuestas:', error);
    alert('Error al cargar las encuestas: ' + error.message);
  } finally {
    loading.value = false;
  }
}

async function cargarEstadisticas(encuestaId: string) {
  try {
    const { data, error } = await supabase
      .from('votos')
      .select('respuesta')
      .eq('encuesta_id', encuestaId);

    if (error) throw error;

    const total = data?.length || 0;
    const si = data?.filter(v => v.respuesta === true).length || 0;
    const no = total - si;

    estadisticas.value[encuestaId] = { total, si, no };
  } catch (error: any) {
    console.error('Error cargando estadísticas:', error);
    estadisticas.value[encuestaId] = { total: 0, si: 0, no: 0 };
  }
}

async function guardarEncuesta() {
  if (!formulario.value.pregunta.trim()) {
    alert('La pregunta es obligatoria');
    return;
  }

  guardando.value = true;
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuario no autenticado');

    if (editando.value) {
      // Actualizar encuesta existente
      const { error } = await supabase
        .from('encuestas')
        .update({
          pregunta: formulario.value.pregunta,
          fecha_cierre: formulario.value.fecha_cierre || null
        })
        .eq('id', formulario.value.id);

      if (error) throw error;
    } else {
      // Crear nueva encuesta
      const { error } = await supabase
        .from('encuestas')
        .insert({
          pregunta: formulario.value.pregunta,
          admin_id: user.id,
          fecha_cierre: formulario.value.fecha_cierre || null
        });

      if (error) throw error;
    }

    cerrarFormulario();
    await cargarEncuestas();
  } catch (error: any) {
    console.error('Error guardando encuesta:', error);
    alert('Error al guardar la encuesta: ' + error.message);
  } finally {
    guardando.value = false;
  }
}

function editarEncuesta(encuesta: IEncuesta) {
  formulario.value = {
    id: encuesta.id,
    pregunta: encuesta.pregunta,
    fecha_cierre: encuesta.fecha_cierre 
      ? new Date(encuesta.fecha_cierre).toISOString().slice(0, 16) 
      : ''
  };
  editando.value = true;
  mostrarFormulario.value = true;
}

async function eliminarEncuesta(id: string) {
  if (!confirm('¿Estás seguro de eliminar esta encuesta? Se eliminarán todas las respuestas asociadas.')) {
    return;
  }

  try {
    const { error } = await supabase
      .from('encuestas')
      .delete()
      .eq('id', id);

    if (error) throw error;

    await cargarEncuestas();
  } catch (error: any) {
    console.error('Error eliminando encuesta:', error);
    alert('Error al eliminar la encuesta: ' + error.message);
  }
}

function cerrarFormulario() {
  mostrarFormulario.value = false;
  editando.value = false;
  formulario.value = {
    id: '',
    pregunta: '',
    fecha_cierre: ''
  };
}

function formatearFecha(fecha: string): string {
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function estaActiva(encuesta: IEncuesta): boolean {
  if (!encuesta.fecha_cierre) return true;
  return new Date(encuesta.fecha_cierre) > new Date();
}

function getPorcentaje(encuestaId: string, tipo: 'si' | 'no'): number {
  const stats = estadisticas.value[encuestaId];
  if (!stats || stats.total === 0) return 0;
  
  const valor = tipo === 'si' ? stats.si : stats.no;
  return Math.round((valor / stats.total) * 100);
}

// Lifecycle
onMounted(() => {
  cargarEncuestas();
});
</script>
