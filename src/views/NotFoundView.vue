<script setup>
import NotFoundImage from '@/assets/images/404.svg'
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="flex justify-center items-center min-h-[90vh] h-full">
    <div class="flex flex-col items-center">
      <img
        :src="NotFoundImage"
        alt="NotFoundImage"
        class="h-[300px] w-auto backdrop-blur-sm rounded-[2rem]"
      />
      <RouterLink to="/">
        <button
          class="bg-white/20 bg-blur-lg text-white text-lg px-6 py-4 rounded-[5rem] shadow-[inset_3px_3px_10px_rgba(255,255,255,0.5)] scale-[0.9] hover:scale-[1] transition-all duration-500 ease-in-out"
        >
          <div
            class="bg-white bg-blur-lg px-6 py-4 rounded-[2rem] text-black flex gap-2 items-center"
          >
            <v-icon name="md-keyboardbackspace-twotone" scale="1"></v-icon>
            <span class="font-semibold text-sm">Back to Home</span>
          </div>
        </button>
      </RouterLink>
    </div>
  </div>
</template>
