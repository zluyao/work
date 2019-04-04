// let baseUrl = "";// 设置请求地址
// switch (process.env.NODE_ENV) {
//   case 'development':
//     // baseUrl = "http://10.20.1.175:8081"
//     baseUrl = "http://10.20.255.35:8081"
//     break
//   case 'test':
//     // baseUrl = "http://10.20.2.91:8081"
//     baseUrl = "http://10.20.255.35:8081"
//     break
//   case 'production':
//     baseUrl = "http://10.20.255.35:8081"
//     // baseUrl = "http://118.178.239.2"
//     break
// }

import { env } from './env';
let baseUrl = '';// 设置请求地址
if (env == 1) {
  // baseUrl = 'http://10.20.1.175:8081'
  baseUrl = 'http://10.20.255.35:8081'
} else if (env == 2) {
  baseUrl = 'http://10.20.255.35:8081'
} else if (env == 3) {
  baseUrl = 'http://118.178.239.2'
}

export default baseUrl;
