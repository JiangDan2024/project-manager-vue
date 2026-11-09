import { defineStore } from 'pinia'
import { login, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
const useUserStore = defineStore('user', {
  state: () => ({
    token: getToken(),
    id: '',
    name: '',
    avatar: '',
    userName: '',
    roles: [],
    permissions: [],
  }),
  actions: {
    login(userInfo) {
      //构建UserRegisterVo对象，传给后端
      //loginacct  password
      const loginacct = userInfo.userName.trim()
      const password = userInfo.password
      return login({ loginacct, password }).then((res) => {
        //设置token
        setToken(res.data.tokenValue)
        this.token = res.data.tokenValue
        return res
      })
    },
    getInfo() {
      return new Promise((resolve, reject) => {
        getInfo()
          .then((res) => {
            const user = res.user
            //头像
            let avatar = user.avatar || ''
            //没有头像设置一个默认的
            if (!isHttp(avatar)) {
              avatar = isEmpty(avatar) ? defAva : avatar
            }
            if (res.roles && res.roles.length > 0) {
              this.roles = res.roles
              this.permissions = res.permissions
            } else {
              //如果角色列表为空
              this.roles = ['ROLE_DEFAULT']
            }
            this.id = user.userId
            this.name = user.loginName
            this.userName = user.userName
            this.avatar = avatar
            resolve(res)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
  },
})

export default useUserStore
