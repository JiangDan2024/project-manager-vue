<template>
  <div class="tags-view-container">
    <!-- 左箭头 -->
    <span
      class="tags-nav-btn tags-nav-btn--left"
      :class="{ disabled: !canScrollLeft }"
      @click="scrollLeft"
    >
      <el-icon><ArrowLeft /></el-icon>
    </span>
    <!-- 页签  -->
    <scroll-pane
      class="tags-view-wrapper"
      ref="scrollPaneRef"
      @scroll="handscroll"
      @update-arrows="updateArrows"
    >
      <router-link
        v-for="tag in visitedViews"
        :key="tag.path"
        :data-path="tag.path"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        class="tags-view-item"
        :class="{ active: isActive(tag) }"
        @contextmenu.prevent="openMenu(tag, $event)"
        >{{ tag.meta.title }}
        <el-icon v-if="!isAffix(tag)" class="tags-close-btn" @click.prevent="closeTag(tag)"
          ><Close
        /></el-icon>
      </router-link>
    </scroll-pane>
    <!-- 右箭头  -->
    <span
      class="tags-nav-btn tags-nav-btn--right"
      :class="{ disabled: !canScrollRight }"
      @click="scrollRight"
    >
      <el-icon><ArrowRight /></el-icon>
    </span>
    <!-- 刷新图标 -->
    <span class="tags-action-btn tags-refresh-btn">
      <el-icon><RefreshRight /></el-icon>刷新
    </span>

    <!-- 右键上下文菜单 -->
    <ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)">
        <el-icon><RefreshRight /></el-icon>刷新
      </li>
      <li v-if="!isAffix(selectedTag)" @click="closeTag(selectedTag)">
        <el-icon><Close /></el-icon>关闭当前
      </li>
      <li @click="closeOtherTags(selectedTag)">
        <el-icon><Close /></el-icon>关闭其他
      </li>
      <li v-if="!isFirstView(selectedTag)" @click="closeLeftTags(selectedTag)">
        <el-icon><Close /></el-icon>关闭左侧
      </li>
      <li v-if="!isLastView(selectedTag)" @click="closeRightTags(selectedTag)">
        <el-icon><Close /></el-icon>关闭右侧
      </li>
      <li @click="closeAllTags()">
        <el-icon><Close /></el-icon>关闭全部
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ArrowLeft, ArrowRight, RefreshRight, Close } from '@element-plus/icons-vue'
import ScrollPane from './ScrollPane.vue'
import useTagsViewStore from '@/stores/modules/tagsView'
import userPermissionStore from '@/stores/modules/permission'
import { getNormalPath } from '@/utils/common'
// 定义 Props
const props = defineProps({})
const tagsViewStore = useTagsViewStore()
const visitedViews = computed(() => tagsViewStore.visitedViews)
const permissionStore = userPermissionStore()
const routes = computed(() => permissionStore.routes)

const visible = ref(false)
const top = ref(0)
const left = ref(0)
const selectedTag = ref({})

// 导入组件 (script setup 中引入即可直接使用，无需注册)

const { proxy } = getCurrentInstance()
// 响应式变量
const data = ref(null)
const route = useRoute()
const affixTags = ref([])

const canScrollLeft = ref(false)
const canScrollRight = ref(false)

const scrollPaneRef = ref(null)
watch(route, () => {
  //新增一个页签
  addView()
  //更新页签
  moveToCurrentTag()
})
//监测页签变化，一旦变化更新状态
watch(visitedViews, () => {
  nextTick(() => updateArrowState())
})
watch(visible, (value) => {
  if (value) {
    document.body.addEventListener('click', closeMenu)
  } else {
    document.body.removeEventListener('click', closeMenu)
  }
})
//初始化数据
onMounted(() => {
  initTags()
  addView()
  window.addEventListener('resize', updateArrowState)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateArrowState)
})
//新增页签
function addView() {
  const { name } = route
  if (name) {
    tagsViewStore.addView(route)
  }
}
//移动到最新页签，同时更新页签数据
function moveToCurrentTag() {
  nextTick(() => {
    for (const v of visitedViews.value) {
      if (v.path === route.path) {
        scrollPaneRef.value.moveToTarget(v)
        if (v.fullPath !== route.fullPath) {
          tagsViewStore.updateVisitedView(route)
        }
      }
    }
  })
}
//初始化页签数据
function initTags() {
  //处理固定页签，并加到visitedViews里
  const res = filterAffixTags(routes.value)
  affixTags.value = res
  for (const tag of res) {
    const { name } = tag
    if (name) {
      tagsViewStore.addView(tag)
    }
  }
}
//处理固定页签数据
function filterAffixTags(routes, basePath = '') {
  let tags = []
  //把所有的固定页签加入tags，并进行过滤和规范
  routes.forEach((route) => {
    if (route.meta && route.meta.affix) {
      //处理路径
      const tagPath = getNormalPath(basePath + '/' + route.path)
      tags.push({
        fullPath: tagPath,
        path: tagPath,
        name: route.name,
        meta: { ...route.meta },
      })
    }
    if (route.children) {
      const tempTags = filterAffixTags(route.children)
      if (tempTags.length >= 1) {
        tags = [...tags, ...tempTags]
      }
    }
  })
  return tags
}
//判断是否为当前页签
function isActive(tag) {
  return tag.path === route.path
}
//判断是否为固定页签
function isAffix(tag) {
  return tag && tag.meta && tag.meta.affix
}
//关闭页签
function closeTag(tag) {
  proxy.$tab.closePage(tag).then(() => {
    if (isActive(tag)) {
      proxy.$tab.toLastView(visitedViews.value, tag)
    }
  })
  tagsViewStore.delView(tag)
}

