import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useNavbarStore = defineStore('navbar', () => {
  // Initialize from localStorage, default to true if not set
  const isVisible = ref(localStorage.getItem('navbarVisible') !== 'false')

  function hideNavbar() {
    isVisible.value = false
    localStorage.setItem('navbarVisible', 'false')
  }

  function showNavbar() {
    isVisible.value = true
    localStorage.setItem('navbarVisible', 'true')
  }

  return {
    isVisible,
    hideNavbar,
    showNavbar,
  }
})
