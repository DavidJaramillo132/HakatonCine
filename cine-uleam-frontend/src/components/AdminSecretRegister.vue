<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8 relative z-10">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-2xl relative z-20">
      <div class="text-center">
        <h2 class="text-3xl font-extrabold text-gray-900">
          Registro Privado de Administradores
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Acceso exclusivo. Ingresa el código secreto para crear una cuenta administrativa.
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="space-y-4">
          <div>
            <label for="secretCode" class="block text-sm font-medium text-gray-700 mb-1">
              Código Secreto
            </label>
            <div class="relative">
              <input
                id="secretCode"
                v-model="formData.secretCode"
                type="password"
                required
                class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B0000] focus:border-transparent transition duration-200"
                placeholder="Ingresa el código secreto"
              />
            </div>
            <p v-if="!isSecretConfigured" class="mt-2 text-sm text-red-600">
              No se ha configurado el código secreto. Contacta al administrador del sistema.
            </p>
          </div>

          <div>
            <label for="fullName" class="block text-sm font-medium text-gray-700 mb-1">
              Nombre Completo
            </label>
            <div class="relative">
              <input
                id="fullName"
                v-model="formData.fullName"
                type="text"
                required
                class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B0000] focus:border-transparent transition duration-200"
                placeholder="Ej: María Martínez"
              />
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
              Correo Electrónico
            </label>
            <div class="relative">
              <input
                id="email"
                v-model="formData.email"
                type="email"
                required
                class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B0000] focus:border-transparent transition duration-200"
                placeholder="admin@live.uleam.edu.ec"
              />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                required
                minlength="6"
                class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B0000] focus:border-transparent transition duration-200"
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

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">
              Confirmar Contraseña
            </label>
            <div class="relative">
              <input
                id="confirmPassword"
                v-model="formData.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                required
                minlength="6"
                class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B0000] focus:border-transparent transition duration-200"
                placeholder="Repite tu contraseña"
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

        <div v-if="successMessage" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          <i class="fa-solid fa-circle-check mr-1"></i>{{ successMessage }}
        </div>

        <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <i class="fa-solid fa-triangle-exclamation mr-1"></i>{{ errorMessage }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading || !isFormValid || !isSecretConfigured"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-[#8B0000] hover:bg-[#A52A2A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B0000] transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isLoading ? 'Creando cuenta...' : 'Crear Administrador' }}
          </button>
        </div>

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
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/connectSupabase'

const router = useRouter()
const ADMIN_SECRET = import.meta.env.VITE_ADMIN_SECRET as string | undefined

const formData = reactive({
  secretCode: '',
  fullName: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const isSecretConfigured = computed(() => Boolean(ADMIN_SECRET))

const passwordMismatch = computed(() => {
  return formData.confirmPassword.length > 0 && formData.password !== formData.confirmPassword
})

const isFormValid = computed(() => {
  return (
    formData.secretCode.length > 0 &&
    formData.fullName.length > 0 &&
    formData.email.length > 0 &&
    formData.password.length >= 6 &&
    formData.password === formData.confirmPassword
  )
})

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

const resetForm = () => {
  formData.secretCode = ''
  formData.fullName = ''
  formData.email = ''
  formData.password = ''
  formData.confirmPassword = ''
}

const handleRegister = async () => {
  if (!isSecretConfigured.value) {
    errorMessage.value = 'El código secreto no está configurado. Contacta al administrador.'
    return
  }

  if (formData.secretCode !== ADMIN_SECRET) {
    errorMessage.value = 'Código secreto incorrecto.'
    return
  }

  if (!isFormValid.value || passwordMismatch.value) {
    errorMessage.value = 'Verifica los datos del formulario.'
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const normalizedEmail = formData.email.trim().toLowerCase()

    const { data: existingUsuario } = await supabase
      .from('usuarios')
      .select('id, correo, rol, nombre')
      .eq('correo', normalizedEmail)
      .maybeSingle()

    const { data: sessionData } = await supabase.auth.getSession()
    const activeSession = sessionData.session

    if (existingUsuario) {
      if (!activeSession || activeSession.user.id !== existingUsuario.id) {
        errorMessage.value = 'Este correo ya está registrado. Inicia sesión con esa cuenta y vuelve a intentarlo.'
        return
      }

      const { error: updateAuthError } = await supabase.auth.updateUser({
        password: formData.password,
        data: {
          full_name: formData.fullName,
          role: 'admin'
        }
      })

      if (updateAuthError) throw updateAuthError

      const { error: updateUserError } = await supabase
        .from('usuarios')
        .update({
          nombre: formData.fullName,
          rol: 'admin'
        })
        .eq('id', existingUsuario.id)

      if (updateUserError) throw updateUserError

      localStorage.setItem('userId', existingUsuario.id)
      localStorage.setItem('userRole', 'admin')
      localStorage.setItem('userName', formData.fullName)

      successMessage.value = '¡Tu cuenta fue promovida a administrador! Redirigiendo al panel...'
      resetForm()

      setTimeout(() => {
        router.push('/admin')
      }, 1500)
      return
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: normalizedEmail,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
          role: 'admin'
        }
      }
    })

    if (authError) throw authError

    if (authData.user) {
      await new Promise(resolve => setTimeout(resolve, 500))

      const { data: usuario, error: userError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', authData.user.id)
        .single()

      if (userError) throw userError

      localStorage.setItem('userId', usuario.id)
      localStorage.setItem('userRole', usuario.rol)
      localStorage.setItem('userName', usuario.nombre)

      successMessage.value = '¡Cuenta administrativa creada exitosamente! Redirigiendo al panel...'
      resetForm()

      setTimeout(() => {
        router.push('/admin')
      }, 1500)
    }
  } catch (error: any) {
    console.error('Error en registro admin:', error)
    if (error?.message?.includes('already registered')) {
      errorMessage.value = 'Este correo ya está registrado.'
    } else {
      errorMessage.value = error?.message || 'Error al crear la cuenta administrativa.'
    }
  } finally {
    isLoading.value = false
  }
}

</script>

<style scoped>

</style>

