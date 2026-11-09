<template>
  <div class="login">
    <el-form ref="loginRef" :model="loginForm" :rules="loginRules" class="login-form">
      <h3 class="title">{{ title }}</h3>
      <el-form-item prop="userName">
        <el-input
          v-model="loginForm.userName"
          type="text"
          size="large"
          auto-complete="off"
          placeholder="账号"
        >
          <template #prefix>
            <el-icon><User /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          size="large"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter="handleLogin"
        >
          <template #prefix
            ><el-icon><Lock /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item style="width: 100%">
        <el-button
          :loading="loading"
          size="large"
          type="primary"
          style="width: 100%"
          @click.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
        <div style="float: right" v-if="register">
          <router-link class="link-type" :to="'/register'">立即注册</router-link>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

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
import Cookies from 'js-cookie'
import useUserStore from '@/stores/modules/user'
import { useRoute, useRouter } from 'vue-router'
import { getCurrentInstance, watch } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'

const title = '项目管理系统登录'
const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
const { proxy } = getCurrentInstance()

const loginForm = ref({
  userName: 'admin',
  password: 'admin123',
  code: '',
  uuid: '',
})

const loginRules = {
  userName: [{ required: true, trigger: 'blur', message: '请输入您的账号' }],
  password: [{ required: true, trigger: 'blur', message: '请输入您的密码' }],
  code: [{ required: true, trigger: 'change', message: '请输入验证码' }],
}

const codeUrl = ref('')
const loading = ref(false)
// 注册开关
const register = ref(false)
const redirect = ref(undefined)
const otherQueryParams = ref({})

watch(
  route,
  (newRoute) => {
    const query = newRoute.query
    redirect.value = query?.redirect
    const { redirect: _, ...rest } = query || {}
    otherQueryParams.value = rest
  },
  { immediate: true },
)

function handleLogin() {
  proxy.$refs.loginRef.validate((valid) => {
    if (valid) {
      loading.value = true
      // 用户名不为空则记住
      // if (loginForm.value.userName) {
      //   Cookies.set('userName', loginForm.value.userName, { expires: 30 })
      // } else {
      //   // 否则移除
      //   Cookies.remove('userName')

      // 调用action的登录方法
      userStore
        .login(loginForm.value)
        .then(() => {
          loading.value = false
          router.push({ path: redirect.value || '/', query: otherQueryParams.value })
        })
        .catch(() => {
          loading.value = false
        })
      // }
    }
  })
}

function getCookie() {
  const userName = Cookies.get('userName')
  const password = Cookies.get('password')
  const rememberMe = Cookies.get('rememberMe')
  loginForm.value = {
    userName: userName === undefined ? loginForm.value.userName : userName,
    password: password === undefined ? loginForm.value.password : decrypt(password),
    rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
  }
}

getCookie()
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

<style scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #707070;
  background-size: cover;
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;
  z-index: 1;
  .el-input {
    height: 40px;
    input {
      height: 40px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 0px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 40px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.login-code-img {
  height: 40px;
  padding-left: 12px;
}

html.dark .login {
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)),
    url('../assets/images/login-background.jpg');
  .login-form {
    background: var(--el-bg-color-overlay) !important;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
  }
}
</style>
