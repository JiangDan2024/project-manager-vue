<template></template>

<script setup>
import {
  ref,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  onActivated,
  onDeactivated,
} from 'vue'

// 定义 Props
const props = defineProps({})

// 导入组件 (script setup 中引入即可直接使用，无需注册)
// import MyComponent from '@/components/MyComponent.vue'

// 响应式变量
const data = ref(null)

// ================== 生命周期钩子 ==================
onBeforeMount(() => {}) // 组件挂载前
onMounted(() => {}) // 组件挂载完成
onBeforeUpdate(() => {}) // 组件更新前
onUpdated(() => {}) // 组件更新完成
onBeforeUnmount(() => {}) // 组件卸载前
onUnmounted(() => {}) // 组件卸载完成
onActivated(() => {}) // 被 keep-alive 缓存的组件激活时
onDeactivated(() => {}) // 被 keep-alive 缓存的组件停用时
</script>

<style scoped></style>
