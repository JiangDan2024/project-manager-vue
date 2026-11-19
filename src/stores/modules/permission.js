import { defineStore } from 'pinia'
import { getRouters } from '@/api/menu'
import router from '@/router'
import Layout from '@/layout/index.vue'
import ParentView from '@/component/ParentView.vue'
import { constantRoutes, dynamicRoutes } from '@/router/index'
import auth from '@/plugin/auth'

//匹配views里所有的.vue文件
const modelus = import.meta.glob('./../../views/**/*.vue')

const userPermissionStore = defineStore('permission', {
  state: () => ({
    routes: [],
    addRoutes: [],
    defaultRoutes: [],
    topbarRouters: [],
    sidebarRouters: [],
  }),

  actions: {
    setRoutes(routes) {
      this.addRoutes = routes
      //routes是与route里的默认路由+后端传来的路由共同组合
      //routes是用于路由注册
      this.routes = constantRoutes.concat(routes)
    },
    setDefaultRoutes(routes) {
      //默认的
      this.defaultRoutes = constantRoutes.concat(routes)
    },
    setTopbarRoutes(routes) {
      //顶部路由
      this.topbarRouters = routes
    },
    setSidebarRouters(routes) {
      //侧边路由
      this.sidebarRouters = routes
    },
    generateRoutes(roles) {
      return new Promise((resolve) => {
        getRouters().then((res) => {
          const sdata = JSON.parse(JSON.stringify(res.data))
          const rdata = JSON.parse(JSON.stringify(res.data))
          const defaultData = JSON.parse(JSON.stringify(res.data))
          //用于侧边栏的目录渲染
          const sidebarRouters = filterAsyncRouter(sdata)
          //用于路由注册，扁平的数据
          const rewriteRoutes = filterAsyncRouter(rdata, false, true)
          const defaultRoutes = sidebarRouters
          //动态路由生成，根据用户信息判断router中的动态路由哪些能够访问，然后生成
          const asyncRoutes = filterDynamicRoutes(dynamicRoutes)
          asyncRoutes.forEach((route) => {
            router.addRoute(route)
          })
          //为state赋值
          this.setRoutes(rewriteRoutes)
          this.setSidebarRouters(constantRoutes.concat(sidebarRouters))
          this.setDefaultRoutes(defaultRoutes)
          this.setTopbarRoutes(defaultRoutes)
          resolve(rewriteRoutes)
        })
      })
    },
  },
})

function filterAsyncRouter(asyncRouterMap, lastRouter = false, type = false) {
  return asyncRouterMap.filter((route) => {
    //type为true，则为路由注册地址，需要铺平
    if (type && route.children) {
      route.children = filterChildren(route.children)
    }
    //tyep为false，处理component
    if (route.component) {
      //一级组件
      if (route.component === 'Layout') {
        route.component = Layout
      } else if (route.component === 'ParentView') {
        //这是为二级目录时，需要ParentView过渡
        route.component = ParentView
      } else {
        route.component = loadView(route.component)
      }
    }
    //如果有children也需要同样的处理
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children)
    } else {
      delete route['children']
      delete route['redirect']
    }
    return true
  })
}

//将children铺平 lastRouter为父目录的地址，铺平后的子目录地址应该是父目录+子目录
function filterChildren(childrenMap, lastRouter = false) {
  var children = []
  childrenMap.forEach((el) => {
    el.path = lastRouter ? lastRouter.path + '/' + el.path : el.path
    //如果子目录还有子目录需要继续处理，最后连结起来成一个共同的children
    if (el.children && el.children.length && el.component === 'ParentView') {
      children = children.concat(filterChildren(el.children, el))
    } else {
      //如果没有子目录，就直接加到children里返回
      children.push(el)
    }
  })
  return children
}

//根据用户的权限信息，判断需要生成哪些动态路由
function filterDynamicRoutes(routes) {
  const res = []
  routes.forEach((route) => {
    if (route.permissions) {
      //动态路由设置权限，用户具备其中一个权限即可
      if (auth.hasPermiOr(route.permissions)) {
        res.push(route)
      }
    } else if (route.roles) {
      //动态路由设置了角色，用户具备其中一个角色即可
      if (auth.hasRoleOr(route.roles)) {
        res.push(route)
      }
    }
  })
  return res
}

export const loadView = (view) => {
  let res
  //遍历所有的views下的vue文件，查找匹配的文件
  for (const path in modelus) {
    //切割地址，得到组件名称
    const dir = path.split('views/')[1].split('.vue')[0]
    if (dir === view) {
      //应该是获得具体的导入
      res = () => modelus[path]()
    }
  }
  return res
}
export default userPermissionStore
