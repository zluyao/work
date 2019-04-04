<template>
  <div class="orderdetail"
       :class="{'orderdetail-x':isX}">
    <div class="head-box"
         :class="{'head-box2':isShowhistroy,'head-box-tb':statusList1.orderState==9||statusList1.billState==35||statusList1.billState==91}">

      <div class="big-picbg"
           v-if="statusList1.orderState!=9&&statusList1.orderState!=1&&statusList1.billState!=30&&statusList1.billState!=31&&statusList1.billState!=33">
        <img class="img-bg"
             src="../../assets/images/bdshz_bg.png"
             alt="">
      </div>
      <div class="big-picbg"
           v-if="statusList1.billState==30||statusList1.billState==31||statusList1.billState==33">
        <img class="img-bg"
             src="../../assets/images/bdyx_bg.png"
             alt="">
      </div>
      <div class="big-picbg"
           v-if="statusList1.orderState==1">
        <img class="img-bg"
             src="../../assets/images/bddzf_bg.png"
             alt="">
      </div>
      <div class="big-picbg"
           v-if="statusList1.orderState==9||statusList1.billState==35||statusList1.billState==91">
        <img class="img-bg"
             src="../../assets/images/bdytb_bg.png"
             alt="">
      </div>

      <div class="state-title">
        <b></b>
        <span class="state-title-word">{{statusList1.stateStr}}
          <img v-if="!isShowhistroy&&hasHistroy"
               @click="showMorehistroy"
               src="../../assets/images/downicon.png"
               alt="">
          <img v-if="isShowhistroy&&hasHistroy"
               @click="showMorehistroy"
               src="../../assets/images/upicon.png"
               alt="">
        </span>

      </div>
      <p class="state-time"
         :class="{'state-timetb':statusList1.orderState==9}"
         style="position: relative;z-index: 10;">{{statusList1.gmtCreate}}</p>

      <div class="state-histroy"
           v-if="isShowhistroy&&hasHistroy">
        <div class="histroy-title">
          <span>订单历史</span>
          <div class="line"></div>
        </div>
        <div class="his-item"
             v-for="(item,index) in statusList2"
             :key="index">
          <b></b>
          <span class="item-state">{{item.stateStr}}</span>
          <p class="item-time"
             :class="{'item-timetb':statusList1.orderState==9}">{{item.gmtCreate}}</p>
        </div>

      </div>
    </div>
    <div class="contain-box">
      <div class="con-title bottom-line">
        本产品由太平洋财险负责承保和理赔
        <img class="bd-company"
             src="../../assets/images/bxgs_icon.png"
             alt="">
      </div>

      <div class="itemc">
        <div class="info-name-box">
          订单详情
          <img src="../../assets/images/title_by.png"
               alt=""
               class="title-by">

          <img class="title-yd"
               src="../../assets/images/title_yd.png"
               alt="">
        </div>
        <div class="insuran-box">
          <p class="itemc-p"
             v-if="detail.insureBillNum">保单号：<span class="item-spancope">{{detail.insureBillNum}}</span></p>
          <p class="itemc-p">投保时间：<span>{{detail.createDateStr}}</span></p>
          <p class="itemc-p"
             v-if="statusList1.orderState!=1&&statusList1.orderState!=5">交费方式：<span>{{detail.payType}}支付</span></p>
          <p class="itemc-p itemc-p-last">价格：<span>{{detail.amountDecimal}}元</span></p>
          <span class="copy-btn"
                v-if="detail.insureBillNum&&isandroid"
                @click="copeBdh">复制</span>
          <textarea id="input">{{detail.insureBillNum}}</textarea>
        </div>
      </div>
      <div class="itemc">
        <div class="info-name-box">
          保障责任
          <img src="../../assets/images/title_by.png"
               alt=""
               class="title-by">

          <img class="title-yd"
               src="../../assets/images/title_yd.png"
               alt="">
        </div>
        <div class="tab-content">

          <div class="xxwk-box">
            <div class="content-item"
                 :key="index"
                 v-for="(item,index) in objPricexxx">
              <span class="spl">{{item.responseName}}</span>
              <span class="spr">￥{{item.responseMoney}}</span>
            </div>
          </div>
        </div>
        <div class="tobzdetail itemc-href"
             @click="toBzdetail">查看保障详情<i class="iconfont iconfont-noticely icon-chanpintoubaojieshaoye-toubaoxuzhi-xiangqing"></i></div>
      </div>

      <div class="itemc">
        <div class="info-name-box info-name-box2">
          被保人
          <img src="../../assets/images/title_by.png"
               alt=""
               class="title-by">

          <img class="title-yd"
               src="../../assets/images/title_yd.png"
               alt="">
        </div>
        <div class="insuran-box">
          <p class="itemc-p">姓名：<span>{{detail.userVoList[0].protectedUserName}}</span></p>
          <p class="itemc-p">{{detail.userVoList[0].protectedCertificateTypeStr}}：<span>{{detail.userVoList[0].protectedCertificateNum}}</span></p>
          <p class="itemc-p itemc-p-last">与投保人关系：<span>{{detail.userVoList[0].insureRelationshipStr}}</span></p>
        </div>
      </div>

      <div class="itemc">
        <div class="info-name-box">
          电子保单
          <img src="../../assets/images/title_by.png"
               alt=""
               class="title-by">

          <img class="title-yd"
               src="../../assets/images/title_yd.png"
               alt="">
        </div>
        <div class="tobzdetail itemc-href"
             @click="showdiabox">
          获取电子保单
          <i class="iconfont iconfont-noticely icon-chanpintoubaojieshaoye-toubaoxuzhi-xiangqing"></i>
        </div>
        <div class="elecbd-box">
          <img class="dzbdmask"
               src="../../assets/images/dzbdmask.png"
               alt="">
          <div class="elecbd-inner"
               @click="toDzbd"
               :class="{'elecbd-innerno':!detail.insureUrl}">

            <img src="../../assets/images/hasdzzbd.png"
                 class="img"
                 v-if="detail.insureUrl"
                 alt="">
            <img src="../../assets/images/hasnodzzbd.png"
                 class="img"
                 v-if="!detail.insureUrl"
                 alt="">
            <i v-if="detail.insureUrl"
               class="iconfont icon-chanpintoubaojieshaoye-toubaoxuzhi-xiangqing"></i>
            <p class="pup">电子保单</p>
            <p class="pdown">{{!detail.insureUrl?'亲，功能调试中，您宽待':'内附条款'}}</p>
          </div>
        </div>
      </div>

    </div>
    <!-- <div class="footdetail">
      <div class="btn-back"
           @click="goBack">返回首页</div>
      <a class="btn-serve"
         href="tel:057156757519">拨打客服</a>
    </div> -->

    <div class="foot-btns"
         :class="{'foot-btns-x':isX}">
      <div class="btn-home"
           @click="toOrderlist">
        <img src="../../assets/images/homeicon.png"
             alt="">
        首页
      </div>
      <div class="btn-severice"
           @click="showKf">
        <img src="../../assets/images/iconcustomerservice.png"
             alt="">
        客服
      </div>
      <div v-if="statusList1.orderState==1"
           class="btn-paynow"
           @click="payNow">立即支付<i class="iconfont iconfont-noticely icon-chanpintoubaojieshaoye-toubaoxuzhi-xiangqing"></i></div>
      <div class="btn-sqlp"
           v-if="statusList1.billState==33"
           @click="toLp">申请理赔</div>
      <div class="btn-sqtb"
           @click="toTb"
           v-if="statusList1.billState==31">申请退保</div>
    </div>

    <div class="toast-box"
         v-if="showDia">
      <div class="toast-mask"></div>
      <div class="toast-content"
           :class="{'toast-content2':isMialFocus2}">
        <p class="title">发送邮箱获得以下资料</p>
        <div class="img">
          <img src="../../assets/images/hasdzzbd.png"
               alt="">
        </div>
        <p class="dzbd">电子保单</p>
        <p class="tk">内附条款</p>
        <div class="edit-box">
          <input type="text"
                 @focus="emailFb(1)"
                 @blur="emailFb(2)"
                 v-model="val"
                 placeholder="发送邮箱及时接收电子保单">
        </div>
        <div class="send-btn"
             @click="sendEmail">发送</div>
        <i class="iconfont icon-toubaolurutoubaorenxinxi-baocuo1 close-btn"
           @click="showDia=false"></i>
      </div>
    </div>

    <div class="tb-toastbox"
         v-if="showkftoast">
      <div class="mask"></div>
      <div class="content">
        <img class="tbtoast-bg"
             src="../../assets/images/kf_bg3.png"
             alt="">
        <div class="close"
             @click="hidekftoastbox">
          <i class="iconfont icon-toubaolurutoubaorenxinxi-baocuo1"></i>
        </div>
        <div class="top"></div>
        <div class="down">
          <a href="tel:057156757519">
            <img class="kfbgphone"
                 src="../../assets/images/kf_bgphone.png"
                 alt="">
          </a>
          <p class="p1">请拨打4000客服电话</p>
          <img class="kfbgwx"
               src="../../assets/images/kf_bgwx.png"
               alt="">
          <p class="p2">添加客服微信进行咨询</p>
          <img class="kfbgewm"
               src="../../assets/images/kf_bgewm.png"
               alt="">
        </div>
      </div>
    </div>

    <div class="tb-toastboxtb"
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
export default {
  name: "orderdetail",
  data() {
    return {
      val: '',
      showDia: false,
      detail: {
        userVoList: [{}],
      },

      mprice1: '',
      mprice2: '',
      sprice1: '',
      sprice2: '',

      objPricexxx: [],

      isMialFocus2: false,
      isShowhistroy: false,

      orderId: '',
      billId: '',
      hasHistroy: false,
      statusList1: {},
      statusList2: [],
      isX: false,
      showkftoast: false,
      showTbtoast: false,

      isandroid: false,
    };
  },
  methods: {
    showKf() {
      this.showkftoast = true;
    },
    hidekftoastbox() {
      this.showkftoast = false;
    },
    isAndroid() {
      let u = navigator.userAgent;
      let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if (!isIOS) {
        this.isandroid = true;
      } else {
        this.isandroid = false;
      }
    },
    isIPhoneX() {
      let u = navigator.userAgent;
      let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if (isIOS && screen.height == 812 && screen.width == 375) {
        this.isX = true;
      } else {
        this.isX = false;
      }
    },
    showMorehistroy() {
      this.isShowhistroy = !this.isShowhistroy
    },
    toOrderlist() {
      window.location.href = './orderlist.html';
    },
    payNow() {
      window.location.href = this.detail.payUrl;
    },
    toLp() {
      common.http.get('/api/secret/claim/v1/getClaiming', {
        billId: this.detail.billId,
      }).then((res) => {
        const claimId = res.data;
        localStorage.setItem('insureSchemeId', this.detail.insureSchemeId);
        window.location.href = `./claimone.html?billId=${this.detail.billId}&claimId=${claimId}`;
      })
    },
    hideTbtoastbox() {
      this.showTbtoast = false;
    },
    toTb() {
      console.log(111);
      this.showTbtoast = true;
    },
    nowTb() {
      common.http.get('/api/secret/order/v1/surrender', {
        orderId: this.orderId,
      }).then((res) => {
        this.showTbtoast = false;
        common.MsgBox.hint('退保成功')
        this.getDetail();
      })
    },
    copeBdh() {
      let input = document.getElementById("input");
      input.select();
      document.execCommand("copy");
      input.blur();
      common.MsgBox.hint('复制成功')
    },
    sendEmail() {
      if (!common.rules.checkemail(this.val).v) {
        common.MsgBox.hint(common.rules.checkemail(this.val).s);
      } else {
        common.http.post('/api/secret/order/v1/sendBillMail', {
          email: this.val,
          orderNum: this.detail.orderNum
        }).then((res) => {
          common.MsgBox.hint('发送成功')
          this.showDia = false;
        });

      }
    },
    emailFb(type) {
      let u = navigator.userAgent;
      let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
      if (!isAndroid) {
        return;
      }
      if (type == 1) {
        this.isMialFocus2 = true;
      } else {
        this.isMialFocus2 = false;
      }
    },
    showdiabox() {
      this.showDia = true;
    },
    toBzdetail() {
      window.location.href = `./noticedetail.html?type=10&insureProductId=${this.detail.insureProductId}`;
    },
    toDzbd() {
      if (!this.detail.insureUrl) {
        return;
      }
      // 测试..
      window.location.href = this.detail.insureUrl;
    },
    goBack() {
      if (WeixinJSBridge) {
        WeixinJSBridge.call('closeWindow');
      }
    },
    getDetail() {

      common.http.get('/api/secret/order/v1/orderDetail', {
        orderId: this.orderId,
      }).then((res) => {
        const stateVoList = res.data.stateVoList;
        if (stateVoList.length == 1) {
          this.hasHistroy = false;
          this.statusList1 = stateVoList[0];
          this.statusList2 = [];
        } else {
          this.hasHistroy = true;
          this.statusList1 = stateVoList[stateVoList.length - 1];
          this.statusList2 = stateVoList.slice(0, stateVoList.length - 1).reverse();
        }

        this.billId = res.data.billId;
        this.getDetail2();
      })
    },

    getDetail2() {
      common.http.get('/api/secret/bill/v1/billDetail', {
        billId: this.billId,
      }).then((res) => {
        this.detail = res.data;
        this.objPricexxx = JSON.parse(this.detail.response).resList;
      })
    },
    pushHistory() {
      var state = {
        title: "title",
        url: "#"
      };
      window.history.pushState(state, "title", "#");
    },
  },
  created() {
    this.isAndroid();
    this.isIPhoneX();

    this.orderId = common.getUrlParam('orderId');
    this.getDetail();
  },
};
</script>

