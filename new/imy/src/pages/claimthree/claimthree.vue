<template>
  <div class="claimthree"
       :class="{'claimthree-x':isX}">
    <div class="claim-head">
      <img src="../../assets/images/information.png"
           class="img1"
           alt="">
      <img src="../../assets/images/img-step3.png"
           class="img2"
           alt="">
    </div>
    <div class="step-box">
      <img src="../../assets/images/img-3.png"
           alt=""
           class="step-img">
      <p class="step-str">
        确认提交
      </p>
    </div>
    <div class="claim-content">
      <div class="detial-item">
        <i @click="toHtmlone"
           class="iconfont icon-chanpintoubaojieshaoye-likegoumai"></i>
        <div class="item-title">出险信息（{{detail.protectUserType == 2?'被保人':detail.protectUserType == 3?'附带被保人':'投保人'}}）</div>
        <p>
          <span class="sp1">姓名：</span>
          <span>{{detail.protectUserName}}</span>
        </p>
        <p>
          <span class="sp1">{{detail.protectCerType==1?'身份证':detail.protectCerType==2?'护照':detail.protectCerType==3?'出生证':''}}：</span>
          <span>{{detail.protectCerNum}}</span>
        </p>
        <p>
          <span class="sp1">索赔类型：</span>
          <span>{{detail.claimProject}}</span>
        </p>
        <p>
          <span class="sp1">出险时间：</span>
          <span>{{detail.occurTime}}</span>
        </p>
      </div>
      <div class="detial-item">
        <i @click="toHtmltwo"
           class="iconfont icon-chanpintoubaojieshaoye-likegoumai"></i>
        <div class="item-title">收款人、联系人信息</div>
        <p>
          <span class="sp1">收款人姓名：</span>
          <span>{{detail.payeeUserName}}</span>
        </p>
        <p>
          <span class="sp1">开户银行：</span>
          <span>{{detail.bankName}}</span>
        </p>
        <p>
          <span class="sp1">银行卡号：</span>
          <span>{{detail.bankCardNum}}</span>
        </p>
        <p>
          <span class="sp1">联系人电话：</span>
          <span>{{detail.linkPhoneNum}}</span>
        </p>
      </div>
      <div class="lpsq">
        <div class="lp-book">理赔申请书 <div class="get-mail"
               @click="isShowemailbox = true">获取理赔申请相关文件 <i class="iconfont icon-chanpintoubaojieshaoye-likegoumai"></i></div>
        </div>
        <p class="warn-book">
          <img src="../../assets/images/warn_icon.png"
               alt="">
          <span>请被保险人或其监护人亲笔签名，签名将用于<br><span href=""
                  class="to-pdf">《理赔申请书》</span></span>
        </p>
        <div class="canvas"
             id="canvas">
          <div class="canvas-clear"
               id="clearCanvas">清空</div>
          <div class="img-box"
               v-if="isDrawing">
            <img src="../../assets/images/icon-signatur.png"
                 alt="">
            <p>电子签名区</p>
          </div>
          <!-- <div class="canvas-save"
               id="saveCanvas">保存</div> -->
        </div>
        <p class="sure-people"
           @click="changMydraw">
          <span class="people-unchecked"
                v-if="!isMydraw"></span>
          <img class="people-checked"
               v-if="isMydraw"
               src="../../assets/images/read_icon.png"
               alt="">
          <span>我确认签名者为被保险人或其监护人</span>
        </p>
      </div>
    </div>

    <div class="warn-box"
         v-if="showWarn">
      <div class="warn-text">
        <span class="warn-y"></span>
        <span>{{warnPicStr}}</span>
      </div>
    </div>

    <div class="email-box"
         v-if="isShowemailbox">
      <div class="inner-box"
           :class="{'inner-box2':isMialFocus2}">
        <p class="inner-title">发送邮箱获得以下资料</p>
        <img src="../../assets/images/hasdzzbd.png"
             alt="">
        <p class="inner-content">意外险索赔申请书、人身险监护人证明书、太平洋保险医疗意外理赔处理方案（理赔资料）、电子保单、条款</p>
        <div class="email-inputbox email-inputbox-warn">
          <input placeholder="发送邮箱获取资料"
                 type="text"
                 @focus="emailFb(1)"
                 @blur="emailFb(2)"
                 v-model="emailValue"
                 name=""
                 id="">
          <i v-if="isMialFocus&&emailValue"
             @click="emailValue = ''"
             class="icon-toubaolurutoubaorenxinxi-baocuo1 iconfont isFocused"></i>
          <span class="warn-word">{{emailWarnWord}}</span>
        </div>
        <div class="send-btn"
             @click="sendEmail">发送</div>
        <div class="close-btn"
             @click="isShowemailbox = false"><i class="iconfont icon-toubaolurutoubaorenxinxi-baocuo1"></i></div>
      </div>
    </div>

    <div class="foot-btns"
         :class="{'foot-btns-x':isX}">
      <a href="tel:057156757519">
        <div class="kf-btn">
          <img src="../../assets/images/iconcustomerservice.png"
               alt="">
          <span>咨询客服</span>
        </div>
      </a>

      <div class="sq-btn"
           @click="sureApply"><span>提交申请</span><i class="iconfont icon-chanpintoubaojieshaoye-likegoumai"></i></div>
    </div>
  </div>

