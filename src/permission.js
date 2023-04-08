import router from './router'
import storage from 'store'
import NProgress from 'nprogress' // progress bar
import '@/components/NProgress/nprogress.less' // progress bar custom style
// import notification from 'ant-design-vue/es/notification'
import { ACCESS_TOKEN, ACCESS_TOKEN_USER } from '@/store/mutation-types'
import request from '@/utils/request'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const allowList = ['change', 'login', 'register', 'registerResult'] // no redirect allowList
const loginRoutePath = '/user/login'

router.beforeEach((to, from, next) => {
  const that = this
  NProgress.start() // start progress bar
  /* has token */
  const token = storage.get(ACCESS_TOKEN)
  if (token) {
    request({
      url: '/auth/validate',
      method: 'post'
    }).then((result) => {
      console.log('result', result)
      next()
    }).catch(error => {
      console.log('error', error)
      storage.remove(ACCESS_TOKEN)
      storage.remove(ACCESS_TOKEN_USER)
      next({ path: loginRoutePath })
      NProgress.done()
    })
  } else {
    if (allowList.includes(to.name)) {
      // 在免登录名单，直接进入
      next()
    } else {
      console.log("test: query")
      console.log(to.query)
      console.log(to.params)
      console.log("test: param")
      
      // const loginRoutePathWithUser = loginRoutePath + '?query1=' + JSON.stringify(to.query) + '&param1=' + JSON.stringify(to.params)
      next({ path: loginRoutePath })
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
