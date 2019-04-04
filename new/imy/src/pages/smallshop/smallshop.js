import Vue from 'vue'
import VueResource from 'vue-resource'
import App from './smallshop.vue'

import VueAwesomeSwiper from 'vue-awesome-swiper';

Vue.use(VueAwesomeSwiper);
Vue.use(VueResource);


new Vue({
    render: h => h(App),
  }).$mount('#app')
