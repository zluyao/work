<template>
  <div class="upload-boxc">
    <input accept=".jpg, .jpeg, .png, .gif"
           type="file"
           title=" "
           class="input-upload"
           @change="uploadImg">
    <template v-if="uploadImgUrl">
      <div class="inner-box-has">
        <img class="img-show"
             :src="uploadImgUrl">
        <div class="mask">
          重新上传
        </div>
      </div>
    </template>
    <template v-else>
      <div class="inner-box-empty">
        <img class="add-img"
             src="../assets/images/static_add.png"
             alt="">
        <p class="word">上传图片</p>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'ImgUpload',
  props: {},
  data() {
    return {
      uploadImgUrl: '',
      uploadData: {},
    }
  },
  methods: {
    uploadImg(e) {
      this.uploadData = e.target.files[0]
      let self = this
      this.uploadImgUrl = window.URL.createObjectURL(self.uploadData)
      e.target.value = ''
      
      this.$emit("sendFileData", this.uploadData);
    },
  },
}
</script>
<style scoped lang="scss">
* {
  box-sizing: border-box;
}
.upload-boxc {
  position: relative;
  width: 240px;
  height: 240px;
  padding: 10px;
  border-radius: 12px;
  border: 1px dashed rgba(133, 123, 157, 1);
  text-align: center;
  &:hover {
    .inner-box-has .mask {
      display: block;
    }
  }
  .input-upload {
    position: absolute;
    cursor: pointer;
    left: 0;
    top: 0;
    z-index: 200;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
  .inner-box-empty {
    width: 220px;
    height: 220px;
    padding-top: 58px;
    > .add-img {
      width: 60px;
      height: 60px;
      margin-bottom: 30px;
    }
    > .word {
      color: #857b9d;
      font-size: 20px;
      font-weight: 700;
    }
  }
  .inner-box-has {
    width: 220px;
    height: 220px;
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    .img-show {
      width: 100%;
      height: 100%;
    }
    .mask {
      position: absolute;
      z-index: 100;
      display: none;
      top: 0;
      left: 0;
      color: #fff;
      font-size: 20px;
      line-height: 220px;
      text-align: center;
      width: 220px;
      height: 220px;
      background: rgba(91, 84, 108, 0.6);
      border-radius: 12px;
    }
  }
}
</style>
    