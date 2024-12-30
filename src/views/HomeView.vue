<script setup>
import Carousel from '@/components/Carousel.vue'
import HeroText from '../assets/images/hero-text.svg'
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

const initialPageLoad = ref(true)

onMounted(() => {
  setTimeout(() => {
    initialPageLoad.value = false
  }, 50)
})
</script>

<template>
  <main class="py-4">
    <div
    class="flex justify-center transition-all duration-[1.5s] ease-in-out"
    :class="initialPageLoad ? 'scale-[0.2] opacity-0' : 'opacity-1 scale=[1]'"
    >
    <img :src="HeroText" alt="HeroText" class="h-[130px] md:h-[200px] w-auto" />
    </div>
    <div class="mb-[5rem] mt-[1.5rem] flex justify-center">
      <RouterLink
        to="/dashboard"
        class="relative group overflow-hidden text-[80%] md:text-base bg-white/5 backdrop-blur-md border border-white/30 px-8 py-6 rounded-[4rem] transition-all duration-500 shadow-[inset_3px_3px_10px_rgba(255,255,255,0.5)]"
      >
        <span class="relative z-[2] font-medium">
          Create yours now
        </span>

        <div class="absolute inset-0 z-[1] bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <div class="absolute inset-0 z-[1] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

        <div class="absolute inset-0 z-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-blue-500/50 to-purple-500/50 blur-xl"></div>
      </RouterLink>
    </div>
    <div class="w-full overflow-x-hidden min-h-[300px]">
      <Carousel />
    </div>
  </main>
</template>

<style>
</style>

