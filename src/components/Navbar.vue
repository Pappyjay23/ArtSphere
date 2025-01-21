<script setup>
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { ref, onMounted, onUnmounted, computed } from 'vue'
import Logo from '@/assets/images/logo.svg'
import useAuth from '@/composables/useAuth'

const isScrolled = ref(false)
const isMenuOpen = ref(false)
const route = useRoute()
const router = useRouter()

// Add new refs for user state
const { user, logout } = useAuth()

const navigationLinks = computed(() => {
  if (user.value) {
    return [
      { to: '/', name: 'Home' },
      { to: '/dashboard', name: 'Dashboard' },
      { to: '/collections', name: 'Collections' },
    ]
  } else {
    return [
      { to: '/', name: 'Home' },
    ]
  }
})

// Add computed for auth link
const authLink = computed(() => {
  return user.value
    ? { action: handleLogout, name: 'Logout', class: 'nav-link-special text-red-400' }
    : { to: '/login', name: 'Login', class: 'nav-link-special' }
})

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
  document.body.style.overflow = isMenuOpen.value ? 'hidden' : ''
}

const closeMenu = () => {
  isMenuOpen.value = false
  document.body.style.overflow = ''
}

const handleLogout = async () => {
  await logout()
  router.push('/login')
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.body.style.overflow = ''
})
</script>

<template>
  <nav
    :class="[
      'fixed top-0 left-0 right-0 z-[40] transition-all duration-300 py-3 md:px-6 px-4',
      isScrolled ? 'bg-black/70 backdrop-blur-xl shadow-lg' : 'bg-transparent',
    ]"
  >
    <div class="max-w-[1440px] mx-auto flex justify-between items-center">
      <!-- Menu Button -->
      <button
        @click="toggleMenu"
        class="relative group overflow-hidden nav-menu-btn z-[60] w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-full backdrop-blur-md text-white bg-purple-500/10"
      >
        <!-- Icon Container -->
        <div class="relative w-5 h-3 lg:w-6 lg:h-5 flex items-center z-[2]">
          <!-- Menu Lines -->
          <span
            class="absolute h-[1px] lg:h-[2px] rounded-lg bg-white transition-all duration-500 ease-in-out"
            :class="isMenuOpen ? 'rotate-45 w-full' : '-translate-y-2 w-[40%]'"
          ></span>

          <span
            class="absolute h-[1px] lg:h-[2px] rounded-lg bg-white transition-all duration-300 ease-in-out"
            :class="isMenuOpen ? 'opacity-0 translate-x-3 w-full' : 'opacity-100 w-full'"
          ></span>

          <span
            class="absolute h-[1px] lg:h-[2px] rounded-lg bg-white transition-all duration-500 ease-in-out"
            :class="isMenuOpen ? '-rotate-45 w-full' : 'translate-y-2 w-[60%]'"
          ></span>
        </div>

        <!-- Hover Effects -->
        <div
          class="absolute inset-0 z-[1] bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        ></div>

        <div
          class="absolute inset-0 z-[1] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        ></div>

        <div
          class="absolute inset-0 z-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-blue-500/50 to-purple-500/50 blur-xl"
        ></div>
      </button>

      <!-- Logo Center -->
      <RouterLink
        to="/"
        class="text-[1.5rem] md:text-[2rem] flex items-center gap-2 opacity-85 transition-all duration-300 ease-in-out hover:opacity-100 z-[60]"
        @click="closeMenu"
      >
        <img :src="Logo" alt="Logo" class="h-[25px] md:h-[35px] w-auto" />
        <span class="font-medium tracking-tight"> ArtSphere </span>
      </RouterLink>

      <!-- User Profile Button -->
      <div class="relative group">
        <button
          class="relative overflow-hidden nav-menu-btn z-[60] w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-full backdrop-blur-md text-white bg-purple-500/10"
        >
          <div class="relative w-full h-full flex items-center justify-center z-[2] p-1">
            <img
              v-if="user?.photoURL"
              :src="user.photoURL"
              :alt="user.displayName"
              class="w-full h-full object-cover rounded-full"
            />
            <v-icon v-else name="bi-person-fill" scale="1.5" class="opacity-85" />
          </div>

          <!-- Hover Effects (same as before) -->
          <div
            class="absolute inset-0 z-[1] bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          ></div>
          <div
            class="absolute inset-0 z-[1] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          ></div>
          <div
            class="absolute inset-0 z-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-blue-500/50 to-purple-500/50 blur-xl"
          ></div>
        </button>

        <!-- Username Tooltip -->
        <div
          v-if="user?.displayName"
          class="absolute top-full right-[-10px] mt-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/20 shadow-[inset_3px_3px_10px_rgba(0,0,0,0.5)] backdrop-blur-md px-3 py-1.5 rounded-lg text-[80%] md:text-sm"
        >
          {{ user.displayName }}
        </div>
      </div>
    </div>

    <!-- Full Screen Menu -->
    <div
      class="fixed top-0 left-0 min-h-screen inset-0 z-[50] transition-all duration-500"
      :class="
        isMenuOpen
          ? 'opacity-100 visible'
          : 'opacity-0 lg:opacity-100 invisible pointer-events-none'
      "
      style="margin-top: 0"
    >
      <!-- Backdrop -->
      <div
        class="fixed top-0 left-0 min-h-screen inset-0 bg-black/90 backdrop-blur-xl transition-all duration-1000 delay-[430] ease-in-out"
        :class="
          isMenuOpen
            ? 'opacity-100 scale-[2] h-full w-full lg:h-[200vh] lg:w-[200vh]'
            : 'opacity-100 h-[300vh] w-[300vh] translate-x-[-50%] translate-y-[-50%] rounded-full origin-top-left scale-[0] delay-500'
        "
      ></div>

      <!-- Menu Content -->
      <div class="relative h-full flex flex-col items-center justify-center">
        <div
          class="flex flex-col items-center gap-8 transition-all duration-700 delay-200 ease-in-out"
          :class="isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'"
        >
          <RouterLink
            v-for="(link, index) in navigationLinks"
            :key="index"
            :to="link.to"
            @click="closeMenu"
            class="nav-link text-3xl font-light tracking-wider"
            :class="[{ active: route.path === link.to }]"
          >
            {{ link.name }}
          </RouterLink>

          <!-- Auth Link -->
          <template v-if="authLink.to">
            <RouterLink
              :to="authLink.to"
              @click="closeMenu"
              class="nav-link text-3xl font-light tracking-wider"
              :class="authLink.class"
            >
              {{ authLink.name }}
            </RouterLink>
          </template>
          <template v-else>
            <button
              @click="
                () => {
                  authLink.action()
                  closeMenu()
                }
              "
              class="nav-link text-3xl font-light tracking-wider"
              :class="authLink.class"
            >
              {{ authLink.name }}
            </button>
          </template>
        </div>
      </div>
    </div>
  </nav>

  <!-- Spacer -->
  <div class="h-[72px]"></div>
