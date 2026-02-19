<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8 relative z-10">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-2xl relative z-20">
      <!-- Header d -->
      <div class="text-center">
        <h2 class="text-3xl font-extrabold text-gray-900">
          Recuperar Contraseña
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Ingresa tu correo institucional y te enviaremos un enlace para restablecer tu contraseña
        </p>
      </div>

      <!-- Form -->
      <form class="mt-8 space-y-6" @submit.prevent="handleForgotPassword">
        <div class="space-y-4">
          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
              Correo Electrónico
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input
                id="email"
                v-model="formData.email"
                type="email"
                required
                class="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B0000] focus:border-transparent transition duration-200"
                placeholder="ejemplo@live.uleam.edu.ec"
              />
            </div>
          </div>
        </div>

        <!-- Success Message -->
        <div v-if="successMessage" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          <i class="fa-solid fa-circle-check mr-1"></i>{{ successMessage }}
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <i class="fa-solid fa-triangle-exclamation mr-1"></i>{{ errorMessage }}
        </div>

        <!-- Submit Button -->
        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-[#8B0000] hover:bg-[#A52A2A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B0000] transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isLoading ? 'Enviando...' : 'Enviar Enlace de Recuperación' }}
          </button>
        </div>

        <!-- Back to Login -->
        <div class="text-center">
          <router-link to="/login" class="text-sm font-medium text-[#8B0000] hover:text-[#A52A2A] transition duration-200">
            ← Volver al inicio de sesión
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { supabase } from '../lib/connectSupabase'

const formData = reactive({
  email: ''
})

const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const handleForgotPassword = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  
  // Validar formato de correo institucional
  if (!formData.email.endsWith('@live.uleam.edu.ec')) {
    errorMessage.value = 'Debe usar su correo institucional (@live.uleam.edu.ec)'
    return
  }
  
  isLoading.value = true
  
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    
    if (error) throw error
    
    successMessage.value = '¡Enlace de recuperación enviado! Revisa tu correo electrónico para restablecer tu contraseña.'
    formData.email = ''
  } catch (error: any) {
    errorMessage.value = error.message || 'Error al enviar el enlace de recuperación'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>  

</style>

