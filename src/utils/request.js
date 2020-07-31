import axios from 'axios'
import { Message } from 'element-ui'
import { getToken, removeToken } from '@/utils/token'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  withCredentials: false,
  timeout: 10000
})

service.interceptors.request.use(
  config => {
    if (getToken()) {
      config.headers['Authorization'] = getToken()
    }
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

service.interceptors.response.use(

  response => {
    // console.log(response)
    const res = response.data

    if (response.status !==200 || res.errcode !== 0) {
      const code = res.errcode
      let msg = 'ajax error'
      if (res.errmsg) {
        msg = res.errmsg
      }
      if (code === 401) {
        msg = '身份验证失败，请重新登录'
        removeToken()
      } else if (code === 609) {
        msg = '登陆过期，请重新登录'
        removeToken()
      } else if (code === 500) {
        msg = '出错啦，请稍后访问'
      }
      return Promise.reject(new Error(msg))
    } else {
      if (response.config.method === 'post' || response.config.method === 'put' || response.config.method === 'delete') {
        if(response.config.tips !== 1) {
          // setTimeout用来修复element ui的模态框dialog关闭时会影响Message的位置的bug
          setTimeout(function() {
            Message({
              message: '操作成功',
              type: 'success',
              showClose: true,
              duration: 2 * 1000
            })
          }, 300)
        }
      }
      return res
    }
  },
  error => {
    console.log(error.toJSON())
    console.log(error.response)
    let msg = error.message
    let code
    if (error.response) {
      code = error.response.status
    }
    if (error.response && error.response.data && error.response.data.errmsg) {
      msg = error.response.data.errmsg
    }
    if (code === 401) {
      msg = '身份验证失败，请重新登录'
      removeToken()
    } else if (code === 609) {
      msg = '登陆过期，请重新登录'
      removeToken()
    } else if (code === 500) {
      msg = '出错啦，请稍后访问'
    }
    if (msg.indexOf('timeout') !== -1 && msg.indexOf('exceeded') !== -1) {
      msg = '网络不好，请检查网络'
    }
    Message({
      message: msg,
      type: 'error',
      showClose: true,
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
