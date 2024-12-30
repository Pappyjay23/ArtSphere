import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useNavbarStore } from '../stores/navbar'

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
      props: true,
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/login',
      props: true,
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
    },
    {
      path: '/collections',
      name: 'collections',
      component: () => import('../views/CollectionsView.vue'),
    },
    {
      path: '/:catchAll(.*)',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
})

// Add navigation guard
router.beforeEach((to, from, next) => {
  const navbarStore = useNavbarStore()

  if (['/login', '/sign-up'].includes(to.path) || to.name === 'not-found') {
    navbarStore.hideNavbar()
  } else {
    navbarStore.showNavbar()
  }

  next()
})

export default router
