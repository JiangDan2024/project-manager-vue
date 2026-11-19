<template>
  <el-scrollbar
    wrap-style="overflow-x:auto;overfloe-y:hidden;"
    ref="scrollContainer"
    @wheel.prevent="handleScroll"
  >
    <slot />
  </el-scrollbar>
</template>
<script setup>
import useTagsViewStore from '@/stores/modules/tagsView'

const proxy = getCurrentInstance()
// const scrollWrapper = computed(() => proxy.$refs.scrollContainer.$refs.wrapRef)
const scrollContainer = ref(null)
//使用computed是为了实时追踪变量
const visitedViews = computed(() => useTagsViewStore().visitedViews)

const tagAndTagSpacing = ref(4)
const emits = defineEmits(['scroll', 'updateArrows'])

//computed惰性求值，导致滚动鼠标触发scrollWrapper时，scrollWrapper计算时间不够，获取值为undefined，在onMounted里提前渲染
onMounted(() => {
  scrollContainer.value.wrapRef.addEventListener('scroll', emitScroll, true)
})

onBeforeUnmount(() => {
  scrollContainer.value.wrapRef.removeEventListener('scroll', emitScroll)
})

const emitScroll = () => {
  emits('scroll')
  emits('updateArrows')
}

//实现滑动到当前页签
function moveToTarget(currentTag) {
  //获取必要变量，比如scrollLeft、scrollWidth、clientWidth
  const $scrollWrapper = scrollContainer.value.wrapRef

  //获取第一个页签和最后的页签
  let first = null
  let last = null
  if (visitedViews.value.length > 0) {
    first = visitedViews.value[0]
    last = visitedViews.value[visitedViews.value.length - 1]
  }

  if (currentTag === first) {
    scrollToStart()
  } else if (currentTag === last) {
    scrollToEnd()
  } else {
    //获取当前元素的下标
    const currentIndex = visitedViews.value.findIndex((tag) => tag === currentTag)
    //获取当前元素的上一个和下一个元素，计算对应的起始空间和结束空间
    const tagListDom = Array.from(document.getElementsByClassName('tags-view-item'))
    const prevTag = tagListDom.find(
      (dom, index) => dom.dataset.path === visitedViews.value[currentIndex - 1].path,
    )
    const nextTag = tagListDom.find(
      (dom, index) => dom.dataset.path === visitedViews.value[currentIndex + 1].path,
    )
    const afterNextTagOffsetLeft = nextTag.offsetLeft + nextTag.offsetWidth + tagAndTagSpacing.value
    const beforePrevTagOffsetLeft = prevTag.offsetLeft - tagAndTagSpacing.value
    if (afterNextTagOffsetLeft > $scrollWrapper.scrollLeft + $scrollWrapper.clientWidth) {
      smoothScrollTo(afterNextTagOffsetLeft - $scrollWrapper.clientWidth)
    } else if (beforePrevTagOffsetLeft < $scrollWrapper.scrollLeft) {
      smoothScrollTo(beforePrevTagOffsetLeft)
    }
  }
}

//将滚轮滚动转为滑动距离
function handleScroll(e) {
  const eventDelta = e.wheelDelta || -e.deltaY * 40
  const $scrollWrapper = scrollContainer.value.wrapRef
  $scrollWrapper.scrollLeft = $scrollWrapper.scrollLeft + eventDelta / 4
  //更新状态f
  emits('updateArrows')
}

function smoothScrollTo(target) {
  //初始化scrollLeft starttime distance duration start
  const $scrollWrapper = scrollContainer.value.wrapRef
  const start = $scrollWrapper.scrollLeft
  const distance = target - start
  const duration = 300
  let startTime = null

  //子函数ease，缓动函数，用于计算当前时间应到达的位置
  function ease(t, b, c, d) {
    t /= d / 2
    if (t < 1) return (c / 2) * t * t + b
    t--
    return (-c / 2) * (t * (t - 2) - 1) + b
  }
  //子函数step，调用ease计算当前位置，同时在时间未到时调用requestAnimationFrame，到时间后更新状态，这句话可以总结为通过递归间隔更新位置实现滚动
  function step(timestamp) {
    if (!startTime) startTime = timestamp
    const elapsed = timestamp - startTime
    $scrollWrapper.scrollLeft = ease(elapsed, start, distance, duration)
    if (elapsed < duration) {
      requestAnimationFrame(step)
    } else {
      //更新左右箭头的状态
      $scrollWrapper.scrollLeft = target
      emits('updateArrows')
    }
  }
  //调用requestAnnimationFrame
  requestAnimationFrame(step)
}
//左箭头
function scrollToStart() {
  smoothScrollTo(0)
}
//右箭头
function scrollToEnd() {
  const $scrollWrapper = scrollContainer.value.wrapRef
  const target = $scrollWrapper.scrollWidth - $scrollWrapper.clientWidth
  smoothScrollTo(target)
}
//判断左右箭头是否能够点击
function getScrollState() {
  const $scrollWrapper = scrollContainer.value.wrapRef
  return {
    canLeft: $scrollWrapper.scrollLeft > 0,
    canRight:
      $scrollWrapper.scrollLeft < $scrollWrapper.scrollWidth - $scrollWrapper.clientWidth - 1,
  }
}
defineExpose({
  moveToTarget,
  getScrollState,
  scrollToEnd,
  scrollToStart,
})
</script>
<style scoped></style>
