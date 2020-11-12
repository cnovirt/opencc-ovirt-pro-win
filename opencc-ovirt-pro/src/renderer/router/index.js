import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '*',
      redirect: '/',
    },
    {
      path: '/',
      name: 'login-page',
      component: require('@/components/LoginPage').default,
    },
    {
      path: '/seting',
      name: 'seting-page',
      component: require('@/components/SetingPage').default,
      children: [
        {
          path: 'center',
          component: require('@/components/SetingSubPage/center').default,
        },
        {
          path: 'sethosts',
          component: require('@/components/SetingSubPage/sethosts').default,
        },
        {
          path: 'network',
          component: require('@/components/SetingSubPage/network').default,
        },
        {
          path: 'about',
          component: require('@/components/SetingSubPage/about').default,
        },
      ],
    },
    {
      path: '/home',
      name: 'home-page',
      component: require('@/components/HomePage').default,
    },
  ],
})
