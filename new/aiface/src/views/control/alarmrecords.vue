<template>
  <div class="snap-all-box">
    <div class="select-box">
      <span class="title">布控筛选</span>
      <span class="title2">目标筛选</span>
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
                           :value="item.id">
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
        <div class="form-line form-line-middle">
          <div class="form-item">
            <span class="label">性别</span>
            <div class="input-box">
              <el-select v-model="sex"
                         class="threshold-value"
                         placeholder="请选择">
                <el-option label="男"
                           value="男">
                </el-option>
                <el-option label="女"
                           value="女">
                </el-option>
                <el-option label="不限"
                           value="">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="form-item">
            <span class="label">年龄</span>
            <div class="input-box">
              <el-select v-model="startEndAge"
                         filterable
                         class="threshold-value"
                         placeholder="请选择">
                <el-option v-for="(item,index) in ageArr"
                           :key="index"
                           :label="item.label"
                           :value="item.label">
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="form-line">
          <div class="form-item">
            <span class="label">相似度</span>
            <div class="input-box">
              <el-select v-model="similarity"
                         filterable
                         class="threshold-value"
                         placeholder="">
                <el-option v-for="(item,index) in thresholdArr"
                           :key="index"
                           :label="item.name"
                           :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="form-item">
            <span class="label">目标库</span>
            <div class="input-box">
              <el-select v-model="targetId"
                         filterable
                         class="threshold-value"
                         placeholder="">
                <el-option v-for="(item,index) in targetList"
                           :key="index"
                           :label="item.name"
                           :value="item.id">
                </el-option>
              </el-select>
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
        <div class="sort-box sort-xsd"
             @click="changeSortField('target')"
             :class="{'sort-active':sortField=='target'}">
          目标
          <i class="sort-up"
             @click="changeSortType($event,'target','asc')"
             :class="{'active-iup':sortField=='target'&&sortType=='asc'}"></i>
          <i class="sort-down"
             @click="changeSortType($event,'target','desc')"
             :class="{'active-idown':sortField=='target'&&sortType=='desc'}"></i>
        </div>

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
            class="item-bigbox mlb12"
            :key="index">
          <div class="top">
            <p class="title">{{item.taskName}}/摄像头：{{item.cameraName}}</p>
            <span class="time">{{item.happenedTime}}</span>
            <img class="img-tobig"
                 @click="showBigImg(item)"
                 src="../../assets/images/to_big.png"
                 alt="">
          </div>
          <div class="content">
            <div class="img-left-box">
              <img class="img-left"
                   :src="handleHead(item.screenshot)"
                   alt="">
              <!-- <img class="img-left"
                   src="../../assets/images/c.jpg"
                   alt=""> -->
              <img class="img-border"
                   src="../../assets/images/border.png"
                   alt="">
            </div>
            <img class="img-right"
                 :src="handleHead(item.head)"
                 alt="">
            <span class="percnet">{{numToPersent(item.similarity)}}</span>
            <p class="user-info">{{item.name}} {{item.sex==1?'男':'女'}} {{item.age}}岁</p>
            <p class="item-p"><span>所属</span>{{item.belong}}</p>
            <p class="item-p"><span>库</span>{{item.targetName}}</p>
            <p class="item-p item-p-last"><span>地点</span>{{item.placeName}}</p>
          </div>
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

    <el-dialog title="抓拍大图"
               :visible.sync="dialogVisible"
               top="10vh"
               class="bigimg-box"
               width="890px">

      <div style="padding:0 20px;">
        <div class="top">
          <div class="left">
            <img class="img1"
                 :src="handleHead(itemInfo.screenshot)"
                 alt="">
            <!-- <img class="img1"
                 src="../../assets/images/c.jpg"
                 alt=""> -->
            <img class="img-border"
                 src="../../assets/images/border.png"
                 alt="">
            <img :src="handleHead(itemInfo.head)"
                 alt="">
            <span>{{numToPersent(itemInfo.similarity)}}</span>
          </div>
          <div class="middle">
            <p class="p1"><span>{{itemInfo.name}}</span> {{itemInfo.sex==1?'男':'女'}} {{itemInfo.age}}岁</p>
            <p class="pitem"><span>所属:</span>{{itemInfo.belong}}</p>
            <p class="pitem"><span>库:</span>{{itemInfo.targetName}}</p>
          </div>
          <div class="right">
            <p class="pitem"><span>时间:</span>{{itemInfo.happenedTime}}</p>
            <p class="pitem"><span>{{itemInfo.taskName}}/摄像头:</span>{{itemInfo.cameraName}}</p>
            <p class="pitem"><span>地点:</span>{{itemInfo.placeName}}</p>
          </div>
        </div>
        <div class="bottom">
          <img style="margin-right:10px;"
               :src="handleHead(itemInfo.snapshot)"
               alt="">
          <img :src="handleHead(itemInfo.snapshot)"
               alt="">
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import ImgUpload from '@/components/ImgUpload.vue'

