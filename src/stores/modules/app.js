import Cookies from 'js-cookie'

const useAppStore = defineStore('app', {
  state: () => ({
    sidebar: {
      // !!+val是用作转换类型为布尔类型
      opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
      withoutAnimation: false,
      hide: false,
    },
  }),
  actions: {
    toggleSideBar(withoutAnimation) {
      if (this.sidebar.hide) {
        return false
      }
      this.sidebar.opened = !this.sidebar.opened
      //当页面强行缩放时，把withoutAnimation（不要动画）=true
      this.sidebar.withoutAnimation = withoutAnimation
      if (this.sidebar.opened) {
        Cookies.set('sidebarStatus', 1)
      } else {
        Cookies.set('sidebarStatus', 0)
      }
    },
  },
})

export default useAppStore
