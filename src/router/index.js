import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useNavbarStore } from '../stores/navbar'
import DashboardView from '@/views/DashboardView.vue'
import CollectionsView from '@/views/CollectionsView.vue'
import LoginView from '@/views/LoginView.vue'
import useAuth from '@/composables/useAuth'

const { user } = useAuth()

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/sign-up',
      component: LoginView,
    },
    {
      path: '/login',
      component: LoginView,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true },
    },
    {
      path: '/collections',
      name: 'collections',
      component: CollectionsView,
      meta: { requiresAuth: true },
    },
    {
      path: '/:catchAll(.*)',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

// Add navigation guard
router.beforeEach((to, from, next) => {
  const navbarStore = useNavbarStore()

  if (['/login', '/sign-up'].includes(to.path) || to.name === 'not-found') {
    navbarStore.hideNavbar()
  } else {
    navbarStore.showNavbar()
  }

  if (to.matched.some(record => record.meta.requiresAuth) && !user.value) {
    next({ path: '/login' })
  } else {
    next()
  }
})

export default router
