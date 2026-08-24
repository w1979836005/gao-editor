import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import 'ant-design-vue/dist/reset.css'
import Antd from 'ant-design-vue'
import { initTheme } from './theme/theme.ts'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Antd)

//初始化主题
initTheme()

app.mount('#app')
