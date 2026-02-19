<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-[#8B0000] text-white shadow-lg">
      <div class="container mx-auto px-6 py-6">
        <h1 class="text-3xl font-bold">Encuestas</h1>
        <p class="text-gray-200 mt-1">Comparte tu opinión sobre el cine ULEAM</p>
      </div>
    </div>

    <div class="container mx-auto px-6 py-8">
      <!-- Mensaje de carga -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B0000]"></div>
        <p class="mt-4 text-gray-600">Cargando encuestas...</p>
      </div>

      <div v-else>
        <!-- Encuestas pendientes -->
        <div v-if="encuestasPendientes.length > 0" class="mb-12">
          <h2 class="text-2xl font-bold text-gray-800 mb-6"><i class="fa-solid fa-pen-to-square mr-2"></i>Encuestas Activas</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              v-for="encuesta in encuestasPendientes"
              :key="encuesta.id"
              class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h3 class="text-xl font-bold text-gray-800 mb-2">{{ encuesta.pregunta }}</h3>
              <p class="text-sm text-gray-500 mb-6">
                <i class="fa-solid fa-calendar-days mr-1"></i>{{ formatearFecha(encuesta.fecha_creacion) }}
                <span v-if="encuesta.fecha_cierre">
                  • <i class="fa-solid fa-lock mr-1"></i>Cierra: {{ formatearFecha(encuesta.fecha_cierre) }}
                </span>
              </p>

              <div class="flex gap-4">
                <button
                  @click="responder(encuesta.id, true)"
                  :disabled="respondiendo"
                  class="flex-1 bg-green-600 text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-colors disabled:opacity-50 shadow-md"
                >
                  ✓ SÍ
                </button>
                <button
                  @click="responder(encuesta.id, false)"
                  :disabled="respondiendo"
                  class="flex-1 bg-red-600 text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-red-700 transition-colors disabled:opacity-50 shadow-md"
                >
                  ✗ NO
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Encuestas respondidas -->
        <div v-if="encuestasRespondidas.length > 0">
          <h2 class="text-2xl font-bold text-gray-800 mb-6"><i class="fa-solid fa-circle-check mr-2"></i>Encuestas Respondidas</h2>
          <div class="grid grid-cols-1 gap-4">
            <div
              v-for="item in encuestasRespondidas"
              :key="item.encuesta.id"
              class="bg-white rounded-xl shadow-md p-6"
            >
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <h3 class="text-lg font-bold text-gray-800 mb-1">{{ item.encuesta.pregunta }}</h3>
                  <p class="text-sm text-gray-500">
                    <i class="fa-solid fa-calendar-days mr-1"></i>{{ formatearFecha(item.encuesta.fecha_creacion) }}
                  </p>
                </div>
                <span
                  :class="item.voto.respuesta ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                  class="px-4 py-2 rounded-full font-bold text-sm"
                >
                  {{ item.voto.respuesta ? '✓ SÍ' : '✗ NO' }}
                </span>
              </div>
              <p class="text-xs text-gray-400 mt-2">
                Respondiste el {{ formatearFecha(item.voto.fecha_voto) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Sin encuestas -->
        <div v-if="encuestasPendientes.length === 0 && encuestasRespondidas.length === 0" class="text-center py-12">
          <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p class="text-gray-500 text-lg">No hay encuestas disponibles</p>
          <p class="text-gray-400 text-sm mt-2">Vuelve más tarde para ver nuevas encuestas</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { supabase } from '../lib/connectSupabase';
import type { IEncuesta, IVoto } from '../interface/IEncuesta';

// Estados
const encuestasPendientes = ref<IEncuesta[]>([]);
const encuestasRespondidas = ref<{ encuesta: IEncuesta; voto: IVoto }[]>([]);
const loading = ref(true);
const respondiendo = ref(false);

// Funciones
async function cargarEncuestas() {
  loading.value = true;
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuario no autenticado');

    // Cargar todas las encuestas activas
    const { data: todasEncuestas, error: errorEncuestas } = await supabase
      .from('encuestas')
      .select('*')
      .order('fecha_creacion', { ascending: false });

    if (errorEncuestas) throw errorEncuestas;

    // Cargar votos del usuario
    const { data: votosUsuario, error: errorVotos } = await supabase
      .from('votos')
      .select('*')
      .eq('usuario_id', user.id);

    if (errorVotos) throw errorVotos;

    const encuestas = todasEncuestas || [];
    const votos = votosUsuario || [];

    // Filtrar encuestas activas (sin fecha de cierre o aún no cerradas)
    const encuestasActivas = encuestas.filter(e => {
      if (!e.fecha_cierre) return true;
      return new Date(e.fecha_cierre) > new Date();
    });

    // Separar pendientes y respondidas
    const votosMap = new Map(votos.map(v => [v.encuesta_id, v]));

    encuestasPendientes.value = encuestasActivas.filter(e => !votosMap.has(e.id));
    
    encuestasRespondidas.value = encuestasActivas
      .filter(e => votosMap.has(e.id))
      .map(e => ({
        encuesta: e,
        voto: votosMap.get(e.id)!
      }));

  } catch (error: any) {
    console.error('Error cargando encuestas:', error);
    alert('Error al cargar las encuestas: ' + error.message);
  } finally {
    loading.value = false;
  }
}

async function responder(encuestaId: string, respuesta: boolean) {
  if (respondiendo.value) return;

  respondiendo.value = true;
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuario no autenticado');

    const { error } = await supabase
      .from('votos')
      .insert({
        encuesta_id: encuestaId,
        usuario_id: user.id,
        respuesta: respuesta
      });

    if (error) throw error;

    // Recargar encuestas
    await cargarEncuestas();
  } catch (error: any) {
    console.error('Error respondiendo encuesta:', error);
    if (error.code === '23505') {
      alert('Ya has respondido esta encuesta');
    } else {
      alert('Error al responder la encuesta: ' + error.message);
    }
  } finally {
    respondiendo.value = false;
  }
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

// Lifecycle
onMounted(() => {
  cargarEncuestas();
});
</script>
