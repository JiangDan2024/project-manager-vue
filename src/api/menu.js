import request from '@/utils/request'

export const getRouters = () => {
  return request({
    url: '/sys/auth/getRoute',
    method: 'get',
  })
}
