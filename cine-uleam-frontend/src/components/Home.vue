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



</template>

<script setup lang="ts">

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
