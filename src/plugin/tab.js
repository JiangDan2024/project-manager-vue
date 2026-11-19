import useTagsViewStore from '@/stores/modules/tagsView'
import router from '@/router'

export default {
  //刷新页签
  refreshPage(obj) {
    const { path, query, matched } = router.currentRoute.value
    //前缀为refirect的直接返回，避免重复刷新
    if (path.startsWith('/redirect/')) {
      return Promise.resolve()
    }
    // if (obj === undefined) {
    //   matched.forEach((m) => {
    //     if (m.components && m.components.default && m.components.default.name) {
    //       if (!['Layout', 'ParentView'].includes(m.components.default.name)) {
    //         obj = { name: m.components.default.name, path: path, query: query }
    //       }
    //     }
    //   })
    // }
    return router.replace({ path: '/redirect' + path, query: query })
  },
  //关闭指定页签
  closePage(tag) {
    if (tag === undefined) {
      useTagsViewStore()
        .delView(router.currentRoute.value)
        .then(({ visitedViews }) => {
          //获取最新页签并跳转
          toLastView(visitedViews, router.currentRoute.value)
        })
    }
    return useTagsViewStore().delView(tag)
  },
  //去最新页签
  toLastView(visitedViews, view) {
    //slice(-1)截取最后一个元素，[0]获取该元素
    const lastView = visitedViews.slice(-1)[0]
    if (lastView) {
      router.push(lastView.fullPath)
    } else {
      //最新页签没有
      //是不是仪表盘，是的话重定向刷新
      if (view && view.name === 'Dashboard') {
        router.replace({ path: '/redirect' + view.fullPath })
      } else {
        //否则去首页/
        router.push('/')
      }
    }
  },
  //关闭所有tag页签
  closeAllPage() {
    return useTagsViewStore().delAllView()
  },
  //关闭左侧tab页签
  closeLeftPage(obj) {
    return useTagsViewStore().delLeftView(obj || router.currentRoute.value)
  },
  //关闭右侧tab页签
  closeRightPage(obj) {
    return useTagsViewStore().delRightView(obj || router.currentRoute.value)
  },
  //关闭其他tab页签
  closeOtherPage(obj) {
    return useTagsViewStore().delOtherView(obj || router.currentRoute.value)
  },
}
