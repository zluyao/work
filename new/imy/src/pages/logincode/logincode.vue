<template>
  <div class="login-box">
    <p class="login-word">输入验证码</p>
    <p class="phone-num"
       v-if="phoneVal">验证码已发送至 {{phoneVal.slice(0,3)}} {{phoneVal.slice(3,7)}} {{phoneVal.slice(7)}}</p>

    <input type="tel"
           maxlength="4"
           ref="hinput"
           @blur="hinputFocus"
           @input="changCode"
           class="hideninput">
    <div class="edit-box">
      <div class="edit-item"
           @click="clickItme(1)"
           :class="{'active':iv1!=='','line':focusIndex==1}">
        {{iv1}}
      </div>
      <div class="edit-item"
           @click="clickItme(2)"
           :class="{'active':iv2!=='','line':focusIndex==2}">
        {{iv2}}
      </div>
      <div class="edit-item"
           @click="clickItme(3)"
           :class="{'active':iv3!=='','line':focusIndex==3}">
        {{iv3}}
      </div>
      <div class="edit-item"
           @click="clickItme(4)"
           :class="{'active':iv4!=='','line':focusIndex==4}">
        {{iv4}}
      </div>

      <!-- <p class="warn-word">验证码错误，请重新输入</p> -->
    </div>
    <p class="regetcode"
       :class="{'regetcode2':canGetcode}"
       @click="regetCode">{{codeStr}}</p>
    <img class="bg-img"
         id="bgimg"
         src="../../assets/images/login-bg.png"
         alt="">
  </div>
</template>

