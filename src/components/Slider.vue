<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  images: {
    type: Array,
    required: true
  }
})

const currentIndex = ref(0)
const sliderRef = ref(null)
const isDragging = ref(false)
const startPos = ref(0)
const currentTranslate = ref(0)
const prevTranslate = ref(0)

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
  startPos.value = event.type.includes('mouse') 
    ? event.pageX 
    : event.touches[0].clientX
  prevTranslate.value = currentTranslate.value
}

const touchMove = (event) => {
  if (!isDragging.value) return
  
  const currentPosition = event.type.includes('mouse')
    ? event.pageX
    : event.touches[0].clientX
    
  const diff = (currentPosition - startPos.value) * 100 / sliderRef.value.offsetWidth
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

onMounted(() => {
  updateSlidePosition()
})
</script>

<template>
  <div class="slider-container">
    <!-- Navigation Buttons -->
    <button 
      v-if="currentIndex > 0"
      @click="prevSlide" 
      class="nav-button left-4"
    >
      <v-icon name="bi-chevron-left" scale="2"></v-icon>
    </button>
    
    <button 
      v-if="currentIndex < images.length - 1"
      @click="nextSlide" 
      class="nav-button right-4"
    >
      <v-icon name="bi-chevron-right" scale="2"></v-icon>
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
        class="slide"
        :class="{ 'active': currentIndex === index }"
      >
        <img 
          :src="image" 
          :alt="`Slide ${index + 1}`"
          class="slide-image"
          draggable="false"
        />
      </div>
    </div>

    <!-- Pagination -->
    <div class="pagination">
      <button
        v-for="(_, index) in images"
        :key="index"
        @click="goToSlide(index)"
        class="pagination-dot"
        :class="{ 'active': currentIndex === index }"
      ></button>
    </div>
  </div>
</template>

<style scoped>
.slider-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
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
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
  border-radius: 0.5rem;
  pointer-events: none;
}

.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
}

.nav-button:hover {
  background: rgba(0, 0, 0, 0.8);
}

.pagination {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
  z-index: 10;
}

.pagination-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-dot.active {
  background: white;
  transform: scale(1.2);
}
</style> 