<style scoped lang="less">
.orderdetail {
  padding-bottom: 0.98rem;
}

.orderdetail-x {
  padding-bottom: 1.32rem;
}

.head-box {
  min-height: 2.92rem;

  padding-top: 0.8rem;
  padding-left: 3.6rem;
  position: relative;
  background: linear-gradient(
    65deg,
    rgba(247, 127, 102, 1) 0%,
    rgba(255, 87, 87, 1) 100%
  );
  .state-title {
    height: 0.5rem;
    line-height: 0.5rem;
    padding-left: 0.46rem;
    font-size: 0.36rem;
    color: #fff;
    font-weight: 700;
    margin-bottom: 0.04rem;
    position: relative;
    .state-title-word {
      position: relative;
      > img {
        position: absolute;
        width: 0.22rem;
        height: 0.14rem;
        right: -0.42rem;
        top: 0.14rem;
      }
    }
    &::before {
      content: "";
      position: absolute;
      left: 0.08rem;
      top: 0.12rem;
      border-radius: 50%;
      width: 0.14rem;
      height: 0.14rem;
      border: 3px solid rgba(255, 255, 255, 1);
    }
  }
  .state-time {
    height: 0.4rem;
    line-height: 0.4rem;
    font-size: 0.26rem;
    color: #ffd4d4;
    padding-left: 0.46rem;
    margin-block-end: 0.26rem;
  }

  .state-timetb {
    color: #e5e3e3;
  }

  .state-histroy {
    .histroy-title {
      color: #fff;
      font-size: 0.26rem;
      height: 0.36rem;
      line-height: 0.36rem;
      position: relative;
      margin-bottom: 0.38rem;
      padding-left: 1.04rem;
      > span {
        position: absolute;
        height: 0.36rem;
        line-height: 0.36rem;
        z-index: 50;
        left: -0.06rem;
      }
      > .line {
        position: absolute;
        z-index: 20;
        // width: 100%;
        width: 2.84rem;
        height: 0.02rem;
        border-bottom: 1px dashed #fff;
        right: 0;
        top: 0.18rem;
      }
    }
    .his-item {
      height: 1.22rem;
      padding-left: 0.4rem;
      padding-bottom: 0.4rem;
      position: relative;
      > b {
        position: absolute;
        left: 0.4rem;
        top: 0.1rem;
        width: 0.14rem;
        height: 0.14rem;
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 1);
      }
      .item-state {
        padding-left: 0.28rem;
        height: 0.36rem;
        line-height: 0.36rem;
        font-size: 0.26rem;
        color: #fff;
        margin-bottom: 0.06rem;
      }
      .item-time {
        padding-left: 0.28rem;
        height: 0.4rem;
        line-height: 0.4rem;
        font-size: 0.26rem;
        color: #ffd4d4;
      }

      .item-timetb {
        color: #e5e3e3;
      }
    }
  }

  .big-picbg {
    position: absolute;
    height: 2.38rem;
    top: 0.5rem;
    left: 0;
    > img {
      height: 100%;
    }
  }
}
.head-box2 {
  min-height: 3.5rem;
  padding-bottom: 0.58rem;
}
.head-box-tb {
  background: linear-gradient(
    65deg,
    rgba(225, 212, 209, 1) 0%,
    rgba(197, 179, 179, 1) 100%
  );
}
.contain-box {
  position: relative;
  z-index: 15;
  top: -0.58rem;
  box-shadow: 0px -4px 8px 0px rgba(0, 0, 0, 0.05);
  border-radius: 0.2rem 0.2rem 0 0;
  overflow: hidden;
  .bottom-line {
    &::after {
      content: "";
      position: absolute;
      height: 1px;
      width: 7.1rem;
      background: #eee;
      bottom: 0;
      left: 0.2rem;
      right: 0.2rem;
    }
  }
  .con-title {
    height: 0.98rem;
    position: relative;
    background: #fff;
    padding-left: 0.56rem;
    padding-top: 0.4rem;
    font-size: 0.18rem;
    color: #999;
    .bd-company {
      position: absolute;
      right: 0.6rem;
      top: 0.36rem;
      height: 0.3rem;
    }
  }
  .itemc {
    padding-top: 0.4rem;
    position: relative;
    background: #fff;
    .tab-content {
      padding: 0.26rem 0.6rem 0.8rem 0.6rem;
      .myax-box {
        .mother-box {
          margin-bottom: 0.54rem;
        }
        .cont-item {
          height: 0.9rem;
          font-size: 0.28rem;
          > .item-left,
          .item-right {
            height: 0.9rem;
          }
          .item-left {
            line-height: 0.9rem;
            float: left;
            color: #333;
            font-weight: 700;
            padding-left: 0.7rem;
          }
          .item-left-mother {
            background: url("../../assets/images/mother_icon.png") 0 50%
              no-repeat;
            background-size: 0.44rem 0.44rem;
          }
          .item-left-son {
            background: url("../../assets/images/son_icon.png") 0 50% no-repeat;
            background-size: 0.44rem 0.44rem;
          }
          .item-right {
            color: #666;
            float: right;
            > p {
              line-height: 0.4rem;
              text-align: right;
              > span {
                color: #333;
                font-weight: 700;
              }
            }
            .p-up {
              margin-bottom: 0.1rem;
            }
          }
        }
      }
      .ptwk-box {
        .content-item {
          height: 0.36rem;
          line-height: 0.36rem;
          margin-bottom: 0.2rem;
          font-size: 0.26rem;
          .spl {
            float: left;
            height: 0.36rem;
            color: #666;
          }
          .spr {
            float: right;
            height: 0.36rem;
            color: #333;
          }
        }
      }
      .xxwk-box {
        .content-item {
          height: 0.36rem;
          line-height: 0.36rem;
          margin-bottom: 0.2rem;
          font-size: 0.26rem;
          .spl {
            float: left;
            height: 0.36rem;
            color: #666;
          }
          .spr {
            float: right;
            height: 0.36rem;
            color: #333;
          }
        }
      }
    }
    .itemc-href {
      position: absolute;
      right: 0.4rem;
      top: 0.6rem;
      height: 0.34rem;
      line-height: 0.34rem;
      font-size: 0.24rem;
      color: #999;
      > i {
        font-size: 0.1rem;
        margin-left: 0.12rem;
      }
    }
    .insuran-box {
      padding: 0.4rem 0 0.8rem 0.4rem;
      position: relative;
      #input {
        position: absolute;
        top: 1px;
        z-index: -200;
        background: transparent;
      }
      .copy-btn {
        position: absolute;
        right: 0.6rem;
        top: 0.3rem;
        width: 1rem;
        height: 0.6rem;
        line-height: 0.6rem;
        text-align: center;
        background: rgba(255, 87, 87, 0.1);
        border-radius: 0.3rem;
        font-size: 0.26rem;
        color: #ff5757;
      }
    }
    .itemc-p {
      color: #666;
      font-size: 0.28rem;
      height: 0.4rem;
      line-height: 0.4rem;
      margin-bottom: 0.2rem;
      > span {
        color: #333;
      }
    }
    .item-spancope {
      user-select: text;
    }
    .itemc-p-last {
      margin-bottom: 0;
    }
    .elecbd-box {
      padding: 0.16rem 0.4rem 0.28rem;
      position: relative;
      > .dzbdmask {
        // z-index: -1;
        position: absolute;
        width: 7.12rem;
        height: 2.06rem;
        left: 0.2rem;
        top: 0.3rem;
      }
      .elecbd-inner {
        width: 100%;
        height: 1.6rem;
        border-radius: 0.2rem;
        background: linear-gradient(
          67deg,
          rgba(250, 247, 246, 1) 0%,
          rgba(242, 235, 232, 1) 100%
        );
        padding-left: 1.44rem;
        padding-top: 0.42rem;
        position: relative;

        > .img {
          position: absolute;
          width: 0.8rem;
          height: 0.8rem;
          left: 0.4rem;
          top: 0.4rem;
        }
        > i {
          position: absolute;
          right: 0.4rem;
          top: 0.62rem;
          font-size: 0.3rem;
          color: #e1d7d1;
        }
        .pup {
          height: 0.4rem;
          line-height: 0.4rem;
          font-size: 0.3rem;
          color: #666;
          font-weight: 700;
        }
        .pdown {
          height: 0.4rem;
          line-height: 0.4rem;
          font-size: 0.24rem;
          color: #999;
        }
      }
      .elecbd-innerno {
        background: linear-gradient(
          67deg,
          rgba(244, 244, 244, 1) 0%,
          rgba(237, 234, 233, 1) 100%
        );
      }
    }
  }
  .itemcpt54 {
    padding-top: 0.4rem;
  }
}

