<template>
  <div class="orderlist">
    <div class="head-box"
         ref="headBd">
      <p class="bd-title">{{bdType==1?'我的保单':'家庭保单'}}</p>
      <p class="bd-num">{{list?list.length:0}}份保单</p>
    </div>
    <div class="tab-box">
      <div class="tab-item fl "
           @click="changeType(1)"
           :class="{'tab-active':bdType==1}">我的保单</div>
      <div class="tab-item fl "
           @click="changeType(2)"
           :class="{'tab-active':bdType==2}">家庭保单</div>
    </div>
    <div class="tab-box2"
         v-if="isFixed">
      <div class="tab-item fl"
           :class="{'tab-active':bdType==1}"
           @click="changeType(1)">我的保单</div>
      <div class="tab-item fl "
           :class="{'tab-active':bdType==2}"
           @click="changeType(2)">家庭保单</div>
    </div>
    <div class="head-imgbox"
         style="opacity: 0.8;"
         ref="bgImg"
         id="bgimg">
      <img src="../../assets/images/head_bg.png"
           alt="">
    </div>
    <div class="empty-box"
         v-if="!list||!list.length">
      <div class="empty-img">
        <img src="../../assets/images/empty.png"
             alt="">
      </div>
      <p>您还暂时没有保单信息</p>
    </div>
    <ul class="list-box"
        v-if="list&&list.length">
      <li class="item"
          @click="toDetail(item.billId)"
          v-for="(item,index) in list"
          :key="index">
        <img class="company-icon"
             src="../../assets/images/bxgs_icon.png"
             alt="">
        <img class="left-icon"
             src="../../assets/images/list_head.png"
             alt="">
        <img class="valid-icon"
             v-if="item.billState!=35"
             src="../../assets/images/valid.png"
             alt="">
        <img class="valid-icon"
             v-if="item.billState==35"
             src="../../assets/images/invalid.png"
             alt="">
        <span class="item-status">{{item.billStateStr}}</span>
        <p class="item-name">{{item.insureProduct}}</p>
        <p class="item-person">被保人：{{item.protectedUserName}}</p>
        <p class="item-time">保障期限：{{item.insureBeginDateStr.replace(/-/g,'.')}}-{{item.insureEndDateStr}}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import common from '@lib/common';
import _ from 'underscore';
import { env } from '@lib/env';
const ua = navigator.userAgent;
const isWeixin = /MicroMessenger/i.test(ua);
export default {
  name: "orderlist",
  data() {
    return {
      isFixed: false,
      headBdHeight: 0,
      bdType: 1,
      bdNum: 0,
      list: [],
      openId: '',
      code: '',
      pageNo: 1,
      pageSize: 400,
      type: 1,
      appId: '',
    };
  },
  components: {
  },
  methods: {
    toDetail(id) {
      window.location.href = `./orderdetail.html?billId=${id}&type=${this.type}`;
    },
    handleScroll() {
      const that = this;
      const handleScrollReal = function () {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        if (scrollTop >= that.headBdHeight && !that.isFixed) {
          that.isFixed = true;
        } else if (scrollTop < that.headBdHeight && that.isFixed) {
          that.isFixed = false;
        }
        const opa = (that.headBdHeight - Number(scrollTop)) / that.headBdHeight;
        that.$refs.bgImg.style.opacity = opa;
      };
      _.debounce(handleScrollReal(), 300, true);
    },
    changeType(type) {
      this.bdType = type;
      this.type = type;
      this.pageNo = 1;
      this.getList();
    },
    getList() {
      common.http.get('/api/secret/bill/v1/billList', {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        // openId: this.openId,
        type: this.type,
      }).then((res) => {
        this.list = res.data;
      })
    },
    getAuthor() {
      const urlBack = encodeURIComponent(window.location.href);
      const code = common.getUrlParam('code');  // 正式  wxa267c5006937b0b9   wx66d66468ee4eecf1
      if (!code) {
        window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${this.appId}&redirect_uri=${urlBack}&response_type=code&scope=snsapi_base&state=123#wechat_redirect`
      } else {
        this.code = code;
        common.http.get('/api/secret/common/v1/getOpenId', {
          code: this.code
        }).then((res) => {
          this.openId = res.data;
          localStorage.setItem('openidinsurancemy', res.data);

          if (!localStorage.getItem('isLogin')) {
            this.goLogin();
          } else {
            this.getList();
          }
        });
      }
    },
    goLogin() {
      const backUrl = window.location.href;
      window.location.replace(`./login.html?backUrl=${backUrl}`);
    },
  },
  created() {

    if (localStorage.getItem('typefamily')) {
      this.type = Number(localStorage.getItem('typefamily'));
      this.bdType = this.type;
      localStorage.removeItem('typefamily');
    }

    let openidinsurance = '';
    if (env == 1) {
      openidinsurance = 'oB1K_0VXEtVOqlGDclOpr6EumoZk';
      localStorage.setItem('openidinsurancemy', openidinsurance);
    } else {
      openidinsurance = localStorage.getItem('openidinsurancemy');
    }

    if (env == 3) {
      this.appId = 'wxa267c5006937b0b9';
    } else {
      this.appId = 'wx66d66468ee4eecf1';
    }


    if (openidinsurance) {
      this.openId = openidinsurance;

      if (!localStorage.getItem('isLogin')) {
        this.goLogin();
      } else {
        this.getList();
      }

    } else {
      // this.getAuthor();
      if (isWeixin) {
        this.getAuthor();
      } else {
        localStorage.setItem('openidinsurancemy', '');
        openidinsurance = localStorage.getItem('openidinsurancemy');
        this.openId = openidinsurance;

        if (!localStorage.getItem('isLogin')) {
          this.goLogin();
        } else {
          this.getList();
        }
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.headBdHeight = this.$refs.headBd.clientHeight;
      window.addEventListener('scroll', this.handleScroll);
    });
  }
};
</script>

