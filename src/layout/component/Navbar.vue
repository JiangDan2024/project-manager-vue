<template>
  <div class="navbar">
    <Hamburger
      class="hamburger-container"
      @toggleClick="toggleSideBar"
      :is-active="appStore.sidebar.opened"
    />
    <Breadcrumb class="breadcrumb-container" />
    <div class="right-menu">
      <el-tooltip class="box-item" effect="dark" content="源码地址" placement="bottom">
        <img class="project-git" src="@/assets/icons/svg/github.svg" width="20px" @click="goto" />
      </el-tooltip>

      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          <img :src="userStore.avatar" class="user-avatar" />
          <span class="user-name">{{ userStore.userName }}</span>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              <router-link to=""> 用户中心 </router-link>
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
// 定义 Props
const props = defineProps({})

// 导入组件 (script setup 中引入即可直接使用，无需注册)
// import MyComponent from '@/components/MyComponent.vue'
import Hamburger from '@/component/Hamburger/index.vue'
import useAppStore from '@/stores/modules/app'
import Breadcrumb from '@/component/Breadcrumb/index.vue'
import useUserStore from '@/stores/modules/user'
import { ElMessageBox } from 'element-plus'
// 响应式变量
const data = ref(null)
const appStore = useAppStore()
const userStore = useUserStore()
const githubUrl = ref('https://github.com/JiangDan2024/project-manage')
function toggleSideBar() {
  appStore.toggleSideBar()
}
function goto() {
  window.open(githubUrl.value)
}
//处理下拉框里的command相关的方法
function handleCommand(command) {
  switch (command) {
    case 'logout':
      logOut()
      break
    default:
      break
  }
}
//退出登录
function logOut() {
  ElMessageBox.confirm('确定注销并退出系统吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      userStore.logOut().then(() => {
        location.href = '/login'
      })
    })
    .catch(() => {})
}
</script>

<style scoped>
.navbar {
  height: 50px;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  .hamburger-container {
    cursor: pointer;
    display: flex;
  }

  .right-menu {
    display: flex;
    align-items: center;
    margin-left: auto;

    .user-avatar {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      margin-right: 5px;
    }

    .user-name {
      position: relative;
      bottom: 10px;
      font-weight: bolder;
      margin-right: 10px;
    }
  }
  .project-git {
    cursor: pointer;
    margin-right: 5px;
  }
}
</style>
