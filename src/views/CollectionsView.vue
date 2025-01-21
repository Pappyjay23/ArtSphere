<script setup>
import { ref, onMounted, computed } from 'vue'
import Slider from '@/components/Slider.vue'
import useCollections from '@/composables/useCollections'
import CollectionsList from '@/components/CollectionsList.vue'

const showSlider = ref(false)
const selectedUser = ref(null)

const { collections, fetchAllCollections, error, loading } = useCollections()

onMounted(() => {
  fetchAllCollections()
})

const hasCollections = computed(() => collections.value.length > 0)

const openUserCollections = (user) => {
  selectedUser.value = user
  showSlider.value = true
}

const closeSlider = () => {
  showSlider.value = false
  selectedUser.value = null
}

// Add this for staggered animation
const getAnimationDelay = (index) => {
  return `${index * 0.1}s`
}
</script>

<template>
  <div class="py-4">
    <div class="mb-8">
      <h1 class="text-2xl font-semibold tracking-tight mb-2">Collections</h1>
      <p class="text-gray-400">Explore amazing collections from our creators</p>
    </div>

    <!-- Collections List -->
    <CollectionsList :collections="collections" :hasCollections="hasCollections" />

    <!-- Slider Modal -->
    <div v-if="showSlider" v-show="showSlider"
      class="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center" @click.self="closeSlider">
      <div class="w-full max-w-6xl p-4">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <div class="flex items-center space-x-3">
            <img :src="selectedUser?.avatar" :alt="selectedUser?.name" class="w-12 h-12 rounded-full " />
            <div>
              <h3 class="font-semibold text-xl">{{ selectedUser?.name }}</h3>
              <p class="text-sm text-gray-400">{{ selectedUser?.username }}</p>
            </div>
          </div>
          <button @click="closeSlider" class="p-2 hover:bg-white/10 rounded-full transition-colors">
            <v-icon name="bi-x-lg" scale="1.5"></v-icon>
          </button>
        </div>

        <!-- Slider -->
        <div class="h-[70vh]">
          <Slider v-if="selectedUser" :images="selectedUser.collections" :image-tags="selectedUser.imageTags" />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
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
  background: linear-gradient(45deg,
      rgba(59, 130, 246, 0.1),
      rgba(147, 51, 234, 0.1));
  z-index: -1;
  border-radius: inherit;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.fade-in-up {
  animation: fadeInUp 1s ease-in-out forwards;
  opacity: 0;
}
</style>
