<template>
  <div class="orderlistbox">
    <div class="head-box">
      <div class="user-pic-box">
        <img class="user-pic"
             v-if="portrait"
             :src="portrait"
             alt="">
      </div>

      <p class="user-name">{{nickName}}</p>
      <p class="user-num">{{total}}份订单</p>
      <img class="head-box-bg"
           src="../../assets/images/orderheadmask.png"
           alt="">
    </div>

    <div class="content-box">
      <div class="my-order">我的订单</div>
      <ul class="tabs"
          ref="anchorTitle">
        <li class="tab"
            :class="{'active':tabType==1}"
            @click="changeTab(1,tabType)">全部</li>
        <li class="tab"
            :class="{'active':tabType==2}"
            @click="changeTab(2,tabType)">待支付</li>
        <li class="tab"
            :class="{'active':tabType==3}"
            @click="changeTab(3,tabType)">待生效</li>
        <li class="tab"
            :class="{'active':tabType==4}"
            @click="changeTab(4,tabType)">退款/售后</li>
      </ul>

      <ul class="tabs2"
          v-if="isFixed">
        <li class="tab"
            :class="{'active':tabType==1}"
            @click="changeTab(1,tabType)">全部</li>
        <li class="tab"
            :class="{'active':tabType==2}"
            @click="changeTab(2,tabType)">待支付</li>
        <li class="tab"
            :class="{'active':tabType==3}"
            @click="changeTab(3,tabType)">待生效</li>
        <li class="tab"
            :class="{'active':tabType==4}"
            @click="changeTab(4,tabType)">退款/售后</li>
      </ul>

      <div class="inner-box">
        <div class="empty-box"
             v-if="!list||!list.length">
          <div class="empty-img">
            <img src="../../assets/images/empty.png"
                 alt="">
          </div>
          <p>您还暂时没有订单信息</p>
        </div>
        <ul class="list-box"
            v-if="list&&list.length">
          <li class="item"
              @click="toDetail(item)"
              v-for="(item,index) in list"
              :key="index">
            <img class="company-icon"
                 src="../../assets/images/bxgs_icon.png"
                 alt="">

            <img class="valid-icon"
                 v-if="item.billState==31"
                 src="../../assets/images/dsxicon.png"
                 alt="">
            <img class="valid-icon"
                 v-if="item.orderState==1"
                 src="../../assets/images/dzficon.png"
                 alt="">
            <img class="valid-icon"
                 v-if="item.billState==33||item.billState==30"
                 src="../../assets/images/valid.png"
                 alt="">
            <img class="valid-icon"
                 v-if="item.orderState!=1&&item.billState!=30&&item.billState!=31&&item.billState!=33"
                 src="../../assets/images/invalid.png"
                 alt="">

            <!-- <img class="valid-icon"
                 v-if="item.billState==35"
                 src="../../assets/images/invalid.png"
                 alt=""> -->
            <span class="item-status"
                  :class="{'item-status2':item.billState==33||item.billState==30}">{{item.stateStr}}</span>
            <p class="item-name">{{item.insureProduct}}</p>
            <p class="item-person">被保人：{{item.protectedUserName}}</p>
            <p class="item-time">投保时间：{{item.createDateStr}}</p>
            <p class="item-price"
               :class="{'item-price-hasbtn':item.orderState==1||item.billState==31}"
               v-if="item.orderState!=9">￥{{Number(item.insureOrderMoney).toFixed(2)}}</p>
            <p class="item-price item-price-notsx2"
               v-if="item.orderState==9">已退款￥{{Number(item.insureOrderMoney).toFixed(2)}}</p>
            <div class="action-btn action-btn3"
                 @click="toPay($event,item.payUrl)"
                 v-if="item.orderState==1">
              <div class="inner">立即支付<i class="iconfont icon-chanpintoubaojieshaoye-likegoumai"></i></div>
            </div>
            <div class="action-btn action-btn3"
                 @click="toTb($event,item.orderId)"
                 v-if="item.billState==31">
              <div class="inner">立即退保<i class="iconfont icon-chanpintoubaojieshaoye-likegoumai"></i></div>
            </div>
            <div class="action-btn action-btn2"
                 v-if="item.orderState==9">
              <div class="inner">已退保</div>
            </div>
          </li>
        </ul>
      </div>

      <div class="nomore"
           v-if="!hasMore&&pageNoAll>1">亲，你没有更多订单啦</div>
      <div class="pig-box"
           v-if="hasMore&&pageNoAll>1">
        <div class="pigpic">
          <img src="../../assets/images/pig.png"
               alt="">
        </div>
        <img class="pigicon"
             src="../../assets/images/pig-icon.png"
             alt="">
        <p class="pig-word">加载更多</p>
      </div>

    </div>
    <div class="tb-toastbox"
         v-if="showTbtoast">
      <div class="mask"></div>
      <div class="content">
        <img class="tbtoast-bg"
             src="../../assets/images/tbtoast_bg.png"
             alt="">
        <div class="close"
             @click="hideTbtoastbox">
          <i class="iconfont icon-toubaolurutoubaorenxinxi-baocuo1"></i>
        </div>
        <div class="top"></div>
        <div class="down">
          <p class="comfirstr">确认要退保吗</p>
          <p class="descstr">退保后保单失效</p>
          <div class="action-btn"
               @click="nowTb">确定</div>
        </div>
      </div>
    </div>

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
    this.titleOffsetTop = 0;
    this.titleHeight = 0;
    return {

      showTbtoast: false,
      tabType: 1,
      isFixed: false,
      titleOffsetTop: 0,
      titleHeight: 0,
      isFixed: false,
      headBdHeight: 0,
      bdNum: 0,
      openId: '',
      code: '',

      list: [],
      orderState: '',
      billState: '',
      pageNo: 1,
      pageSize: 6,
      total: '',
      pageNoAll: 0,
      type: 1,
      appId: '',
      orderIdtb: '',

      nickName: '',
      portrait: '',

      hasMore: false,
      canLoad: true,
      canLoadTab: true,
    };
  },
  components: {
  },
  methods: {

    hideTbtoastbox() {
      this.showTbtoast = false;
    },
    setOffset() {
      this.titleOffsetTop = this.$refs.anchorTitle.offsetTop;
      this.titleHeight = this.$refs.anchorTitle.clientHeight;
    },
    toTb(event, orderId) {
      event.stopPropagation();
      this.showTbtoast = true;
      this.orderIdtb = orderId
    },
    nowTb() {
      common.http.get('/api/secret/order/v1/surrender', {
        orderId: this.orderIdtb,
      }).then((res) => {
        this.list = [];
        this.pageNo = 1;
        this.getList();

        // this.list = [];
        // const i = this.pageNo;
        // for (let j = 1; j < i + 1; j++) {
        // }

        this.showTbtoast = false;
        common.MsgBox.hint('退保成功')
      })
    },
    toPay(event, url) {
      event.stopPropagation();
      window.location.href = url;
    },
    toDetail(item) {
      window.location.href = `./orderdetailreal.html?orderId=${item.orderId}`;
    },
    removeScroll() {
      window.removeEventListener('scroll', this.handleScroll);
    },
    handleScroll() {
      const that = this;
      const handleScrollReal = function () {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;
        if (scrollTop >= that.titleOffsetTop && !that.isFixed) {
          that.isFixed = true;
        } else if (scrollTop < that.titleOffsetTop && that.isFixed) {
          that.isFixed = false;
        }

        if (scrollTop !== 0 && scrollHeight > clientHeight && scrollTop >= scrollHeight - clientHeight) {
          if (!that.canLoad) {
            return;
          }
          that.canLoad = false;

          that.pageNo++;
          if (that.pageNo > that.pageNoAll) {
            that.hasMore = false;
            that.setOffset();

            that.canLoad = true;
          } else {

            that.hasMore = true;
            setTimeout(() => {
              that.getList(1);
            }, 1200)
          }
        }
      };
      _.debounce(handleScrollReal(), 300, true);
    },
    changeType(type) {
      this.pageNo = 1;
      this.list = [];
      this.getList();
    },
    changeTab(type, oldtype) {
      if (type == oldtype) {
        return
      }

      if (this.hasMore) {
        this.canLoadTab = false;
      }

      this.pageNo = 1;
      this.list = [];
      this.tabType = type;
      if (type == 1) {
        this.orderState = '';
        this.billState = '';
      } else if (type == 2) {
        this.orderState = 1;
        this.billState = '';
      } else if (type == 3) {
        this.orderState = '';
        this.billState = 31;
      } else if (type == 4) {
        this.orderState = '3,7,9';
        this.billState = 33;
      }
      this.getList();
    },
    getList(next) {

      if (!this.canLoadTab && next) {
        this.canLoadTab = true;
        return;
      }

      common.http.get('/api/secret/order/v1/orderList', {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        orderState: this.orderState,
        billState: this.billState,
      }).then((res) => {
        const arr = res.data ? res.data : [];

        this.list = this.list.concat(res.data);
        this.total = res.totalCount;
        this.pageNoAll = Math.ceil(this.total / 6);
        this.$nextTick(() => {
          this.setOffset()

          this.canLoad = true;
          this.hasMore = false;
        });
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

            this.getUsreInfo();
          }
        });
      }
    },
    goLogin() {
      const backUrl = window.location.href;
      window.location.replace(`./login.html?backUrl=${backUrl}`);
    },
    getUsreInfo() {
      common.http.get('/api/secret/user/v1/getLoginInfo').then((res) => {
        if (isWeixin) {
          this.nickName = res.data.nickName;
          this.portrait = res.data.portrait;
        } else {
          this.nickName = res.data.userName;
          this.portrait = require('../../assets/images/head_default.png');
        }
      })
    },
  },
  created() {

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
        this.getUsreInfo();
      }

    } else {
      //  this.getAuthor();
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
          this.getUsreInfo();
        }
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setOffset();
      window.addEventListener('scroll', this.handleScroll);
    });
  }
};
</script>

