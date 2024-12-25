<script setup>
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import BgImage from './assets/images/bg-video-image.webp'

const route = useRoute()

const showNavbar = computed(() => {
  return !['/login', '/sign-up'].includes(route.path)
})
</script>

<template>
  <div class="app min-h-screen bg-black h-full text-white relative">
    <!-- Background Overlay -->
    <div class="absolute inset-0 bg-black/70 z-[2]"></div>

    <!-- Background Image -->
    <img :src="BgImage" alt="Background image" class='fixed w-full h-full object-cover'>

    <!-- Background Video -->
    <video 
      autoplay 
      loop 
      muted 
      playsinline
      preload="auto"
      class="fixed inset-0 w-full h-full object-cover z-[1] hidden lg:block"
    >
      <source src="@/assets/videos/bg-video.mp4" type="video/mp4">
    </video>

    <!-- Content -->
    <div class="relative z-[3]">
      <Navbar v-if="showNavbar" />
      <div class="p-4 max-w-[1440px] mx-auto">
        <RouterView />
      </div>
    </div>
  </div>
</template>

