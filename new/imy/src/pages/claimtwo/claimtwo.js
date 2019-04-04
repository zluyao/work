import Vue from 'vue'
import App from './claimtwo.vue'
import 'jquery-weui/dist/lib/weui.css';
import 'jquery-weui/dist/css/jquery-weui.css';

import { Popup } from 'mint-ui';
  Vue.component(Popup.name, Popup);
import { Picker } from 'mint-ui';
import 'mint-ui/lib/style.css'
Vue.component(Picker.name, Picker);

new Vue({
    render: h => h(App)
  }).$mount('#app')
