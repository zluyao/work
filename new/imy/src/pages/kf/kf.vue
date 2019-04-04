<template>
  <div class="kf-box">
    <img class="kfbg1"
         src="../../assets/images/kf_bg1.png"
         alt="">

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
    <img class="kgbg2"
         src="../../assets/images/kf_bg2.png"
         alt="">
  </div>
</template>

<script>
import common from '@lib/common';
export default {
  name: 'login',
  data() {
    return {

    }
  },
  created() {

  },
  methods: {

  },
  components: {
  },
}
</script>
<style scoped lang="less">
.kf-box {
  padding-top: 3.22rem;
  text-align: center;
  position: relative;
  .kfbg1 {
    position: absolute;
    width: 6.88rem;
    height: 3.52rem;
    top: 0.84rem;
    right: 0;
    z-index: -1;
  }
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
  .kgbg2 {
    position: fixed;
    bottom: 0.9rem;
    right: 0.14rem;
    width: 2.08rem;
    height: 2.54rem;
  }
}
</style>