<style scoped lang="less">
.orderlistbox {
  padding-top: 2rem;
}
.head-box {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 2.48rem;
  z-index: -1;
  padding-left: 2.2rem;
  padding-top: 0.5rem;
  background: rgba(242, 242, 242, 1);
  box-shadow: 0px 8px 12px 0px rgba(0, 0, 0, 0.05);
  width: 100%;
  .user-pic-box {
    position: absolute;
    top: 0.4rem;
    left: 0.6rem;
    width: 1.2rem;
    height: 1.2rem;
    background: rgba(255, 255, 255, 1);
    border-radius: 0.08rem;
    border: 2px solid rgba(255, 255, 255, 1);
    > img {
      width: 100%;
      height: 100%;
    }
  }
  .user-name {
    height: 0.42rem;
    line-height: 0.42rem;
    font-size: 0.3rem;
    color: #333;
    margin-bottom: 0.16rem;
  }
  .user-num {
    width: 1.34rem;
    height: 0.36rem;
    line-height: 0.36rem;
    text-align: center;
    color: #666;
    font-size: 0.24rem;
    background: rgba(242, 242, 242, 1);
    border-radius: 0.2rem;
    border: 1px solid rgba(204, 204, 204, 1);
  }
  .head-box-bg {
    position: absolute;
    bottom: 0;
    right: 0;
    height: 1.86rem;
    width: 3.2rem;
  }
}

