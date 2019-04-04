<template>
  <el-menu class="navbar"
           mode="horizontal">
    <hamburger :toggle-click="toggleSideBar"
               :is-active="sidebar.opened"
               class="hamburger-container" />
    <breadcrumb />

    <div class="loginout-img"
         @click="logout">
      <img src="../../../assets/images/logout.png"
           alt="">
    </div>
    <div class="userinfo-box">
      <img class="user-img" src="../../../assets/images/headpic.jpg" alt="">
      <!-- <div class="user-img"></div> -->
      <div class="user-name"
           >{{username}}</div>
    </div>
    

    <!-- <el-dropdown class="avatar-container"
                 trigger="click">
      <div class="avatar-wrapper">
        <img :src="avatar+'?imageView2/1/w/80/h/80'"
             class="user-avatar">
        <i class="el-icon-caret-bottom" />
      </div>
      

      <el-dropdown-menu slot="dropdown"
                        class="user-dropdown">
        <router-link class="inlineBlock"
                     to="/">
          <el-dropdown-item>
            Home
          </el-dropdown-item>
        </router-link>
        <el-dropdown-item divided>
          <span style="display:block;"
                @click="logout">LogOut</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown> -->
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { getToken, setToken, removeToken } from '@/utils/auth'
export default {
  data() {
    return {
      username: '',
    }
  },
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  created() {
    this.username = localStorage.getItem('username');
  },
  methods: {
   
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      removeToken();
      this.$router.push({ path: '/login' });
      // this.$store.dispatch('LogOut').then(() => {
      //   location.reload() // 为了重新实例化vue-router对象 避免bug

      // })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  top: 0;
  width: 100%;
  padding-left: 200px;
  position: fixed;
  z-index: 900;
  height: 56px;
  // margin-left: 200px;
  // line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 65px;
    height: 56px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      line-height: initial;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
  .loginout-img {
    width: 16px;
    height: 16px;
    position: absolute;
    right: 100px;
    top: 20px;
    line-height: unset;
    cursor: pointer;
    > img {
      width: 100%;
      height: 100%;
    }
  }
  .userinfo-box {
    height: 56px;
    line-height: 56px;
    min-width: 122px;
    position: absolute;
    padding-left: 42px;
    top: 0;
    right: 130px;
    > * {
      display: inline-block;
    }
    .user-img {
      cursor: pointer;
      position: absolute;
      left: 0;
      top: 15px;
      width: 26px;
      height: 26px;
      border-radius: 5px;
      background: #ff5757;
    }
    .user-name {
      cursor: pointer;
      color: #212326;
      font-size: 14px;
      font-weight: 700;
    }

    
  }
}
</style>

