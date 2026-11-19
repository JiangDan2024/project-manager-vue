import { defineStore } from 'pinia'

const useTagsViewStore = defineStore('tagsView', {
  state: () => ({
    visitedViews: [],
  }),
  actions: {
    // 新增页签
    addView(view) {
      // 是否已存在
      if (this.visitedViews.some((v) => v.path === view.path)) return
      this.visitedViews.push(
        Object.assign({}, view, {
          title: view.meta.title || 'no-name',
        }),
      )
    },
    //新增固定页签
    addAffixView(view) {
      if (this.visitedViews.some((v) => v.path === view.path)) return
      this.visitedViews.unshift(
        Object.assign({}, view, {
          title: view.meta.title || 'no-name',
        }),
      )
    },
    //删除单个页签
    delView(view) {
      return new Promise((resolve) => {
        for (const [i, v] of this.visitedViews.entries()) {
          if (v.path === view.path) {
            this.visitedViews.splice(i, 1)
            break
          }
        }
        resolve([...this.visitedViews])
      })
    },
    //删除其他标签，除当前页签，其他的都删了
    delOtherView(view) {
      return new Promise((resolve) => {
        this.visitedViews = this.visitedViews.filter((v) => {
          return v.meta.affix || v.path === view.path
        })
        resolve([...this.visitedViews])
      })
    },
    //删除全部的标签
    delAllView(view) {
      return new Promise((resolve) => {
        this.visitedViews = this.visitedViews.filter((v) => {
          return v.meta.affix
        })
        resolve([...this.visitedViews])
      })
    },
    //删除当前标签以左的标签
    delLeftView(view) {
      return new Promise((resolve) => {
        //找出当前view的下标
        const idx = this.visitedViews.findIndex((v) => v.path === view.path)
        if (idx === -1) {
          return
        }
        this.visitedViews = this.visitedViews.filter((item, index) => {
          if (idx >= index && item.meta && item.meta.affix) {
            return true
          }
          return false
        })
        resolve([...this.visitedViews])
      })
    },
    //删除当前标签以右的标签
    delRightView(view) {
      return new Promise((resolve) => {
        const idx = this.visitedViews.findIndex((v) => v.path === view.path)
        if (idx === -1) {
          return
        }
        this.visitedViews = this.visitedViews.filter((item, index) => {
          if (idx <= index && item.meta && item.meta.affix) {
            return true
          }
          return false
        })
        resolve([...this.visitedViews])
      })
    },
    //更新标签，主要更新携带的参数，即fullPath
    updateVisitedView(view) {
      return new Promise((resolve) => {
        for (let v of this.visitedViews) {
          if (v.path === view.path) {
            v = Object.assign(v, view)
            break
          }
        }
      })
    },
  },
})

export default useTagsViewStore
