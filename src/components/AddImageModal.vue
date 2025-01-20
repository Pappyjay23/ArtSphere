<script setup>
import FormButton from '@/components/FormButton.vue'
import Loader from '@/components/Loader.vue'

const props = defineProps({
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

const emit = defineEmits(['handleImageUpload', 'removeImage', 'updateTag', 'submitNewImage', 'close'])

const handleImageUpload = (event) => {
  emit('handleImageUpload', event)
}

const removeImage = (index) => {
  emit('removeImage', index)
}

const updateTag = (index, tag) => {
  emit('updateTag', { index, tag })
}

const submitNewImage = () => {
  emit('submitNewImage', {
    images: props.newImages,
    tags: props.newTags
  })
}
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-blue-900/30 backdrop-blur-[10px] rounded-lg p-6 w-full max-w-lg">
      <h2 class="text-xl font-semibold mb-4">Add New Images to Collection</h2>
      <form @submit.prevent="submitNewImage" class="space-y-4">
        <div>
          <label for="image-upload" class="block text-sm font-medium text-gray-300 w-fit">
            <div class="flex gap-2 mb-4 text-[80%] md:text-[95%]">
              <span>Upload Images</span>
              <span class="text-gray-400">(Max 5 images)</span>
            </div>
            <div
              class="bg-blue-500/20 bg-blur-lg text-white text-lg py-3 px-5 rounded-[2rem] shadow-[inset_3px_3px_10px_rgba(255,255,255,0.5)] scale-[0.9] hover:scale-[1] transition-all duration-500 ease-in-out w-fit cursor-pointer">
              <span class="font-semibold text-[70%] md:text-[80%]">Add Images</span>
            </div>
          </label>
          <input type="file" id="image-upload" accept="image/*" multiple @change="handleImageUpload" class="hidden" />
          <span v-if="imageError" class="text-red-400 text-sm mt-2">{{ imageError }}</span>
        </div>

        <!-- Image Previews -->
        <div v-for="(preview, index) in props.imagePreviews" :key="index" class="flex items-center gap-4 mt-4">
          <img :src="preview.url" alt="Image Preview" class="w-20 h-20 rounded-md object-cover" />
          <div class="flex flex-col gap-3 items-start">
            <input type="text" class="w-full rounded-[6px] border-0 outline-none p-2 text-sm bg-white/10"
              placeholder="Tag name" @input="updateTag(index, $event.target.value)" />
            <button type="button" @click="removeImage(index)"
              class="py-1 px-2 transition-all duration-300 ease-in-out bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 outline-none">
              <v-icon name="md-delete-round" scale="1"></v-icon>
            </button>
          </div>
        </div>
        <FormButton :text="props.loading ? '' : 'Add Images'" type="submit"
          :disabled="props.loading || props.newImages.length >= 3">
          <Loader v-if="props.loading" />
        </FormButton>
      </form>
      <button @click="$emit('close')"
        class="mt-4 w-full py-4 px-5 bg-gray-500 text-white text-[80%] rounded-[4px] hover:bg-gray-600 outline-none border-0 transition-all duration-300 ease-in-out">
        Cancel
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Add any additional styles if needed */
</style>
