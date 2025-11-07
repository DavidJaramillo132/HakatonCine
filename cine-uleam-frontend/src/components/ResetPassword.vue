<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8 relative z-10">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-2xl relative z-20">
      <!-- Header -->
      <div class="text-center">
        <h2 class="text-3xl font-extrabold text-gray-900">
          Establecer Nueva Contraseña
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Ingresa tu nueva contraseña
        </p>
      </div>

      <!-- Error de token inválido -->
      <div v-if="!isValidToken && errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
        ⚠️ {{ errorMessage }}
      </div>

      <!-- Form -->
      <form v-if="isValidToken || !errorMessage" class="mt-8 space-y-6" @submit.prevent="handleResetPassword">
        <div class="space-y-4">
          <!-- New Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
              Nueva Contraseña
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                id="password"
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                required
                minlength="6"
                class="appearance-none block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B0000] focus:border-transparent transition duration-200"
                placeholder="Mínimo 6 caracteres"
              />
              <button
                type="button"
                @click="togglePassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg v-if="!showPassword" class="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Confirm Password -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">
              Confirmar Nueva Contraseña
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <input
                id="confirmPassword"
                v-model="formData.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                required
                minlength="6"
                class="appearance-none block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B0000] focus:border-transparent transition duration-200"
                placeholder="Repite tu nueva contraseña"
              />
              <button
                type="button"
                @click="toggleConfirmPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg v-if="!showConfirmPassword" class="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
            <p v-if="passwordMismatch" class="mt-1 text-sm text-red-600">
              Las contraseñas no coinciden
            </p>
          </div>
        </div>

        <!-- Success Message -->
        <div v-if="successMessage" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          ✅ {{ successMessage }}
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          ⚠️ {{ errorMessage }}
        </div>

        <!-- Submit Button -->
        <div>
          <button
            type="submit"
            :disabled="isLoading || passwordMismatch || formData.password.length < 6"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-[#8B0000] hover:bg-[#A52A2A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B0000] transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isLoading ? 'Actualizando...' : 'Actualizar Contraseña' }}
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
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/connectSupabase'

const router = useRouter()

const formData = reactive({
  password: '',
  confirmPassword: ''
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const isValidToken = ref(false)

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

const passwordMismatch = computed(() => {
  return formData.confirmPassword.length > 0 && formData.password !== formData.confirmPassword
})

// Verificar y procesar el hash de recuperación cuando el componente se monta
onMounted(async () => {
  try {
    // Verificar si hay un hash en la URL (Supabase incluye el token en el hash)
    const hash = window.location.hash
    
    if (!hash) {
      // No hay hash, verificar si hay una sesión activa
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        isValidToken.value = true
        return
      } else {
        errorMessage.value = 'No se encontró un enlace de recuperación válido. Por favor, solicita uno nuevo.'
        setTimeout(() => {
          router.push('/forgot-password')
        }, 3000)
        return
      }
    }
    
    // Hay un hash, verificar si es un token de recuperación
    const hashParams = new URLSearchParams(hash.substring(1))
    const type = hashParams.get('type')
    
    if (type === 'recovery') {
      // Es un token de recuperación
      // Supabase procesa automáticamente el hash cuando se carga la página
      // Esperar un momento para que Supabase procese el hash
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Verificar si se estableció la sesión
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Error al obtener la sesión:', error)
        // Permitir intentar actualizar la contraseña de todas formas
        // Supabase validará el token cuando se intente actualizar
        isValidToken.value = true
      } else if (session) {
        // La sesión se estableció correctamente, el token es válido
        isValidToken.value = true
      } else {
        // El hash existe pero no se estableció la sesión
        // Esto puede ocurrir si el token expiró, pero permitimos intentar
        // Supabase validará el token cuando se intente actualizar la contraseña
        isValidToken.value = true
      }
    } else {
      // No es un token de recuperación, verificar si hay sesión
      //const { data: { session } } = await supabase.auth.getSession()
      isValidToken.value = true // Permitir intentar de todas formas
    }
  } catch (error: any) {
    console.error('Error al verificar el enlace de recuperación:', error)
    errorMessage.value = 'Error al verificar el enlace de recuperación. Por favor, solicita uno nuevo.'
    setTimeout(() => {
      router.push('/forgot-password')
    }, 3000)
  }
})

const handleResetPassword = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  
  if (formData.password.length < 6) {
    errorMessage.value = 'La contraseña debe tener al menos 6 caracteres'
    return
  }
  
  if (formData.password !== formData.confirmPassword) {
    errorMessage.value = 'Las contraseñas no coinciden'
    return
  }
  
  isLoading.value = true
  
  try {
    // Actualizar la contraseña del usuario
    const { error } = await supabase.auth.updateUser({
      password: formData.password
    })
    
    if (error) throw error
    
    successMessage.value = '¡Contraseña actualizada exitosamente! Redirigiendo al inicio de sesión...'
    
    // Limpiar el hash de la URL
    window.history.replaceState(null, '', window.location.pathname)
    
    // Esperar 2 segundos antes de redirigir
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (error: any) {
    errorMessage.value = error.message || 'Error al actualizar la contraseña. Asegúrate de que el enlace sea válido.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>  

</style>

