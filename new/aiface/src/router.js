import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/login/login.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/systemSetting/camera',
      name: 'systemCamera',
      component: () => import('@/views/systemSetting/camera.vue'),
    },
    {
      path: '/systemSetting/role',
      name: 'systemRole',
      component: () => import('@/views/systemSetting/role.vue'),
    },
    {
      path: '/systemSetting/user',
      name: 'systemUser',
      component: () => import('@/views/systemSetting/user.vue'),
    },
    {
      path: '/systemSetting/info',
      name: 'systemInfo',
      component: () => import('@/views/systemSetting/info.vue'),
    },
    {
      path: '/staticCompare/searching',
      name: 'scSearching',
      component: () => import('@/views/staticCompare/searching.vue'),
    },
    {
      path: '/staticCompare/verify',
      name: 'scVerify',
      component: () => import('@/views/staticCompare/verify.vue'),
    },
    {
      path: '/staticCompare/snap',
      name: 'scSnap',
      component: () => import('@/views/staticCompare/snap.vue'),
    },
    {
      path:'/control/task',
      name:'controlTask',
      component:  () => import('@/views/control/task.vue'),
    },
    {
      path:'/control/target',
      name:'controlTarget',
      component:  () => import('@/views/control/target.vue'),
    },
    {
      path:'/control/addTarget',
      name:'controlAddTarget',
      component:  () => import('@/views/control/addTarget.vue'),
    },
    {
      path:'/control/main',
      name:'controlMain',
      component:  () => import('@/views/control/main.vue'),
    },
    {
      path:'/control/alarmrecords',
      name:'controlAlarmrecords',
      component:  () => import('@/views/control/alarmrecords.vue'),
    },
    {
      path:'/control/capturerecords',
      name:'controlCapturerecords',
      component:  () => import('@/views/control/capturerecords.vue'),
    },
  ]
})
