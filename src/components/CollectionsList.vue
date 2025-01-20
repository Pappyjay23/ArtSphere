<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  collections: {
    type: Array,
    required: true
  },
  hasCollections: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['openCollectionSlider', 'toggleAddCollectionForm', 'showAddImageModal', 'deleteCollection'])

const openCollectionSlider = (collection) => {
  emit('openCollectionSlider', collection)
}

const showAddImageModal = (collection) => {
  emit('showAddImageModal', collection)
}

const handleCardClick = (event, collection) => {
  if (event.target.closest('.action-button')) {
    return
  }
  openCollectionSlider(collection)
}

const handleDeleteCollection = (collectionId) => {
  emit('deleteCollection', collectionId)
}
</script>

<template>
  <div v-if="hasCollections" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    <div v-for="(collection, index) in collections" :key="index" @click="(event) => handleCardClick(event, collection)"
      class="group card-wrapper fade-in-up rounded-xl cursor-pointer overflow-hidden"
      :style="{ animationDelay: `${index * 0.1}s` }">
      <!-- Card Content -->
      <div class="card-content bg-transparent backdrop-blur-md p-6 h-full">
        <!-- Top Section with Add Images Button -->
        <div class="flex justify-between gap-3 items-start mb-6">
          <!-- Collection Info -->
          <div class="flex items-start space-x-4">
            <div class="relative overflow-hidden rounded-xl">
              <img :src="collection.userProfileImage" :alt="collection.userName"
                class="w-12 h-12 rounded-xl object-cover transform transition-transform duration-500 ease-in-out scale-[1] group-hover:scale-[1.2]" />
              <div class="absolute inset-0 border border-white/50 rounded-xl">
              </div>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-[90%] font-medium">{{ collection.userFullName }}</span>
              <span class="text-[80%]">{{ collection.userName }}</span>
            </div>
          </div>

          <div class="flex gap-2 items-center max-w-fit">
            <!-- Add Images Button -->
            <div
              class="relative z-20 flex flex-wrap items-center space-x-2 bg-white/10 py-2 px-3 rounded-lg border border-white/20 action-button"
              @click="showAddImageModal(collection)">
              <v-icon name="bi-plus-circle" scale="1" class="text-blue-400"></v-icon>
              <span class="text-[80%] font-medium hidden xl:flex">Add Images</span>
            </div>

            <!-- Delete Collection Button -->
            <div
              class="relative z-20 flex items-center space-x-2 bg-white/10 py-2 px-3 rounded-lg border border-white/20 action-button"
              @click="handleDeleteCollection(collection.id)">
              <v-icon name="md-delete-round" scale="1" class="text-red-500"></v-icon>
              <span class="text-[80%] font-medium hidden xl:flex">Delete</span>
            </div>
          </div>
        </div>

        <!-- Stats -->
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-lg">
            <v-icon name="bi-images" scale="1" class="text-blue-400"></v-icon>
            <span class="text-xs text-white/80">{{ collection.images.length }} {{ collection.images.length < 2 ? 'image' : 'images' }}</span>
          </div>
          <div class="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-lg">
            <v-icon name="bi-clock-history" scale="1" class="text-purple-400"></v-icon>
            <span class="text-xs text-white/80">{{ collection.createdAt.toDate().toLocaleDateString() }}</span>
          </div>
        </div>

        <!-- Preview Images Grid -->
        <div class="grid grid-cols-2 gap-3">
          <div v-for="(image, index) in collection.images.slice(0, 4)" :key="index"
            class="relative aspect-[4/3] overflow-hidden rounded-lg transform transition-transform duration-500 ease-in-out scale-[0.97] group-hover:scale-[1] border border-white/20 bg-purple-500/20">
            <img :src="image.url" :alt="`Collection ${index + 1}`" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        </div>

        <!-- Hover Overlay -->
        <div
          class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        </div>
      </div>
    </div>
  </div>
  <div v-else class="text-center">
    <p class="text-gray-400 text-lg mb-4">No collections found.</p>
    <button @click="$emit('toggleAddCollectionForm', true)"
      class="bg-blue-500/20 bg-blur-lg text-white text-lg px-6 py-4 rounded-[5rem] shadow-[inset_3px_3px_10px_rgba(255,255,255,0.5)] scale-[0.9] hover:scale-[1] transition-all duration-500 ease-in-out">
      <div class="bg-white bg-blur-lg px-6 py-4 rounded-[2rem] text-black flex gap-2 items-center">
        <span class="font-semibold text-sm">Add to Collection</span>
      </div>
    </button>
  </div>
</template>
