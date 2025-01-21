<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  stats: {
    type: Array,
    required: true
  }
})

</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <div v-for="(stat, index) in stats" :key="index"
      class="bg-blue-900/30 backdrop-blur-[10px] rounded-lg p-6 transition-all duration-300 hover:transform hover:scale-105">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-gray-400 text-sm">{{ stat.title }}</p>
          <h3 class="text-2xl font-semibold mt-2">{{ stat.value }}</h3>
        </div>
        <div class="bg-blue-500/20 p-3 rounded-full">
          <v-icon :name="stat.icon" scale="1.5"></v-icon>
        </div>
      </div>
    </div>
  </div>
</template>
