import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export let constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/register', component: () => import('@/views/register/index')},
  { path: '/forgetpw', component: () => import('@/views/forgetpw/index')},
  
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/home',
    meta: { title: '首页', icon: 'home' },
    children: [{
      path: 'home',
      name: '首页',
      component: () => import('@/views/home/index'),
      meta: { title: '首页', icon: '' }
    }]
  },
  {
    path: '/allquery',
    component: Layout,
    name: 'allquery',
    // redirect: '/allquery/allqueryindex',
    meta: { title: '订单管理', icon: 'search' },
    children: [
      {
        path: 'allqueryindex',
        name: 'allqueryindex',
        component: () => import('@/views/allquery/index'),
        meta: { title: '订单查询', icon: '' }
      }
    ]
  },

  {
    path: '/product',
    component: Layout,
    name: 'Product',
    meta: { title: '保险管理', icon: 'product' },
    children: [
      {
        path: 'insuranceconf',
        name: 'Insuranceconf',
        component: () => import('@/views/insuranceconf/index'),
        meta: { title: '险种管理', icon: '' }
      },
      {
        path: 'productconfig',
        name: 'Productconfig',
        component: () => import('@/views/productconfig/index'),
        meta: { title: '保险产品管理', icon: '' }
      },
    ]
  },
  {
    path: '/goodsm',
    component: Layout,
    name: 'Product',
    meta: { title: '商品管理', icon: 'product' },
    children: [
      {
        path: 'mygoods',
        name: 'mygoods',
        component: () => import('@/views/mygoods/index'),
        meta: { title: '我的商品', icon: '' }
      },
      {
        path: 'goodsstore',
        name: 'goodsstore',
        component: () => import('@/views/goodsstore/index'),
        meta: { title: '商品库', icon: '' }
      },
    ]
  },

  {
    path: '/popularize',
    component: Layout,
    name: 'popularize',
    meta: { title: '推广管理', icon: 'search' },
    children: [
      {
        path: 'popularizeindex',
        name: 'popularizeindex',
        component: () => import('@/views/popularize/index'),
        meta: { title: '微店模板', icon: '' }
      }
    ]
  },

  
  {
    path: '/setaccount',
    component: Layout,
    name: 'setaccount',
    meta: { title: '账户管理', icon: 'account' },
    children: [
      {
        path: 'certification',
        name: 'certification',
        component: () => import('@/views/certification/index'),
        meta: { title: '认证审核', icon: '' }
      },
      {
        path: 'setsubaccount',
        name: 'setsubaccount',
        component: () => import('@/views/setsubaccount/index'),
        meta: { title: '子账户管理', icon: '' }
      },
    ]
  },
  
  {
    path: '/setting',
    component: Layout,
    // redirect: '/setting/setdictionary',
    name: 'Setting',
    meta: { title: '配置管理', icon: 'setting' },
    children: [
      {
        path: 'setdictionary',
        name: 'setdictionary',
        component: () => import('@/views/setdictionary/index'),
        meta: { title: '字典配置', icon: '' }
      },
      {
        path: 'setclaim',
        name: 'setclaim',
        component: () => import('@/views/setclaim/index'),
        meta: { title: '理赔模板管理', icon: '' }
      }
    ]
  },

  {
    path: '/system',
    component: Layout,
    name: 'system',
    meta: { title: '系统设置', icon: 'setting' },
    children: [
      {
        path: 'systemsetmenu',
        name: 'systemsetmenu',
        component: () => import('@/views/systemsetmenu/index'),
        meta: { title: '菜单管理', icon: '' }
      },
      {
        path: 'systemsetauth',
        name: 'systemsetauth',
        component: () => import('@/views/systemsetauth/index'),
        meta: { title: '角色管理', icon: '' }
      }
    ]
  },
  

  // {
  //   path: '/nested',
  //   component: Layout,
  //   redirect: '/nested/menu1',
  //   name: 'Nested',
  //   meta: {
  //     title: 'Nested',
  //     icon: 'nested'
  //   },
  //   children: [
  //     {
  //       path: 'menu1',
  //       component: () => import('@/views/nested/menu1/index'), // Parent router-view
  //       name: 'Menu1',
  //       meta: { title: 'Menu1' },
  //       children: [
  //         {
  //           path: 'menu1-1',
  //           component: () => import('@/views/nested/menu1/menu1-1'),
  //           name: 'Menu1-1',
  //           meta: { title: 'Menu1-1' }
  //         },
  //         {
  //           path: 'menu1-2',
  //           component: () => import('@/views/nested/menu1/menu1-2'),
  //           name: 'Menu1-2',
  //           meta: { title: 'Menu1-2' },
  //           children: [
  //             {
  //               path: 'menu1-2-1',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
  //               name: 'Menu1-2-1',
  //               meta: { title: 'Menu1-2-1' }
  //             },
  //             {
  //               path: 'menu1-2-2',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
  //               name: 'Menu1-2-2',
  //               meta: { title: 'Menu1-2-2' }
  //             }
  //           ]
  //         },
  //         {
  //           path: 'menu1-3',
  //           component: () => import('@/views/nested/menu1/menu1-3'),
  //           name: 'Menu1-3',
  //           meta: { title: 'Menu1-3' }
  //         }
  //       ]
  //     },
  //     {
  //       path: 'menu2',
  //       component: () => import('@/views/nested/menu2/index'),
  //       meta: { title: 'menu2' }
  //     }
  //   ]
  // },

  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
