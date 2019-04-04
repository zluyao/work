<template>
  <div class="verify-all-box">
    <div class="select-box">
      <img-upload @sendFileData="getUploadData1"></img-upload>
      <div class="middle-box">
        <p class="p1">相似度</p>
        <p class="p2">{{pointStr}}</p>
        <p class="p3">{{descStr}}</p>
      </div>
      <img-upload @sendFileData="getUploadData2"></img-upload>
    </div>

    <div class="btn-box">
      <div class="btn-yellow"
           @click="beginVerify">开始比对</div>
    </div>
  </div>
</template>
<script>
import ImgUpload from '@/components/ImgUpload.vue'
export default {
  data() {
    return {
      file1: '',
      file2: '',
      pointStr: '',
      descStr: '',
    }
  },
  components: {
    ImgUpload
  },
  methods: {
    getUploadData1(uploadData) {
      this.file1 = uploadData
    },
    getUploadData2(uploadData) {
      this.file2 = uploadData
    },
    beginVerify() {
      if (!this.file1 || !this.file2) {
        this.$message({
          type: 'error',
          message: '请上传图片',
        });
        return
      }
      this.$tools.post('api/data/search/1-1', {
        file1: this.file1,
        file2: this.file2,
      }, {}, 'form').then(res => {
        let point = res.data.data
        this.pointStr = `${Number(point * 100).toFixed(1)}%`
        this.descStr = point < 0.75 ? '不是同一个人' : '可能是同一个人'
      })
    },
  },
  created() {
  },
  mounted() {

  }
};
</script>
<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.verify-all-box {
  padding-left: 40px;
  padding-top: 80px;
  .select-box {
    height: 240px;
    > * {
      float: left;
    }
    .middle-box {
      width: 392px;
      height: 100%;
      padding-top: 60px;
      text-align: center;
      .p1 {
        line-height: 28px;
        font-size: 20px;
        color: #2f224d;
      }
      .p2 {
        line-height: 56px;
        font-size: 48px;
        color: #671eff;
        margin: 20px auto;
      }
      .p3 {
        line-height: 28px;
        font-size: 20px;
        color: #a9a3b9;
      }
    }
  }
  .btn-box {
    margin-top: 92px;
    height: 40px;
    padding-left: 376px;
    .verify-btn {
      width: 120px;
      height: 40px;
      cursor: pointer;
      text-align: center;
      line-height: 40px;
      color: #2f224d;
      font-size: 14px;
      font-weight: 600;
      background: rgba(255, 221, 27, 1);
      box-shadow: 0px 4px 16px 0px rgba(255, 221, 27, 0.3);
    }
  }
}
</style>