export default {
  data() {
    return {
      dialogVisible: false,
      cameraArr: [],
      taskNamesArr: [],

      startEndTime: '',
      cameraId: '',
      taskNames: '',
      sex: '',
      startEndAge: '不限',
      similarity: '',
      targetId: '',
      sortType: 'asc', // desc
      sortField: 'time', // 时间time 视频源camera 目标target

      // list: '',
      list: '',
      total: 0,
      pageNum: 1,
      pageSize: 20,
      targetList: [],
      thresholdArr: [
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
      ageArr: [
        { label: '0-10' },
        { label: '11-20' },
        { label: '21-30' },
        { label: '31-40' },
        { label: '41-50' },
        { label: '51-60' },
        { label: '61-70' },
        { label: '71-80' },
        { label: '81-90' },
        { label: '91-100' },
        { label: '不限' },
      ],
      itemInfo: {},
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
      this.sex = ''
      this.startEndAge = '不限'
      this.similarity = ''
      this.targetId = ''
      this.sortType = 'asc'
      this.sortField = 'time'
    },
    searchList() {
      this.pageNum = 1
      this.pageSize = 20
      this.getList()
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
    getList() {
      if (!this.startEndTime) {
        this.startEndTime = ['', '']
      }
      let ages = []
      if (this.startEndAge == '不限') {
        ages = ['', '']
      } else {
        ages = this.startEndAge.split('-').map(item => {
          return Number(item)
        })
      }

      let objData = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        taskId: this.taskNames,
        cameraId: this.cameraId,
        targetId: this.targetId,
        similarity: this.similarity,
        sex: this.sex,
        sortType: this.sortType,
        sortField: this.sortField,
        startAge: ages[0],
        endAge: ages[1],
        startTime: this.startEndTime[0],
        endTime: this.startEndTime[1],
      }

      objData = this.deleteEmptyKey(objData)
      this.$tools.get('api/data/alarms', objData).then(res => {
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
    showBigImg(item) {
      this.itemInfo = item
      this.dialogVisible = true
    },
    numToPersent(v) {
      return ((Number(v) * 100).toFixed(1)) + '%'
    },

    handleHead(val) {
      return `/api/common/download?path=${val}&Token=${window.sessionStorage.getItem('aiFaceToken')}`;
    },
    getTargetList() {
      this.$tools.get('api/target/tree').then(res => {
        let arr = res.data[0].children
        let arr2 = []
        arr.forEach(ele => {
          ele.children.forEach(item => {
            arr2.push(item)
          })
        })
        this.targetList = arr2;
      })
    },
  },
  created() {
    this.getTaskList()
    this.getTargetList()
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
    // height: 150px;
    padding-left: 120px;
    position: relative;
    .title,
    .title2 {
      position: absolute;
      top: 6px;
      left: 0;
      font-size: 20px;
      color: #2f224d;
      font-weight: 600;
    }
    .title2 {
      top: 106px;
    }
    .form-box {
      // height: 150px;
      .form-line {
        font-size: 0;
        text-align: left;
      }
      .form-line-middle {
        margin-top: 60px;
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
  margin-right: 50px;
  // width: 316px;
  .label {
    display: inline-block;
    color: #2f224d;
    font-size: 16px;
    // margin-right: 20px;
    height: 40px;
    width: 60px;
    text-align: left;
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
    .mlb12 {
      margin-right: 12px;
      margin-bottom: 12px;
      float: left;
    }
  }
}

.bigimg-box {
  .top {
    width: 810px;
    height: 134px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 4px 16px 0px rgba(47, 34, 77, 0.1);
    border-radius: 6px;
    margin-bottom: 20px;
    padding: 20px;
    > div {
      float: left;
    }
    .left {
      width: 192px;
      height: 100%;
      margin-right: 20px;
      position: relative;
      text-align: left;
      > span {
        position: absolute;
        left: 76px;
        top: 27px;
        width: 40px;
        height: 40px;
        color: #671eff;
        font-size: 14px;
        text-align: center;
        line-height: 40px;
        font-weight: 600;
        border-radius: 50%;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
      }
      > img {
        width: 94px;
        height: 94px;
      }
      .img1 {
        margin-right: 4px;
      }
      .img-border {
        width: 86px;
        height: 86px;
        position: absolute;
        top: 4px;
        left: 4px;
      }
    }
    .middle,
    .right {
      height: 100%;
      padding-top: 6px;
      font-size: 14px;
      text-align: left;
      color: #5b546c;
      width: 233px;
      .p1 {
        height: 22px;
        line-height: 22px;
        margin-bottom: 12px;
        > span {
          font-weight: 700;
          font-size: 16px;
        }
      }
      > .pitem {
        line-height: 20px;
        margin-bottom: 8px;
        > span {
          color: #a9a3b8;
          padding-right: 10px;
        }
      }
    }
    .right {
      padding-top: 10px;
    }
  }
  .bottom {
    height: 300px;
    > img {
      width: 400px;
      height: 300px;
    }
  }
}

// 复用块
.item-bigbox {
  width: 396px;
  height: 163px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 10px 0px rgba(227, 224, 235, 0.7);
  border-radius: 6px;
  padding: 0 14px;
  font-size: 12px;
  color: #2f224d;
  .top {
    height: 44px;
    padding-right: 190px;
    border-bottom: 1px solid rgba(242, 240, 247, 1);
    position: relative;
    padding-top: 14px;
    line-height: 20px;
    margin-bottom: 10px;
    .time {
      position: absolute;
      right: 36px;
      top: 14px;
      font-size: 14px;
      color: #857b9d;
    }
    .img-tobig {
      position: absolute;
      width: 16px;
      height: 16px;
      top: 16px;
      right: 0;
      cursor: pointer;
    }
    .title {
      width: 100%;
      font-size: 14px;
      text-align: left;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .content {
    height: 94px;
    padding-left: 206px;
    position: relative;
    padding-top: 2px;
    .img-left-box {
      position: absolute;
      width: 94px;
      height: 94px;
      position: absolute;
      top: 0;
      left: 0;
      > .img-left {
        width: 100%;
        height: 100%;
      }
      .img-border {
        position: absolute;
        width: 86px;
        height: 86px;
        top: 4px;
        left: 4px;
      }
    }
    .img-right {
      position: absolute;
      width: 94px;
      height: 94px;
      top: 0;
      left: 98px;
    }
    .percnet {
      position: absolute;
      text-align: center;
      line-height: 40px;
      font-weight: 600;
      left: 76px;
      top: 27px;
      z-index: 100;
      width: 40px;
      height: 40px;
      color: #671eff;
      font-size: 14px;
      border-radius: 50%;
      background: #fff;
    }
    .user-info {
      font-size: 14px;
      line-height: 20px;
      height: 20px;
      margin-bottom: 8px;
      text-align: left;
    }
    .item-p {
      height: 17px;
      text-align: left;
      line-height: 17px;
      font-size: 12px;
      margin-bottom: 6px;
      > span {
        display: inline-block;
        width: 34px;
        text-align: left;
        color: #c9c2d8;
      }
    }
    .item-p-last {
      margin-bottom: 0;
    }
  }
}
//

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
</style>
<style>
.form-item .el-input__inner {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 8px 0px rgba(227, 224, 235, 0.8);
  border-radius: 20px;
  border: none;
}
</style>

