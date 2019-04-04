import Vue from 'vue'
import App from './claimone.vue'
import AwesomePicker from 'vue-awesome-picker';
Vue.use(AwesomePicker);

new Vue({
    render: h => h(App)
  }).$mount('#app')