.info-name-box {
  height: 0.72rem;
  line-height: 0.72rem;
  padding-left: 0.4rem;
  font-size: 0.34rem;
  color: #333;
  font-weight: 900;
  position: relative;
  .title-by {
    position: absolute;
    width: 0.36rem;
    height: 0.72rem;
    left: 0;
    top: 0;
  }
  .title-yd {
    position: absolute;
    width: 0.2rem;
    height: 0.2rem;
    left: 1.9rem;
    top: 0.27rem;
  }
}
.info-name-box2 {
  .title-yd {
    left: 1.56rem;
  }
}

.foot-btns {
  height: 0.98rem;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  .btn-home,
  .btn-severice {
    font-size: 0.26rem;
    color: #666;
    height: 0.98rem;
    top: 0;
    left: 0.4rem;
    padding-left: 0.52rem;
    line-height: 0.98rem;
    position: absolute;
    > img {
      position: absolute;
      width: 0.4rem;
      height: 0.36;
      top: 0.32rem;
      left: 0;
    }
  }
  .btn-severice {
    left: 1.68rem;
    > img {
      height: 0.4rem;
      position: absolute;
      top: 0.3rem;
      left: 0;
    }
  }
  .btn-paynow {
    position: absolute;
    right: 0.24rem;
    top: 0.12rem;
    line-height: 0.74rem;
    text-align: center;
    width: 3.6rem;
    height: 0.74rem;
    color: #fff;
    font-size: 0.3rem;
    background: linear-gradient(
      90deg,
      rgba(247, 127, 102, 1) 0%,
      rgba(255, 87, 87, 1) 100%
    );
    border-radius: 0.08rem;
    > i {
      vertical-align: middle;
      font-size: 0.16rem;
      padding-left: 0.08rem;
    }
  }
  .btn-sqlp,
  .btn-sqtb {
    position: absolute;
    top: 0.12rem;
    right: 0.24rem;
    font-size: 0.3rem;
    color: #cbafa4;
    width: 2rem;
    height: 0.74rem;
    line-height: 0.74rem;
    text-align: center;
    background: linear-gradient(
      67deg,
      rgba(250, 247, 246, 1) 0%,
      rgba(248, 241, 239, 1) 100%
    );
    border-radius: 0.08rem;
  }
  .btn-sqlp {
    // right: 2.44rem;
  }
}

