// eslint-disable-next-line
import { UserLayout, ChangeLayout } from '@/layouts'

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: '/change',
        name: 'change',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Change')
      }
    ]
  },
  {
    path: '/chat',
    name: 'chat',
    component: () => import(/* webpackChunkName: "user" */ '@/views/chat/Conversation'),
    // component: () => import('@/views/chat/Chat'),
    // children: [
    //   {
    //     path: '/:conversation',
    //     name: 'conversation',
    //     component: () => import(/* webpackChunkName: "user" */ '@/views/chat/Conversation')
    //   }
    // ]
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }
  // {
  //   path: '/change',
  //   component: ChangeLayout,
  //   name: 'change',
  //   // component: () => import(/* webpackChunkName: "user" */ '@/views/user/Change')
  //   children: [
  //     {
  //       path: 'change',
  //       name: 'change',
  //       component: () => import(/* webpackChunkName: "user" */ '@/views/user/Change')
  //     }
  //   ]
  // }
]
