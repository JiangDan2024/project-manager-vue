<template>
  <div></div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { onBeforeMount } from 'vue'

const route = useRoute()
const router = useRouter()

onBeforeMount(() => {
  const { params, query } = route
  const { path } = params
  // 1. 处理参数：因为配置了 :path(.*)，path 可能是数组
  const newPath = Array.isArray(path) ? path.join('/') : path

  // 2. 核心：使用 replace 跳回原页面
  // 千万别用 push，否则你的浏览器后退按钮会废掉（点后退一直在中转页和原页面之间来回弹）
  router.replace({ path: '/' + newPath, query })
})
</script>
