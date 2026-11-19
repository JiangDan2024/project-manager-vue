import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import './assets/styles/index.scss'
import './permission'
import plugin from './plugin'
//svg图标
import 'virtual:svg-icons-register'
import SvgIcon from './component/SvgIcon/index.vue'
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(plugin)
app.use(ElementPlus)
app.component('svg-icon', SvgIcon)
app.mount('#app')
