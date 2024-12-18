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
    avatar: 'https://i.pravatar.cc/150?img=5',
    followers: '2.4K',
    collections: [
      'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=800&auto=format',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format',
      'https://images.unsplash.com/photo-1470723710355-95304d8aece4?w=800&auto=format',
      'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format'
    ],
    imageTags: [
      'Urban Photography',
      'City Architecture',
      'Night Scenes',
      'Modern Buildings'
    ]
  },
  {
    id: 2,
    name: 'John Doe',
    username: '@johnd',
    avatar: 'https://i.pravatar.cc/150?img=12',
    followers: '1.8K',
    collections: [
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&auto=format',
      'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&auto=format',
      'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&auto=format',
      'https://images.unsplash.com/photo-1542224566-6e85f2e6772f?w=800&auto=format'
    ],
    imageTags: [
      'Nature Vibes',
      'Mountain Views',
      'Landscapes',
      'Forest Life'
    ]
  },
  {
    id: 3,
    name: 'Emma Thompson',
    username: '@emmat',
    avatar: 'https://i.pravatar.cc/150?img=1',
    followers: '3.2K',
    collections: [
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format',
      'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&auto=format',
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format'
    ],
    imageTags: [
      'Digital Art',
      'Code Life',
      'Tech Vibes',
      'Workspace'
    ]
  },
  {
    id: 4,
    name: 'Alex Rivera',
    username: '@alexr',
    avatar: 'https://i.pravatar.cc/150?img=33',
    followers: '4.5K',
    collections: [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&auto=format',
      'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800&auto=format',
      'https://images.unsplash.com/photo-1551913902-c92207136625?w=800&auto=format',
      'https://images.unsplash.com/photo-1604871000636-074fa5117945?w=800&auto=format'
    ],
    imageTags: [
      'Street Art',
      'Urban Culture',
      'Graffiti',
      'Modern Art'
    ]
  }
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
  <div class="py-4">
    <div class="mb-8">
      <h1 class="text-2xl font-semibold tracking-tight mb-2">Collections</h1>
      <p class="text-gray-400">Explore amazing collections from our creators</p>
    </div>

    <!-- Users Grid -->
   <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div
        v-for="user in users"
        :key="user.id"
        @click="openUserCollections(user)"
        class="group relative overflow-hidden rounded-xl cursor-pointer"
      >
        <!-- Card Content -->
        <div class="card-content bg-transparent backdrop-blur-md p-6 h-full">
          <!-- Top Section with View Button -->
          <div class="flex justify-between items-start mb-6">
            <!-- User Info -->
            <div class="flex items-start space-x-4">
              <div class="relative">
                <img
                  :src="user.avatar"
                  :alt="user.name"
                  class="w-16 h-16 rounded-xl object-cover transform transition-transform duration-500 ease-in-out scale-[0.8] group-hover:scale-[1]"
                />
                <div class="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/50 rounded-xl"></div>
              </div>
              <div>
                <h3 class="font-semibold text-lg text-white/90">{{ user.name }}</h3>
                <p class="text-white/60 text-sm">{{ user.username }}</p>
              </div>
            </div>

            <!-- View Collection Button -->
            <div class="transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-100">
              <div class="flex items-center space-x-2 bg-white/10 py-2 px-3 rounded-lg border border-white/20">
                <v-icon name="bi-collection" scale="1" class="text-blue-400"></v-icon>
                <span class="text-sm font-medium">View</span>
              </div>
            </div>
          </div>

          <!-- Stats -->
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-lg">
              <v-icon name="bi-images" scale="1" class="text-blue-400"></v-icon>
              <span class="text-xs text-white/80">{{ user.collections.length }} images</span>
            </div>
            <div class="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-lg">
              <v-icon name="bi-people" scale="1" class="text-purple-400"></v-icon>
              <span class="text-xs text-white/80">{{ user.followers }}</span>
            </div>
          </div>

          <!-- Preview Images Grid -->
          <div class="grid grid-cols-2 gap-3">
            <div
              v-for="(image, index) in user.collections.slice(0, 4)"
              :key="index"
              class="relative aspect-[4/3] overflow-hidden rounded-lg transform transition-transform duration-500 ease-in-out scale-[0.97] group-hover:scale-[1]"
            >
              <img
                :src="image"
                :alt="`Collection ${index + 1}`"
                class="w-full h-full object-cover"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>

          <!-- Hover Overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
      </div>
    </div>

    <!-- Slider Modal -->
    <div
      v-if="showSlider"
      v-show="showSlider"
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
              class="w-12 h-12 rounded-full "
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
            :image-tags="selectedUser.imageTags"
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

.card-content {
  position: relative;
  z-index: 1;
  box-shadow: inset 0 0 10px rgba(165, 165, 165, 0.667);
}

.card-content::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    45deg,
    rgba(59, 130, 246, 0.1),
    rgba(147, 51, 234, 0.1)
  );
  z-index: -1;
  border-radius: inherit;
}
</style>
