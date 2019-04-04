<template >
  <div class="app-container goods-store">
    <!-- <p class="page-title">商品库</p> -->
    <ul class="one-box">
      <li @click="getTwolist('all')"
          :class="{'active':parentId=='all'}">全部</li>
      <li v-for="(item,index) in oneList"
          :key="index"
          :class="{'active':parentId==item.dictValue}"
          @click="getTwolist(item)">
        {{item.dictLabel}}
      </li>
    </ul>

    <ul class="two-box"
        v-if="isShowtwobox">
      <li @click="getProductlist('all')"
          :class="{'active':sonId=='all'}">全部</li>
      <li v-for="(item,index) in twoList"
          :key="index"
          :class="{'active':sonId==item.dictValue}"
          @click="getProductlist(item.dictValue)">
        {{item.dictLabel}}
      </li>
    </ul>

    <div class="content-box">
      <div class="total-box">
        <p class="num">筛选结果：共 <span> {{productList.length}} </span>款</p>
        <div class="sort-btns">
          <span class="item-btn btn-up active">价格<i></i></span>
          <span class="item-btn btn-up ">返点<i></i></span>
          <span class="item-btn">销量<i></i></span>
        </div>
      </div>
      <div class="itemp"
           v-for="(item,index) in productList"
           :key="index">
        <img class="comp-logo"
             :src="item.dictImg"
             alt="">
        <p class="pro-name">{{item.productName}}</p>
        <div class="itemp-left">
          <div class="tags-box">
            <div class="tag"
                 v-for="(itemtag,index2) in tags[index]"
                 :key="index2">{{itemtag}}</div>

          </div>
          <div class="schemes-box">
            <div class="schemes-box2"
                 :class="{
              'schemes-box4':item.schemeMapList.length==4,
              'schemes-box5':item.schemeMapList.length==5,
              'schemes-box6':item.schemeMapList.length==6,
              'schemes-box7':item.schemeMapList.length==7,
              'schemes-box8':item.schemeMapList.length==8,
              'schemes-box9':item.schemeMapList.length==9,
              'schemes-box22':isBig4(item.schemeMapList),
            }">
              <div class="scheme "
                   v-for="(items,index) in item.schemeMapList">
                <div class="scheme-name ">{{items.schemeName}}</div>
                <p v-for="(itemrep,index) in items.responseList"
                   :key="index">{{itemrep.responseName}}：{{itemrep.responseMoney}}元</p>
              </div>
            </div>

          </div>
        </div>

        <div class="itemp-right">
          <div class="sort-content">
            <span class="price avtive">￥：{{item.floorPrice}}</span>
            <span class="backp">返点：20%</span>
            <span class="sell">销量：251</span>
          </div>

          <div class="img-box">
            <!-- <img src="../../../../assets/images/code.png"
                 alt=""> -->
            <qrcode class="img"
                    :value="item.h5Url+'?supplierUserId='+supplierUserId"
                    :options="{ size: 500 }"></qrcode>
          </div>
          <div class="cope-btn"
               @click="copeUrl(index,item.h5Url)">复制地址</div>

          <p class="img-word">
            微信扫码打开
          </p>
          <div class="btns-box">
            <span class="sc"
                  @click="collectPro(item)">{{item.isCollect==0?'收藏':'已收藏'}}</span>
            <span class="detail"
                  @click="toDetail(item.h5Url)">查看详情</span>
            <textarea :id="'input'+index"
                      class="input">{{item.h5Url}}?supplierUserId={{supplierUserId}}</textarea>

          </div>
        </div>

      </div>

    </div>

  </div>