</template>

<style scoped>
.navbar {
  position: relative;
  z-index: 30; /* Ensure the navbar is below the slider */
}

.nav-link {
  position: relative;
  padding: 0.5rem;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0.8;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 1px;
  background: white;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateX(-50%);
}

.nav-link:hover {
  opacity: 1;
  transform: translateY(-2px);
}

.nav-link:hover::after {
  width: 100%;
}

.nav-link.active {
  opacity: 1;
}

.nav-link.active::after {
  width: 100%;
}

/* Special styling for login link */
.nav-link-special {
  background: linear-gradient(45deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2));
  padding: 0.75rem 2rem;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(4px);
  transition: all 0.3s ease;
}

.nav-link-special::after {
  display: none;
}

.nav-link-special:hover {
  background: linear-gradient(45deg, rgba(59, 130, 246, 0.3), rgba(147, 51, 234, 0.3));
  transform: translateY(-2px);
}

/* Add styles for logout button */
.nav-link-special.text-red-400 {
  background: linear-gradient(45deg, rgba(239, 68, 68, 0.2), rgba(185, 28, 28, 0.2));
}

.nav-link-special.text-red-400:hover {
  background: linear-gradient(45deg, rgba(239, 68, 68, 0.3), rgba(185, 28, 28, 0.3));
}

.nav-menu-btn {
  box-shadow: inset 3px 3px 10px rgba(255, 255, 255, 0.5);
}

/* Add new styles for profile button */
.profile-btn-content {
  transition: all 0.3s ease;
}

.profile-btn-content:hover {
  transform: scale(1.05);
}
</style>
