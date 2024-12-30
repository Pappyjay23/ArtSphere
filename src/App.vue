<script setup>
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
import { useRoute } from 'vue-router'
import { computed, onBeforeMount, watch } from 'vue'
import BgImage from './assets/images/bg-video-image.webp'
import { useNavbarStore } from './stores/navbar'

const route = useRoute()
const navbarStore = useNavbarStore()

// Set initial navbar state before mounting
onBeforeMount(() => {
  if (['/login', '/sign-up'].includes(route.path) || route.name === 'not-found') {
    navbarStore.hideNavbar()
  } else {
    navbarStore.showNavbar()
  }
})

// Watch for route changes to update navbar visibility
watch(
  () => route.path,
  (newPath) => {
    if (['/login', '/sign-up'].includes(newPath) || route.name === 'not-found') {
      navbarStore.hideNavbar()
    } else {
      navbarStore.showNavbar()
    }
  },
)

const showNavbar = computed(() => navbarStore.isVisible)
</script>

<template>
  <div class="app min-h-screen bg-black h-full text-white relative">
    <!-- Background Overlay -->
    <div class="absolute inset-0 bg-black/70 z-[2]"></div>

    <!-- Background Image -->
    <img :src="BgImage" alt="Background image" class="fixed w-full h-full object-cover" />

    <!-- Background Video -->
    <video
      autoplay
      loop
      muted
      playsinline
      preload="auto"
      class="fixed inset-0 w-full h-full object-cover z-[1] hidden lg:block"
    >
      <source src="@/assets/videos/bg-video.mp4" type="video/mp4" />
    </video>

    <!-- Content -->
    <div class="relative z-[3]">
      <template v-if="showNavbar">
        <Navbar />
      </template>
      <div class="p-4 max-w-[1440px] mx-auto">
        <RouterView />
      </div>
    </div>
  </div>
</template>