.content-box {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px -0.1rem 0.2rem 0px rgba(51, 51, 51, 0.05);
  border-radius: 0.4rem 0.4rem 0 0;
  .my-order {
    line-height: 0.6rem;
    padding: 0.4rem 0 0.06rem 0.6rem;
    font-size: 0.44rem;
    color: #333;
    font-weight: 700;
  }
  .tabs,
  .tabs2 {
    background: #fff;
    height: 0.88rem;
    padding-top: 0.34rem;
    padding-left: 0.6rem;
    &::after {
      content: "";
      height: 0;
      clear: both;
    }
    .tab {
      height: 0.54rem;
      line-height: 0.4rem;
      float: left;
      margin-right: 0.8rem;
      font-size: 0.28rem;
      color: #666;
      position: relative;
    }
    .tab.active {
      &::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 80%;
        height: 0.06rem;
        background: rgba(255, 87, 87, 1);
        border-radius: 0.12rem;
      }
    }
  }
  .tabs2 {
    position: fixed;
    z-index: 2500;
    top: 0;
    left: 0;
    right: 0;
    box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.05);
  }
}
.inner-box {
  margin-top: 0.54rem;
  padding-bottom: 0.34rem;
}
@keyframes pigmove {
  from {
    top: -0.4rem;
  }
  to {
    top: 0.1rem;
  }
}
.nomore {
  line-height: 0.36rem;
  font-size: 0.26rem;
  color: #999;
  text-align: center;
  padding: 0.2rem 0 0.4rem 0;
}
.pig-box {
  position: relative;
  .pigpic {
    height: 1.64rem;
    position: relative;
    z-index: 2000;
    text-align: center;
    > img {
      height: 1.64rem;
      width: 1.62rem;
    }
  }
  .pigicon {
    position: absolute;
    width: 0.4rem;
    height: 0.4rem;
    left: 50%;
    margin-left: -0.2rem;
    top: -0.4rem;

    animation-name: pigmove;
    animation-duration: 0.6s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }
  .pig-word {
    text-align: center;
    color: #999999;
    font-size: 0.28rem;
    padding-bottom: 0.46rem;
    line-height: 0.4rem;
  }
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
  padding: 0 0.4rem 0.4rem;
  .item {
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.05);
    border: 1px solid rgba(238, 238, 238, 1);
    border-radius: 0.2rem;
    background: #fff;
    position: relative;
    padding-left: 0.48rem;
    padding-top: 1rem;
    padding-bottom: 0.16rem;
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
    .item-status {
      height: 0.34rem;
      line-height: 0.34rem;
      font-size: 0.24rem;
      color: #999;
    }
    .item-status2 {
      color: #28c183;
    }
    .item-time {
      line-height: 0.34rem;
      font-size: 0.24rem;
      color: #999;
      padding-bottom: 0.5rem;
    }
    .item-price {
      position: absolute;
      bottom: 0.66rem;
      right: 0.4rem;
      color: #ff5757;
      font-size: 0.32rem;
      font-weight: 700;
    }
    .item-price-hasbtn {
      bottom: 0.56rem;
    }
    .item-price-notsx2 {
      color: #999;
      font-weight: 100;
      bottom: 0.56rem;
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
    .action-btn {
      width: 2rem;
      height: 0.6rem;
      text-align: center;

      background: linear-gradient(
        90deg,
        rgba(247, 127, 102, 1) 0%,
        rgba(255, 87, 87, 1) 100%
      );
      border-radius: 0.3rem;
      margin-bottom: 0.34rem;
      position: relative;
      .inner {
        position: absolute;
        font-size: 0.28rem;
        color: #fff;
        line-height: 0.6rem;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 100;
        > i {
          padding-left: 0.12rem;
          font-size: 0.16rem;
          vertical-align: middle;
        }
      }
      .inner2 {
      }
    }
    .action-btn2 {
      background: #fff;
      color: #ccc;
      border: 1px solid rgba(204, 204, 204, 1);
      .inner {
        color: #999;
      }
    }
    .action-btn3 {
      &::after {
        z-index: 10;
        content: "";
        position: absolute;
        top: 0.22rem;
        left: 0.2rem;
        width: 1.6rem;
        height: 0.48rem;
        background: linear-gradient(
          90deg,
          rgba(247, 127, 102, 1) 0%,
          rgba(255, 87, 87, 1) 100%
        );
        border-radius: 0.3rem;
        filter: blur(8px);
      }
    }
  }
}

