import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/Home.vue';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import AdminCartelera from '../components/AdminCartelera.vue';
import AdminDashboard from '../components/AdminDashboard.vue';
import AdminEncuestas from '../components/AdminEncuestas.vue';
import Cartelera from '../components/Cartelera.vue';
import Sugerencia from '../components/Sugerencia.vue';
import EncuestasEstudiante from '../components/EncuestasEstudiante.vue';
import GeneradorQR from '../components/GeneradorQR.vue';
import EscanerQR from '../components/EscanerQR.vue';
import AdminSecretRegister from '../components/AdminSecretRegister.vue';
import AdminNotificaciones from '../components/AdminNotificaciones.vue';
import ForgotPassword from '../components/ForgotPassword.vue';
import Proximas from '../components/Proximas.vue';
import Contacto from '../components/Contacto.vue';
import AcercaDe from '../components/AcercaDe.vue';
import AlquilerSala from '../components/AlquilerSala.vue';
import { supabase } from '../lib/connectSupabase';

const routes = [
  {
    path: '/',
    name: 'Homepage',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresGuest: true }
  },
  {
    path: '/cartelera',
    name: 'Cartelera',
    component: Cartelera,
    meta: { requiresAuth: true }
  },
  {
    path: '/sugerencia',
    name: 'Sugerencia',
    component: Sugerencia,
    meta: { requiresAuth: true, requiresStudent: true }
  },
  {
    path: '/generar-qr',
    name: 'GeneradorQR',
    component: GeneradorQR,
    meta: { requiresAuth: true }
  },
  {
    path: '/escanear-qr',
    name: 'EscanerQR',
    component: EscanerQR,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/cartelera',
    name: 'AdminCartelera',
    component: AdminCartelera,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin-secret-register',
    name: 'AdminSecretRegister',
    component: AdminSecretRegister,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/notificaciones',
    name: 'AdminNotificaciones',
    component: AdminNotificaciones,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/encuestas',
    name: 'AdminEncuestas',
    component: AdminEncuestas,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/encuestas',
    name: 'EncuestasEstudiante',
    component: EncuestasEstudiante,
    meta: { requiresAuth: true, requiresStudent: true }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword,
    meta: { requiresGuest: true }
  },
  {
    path: '/proximas',
    name: 'Proximas',
    component: Proximas
  },
  {
    path: '/contacto',
    name: 'Contacto',
    component: Contacto
  },
  {
    path: '/acerca-de',
    name: 'AcercaDe',
    component: AcercaDe
  },
  {
    path: '/alquiler-sala',
    name: 'AlquilerSala',
    component: AlquilerSala,
    meta: { requiresAuth: true }
  }
];

export const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, _from, next) => {
  const { data } = await supabase.auth.getSession();
  const session = data.session;
  const storedId = localStorage.getItem('userId');
  const storedRole = localStorage.getItem('userRole');

  const isAuthenticated = Boolean(session) || Boolean(storedId);
  const metadataRole = (session?.user?.user_metadata?.role as string | undefined) ?? storedRole ?? null;

  // Sincronizar datos de sesión con localStorage
  if (session && !storedId) {
    localStorage.setItem('userId', session.user.id);
  }

  if (session && metadataRole && !storedRole) {
    localStorage.setItem('userRole', metadataRole);
  }

  if (session?.user?.user_metadata?.full_name && !localStorage.getItem('userName')) {
    localStorage.setItem('userName', session.user.user_metadata.full_name as string);
  }

  // Validar coherencia: si no hay sesión pero hay localStorage, limpiar localStorage
  if (!session && storedId) {
    console.warn('Sesión expirada, limpiando localStorage');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    
    if (to.meta?.requiresAuth) {
      return next({ path: '/login', query: { redirect: to.fullPath } });
    }
  }

  // Protección: Rutas que requieren autenticación
  if (to.meta?.requiresAuth && !isAuthenticated) {
    console.warn('Acceso denegado: requiere autenticación');
    return next({ path: '/login', query: { redirect: to.fullPath } });
  }

  // Protección: Rutas exclusivas para administradores
  if (to.meta?.requiresAdmin) {
    if (!isAuthenticated) {
      console.warn('Acceso denegado: requiere autenticación');
      return next({ path: '/login', query: { redirect: to.fullPath } });
    }

    if (metadataRole !== 'admin') {
      console.warn('Acceso denegado: requiere rol admin');
      return next(metadataRole === 'estudiante' ? '/cartelera' : '/');
    }
  }

  // Protección: Rutas exclusivas para estudiantes
  if (to.meta?.requiresStudent) {
    if (!isAuthenticated) {
      console.warn('Acceso denegado: requiere autenticación');
      return next({ path: '/login', query: { redirect: to.fullPath } });
    }

    if (metadataRole !== 'estudiante') {
      console.warn('Acceso denegado: requiere rol estudiante');
      return next(metadataRole === 'admin' ? '/admin' : '/');
    }
  }

  // Protección: Rutas solo para invitados (no autenticados)
  if (to.meta?.requiresGuest && isAuthenticated) {
    console.warn('Acceso denegado: ya está autenticado');
    return next(metadataRole === 'admin' ? '/admin' : '/cartelera');
  }

  // Protección adicional: Verificar rutas críticas manualmente
  const adminPaths = ['/admin', '/admin/cartelera', '/admin/notificaciones', '/admin/encuestas', '/admin-secret-register', '/escanear-qr'];
  if (adminPaths.some(path => to.path.startsWith(path)) && metadataRole !== 'admin') {
    console.error('Intento de acceso no autorizado a ruta de administrador');
    return next('/');
  }

  const studentPaths = ['/sugerencia', '/encuestas'];
  if (studentPaths.some(path => to.path.startsWith(path)) && metadataRole !== 'estudiante') {
    console.error('Intento de acceso no autorizado a ruta de estudiante');
    return next('/');
  }

  return next();
});
