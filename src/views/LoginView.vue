<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LoginImg from '@/assets/images/sign-up-bg.webp'
import SignUpImg from '@/assets/images/login-bg.webp'
import Button from '@/components/Button.vue'
import FormInput from '@/components/FormInput.vue'
import { computed } from 'vue'

const showPassword = ref(false)
const router = useRouter()
const route = useRoute()

const isSignUp = computed(() => route.path === '/sign-up')

const toggleShowPassword = () => {
  showPassword.value = !showPassword.value
}

const formValues = ref({
  username: '',
  email: '',
  password: '',
})

const submitForm = (e) => {
  e.preventDefault()
  console.log(formValues.value)

  setTimeout(() => {
    formValues.value = {
      username: '',
      email: '',
      password: '',
    }
    router.push('/')
  }, 500)
}
</script>

<template>
  <div class="flex justify-center items-center h-screen">
    <div
      class="h-[90%] w-[90%] bg-blue-900/30 backdrop-blur-[10px] rounded-lg flex justify-center gap-5 p-4"
    >
      <div class="flex-1 relative">
        <div
          class="bg-center bg-cover bg-blue-500/30 h-full w-full rounded-lg relative z-[2] transition-all duration-500 ease-in-out"
          :style="{ backgroundImage: `url(${isSignUp ? SignUpImg : LoginImg})` }"
        ></div>
        <div class="absolute top-0 left-0 w-full h-full bg-black/20 rounded-lg z-[5]"></div>
      </div>
      <div class="bg-transparent flex-1 py-[3rem]">
        <div class="flex flex-col w-[70%] mx-auto">
          <h1 class="text-[1.9rem] font-medium tracking-tight transition-all duration-500 ease-in-out">
            {{ isSignUp ? 'Create an account' : 'Log in to your account' }}
          </h1>
          <p class="text-[80%] pt-3 transition-all duration-500 ease-in-out">
            {{ isSignUp ? 'Already have an account?' : "Don't have an account?" }}
            <RouterLink :to="isSignUp ? '/login' : '/sign-up'" class="text-blue-500 underline transition-all duration-500 ease-in-out">
              {{ isSignUp ? 'Log in' : 'Sign up' }}
            </RouterLink>
          </p>

          <form @submit="submitForm" class="pt-[2rem] flex flex-col gap-4">
            <FormInput
              v-if="isSignUp"
              v-model="formValues.username"
              type="text"
              placeholder="Username"
            />
            <FormInput v-model="formValues.email" type="email" placeholder="Email" />
            <div class="relative bg-white/20 px-5 py-2 rounded-[4px] w-full">
              <input
                v-if="showPassword"
                type="text"
                v-model="formValues.password"
                :placeholder="isSignUp ? 'Enter your password' : 'Password'"
                required
                class="bg-transparent text-[80%] border-0 outline-none w-[80%]"
              />
              <input
                v-else
                type="password"
                v-model="formValues.password"
                :placeholder="isSignUp ? 'Enter your password' : 'Password'"
                required
                class="bg-transparent text-[80%] border-0 outline-none w-[80%]"
              />
              <span @click="toggleShowPassword" class="absolute right-[20px] cursor-pointer">
                <v-icon v-if="showPassword" name="bi-eye-fill" scale="1"></v-icon>
                <v-icon v-else name="bi-eye-slash-fill" scale="1"></v-icon>
              </span>
            </div>

            <Button :text="isSignUp ? 'Create account' : 'Log in'" type="submit" />
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