</template>
<script>
import qrcode from '@xkeshi/vue-qrcode';
export default {
  data() {
    return {
      oneList: [],
      twoList: [],
      parentId: 'all',
      sonId: 'all',
      isShowtwobox: false,

      productList: [],
      tags: [],
      supplierUserId: localStorage.getItem('id')
    }
  },
  components: {
    qrcode
  },
  created() {
    this.getOnelist();
    this.getProductlist('all');
  },
  mounted() {

  },
  methods: {
    copeUrl(index) {
      let input = document.getElementById(`input${index}`);
      input.select();
      document.execCommand("copy");
    },
    collectPro(item) {
      this.$get(`${this.baseUrls}/mygood/front/v1/collect`, {
        productId: item.productId,
      }).then((res) => {
        this.$message({
          type: 'success',
          message: '操作成功',
        });
        this.getProductlist(this.sonId);
      })

    },
    getOnelist() {
      this.$get(`${this.baseUrls}/dictData/front/dictData/all`, {
        dictType: 'insure_type_one',
        isValid: 1,
      }).then((res) => {
        this.oneList = res.data;
      })
    },

    getTwolist(v) {
      this.sonId = 'all';
      if (v == 'all') {
        this.parentId = v;
        this.getProductlist(this.sonId);
        this.twoList = [];
        this.isShowtwobox = false;
        return;
      }
      this.parentId = v.dictValue;
      this.getProductlist(this.sonId);
      this.isShowtwobox = true;
      this.$get(`${this.baseUrls}/dictData/front/v1/getByParentId`, {
        parentId: v.id,
      }).then((res) => {
        this.twoList = res.data;
      })
    },
    toDetail(href) {
      let that = this;
      window.open(`${href}?isPc=1&supplierUserId=${that.supplierUserId}`);
    },
    getProductlist(v) {
      this.sonId = v;
      let typeOne = this.parentId == 'all' ? '' : this.parentId;
      let typeTwo = this.sonId == 'all' ? '' : this.sonId;

      let tags = [];
      this.$get(`${this.baseUrlh}/mygood/front/v1/goodList`, {
        queryStr: '',
        typeOne: typeOne,
        typeTwo: typeTwo,
        orderBy: 'floor_price desc',
      }).then((res) => {
        let { data } = res;
        data.forEach(item => {
          item.productTag2 = item.productTag.split(',');
          tags.push(item.productTag.split(','));
        });
        // data.productTag = data.productTag.split(',');

        this.productList = data;
        this.tags = tags;
      })
    },
    isBig4(arr) {
      let flag = false;

      for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        if (element.responseList.length > 4) {
          flag = true;
        }
      }
      return flag;
    },

  },
}
</script>

<style scoped rel="stylesheet/scss" lang="scss">
.app-container {
  padding: 0;
}
.goods-store {
  background: #f9f9fa;
  min-height: 100%;
  padding-bottom: 100px;
}
.one-box {
  height: 86px;
  padding: 30px 0 20px 40px;
  overflow: hidden;

  > li {
    cursor: pointer;
    float: left;
    height: 36px;
    line-height: 36px;
    text-align: center;
    padding: 0 16px;

    margin-right: 18px;
    font-size: 14px;
    color: #8f9298;
  }
  > li.active {
    font-weight: 700;
    color: #fff;
    background: linear-gradient(
      90deg,
      rgba(247, 127, 102, 1) 0%,
      rgba(255, 87, 87, 1) 100%
    );
    border-radius: 4px;
  }
}

