!function (e) {
  var cl = null;
  function o() {
    var d = e.document, a = d.documentElement;
    var c = a.getBoundingClientRect().width > 750 ? 750 : a.getBoundingClientRect().width, b = c / (750 / 100);
    // a.style.fontSize = b + "px";
    a.style.cssText = "font-size: " + b + "px!important";
  }

  window.addEventListener("resize", () => {
    clearTimeout(cl), cl = setTimeout(o, 300);
  }, !1), o();

}(window);

import '@/assets/css/base.css';
import '@/assets/css/common.less';



import { get, post, alertBox } from './axios';
import SJ from 'scriptjs';
import wx from 'weixin-js-sdk';


const ua = navigator.userAgent;
const isWeixin = /MicroMessenger/i.test(ua);
let wLoca = window.location.href;

get('/api/secret/common/v1/tempVoucher').then((res) => {
  localStorage.setItem('voucher', res.data);
  if (isWeixin) {
    get('/api/secret/common/v1/getJsApiTicket', {
      url: wLoca
    }).then((res) => {
      wx.config(
        {
          debug: false,
          appId: res.data.appId,
          timestamp: res.data.timestamp,
          nonceStr: res.data.noncestr,
          signature: res.data.signature,
          jsApiList: [
            'checkJsApi',
            "scanQRCode",
            'hideMenuItems',
            'hideAllNonBaseMenuItem',
            'onMenuShareAppMessage',
            'onMenuShareTimeline',
          ],
        }
      )
      wx.ready(function () {
        // wx.hideAllNonBaseMenuItem();  // 原禁止分享等1

      });
    })

  } else {
    // 跳到提醒用微信浏览器页
  }

})



const common = {
  MsgBox: alertBox,
  http: {
    get,
    post,
  },
  rules: {
    checkphone(tel) {
      if (!tel) {
        return {
          v: false,
          s: '请录入手机号',
        };
      }
      const isPhone = /^1(2|3|4|5|6|7|8)[0-9]{9}$/;
      if (isPhone.test(tel)) {
        return {
          v: true,
          s: '',
        }
      } else {
        return {
          v: false,
          s: '请录入正确手机号',
        };
      }
    },
    checkname(v) {
      if (!v) {
        return {
          v: false,
          s: '请录入姓名',
        };
      }
      const isName = /^[a-zA-Z\u4e00-\u9fa5]{2,30}$/;
      if (isName.test(v)) {
        return {
          v: true,
          s: '',
        }
      } else {
        return {
          v: false,
          s: '请录入正确姓名',
        };
      }
    },
    checkcode1(IDCard) {
      if (!IDCard) {
        return {
          v: false,
          s: '请录入证件号',
        };
      }
      const isIDCard = /(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if (isIDCard.test(IDCard)) {
        return {
          v: true,
          s: '',
        }
      } else {
        return {
          v: false,
          s: '请录入正确证件号',
        };
      }
    },
    checkcode2(IDCard) {
      if (!IDCard) {
        return {
          v: false,
          s: '请录入证件号',
        };
      }
      const isIDCard = /^[0-9A-Za-z]{9}$/;
      if (isIDCard.test(IDCard)) {
        return {
          v: true,
          s: '',
        }
      } else {
        return {
          v: false,
          s: '请录入正确证件号',
        };
      }
    },
    checkcode3(IDCard) {
      if (!IDCard) {
        return {
          v: false,
          s: '请录入证件号',
        };
      }

      // return {
      //   v: true,
      //   s: '',
      // }
      const isIDCard = /^[A-Z]{1}\d{9}$/;
      if (isIDCard.test(IDCard)) {
        return {
          v: true,
          s: '',
        }
      } else {
        return {
          v: false,
          s: '请录入正确证件号',
        };
      }
    },
    checkbankcode(v) {
      if (!v) {
        return {
          v: false,
          s: '请输入银行卡号'
        };
      }
      const isEmail = /^([1-9]{1})(\d{14}|\d{18})$/g;
      if (isEmail.test(v)) {
        return {
          v: true,
          s: '',
        }
      } else {
        return {
          v: false,
          s: '您输入的银行卡号有误',
        }
      }
    },
    checkemail(v) {
      if (!v) {
        return {
          v: false,
          s: '请输入邮箱'
        };
      }
      const isEmail = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g;
      if (isEmail.test(v)) {
        return {
          v: true,
          s: '',
        }
      } else {
        return {
          v: false,
          s: '您输入的邮箱有误',
        }
      }
    }
  },
  getUrlParam(name) {
    if (name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return unescape(r[2]);
      return null;
    } else {
      var url = location.search;
      var theRequest = new Object();
      if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        if (str.indexOf("&") != -1) {
          let strs = str.split("&");
          for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
          }
        } else {
          theRequest[str.split("=")[0]] = unescape(str.split("=")[1]);
        }
      }
      return theRequest;
    }
  },
  fun: {
    debounce(func, delay) {
      let timer
      return function (...args) {
        if (timer) {
          clearTimeout(timer)
        }
        timer = setTimeout(() => {
          func.apply(this, args)
        }, delay)
      }
    }
  },
}
export default common;
