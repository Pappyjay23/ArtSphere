<script setup>
import AddCollectionForm from '@/components/AddCollectionForm.vue'
import AddImageModal from '@/components/AddImageModal.vue'
import CollectionsList from '@/components/CollectionsList.vue'
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal.vue'
import MiniMenu from '@/components/MiniMenu.vue'
import Slider from '@/components/Slider.vue'
import StatsGrid from '@/components/StatsGrid.vue'
import useAuth from '@/composables/useAuth'
import useCollections from '@/composables/useCollections'
import { v4 as uuidv4 } from 'uuid'
import { computed, onMounted, ref } from 'vue'

const { user } = useAuth()
const {
  collections,
  fetchUserCollections,
  createCollection,
  updateCollection,
  deleteCollection,
  error,
  loading,
} = useCollections()

const showAddImageModal = ref(false)
const showSlider = ref(false)
const selectedCollection = ref(null)
const showConfirmDeleteModal = ref(false)
const collectionToDelete = ref(null)
const imageToDelete = ref(null)

const showAddCollectionForm = ref(false)

const toggleAddCollectionForm = (value) => {
  showAddCollectionForm.value = value
}

const newImages = ref([])
const newTags = ref([])
const imagePreviews = ref([])
const imageError = ref('')

const newCollectionName = ref('')

const MAX_COLLECTION_IMAGES = 4
const MAX_NEW_IMAGES = 2

const handleImageUpload = (e) => {
  const files = Array.from(e.target.files)

  // Check if adding these files would exceed collection limit
  if (selectedCollection.value) {
    const remainingSlots = MAX_COLLECTION_IMAGES - selectedCollection.value.images.length
    const maxAllowed = Math.min(remainingSlots, MAX_NEW_IMAGES)

    if (files.length > maxAllowed) {
      imageError.value =
        remainingSlots === 1
          ? 'You can only add 1 more image'
          : `You can only add up to ${maxAllowed} more images`
      e.target.value = ''
      return
    }
  } else {
    // For new collection
    if (newImages.value.length + files.length > MAX_COLLECTION_IMAGES) {
      imageError.value = `You can only add up to ${MAX_COLLECTION_IMAGES} images in a collection`
      e.target.value = ''
      return
    }
  }

  // Check file sizes
  for (const file of files) {
    if (file.size > 1 * 1024 * 1024) {
      imageError.value = 'Each image must be less than 1MB'
      e.target.value = ''
      return
    }
  }

  files.forEach((file) => {
    const imageId = uuidv4()
    newImages.value.push({ id: imageId, file })
    imagePreviews.value.push({ id: imageId, url: URL.createObjectURL(file) })
    newTags.value.push({ id: imageId, tag: '' })
  })
  imageError.value = ''
}

const removeImage = (index) => {
  newImages.value.splice(index, 1)
  imagePreviews.value.splice(index, 1)
  newTags.value.splice(index, 1)
}

const updateTag = ({ imageId, tag }) => {
  const tagIndex = newTags.value.findIndex((t) => t.id === imageId)
  if (tagIndex !== -1) {
    newTags.value[tagIndex] = {
      id: imageId,
      tag: tag,
    }
  } else {
    // If tag doesn't exist, add it
    newTags.value.push({
      id: imageId,
      tag: tag,
    })
  }
}

