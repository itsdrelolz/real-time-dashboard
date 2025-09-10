import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/pages/LoginPage.vue'
import RegisterPage from '@/pages/RegisterPage.vue'
import HomePage from '@/pages/HomePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: LoginPage,
      meta: { layout: 'AuthLayout' }
    },
    {
      path: '/register',
      component: RegisterPage,
      meta: { layout: 'AuthLayout' }
    },
    {
      path: '/',
      component: HomePage,
      meta: { layout: 'MainLayout' }
    }
  ],
})

export default router
