<script setup>
import SliderImg1 from '../assets/images/slider-img-1.webp'
import SliderImg2 from '../assets/images/slider-img-2.webp'
import SliderImg3 from '../assets/images/slider-img-3.webp'
import SliderImg4 from '../assets/images/slider-img-4.webp'
import SliderImg5 from '../assets/images/slider-img-5.webp'
import SliderImg6 from '../assets/images/slider-img-6.webp'
import SliderImg7 from '../assets/images/slider-img-7.webp'
import SliderImg8 from '../assets/images/slider-img-8.webp'
import SliderImg9 from '../assets/images/slider-img-9.webp'

const sliderArray = [
  SliderImg1,
  SliderImg2,
  SliderImg3,
  SliderImg4,
  SliderImg5,
  SliderImg6,
  SliderImg7,
  SliderImg8,
  SliderImg9,
]
</script>

<template>
  <div class="slider" :style="{ '--quantity': sliderArray.length }">
    <span :key="index" v-for="(item, index) in sliderArray" :style="{ '--position': index + 1 }">
      <img :src="item" alt="Slider image" />
    </span>
  </div>
</template>

<style scoped>
.slider {
  position: relative;
  display: flex;
  justify-content: center;
  margin: 3rem auto;
  width: 100px;
  height: 100px;
  flex: auto;
  transform-style: preserve-3d;
  animation: rotate 30s linear infinite;
}

.slider:hover {
  animation-play-state: paused;
}

@keyframes rotate {
  0% {
    transform: perspective(1000px) rotateX(-10deg) rotateY(0deg);
  }

  100% {
    transform: perspective(1000px) rotateX(-10deg) rotateY(360deg);
  }
}

.slider span {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform-origin: center;
  transform-style: preserve-3d;
  background-color: rgba(255, 255, 255, 0.5);
  box-shadow: inset 6px 6px 10px rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  transform: rotateY(calc((var(--position) - 1) * (360 / var(--quantity)) * 1deg)) translateZ(350px);
  cursor: pointer;
  -webkit-box-reflect: below 2px linear-gradient(transparent, transparent, rgba(4, 4, 4, 0.267));
}

.slider span img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  border: 3px double white;
  object-fit: cover;
  transition: 0.8s;
}

.slider span:hover img {
  transform: translateY(-20px);
}
</style>
