<template>
  <div class="smallshop-box">
    <div class="ssname-box">
      {{shopDetail.shopName}}
      <img class="icon1 icon"
           @click="toUrl(shopDetail.leftIconUrl)"
           v-if="shopDetail.leftIcon"
           :src="shopDetail.leftIcon"
           alt="">
      <img class="icon2 icon"
           @click="toUrl(shopDetail.rightIconUrl)"
           v-if="shopDetail.rightIcon"
           :src="shopDetail.rightIcon"
           alt="">
    </div>
    <div class="banner-box">
      <div class="b-bg-box">
        <img class="b-bg"
             src="../../assets/images/ss_bg.png"
             alt="">
      </div>
      <section class="img-box swiper">
        <swiper :options="swiperOption">
          <swiper-slide class="swp-silde"
                        v-for="(slide, key) in swiperList"
                        :key="key"
                        data-id="slide.id"><img @click="bannerClick(slide)"
                 class="swp-img"
                 :src="slide.banner"
                 alt=""></swiper-slide>
          <div class="swiper-pagination"
               slot="pagination"></div>
        </swiper>
      </section>
    </div>

    <div class="tglist-box">
      <ul class="tags-box">
        <li v-for="(item,index) in shopServiceList"
            @click="serveClick(item.serviceId)"
            v-if="item.isOpen">
          <img :src="item.dictImg"
               alt="">
          <span class="service-name">{{item.serviceName}}</span>
        </li>

      </ul>
    </div>

    <div class="gray-line"></div>
    <div class="aa">
      <div class="fwlist-box">
        <ul class="fws-box">
          <li :class="{'active':!classifyId}"
              @click="toggleTabs('')">全部</li>
          <li v-for="(item,index) in classifyList"
              :key="index"
              :class="{'active':classifyId==item.id}"
              @click="toggleTabs(item.id)">{{item.classifyName}}</li>
        </ul>

      </div>
      <img class="right-mask"
           src="../../assets/images/tm.png"
           alt="">
    </div>

    <ul class="productlist-box"
        v-if="proList.length">
      <li v-for="(item,index) in proList"
          @click="productClick(item)"
          :key="index">
        <div class="pro-img">
          <img :src="item.banner"
               alt="">
        </div>
        <p class="pro-title ellipsis">{{item.productName}}</p>
        <p class="pro-content ">
          {{item.summary}}
        </p>
        <p class="pro-price">
          ￥{{item.price}}起
        </p>
        <img class="to-prohref"
             src="../../assets/images/ss_arrow.png"
             alt="">
      </li>
    </ul>

    <div class="pro-empty"
         v-if="!proList.length"><img src="../../assets/images/empty.png"
           alt=""></div>
  </div>
</template>

<script>
import common from '@lib/common';
import Vue from 'vue';
import 'swiper/dist/css/swiper.css';
import { swiper, swiperSlide } from 'vue-awesome-swiper';

import wx from 'weixin-js-sdk';
const ua = navigator.userAgent;
const isWeixin = /MicroMessenger/i.test(ua);

