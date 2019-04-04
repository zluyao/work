<template>
  <div class="login-box">
    <p class="login-word">手机号登录/注册</p>
    <div class="phone-box">
      <input type="tel"
             maxlength="11"
             ref="phone"
             v-model="phoneVal"
             @focus="phoneFoucs"
             @blur="phoneBlur"
             @input="phoneChange"
             class="phone">
      <i @click="clearPhoneVal"
         v-if="isFocus&&phoneVal"
         class="iconfont icon-toubaolurutoubaorenxinxi-baocuo1 clear-btn"></i>
    </div>
    <div class="getcode-btn "
         @click="getCode"
         :class="{'getcode-btn2':canGet}">获取短信验证码</div>
    <img class="bg-img"
         id="bgimg"
         ref="bgimg"
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
      phoneVal: '',
      canGet: false,
      isFocus: false,
      backUrl: '',
    }
  },
  created() {
    this.backUrl = common.getUrlParam('backUrl');

    this.$nextTick(() => {
      this.setImgTop();
    })
  },
  methods: {
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
    getCode() {
      if (!this.canGet) {
        return;
      }
      common.http.get('/api/secret/user/v1/sendVerifyCode', {
        phoneNum: this.phoneVal,
      }).then((res) => {
        window.location.href = `./logincode.html?phone=${this.phoneVal}&backUrl=${this.backUrl}`;
      })

    },
    phoneChange() {
      let obj = common.rules.checkphone(this.phoneVal);
      if (obj.v) {
        this.canGet = true;
      } else {
        this.canGet = false;
      }
    },
    phoneFoucs() {
      this.isFocus = true;
    },
    phoneBlur() {
      this.isFocus = false;
    },
    clearPhoneVal() {
      this.phoneVal = '';
      this.$refs.phone.focus();
      this.phoneChange();
    },
  },
  components: {
  },
}
</script>
<style scoped lang="less">
.login-box {
  padding-top: 1rem;
  background: #fff;
  // height: 100%;
  position: relative;
}
.bg-img {
  width: 100%;
  height: 6.52rem;
  position: fixed;
  left: 0;
  right: 0;
  z-index: -1;
}
.getcode-btn {
  position: relative;
  z-index: 100;
  height: 0.9rem;
  width: 6.3rem;
  color: #fff;
  text-align: center;
  line-height: 0.9rem;
  font-size: 0.36rem;
  margin: auto;
  background: rgba(255, 190, 176, 1);
  border-radius: 0.45rem;
}
.getcode-btn2 {
  background: rgba(255, 113, 83, 1);
  box-shadow: 0px 12px 20px 0px rgba(255, 113, 83, 0.5);
}
.phone-box {
  height: 0.6rem;
  padding-left: 0.8rem;
  padding-right: 0.9rem;
  margin-bottom: 1rem;
  position: relative;
  .phone {
    width: 100%;
    height: 0.6rem;
    padding-bottom: 0.16rem;
    font-size: 0.32rem;
    color: #000;
    padding-right: 0.2rem;
    border-bottom: 1px solid #e8e8e8;
  }
  .clear-btn {
    position: absolute;
    font-size: 0.3rem;
    color: #bdbdbd;
    right: 0.92rem;
    bottom: 0.2rem;
  }
}
.login-word {
  height: 0.6rem;
  line-height: 0.6rem;
  font-size: 0.44rem;
  color: #000;
  font-weight: 700;
  padding-left: 0.8rem;
  margin-bottom: 1.32rem;
}
</style>
