import router from './router'
import { getToken } from './utils/auth'
import useUserStore from './stores/modules/user'
import { isHttp, isPathMatch } from './utils/validate'
import userPermissionStore from './stores/modules/permission'
import { ElMessage } from 'element-plus'
//白名单
const whiteList = ['/login', '/register']

const isWhiteList = (path) => {
  //isPathMatch用于判断某个路径里是否存在某个字符串
  return whiteList.some((pattern) => isPathMatch(pattern, path))
}

router.beforeEach(async (to, from) => {
  if (getToken()) {
    if (to.path === '/login') {
      return { path: '/' }
    }
    if (isWhiteList(to.path)) {
      return true
    }
    if (useUserStore().roles.length === 0) {
      try {
        //加载用户信息和路由
        await useUserStore().getInfo()
        const accessRoutes = await userPermissionStore().generateRoutes()
        console.dir(accessRoutes)
        accessRoutes.forEach((route) => {
          if (!isHttp(route.path)) {
            router.addRoute(route)
          }
        })
        return { ...to, replace: true }
      } catch (err) {
        await useUserStore().logOut()
        ElMessage.error(err)
        console.dir(err)
        return { path: '/' }
      }
    }
    return true
  } else {
    //没有token
    if (isWhiteList(to.path)) {
      return true
    }
    //否则全部重定向到登录页
    return `/login?redirect=${to.fullPath}`
  }
})
