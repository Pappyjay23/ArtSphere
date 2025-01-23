<script setup>
import { ref, onMounted, computed } from 'vue'
import Slider from '@/components/Slider.vue'
import useCollections from '@/composables/useCollections'
import useAuth from '@/composables/useAuth'
import CollectionsList from '@/components/CollectionsList.vue'
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal.vue'

const { user } = useAuth()
const showSlider = ref(false)
const selectedCollection = ref(null)
const showConfirmDeleteModal = ref(false)
const collectionToDelete = ref(null)
const imageToDelete = ref(null)

const { collections, fetchAllCollections, deleteCollection, updateCollection, error, loading } =
  useCollections()

onMounted(() => {
  fetchAllCollections()
})

const hasCollections = computed(() => collections.value.length > 0)

const openCollectionSlider = (collection) => {
  selectedCollection.value = collection
  showSlider.value = true
}

const closeSlider = () => {
  showSlider.value = false
  selectedCollection.value = null
}

const handleDeleteCollection = async (collectionId) => {
  collectionToDelete.value = collectionId
  showConfirmDeleteModal.value = true
}

const confirmDeleteCollection = async () => {
  try {
    await deleteCollection(user.value, collectionToDelete.value)
    await fetchAllCollections()
  } catch (err) {
    console.error('Delete collection error:', err)
  } finally {
    showConfirmDeleteModal.value = false
    collectionToDelete.value = null
  }
}

const cancelDeleteCollection = () => {
  showConfirmDeleteModal.value = false
  collectionToDelete.value = null
  imageToDelete.value = null
}

const deleteImage = (imageId) => {
  imageToDelete.value = imageId
  showConfirmDeleteModal.value = true
}

const confirmDeleteImage = async () => {
  if (!selectedCollection.value || !imageToDelete.value) return

  const updatedImages = selectedCollection.value.images.filter(
    (image) => image.id !== imageToDelete.value,
  )
  const updatedTags = selectedCollection.value.tags.filter((tag) => tag.id !== imageToDelete.value)

  const updatedCollection = {
    ...selectedCollection.value,
    images: updatedImages,
    tags: updatedTags,
  }

  try {
    await updateCollection(user.value, updatedCollection)
    selectedCollection.value = updatedCollection
    showSlider.value = false
    selectedCollection.value = null
    await fetchAllCollections()
  } catch (err) {
    console.error('Delete image error:', err)
  } finally {
    showConfirmDeleteModal.value = false
    imageToDelete.value = null
  }
}

const confirmDelete = async () => {
  if (collectionToDelete.value) {
    await confirmDeleteCollection()
  } else if (imageToDelete.value) {
    await confirmDeleteImage()
  }
}
</script>

<template>
  <div class="py-4">
    <div class="mb-8">
      <h1 class="text-2xl font-semibold tracking-tight mb-2">Collections</h1>
      <p class="text-gray-400">Explore amazing collections from our creators</p>
    </div>

    <!-- Collections List -->
    <CollectionsList
      :collections="collections"
      :hasCollections="hasCollections"
      :currentUser="user"
      :isCollectionsRoute="true"
      @openCollectionSlider="openCollectionSlider"
      @deleteCollection="handleDeleteCollection"
    />

    <!-- Confirm Delete Modal -->
    <ConfirmDeleteModal
      :show="showConfirmDeleteModal"
      :loading="loading"
      :message="
        collectionToDelete
          ? 'Are you sure you want to delete this collection?'
          : 'Are you sure you want to delete this image?'
      "
      @confirm="confirmDelete"
      @cancel="cancelDeleteCollection"
    />

    <!-- Slider Modal -->
    <div
      v-if="showSlider"
      class="fixed inset-0 bg-black/95 z-40 flex flex-col items-center justify-center"
      @click.self="closeSlider"
    >
      <div class="w-full max-w-6xl p-4">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <div class="flex items-center space-x-3">
            <img
              :src="selectedCollection?.userProfileImage"
              :alt="selectedCollection?.name"
              class="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h3 class="font-semibold text-xl">{{ selectedCollection?.userFullName }}</h3>
              <p class="text-sm text-gray-400">{{ selectedCollection?.userName }}</p>
            </div>
          </div>
          <div>
            <h3 class="font-semibold text-xl">{{ selectedCollection?.name }}</h3>
            <p class="text-sm text-gray-400">{{ selectedCollection?.description }}</p>
          </div>
          <button @click="closeSlider" class="p-2 hover:bg-white/10 rounded-full transition-colors">
            <v-icon name="bi-x-lg" scale="1.5"></v-icon>
          </button>
        </div>

        <!-- Slider -->
        <div class="h-[70vh]">
          <Slider
            v-if="selectedCollection"
            :images="selectedCollection.images"
            :imageTags="selectedCollection.tags"
            :currentUser="user"
            :collectionOwnerEmail="selectedCollection.userEmail"
            @deleteImage="deleteImage"
          />
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
  background: linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1));
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