.foot-btns-x {
  height: 1.32rem;
}

.toast-box {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: 3000;
  .toast-mask {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background: rgba(77, 77, 77, 0.9);
    z-index: -1;
  }
  .toast-content {
    position: relative;
    width: 6.3rem;
    height: 5.6rem;
    margin: 2.24rem auto 0;
    background: #fcfbfa;
    box-shadow: 0 0.2rem 0.32rem 0 rgba(63, 63, 63, 0.3);
    border-radius: 0.2rem;
    padding-top: 0.58rem;
    .title {
      height: 0.42rem;
      line-height: 0.42rem;
      text-align: center;
      font-size: 0.3rem;
      color: #333;
      margin-bottom: 0.12rem;
    }
    .img {
      width: 0.8rem;
      height: 0.8rem;
      margin: auto;
      > img {
        width: 100%;
        height: 100%;
      }
    }
    .dzbd {
      text-align: center;
      margin-top: 0.06rem;
      height: 0.4rem;
      line-height: 0.4rem;
      font-size: 0.28rem;
      color: #666;
      font-weight: 700;
    }
    .tk {
      height: 0.4rem;
      line-height: 0.4rem;
      font-size: 0.24rem;
      text-align: center;
      color: #999;
    }
    .edit-box {
      margin: 0.2rem auto 0.66rem;
      padding: 0.24rem 0.4rem;
      width: 5.6rem;
      height: 0.88rem;
      border: 2px solid #eee;
      border-radius: 0.44rem;
      > input {
        height: 0.4rem;
        line-height: 0.4rem;
        font-size: 0.28rem;
        color: #666;
        width: 100%;
      }
    }
    .send-btn {
      width: 1.6rem;
      height: 0.6rem;
      margin: auto;
      background: linear-gradient(
        90deg,
        rgba(247, 127, 102, 1) 0%,
        rgba(255, 87, 87, 1) 100%
      );
      border-radius: 0.3rem;
      line-height: 0.6rem;
      text-align: center;
      font-size: 0.28rem;
      color: #fff;
    }
    .close-btn {
      position: absolute;
      top: 0.4rem;
      right: 0.4rem;
      color: #ccc;
      font-size: 0.26rem;
    }
  }
  .toast-content2 {
    top: -2rem;
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
    top: 1.84rem;
    left: 1.4rem;
    width: 4.7rem;
    height: 6.96rem;
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
      width: 3.82rem;
      height: 2rem;
      top: -0.32rem;
      left: 0.5rem;
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
      border-radius: 0 0 0.2rem 0.2rem;
      text-align: center;
      height: 5.36rem;
      background: rgba(252, 251, 250, 1);
      padding-top: 0.25rem;
      .kfbgphone,
      .kfbgwx {
        width: 0.58rem;
        height: 0.58rem;
        margin-bottom: 0.08rem;
      }
      > p {
        height: 0.4rem;
        line-height: 0.4rem;
        text-align: center;
        font-size: 0.28rem;
        color: #333333;
      }
      .p1 {
        margin-bottom: 0.36rem;
      }
      .p2 {
        margin-bottom: 0.18rem;
      }
      .kfbgewm {
        width: 2rem;
        height: 2rem;
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

.tb-toastboxtb {
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
      background: #fff;
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
[v-cloak] {
  display: none !important;
}
</style>

