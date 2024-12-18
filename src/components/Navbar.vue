<script setup>
import { RouterLink, useRoute } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'
import Logo from '@/assets/images/logo.svg'

const isScrolled = ref(false)
const route = useRoute()

const handleScroll = () => {
  // Add blur effect after scrolling down a bit
  isScrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <nav
    :class="[
      'fixed top-0 left-0 right-0 z-40 transition-all duration-300 py-3 md:px-4 px-2',
      isScrolled ? 'bg-black/70 backdrop-blur-xl shadow-lg' : 'bg-transparent'
    ]"
  >
    <div class="max-w-[1440px] mx-auto flex justify-between items-center text-[80%] md:text-[90%]">
      <!-- Left Links -->
      <div class="flex items-center gap-8">
        <RouterLink 
          to="/dashboard" 
          class="nav-link"
          :class="{ 'active': route.path === '/dashboard' }"
        >
          Dashboard
        </RouterLink>
      </div>

      <!-- Logo Center -->
      <RouterLink 
        to="/" 
        class="absolute left-1/2 -translate-x-1/2 text-[1.3rem] md:text-[1.5rem] logo flex items-center gap-2 opacity-85 transition-all duration-300 ease-in-out hover:opacity-100"
      >
        <img :src="Logo" alt="Logo" class="h-[25px] md:h-[35px] w-auto" />
        <span class="font-medium tracking-tight"> ArtSphere </span>
      </RouterLink>

      <!-- Right Links -->
      <div class="flex items-center gap-8">
        <RouterLink 
          to="/collections" 
          class="nav-link"
          :class="{ 'active': route.path === '/collections' }"
        >
          Collections
        </RouterLink>
      </div>
    </div>
  </nav>

  <!-- Spacer to prevent content from going under navbar -->
  <div class="h-[72px]"></div>
</template>

<style scoped>
.nav-link {
  position: relative;
  padding: 0.5rem;
  transition: all 0.3s ease;
  opacity: 0.9;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 1px;
  background: white;
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.nav-link:hover::after,
.nav-link.active::after {
  width: 100%;
}

.nav-link.active {
  color: white;
  opacity: 1;
}

.nav-link:hover {
  color: white;
  opacity: 1;
}
</style>
