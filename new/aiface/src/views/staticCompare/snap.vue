<template>
  <div class="snap-all-box">
    <div class="select-box">
      <img-upload @sendFileData="getUploadData"
                  ref="imgUpload"></img-upload>
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
        <div class="form-line">
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
            <span class="label">识别阈值</span>
            <div class="input-box">
              <el-select v-model="threshold"
                         class="threshold-value"
                         placeholder="请选择">
                <el-option v-for="(item,index) in thresholdArr"
                           :key="index"
                           :label="item.name"
                           :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
        </div>

        <div class="btn-box">
          <span class="btn-yellow reset-btn"
                @click="reSetKeys">重置</span>
          <span class="btn-blue check-btn"
                @click="getList">检索</span>
        </div>

      </div>
    </div>
    <div class="result-box"
         v-if="rows.length">
      <div class="top">
        <span class="word">排序</span>
        <div class="sort-box sort-time"
             @click="changeSortField('time')"
             :class="{'sort-active':sortField=='time'}">
          时间
          <i class="sort-up "
             @click="changeSortType($event,'time','asc')"
             :class="{'active-iup':sortField=='time'&&sortType=='asc'}"></i>
          <i class="sort-down "
             @click="changeSortType($event,'time','desc')"
             :class="{'active-idown':sortField=='time'&&sortType=='desc'}"></i>
        </div>
        <div class="sort-box sort-spy"
             @click="changeSortField('camera')"
             :class="{'sort-active':sortField=='camera'}">
          视频源
          <i class="sort-up"
             @click="changeSortType($event,'camera','asc')"
             :class="{'active-iup':sortField=='camera'&&sortType=='asc'}"></i>
          <i class="sort-down"
             @click="changeSortType($event,'camera','desc')"
             :class="{'active-idown':sortField=='camera'&&sortType=='desc'}"></i>
        </div>
        <!-- <div class="sort-box sort-xsd">
          相似度
          <i class="sort-up"></i>
          <i class="sort-down"></i>
        </div> -->

        <!-- <div class="derive-all">
          <img src="../../assets/images/derive.png"
               alt=""
               v-if="false">
          <img src="../../assets/images/derive_active.png"
               alt="">
          <span class="active">导出所有目标</span>
        </div>
        <div class="derive-one">
          <img src="../../assets/images/derive.png"
               alt="">
          <span>导出选中目标</span>
        </div> -->
      </div>
      <ul class="list-box">
        <li v-for="(item,index) in rows"
            :key="index"
            :class="{'active':false}">
          <img :src="handleHead(item.snapshot)"
               alt="">
          <p class="name">{{reIndex(index+1)}} {{item.cameraName}}</p>
          <p class="time">{{item.happenedTime}}</p>
          <!-- <span class="value">100%</span> -->
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import ImgUpload from '@/components/ImgUpload.vue'

export default {
  data() {
    return {
      thresholdArr: [
        {
          name: '10%',
          value: 0.1,
        },
        {
          name: '20%',
          value: 0.2,
        },
        {
          name: '30%',
          value: 0.3,
        },
        {
          name: '40%',
          value: 0.4,
        },
        {
          name: '50%',
          value: 0.5,
        },
        {
          name: '60%',
          value: 0.6,
        },
        {
          name: '70%',
          value: 0.7,
        },
        {
          name: '80%',
          value: 0.8,
        },
        {
          name: '90%',
          value: 0.9,
        }
      ],
      cameraArr: [],
      taskNamesArr: [],
      startEndTime: '',
      threshold: '',
      cameraId: '',
      file: '',
      taskNames: '',
      sortType: 'asc', // desc
      sortField: 'time', // time camera 
      rows: [],
    }
  },
  components: {
    ImgUpload
  },
  methods: {
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
    changeSortField(sortField) {
      this.sortField = sortField
      this.getList()
    },
    changeSortType(e, sortField, sortType) {
      e.stopPropagation()
      this.sortField = sortField
      this.sortType = sortType
      this.getList()
    },
    getUploadData(uploadData) {
      this.file = uploadData
    },
    reSetKeys() {
      this.file = ''
      this.startEndTime = ''
      this.threshold = ''
      this.cameraId = ''
      this.taskNames = ''
      this.sortType = 'asc'
      this.sortField = 'time'

      this.$refs['imgUpload'].$data.uploadImgUrl = ''
    },
    getList() {
      if (!this.file) {
        this.$message({
          type: 'error',
          message: '请上传图片',
        });
        return
      }
      if (!this.startEndTime) {
        this.startEndTime = ['', '']
      }
      this.$tools.post(`api/data/search/snap?pageNum=1&pageSize=1000&taskNames=${this.taskNames}&cameraId=${this.cameraId}&threshold=${this.threshold}&sortType=${this.sortType}&sortField=${this.sortField}&startTime=${this.startEndTime[0]}&endTime=${this.startEndTime[1]}`, {
        file: this.file,
      }, {}, 'form').then(res => {
        this.rows = res.data.rows;
      })
    },
    reIndex(v) {
      if (v < 10) {
        return `00${v}`
      } else if (v < 100) {
        return `0${v}`
      } else {
        return v
      }
    },
    handleHead(val) {
      return `/api/common/download?path=${val}&Token=${window.sessionStorage.getItem('aiFaceToken')}`;
    },
  },
  created() {
    this.getTaskList();
  },
  mounted() { }
};
</script>
<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.snap-all-box {
  padding-left: 40px;
  padding-top: 80px;
  .select-box {
    height: 240px;
    > * {
      float: left;
    }
    .form-box {
      margin-left: 60px;
      .form-line {
        font-size: 0;
        text-align: left;
        margin-bottom: 40px;
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
  margin-right: 60px;
  width: 316px;
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

.sort-box {
  width: 78px;
  height: 28px;
  line-height: 28px;
  text-align: left;
  padding-left: 8px;
  color: #fff;
  font-size: 16px;
  background: rgba(169, 163, 185, 1);
  border-radius: 6px;
  position: absolute;
  cursor: pointer;
  top: -2px;
  .sort-up {
    position: absolute;
    top: 2px;
    right: 8px;
    width: 10px;
    height: 10px;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid transparent;
    border-bottom: 5px solid #c9c2d8;
  }
  .active-iup {
    border-bottom: 5px solid #fff;
  }
  .sort-down {
    position: absolute;
    bottom: 2px;
    right: 8px;
    width: 10px;
    height: 10px;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid #c9c2d8;
    border-bottom: 5px solid transparent;
  }
  .active-idown {
    border-top: 5px solid #fff;
  }
}
.sort-active {
  background: rgba(91, 84, 109, 1);
  box-shadow: 0px 2px 9px 0px rgba(91, 84, 109, 0.46);
}
.sort-time {
  left: 56px;
}
.sort-spy {
  left: 144px;
}
.sort-xsd {
  left: 232px;
}
.result-box {
  margin-top: 70px;
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
  .derive-one {
    margin-right: 20px;
  }
  .derive-one,
  .derive-all {
    float: right;
    padding-top: 3px;
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
        bottom: 34px;
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
        bottom: 13px;
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

