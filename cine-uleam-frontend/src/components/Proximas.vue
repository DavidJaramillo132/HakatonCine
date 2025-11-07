<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
          Próximos Estrenos
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Mantente al tanto de las películas que próximamente llegarán a nuestro cine. 
          ¡No te pierdas los estrenos más esperados!
        </p>
      </div>

      <!-- Coming Soon Section -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <!-- Película 1 -->
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
          <div class="relative aspect-[2/3] bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <div class="text-center p-6">
              <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p class="text-gray-500 text-sm">Próximamente</p>
            </div>
            <div class="absolute top-4 right-4 bg-[#8B0000] text-white px-3 py-1 rounded-full text-xs font-bold">
              PRÓXIMAMENTE
            </div>
          </div>
          <div class="p-6">
            <h3 class="text-xl font-bold text-gray-900 mb-2">
              Estreno en Preparación
            </h3>
            <p class="text-sm text-gray-600 mb-4">
              Estamos trabajando para traerte los mejores estrenos. Mantente atento a nuestras redes sociales para conocer las fechas exactas.
            </p>
            <div class="flex items-center text-sm text-gray-500">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Próximamente
            </div>
          </div>
        </div>

        <!-- Película 2 -->
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
          <div class="relative aspect-[2/3] bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <div class="text-center p-6">
              <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p class="text-gray-500 text-sm">Próximamente</p>
            </div>
            <div class="absolute top-4 right-4 bg-[#8B0000] text-white px-3 py-1 rounded-full text-xs font-bold">
              PRÓXIMAMENTE
            </div>
          </div>
          <div class="p-6">
            <h3 class="text-xl font-bold text-gray-900 mb-2">
              Nuevos Lanzamientos
            </h3>
            <p class="text-sm text-gray-600 mb-4">
              Las películas más esperadas del año están por llegar. Sigue nuestras actualizaciones para no perderte ningún estreno importante.
            </p>
            <div class="flex items-center text-sm text-gray-500">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Próximamente
            </div>
          </div>
        </div>

        <!-- Película 3 -->
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
          <div class="relative aspect-[2/3] bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <div class="text-center p-6">
              <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p class="text-gray-500 text-sm">Próximamente</p>
            </div>
            <div class="absolute top-4 right-4 bg-[#8B0000] text-white px-3 py-1 rounded-full text-xs font-bold">
              PRÓXIMAMENTE
            </div>
          </div>
          <div class="p-6">
            <h3 class="text-xl font-bold text-gray-900 mb-2">
              Películas Exclusivas
            </h3>
            <p class="text-sm text-gray-600 mb-4">
              Estamos negociando los derechos para traer las mejores producciones cinematográficas directamente a nuestra comunidad universitaria.
            </p>
            <div class="flex items-center text-sm text-gray-500">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Próximamente
            </div>
          </div>
        </div>
      </div>

      <!-- Info Section -->
      <div class="bg-white rounded-2xl shadow-lg p-8 text-center">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">
          ¿Quieres estar al día con nuestros estrenos?
        </h2>
        <p class="text-gray-600 mb-6 max-w-2xl mx-auto">
          Regístrate en nuestra plataforma para recibir notificaciones sobre nuevas películas, 
          funciones especiales y eventos exclusivos. También puedes seguir nuestras redes sociales 
          para no perderte ningún detalle.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link
            v-if="!isAuthenticated"
            to="/register"
            class="bg-[#8B0000] text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:bg-[#A52A2A] hover:scale-105 transition-all duration-200"
          >
            Crear Cuenta
          </router-link>
          <router-link
            to="/cartelera"
            class="bg-gray-200 text-gray-900 px-8 py-3 rounded-xl font-semibold shadow-lg hover:bg-gray-300 hover:scale-105 transition-all duration-200"
          >
            Ver Cartelera Actual
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/connectSupabase'

const isAuthenticated = ref(false)

const checkAuth = async () => {
  const { data } = await supabase.auth.getSession()
  const storedId = localStorage.getItem('userId')
  isAuthenticated.value = Boolean(data.session) || Boolean(storedId)
}

onMounted(() => {
  checkAuth()
})
</script>

<style scoped>
</style>

