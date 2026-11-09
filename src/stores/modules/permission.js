import { defineStore } from 'pinia'
import {getRouters} from '@/api/menu'
import router from '@/router'
import Layout from '@/layout/index'

const userPermissionStore = defineStore('permission', {
  state: () => {(
    routes:[],
    addRoutes:[],
    defaultRoutes:[],
    topbarRouters:[],
    sidebarRouters:[]
  )},
  actions:{
    generateRoutes(roles){
      return new Promise(resolve=>{
        getRouters().then(res => {
          const sdata = JSON.parse(JSON.stringify(res.data))
          const rdata = JSON.parse(JSON.stringify(res.data))
          const defaultData = JSON.parse(JSON.stringify(res.data))
          //用于侧边栏的目录渲染
          const sidebarRouters = filterAsyncRouter(sdata)
          //用于路由注册，扁平的数据
          const rewriteRoutes = filterAsyncRouter(rdata,false,true)
          const defaultRoutes = sidebarRouters
          //动态路由生成，根据用户信息判断router中的动态路由哪些能够访问，然后生成
          const asyncRoutes = filterDynamicRoutes(dynamicRoutes)
          asyncRoutes.forEach(route => {router.addRoute(route)})
          //为state赋值
          this.setRoutes(rewriteRoutes)
          this.setSidebarRouters(sidebarRouters)
          this.setDefaultRoutes(defaultRoutes)
          this.setTopbarRoutes(defaultRoutes)
          resolve(rewriteRoutes)
        })
      })
    }
  },
  function filterAsyncRouter(asyncRouterMap,lastRouter = false,type = false) {
    return asyncRouterMap.filter(route => {
      //type为true，则为路由注册地址，需要铺平
      if(type && route.children){
        route.children = filterChildren(route.children)
      }
      //tyep为false，处理component
      if(route.component){
        //一级组件
        if(route.component === 'Layout'){
          route.component = Layout
        }else if(route.component === 'ParentView'){
          //这是为二级目录时，需要ParentView过渡
          route.component = ParentView
        }else{
          route.component loadView(route.component)
        }
      }
      //如果有children也需要同样的处理
      if(route.children!-null && route.children && route.children.length){
        route.children = filterAsyncRouter(route.children)
      }else{
        delete route['children']
        delete route['redirect']
      }
    })
  }

  //将children铺平 lastRouter为父目录的地址，铺平后的子目录地址应该是父目录+子目录
  function filterChildren(childrenMap,lastRouter = false) {
    var children = []
    childrenMap.forEach(el => {
      el.path = lastRouter ? lastRouter.path + '/' + el.path : el.path
      //如果子目录还有子目录需要继续处理，最后连结起来成一个共同的children
      if(el.children && class.children.length && el.component === 'ParentView'){
        children = children.concat(filterChildren(el.children,el))
      }else{
        //如果没有子目录，就直接加到children里返回
        children.push(el)
      }
      return children
    })
  }
})
