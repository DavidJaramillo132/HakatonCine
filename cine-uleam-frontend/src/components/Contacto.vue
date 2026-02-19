<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
          Contáctanos
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          ¿Tienes alguna pregunta, sugerencia o necesitas ayuda? Estamos aquí para asistirte. 
          No dudes en ponerte en contacto con nosotros a través de cualquiera de los siguientes medios.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Contact Form -->
        <div class="bg-white rounded-2xl shadow-lg p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">
            Envíanos un Mensaje
          </h2>
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div>
              <label for="nombre" class="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo
              </label>
              <input
                id="nombre"
                v-model="formData.nombre"
                type="text"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B0000] focus:border-transparent transition duration-200"
                placeholder="Tu nombre"
              />
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <input
                id="email"
                v-model="formData.email"
                type="email"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B0000] focus:border-transparent transition duration-200"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label for="asunto" class="block text-sm font-medium text-gray-700 mb-2">
                Asunto
              </label>
              <select
                id="asunto"
                v-model="formData.asunto"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B0000] focus:border-transparent transition duration-200"
              >
                <option value="">Selecciona un asunto</option>
                <option value="consulta">Consulta General</option>
                <option value="sugerencia">Sugerencia de Película</option>
                <option value="problema">Reportar un Problema</option>
                <option value="reserva">Consulta sobre Reservas</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div>
              <label for="mensaje" class="block text-sm font-medium text-gray-700 mb-2">
                Mensaje
              </label>
              <textarea
                id="mensaje"
                v-model="formData.mensaje"
                required
                rows="5"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B0000] focus:border-transparent transition duration-200 resize-none"
                placeholder="Escribe tu mensaje aquí..."
              ></textarea>
            </div>

            <!-- Success Message -->
            <div v-if="successMessage" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              <i class="fa-solid fa-circle-check mr-1"></i>{{ successMessage }}
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <i class="fa-solid fa-triangle-exclamation mr-1"></i>{{ errorMessage }}
            </div>

            <button
              type="submit"
              :disabled="isLoading"
              class="w-full bg-[#8B0000] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#A52A2A] hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isLoading ? 'Enviando...' : 'Enviar Mensaje' }}
            </button>
          </form>
        </div>

        <!-- Contact Information -->
        <div class="space-y-6">
          <!-- Address Card -->
          <div class="bg-white rounded-2xl shadow-lg p-8">
            <div class="flex items-start space-x-4">
              <div class="bg-[#8B0000] text-white p-4 rounded-lg">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900 mb-2">Ubicación</h3>
                <p class="text-gray-600">
                  Universidad Laica Eloy Alfaro de Manabí<br/>
                  Campus Universitario<br/>
                  Manta, Manabí, Ecuador
                </p>
              </div>
            </div>
          </div>

          <!-- Phone Card -->
          <div class="bg-white rounded-2xl shadow-lg p-8">
            <div class="flex items-start space-x-4">
              <div class="bg-[#8B0000] text-white p-4 rounded-lg">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900 mb-2">Teléfono</h3>
                <p class="text-gray-600">
                  (05) 262-3740<br/>
                  <span class="text-sm text-gray-500">Lunes a Viernes: 8:00 AM - 6:00 PM</span>
                </p>
              </div>
            </div>
          </div>

          <!-- Email Card -->
          <div class="bg-white rounded-2xl shadow-lg p-8">
            <div class="flex items-start space-x-4">
              <div class="bg-[#8B0000] text-white p-4 rounded-lg">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900 mb-2">Correo Electrónico</h3>
                <p class="text-gray-600">
                  <a href="mailto:cine@uleam.edu.ec" class="text-[#8B0000] hover:underline">
                    cine@uleam.edu.ec
                  </a>
                </p>
              </div>
            </div>
          </div>

          <!-- Social Media Card -->
          <div class="bg-white rounded-2xl shadow-lg p-8">
            <h3 class="text-xl font-bold text-gray-900 mb-4">Síguenos en Redes Sociales</h3>
            <div class="flex space-x-4">
              <a href="https://www.facebook.com/UleamEc" aria-label="Facebook" class="bg-gray-100 hover:bg-[#8B0000] text-gray-700 hover:text-white p-3 rounded-lg transition-all duration-200 hover:scale-110">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/uleam_ecuador_oficial/" aria-label="Instagram" class="bg-gray-100 hover:bg-[#8B0000] text-gray-700 hover:text-white p-3 rounded-lg transition-all duration-200 hover:scale-110">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const formData = reactive({
  nombre: '',
  email: '',
  asunto: '',
  mensaje: ''
})

const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const handleSubmit = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  isLoading.value = true

  try {
    // Simular envío del formulario
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // En una implementación real, aquí se enviaría el formulario a un backend
    successMessage.value = '¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.'
    
    // Limpiar formulario
    formData.nombre = ''
    formData.email = ''
    formData.asunto = ''
    formData.mensaje = ''
  } catch (error: any) {
    errorMessage.value = 'Error al enviar el mensaje. Por favor, intenta de nuevo o contáctanos directamente por correo electrónico.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
</style>

