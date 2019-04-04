<template>
  <transition name="dialog-fade">
    <div class="hint"
         v-if="show">
      <div class="hint-box">
        {{message}}
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      message: '',
      time: '',
      callback: null,
    }
  },
  methods: {
    over() {
      setTimeout(() => {
        this.show = false;

        this.callback && this.callback();
      }, this.time);
    }
  },
  updated() {
    this.over();
  },
}
</script>

<style lang="less" rel="stylesheet/less">
// 显示过渡动画
.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: opacity 0.5s;
}

.dialog-fade-enter,
.dialog-fade-leave-to {
  opacity: 0;
}

.hint {
  position: fixed;
  top: 0;
  width: 100%;
  height: 100;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 3000;
  text-align: center;
  padding-top: 45%;
  .hint-box {
    line-height: 0.28rem;
    font-size: 0.2rem;
    max-width: 3.2rem;
    margin: auto;
    background-color: rgba(0, 0, 0, 0.8);
    color: #fff;
    padding: 0.2rem;
    border-radius: 0.1rem;
  }
}
</style>
