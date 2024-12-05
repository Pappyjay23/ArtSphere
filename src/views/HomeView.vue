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
        class="text-[80%] md:text-base bg-white/10 backdrop-blur-sm hover:bg-white hover:text-black transition-all duration-500 ease-in-out font-medium border border-white/40 px-8 py-4 rounded-[12px]"
        >Create yours now</RouterLink
      >
    </div>
    <div class="w-full overflow-x-hidden min-h-[300px]">
      <Carousel />
    </div>
  </main>
</template>