</template>

<script>
import common from '@lib/common';
export default {
  name: 'claimthree',
  data() {
    return {
      isX: false,

      detail: {

      },
      isMydraw: false,
      hasDrawingPic: false,
      isDrawing: true,
      claimId: '',
      fileBase64: '',
      billId: '',

      showWarn: false,
      warnPicStr: '',

      emailWarnWord: '',
      emailValue: '',
      isShowemailbox: false,
      isMialFocus: false,
      isMialFocus2: false,
    }
  },
  filters: {
    reTime: function (val) {
      const date = new Date(val);
      const y = date.getFullYear();
      const m = (date.getMonth() + 1 < 10 ? `0${(date.getMonth() + 1)}` : date.getMonth() + 1);
      const d = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
      const s = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
      return `${y}-${m}-${d}`;
    },
  },
  created() {
    this.isIPhoneX();

    this.claimId = common.getUrlParam('claimId');
    this.getDetail();
  },
  mounted() {
    this.$nextTick(() => {
      this.lineCanvas();
    })
  },
  methods: {
    isIPhoneX() {
      let u = navigator.userAgent;
      let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if (isIOS && screen.height == 812 && screen.width == 375) {
        this.isX = true;
      } else {
        this.isX = false;
      }
    },
    getDetail() {
      common.http.get('/api/secret/claim/v1/claimDetail', {
        claimId: this.claimId,
      }).then((res) => {
        this.billId = res.data.billId;
        this.detail = res.data;

      })

    },
    emailFb(type) {
      let u = navigator.userAgent;
      let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
      if (type == 1) {
        this.isMialFocus = true
        if (isAndroid) {
          this.isMialFocus2 = true;
        }
      } else {
        this.isMialFocus = false;
        if (isAndroid) {
          this.isMialFocus2 = false;
        }
      }
    },
    sendEmail() {
      if (!common.rules.checkemail(this.emailValue).v) {
        this.emailWarnWord = common.rules.checkemail(this.emailValue).s;
      } else {
        this.emailWarnWord = '';
        common.http.get('/api/secret/claim/v1/sendFiles', {
          email: this.emailValue,
          billId: this.billId,
        }).then((res) => {
          this.showWarn = true;
          this.warnPicStr = '发送成功';
          this.hideWarn();
          this.isShowemailbox = false;
        })
      }
    },
    toHtmlone() {
      window.location.href = `./claimone.html?billId=${this.billId}&claimId=${this.claimId}&fromChange=1`;
    },

    toHtmltwo() {
      window.location.href = `./claimtwo.html?billId=${this.billId}&claimId=${this.claimId}&fromChange=1`;
    },

    bodyScroll(event) {
      event.preventDefault();
    },
    hideWarn() {
      setTimeout(() => {
        this.showWarn = false;
      }, 1500);
    },

    changMydraw() {
      if (this.hasDrawingPic) {
        this.isMydraw = !this.isMydraw;
      } else {
        this.showWarn = true;
        this.warnPicStr = '请先完成电子签名';
        this.hideWarn();
      }
    },
    sureApply() {
      const canvas = document.getElementsByTagName('Canvas')[0];
      if (!this.hasDrawingPic) {
        this.showWarn = true;
        this.warnPicStr = '请先完成电子签名';
        this.hideWarn();
        return;
      }

      if (!this.isMydraw) {
        this.showWarn = true;
        this.warnPicStr = '请勾选我确认签名者为被保险人或其监护人';
        this.hideWarn();
        return;
      }

      if (this.hasDrawingPic) {
        let imgBase64 = canvas.toDataURL();
        this.fileBase64 = imgBase64;
      }

      common.http.post('/api/secret/claim/v1/saveClaimThird', {
        claimId: this.claimId,
        openId: localStorage.getItem('openidinsurancemy'),
        fileBase64: this.fileBase64,
      }).then((res) => {
        this.showWarn = true;
        this.warnPicStr = '提交成功';
        setTimeout(() => {
          this.showWarn = false;
          if (WeixinJSBridge) {
            WeixinJSBridge.call('closeWindow');
          }
        }, 2000);

      });
    },
    lineCanvas() {
      const that = this;
      const linewidth = 2;
      const color = "#000000";
      const background = "#fff";
      const el = document.getElementById("canvas");
      const clearEl = document.getElementById("clearCanvas");

      let canvas = document.createElement("canvas");
      el.appendChild(canvas);
      let cxt = canvas.getContext("2d");
      canvas.width = el.clientWidth;
      canvas.height = el.clientHeight;
      const H = el.clientHeight;
      cxt.fillStyle = background;
      cxt.fillRect(0, 0, canvas.width, canvas.width);
      cxt.strokeStyle = color;
      cxt.lineWidth = linewidth;
      cxt.lineCap = "round";
      //开始绘制
      canvas.addEventListener("touchstart", function (e) {
        that.isDrawing = false;
        that.bodyScroll(e);
        cxt.beginPath();
        cxt.moveTo(e.changedTouches[0].pageX - 40, e.changedTouches[0].pageY - 3.62 * H);
      });
      //绘制中
      canvas.addEventListener("touchmove", function (e) {
        that.bodyScroll(e);

        cxt.lineTo(e.changedTouches[0].pageX - 40, e.changedTouches[0].pageY - 3.62 * H);
        cxt.stroke();
      });
      //结束绘制
      canvas.addEventListener("touchend", function () {
        cxt.closePath();
        that.hasDrawingPic = true;
      });
      //清除画布
      clearEl.addEventListener("click", function () {
        cxt.clearRect(0, 0, canvas.width, canvas.height);
        that.hasDrawingPic = false;
        that.isDrawing = true;
        that.isMydraw = false;
      });
    },


  },
  components: {
  },
}
</script>
<style scoped lang="less">
.claim-head {
  height: 2.46rem;
  .img1 {
    width: 100%;
    height: 100%;
    position: relative;
    z-index: -1;
  }
  .img2 {
    position: absolute;
    z-index: 5;
    left: 1.7rem;
    top: 0.42rem;
    width: 4.1rem;
    height: 1.44rem;
  }
}
.step-box {
  height: 1.02rem;
  padding-left: 0.52rem;
  position: relative;
  top: -0.16rem;
  .step-img {
    height: 0.54rem;
    width: 0.82rem;
    display: block;
  }
  .step-str {
    margin-top: 0.04rem;
    padding-left: 0.08rem;
    height: 0.44rem;
    line-height: 0.44rem;
    color: #666;
    font-size: 0.32rem;
  }
}

