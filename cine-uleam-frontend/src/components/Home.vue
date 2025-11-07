<template>
<!-- Sección principal -->
  <section
    class="relative min-h-screen flex items-center justify-center text-white px-8 py-12 bg-cover bg-center"
    :style="{ backgroundImage: `url(${cineImage3})` }"
    
  >
    <div class="absolute inset-0 bg-black/30 backdrop-blur-md"></div>

    <div class="relative z-10 max-w-3xl text-center space-y-6">
      <h1 class="text-4xl font-bold">Bienvenido al Cine ULEAM</h1>
      <p class="text-xl">Disfruta de las mejores películas en el corazón de tu universidad.</p>

      <div class="flex flex-col sm:flex-row gap-4 justify-center mt-8">
        <RouterLink
          to="/cartelera"
          class="bg-[#8B0000] text-white px-8 py-3 font-semibold rounded-xl shadow-lg hover:bg-[#A52A2A] hover:scale-105 transition-all duration-300"
        >
          Ver Cartelera
        </RouterLink>
      </div>
    </div>
  </section>

  <!-- Sección: Sobre nosotros -->
<!--  <section
    class="flex flex-col md:flex-row items-center justify-between gap-16 px-10 py-24 bg-gradient-to-br from-gray-50 to-white presentacion"
  >
    <div class="md:w-1/2 space-y-6 presentacion-div">
      <h2 class="text-5xl font-serif font-semibold text-gray-900 leading-tight">
        Acerca de nosotros
      </h2>

      <p class="text-lg text-gray-600 leading-relaxed">
        <span class="font-semibold text-[#8B0000]">Cine ULEAM</span>, es
        el espacio cinematográfico de la Universidad Laica Eloy Alfaro de Manabí,
        diseñado para brindar entretenimiento de calidad y enriquecer la cultura universitaria.
      </p>

      <RouterLink
        to="/register"
        class="inline-block bg-[#8B0000] text-white px-8 py-3 rounded-xl font-medium hover:bg-[#A52A2A] hover:scale-105 transition-all duration-300 shadow-lg"
      >
        Explorar películas
      </RouterLink>
    </div>

    <div class="md:w-1/2 flex justify-center relative">
      <div class="absolute -top-10 -right-10 w-64 h-64 bg-[#8B0000]/10 rounded-full blur-3xl"></div>
    </div>
  </section>-->

  <!-- Sección: Únete a nosotros -->
  <!-- S<section
    class="flex flex-col md:flex-row items-center justify-between gap-16 px-10 py-24 bg-white presentacion"
  >
    <div class="md:w-1/2 flex justify-center relative">
      <div class="absolute -top-10 -left-10 w-64 h-64 bg-[#8B0000]/10 rounded-full blur-3xl"></div>
      <div class="text-9xl"></div>
    </div>

    <div class="md:w-1/2 space-y-6 presentacion-div">
      <h2 class="text-5xl font-serif font-semibold text-gray-900 leading-tight">
        Únete a la experiencia
      </h2>

      <p class="text-lg text-gray-600 leading-relaxed">
        <span class="font-semibold text-[#8B0000]">Disfruta de estrenos</span>,
        clásicos del cine y eventos especiales. Obtén tu membresía universitaria
        y accede a descuentos exclusivos en boletos y snacks.
      </p>

      <RouterLink
        to="/"
        class="inline-block bg-[#8B0000] text-white px-8 py-3 rounded-xl font-medium hover:bg-[#A52A2A] hover:scale-105 transition-all duration-300 shadow-lg"
      >
        Obtener membresía
      </RouterLink>
    </div>
  </section>-->


</template>

<script setup lang="ts">
import cineImage1 from '../assets/cine1.jpg'
import cineImage2 from '../assets/cine2.jpeg'
import cineImage3 from '../assets/cine3.jpeg'
</script>

<style scoped>
.tarjeta {
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.5rem;
  text-align: center;
}
</style>
