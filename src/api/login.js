import request from '@/utils/request.js'

// 注册方法
export function register(data) {
  return request({
    url: '/sys/auth/register',
    headers: {
      isToken: false,
    },
    method: 'post',
    data: data,
  })
}
//登录方法
export function login(data) {
  return request({
    url: '/sys/auth/login',
    headers: {
      isToken: false,
    },
    method: 'post',
    data: data,
  })
}

export function getInfo() {
  return request({
    url: '',
    method: 'get',
  })
}