<style scoped lang="less">
.head-box {
  background: #f2f2f2;
  height: 1.6rem;
  padding: 0.36rem 0 0 0.4rem;
  .bd-title {
    height: 0.6rem;
    line-height: 0.6rem;
    color: #333;
    font-size: 0.44rem;
    font-weight: 900;
  }
  .bd-num {
    margin-top: 0.04rem;
    width: 1.34rem;
    height: 0.36rem;
    line-height: 0.36rem;
    color: #666;
    text-align: center;
    font-size: 0.24rem;
    border: 1px solid #ccc;
    border-radius: 0.18rem;
  }
}
.head-imgbox {
  position: absolute;
  z-index: 100;
  width: 3.32rem;
  height: 1.74rem;
  right: 0;
  top: 0.74rem;

  > img {
    width: 100%;
    height: 100%;
  }
}
.tab-box,
.tab-box2 {
  box-shadow: 0px 8px 12px 0px rgba(0, 0, 0, 0.05);
  background: #f2f2f2;
  height: 0.88rem;
  .tab-item {
    padding: 0.26rem 0 0;
    text-align: center;
    font-size: 0.3rem;
    line-height: 0.42rem;
    height: 100%;
    width: 2.02rem;
    color: #666;
  }
  .tab-active {
    color: #ff5757;
    position: relative;
    &::after {
      position: absolute;
      content: "";
      width: 0.48rem;
      height: 0.06rem;
      bottom: 0.02rem;
      left: 0.78rem;
      background: #ff5757;
    }
  }
}
.tab-box2 {
  position: fixed;
  z-index: 50;
  top: 0;
  left: 0;
  right: 0;
}

.empty-box {
  margin-top: 3.04rem;
  width: 100%;
  .empty-img {
    width: 2.34rem;
    height: 1.56rem;
    margin: auto;
    > img {
      width: 100%;
      height: 100%;
    }
  }
  > p {
    height: 0.36rem;
    line-height: 0.36rem;
    font-size: 0.26rem;
    color: #999;
    text-align: center;
    margin-top: 0.34rem;
  }
}
.list-box {
  padding: 0.4rem;
  .item {
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.05);
    border-radius: 0.2rem;
    height: 2.9rem;
    background: #fff;
    position: relative;
    padding-left: 0.48rem;
    padding-top: 1rem;
    margin-bottom: 0.3rem;
    .company-icon {
      position: absolute;
      top: 0.34rem;
      left: 0.48rem;
      height: 0.24rem;
    }
    .left-icon {
      position: absolute;
      top: 0.92rem;
      left: 0;
      height: 0.72rem;
      width: 0.26rem;
    }
    .item-name {
      height: 0.4rem;
      line-height: 0.4rem;
      font-size: 0.3rem;
      font-weight: 700;
      color: #333;
    }
    .item-person {
      height: 0.4rem;
      line-height: 0.4rem;
      font-size: 0.3rem;
      color: #333;
      margin: 0.1rem 0 0.24rem 0;
    }
    .item-time,
    .item-status {
      height: 0.34rem;
      line-height: 0.34rem;
      font-size: 0.24rem;
      color: #999;
    }
    .item-status {
      position: absolute;
      top: 0.2rem;
      right: 0.26rem;
    }
    .valid-icon {
      position: absolute;
      width: 0.5rem;
      height: 0.5rem;
      top: 0.13rem;
      right: -0.25rem;
    }
  }
}
</style>

