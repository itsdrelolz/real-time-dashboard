import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '@/pages/LoginPage.vue';
import RegisterPage from '@/pages/RegisterPage.vue';
import HomePage from '@/pages/HomePage.vue';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
      meta: { layout: 'AuthLayout', requiresGuest: true },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterPage,
      meta: { layout: 'AuthLayout', requiresGuest: true },
    },
    {
      path: '/',
      name: 'home',
      component: HomePage,
      meta: { layout: 'MainLayout', requiresAuth: true },
    },
  ],
});


router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  if (!authStore.authReady) {
    await authStore.fetchUser();
  }

  const isAuthenticated = authStore.isLoggedIn;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login' });
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next({ name: 'home' });
  } else {
    next();
  }
});

export default router;