.detial-item {
  margin: auto;
  height: 3.2rem;
  width: 6.7rem;
  background: linear-gradient(
    67deg,
    rgba(250, 247, 246, 1) 0%,
    rgba(242, 235, 232, 1) 100%
  );
  border-radius: 0.2rem;
  margin-bottom: 0.4rem;
  padding: 0.48rem 0.4rem 0 0.4rem;
  position: relative;
  > i {
    position: absolute;
    font-size: 0.3rem;
    color: #e1d7d1;
    top: 0.52rem;
    right: 0.4rem;
  }
  .item-title {
    height: 0.4rem;
    line-height: 0.4rem;
    color: #666;
    font-size: 0.32rem;
    font-weight: 700;
    margin-bottom: 0.2rem;
  }
  > p {
    height: 0.4rem;
    line-height: 0.4rem;
    margin-bottom: 0.06rem;
    color: #999;
    font-size: 0.26rem;
    > span {
      display: inline-block;
    }
    .sp1 {
      width: 1.72rem;
    }
  }
}
.lp-book {
  position: relative;
  padding-left: 0.6rem;
  height: 0.34rem;
  line-height: 0.34rem;
  color: #666;
  font-size: 0.24rem;
  margin-bottom: 0.2rem;
  .get-mail {
    position: absolute;
    height: 0.34rem;
    top: 0;
    right: 0.4rem;
    color: #ff5757;
    > i {
      padding-left: 0.1rem;
      font-size: 0.2rem;
    }
  }
}
.warn-book {
  padding-left: 0.96rem;
  position: relative;
  line-height: 0.34rem;
  color: #999;
  font-size: 0.24rem;
  > img {
    position: absolute;
    width: 0.28rem;
    height: 0.36rem;
    top: 0;
    left: 0.6rem;
  }
  .to-pdf {
    // color: #ff5757;
  }
}
.canvas {
  width: 6.3rem;
  height: 3.6rem;
  margin: 0.4rem auto 0.4rem;
  border-radius: 0.08rem;
  position: relative;
  background: #fff;
  border: 3px solid rgba(239, 239, 239, 1);
  .img-box {
    position: absolute;
    width: 1.4rem;
    height: 1.2rem;
    top: 1.12rem;
    left: 2.46rem;
    text-align: center;
    > img {
      width: 0.7rem;
      height: 0.66rem;
      margin-bottom: 0.2rem;
    }
    > p {
      color: #dbdcdd;
      font-size: 0.24rem;
    }
  }
  .canvas-clear {
    position: absolute;
    z-index: 1000;
    bottom: 0.1rem;
    right: 0.1rem;
    width: 0.8rem;
    height: 0.4rem;
    font-size: 0.26rem;
    line-height: 0.4rem;
    text-align: center;
    color: #999;
    background: #f5f5f5;
    border-radius: 0.3rem;
  }
  .canvas-save {
    position: absolute;
    bottom: 0.05rem;
    right: 0.65rem;
    font-size: 0.24rem;
  }
}
#canvas {
  position: relative;
}
#canvas canvas {
  display: block;
}

