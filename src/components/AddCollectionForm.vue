<script setup>
import { computed } from 'vue'
import FormButton from '@/components/FormButton.vue'
import Loader from '@/components/Loader.vue'

const props = defineProps({
    newCollectionName: {
        type: String,
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

const emit = defineEmits(['update:newCollectionName', 'handleImageUpload', 'removeImage', 'updateTag', 'submitNewCollection'])

const handleImageUpload = (event) => {
    emit('handleImageUpload', event)
}

const removeImage = (imageId) => {
    emit('removeImage', imageId)
}

const updateTag = (imageId, tag) => {
    emit('updateTag', { imageId, tag })
}

const submitNewCollection = () => {
    emit('submitNewCollection')
}

const collectionName = computed({
    get() {
        return props.newCollectionName
    },
    set(value) {
        emit('update:newCollectionName', value)
    }
})
</script>

<template>
    <div class="bg-blue-900/30 backdrop-blur-[10px] rounded-2xl px-6 py-10 w-[90%] md:w-[70%] lg:w-[40%] mx-auto">
        <h1 class="text-[1.5rem] lg:text-[1.8rem] font-bold tracking-tight mb-4 text-center">Add New Collection</h1>
        <form @submit.prevent="submitNewCollection" class="space-y-4 w-[90%] mx-auto">
            <div>
                <input type="text" placeholder='Collection Name' v-model="collectionName"
                    class="w-full rounded-[6px] border-0 outline-none p-2 text-[80%] md:text-sm bg-white/10" />
            </div>
            <div>
                <label for="image-upload" class="block text-sm font-medium text-gray-300 w-fit">
                    <div class="flex gap-2 mb-4 text-[80%] md:text-[95%]">
                        <span>Upload Images</span>
                        <span class="text-gray-400">(Max 4 images)</span>
                    </div>
                    <div
                        class="bg-blue-500/20 bg-blur-lg text-white text-lg py-3 px-5 rounded-[2rem] shadow-[inset_3px_3px_10px_rgba(255,255,255,0.5)] scale-[0.9] hover:scale-[1] transition-all duration-500 ease-in-out w-fit cursor-pointer">
                        <span class="font-semibold text-[70%] md:text-[80%]">Add Images</span>
                    </div>
                </label>
                <input type="file" id="image-upload" accept="image/*" multiple @change="handleImageUpload"
                    class="hidden" />
                <span v-if="imageError" class="text-red-400 text-sm mt-2">{{ imageError }}</span>
            </div>

            <!-- Images Preview -->
            <div v-for="(preview) in imagePreviews" :key="preview.id" class="flex items-center gap-4 mt-4">
                <img :src="preview.url" alt="Image Preview" class="w-20 h-20 object-cover rounded-lg" />
                <div class="flex flex-col gap-3 items-start">
                    <input type="text" class="w-full rounded-[6px] border-0 outline-none p-2 text-sm bg-white/10"
                        placeholder="Tag name" @input="updateTag(preview.id, $event.target.value)" />
                    <div @click="removeImage(preview.id)"
                        class="bg-red-500 hover:bg-red-600 rounded-md py-1 px-2 transition-all duration-300 ease-in-out cursor-pointer">
                        <v-icon name="md-delete-round" scale="1"></v-icon></div>
                </div>
            </div>

            <FormButton :text="loading ? '' : 'Add Collection'" type="submit" :disabled="loading">
                <Loader v-if="loading" />
            </FormButton>
        </form>
    </div>
</template>

<style scoped>
/* Add any additional styles if needed */
</style>
