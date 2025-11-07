<script setup lang="ts">
import Footer from './components/Footer.vue'
import Navbar from './components/Navbar.vue';
</script>
<template>
  <div class="app-layout">
    <Navbar />
    <main class="main-content">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<style scoped>

</style>