const submitNewCollection = async () => {
  if (newImages.value.length === 0) {
    imageError.value = 'At least one image is required'
    return
  }

  const newCollection = {
    name: newCollectionName.value,
    images: newImages.value.map((image) => ({ id: image.id, file: image.file })),
    tags: newTags.value.map((tag) => ({ id: tag.id, tag: tag.tag })),
  }

  try {
    await createCollection(user.value, newCollection)
    newCollectionName.value = ''
    newImages.value = []
    newTags.value = []
    imagePreviews.value = []
    showAddCollectionForm.value = false
    await fetchUserCollections(user.value.email)
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

const handleShowAddImageModal = (collection) => {
  selectedCollection.value = collection
  showAddImageModal.value = true
}

const closeAddImageModal = () => {
  showAddImageModal.value = false
  selectedCollection.value = null
  // Clear the form state
  newImages.value = []
  newTags.value = []
  imagePreviews.value = []
  imageError.value = ''
}

const handleDeleteCollection = async (collectionId) => {
  collectionToDelete.value = collectionId
  showConfirmDeleteModal.value = true
}

const confirmDeleteCollection = async () => {
  try {
    await deleteCollection(user.value, collectionToDelete.value)
    await fetchUserCollections(user.value.email)
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
    await fetchUserCollections(user.value.email) // Add this line to update collections in real-time
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

onMounted(() => {
  if (user.value) {
    fetchUserCollections(user.value.email)
  }
})

const submitNewImage = async ({ images, tags }) => {
  if (!selectedCollection.value) return

  try {
    // Create updated collection with new images and tags
    const updatedCollection = {
      ...selectedCollection.value,
      images: [
        ...selectedCollection.value.images,
        ...images.map((image) => ({
          id: image.id,
          file: image.file,
          url: image.url, // Make sure to include the URL if it exists
        })),
      ],
      tags: [
        ...selectedCollection.value.tags,
        ...tags.map((tag) => ({
          id: tag.id,
          tag: tag.tag || '', // Ensure empty tags are handled
        })),
      ],
    }

    await updateCollection(user.value, updatedCollection)
    await fetchUserCollections(user.value.email)
    showAddImageModal.value = false
    selectedCollection.value = null
    // Clear form state
    newImages.value = []
    newTags.value = []
    imagePreviews.value = []
  } catch (err) {
    console.error('Add images error:', err)
  }
}

const hasCollections = computed(() => collections.value.length > 0)

const stats = computed(() => [
  { title: 'Total Collections', value: collections.value.length, icon: 'bi-collection' },
  {
    title: 'Total Images',
    value: collections.value.reduce((acc, col) => acc + col.images.length, 0),
    icon: 'bi-images',
  },
])
</script>

<template>
  <div class="py-8">
    <div class="mb-8 flex items-center gap-4">
      <img
        :src="user?.photoURL"
        alt="Profile Photo"
        class="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover"
      />
      <div>
        <h1 class="text-lg md:text-2xl font-semibold mb-2">
          Welcome back, {{ user?.displayName }}!
        </h1>
        <p class="text-gray-400 text-[80%] md:text-base">
          Here's what's happening with your collections
        </p>
      </div>
    </div>

    <StatsGrid :stats="stats" />

    <MiniMenu :showAddCollectionForm="showAddCollectionForm" @update="toggleAddCollectionForm" />

    <CollectionsList
      v-if="!showAddCollectionForm"
      :collections="collections"
      :hasCollections="hasCollections"
      :currentUser="user"
      :isCollectionsRoute="false"
      @openCollectionSlider="openCollectionSlider"
      @toggleAddCollectionForm="toggleAddCollectionForm"
      @showAddImageModal="handleShowAddImageModal"
      @deleteCollection="handleDeleteCollection"
    />

    <AddCollectionForm
      v-if="showAddCollectionForm"
      v-model:newCollectionName="newCollectionName"
      :imagePreviews="imagePreviews"
      :imageError="imageError"
      :loading="loading"
      @handleImageUpload="handleImageUpload"
      @removeImage="removeImage"
      @updateTag="updateTag"
      @submitNewCollection="submitNewCollection"
    />

    <AddImageModal
      v-if="showAddImageModal && selectedCollection"
      :selectedCollection="selectedCollection"
      :newImages="newImages"
      :newTags="newTags"
      :imagePreviews="imagePreviews"
      :imageError="imageError"
      :loading="loading"
      @handleImageUpload="handleImageUpload"
      @removeImage="removeImage"
      @updateTag="updateTag"
      @submitNewImage="submitNewImage"
      @close="closeAddImageModal"
    />

    <ConfirmDeleteModal
      :show="showConfirmDeleteModal"
      :loading="loading"
      message="Are you sure you want to delete this item?"
      @confirm="confirmDelete"
      @cancel="cancelDeleteCollection"
      class="z-50"
    />

    <!-- Slider Modal -->
    <div
      v-if="showSlider"
      v-show="showSlider"
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
              <p class="text-sm text-gray-400">@{{ selectedCollection?.userName }}</p>
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
/* Add any additional styles if needed */
</style>
