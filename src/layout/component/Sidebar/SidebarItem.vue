<template>
  <div v-if="!item.hidden">
    <!-- 如果没有子目录，渲染为el-menu-item -->
    <template
      v-if="
        hasOneShowingChild(item.children, item) &&
        (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
        !item.alwaysShow
      "
    >
      <el-menu-item
        v-if="onlyOneChild.meta"
        :index="resolvePath(onlyOneChild.path, onlyOneChild.query)"
      >
        <span>
          <!-- <img class="menu-icon" :src="iconSrc(onlyOneChild)"  /> -->
          <svg-icon class="menu-icon" :iconClass="onlyOneChild.meta.icon" @click="goto" />
        </span>
        <span class="menu-title">{{ onlyOneChild.meta.title }}</span>
      </el-menu-item>
    </template>
    <!-- 如果有子目录，需要嵌套el-sub-menu -->
    <el-sub-menu v-else :index="resolvePath(item.path)">
      <template v-if="item.meta" #title>
        <span>
          <!-- <img class="menu-icon" :src="iconSrc(item)" width="20px" @click="goto" /> -->
          <svg-icon class="menu-icon" :iconClass="item.meta.icon" @click="goto" />
        </span>
        <span class="menu-title">{{ item.meta.title }}</span>
      </template>
      <sidebar-item
        v-for="(child, index) in item.children"
        :key="child.path + index"
        :item="child"
        :base-path="resolvePath(child.path)"
      ></sidebar-item>
    </el-sub-menu>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getNormalPath } from '@/utils/common'
//获取父组件传的数据
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  basePath: {
    type: String,
    default: '',
  },
})
const onlyOneChild = ref({})
// const svgModules = import.meta.glob('@/assets/icons/svg/*.svg', { eager: true })
//构建目录图标的地址
// function iconSrc(item) {
//   const iconName = item.meta?.icon
//   if (!iconName) return ''
//   const path = `/src/assets/icons/svg/${iconName}.svg`
//   return svgModules[path]?.default || ''
// }
function hasOneShowingChild(children = [], parent) {
  //过滤children，hidden=false
  if (!children) {
    children = []
  }
  const showingChildren = children.filter((item) => {
    if (item.hidden) {
      return false
    }
    onlyOneChild.value = item
    return true
  })

  if (showingChildren.length == 1) {
    return true
  }
  if (showingChildren.length == 0) {
    //path置为空，避免重复拼接child.path
    onlyOneChild.value = { ...parent, path: '', noShowingChildren: true }
    return true
  }
  return false
}
//设置el-menu的跳转路径，父组件为path，子组件应该加上父path+/
function resolvePath(routePath, routeQuery) {
  if (routeQuery) {
    let query = JSON.parse(routeQuery)
    return { path: getNormalPath(props.basePath + '/' + routePath), query: query }
  }
  return getNormalPath(props.basePath + '/' + routePath)
}
</script>

<style scoped>
.menu-icon {
  vertical-align: middle;
  margin-right: 5px;
  width: 15px;
}
</style>
