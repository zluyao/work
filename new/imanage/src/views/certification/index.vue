<template>
  <div class="app-container">
    <p class="page-title">认证审核</p>
    <div class="search">
      <el-form :inline="true"
               :model="formInline"
               class="demo-form-inline">
        <el-form-item label="条件"
                      class="keyword-search">
          <el-input v-model="formInline.keyword"
                    width="100"
                    size="mini"
                    @keyup.enter.native="getList"
                    placeholder=""></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="danger"
                     size="mini"
                     @click="search">搜索</el-button>
        </el-form-item>

      </el-form>
    </div>

    <el-table :data="dataSource"
              stripe
              border
              style="width: 100%">
      <el-table-column type="index"
                       width="50">
      </el-table-column>
      <el-table-column prop="companyName"
                       width="200"
                       label="主体全称">
      </el-table-column>
      <el-table-column prop="username"
                       label="联系电话">
      </el-table-column>

      <el-table-column prop="name"
                       label="真实姓名">
      </el-table-column>
      <el-table-column prop="submitTime"
                       width="180"
                       label="提交时间">
      </el-table-column>
      <el-table-column prop="passTime"
                       width="180"
                       label="认证时间">
      </el-table-column>
      <el-table-column prop="statusStr"
                       width="110"
                       label="认证状态">
      </el-table-column>

      <el-table-column label="操作"
                       fixed="right"
                       width="160">
        <template slot-scope="scope">
          <el-button @click="editItem(scope.row)"
                     type="primary"
                     size="mini">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="page-pagination">
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="pageIndex"
                     :page-sizes="[6,10,20,30,50]"
                     :page-size="pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </div>

    <div class="preimg"
         v-if="isShowBig"
         @click="isShowBig=false">
      <img @click="clickBigpic($event)"
           :src="authInfodetail.licenseImg"
           alt="">
    </div>

    <!-- 弹窗 -->
    <el-dialog title='认证审核'
               width="60%"
               top="10vh"
               class="certdetail-box"
               :visible.sync="dialogVisible">
      <span>
        <div class="item">
          <span class="itemname">联系人电话<b>*</b></span>
          <div class="itemval">{{authInfodetail.username}}</div>
        </div>
        <div class="item">
          <span class="itemname">真实姓名<b>*</b></span>
          <div class="itemval">{{authInfodetail.name}}</div>
        </div>
        <div class="item">
          <span class="itemname itemname-title">企业信息</span>
          <div class="itemval">{{authInfodetail.statusStr}}</div>
        </div>
        <div class="item">
          <span class="itemname">主体全称<b>*</b></span>
          <div class="itemval">{{authInfodetail.companyName}}</div>
        </div>
        <div class="item itemimg">
          <span class="itemname ">企业营业执照<b>*</b></span>
          <div class="itemval">
            <img @click="showBigpic"
                 class="itempic"
                 :src="authInfodetail.licenseImg"
                 alt="">
          </div>
        </div>
        <div class="item">
          <span class="itemname">服务费发票类型<b>*</b></span>
          <div class="itemval">{{authInfodetail.invoiceType==1?'增值税专用发票':'普通发票'}}</div>
        </div>
        <div class="item">
          <span class="itemname">发票税点<b>*</b></span>
          <div class="itemval">{{authInfodetail.taxPoint}}%</div>
        </div>
        <div class="item">
          <span class="itemname">所属城市<b>*</b></span>
          <div class="itemval">{{getCity(authInfodetail.city)}}</div>
        </div>
        <div class="item">
          <span class="itemname">详细地址<b>*</b></span>
          <div class="itemval">{{authInfodetail.address}}</div>
        </div>
        <div class="item">
          <span class="itemname">固定电话<b>*</b></span>
          <div class="itemval">{{authInfodetail.fixedPhone}}</div>
        </div>
        <div class="item">
          <span class="itemname itemname-title">财务信息</span>
        </div>
        <div class="item">
          <span class="itemname">户名<b>*</b></span>
          <div class="itemval">{{authInfodetail.accountName}}</div>
        </div>
        <div class="item">
          <span class="itemname">开户地址<b>*</b></span>
          <div class="itemval">{{authInfodetail.bankAddress}}</div>
        </div>
        <div class="item">
          <span class="itemname">开户银行<b>*</b></span>
          <div class="itemval">{{authInfodetail.bankName}}</div>
        </div>
        <div class="item">
          <span class="itemname">银行卡号<b>*</b></span>
          <div class="itemval">{{authInfodetail.bankNum}}</div>
        </div>
      </span>
      <span slot="footer"
            v-if="isAuthed"
            class="dialog-footer">
        <el-button @click="sureinfo(1)"
                   type="success">通 过</el-button>
        <el-button @click="sureinfo(0)"
                   type="danger">拒 绝</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import provice from '@/utils/city.json'
export default {

  data() {
    return {
      provice: provice,
      isShowBig: false,
      isAuthed: false,
      authInfodetail: {},
      formInline: {
        keyword: '',
      },
      pageIndex: 1,
      pageSize: 6,
      dataSource: [],
      total: 0,
      dialogVisible: false,
    }
  },
  created() {
    this.getList();
  },
  methods: {
    handleSizeChange(v) {
      this.pageSize = v;
      this.getList();
    },
    handleCurrentChange(v) {
      this.pageIndex = v;
      this.getList();
    },

    clickBigpic(event) {
      event.stopPropagation();
    },
    showBigpic() {
      this.isShowBig = true;
    },
    search() {
      this.pageIndex = 1;
      this.getList();
    },
    getCity(str) {
      if (!str) {
        return ''
      }
      const arr = str.split(',');
      return `${this.provice[Number(arr[0])].name}${this.provice[Number(arr[0])].children[arr[1]].name}`
    },
    editItem(row) {
      // this.$get(`${this.baseUrlh}/user/front/getUser?userId=${row.userId}`).then((res) => {
      // })
      this.$get(`${this.baseUrlh}/user/front/v1/getCertification?userId=${row.userId}`).then((res) => {
        this.authInfodetail = res.data;
        this.isAuthed = res.data.status == 2 ? true : false;
        this.dialogVisible = true;
      })
    },
    sureinfo(v) {
      this.$get(`${this.baseUrlh}/user/front/v1/certificate`, {
        userId: this.authInfodetail.userId,
        isPass: v,
      }).then((res) => {
        this.$message({
          type: 'success',
          message: v == 1 ? '通过审核' : '拒绝审核'
        });
        this.getList();
        this.dialogVisible = false;
      })
    },
    getList() {
      this.$get(`${this.baseUrlh}/user/front/v1/certificationList?pageSize=${this.pageSize}`, {
        queryStr: this.formInline.keyword.replace(/\s+/g, ''),
        pageIndex: this.pageIndex,
      }).then((res) => {
        this.dataSource = res.data;
        this.total = res.totalCount;
      })
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.certdetail-box {
  .item {
    height: 30px;
    line-height: 30px;
    font-size: 15px;
    margin-bottom: 10px;
    position: relative;
    padding-left: 150px;
    .itemname {
      position: absolute;
      height: 30px;
      line-height: 30px;
      text-align: left;
      top: 0;
      left: 0;
      > b {
        color: #ff5757;
      }
    }
    .itemname-title {
      color: #000;
      font-weight: 700;
    }
  }
  .itemimg {
    height: 80px;
    .itempic {
      cursor: pointer;
      width: 120px;
      height: 80px;
    }
  }
}
.preimg {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 8000;
  background: #000;
  cursor: pointer;
  > img {
    cursor: default;
    width: 900px;
    height: 600px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -300px;
    margin-left: -450px;
  }
}
</style>
