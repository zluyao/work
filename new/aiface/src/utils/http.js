import axios from 'axios'
import qs from 'qs'
import { Message, MessageBox } from 'element-ui';
import router from '@/router.js';

axios.defaults.timeout = 8000;
axios.defaults.baseURL = process.env.BASE_API
axios.defaults.withCredentials = true

axios.interceptors.request.use(config => {
    const nowToken = sessionStorage.getItem('aiFaceToken')
    if (nowToken) {
        config.headers['Token'] = nowToken // 让每个请求携带token
    }
    return config
}, error => {
    console.log("request请求错误", error) // for debug
    Promise.reject(error)
})

axios.interceptors.response.use(
    response => response,
    error => {
        if (JSON.stringify(error) === 'Error: Network Error') {
            this.$alert("网络连接已断开", '错误提示', {
                confirmButtonText: '确定',
                type: 'error',
                callback: action => { }
            })
        }
        let err = error.toString();
        if (err.indexOf('timeout') > 1) {
            Message({
                message: "请求超时",
                type: 'error',
                duration: 5 * 1000
            })
        } else {
            if (error.response.status === 401) {
                MessageBox.confirm('登录过期，请重新登录!', '温馨提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    router.push('/login')
                }).catch(()=>{
                    router.push('/login')
                })
            } else if (error.response.status === 500) {
                Message({
                    message: error.response.data.message,
                    type: 'error',
                    duration: 5 * 1000
                })
            } else if (error.response.status === 516) {
                // MessageBox.alert(error.response.data.message, '温馨提示', {
                //     confirmButtonText: '确定',
                //     callback: action => {
                //         console.log('xx')
                //     }
                // });
                Message({
                    message: error.response.data.message,
                    type: 'error',
                    duration: 5 * 1000
                })
            } else if (error.response.status === 504) {
                Message({
                    message: "网关超时，请联系管理员！",
                    type: 'error',
                    duration: 5 * 1000
                })
            }
        }
        return Promise.reject(error);
    })

/**
 * Content-Type: ['application/x-www-form-urlencoded', 'application/json;charset=UTF-8', 'multipart/form-data']
 */
export const post = (url, params = {}, configs = {}, customs = 'urlencoded') => {
    switch (customs) {
        case 'json':
            params = params
            break
        case 'form':
            params = formatToForm(params)
            break
        default:
            params = qs.stringify(params)
            break
    }
    return axios.post(url, params, configs)
}

export const get = (url, params = {}, configs = {}) => {
    const requestConfig = Object.assign({ params }, configs)
    return axios.get(url, requestConfig)
}

export const doDelete = (url, params = {}, customs = 'urlencoded') => {
    switch (customs) {
        case 'json':
            params = {data:params}
            break
        case 'form':
            params = {data:formatToForm(params)}
            break
        default:
            params = {data:qs.stringify(params)}
            break
    }
    return axios.delete(url, params)
}


function formatToForm (data) {
    const params = new FormData()

    for (let key in data) {
        params.append(key, data[key])
    }

    return params
}
