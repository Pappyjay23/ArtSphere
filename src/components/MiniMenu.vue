<script setup>
const props = defineProps({
  showAddCollectionForm: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['update'])
</script>

<template>
  <div class="flex gap-4 mb-8 justify-center">
    <button
      @click="emit('update', false)"
      :class="{ 'bg-blue-500/40': !showAddCollectionForm, 'bg-blue-500/20': showAddCollectionForm }"
      class="py-4 px-8 shadow-[inset_3px_3px_10px_rgba(255,255,255,0.5)] hover:bg-blue-500/40 text-white font-medium tracking-wide border border-white/50 rounded-[2rem] outline-none transition-all duration-300 ease-in-out text-[70%] md:text-sm"
    >
      My Collections
    </button>
    <button
      @click="emit('update', true)"
      :class="{ 'bg-blue-500/40': showAddCollectionForm, 'bg-blue-500/20': !showAddCollectionForm }"
      class="py-4 px-8 shadow-[inset_3px_3px_10px_rgba(255,255,255,0.5)] hover:bg-blue-500/40 text-white font-medium tracking-wide border border-white/50 rounded-[2rem] outline-none transition-all duration-300 ease-in-out text-[70%] md:text-sm"
    >
      Add Collection
    </button>
  </div>
</template>
