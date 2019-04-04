<template>
  <div class="login-container">
    <div class="login-box">
      <div class="manage-icon">禾连保险</div>
      <div class="login-word">
        登录
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
                    placeholder="username" />
        </el-form-item>
        <el-form-item prop="password"
                      class="bf">
          <span class="svg-container svginput">
            <svg-icon icon-class="password" />
          </span>
          <el-input :type="pwdType"
                    v-model="loginForm.password"
                    name="password"
                    auto-complete="on"
                    placeholder="password"
                    @keyup.enter.native="handleLogin" />
        </el-form-item>
        <div class="login-btn">
          <span class="to-register"><span class="forget-password"
                  @click="toForgetpw">忘记密码</span><span class="register"
                  @click="toRegister">注册</span></span>
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
import { isvalidUsername } from '@/utils/validate'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { mapMutations } from 'vuex';
import Layout from '@/views/layout/Layout'
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码不能小于6位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }]
      },
      loading: false,
      pwdType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {

  },
  methods: {
    toRegister() {
      this.$router.push({ path: '/register' });
    },
    toForgetpw() {
      this.$router.push({ path: '/forgetpw' });
    },
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.$post(`${this.baseUrlh2}/jwt/token`, {
            username: this.loginForm.username,
            password: this.loginForm.password
          }).then((res) => {
            setToken(res.data);

            this.$get(`${this.baseUrlh}/user/front/getUser`).then((res) => {
              localStorage.setItem('username', res.data.username)
              localStorage.setItem('id', res.data.id)
              localStorage.setItem('roleType', res.data.type)


              this.$get(`${this.baseUrlh}/privilege/front/admin/v1/queryMenuByUser`).then((res) => {
                const arr = res.data;
                arr.forEach((item) => {
                  item.meta = {
                    title: item.title ? item.title : '',
                    icon: item.icon ? item.icon : '',
                  }
                  item.children.forEach((itemc) => {
                    itemc.meta = {
                      title: itemc.title ? itemc.title : '',
                    }
                  })
                })
                localStorage.setItem('menus', JSON.stringify(arr));

                this.$router.push({ path: this.redirect || '/' })
              })
            })

          })

        } else {
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg: #2d3a4b;
$light_gray: #eee;

/* reset element-ui css */
.login-container {
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
      padding: 0 50px 0 20px;
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

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
// .el-form-item__error {
//   color: #000 !important;
// }
.login-container {
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
        // padding-left: 30px;
        font-size: 14px;
        color: #fff;
        > b {
          color: #ffb4b9;
        }
        .forget-password,
        .register {
          cursor: pointer;
        }
        .forget-password {
          margin-right: 10px;
          padding-right: 10px;
          border-right: 1px solid #ffb4b9;
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
      height: 260px;
      margin: 0 auto 95px;

      .svg-container.svginput {
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
        .el-form-item__error {
          color: #000 !important;
        }
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
