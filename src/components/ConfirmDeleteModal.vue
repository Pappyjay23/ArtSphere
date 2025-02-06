<script setup>
import Loader from '@/components/Loader.vue'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  loading: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['confirm', 'cancel'])

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50">
    <div class="card-content rounded-lg p-6 w-full max-w-md">
      <h2 class="text-xl font-semibold mb-4">Confirm Deletion</h2>
      <p class="mb-6">{{ message }}</p>
      <div class="flex justify-end gap-4">
        <button @click="handleCancel" class="py-2 px-4 bg-gray-300 rounded-md hover:bg-gray-400">No</button>
        <button @click="handleConfirm" class="py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600" :disabled="loading">
          <Loader v-if="loading" />
          <span v-else>Yes</span>
        </button>
      </div>
    </div>
  </div>
</template>


