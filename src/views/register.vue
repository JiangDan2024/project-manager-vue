<template>
  <div class="register">
    <el-form ref="registerRef" :model="registerForm" :rules="registerRules" class="register-form">
      <h3 class="title">{{ title }}</h3>
      <el-form-item prop="userName">
        <el-input
          v-model="registerForm.userName"
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
          v-model="registerForm.password"
          type="password"
          size="large"
          auto-complete="off"
          placeholder="密码"
        >
          <template #prefix
            ><el-icon><Lock /></el-icon
          ></template>
        </el-input>
      </el-form-item>
      <el-form-item prop="confirmPassword">
        <el-input
          v-model="registerForm.confirmPassword"
          type="password"
          size="large"
          auto-complete="off"
          placeholder="确认密码"
        >
          <template #prefix
            ><el-icon><Lock /></el-icon
          /></template>
        </el-input>
      </el-form-item>
      <el-form-item style="width: 100%">
        <el-button
          :loading="loading"
          size="large"
          type="primary"
          style="width: 100%"
          @click.prevent="handleRegister"
        >
          <span v-if="!loading">注 册</span>
          <span v-else>注 册 中...</span>
        </el-button>
        <div style="float: right">
          <router-link class="link-type" :to="'/login'">使用已有账户登录</router-link>
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
import { register } from '@/api/login'
import { getCurrentInstance } from 'vue'
import { ElMessageBox } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { useRouter  } from 'vue-router'

// 定义 Props
const props = defineProps({})
const title = '项目管理系统注册'
const router = useRouter() 

const registerForm = ref({
  userName: '',
  password: '',
  confirmPassword: '',
  code: '',
  uuid: '',
})
const registerRef = ref(null) 
const equalToPassword = (rule, value, callback) => {
  if (registerForm.value.password !== value) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const registerRules = {
  userName: [
    { required: true, trigger: 'blur', message: '请输入您的账号' },
    { min: 2, max: 20, message: '用户账号长度必须介于 2 和 20 之间', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, trigger: 'blur', message: '请再次输入您的密码' },
    { required: true, validator: equalToPassword, trigger: 'blur' },
  ],
  code: [{ required: true, trigger: 'change', message: '请输入验证码' }],
}
// 导入组件 (script setup 中引入即可直接使用，无需注册)
// import MyComponent from '@/components/MyComponent.vue'

// 响应式变量
const data = ref(null)
const codeUrl = ref('')
const loading = ref(false)
const captchaEnabled = ref(true)
const proxy = getCurrentInstance()
// ================== 生命周期钩子 ==================
onBeforeMount(() => {}) // 组件挂载前
onMounted(() => {}) // 组件挂载完成
onBeforeUpdate(() => {}) // 组件更新前
onUpdated(() => {}) // 组件更新完成
onBeforeUnmount(() => {}) // 组件卸载前
onUnmounted(() => {}) // 组件卸载完成
onActivated(() => {}) // 被 keep-alive 缓存的组件激活时
onDeactivated(() => {}) // 被 keep-alive 缓存的组件停用时

function handleRegister() {
  registerRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      register(registerForm.value)
        .then((res) => {
          console.dir(res)
          loading.value = false
          const userName = registerForm.value.userName
          ElMessageBox.alert(
              "<font color='red'>恭喜你，您的账号 " + userName + ' 注册成功！</font>',
              '系统提示',
              {
                dangerouslyUseHTMLString: true,
                type: 'success',
              },
            )
              .then(() => {
                router.push('/login')
              })
              .catch(() => {})
        })
        .catch(() => {
          loading.value = false
        })
    }
  })
}
</script>

<style scoped>
.register {
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

.register-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;
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
.register-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.register-code {
  width: 33%;
  height: 40px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-register-footer {
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
.register-code-img {
  height: 40px;
  padding-left: 12px;
}
</style>