.lpsq {
  padding-bottom: 2rem;
}
.sure-people {
  position: relative;
  height: 0.4rem;
  line-height: 0.4rem;
  color: #333;
  font-size: 0.2rem;
  padding-left: 1.1rem;
}
.people-unchecked {
  position: absolute;
  border-radius: 50%;
  border: 0.06rem solid #ddd;
  bottom: 0;
  left: 0.6rem;
  width: 0.4rem;
  height: 0.4rem;
}
.people-checked {
  position: absolute;
  width: 0.4rem;
  height: 0.46rem;
  left: 0.6rem;
  top: 0;
}
.foot-btns {
  position: fixed;
  width: 100%;
  height: 0.98rem;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px -4px 16px 0px rgba(0, 0, 0, 0.05);
  .kf-btn {
    position: absolute;
    left: 0.6rem;
    top: 0.29rem;
    width: 1.8rem;
    height: 0.4rem;
    line-height: 0.4rem;
    padding-left: 0.56rem;
    color: #333;
    font-size: 0.26rem;
    > img {
      width: 0.4rem;
      height: 0.4rem;
      position: absolute;
      left: 0;
      top: 0;
    }
    > span {
      display: block;
      height: 0.4rem;
    }
  }
  .sq-btn {
    position: absolute;
    height: 0.74rem;
    width: 3.6rem;
    top: 0.12rem;
    right: 0.24rem;
    background: linear-gradient(
      90deg,
      rgba(247, 127, 102, 1) 0%,
      rgba(255, 87, 87, 1) 100%
    );
    line-height: 0.74rem;
    text-align: center;
    color: #fff;
    font-size: 0.3rem;
    border-radius: 0.08rem;
    > i {
      font-size: 0.14rem;
      margin-left: 0.25rem;
    }
  }
}
.foot-btns-x {
  height: 1.32rem;
}
</style>