.two-box {
  height: 86px;
  padding: 30px 0 30px 50px;
  overflow: hidden;
  border-top: 1px solid #eeeeef;
  > li {
    cursor: pointer;
    float: left;
    height: 26px;
    text-align: center;
    padding: 0 6px 12px;
    margin-right: 38px;
    font-size: 14px;
    color: #8f9298;
    position: relative;
  }
  > li.active {
    font-weight: 700;
    color: #ff5757;
    border-bottom: 2px solid #ff5757;
  }
}
.content-box {
  padding: 0 50px 0 40px;
  .total-box {
    height: 50px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 4px 10px 0px rgba(212, 216, 227, 0.3);
    margin-bottom: 5px;
    position: relative;
    overflow: hidden;
    .num {
      padding-left: 40px;
      float: left;
      height: 50px;
      line-height: 50px;
      font-size: 14px;
      color: #212326;
      > span {
        color: #ff5757;
      }
    }
    .sort-btns {
      position: absolute;
      top: 15px;
      right: 20px;
      height: 20px;
      line-height: 20px;
      overflow: hidden;
      .item-btn {
        float: left;
        height: 20px;
        font-size: 14px;
        color: #8f9298;
        padding-right: 18px;
        margin-right: 30px;
        position: relative;
        cursor: pointer;
        > i {
          position: absolute;
          right: 0;
          top: 8px;
          width: 12px;
          height: 12px;
          border: 5px solid transparent;
          border-top: 5px solid #8f9298;
        }
      }
      .item-btn.active {
        > i {
          border-top: 5px solid #ff5757;
        }
      }
    }
  }
  .itemp {
    // height: 300px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 10px 0px rgba(212, 216, 227, 0.15);
    margin-bottom: 30px;
    padding: 56px 40px 50px 30px;
    overflow: hidden;
    position: relative;

    .comp-logo {
      position: absolute;
      // width: 84px;
      height: 32px;
      top: 56px;
      right: 50px;
    }
    .pro-name {
      height: 22px;
      line-height: 22px;
      font-size: 16px;
      color: #212135;
      font-weight: 700;
      position: relative;
      margin-bottom: 42px;
      &::after {
        content: "";
        position: absolute;
        bottom: -10px;
        left: 0;
        width: 40px;
        height: 1px;
        background: #eee;
      }
    }

    .itemp-right {
      float: right;
      position: relative;
      width: 260px;
      height: 340px;
      padding-top: 5px;
      .sort-content {
        position: absolute;
        top: 0;
        right: 0;
        height: 20px;
        line-height: 20px;
        color: #8f9298;
        font-size: 14px;
        > span {
          margin-right: 10px;
        }
        > span.avtive {
          color: #ff5757;
        }
      }
      .img-box {
        position: absolute;
        // top: 95px;
        top: 70px;
        right: 30px;
        height: 140px;
        width: 140px;
        > img {
          height: 140px;
          width: 140px;
        }
        > .img {
          height: 140px;
          width: 140px;
        }
      }
      .cope-btn {
        position: absolute;
        top: 250px;
        right: 60px;
        width: 80px;
        height: 26px;
        border-radius: 24px;
        border: 1px solid rgba(173, 177, 184, 1);
        color: #adb1b8;
        font-size: 14px;
        line-height: 26px;
        text-align: center;
        cursor: pointer;
      }
      .img-word {
        position: absolute;
        top: 220px;
        right: 58px;
        height: 14px;
        font-size: 14px;
        line-height: 14px;
        color: #212326;
        font-weight: 700;
      }
      .btns-box {
        > .input {
          position: absolute;
          right: 3000px;
        }
        > span {
          position: absolute;
          top: 309px;
          line-height: 36px;
          height: 36px;
          width: 90px;
          color: #fff;
          font-size: 14px;
          text-align: center;
          background: #ff5757;
          cursor: pointer;
        }
        > span.sc {
          right: 0;
          background: #fff;
          border: 1px solid #ff5757;
          color: #ff5757;
        }
        .detail {
          right: 110px;
        }
      }
    }
    .itemp-left {
      float: left;
      width: 768px;
      .tags-box {
        width: 768px;
        overflow: hidden;
        // padding-left: 50px;
        .tag {
          float: left;
          height: 30px;
          line-height: 30px;
          color: #fff;
          font-size: 14px;
          padding: 0 12px;
          background: rgba(191, 197, 209, 1);
          border-radius: 4px;
          margin-right: 20px;
          margin-bottom: 20px;
        }
      }

      .schemes-box {
        width: 768px;
        height: 244px;
        // overflow: hidden;
        overflow-x: auto;
        position: relative;
        .schemes-box2 {
          height: 244px;
          // width: 790px;
          width: 100%;
          overflow-y: auto;
          overflow-x: auto;
          &::after {
            content: "";
            display: block;
            height: 0;
            clear: both;
          }
          .scheme {
            width: 256px;
            margin-bottom: 15px;
            float: left;
            font-size: 14px;
            position: relative;
            .scheme-name {
              padding-left: 15px;
              height: 60px;
              line-height: 60px;
              color: #212326;
              margin-bottom: 13px;
              position: relative;
              background: #fffafa;
            }
          }
          .scheme p {
            padding-left: 15px;
            color: #8f9298;
            margin-bottom: 30px;
          }
          .scheme p:last-of-type {
            margin-bottom: 0;
          }
        }

        .schemes-box22 {
          width: 790px;
        }
        .schemes-box4 {
          width: 1048px;
        }
        .schemes-box5 {
          width: 1304px;
        }
        .schemes-box6 {
          width: 1560px;
        }
        .schemes-box7 {
          width: 1816px;
        }
        .schemes-box8 {
          width: 20172px;
        }
        .schemes-box9 {
          width: 2328px;
        }
      }
    }
  }
}

::-webkit-scrollbar {
  width: 4px; /*对垂直流动条有效*/
  height: 4px; /*对水平流动条有效*/
}
/*垂直滚动条的按钮*/
::-webkit-scrollbar-button:vertical {
  display: none;
}

::-webkit-scrollbar-button:horizontal {
  display: none;
}

/*显示滚动条上方的渐增按钮*/
::-webkit-scrollbar-button:start:decrement,
::-webkit-scrollbar-button:end:increment {
  display: none;
}

/* 垂直滚动条的滑动块 */
::-webkit-scrollbar-thumb:vertical {
  // background-color: rgba(0, 0, 0, 0.05);
  background-color: #fff;
  &:hover {
    // background-color: rgba(0, 0, 0, 0.05);
    background-color: #fff;
  }
}

::-webkit-scrollbar-thumb:horizontal {
  background-color: rgba(0, 0, 0, 0.02);
  // background-color: #fff;
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
}
</style>
