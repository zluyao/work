<template>
  <div>
    <iframe :src="pdfUrl"></iframe>
    <div class="back-btn"
         @click="back"><i class="iconfont icon-chakantiaokuanxiangqing-fanhuiicon"></i>返回</div>
  </div>
</template>

<script>
import common from '@lib/common';
export default {
  name: 'noticedetail',
  data() {
    return {
      pdfUrl: '//ow365.cn/?i=10447&furl=http://helian.image.alimmdn.com/insurancepdf/myax/bzxq.pdf',
      // pdfUrl: '//ow365.cn/?i=10447&furl=http://helian.image.alimmdn.com/insurancepdf/ptwkywx/bzxqptwk.pdf',
      // pdfUrl: '//ow365.cn/?i=10447&furl=http://helian.image.alimmdn.com/insurancepdf/xxwkywx/bzxqxxwk.pdf',
    }
  },
  created() {
    const insureProductId = common.getUrlParam('insureProductId');
    const hasUrl = common.getUrlParam('hasUrl');
    if (hasUrl) {
      this.pdfUrl = hasUrl;
      this.pdfUrl = `//ow365.cn/?i=10447&furl=${hasUrl}`;
      return
    }
    if (insureProductId == 20) {
      this.pdfUrl = '//ow365.cn/?i=10447&furl=http://helian.image.alimmdn.com/insurancepdf/myax/bzxq.pdf';
    } else if (insureProductId == 21) {
      this.pdfUrl = '//ow365.cn/?i=10447&furl=http://helian.image.alimmdn.com/insurancepdf/ptwkywx/bzxqptwk.pdf';
    } else if (insureProductId == 22) {
      this.pdfUrl = '//ow365.cn/?i=10447&furl=http://helian.image.alimmdn.com/insurancepdf/xxwkywx/bzxqxxwk.pdf';
    } else {
      this.pdfUrl = '//ow365.cn/?i=10447&furl=http://helian.image.alimmdn.com/insurancepdf/myax/bzxq.pdf';
    }
  },
  methods: {
    back() {
      window.history.go(-1);
    }
  },
  components: {
  },
}
</script>
<style scoped lang="less">
iframe {
  position: fixed;
  width: 100%;
  min-height: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
.back-btn {
  position: fixed;
  right: 0;
  bottom: 2.2rem;
  height: 0.8rem;
  line-height: 0.8rem;
  width: 1.1rem;
  text-align: center;
  font-size: 0.24rem;
  color: #fff;
  background: linear-gradient(
    90deg,
    rgba(247, 127, 102, 1) 0%,
    rgba(255, 87, 87, 1) 100%
  );
  opacity: 0.8;
  border-radius: 0.08rem;
  > .iconfont {
    font-size: 0.2rem;
    padding-right: 0.08rem;
  }
}
</style>
