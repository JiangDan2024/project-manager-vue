<template>
  <el-breadcrumb separator="/" class="app-brandcrumb">
    <el-breadcrumb-item v-for="(item, index) in levelList" :key="index">
      <span v-if="item.redirect === 'noRedirect' || index === levelList.length - 1">{{
        item.meta.title
      }}</span>
      <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup>
import userPermissionStore from '@/stores/modules/permission'
const levelList = ref([])
const route = useRoute()
const router = useRouter()
const permissionStore = userPermissionStore()
//生成面包屑
function getBreadcrumb() {
  // 构建levelList
  let matched = []
  const pathNum = findPathNum(route.path)
  //1.获取目录层级，因为vue自带的matched对于复杂路由的分割不太靠谱，因此当层级>2时，若依用'/'切割routeName，去piana里找路由信息，手动拼接面包屑
  if (pathNum > 2) {
    //2.如果层级大于2，按/切割，再使用permission.defaultRoutes找到面包屑名称
    const reg = /\/\w+/gi //这个正则的含义是 /\/\（/是外壳，\/是要匹配的内容，\是外壳） \w+意为匹配多个字母，/gi是全局匹配，忽略大小写
    const pathList = route.path.match(reg).map((item, index) => {
      //逐个处理的是把除第一个之外的/去掉，这么做是因为一级目录是绝对路径要/，二三级目录是相对路径
      if (index !== 0) item = item.slice(1)
      return item
    })
    // 根据pathList获取面包屑需要展示的数据，从permissionStore里获取，使用递归获取
    // （原本我想直接find不行吗？但是想通过find找，需要先把所有的children全部拍成一级的，才能，否则find无法查找children的数据）
    //使用getMatched方法，遍历结束后matched应该就是对应的数据
    getMatched(pathList, permissionStore.defaultRoutes, matched)
  } else {
    //3.如果层级小于等于2，vue自带的matched是比较准确的，使用matched即可
    matched = route.matched.filter((item) => item.meta && item.meta.title)
  }
  //4.判断首个面包屑是否是首页，如果不是，加上首页
  if (!isDashboard(matched[0])) {
    //如果不是首页开头，就在开头加上首页
    matched = [{ path: '/index', meta: { title: '首页' } }].concat(matched)
  }
  levelList.value = matched.filter((item) => item.meta && item.meta.title)
  console.dir(levelList)
}

//判断matched是否以首页开头
function isDashboard(route) {
  //得到name,这里在路由里加上name设置
  const name = route && route.name
  if (!name) {
    return false
  }
  return name.trim() === 'Index'
}

//使用path找到详细数据
function getMatched(pathList, routeList, matched) {
  //找出path与pathList[0]相等的数据，加入matched。pathList弹出[0]，递归遍历children数据
  let data = routeList.find(
    (item) => item.path == pathList[0] || (item.name += '').toLowerCase() == pathList[0],
  )
  if (data) {
    matched.push(data)
    if (data.children && pathList.length) {
      pathList.shift()
      getMatched(pathList, data.children, matched)
    }
  }
}

//根据路径返回路径中/的个数，也可以代表目录深度吧
function findPathNum(path, char = '/') {
  //使用indexof查找/的个数，index初始化为第一个/的下标，计数加一后，查找第二个/下标，直到下标为-1全部找完，返回计数结果
  let index = path.indexOf(char)
  let num = 0
  while (index != -1) {
    num++
    index = path.indexOf(char, index + 1)
  }
  return num
}

//除了无法重定向和当前目录外，其他能够跳转的目录，跳转实现
function handleLink(item) {
  const { redirect, path } = item
  if (redirect) {
    router.push(redirect)
    return
  }
  router.push(path)
}
//监测route数据，变化时更新面包屑数据
watchEffect(() => {
  if (route.path.startsWith('/redirect/')) {
    return
  }
  getBreadcrumb()
})
</script>

<style scoped>
.app-brandcrumb {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  overflow: hidden;
}
.el-breadcrumb__item {
  display: flex;
  flex-shrink: 1;
  min-width: 0;
}

.el-breadcrumb__inner {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
