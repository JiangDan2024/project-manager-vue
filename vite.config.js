import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // ======== 下面是你新增的配置 ========
  server: {
    //port: 8080, // 把默认的 5173 改成了 8080
    open: true, // 启动时自动打开浏览器
    proxy: {
      // 配代理解决跨域
      '/api': {
        target: 'http://localhost:16000', // 你的后端地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