<script>
import common from '@lib/common';
export default {
  name: 'login',
  data() {
    return {
      focusIndex: 1,
      hasvIndex: 0,
      code: '',
      iv1: '',
      iv2: '',
      iv3: '',
      iv4: '',
      phoneVal: '',
      focusNum: 0,
      codeStr: '',//59秒后重新获取验证码
      canGetcode: false,
      backUrl: '',
    }
  },
  created() {
    this.phoneVal = common.getUrlParam('phone');
    this.backUrl = common.getUrlParam('backUrl');

    this.countDown();
    this.$nextTick(() => {
      this.setImgTop();
      this.$refs.hinput.focus();
    })
  },
  methods: {
    clickItme(type) {

      if (this.focusIndex == type) {
        this.$refs.hinput.focus();
      }

      if (this.iv4 !== '') {

        this.$refs.hinput.focus();
      }
    },
    hinputFocus() {
      // if (!this.iv4) {
      //   this.$refs.hinput.focus();
      // }
    },
    changCode(v) {
      let value = v.target.value;
      let arr = value.split('');
      if (value.length == 0) {
        this.focusIndex = 1;
        this.iv1 = '';
        this.iv2 = '';
        this.iv3 = '';
        this.iv4 = '';
      } else if (value.length == 1) {
        this.focusIndex = 2;
        this.iv1 = arr[0];
        this.iv2 = '';
        this.iv3 = '';
        this.iv4 = '';
      } else if (value.length == 2) {
        this.focusIndex = 3;
        this.iv1 = arr[0];
        this.iv2 = arr[1];
        this.iv3 = '';
        this.iv4 = '';
      } else if (value.length == 3) {
        this.focusIndex = 4;
        this.iv1 = arr[0];
        this.iv2 = arr[1];
        this.iv3 = arr[2];
        this.iv4 = '';
      } else if (value.length == 4) {
        this.focusIndex = 0;
        this.iv1 = arr[0];
        this.iv2 = arr[1];
        this.iv3 = arr[2];
        this.iv4 = arr[3];
        this.loginTo(value);
      }
    },
    loginTo(code) {
      common.http.post('/api/secret/user/v1/loginIn', {
        phoneNum: this.phoneVal,
        code: code,
        openId: localStorage.getItem('openidinsurancemy'),
      }).then((res) => {

        localStorage.setItem('isLogin', res.data);
        window.location.replace(this.backUrl);
      })
    },
    setImgTop() {
      let screenHeight;
      if (window.innerHeight) {
        screenHeight = window.innerHeight;
      } else if ((document.body) && (document.body.clientHeight)) {
        screenHeight = document.body.clientHeight;
      }
      let bgimg = document.getElementById('bgimg');
      let d = screenHeight - bgimg.clientHeight;
      bgimg.style.cssText = 'top: ' + d + 'px';
    },
    countDown() {
      let n = 59;
      this.codeStr = `${n}秒后重新获取验证码`;
      this.canGetcode = false;
      const timer = setInterval(() => {
        n--;
        if (n == 0) {
          this.canGetcode = true;
          this.codeStr = '获取验证码';
          clearInterval(timer);
        } else {
          this.codeStr = `${n}秒后重新获取验证码`;
        }
      }, 1000)
    },
    regetCode() {
      if (this.canGetcode) {
        common.http.get('/api/secret/user/v1/sendVerifyCode', {
          phoneNum: this.phoneVal,
        }).then((res) => {
          this.countDown();
        })
      }
    },
  },
  components: {
  },
}
</script>
<style scoped lang="less">
.login-box {
  padding-top: 1.08rem;
  background: #fff;
  height: 100%;
}
.edit-box {
  height: 0.83rem;
  position: relative;
  z-index: 100;
  padding-left: 0.8rem;
  &::after {
    content: "";
    display: block;
    height: 0;
    clear: both;
  }
  .edit-item {
    position: relative;
    float: left;
    margin-right: 0.6rem;
    width: 1rem;
    height: 0.83rem;
    padding-bottom: 0.3rem;
    text-align: center;
    line-height: 0.52rem;
    color: #000;
    font-size: 0.4rem;
    border-bottom: 1px solid #e8e8e8;

    // > input {
    //   height: 0.82rem;
    //   padding-bottom: 0.3rem;
    //   width: 1rem;
    //   text-align: center;
    //   line-height: 0.52rem;
    //   color: #000;
    //   font-size: 0.4rem;
    //   border-bottom: 1px solid #e8e8e8;
    // }
    // > input.black-border {
    //   border-bottom: 1px solid #000;
    // }
  }
  .edit-item.active {
    border-bottom: 1px solid #000;
  }
  .line {
    &::after {
      content: "";
      position: absolute;
      width: 1px;
      height: 0.52rem;
      left: 0.49rem;
      top: 0;
      // background: #FF7153;
      z-index: 1000;
      animation: blink 1s infinite;
    }
  }
  .warn-word {
    position: absolute;
    z-index: 100;
    left: 0.8rem;
    bottom: -0.44rem;
    font-size: 0.24rem;
    line-height: 0.24rem;
    color: #ff7153;
  }
}
.regetcode {
  padding-left: 0.8rem;
  margin-top: 0.8rem;
  color: #bdbdbd;
  line-height: 0.24rem;
  font-size: 0.24rem;
  position: relative;
  z-index: 100;
}
.regetcode2 {
  color: #000;
}
.phone-num {
  padding-left: 0.8rem;
  margin-top: 0.28rem;
  margin-bottom: 0.66rem;
  height: 0.24rem;
  line-height: 0.24rem;
  font-size: 0.24rem;
  color: #000;
  position: relative;
  z-index: 100;
}
.bg-img {
  width: 100%;
  height: 6.52rem;
  position: fixed;
  left: 0;
  right: 0;
  z-index: 5;
}

.login-word {
  position: relative;
  z-index: 100;
  height: 0.6rem;
  line-height: 0.6rem;
  font-size: 0.44rem;
  color: #000;
  font-weight: 700;
  padding-left: 0.8rem;
}
.hideninput {
  position: absolute;
  top: -200px;
}
@keyframes blink {
  0% {
    background-color: white;
  }
  50% {
    background-color: #ff7153;
  }
  100% {
    background-color: white;
  }
}
</style>