export default {
  name: 'smallshop',
  data() {
    return {
      swiperOption: {
        pagination: { el: '.swiper-pagination' },
        autoplay: {
          disableOnInteraction: false, // 用户操作swiper之后，是否禁止autoplay
          delay: 3000, // 自动切换的时间间隔（单位ms）
        },
      },
      swiperList: [],
      classifyList: [],
      shopServiceList: [],
      shopDetail: {},
      proList: [
      ],
      classifyId: '',
      shopId: '',
      userId: '',
      ip: '',
      uuid: '',

      isShowfw: false,
      origin: '',
      //share
      title: '',
      desc: '',
      imgUrl: '',
    }
  },
  components: {
    swiper,
    swiperSlide,
  },
  async created() {
    this.$nextTick(() => {
      this.ip = returnCitySN.cip;
    })

    this.origin = location.origin;
    this.shopId = common.getUrlParam('id') ? common.getUrlParam('id') : 15;
    this.userId = common.getUrlParam('userId') ? common.getUrlParam('userId') : 1;

    if (localStorage.getItem('uuid')) {
      this.uuid = localStorage.getItem('uuid');
    } else {
      this.getUuid();
    }

    this.getProList();
    await this.getShopDetail();
    this.setShare();
  },
  methods: {
    getUuid() {
      common.http.get('/api/secret/common/v1/tempVoucher').then((res) => {
        localStorage.setItem('uuid', res.data);
        this.uuid = res.data;
      })
    },
    bannerClick(slide) {
      const bannerId = slide.id;
      let that = this;
      Vue.http.jsonp("//data.helianhealth.com/api/activity/activity2Logjsonp.json", {
        params: {
          data_type: 'bannerClick',
          uuid: that.userId,
          active_id: that.uuid,
          regUserId: that.ip,
          common_id: that.shopId,
          ad_id: bannerId,
        },
        jsonp: 'callback',
        jsonpCallback: "callback",
      }).then(function (data) {
      }, function (err) {
      })
      if (slide.bannerUrl) {
        window.location.href = slide.bannerUrl;
      }
    },
    setShare() {
      if (isWeixin) {
        const that = this;
        wx.ready(function () {
          wx.onMenuShareAppMessage({
            title: that.title,
            desc: that.desc,
            imgUrl: that.imgUrl,
            success: function () {
            }
          });
          wx.onMenuShareTimeline({
            title: that.title,
            imgUrl: that.imgUrl,
            success: function () {
            }
          });
        });
      }
    },
    getShopDetail() {
      return common.http.get('/api/secret/shop/v1/shop', {
        shopId: this.shopId,
      }).then((res) => {
        this.shopDetail = res.data;
        this.swiperList = res.data.shopBannerList;
        this.classifyList = res.data.shopClassifyList;
        this.shopServiceList = res.data.shopServiceList;

        this.title = res.data.shareTitle;
        this.desc = res.data.shareRemark;
        this.imgUrl = res.data.shareIcon;
      })
    },
    getProList() {
      common.http.get('/api/secret/shop/v1/shopProduct', {
        shopId: this.shopId,
        classifyId: this.classifyId,
      }).then((res) => {
        this.proList = res.data;

      })
    },
    toggleTabs(id) {
      this.classifyId = id ? id : '';
      this.getProList();
    },
    toUrl(link) {
      if (link) {
        window.location.href = link;
      }
    },
    productClick(item) {
      console.log(item);
      let that = this;
      Vue.http.jsonp("//data.helianhealth.com/api/activity/activity2Logjsonp.json", {
        params: {
          data_type: 'productClick',
          uuid: that.userId,
          active_id: that.uuid,
          regUserId: that.ip,
          common_id: that.shopId,
          type_id: item.classifyId,
          page_name: item.id,
        },
        jsonp: 'callback',
        jsonpCallback: "callback",
      }).then(function (data) {
      }, function (err) {
      })
      if (item.link) {
        window.location.href = link;
      }
    },
    serveClick(id) {
      let that = this;
      Vue.http.jsonp("//data.helianhealth.com/api/activity/activity2Logjsonp.json", {
        params: {
          data_type: 'serveClick',
          uuid: that.userId,
          active_id: that.uuid,
          regUserId: that.ip,
          common_id: that.shopId,
          idfa: id,
        },
        jsonp: 'callback',
        jsonpCallback: "callback",
      }).then(function (data) {
      }, function (err) {
      })

      if (id == 86) {
        // 个人中心
        window.location.href = `${this.origin}/insurancemy/orderlist.html`;
      } else {
        // 保单管理
        window.location.href = `${this.origin}/insurancemy/index.html`;
      }
    },
  },
  components: {
  },
}
</script>
<style>
.swiper-pagination-fraction,
.swiper-pagination-custom,
.swiper-container-horizontal > .swiper-pagination-bullets {
  bottom: -2px;
  left: -2.2rem;
}
.swiper-container-horizontal
  > .swiper-pagination-bullets
  .swiper-pagination-bullet {
  margin: 0;
}
.swiper .swiper-pagination-bullet {
  border-radius: 0;
  width: 0.4rem;
  height: 4px;
  background: #fff;
  opacity: 0.5;
}
.swiper .swiper-pagination-bullet-active {
  background-color: #fff; /* 改变轮播图下方分页按钮颜色*/
  opacity: 1;
}
</style>
<style scoped lang="less">
.ssname-box {
  height: 0.88rem;
  line-height: 0.5rem;
  padding-left: 0.38rem;
  padding-top: 0.38rem;
  position: relative;
  font-size: 0.36rem;
  color: #333;
  font-weight: 700;
  margin-bottom: 0.38rem;
  .icon {
    position: absolute;
    width: 0.4rem;
    height: 0.4rem;
    top: 0.38rem;
  }
  .icon2 {
    right: 0.46rem;
  }
  .icon1 {
    right: 1.42rem;
  }
}
.banner-box {
  width: 6.9rem;
  height: 2.99rem;
  margin: auto;
  position: relative;
  .b-bg-box {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .img-box.swiper {
    position: relative;
    border-radius: 10px;
    overflow: hidden;
    z-index: 20;
    width: 6.7rem;
    height: 2.7rem;
    margin: auto;
    background: #fff;
    .swp-silde {
      height: 2.7rem;
    }
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.tglist-box {
  // height: 1.92rem;
  width: 100%;
  overflow: hidden;
  margin: 0 0 0.3rem;
  padding-left: 0.3rem;
  .tags-box {
    height: 100%;
    overflow: hidden;
    > li {
      float: left;
      height: 100%;
      margin-right: 0.02rem;
      position: relative;
      > img {
        width: 2.6rem;
        height: 1.62rem;
      }
      > .service-name {
        position: absolute;
        top: 0.46rem;
        left: 0.3rem;
        font-size: 0.3rem;
        font-weight: 700;
        color: #000;
      }
    }
  }
}
.gray-line {
  height: 0.2rem;
  background: #f3f3f3;
}

.aa {
  position: relative;
  height: 1.11rem;
  padding-top: 0.5rem;
  .right-mask {
    position: absolute;
    width: 0.29rem;
    height: 0.44rem;
    background: #eee;
    opacity: 0.5;
    z-index: 20;
    top: 0.5rem;
    right: 0;
  }
}

.fwlist-box {
  height: 0.59rem;
  width: 100%;
  overflow: hidden;
  .fws-box {
    height: 0.7rem;
    white-space: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    padding-left: 0.58rem;
    font-size: 0;
    &::after {
      content: "";
      width: 0;
      height: 0;
      clear: both;
    }
    > li {
      display: inline-block;
      position: relative;
      height: 0.61rem;
      line-height: 0.45rem;
      margin-right: 0.5rem;
      color: #888;
      font-size: 0.3rem;
    }
    > li.active {
      color: #333;
      font-size: 0.32rem;
      &::after {
        content: "";
        position: absolute;
        width: 74%;
        height: 0.06rem;
        bottom: 0.02rem;
        left: 13%;
        background: rgba(255, 87, 87, 1);
        border-radius: 0.12rem;
      }
    }
  }
}

// .fwlist-box {
//   height: 1.11rem;
//   width: 100%;
//   overflow-x: scroll;
//   overflow-y: hidden;
//   -webkit-overflow-scrolling: unset;

//   .fws-box {
//     height: 1.19rem;
//     white-space: nowrap;
//     z-index: 5;
//     padding-left: 0.58rem;
//     padding-top: 0.5rem;
//     font-size: 0;
//     &::after {
//       content: "";
//       width: 0;
//       height: 0;
//       clear: both;
//     }
//     > li {
//       display: inline-block;
//       position: relative;
//       height: 0.61rem;
//       line-height: 0.45rem;
//       margin-right: 0.5rem;
//       color: #888;
//       font-size: 0.3rem;
//     }
//     > li.active {
//       color: #333;
//       font-size: 0.32rem;
//       &::after {
//         content: "";
//         position: absolute;
//         width: 74%;
//         height: 0.06rem;
//         bottom: 0;
//         left: 13%;
//         background: rgba(255, 87, 87, 1);
//         border-radius: 0.12rem;
//       }
//     }
//   }
// }
.productlist-box {
  padding: 0 0.4rem 0.2rem 0.38rem;
  > li {
    height: 2.71rem;
    padding: 0.5rem 0 0.4rem 2.18rem;
    border-bottom: 1px solid #eee;
    position: relative;
    .pro-img {
      position: absolute;
      left: 0;
      top: 0.5rem;
      width: 1.78rem;
      height: 1.78rem;
      border-radius: 0.1rem;
      overflow: hidden;
      > img {
        width: 100%;
        height: 100%;
      }
    }
    > p {
    }
    .pro-title {
      color: #333;
      font-size: 0.34rem;
      line-height: 0.34rem;
      padding-right: 0.36rem;
      font-weight: 700;
    }
    .pro-content {
      height: 0.8rem;
      margin-top: 0.14rem;
      margin-bottom: 0.2rem;
      line-height: 0.4rem;
      color: #333;
      font-size: 0.28rem;
      padding-right: 0.36rem;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .pro-price {
      color: #ff5757;
      font-size: 0.3rem;
      font-weight: 700;
      line-height: 0.3rem;
    }
    .to-prohref {
      width: 0.19rem;
      height: 0.35rem;
      position: absolute;
      right: 0;
      top: 1.1rem;
    }
  }
}
.pro-empty {
  padding-top: 1.8rem;
  text-align: center;
  > img {
    width: 2.34rem;
    height: 1.56rem;
  }
}

// *{
//   overflow: hidden;
// }
</style>
