<script setup>
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
import AppBg from './assets/images/bg-img.png'
</script>

<template>
  <div
    :style="{ backgroundImage: `url(${AppBg})` }"
    class="app min-h-screen h-full text-white bg-center bg-black bg-cover relative z-[1]"
  >
    <div class="absolute top-0 left-0 min-h-screen h-full w-full bg-black/70 z-[2]"></div>
    <div class="z-[3] relative">
      <Navbar />
      <div class="px-4 max-w-[1440px] mx-auto">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style></style>
