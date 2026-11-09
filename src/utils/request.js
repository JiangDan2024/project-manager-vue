import axios from 'axios'
import { ElMessage } from 'element-plus'
import { getToken } from './auth'

const service = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

service.interceptors.request.use(
  (config) => {
    // 按需加 Token，没有就删掉这段
    //   const token = localStorage.getItem('gulimall-token')
    //   if (token) {
    //     config.headers['Authorization'] = 'Bearer ' + token
    //   }
    //如果不用token就在请求体设置isToken为false，如果需要就不设，因此这个变量是用于判断是否禁用token
    const isToken = (config.headers || {}).isToken === false
    if (getToken() && !isToken) {
      config.headers['Authorization'] = 'Bearer' + getToken()
    }
    return config
  },
  (error) => Promise.reject(error),
)
//响应拦截器
service.interceptors.response.use(
  (res) => {
    const code = res.data.code || 200
    const msg = res.data.data.message
    if (code !== 200) {
      ElMessage({ message: msg, type: 'error' })
      return Promise.reject(new Error(message))
    } else {
      return Promise.resolve(res.data)
    }
  },
  (error) => {
    console.error('项目管理系统请求失败:', error)
    return Promise.reject(error)
  },
)

export default service
