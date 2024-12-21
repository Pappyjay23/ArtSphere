<script setup>
import NotFoundImage from '@/assets/images/404.svg'
</script>

<template>
  <div class="flex justify-center items-center min-h-[90vh] h-full">
    <div class="flex flex-col items-center">
      <img :src="NotFoundImage" alt="NotFoundImage" class="h-[300px] w-auto backdrop-blur-sm rounded-[2rem]" />
    </div>
  </div>
</template>

<style>
</style>