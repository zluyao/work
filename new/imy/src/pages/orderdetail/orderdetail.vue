<template>
  <div class="orderdetail">
    <div class="head-box">
      <p class="bd-title break-word">{{detail.insureProduct}}</p>
      <p class="bd-warn break-word">本产品由{{detail.insureCompany}}负责承保和理赔</p>
      <img class="head-bg"
           src="../../assets/images/head_bg2.png"
           alt="">
    </div>
    <div class="mid-bac"></div>
    <div class="contain-box">
      <div class="con-title bottom-line">
        <img class="bd-company"
             src="../../assets/images/bxgs_icon.png"
             alt="">
        <span class="bd-statusword"
              v-if="detail.billState!=35">{{detail.billStateStr}}</span>
        <span class="bd-statusword2"
              v-if="detail.billState==35">{{detail.billStateStr}}</span>
        <img class="bd-statusimg"
             v-if="detail.billState!=35"
             src="../../assets/images/valid.png"
             alt="">
        <img class="bd-statusimg"
             v-if="detail.billState==35"
             src="../../assets/images/invalid.png"
             alt="">
      </div>
      <div class="baodan-num-box">
        <div class="baodan-num">
          <span class="num-icon">保单号</span>
          {{detail.insureBillNum?detail.insureBillNum:'-'}}
        </div>
      </div>
      <div class="itemc bottom-line itemcpt54">
        <div class="info-name-box">
          保障内容
          <img src="../../assets/images/title_by.png"
               alt=""
               class="title-by">

          <img class="title-yd"
               src="../../assets/images/title_yd.png"
               alt="">
        </div>
        <div class="tab-content">
          <div class="myax-box"
               v-if="isMyax">
            <div class="mother-box cont-item">
              <div class="item-left item-left-mother">孕产妇</div>
              <div class="item-right">
                <p class="p-up">身故/残疾保额：<span>￥{{mprice1}}</span></p>
                <p>并发症保额：<span>￥{{mprice2}}</span></p>
              </div>
            </div>
            <div class="cont-item">
              <div class="item-left item-left-son">胎儿/新生儿</div>
              <div class="item-right">
                <p class="p-up">身故/残疾保额：<span>￥{{sprice1}}</span></p>
                <p>并发症保额：<span>￥{{sprice2}}</span></p>
              </div>
            </div>
          </div>

          <div class="ptwk-box"
               v-if="isptwk">

            <div class="content-item"
                 :key="index"
                 v-for="(item,index) in objPriceptwk">
              <span class="spl">{{item.responseName}}</span>
              <span class="spr">￥{{item.responseMoney}}</span>
            </div>

          </div>
          <div class="xxwk-box"
               v-if="isxxwk">
            <div class="content-item"
                 :key="index"
                 v-for="(item,index) in objPricexxwk">
              <span class="spl">{{item.responseName}}</span>
              <span class="spr">￥{{item.responseMoney}}</span>
            </div>
          </div>

        </div>
        <div class="tobzdetail itemc-href"
             @click="toBzdetail">查看保障详情<i class="iconfont iconfont-noticely icon-chanpintoubaojieshaoye-toubaoxuzhi-xiangqing"></i></div>
      </div>

      <div class="itemc bottom-line">
        <div class="info-name-box info-name-box2">
          投保人
          <img src="../../assets/images/title_by.png"
               alt=""
               class="title-by">

          <img class="title-yd"
               src="../../assets/images/title_yd.png"
               alt="">
        </div>
        <div class="insuran-box">
          <p class="itemc-p">姓名：<span>{{detail.insureUserName}}</span></p>
          <p class="itemc-p">{{detail.insureCertificateType==1?'身份证':'护照'}}：<span>{{detail.insureCertificateNum}}</span></p>
          <p class="itemc-p itemc-p-last">手机号：<span>{{detail.phoneNum}}</span></p>
        </div>
      </div>

      <div class="itemc bottom-line">
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
    <div class="footdetail">
      <div class="btn-back"
           @click="goBack">返回首页</div>
      <a class="btn-serve"
         href="tel:057156757519">拨打客服</a>
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


      objPriceptwk: [],


      objPricexxwk: [],
      isMyax: false,
      isptwk: false,
      isxxwk: false,

      isMialFocus2: false,
    };
  },
  methods: {
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
      window.location.href = this.detail.insureUrl;
    },
    goBack() {
      if (WeixinJSBridge) {
        WeixinJSBridge.call('closeWindow');
      }
    },
    getDetail() {
      common.http.get('/api/secret/bill/v1/billDetail', {
        billId: this.billId,
      }).then((res) => {
        this.detail = res.data;
        if (this.detail.insureProductId == 20) {
          this.isMyax = true;
          if (this.detail.insureSchemeId == 31) {
            this.mprice1 = '20万';
            this.mprice2 = '3.8万';
            this.sprice1 = '3万';
            this.sprice2 = '7000';
          } else if (this.detail.insureSchemeId == 32) {
            this.mprice1 = '30万';
            this.mprice2 = '7.5万';
            this.sprice1 = '5万';
            this.sprice2 = '1.2万';
          }
        } else if (this.detail.insureProductId == 58) {
          this.isptwk = true;
          this.objPriceptwk = JSON.parse(this.detail.response).resList;


        } else if (this.detail.insureProductId == 49) {
          this.isxxwk = true;
          this.objPricexxwk = JSON.parse(this.detail.response).resList;

        }
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
    // this.pushHistory()
    // window.addEventListener("popstate", function (e) {
    //   window.location.href = 'https://m.baidu.com/?from=844b&vit=fps'
    // }, false);

    this.billId = common.getUrlParam('billId');
    const typefamily = common.getUrlParam('type');
    localStorage.setItem('typefamily', typefamily);
    this.getDetail();
  },
};
</script>

<style scoped lang="less">
.orderdetail {
  position: relative;
}
.mid-bac {
  position: absolute;
  z-index: 10;
  height: 0.42rem;
  width: 100%;
  left: 0;
  right: 0;
  top: 2.36rem;
  background: #f2f2f2;
}
.head-box {
  height: 2.36rem;
  background: #f2f2f2;
  padding: 0.52rem 0 0 0.4rem;
  position: relative;
  .bd-title {
    font-size: 0.3rem;
    font-weight: 900;
    color: #333;
    line-height: 0.42rem;
    margin-bottom: 0.2rem;
  }
  .bd-warn {
    color: #999;
    font-size: 0.24rem;
    line-height: 0.34rem;
  }
  .break-word {
    word-wrap: break-word;
    max-width: 3.65rem;
  }
  .head-bg {
    position: absolute;
    bottom: -0.42rem;
    right: 0;
    width: 2.9rem;
    height: 2.2rem;
    z-index: 5;
  }
}
.contain-box {
  position: relative;
  z-index: 15;
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
  .baodan-num-box {
    padding-top: 0.38rem;
    height: 0.78rem;
    background: #fff;
    .baodan-num {
      padding-left: 1.6rem;
      color: #666;
      font-size: 0.26rem;
      height: 0.4rem;
      line-height: 0.4rem;
      position: relative;
      > .num-icon {
        position: absolute;
        left: 0.4rem;
        top: 0;
        width: 1rem;
        height: 0.4rem;
        line-height: 0.4rem;
        color: #ff5757;
        font-size: 0.22rem;
        text-align: center;
        background: #fee5e1;
        border-radius: 0.2rem;
      }
    }
  }
  .con-title {
    height: 0.84rem;
    position: relative;
    overflow: hidden;
    background: #fff;
    box-shadow: 0 -4px 8px 0 rgba(0, 0, 0, 0.05);
    border-radius: 0.2rem 0.2rem 0 0;

    .bd-company {
      position: absolute;
      left: 0.4rem;
      top: 0.32rem;
      height: 0.3rem;
    }
    .bd-statusword {
      position: absolute;
      top: 0.3rem;
      right: 0.82rem;
      height: 0.34rem;
      line-height: 0.34rem;
      color: #28c183;
      font-size: 0.24rem;
    }
    .bd-statusword2 {
      position: absolute;
      top: 0.3rem;
      right: 0.82rem;
      height: 0.34rem;
      line-height: 0.34rem;
      font-size: 0.24rem;
      color: #999;
    }
    .bd-statusimg {
      position: absolute;
      width: 0.5rem;
      height: 0.5rem;
      top: 0.25rem;
      right: 0.27rem;
    }
  }
  .itemc {
    padding-top: 0.4rem;
    position: relative;
    background: #fff;
    .tab-content {
      padding: 0.26rem 0.4rem 0.8rem 0.4rem;
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
      padding: 0.3rem 0 0.8rem 0.4rem;
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
    .itemc-p-last {
      margin-bottom: 0;
    }
    .elecbd-box {
      padding: 0.16rem 0.4rem 0.82rem;
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
    padding-top: 0.54rem;
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
.footdetail {
  height: 1.94rem;
  background: #fcfbfa;
  position: relative;
  .btn-back,
  .btn-serve {
    position: absolute;
    top: 0.7rem;
    height: 0.64rem;
    width: 1.8rem;
    border: 1px solid #999;
    border-radius: 0.32rem;
    color: #666;
    font-size: 0.26rem;
    text-align: center;
    line-height: 0.64rem;
  }
  .btn-back {
    left: 1.76rem;
  }
  .btn-serve {
    right: 1.76rem;
  }
}
.toast-box {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
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
</style>

