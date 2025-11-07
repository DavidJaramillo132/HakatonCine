<template>
    <header class="bg-[#8B0000] text-white shadow-lg sticky top-0 z-50">
        <nav class="container mx-auto px-6 py-4">
            <div class="flex items-center justify-between">
                <!-- Logo -->
                <div class="flex items-center space-x-2">
                    <h1 class="text-2xl font-bold tracking-wide">CINE ULEAM</h1>
                </div>
                
                <!-- Desktop Menu -->
                <div class="hidden md:block">
                    <ul class="flex items-center space-x-8">
                        <li>
                            <router-link 
                                to="/" 
                                class="hover:text-yellow-400 transition-colors duration-200 font-medium"
                            >
                                Inicio
                            </router-link>
                        </li>
                        <li>
                            <router-link 
                                to="/cartelera" 
                                class="hover:text-yellow-400 transition-colors duration-200 font-medium"
                            >
                                Cartelera
                            </router-link>
                        </li>
                        <li>
                            <router-link 
                                to="/sugerencia" 
                                class="hover:text-yellow-400 transition-colors duration-200 font-medium"
                            >
                                Sugerencia
                            </router-link>
                        </li>
                        <li>
                            <router-link 
                                to="/login" 
                                class="hover:text-yellow-400 transition-colors duration-200 font-medium"
                            >
                                Iniciar Sesión
                            </router-link>
                        </li>
                        <li>
                            <router-link 
                                to="/register" 
                                class="bg-white text-[#8B0000] px-6 py-2 rounded-lg font-semibold hover:bg-yellow-400 hover:text-[#8B0000] transition-all duration-200"
                            >
                                Registrarse
                            </router-link>
                        </li>
                    </ul>
                </div>

                <!-- Mobile Menu Button -->
                <div class="md:hidden">
                    <button 
                        @click="toggleMenu" 
                        class="text-white focus:outline-none"
                        aria-label="Toggle menu"
                    >
                        <svg v-if="!isMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Mobile Menu -->
            <div v-if="isMenuOpen" class="md:hidden mt-4 pb-4">
                <ul class="flex flex-col space-y-4">
                    <li>
                        <router-link 
                            to="/" 
                            @click="closeMenu"
                            class="block hover:text-yellow-400 transition-colors duration-200 font-medium"
                        >
                            Inicio
                        </router-link>
                    </li>
                    <li>
                        <router-link 
                            to="/cartelera" 
                            @click="closeMenu"
                            class="block hover:text-yellow-400 transition-colors duration-200 font-medium"
                        >
                            Cartelera
                        </router-link>
                    </li>
                    <li>
                        <router-link 
                            to="/sugerencia" 
                            @click="closeMenu"
                            class="block hover:text-yellow-400 transition-colors duration-200 font-medium"
                        >
                            Sugerencia
                        </router-link>
                    </li>
                    <li>
                        <router-link 
                            to="/login" 
                            @click="closeMenu"
                            class="block hover:text-yellow-400 transition-colors duration-200 font-medium"
                        >
                            Iniciar Sesión
                        </router-link>
                    </li>
                    <li>
                        <router-link 
                            to="/register" 
                            @click="closeMenu"
                            class="block bg-white text-[#8B0000] px-6 py-2 rounded-lg font-semibold text-center hover:bg-yellow-400 hover:text-[#8B0000] transition-all duration-200"
                        >
                            Registrarse
                        </router-link>
                    </li>
                </ul>
            </div>
        </nav>
    </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isMenuOpen = ref(false)

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
    isMenuOpen.value = false
}
</script>

<style scoped>
</style>

