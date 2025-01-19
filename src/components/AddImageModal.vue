<script setup>
import FormButton from '@/components/FormButton.vue'

defineProps({
  newImages: {
    type: Array,
    required: true
  },
  newTags: {
    type: Array,
    required: true
  },
  imagePreviews: {
    type: Array,
    required: true
  },
  imageError: {
    type: String,
    required: true
  },
  loading: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['handleImageUpload', 'removeImage', 'submitNewImage', 'close'])

const handleImageUpload = (event) => {
  emit('handleImageUpload', event)
}

const removeImage = (index) => {
  emit('removeImage', index)
}

const submitNewImage = () => {
  emit('submitNewImage')
}
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-blue-900/30 backdrop-blur-[10px] rounded-lg p-6 w-full max-w-lg">
      <h2 class="text-xl font-semibold mb-4">Add New Image to Collection</h2>
      <form @submit.prevent="submitNewImage" class="space-y-4">
        <div class="flex gap-4">
          <div class="flex-1">
            <label for="image-upload" class="block text-sm font-medium text-gray-300">Upload Image</label>
            <input type="file" id="image-upload" accept="image/*" @change="handleImageUpload"
              class="mt-1 block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500/20 file:text-blue-700 hover:file:bg-blue-500/30" />
            <span v-if="imageError" class="text-red-400 text-sm mt-2">{{ imageError }}</span>
          </div>
          <div class="flex-1">
            <label for="tag" class="block text-sm font-medium text-gray-300">Tag Name</label>
            <input type="text" id="tag" v-model="newTags[0]"
              class="mt-1 block w-full px-3 py-2 bg-white/20 text-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter tag name" />
          </div>
        </div>
        <div v-if="imagePreviews[0]" class="flex items-center gap-4 mt-4">
          <img :src="imagePreviews[0]" alt="Image Preview" class="w-24 h-24 rounded-md object-cover" />
          <button type="button" @click="removeImage(0)"
            class="py-2 px-4 bg-red-500 text-white font-semibold rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
            Remove Image
          </button>
        </div>
        <FormButton :text="loading ? '' : 'Add Image'" type="submit" :disabled="loading">
          <div v-if="loading" class="loader"></div>
        </FormButton>
      </form>
      <button @click="$emit('close')"
        class="mt-4 w-full py-2 px-4 bg-gray-500 text-white font-semibold rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
        Cancel
      </button>
    </div>
  </div>
</template>

<style scoped>
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