.tb-toastbox {
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 3000;
  right: 0;
  .content {
    position: absolute;
    // background: rgba(252, 251, 250, 1);
    // box-shadow: 0px 20px 32px 0px rgba(63, 63, 63, 0.3);
    border-radius: 0.2rem;
    // border: 1px solid rgba(151, 151, 151, 1);
    top: 2.24rem;
    left: 1.4rem;
    width: 4.7rem;
    height: 5rem;
    .close {
      position: absolute;
      z-index: 10;
      bottom: -1.4rem;
      left: 1.96rem;
      width: 0.8rem;
      height: 0.8rem;
      border-radius: 50%;
      border: 1px solid #fff;
      text-align: center;
      > i {
        font-size: 0.26rem;
        line-height: 0.8rem;
        color: #fff;
      }
    }
    .tbtoast-bg {
      position: absolute;
      width: 4.06rem;
      height: 2.08rem;
      top: -0.34rem;
      left: 0.34rem;
      z-index: 5;
    }
    .top {
      border-radius: 0.2rem 0.2rem 0 0;
      height: 1.6rem;
      background: linear-gradient(
        65deg,
        rgba(247, 127, 102, 1) 0%,
        rgba(255, 87, 87, 1) 100%
      );
    }
    .down {
      height: 2.82rem;
      background: rgba(252, 251, 250, 1);
      // margin-top: 0.58rem;
      padding-top: 0.58rem;
      border-radius: 0 0 0.2rem 0.2rem;
      .comfirstr {
        line-height: 0.42rem;
        height: 0.42rem;
        font-size: 0.3rem;
        color: #333;
        text-align: center;
      }
      .descstr {
        line-height: 0.4rem;
        font-size: 0.24rem;
        color: #999;
        text-align: center;
        margin-top: 0.08rem;
        margin-bottom: 0.42rem;
      }
      .action-btn {
        width: 1.6rem;
        height: 0.6rem;
        line-height: 0.6rem;
        text-align: center;
        margin: auto;
        font-size: 0.28rem;
        color: #fff;
        background: linear-gradient(
          90deg,
          rgba(247, 127, 102, 1) 0%,
          rgba(255, 87, 87, 1) 100%
        );
        border-radius: 30px;
      }
    }
  }
  .mask {
    position: absolute;
    height: 100%;
    width: 100%;
    background: rgba(77, 77, 77, 0.9);
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
}
</style>

