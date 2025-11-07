import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/Home.vue';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import AdminCartelera from '../components/AdminCartelera.vue';
import Cartelera from '../components/Cartelera.vue';
import GeneradorQR from '../components/GeneradorQR.vue';
import EscanerQR from '../components/EscanerQR.vue';

const routes = [
  { 
    path: '/', 
    name: 'Homepage',
    component: Home 
  },
  { 
    path: '/login', 
    name: 'Login',
    component: Login
  },
  { 
    path: '/register', 
    name: 'Register',
    component: Register
  },
  { 
    path: '/AdminRegister', 
    name: 'AdminRegister',
    component: AdminCartelera
  },
  { 
    path: '/cartelera', 
    name: 'Cartelera',
    component: Cartelera
  },
  { 
    path: '/generar-qr', 
    name: 'GeneradorQR',
    component: GeneradorQR
  },
  { 
    path: '/escanear-qr', 
    name: 'EscanerQR',
    component: EscanerQR
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
