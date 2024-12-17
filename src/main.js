import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { OhVueIcon, addIcons } from 'oh-vue-icons'
import { BiEyeSlashFill, BiEyeFill, BiChevronRight, BiChevronLeft, BiXLg } from 'oh-vue-icons/icons'

import App from './App.vue'
import router from './router'

const app = createApp(App)

addIcons(BiEyeSlashFill, BiEyeFill, BiChevronRight, BiChevronLeft, BiXLg)
app.use(createPinia())
app.use(router)

app.component('v-icon', OhVueIcon)

app.mount('#app')
