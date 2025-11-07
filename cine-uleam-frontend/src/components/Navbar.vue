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
                        <li v-if="isAuthenticated">
                            <router-link 
                                :to="dashboardRoute"
                                class="hover:text-yellow-400 transition-colors duration-200 font-medium"
                            >
                                {{ dashboardLabel }}
                            </router-link>
                        </li>
                        <li v-if="userRole === 'admin'">
                            <router-link 
                                to="/escanear-qr"
                                class="hover:text-yellow-400 transition-colors duration-200 font-medium"
                            >
                                Escáner QR
                            </router-link>
                        </li>
                        <li v-if="isAuthenticated" class="text-sm text-yellow-200 font-semibold">
                            ¡Hola, {{ displayName }}!
                        </li>
                        <li v-if="!isAuthenticated">
                            <router-link 
                                to="/cartelera" 
                                class="hover:text-yellow-400 transition-colors duration-200 font-medium"
                            >
                                Cartelera
                            </router-link>
                        </li>
                        <li v-if="isStudent">
                            <router-link 
                                to="/sugerencia" 
                                class="hover:text-yellow-400 transition-colors duration-200 font-medium"
                            >
                                Sugerencia
                            </router-link>
                        </li>
                        <li v-if="!isAuthenticated">
                            <router-link 
                                to="/login" 
                                class="hover:text-yellow-400 transition-colors duration-200 font-medium"
                            >
                                Iniciar Sesión
                            </router-link>
                        </li>
                        <li v-if="!isAuthenticated">
                            <router-link 
                                to="/register" 
                                class="bg-white text-[#8B0000] px-6 py-2 rounded-lg font-semibold hover:bg-yellow-400 hover:text-[#8B0000] transition-all duration-200"
                            >
                                Registrarse
                            </router-link>
                        </li>
                        <li v-if="isAuthenticated">
                            <button
                                @click="handleLogout"
                                class="bg-white/10 px-6 py-2 rounded-lg font-semibold hover:bg-white hover:text-[#8B0000] transition-all duration-200"
                            >
                                Cerrar sesión
                            </button>
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
                    <li v-if="isAuthenticated">
                        <router-link 
                            :to="dashboardRoute" 
                            @click="closeMenu"
                            class="block hover:text-yellow-400 transition-colors duration-200 font-medium"
                        >
                            {{ dashboardLabel }}
                        </router-link>
                    </li>
                    <li v-if="userRole === 'admin'">
                        <router-link 
                            to="/escanear-qr"
                            @click="closeMenu"
                            class="block hover:text-yellow-400 transition-colors duration-200 font-medium"
                        >
                            Escáner QR
                        </router-link>
                    </li>
                    <li v-if="isAuthenticated" class="text-sm text-yellow-200 font-semibold">
                        ¡Hola, {{ displayName }}!
                    </li>
                    <li v-if="!isAuthenticated">
                        <router-link 
                            to="/cartelera" 
                            @click="closeMenu"
                            class="block hover:text-yellow-400 transition-colors duration-200 font-medium"
                        >
                            Cartelera
                        </router-link>
                    </li>
                    <li v-if="isStudent">
                        <router-link 
                            to="/sugerencia" 
                            @click="closeMenu"
                            class="block hover:text-yellow-400 transition-colors duration-200 font-medium"
                        >
                            Sugerencia
                        </router-link>
                    </li>
                    <li v-if="!isAuthenticated">
                        <router-link 
                            to="/login" 
                            @click="closeMenu"
                            class="block hover:text-yellow-400 transition-colors duration-200 font-medium"
                        >
                            Iniciar Sesión
                        </router-link>
                    </li>
                    <li v-if="!isAuthenticated">
                        <router-link 
                            to="/register" 
                            @click="closeMenu"
                            class="block bg-white text-[#8B0000] px-6 py-2 rounded-lg font-semibold text-center hover:bg-yellow-400 hover:text-[#8B0000] transition-all duration-200"
                        >
                            Registrarse
                        </router-link>
                    </li>
                    <li v-if="isAuthenticated">
                        <button
                            @click="() => { handleLogout(); closeMenu(); }"
                            class="w-full bg-white/10 px-6 py-2 rounded-lg font-semibold hover:bg-white hover:text-[#8B0000] transition-all duration-200"
                        >
                            Cerrar sesión
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    </header>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/connectSupabase'

const isMenuOpen = ref(false)
const isAuthenticated = ref(false)
const userRole = ref<string | null>(null)
const userName = ref('')

const router = useRouter()
let authListener: ReturnType<typeof supabase.auth.onAuthStateChange> | null = null

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
    isMenuOpen.value = false
}

const updateAuthState = async () => {
    const { data } = await supabase.auth.getSession()
    const session = data.session
    const storedId = localStorage.getItem('userId')
    const storedRole = localStorage.getItem('userRole')
    const storedName = localStorage.getItem('userName')

    if (session) {
        const metadataRole = (session.user.user_metadata?.role as string | undefined) ?? storedRole ?? null
        const metadataName = (session.user.user_metadata?.full_name as string | undefined) ?? storedName ?? session.user.email ?? ''

        isAuthenticated.value = true
        userRole.value = metadataRole
        userName.value = metadataName

        if (metadataRole && !storedRole) {
            localStorage.setItem('userRole', metadataRole)
        }

        if (metadataName && !storedName) {
            localStorage.setItem('userName', metadataName)
        }

        localStorage.setItem('userId', session.user.id)
        return
    }

    if (storedId) {
        isAuthenticated.value = true
        userRole.value = storedRole
        userName.value = storedName ?? ''
    } else {
        isAuthenticated.value = false
        userRole.value = null
        userName.value = ''
    }
}

const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('userId')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userName')
    await updateAuthState()
    router.push('/login')
}

const handleStorageChange = () => {
    updateAuthState()
}

onMounted(() => {
    updateAuthState()
    authListener = supabase.auth.onAuthStateChange(() => {
        updateAuthState()
    })
    window.addEventListener('storage', handleStorageChange)
})

onUnmounted(() => {
    authListener?.data.subscription.unsubscribe()
    window.removeEventListener('storage', handleStorageChange)
})

const dashboardRoute = computed(() => (userRole.value === 'admin' ? '/admin' : '/cartelera'))
const dashboardLabel = computed(() => (userRole.value === 'admin' ? 'Panel Admin' : 'Cartelera'))
const displayName = computed(() => userName.value || 'Usuario')
const isStudent = computed(() => userRole.value === 'estudiante')

</script>

<style scoped>
</style>

