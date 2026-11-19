<template>
  <div class="sidebar-container">
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        active-text-color="#ffd04b"
        background-color="#545c64"
        class="el-menu-vertical-demo"
        default-active="2"
        text-color="#fff"
        router
        :collapse="!appStore.sidebar.opened"
        unique-opened="true"
        :collapse-transition="false"
      >
        <sidebar-item
          v-for="(route, index) in sidebarRouters"
          :key="route.path + index"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import SidebarItem from './SidebarItem.vue'
import userPermissionStore from '@/stores/modules/permission'
import { useRoute } from 'vue-router'
import useAppStore from '@/stores/modules/app.js'
// 定义 Props
const props = defineProps({})
const appStore = useAppStore()
// 响应式变量
const sidebarRouters = userPermissionStore().sidebarRouters
const route = useRoute()
//获取当前目录
const activeMenu = computed(() => {
  console.dir(route)
  const { meta, path } = route
  if (meta.activeMenu) {
    return meta.activeMenu
  }
  return path
})
</script>

<style scoped></style>
