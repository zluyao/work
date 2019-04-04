<template>
  <div class="search-all-box">
    <div class="select-box">
      <img-upload @sendFileData="getUploadData"></img-upload>
      <div class="actic-box">
        <p class="threshold-title">识别阈值</p>
        <el-select v-model="threshold"
                   class="threshold-value"
                   placeholder="请选择">
          <el-option v-for="(item,index) in thresholdArr"
                     :key="index"
                     :label="item.name"
                     :value="item.value">
          </el-option>
        </el-select>
        <div class="check-btn"
             @click="beginCheck"
             :class="{'active':targetIds.length&&threshold&&file}">开始检索</div>
      </div>
      <div class="choice-box">
        <div class="box-empty"
             @click="dialogVisible=true"
             v-if="!targetIds.length">
          <img src="../../assets/images/static_s.png"
               alt="">
          <p class="word">选择检索库</p>
        </div>
        <div class="box-has"
             v-else>
          <p class="rechoice-btn"
             @click="reChoice">重新选择</p>
          <div class="tag-box">
            <el-tag v-for="tag in targetIdsNode"
                    :key="tag.id"
                    size="mini"
                    @close="deleteTag(tag)"
                    closable>
              {{tag.name}}
            </el-tag>
          </div>
        </div>
      </div>
    </div>

    <div class="result-box"
         v-if="rows.length">
      <div class="top">
        <span class="word">检索结果</span>

        <!-- <div class="derive-all">
          <img src="../../assets/images/derive.png"
               alt="">
          <span>导出所有目标</span>
        </div>
        <div class="derive-one">
          <img src="../../assets/images/derive.png"
               alt="">
          <span>导出选中目标</span>
        </div> -->
      </div>
      <!-- <div class="list-box-empty">检索结果为空</div> -->
      <ul class="list-box">
        <li v-for="(item,index) in rows"
            :key="index"
            :class="{'active':false}">
          <img :src="handleHead(item.head)"
               alt="">
          <p class="name">{{reIndex(index+1)}} {{item.name}}</p>
          <span class="value">{{numToPersent(item.score)}}</span>
        </li>
      </ul>
    </div>

    <el-dialog title="选择检索库"
               :visible.sync="dialogVisible"
               @close="sureTree"
               top="10vh"
               class="tree-box"
               width="500px">
      <div style="max-height:450px;overflow-y: auto;">
        <el-tree :data="data2"
                 ref="tree"
                 :show-checkbox="true"
                 @check="treeSelect"
                 node-key="key"
                 :props="defaultProps">
        </el-tree>
      </div>
      <div class="btns">
        <span class="btn-blue btn-sure"
              @click="sureTree">确定</span>
        <span class="btn-yellow"
              @click="sureTree">取消</span>
      </div>

    </el-dialog>
  </div>
</template>
<script>
import ImgUpload from '@/components/ImgUpload.vue'
import { Stats } from 'fs';
export default {
  data() {
    return {
      file: '',
      targetIds: [],
      targetIdsNode: [],
      threshold: '',
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
      data2: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      dialogVisible: false,
      rows: [],
    }
  },
  components: {
    ImgUpload
  },
  methods: {
    getTargetTree() {
      this.$tools.get('api/target/tree').then(res => {
        this.data2 = res.data
      })
    },
    beginCheck() {
      if (!this.targetIds.length || !this.threshold || !this.file) {
        this.$message({
          type: 'error',
          message: '请填写',
        });
        return
      }
      this.$tools.post(`api/data/search/target?pageNum=1&pageSize=1000&targetIds=${this.targetIds.join(',')}&threshold=${this.threshold}`, {
        file: this.file,
      }, {}, 'form').then(res => {
        this.rows = res.data.rows;
      })
    },
    deleteTag(tag) {
      let i = this.targetIdsNode.indexOf(tag)
      this.targetIdsNode.splice(i, 1)
      this.targetIds.splice(i, 1)
    },
    treeSelect(a, b) {
      // console.log('选择', a, b)
      // this.targetIds = b.checkedKeys
      // this.targetIdsNode = b.checkedNodes

    },
    sureTree() {
      let b = this.$refs['tree'].getCheckedNodes(true)
      let c = this.$refs['tree'].getHalfCheckedNodes()
      console.log(111, b, c);
      this.targetIdsNode = b
      let arr = []
      b.forEach(v => {
        arr.push(v.id)
      });
      this.targetIds = arr

      this.dialogVisible = false
    },
    reChoice() {
      this.dialogVisible = true
      this.$refs['tree'].setCheckedNodes(this.targetIdsNode)
    },
    getUploadData(uploadData) {
      this.file = uploadData
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
    numToPersent(v) {
      return ((Number(v) * 100).toFixed(1)) + '%'
    },
    handleHead(val) {
      return `/api/common/download?path=${val}&Token=${window.sessionStorage.getItem('aiFaceToken')}`;
    },
  },
  created() {
    this.getTargetTree()
  },
  mounted() {
  },
  activated() {
  }
};
</script>
<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.search-all-box {
  padding-left: 40px;
  padding-top: 80px;
}
.select-box {
  height: 240px;
  > * {
    float: left;
  }
}
.actic-box {
  margin-left: 110px;
  margin-right: 110px;
  width: 172px;
  height: 100%;
  padding-top: 30px;
  .threshold-title {
    color: #2f224d;
    font-size: 20px;
    line-height: 28px;
    margin-bottom: 20px;
  }
  .threshold-value {
    margin-bottom: 60px;
  }
  .check-btn {
    margin: auto;
    cursor: pointer;
    width: 120px;
    height: 40px;
    color: #a9a2b9;
    font-size: 14px;
    font-weight: 700;
    line-height: 40px;
    text-align: center;
    background: rgba(229, 225, 235, 1);
    box-shadow: 0px 4px 16px 0px rgba(246, 245, 245, 1);
  }
  .check-btn.active {
    background: rgba(255, 221, 27, 1);
    box-shadow: 0px 4px 16px 0px rgba(255, 221, 27, 0.3);
    color: #2f224d;
  }
}
.choice-box {
  width: 240px;
  height: 240px;
  border-radius: 12px;
  cursor: pointer;
  border: 1px dashed rgba(133, 123, 157, 1);
  padding: 20px;
  text-align: center;
  .box-empty {
    height: 100%;
    padding-top: 48px;
    > img {
      width: 60px;
      height: 60px;
      margin-bottom: 30px;
    }
    > .word {
      font-size: 20px;
      color: #857b9d;
      font-weight: 700;
    }
  }
  .box-has {
    height: 100%;
    .rechoice-btn {
      width: 200px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      border-radius: 15px;
      border: 1px solid rgba(47, 34, 77, 1);
      font-size: 14px;
      color: #5b546c;
      margin-bottom: 20px;
    }
    .tag-box {
      height: 150px;
      width: 100%;
      overflow-y: auto;
    }
  }
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
      color: #5b546c;
      font-size: 16px;
      // font-weight: 600;
    }
  }
  .list-box-empty {
    text-align: left;
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
        bottom: 18px;
        left: 0;
        width: 100%;
        height: 20px;
        line-height: 20px;
        text-align: center;
        font-weight: 600;
        font-size: 14px;
        color: #5b546c;
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
.tree-box {
  .btns {
    margin-top: 70px;
    height: 40px;
    padding-left: 120px;
    > span {
      float: left;
    }
    .btn-sure {
      margin-right: 20px;
    }
  }
}
</style>
<style>
.threshold-value .el-input__inner {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 8px 0px rgba(227, 224, 235, 0.8);
  border-radius: 20px;
  border: none;
}
</style>
