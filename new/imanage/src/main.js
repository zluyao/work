import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import '@/icons' // icon
import '@/permission' // permission control

import { get, post } from '@/utils/axios'

Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

Vue.prototype.$post = post;
Vue.prototype.$get = get;



// 本地
// Vue.prototype.baseUrls = 'http://10.20.1.175:8762';
// Vue.prototype.baseUrlh = 'http://10.20.1.175:8762';
// Vue.prototype.baseUrlh2 = 'http://10.20.1.175:9777';//登陆注册
// Vue.prototype.baseUrlupload = 'http://10.20.255.35:8085';
// Vue.prototype.baseUrlh3 = 'http://10.20.255.35:8081';//获取验证码

// 测试
Vue.prototype.baseUrls = 'http://10.20.255.35:8762';
Vue.prototype.baseUrlh = 'http://10.20.255.35:8762';
Vue.prototype.baseUrlh2 = 'http://10.20.255.35:9777';//登陆注册
Vue.prototype.baseUrlupload = 'http://10.20.255.35:8085'; // 上传
Vue.prototype.baseUrlh3 = 'http://10.20.255.35:8081';//获取验证码

// 线上
// Vue.prototype.baseUrls = 'http://admin.helianbaoxian.com';
// Vue.prototype.baseUrlh = 'http://admin.helianbaoxian.com';
// Vue.prototype.baseUrlh2 = 'http://auth.helianbaoxian.com'; //jwt登陆注册
// Vue.prototype.baseUrlh3 = 'http://web.helianbaoxian.com';
// Vue.prototype.baseUrlupload = 'http://upload.helianbaoxian.com';
