<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  images: {
    type: Array,
    required: true,
  },
  imageTags: {
    type: Array,
    required: true,
  },
  currentUser: {
    type: Object,
    default: null,
  },
  collectionOwnerEmail: {
    type: String,
    default: '',
  },
})

const currentIndex = ref(0)
const sliderRef = ref(null)
const isDragging = ref(false)
const startPos = ref(0)
const currentTranslate = ref(0)
const prevTranslate = ref(0)

const emit = defineEmits(['deleteImage'])

const deleteImage = (imageId) => {
  emit('deleteImage', imageId)
}

const goToSlide = (index) => {
  if (index >= 0 && index < props.images.length) {
    currentIndex.value = index
    updateSlidePosition()
  }
}

const nextSlide = () => {
  if (currentIndex.value < props.images.length - 1) {
    currentIndex.value++
    updateSlidePosition()
  }
}

const prevSlide = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    updateSlidePosition()
  }
}

const updateSlidePosition = () => {
  currentTranslate.value = currentIndex.value * -100
  prevTranslate.value = currentTranslate.value
  setSliderPosition()
}

const setSliderPosition = () => {
  if (sliderRef.value) {
    sliderRef.value.style.transform = `translateX(${currentTranslate.value}%)`
  }
}

const touchStart = (event) => {
  isDragging.value = true
  startPos.value = event.type.includes('mouse') ? event.pageX : event.touches[0].clientX
  prevTranslate.value = currentTranslate.value
}

const touchMove = (event) => {
  if (!isDragging.value) return

  const currentPosition = event.type.includes('mouse') ? event.pageX : event.touches[0].clientX

  const diff = ((currentPosition - startPos.value) * 100) / sliderRef.value.offsetWidth
  const newTranslate = prevTranslate.value + diff

  // Limit sliding beyond first and last slides
  if (newTranslate > 0 || newTranslate < -((props.images.length - 1) * 100)) {
    return
  }

  currentTranslate.value = newTranslate
  setSliderPosition()
}

const touchEnd = () => {
  isDragging.value = false
  const threshold = 20
  const diff = currentTranslate.value - prevTranslate.value

  if (Math.abs(diff) > threshold) {
    if (diff > 0 && currentIndex.value > 0) {
      prevSlide()
    } else if (diff < 0 && currentIndex.value < props.images.length - 1) {
      nextSlide()
    } else {
      // Snap back to current slide
      updateSlidePosition()
    }
  } else {
    // Snap back to current slide if threshold not met
    updateSlidePosition()
  }
}

const isCollectionOwner = () => {
  return props.currentUser?.email === props.collectionOwnerEmail
}

onMounted(() => {
  updateSlidePosition()
})
</script>

<template>
  <div class="slider-container">
    <!-- Navigation Buttons -->
    <button v-if="currentIndex > 0" @click="prevSlide" class="nav-button left-6 group/btn">
      <div
        class="bg-white/10 backdrop-blur-md p-4 rounded-full transition-all duration-300 group-hover/btn:bg-white/20"
      >
        <v-icon name="bi-chevron-left" scale="1.5"></v-icon>
      </div>
    </button>

    <button
      v-if="currentIndex < images.length - 1"
      @click="nextSlide"
      class="nav-button right-6 group/btn"
    >
      <div
        class="bg-white/10 backdrop-blur-md p-4 rounded-full transition-all duration-300 group-hover/btn:bg-white/20"
      >
        <v-icon name="bi-chevron-right" scale="1.5"></v-icon>
      </div>
    </button>

    <!-- Slider -->
    <div
      ref="sliderRef"
      class="slider"
      @mousedown="touchStart"
      @mousemove="touchMove"
      @mouseup="touchEnd"
      @mouseleave="touchEnd"
      @touchstart="touchStart"
      @touchmove="touchMove"
      @touchend="touchEnd"
    >
      <div
        v-for="(image, index) in images"
        :key="index"
        class="slide group/slide"
        :class="{ active: currentIndex === index }"
      >
        <!-- Image Container -->
        <div class="relative w-full h-full overflow-hidden">
          <img
            :src="image.url"
            :alt="`Slide ${index + 1}`"
            class="slide-image transition-transform duration-500 group-hover/slide:scale-105"
            draggable="false"
          />

          <!-- Hover Overlay -->
          <div
            class="absolute inset-0 bg-black/70 opacity-0 group-hover/slide:opacity-100 transition-opacity duration-300"
          ></div>

          <!-- Image Tag -->
          <div
            class="absolute top-0 right-0 p-6 transform translate-y-4 opacity-0 group-hover/slide:translate-y-0 group-hover/slide:opacity-100 transition-all duration-300"
          >
            <div class="flex items-center gap-2">
              <!-- Tag Icon -->
              <div class="bg-white/10 backdrop-blur-md p-2 rounded-lg">
                <v-icon name="bi-tag" scale="1" class="text-white"></v-icon>
              </div>
              <!-- Tag Text -->
              <div class="bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg">
                <span class="text-sm font-medium">{{
                  props.imageTags[index].tag || `Image ${index + 1}`
                }}</span>
              </div>
              <!-- Delete Button -->
              <button
                v-if="isCollectionOwner()"
                @click.stop="deleteImage(image.id)"
                class="bg-red-500 text-white p-2 rounded-lg relative z-20"
              >
                <v-icon name="md-delete-round" scale="1.2"></v-icon>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="pagination">
      <button
        v-for="(_, index) in images"
        :key="index"
        @click="goToSlide(index)"
        class="pagination-dot group/dot"
        :class="{ active: currentIndex === index }"
      >
        <div
          class="w-2 h-2 rounded-full bg-white/50 transition-all duration-300 group-hover/dot:bg-white/80"
        ></div>
      </button>
    </div>
  </div>
</template>

<style scoped>
.slider-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 40;
  /* Ensure the slider is below the confirm delete modal */
}

.slider {
  display: flex;
  transition: transform 0.3s ease-out;
  height: 100%;
  cursor: grab;
  will-change: transform;
}

.slider:active {
  cursor: grabbing;
}

.slide {
  min-width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
}

.slide-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}

.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  color: white;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
}

.pagination {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 1rem;
  z-index: 10;
  padding: 0.5rem 1rem;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(8px);
  border-radius: 2rem;
}

.pagination-dot {
  padding: 0.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-dot.active div {
  background: white;
  transform: scale(1.5);
}

button {
  z-index: 20;
  /* Ensure the delete button is on top */
}
</style>
