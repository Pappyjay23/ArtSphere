<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LoginImg from '@/assets/images/sign-up-bg.webp'
import SignUpImg from '@/assets/images/login-bg.webp'
import Button from '@/components/FormButton.vue'
import FormInput from '@/components/FormInput.vue'
import { computed } from 'vue'
import useAuth from '@/composables/useAuth'
import Loader from '@/components/Loader.vue'

const { signup, login, error, loading } = useAuth()
const router = useRouter()
const route = useRoute()

const showPassword = ref(false)

const isSignUp = computed(() => route.path === '/sign-up')

const toggleShowPassword = () => {
  showPassword.value = !showPassword.value
}

const formValues = ref({
  fullname: '',
  username: '',
  email: '',
  password: '',
  profileImage: null,
})

const imagePreview = ref(null)
const imageError = ref('')

const handleImageUpload = (e) => {
  const file = e.target.files[0]
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      imageError.value = 'Image size should be less than 5MB'
      return
    }
    imageError.value = ''
    formValues.value.profileImage = file
    imagePreview.value = URL.createObjectURL(file)
  }
}

const removeImage = () => {
  formValues.value.profileImage = null
  imagePreview.value = null
  imageError.value = ''
  const fileInput = document.querySelector('#profile-image-input')
  if (fileInput) fileInput.value = ''
}

const formatErrorMessage = (error) => {
  const errorCode = error.code || error.message || 'unknown';
  switch (errorCode) {
    case 'auth/invalid-credential':
      return 'Invalid credentials. Please try again.';
    case 'auth/user-not-found':
      return 'No user found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    // Add more cases as needed
    default:
      return 'An error occurred. Please try again.';
  }
}

const submitForm = async (e) => {
  e.preventDefault()
  error.value = '' // Clear any previous errors

  try {
    if (isSignUp.value) {
      await signup({
        email: formValues.value.email,
        password: formValues.value.password,
        fullname: formValues.value.fullname,
        username: formValues.value.username,
        profileImage: formValues.value.profileImage,
      })
    } else {
      await login(formValues.value.email, formValues.value.password)
    }

    // Only redirect if no errors occurred
    router.push('/')
  } catch (err) {
    console.error('Form submission error:', err)
    error.value = formatErrorMessage(err)
    formValues.value = {
      fullname: '',
      username: '',
      email: '',
      password: '',
      profileImage: null,
    }

    setTimeout(() => {
      error.value = ''
    }, 2000)
  }
}
</script>

<template>
  <div class="flex justify-center items-center h-screen">
    <div
      class="login-container h-fit lg:h-[90%] w-[90%] md:w-[70%] lg:w-[90%] bg-blue-900/30 shadow-[inset_2px_2px_8px_4px_rgba(255,255,255,0.3)] lg:shadow-none backdrop-blur-[10px] rounded-lg flex justify-center gap-5 p-2 lg:p-4">
      <div class="flex-1 relative hidden lg:block">
        <div
          class="bg-center bg-cover bg-blue-500/30 h-full w-full rounded-lg relative z-[2] transition-all duration-500 ease-in-out"
          :style="{ backgroundImage: `url(${isSignUp ? SignUpImg : LoginImg})` }"></div>
        <div class="absolute top-0 left-0 w-full h-full bg-black/20 rounded-lg z-[5]"></div>
      </div>
      <div class="bg-transparent flex-1 py-[1.5rem] lg:py-[3rem] px-4">
        <div class="flex flex-col w-full lg:w-[70%] mx-auto">
          <h1 class="text-[1.5rem] lg:text-[1.9rem] font-bold tracking-tight transition-all duration-500 ease-in-out">
            {{ isSignUp ? 'Create an account' : 'Welcome back' }}
          </h1>
          <p class="text-[80%] pt-3 transition-all duration-500 ease-in-out">
            {{ isSignUp ? 'Already have an account?' : "Don't have an account?" }}
            <RouterLink :to="isSignUp ? '/login' : '/sign-up'"
              class="text-blue-500 underline transition-all duration-500 ease-in-out">
              {{ isSignUp ? 'Log in' : 'Sign up' }}
            </RouterLink>
          </p>
          <span v-if="error" class="text-red-400 text-sm my-2 transition-all duration-500 ease-in-out">{{ error
            }}</span>

          <form @submit="submitForm" class="pt-[2rem] flex flex-col gap-4">
            <div v-if="isSignUp" class="flex flex-col items-center mb-6">
              <label for="profile-image-input" class="group flex flex-col items-center gap-2 cursor-pointer">
                <div class="w-24 h-24 rounded-full border-2 border-blue-500 overflow-hidden">
                  <div
                    class="w-full h-full flex items-center justify-center bg-white/20 group-hover:bg-black/10 transition-all duration-500 ease-in-out">
                    <img v-if="imagePreview" :src="imagePreview" alt="Profile preview"
                      class="w-full h-full object-cover" />
                    <div v-else class="flex flex-col items-center text-gray-200">
                      <v-icon name="bi-person-fill" scale="2"></v-icon>
                    </div>
                  </div>
                </div>

                <span class="text-sm text-gray-300 flex items-center gap-2">
                  <template v-if="imagePreview">
                    <span class="flex items-center gap-1">
                      <v-icon name="bi-pencil-fill" scale="0.8"></v-icon>
                      Change photo
                    </span>
                    <button type="button" @click.prevent.stop="removeImage"
                      class="text-red-400 hover:text-red-300 flex items-center gap-1">
                      <v-icon name="bi-trash-fill" scale="0.8"></v-icon>
                      Remove
                    </button>
                  </template>
                  <template v-else>
                    <v-icon name="bi-plus-circle" scale="0.8"></v-icon>
                    Add profile picture
                  </template>
                </span>
              </label>

              <input type="file" id="profile-image-input" class="hidden" accept="image/*" @change="handleImageUpload" />

              <span v-if="imageError" class="text-red-400 text-sm mt-2">{{ imageError }}</span>
            </div>

            <FormInput v-if="isSignUp" v-model="formValues.fullname" type="text" placeholder="Full Name" />
            <FormInput v-if="isSignUp" v-model="formValues.username" type="text" placeholder="Username" />
            <FormInput v-model="formValues.email" type="email" placeholder="Email" />
            <div class="relative bg-white/20 px-5 py-2 rounded-[4px] w-full">
              <input v-if="showPassword" type="text" v-model="formValues.password"
                :placeholder="isSignUp ? 'Enter your password' : 'Password'" required
                class="bg-transparent text-[80%] border-0 outline-none w-[80%]" />
              <input v-else type="password" v-model="formValues.password"
                :placeholder="isSignUp ? 'Enter your password' : 'Password'" required
                class="bg-transparent text-[80%] border-0 outline-none w-[80%]" />
              <span @click="toggleShowPassword" class="absolute right-[20px] cursor-pointer">
                <v-icon v-if="showPassword" name="bi-eye-fill" scale="1"></v-icon>
                <v-icon v-else name="bi-eye-slash-fill" scale="1"></v-icon>
              </span>
            </div>

            <Button :text="loading ? '' : (isSignUp ? 'Create account' : 'Log in')" type="submit" :disabled="loading">
              <Loader v-if="loading" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@media screen and (min-width: 2000px) {
  .login-container {
    height: 60% !important;
  }
}
</style>
