<template>
  <div class="login-container2">
    <div class="login-box">
      <div class="manage-icon">禾连保险</div>
      <div class="login-word">
        忘记密码
      </div>
      <el-form ref="loginForm"
               :model="loginForm"
               :rules="loginRules"
               class="login-form form-box"
               auto-complete="on"
               label-position="left">
        <el-form-item prop="username"
                      class="bf">
          <span class="svg-container svginput">
            <svg-icon icon-class="user" />
          </span>
          <el-input v-model="loginForm.username"
                    name="username"
                    type="text"
                    auto-complete="on"
                    placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item prop="code"
                      class="bf">
          <span class="svg-container svginput">
            <svg-icon icon-class="code" />
          </span>
          <div class="get-code"
               :class="{'get-code2':canGetcode}"
               @click="getCode">{{codeStr}}</div>
          <el-input v-model="loginForm.code"
                    auto-complete="on"
                    name="code"
                    type="text"
                    placeholder="请输入验证码" />
        </el-form-item>
        <el-form-item prop="password"
                      class="bf">
          <span class="svg-container svginput">
            <svg-icon icon-class="password" />
          </span>
          <span class="svg-container svginput2"
                @click="showPwd(1)">
            <svg-icon :icon-class="pwdType=='password'?'mimaunshow':'mimashow'" />
          </span>
          <el-input :type="pwdType"
                    v-model="loginForm.password"
                    name="password"
                    auto-complete="on"
                    placeholder="请输入6位数字密码" />
        </el-form-item>
        <el-form-item prop="comfirePassword"
                      class="bf">
          <span class="svg-container svginput">
            <svg-icon icon-class="password" />
          </span>
          <span class="svg-container svginput2"
                @click="showPwd(2)">
            <svg-icon :icon-class="pwdType2=='password'?'mimaunshow':'mimashow'" />
          </span>
          <el-input :type="pwdType2"
                    v-model="loginForm.comfirePassword"
                    name="password"
                    auto-complete="on"
                    placeholder="请确认密码" />
        </el-form-item>
        <div class="login-btn">
          <span class="to-register"
                @click="toLogin"><b>或已有账号，</b>&nbsp&nbsp登录</span>
          <span class="svg-container svg-login"
                @click="handleLogin">
            <svg-icon icon-class="login" />
          </span>
        </div>
      </el-form>

      <div class="login-bottom">
        Copyright © www.helianhealth.com, All Rights Reserved.
      </div>
    </div>
    <div class="login-bg1">
      <img src="../../assets/images/background1.png"
           alt="">
    </div>
    <div class="login-bg2">
      <img src="../../assets/images/background2.png"
           alt="">
    </div>
  </div>
</template>

<script>

