import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/Home.vue';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import AdminCartelera from '../components/AdminCartelera.vue';
import Cartelera from '../components/Cartelera.vue';
import ForgotPassword from '../components/ForgotPassword.vue';
import ResetPassword from '../components/ResetPassword.vue';
import GeneradorQR from '../components/GeneradorQR.vue';
import EscanerQR from '../components/EscanerQR.vue';
import AdminSecretRegister from '../components/AdminSecretRegister.vue';
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
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPassword
  },
  {
    path: '/admin-secret-register',
    name: 'AdminSecretRegister',
    component: AdminSecretRegister
  },
  {
    path: '/admin',
    alias: ['/AdminRegister'],
    name: 'AdminDashboard',
    component: AdminCartelera,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/cartelera',
    name: 'Cartelera',
    component: Cartelera,
    meta: { requiresAuth: true }
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

  if (session && !storedId) {
    localStorage.setItem('userId', session.user.id);
  }

  if (session && metadataRole && !storedRole) {
    localStorage.setItem('userRole', metadataRole);
  }

  if (session?.user?.user_metadata?.full_name && !localStorage.getItem('userName')) {
    localStorage.setItem('userName', session.user.user_metadata.full_name as string);
  }

  if (to.meta?.requiresAuth && !isAuthenticated) {
    return next({ path: '/login', query: { redirect: to.fullPath } });
  }

  if (to.meta?.requiresAdmin) {
    if (!isAuthenticated) {
      return next({ path: '/login', query: { redirect: to.fullPath } });
    }

    if (metadataRole !== 'admin') {
      return next('/cartelera');
    }
  }

  if (to.meta?.requiresGuest && isAuthenticated) {
    return next(metadataRole === 'admin' ? '/admin' : '/cartelera');
  }

  return next();
});
