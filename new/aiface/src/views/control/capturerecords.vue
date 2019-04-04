<template>
  <div class="snap-all-box">
    <div class="select-box">
      <span class="title">布控筛选</span>
      <div class="form-box">
        <div class="form-line">
          <div class="form-item">
            <span class="label">任务</span>
            <div class="input-box">
              <el-select v-model="taskNames"
                         class="threshold-value"
                         @change="changeTaskNames"
                         placeholder="请选择">
                <el-option v-for="(item,index) in taskNamesArr"
                           :key="index"
                           :label="item.name"
                           :value="item.name">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="form-item">
            <span class="label">视频源</span>
            <div class="input-box">
              <el-select v-model="cameraId"
                         filterable
                         class="threshold-value"
                         placeholder="请选择">
                <el-option v-for="(item,index) in cameraArr"
                           :key="index"
                           :label="item.name"
                           :value="item.id">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="form-item">
            <span class="label">时间</span>
            <div class="input-box">
              <el-date-picker v-model="startEndTime"
                              type="datetimerange"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              range-separator="至"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期">
              </el-date-picker>
            </div>
          </div>
        </div>

        <div class="btn-box">
          <span class="btn-yellow reset-btn"
                @click="reSetKeys">重置</span>
          <span class="btn-blue check-btn"
                @click="searchList">查询</span>
        </div>

      </div>
    </div>
    <div class="result-box"
         v-if="list">
      <div class="top">
        <span class="word">查询结果</span>

        <!-- <div class="derive-all">
          <img src="../../assets/images/derive.png"
               alt="">
          <img src="../../assets/images/derive_active.png"
               v-if="false"
               alt="">
          <span :class="{'active':false}">导出所有目标</span>
        </div>
        <div class="derive-one">
          <img src="../../assets/images/derive.png"
               alt="">
          <span>导出选中目标</span>
        </div> -->
        <div class="total-num">查询结果：{{total}}人</div>
      </div>
      <ul class="list-box"
          v-if="list&&list.length">
        <li v-for="(item,index) in list"
            @click="choiceTarget(item)"
            :key="index"
            :class="{'active':false}">
          <img :src="handleHead(item.snapshot)"
               alt="">
          <p class="name">{{item.cameraName}}</p>
          <p class="time">{{item.happenedTime}}</p>
          <!-- <span class="value">100%</span> -->
        </li>
      </ul>

      <el-pagination class="fr mt30"
                     background
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="pageNum"
                     :page-sizes="[10,20,30,50]"
                     :page-size="pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import ImgUpload from '@/components/ImgUpload.vue'

export default {
  data() {
    return {
      cameraArr: [],
      taskNamesArr: [],
      startEndTime: '',
      cameraId: '',
      taskNames: '',

      list: '',
      total: 0,
      pageNum: 1,
      pageSize: 20,
    }
  },
  components: {
  },
  methods: {
    handleSizeChange(v) {
      this.pageSize = v;
      this.pageNum = 1;
      this.getList();
    },
    handleCurrentChange(v) {
      this.pageNum = v;
      this.getList();
    },
    choiceTarget() {

    },
    changeTaskNames(v) {
      this.taskNamesArr.forEach(ele => {
        if (v == ele.name) {
          this.cameraArr = ele.cameras
        }
      })
    },
    getTaskList() {
      this.$tools.get('api/task/list').then(res => {
        this.taskNamesArr = res.data
      })
    },
    reSetKeys() {
      this.startEndTime = ''
      this.cameraId = ''
      this.taskNames = ''
    },
    searchList() {
      this.pageNum = 1
      this.pageSize = 20
      this.getList()
    },
    getList() {
      if (!this.startEndTime) {
        this.startEndTime = ['', '']
      }

      let objData = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        taskNames: this.taskNames,
        cameraId: this.cameraId,
        startTime: this.startEndTime[0],
        endTime: this.startEndTime[1],
      }
      objData = this.deleteEmptyKey(objData)
      this.$tools.get(`api/data/events`, objData).then(res => {
        this.list = res.data.rows
        this.total = res.data.total
      })
    },
    deleteEmptyKey(obj) {
      let objData = Object.assign({}, obj)
      for (let key in objData) {
        if (objData[key] === '') {
          delete objData[key]
        }
      }
      return objData
    },
    handleHead(val) {
      return `/api/common/download?path=${val}&Token=${window.sessionStorage.getItem('aiFaceToken')}`;
    },
  },
  created() {
    this.getTaskList();
  },
  mounted() {

  }
};
</script>
<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.snap-all-box {
  padding-left: 40px;
  padding-top: 46px;
  .select-box {
    height: 150px;
    padding-left: 120px;
    position: relative;
    .title {
      position: absolute;
      top: 6px;
      left: 0;
      font-size: 20px;
      color: #2f224d;
      font-weight: 600;
    }
    .form-box {
      height: 150px;
      .form-line {
        font-size: 0;
        text-align: left;
      }
    }
  }
}
.btn-box {
  overflow: hidden;
  height: 40px;
  margin-top: 70px;
  > span {
    float: left;
  }
  .reset-btn {
    margin-right: 20px;
  }
}

