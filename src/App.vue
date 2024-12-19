<script setup>
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
import AppBg1 from './assets/images/bg-img-1.jpg'
import AppBg2 from './assets/images/bg-img.png'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const homeBackgroundImages = [AppBg1, AppBg2]
const homeBackgroundImg = ref(homeBackgroundImages[0])
const currentImageIndex = ref(0)
let interval

onMounted(() => {
  interval = setInterval(() => {
    currentImageIndex.value =
      currentImageIndex.value === homeBackgroundImages.length - 1 ? 0 : currentImageIndex.value + 1
  }, 5000)
})

onUnmounted(() => {
  if (interval) {
    clearInterval(interval)
  }
})

watch(currentImageIndex, (newIndex) => {
  homeBackgroundImg.value = homeBackgroundImages[newIndex]
})

const route = useRoute()

const showNavbar = computed(() => {
  return !['/login', '/sign-up'].includes(route.path)
})
</script>

<template>
  <div
    :style="{ backgroundImage: `url(${homeBackgroundImg})` }"
    class="app min-h-screen h-full text-white bg-center bg-black bg-cover relative z-[1] transition-all duration-500 ease-in-out"
  >
    <div class="absolute top-0 left-0 min-h-screen h-full w-full bg-black/70 z-[2]"></div>
    <div class="z-[3] relative">
      <Navbar v-if="showNavbar" />
      <div class="p-4 max-w-[1440px] mx-auto">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style></style>
