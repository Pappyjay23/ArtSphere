<script setup>
import { ref, onMounted, computed } from 'vue'
import useAuth from '@/composables/useAuth'
import useCollections from '@/composables/useCollections'
import Slider from '@/components/Slider.vue'
import StatsGrid from '@/components/StatsGrid.vue'
import MiniMenu from '@/components/MiniMenu.vue'
import CollectionsList from '@/components/CollectionsList.vue'
import AddCollectionForm from '@/components/AddCollectionForm.vue'
import AddImageModal from '@/components/AddImageModal.vue'
import { v4 as uuidv4 } from 'uuid'

const { user } = useAuth()
const { collections, fetchCollections, createCollection, error, loading } = useCollections()

const showAddImageModal = ref(false)
const showSlider = ref(false)
const selectedCollection = ref(null)

const showAddCollectionForm = ref(false)

const toggleAddCollectionForm = (value) => {
  showAddCollectionForm.value = value
}


const newImages = ref([])
const newTags = ref([])
const imagePreviews = ref([])
const imageError = ref('')

const newCollectionName = ref('')

const handleImageUpload = (e) => {
  const files = Array.from(e.target.files)
  if (newImages.value.length + files.length > 5) {
    imageError.value = 'You can only add up to 5 images'
    return
  }
  files.forEach((file) => {
    if (file.size > 5 * 1024 * 1024) {
      imageError.value = 'Image size should be less than 5MB'
      return
    }
    const imageId = uuidv4()
    newImages.value.push({ id: imageId, file })
    imagePreviews.value.push({ id: imageId, url: URL.createObjectURL(file) })
    newTags.value.push({ id: imageId, tag: '' })
  })
  imageError.value = ''
}

const removeImage = (imageId) => {
  newImages.value = newImages.value.filter(image => image.id !== imageId)
  imagePreviews.value = imagePreviews.value.filter(preview => preview.id !== imageId)
  newTags.value = newTags.value.filter(tag => tag.id !== imageId)
}

const updateTag = ({ imageId, tag }) => {
  const tagIndex = newTags.value.findIndex(t => t.id === imageId)
  if (tagIndex !== -1) {
    newTags.value[tagIndex].tag = tag
  }
}

const submitNewCollection = async () => {
  if (newImages.value.length === 0) {
    imageError.value = 'At least one image is required'
    return
  }

  const newCollection = {
    name: newCollectionName.value,
    images: newImages.value.map(image => ({ id: image.id, file: image.file })),
    tags: newTags.value.map(tag => ({ id: tag.id, tag: tag.tag })),
  }

  try {
    await createCollection(user.value, newCollection)
    newCollectionName.value = ''
    newImages.value = []
    newTags.value = []
    imagePreviews.value = []
    showAddCollectionForm.value = false
    await fetchCollections(user.value.email)
  } catch (err) {
    console.error('Add collection error:', err)
  }
}

const openCollectionSlider = (collection) => {
  selectedCollection.value = collection
  showSlider.value = true
}

const closeSlider = () => {
  showSlider.value = false
  selectedCollection.value = null
}

onMounted(() => {
  if (user.value) {
    fetchCollections(user.value.email)
  }
})

const submitNewImage = async () => {
  if (newImages.value.length === 0) {
    imageError.value = 'At least one image is required'
    return
  }

  const newImage = {
    userId: user.value.uid,
    image: newImages.value[0],
    tag: newTags.value[0],
    createdAt: new Date().toISOString(),
  }

  try {
    await createCollection(user.value.uid, newImage)
    newImages.value = []
    newTags.value = []
    imagePreviews.value = []
    showAddImageModal.value = false
    await fetchCollections(user.value.uid)
  } catch (err) {
    console.error('Add image error:', err)
  }
}

const hasCollections = computed(() => collections.value.length > 0)

const stats = computed(() => [
  { title: 'Total Collections', value: collections.value.length, icon: 'bi-collection' },
  { title: 'Total Images', value: collections.value.reduce((acc, col) => acc + col.images.length, 0), icon: 'bi-images' },
])


</script>

<template>
  <div class="py-8">
    <div class="mb-8 flex items-center gap-4">
      <img :src="user?.photoURL" alt="Profile Photo" class="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover" />
      <div>
        <h1 class="text-lg md:text-2xl font-semibold mb-2">Welcome back, {{ user?.displayName }}!</h1>
        <p class="text-gray-400 text-[80%] md:text-base">Here's what's happening with your collections</p>
      </div>
    </div>

    <StatsGrid :stats="stats" />

    <MiniMenu :showAddCollectionForm="showAddCollectionForm" @update="toggleAddCollectionForm" />

    <CollectionsList v-if="!showAddCollectionForm" :collections="collections" :hasCollections="hasCollections"
      @openCollectionSlider="openCollectionSlider" @toggleAddCollectionForm="toggleAddCollectionForm" />

    <AddCollectionForm v-if="showAddCollectionForm" v-model:newCollectionName="newCollectionName"
      :imagePreviews="imagePreviews" :imageError="imageError" :loading="loading" @handleImageUpload="handleImageUpload"
      @removeImage="removeImage" @updateTag="updateTag" @submitNewCollection="submitNewCollection" />

    <AddImageModal v-if="showAddImageModal" :newImages="newImages" :newTags="newTags" :imagePreviews="imagePreviews"
      :imageError="imageError" :loading="loading" @handleImageUpload="handleImageUpload" @removeImage="removeImage"
      @submitNewImage="submitNewImage" @close="showAddImageModal = false" />

    <!-- Slider Modal -->
    <div v-if="showSlider" v-show="showSlider"
      class="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center" @click.self="closeSlider">
      <div class="w-full max-w-6xl p-4">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <div class="flex items-center space-x-3">
            <img :src="selectedCollection?.userProfileImage" :alt="selectedCollection?.name"
              class="w-12 h-12 rounded-full object-cover" />
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
          <Slider v-if="selectedCollection" :images="selectedCollection.images" :image-tags="selectedCollection.tags" />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* Add any additional styles if needed */

/* Loader styles */
.loader {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #fff;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