.form-item {
  display: inline-block;
  height: 40px;
  margin-right: 25px;
  // width: 316px;
  .label {
    display: inline-block;
    color: #2f224d;
    font-size: 16px;
    margin-right: 20px;
    height: 40px;
    line-height: 40px;
  }
  .input-box {
    width: 230px;
    display: inline-block;
  }
}

.result-box {
  margin-top: 80px;
  .top {
    height: 25px;
    width: 100%;
    margin-bottom: 20px;
    position: relative;
    .word {
      position: absolute;
      top: 0;
      left: 0;
      line-height: 25px;
      font-size: 18px;
      font-weight: 700;
      color: #2e224e;
    }
  }
  .total-num {
    float: right;
    height: 25px;
    line-height: 25px;
    color: #857b9d;
    font-size: 16px;
  }
  .derive-one {
    margin-right: 20px;
    margin-left: 20px;
  }
  .derive-one,
  .derive-all {
    float: right;
    padding-top: 1px;
    cursor: pointer;
    > * {
      vertical-align: top;
    }
    > img {
      width: 20px;
      height: 20px;
    }
    > span {
      padding-left: 6px;
      line-height: 22px;
      color: #c9c2d8;
      font-size: 16px;
      // font-weight: 600;
    }
    > span.active {
      color: #5b546c;
    }
  }
  .list-box {
    background: rgba(248, 246, 251, 1);
    border-radius: 12px;
    padding: 28px;
    overflow: hidden;
    > li {
      float: left;
      cursor: pointer;
      width: 140px;
      height: 212px;
      margin-right: 12px;
      margin-bottom: 12px;
      background: #fff;
      position: relative;
      border-radius: 7px;
      overflow: hidden;
      // border-bottom-left-radius: 7px;
      // border-bottom-right-radius: 7px;
      > img {
        width: 140px;
        height: 140px;
      }
      .value {
        position: absolute;
        top: 118px;
        left: 48px;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        line-height: 44px;
        text-align: center;
        font-size: 16px;
        color: #671eff;
        font-weight: 700;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.1);
      }
      .name {
        position: absolute;
        bottom: 38px;
        left: 0;
        width: 100%;
        height: 20px;
        line-height: 20px;
        text-align: center;
        font-weight: 600;
        font-size: 14px;
        color: #5b546c;
      }
      .time {
        position: absolute;
        bottom: 17px;
        left: 0;
        width: 100%;
        line-height: 17px;
        text-align: center;
        font-size: 12px;
        color: #857b9d;
      }
    }
    > li.active {
      box-shadow: 0px 3px 14px 0px rgba(0, 0, 0, 0.18);
      border: 1px solid rgba(103, 30, 255, 1);
      &::after {
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        width: 26px;
        height: 26px;
        background: url("../../assets/images/checked_gou.png");
      }
    }
  }
}
</style>
<style>
.form-item .el-input__inner {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 8px 0px rgba(227, 224, 235, 0.8);
  border-radius: 20px;
  border: none;
}
</style>

