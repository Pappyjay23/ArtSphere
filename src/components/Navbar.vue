<script setup>
import { RouterLink } from 'vue-router'
import Logo from '@/assets/images/logo.svg'
</script>

<template>
  <nav
    class="bg-transparent py-3 px-4 max-w-[1440px] mx-auto flex justify-between items-center text-[80%] md:text-[90%]"
  >
    <div>
      <RouterLink to="/dashboard">Dashboard</RouterLink>
    </div>
    <div>
      <RouterLink to="/" class="text-[1.3rem] md:text-[1.5rem] logo flex items-center gap-2">
        <img :src="Logo" alt="Logo" class="h-[25px] md:h-[35px] w-auto" />
        <span class="font-medium tracking-tight"> ArtSphere </span>
      </RouterLink>
    </div>
    <div>
      <RouterLink to="/collections">Collections</RouterLink>
    </div>
  </nav>
</template>

<style></style>
