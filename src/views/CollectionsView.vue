<script setup>
import { ref } from 'vue'
import Slider from '@/components/Slider.vue'

const showSlider = ref(false)
const selectedUser = ref(null)

const users = ref([
  {
    id: 1,
    name: 'Sarah Wilson',
    username: '@sarahw',
    avatar: 'https://i.pravatar.cc/150?img=1',
    totalImages: 24,
    followers: '2.4K',
    collections: [
      '/src/assets/images/slider-img-1.png',
      '/src/assets/images/slider-img-2.png',
      '/src/assets/images/slider-img-3.png',
      '/src/assets/images/slider-img-4.png'
    ]
  },
  {
    id: 2,
    name: 'John Doe',
    username: '@johnd',
    avatar: 'https://i.pravatar.cc/150?img=2',
    totalImages: 18,
    followers: '1.8K',
    collections: [
      '/src/assets/images/slider-img-9.png',
      '/src/assets/images/slider-img-2.png',
      '/src/assets/images/slider-img-4.png'
    ]
  },
  // Add more users as needed
])

const openUserCollections = (user) => {
  selectedUser.value = user
  showSlider.value = true
}

const closeSlider = () => {
  showSlider.value = false
  selectedUser.value = null
}
</script>

<template>
  <div class="py-8">
    <div class="mb-8">
      <h1 class="text-2xl font-semibold mb-2">Collections</h1>
      <p class="text-gray-400">Explore amazing collections from our creators</p>
    </div>

    <!-- Users Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="user in users"
        :key="user.id"
        @click="openUserCollections(user)"
        class="bg-blue-900/30 backdrop-blur-[10px] rounded-lg p-6 cursor-pointer transition-all duration-300 hover:transform hover:scale-105"
      >
        <div class="flex items-start space-x-4">
          <img
            :src="user.avatar"
            :alt="user.name"
            class="w-16 h-16 rounded-full object-cover border-2 border-blue-500/50"
          />
          <div class="flex-1">
            <h3 class="font-semibold text-lg">{{ user.name }}</h3>
            <p class="text-gray-400 text-sm">{{ user.username }}</p>
          </div>
        </div>

        <div class="mt-6 flex items-center justify-between text-sm">
          <div class="flex items-center space-x-2">
            <v-icon name="bi-image" scale="1.2"></v-icon>
            <span>{{ user.totalImages }} images</span>
          </div>
          <div class="flex items-center space-x-2">
            <v-icon name="bi-people" scale="1.2"></v-icon>
            <span>{{ user.followers }}</span>
          </div>
        </div>

        <!-- Preview Images -->
        <div class="mt-4 grid grid-cols-2 gap-2">
          <img
            v-for="(image, index) in user.collections.slice(0, 4)"
            :key="index"
            :src="image"
            :alt="`Collection ${index + 1}`"
            class="w-full h-24 object-cover rounded-lg"
          />
        </div>
      </div>
    </div>

    <!-- Slider Modal -->
    <div
      v-if="showSlider"
      class="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center"
      @click.self="closeSlider"
    >
      <div class="w-full max-w-6xl p-4">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <div class="flex items-center space-x-3">
            <img
              :src="selectedUser?.avatar"
              :alt="selectedUser?.name"
              class="w-12 h-12 rounded-full border-2 border-blue-500/50"
            />
            <div>
              <h3 class="font-semibold text-xl">{{ selectedUser?.name }}</h3>
              <p class="text-sm text-gray-400">{{ selectedUser?.username }}</p>
            </div>
          </div>
          <button
            @click="closeSlider"
            class="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <v-icon name="bi-x-lg" scale="1.5"></v-icon>
          </button>
        </div>

        <!-- Slider -->
        <div class="h-[70vh]">
          <Slider
            v-if="selectedUser"
            :images="selectedUser.collections"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.grid {
  grid-auto-rows: minmax(min-content, max-content);
}
</style>