import { isvalidUsername, isvalidUsername2, validatePass, validateCode, validatePass3 } from '@/utils/validate'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { mapMutations } from 'vuex';
import Layout from '@/views/layout/Layout'
export default {
  name: 'Register',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername2(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能小于6位'))
      } else {
        callback()
      }
    }
    const validateCode = (rule, value, callback) => {
      if (value.length < 4) {
        callback(new Error('验证码不能小于4位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: '',
        comfirePassword: '',
        code: '',
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }],
        comfirePassword: [{ required: true, trigger: 'blur', validator: validatePass }],
        code: [{ required: true, trigger: 'blur', validator: validateCode }],
      },
      loading: false,
      pwdType: 'password',
      pwdType2: 'password',
      redirect: undefined,
      codeStr: '获取验证码',
      canGetcode: true,
    }
  },
  watch: {
  },

  created() {

  },
  methods: {
    toLogin() {
      this.$router.push({ path: '/login' });
    },
    showPwd(type) {
      if (type == 1) {
        if (this.pwdType === 'password') {
          this.pwdType = ''
        } else {
          this.pwdType = 'password'
        }
      } else {
        if (this.pwdType2 === 'password') {
          this.pwdType2 = ''
        } else {
          this.pwdType2 = 'password'
        }
      }

    },
    getCode() {
      if (!this.canGetcode) {
        return
      }
      const reg = /^1(2|3|4|5|6|7|8)[0-9]{9}$/;
      if (!reg.test(this.loginForm.username)) {
        this.$message({
          type: 'error',
          message: '手机号码不正确',
        });
        return
      }
      this.$get(`${this.baseUrlh2}/jwt/isPhoneExist`, {
        phoneNum: this.loginForm.username,
      }).then((res) => {
        
        this.$get(`${this.baseUrlh3}/api/secret/user/v1/sendVerifyCode`, {
          phoneNum: this.loginForm.username,
        }).then((res) => {

          let n = 59;
          this.codeStr = `${n}秒后重新获取`;
          this.canGetcode = false;
          const timer = setInterval(() => {
            n--;
            if (n == 0) {
              this.canGetcode = true;
              this.codeStr = '获取验证码';
              clearInterval(timer);
            } else {
              this.codeStr = `${n}秒后重新获取`;
            }
          }, 1000)
        })
      })



    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          if (this.loginForm.password != this.loginForm.comfirePassword) {
            this.$message({
              type: 'error',
              message: '两次输入密码不一致',
            });
            return;
          }
          this.$post(`${this.baseUrlh2}/jwt/forget`, {
            username: this.loginForm.username,
            code: this.loginForm.code,
            password: this.loginForm.password,
            comfirePassword: this.loginForm.comfirePassword,
          }).then((res) => {
            this.$message({
              type: 'success',
              message: '密码修改成功，去登录',
            });
          })

        } else {
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss"  lang="scss">
$bg: #2d3a4b;
$light_gray: #eee;

/* reset element-ui css */
.login-container2 {
  .el-input {
    display: inline-block;
    height: 56px;
    width: 100%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      color: #000;
      padding: 0 50px 0 50px;
      height: 56px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px #fff inset !important;
        // -webkit-text-fill-color: #fff !important;
        // background: #fff !important;
      }
    }
  }
  .el-form-item {
    margin-bottom: 30px;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" >
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container2 {
  position: fixed;
  height: 100%;
  width: 100%;
  // background: #2d3a4b;
  background: linear-gradient(
    65deg,
    rgba(247, 127, 102, 1) 0%,
    rgba(255, 87, 87, 1) 100%
  );
  .login-box {
    height: 670px;
    width: 100%;
    position: absolute;
    z-index: 30;
    left: 0;
    top: 50%;
    margin-top: -335px;
    .login-btn {
      height: 56px;
      position: relative;
      .to-register {
        position: absolute;
        cursor: pointer;
        height: 56px;
        line-height: 56px;
        top: 0;
        left: 0;
        padding-left: 30px;
        font-size: 14px;
        color: #fff;
        > b {
          color: #ffb4b9;
        }
      }
      .el-form-item__content {
        height: 56px;
      }
      .el-button {
        border-radius: 0;
      }
    }
    .manage-icon {
      width: 70px;
      height: 70px;
      line-height: 70px;
      text-align: center;
      background: #fff;
      color: #000;
      margin: auto;
      border-radius: 50%;
    }
    .login-word {
      position: relative;
      height: 34px;
      width: 600px;
      margin: 90px auto 50px;
      padding-bottom: 14px;
      text-align: center;
      color: #eee;
      font-size: 16px;
      letter-spacing: 3px;
      &::after {
        content: "";
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 2px;
        background: rgba(238, 238, 238, 0.25);
      }
    }
    .login-form {
      width: 400px;
      // height: 260px;
      margin: 0 auto 30px;

      .svg-container.svginput {
        position: absolute;
        z-index: 2001;
        left: 25px;
        top: 8px;
      }
      .svg-container.svginput2 {
        cursor: pointer;
        position: absolute;
        z-index: 2001;
        right: 25px;
        top: 8px;
      }
      .login-btn {
        padding-left: 300px;
        .svg-login {
          display: block;
          width: 50px;
          height: 50px;
          padding-top: 11px;
          cursor: pointer;
          background: #fff;
          text-align: center;
          border-radius: 50%;
          > svg {
            width: 28px;
            height: 28px;
          }
        }
      }

      .bf {
        background: #fff;
        position: relative;
        .el-form-item__error {
          color: #000 !important;
        }
      }
      .get-code {
        width: 120px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        cursor: pointer;
        position: absolute;
        z-index: 100;
        top: 13px;
        right: 15px;
        font-size: 14px;
        color: #bbb;
        border: 1px solid #bbb;
      }
      .get-code2 {
        color: #212326;
        border: 1px solid #212326;
      }
    }
    .login-bottom {
      width: 600px;
      height: 40px;
      padding-top: 25px;
      text-align: center;
      color: #eee;
      font-size: 16px;
      margin: auto;
      position: relative;
      &::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background: rgba(238, 238, 238, 0.25);
      }
    }
  }
  // background-color: $bg;

  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .login-bg1 {
    width: 1178px;
    height: 478px;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 10;
  }
  .login-bg2 {
    width: 529px;
    height: 238px;
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 20;
  }
}
</style>
