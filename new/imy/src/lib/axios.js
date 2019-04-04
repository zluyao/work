/**axios封装
 * 请求拦截、相应拦截、错误统一处理
 */
import Vue from 'vue';
import axios from 'axios';
import QS from 'qs';
import baseUrl from './baseurl';
import hintBox from '../components/hint.vue';

const MD5 = require('md5.js');
// 弹窗
const HintBoxs = Vue.extend(hintBox);
let AlertBox = {};
let hintinstance = new HintBoxs({
  el: document.createElement('div'),
});
AlertBox.hint = (message, time, callback) => {
  if (typeof time === 'function') {
    callback = time;
    time = 2500;
  }
  const options = {
    message: message || '提示',
    time: time ? time : 2500,
    callback: callback || null
  }

  if (!hintinstance.show) {
    for (let prop in options) {
      if (options.hasOwnProperty(prop)) {
        hintinstance[prop] = options[prop];
      }
    }
    document.body.appendChild(hintinstance.$el);

    Vue.nextTick(() => {
      hintinstance.show = true;
    });
  }
};

export const alertBox = AlertBox;

// axios.defaults.baseURL = '';

// 环境的切换
// if (process.env.NODE_ENV == 'development') {
//   axios.defaults.baseURL = 'http://test.local.helianhealth.com:9696/manager';
// } else if (process.env.NODE_ENV == 'test') {
//   axios.defaults.baseURL = '/test';
// } else if (process.env.NODE_ENV == 'production') {
//   axios.defaults.baseURL = 'http://10.20.0.56:8393/';
// }

// 请求超时时间
axios.defaults.timeout = 10000;

// post请求头
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
// axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'; //默认

// 请求拦截器
axios.interceptors.request.use(
  config => {

    // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
    // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断


    const voucher = localStorage.getItem('voucher');
    voucher && (config.headers.voucher = voucher);

    const isLogin = localStorage.getItem('isLogin');
    isLogin && (config.headers.token = isLogin);

    const timestamp = new Date().getTime();
    const str = `${timestamp}&wsxygnmrsb1120`;
    const sign = new MD5().update(str).digest('hex');
    config.headers.timestamp = timestamp;
    config.headers.sign = sign;

    return config;
  },
  error => {
    return Promise.error(error);
  })

// 响应拦截器
axios.interceptors.response.use(
  response => {
    // console.log('响应拦截1', response);
    if (response.status === 200) {
      if (!response.data.success) {
        console.log(response);
        AlertBox.hint(response.data.msg);
      } else {
        return Promise.resolve(response);
      }
    } else {
      return Promise.reject(response);
    }
  },
  // 服务器状态码不是200的情况    
  error => {
    // console.log('响应拦截2', error);
    AlertBox.hint('网络出错，请稍后再试');
    if (error.response.status) {
      // switch (error.response.status) {
      //   // 401: 未登录                
      //   // 未登录则跳转登录页面，并携带当前页面的路径                
      //   // 在登录成功后返回当前页面，这一步需要在登录页操作。                
      //   case 401:
      //     alert(111);
      //   case 403:
      //     alert(222);
      //     break;
      //   // 404请求不存在                
      //   case 404:
      //     alert(333);
      //     break;
      //   // 其他错误，直接抛出错误提示                
      //   default:
      //     alert(444);
      // }
      return Promise.reject(error.response);
    }
  }
);
/** 
 * get方法，对应get请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function get(url, params) {
  return new Promise((resolve, reject) => {

    let _ = { '_': new Date().getTime() };
    axios.get(url, {
      params: { ...params, ..._ }
    })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data)
      })
  });
}
/** 
 * post方法，对应post请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function post(url, params) {
  return new Promise((resolve, reject) => {
    // axios.post(url, QS.stringify(params))
    //   .then(res => {
    //     resolve(res.data);
    //   })
    //   .catch(err => {
    //     reject(err.data)
    //   })

    axios.post(url, params)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data)
      })
  });
}