function scrollLeft() {
  if (canScrollLeft.value) {
    scrollPaneRef.value.scrollToStart()
  }
}

function scrollRight() {
  if (canScrollRight.value) {
    scrollPaneRef.value.scrollToEnd()
  }
}

function updateArrowState() {
  nextTick(() => {
    if (scrollPaneRef.value) {
      const state = scrollPaneRef.value.getScrollState()
      canScrollLeft.value = state.canLeft
      canScrollRight.value = state.canRight
    }
  })
}

function handscroll() {
  closeMenu()
  updateArrowState()
}

//右键打开菜单
function openMenu(tag, e) {
  left.value = e.clientX
  top.value = e.clientY
  visible.value = true
  selectedTag.value = tag
}

//刷新页面
function refreshSelectedTag(tag) {
  proxy.$tab.refreshPage(tag)
}
//关闭其他页签
function closeOtherTags(tag) {
  proxy.$tab.closeOtherPage(tag)
}
//判断是否为第一个页签
function isFirstView(tag) {
  try {
    const tag =
      selectedTag.value && selectedTag.value.fullPath
        ? selectedTag.value
        : selectedDropdownTag.value
    return tag.fullPath === '/index' || tag.fullPath === visitedViews.value[1].fullPath
  } catch (err) {
    return false
  }
}
//判断是否为最后一个页签
function isLastView(tag) {
  try {
    const tag =
      selectedTag.value && selectedTag.value.fullPath
        ? selectedTag.value
        : selectedDropdownTag.value
    return tag.fullPath === visitedViews.value[visitedViews.value.length - 1].fullPath
  } catch (err) {
    return false
  }
}
//关闭左侧页签
function closeLeftTags(tag) {
  proxy.$tab.closeLeftPage(tag)
}
//关闭右侧页签
function closeRightTags(tag) {
  proxy.$tab.closeRightPage(tag)
}
//关闭所有页签
function closeAllTags() {
  proxy.$tab.closeAllPage()
}

function closeMenu() {
  visible.value = false
}
</script>

<style scoped>
.tags-view-container {
  display: flex;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .tags-view-wrapper {
    white-space: nowrap;
    flex: 1;
    padding: 5px 0;

    .tags-view-item {
      display: inline-flex;
      height: 26px;
      padding: 0 8px;
      cursor: pointer;
      border: 1px solid #d8dce5;
      border-radius: 3px;
      margin-left: 5px;
      align-items: center;
      font-size: 12px;

      &.active {
        color: #fff;
        background: rgb(64, 158, 255);
      }
      .tags-close-btn {
        width: 16px;
        height: 16px;
        margin-left: 3px;
        border-radius: 50%;
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        &:hover {
          background-color: #d8dce5;
        }
      }
    }
  }
  .tags-nav-btn {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #d8dce5;
    cursor: pointer;

    &.disabled {
      color: #c0c4cc;
      cursor: not-allowed;
    }
  }
  .tags-action-btn {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #d8dce5;
    font-size: 12px;
    color: #303133;
  }

  .contextmenu {
    margin: 0;
    z-index: 3000;
    list-style-type: none;
    background: var(--el-bg-color-overlay, #fff);
    position: fixed;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    border: 1px solid var(--el-border-color-light, #e4e7ed);
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;

    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      display: flex;
      align-items: center;

      &:hover {
        background: var(--tags-item-hover, #eee);
      }
    }
  }
}
</style>
