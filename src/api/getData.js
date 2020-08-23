import request from '@/utils/request'

// 获取期号
export function getQihao () {
  return request({
    url: '/qihao',
    method: 'get'
  })
}

// 存储用户投注
export function putUserDoubleBoll (params) {
  return request({
    url: '/userdoubleboll',
    method: 'put',
    data: params
  })
}

// 获取用户投注
export function getUserDoubleBoll () {
  return request({
    url: '/userdoubleboll',
    method: 'get'
  })
}

// 删除用户投注
export function deleteUserDoubleBoll (params) {
  return request({
    url: '/userdoubleboll',
    method: 'delete',
    data: params
  })
}

// 测试是否能访问google
export function getGoogle (params) {
  return request({
    url: 'https://www.google.com/',
    method: 'get',
    data: params
  })
}
