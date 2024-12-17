<script setup lang="ts">
import { ref } from 'vue'

const stats = ref([
  {
    title: 'Total Collections',
    value: '24',
    icon: 'bi-collection'
  },
  {
    title: 'Active Items',
    value: '156',
    icon: 'bi-box'
  },
  {
    title: 'Total Views',
    value: '2.4K',
    icon: 'bi-eye'
  },
  {
    title: 'Total Likes',
    value: '1.2K',
    icon: 'bi-heart'
  }
])

const recentActivity = ref([
  {
    action: 'New collection created',
    time: '2 hours ago'
  },
  {
    action: 'Item added to collection',
    time: '5 hours ago'
  },
  {
    action: 'Profile updated',
    time: '1 day ago'
  }
])
</script>

<template>
  <div class="py-8">
    <div class="mb-8">
      <h1 class="text-2xl font-semibold mb-2">Welcome back, User!</h1>
      <p class="text-gray-400">Here's what's happening with your collections</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div
        v-for="(stat, index) in stats"
        :key="index"
        class="bg-blue-900/30 backdrop-blur-[10px] rounded-lg p-6 transition-all duration-300 hover:transform hover:scale-105"
      >
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

    <!-- Recent Activity -->
    <div class="bg-blue-900/30 backdrop-blur-[10px] rounded-lg p-6">
      <h2 class="text-xl font-semibold mb-4">Recent Activity</h2>
      <div class="space-y-4">
        <div
          v-for="(activity, index) in recentActivity"
          :key="index"
          class="flex items-center justify-between py-3 border-b border-gray-700/50"
        >
          <div class="flex items-center space-x-3">
            <div class="bg-blue-500/20 p-2 rounded-full">
              <v-icon name="bi-clock-history" scale="1.2"></v-icon>
            </div>
            <span>{{ activity.action }}</span>
          </div>
          <span class="text-sm text-gray-400">{{ activity.time }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
