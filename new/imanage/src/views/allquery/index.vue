<template>
  <div class="app-container">
    <p class="page-title">查询条件</p>
    <el-form ref="form"
             :model="form"
             :inline="true"
             size="mini"
             label-width="70px">
      <p class="item-title">客户信息：</p>
      <el-form-item label="手机号">
        <el-input v-model="form.insurePhoneNum"
                  placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="form.insureUserName"
                  placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="证件类型">
        <el-select v-model="form.insureCertificateType"
                   placeholder="请选择">
          <el-option v-for="(item,index) in certificateTypeList"
                     :key="index"
                     :label="item.value"
                     :value="item.code" />
          <el-option label="不限"
                     :value="null"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="证件号">
        <el-input v-model="form.insureCertificateNum"
                  placeholder="请输入证件号" />
      </el-form-item>
      <p class="item-title"
         v-if="authZd.hospital">医院信息：</p>
      <el-form-item label="医院编号"
                    v-if="authZd.hospital">
        <el-input placeholder="请输入医院编号"
                  v-model="form.hosp" />
      </el-form-item>
      <p class="item-title"
         v-if="authZd.insure_source||authZd.insure_channel">投保&销售方式：</p>
      <el-form-item label="投保方式"
                    v-if="authZd.insure_source">
        <el-select v-model="form.insureSource"
                   placeholder="请选择投保方式">
          <el-option v-for="(item,index) in sourceList"
                     :key="index"
                     :label="item.value"
                     :value="item.code" />
          <el-option label="不限"
                     :value="null"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="销售方式"
                    v-if="authZd.insure_channel">
        <el-select v-model="form.insureChannel"
                   placeholder="请选择销售方式">
          <el-option v-for="(item,index) in channelList"
                     :key="index"
                     :label="item.value"
                     :value="item.code" />
          <el-option label="不限"
                     :value="null"></el-option>
        </el-select>
        <el-select placeholder="请选择合作渠道"
                   v-model="form.insureSource2">
          <!-- <el-option label="无"
                     value="1" /> -->
        </el-select>
        <el-select placeholder="请选择二级合作渠道"
                   v-model="form.insureSource3">
          <!-- <el-option label="无"
                     value="1" /> -->
        </el-select>
      </el-form-item>
      <p class="item-title">订单&保单信息：</p>
      <el-form-item label="订单号"
                    width="160px">
        <el-input v-model="form.orderNum"
                  placeholder="请输入订单号" />
      </el-form-item>
      <el-form-item label="订单状态">
        <el-select placeholder="请选择订单状态"
                   v-model="form.orderState">
          <el-option v-for="(item,index) in orderStateList"
                     :key="index"
                     :label="item.value"
                     :value="item.code" />
          <el-option label="不限"
                     :value="null"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="保单号">
        <el-input v-model="form.billNum"
                  placeholder="请输入保单号" />
      </el-form-item>
      <el-form-item label="保单状态">
        <el-select v-model="form.billState"
                   placeholder="请选择保单状态">
          <el-option v-for="(item,index) in billStateList"
                     :key="index"
                     :label="item.value"
                     :value="item.code" />
          <el-option label="不限"
                     :value="null"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="理赔状态"
                    v-if="authZd.claim_state">
        <el-select v-model="form.lipeiState"
                   placeholder="请选择理赔状态">
          <!-- <el-option label="无"
                     value="1" /> -->
        </el-select>
      </el-form-item>
      <el-form-item label="供应商"
                    v-if="authZd.insure_compa">
        <el-select v-model="form.insureCompany"
                   placeholder="请选供应商">
          <el-option v-for="(item,index) in companyList"
                     :key="index"
                     :label="item.dictLabel"
                     :value="item.dictValue" />
          <el-option label="不限"
                     :value="null"></el-option>

        </el-select>
      </el-form-item>
      <p class="item-title">时间条件：</p>
      <el-form-item label="起始时间">
        <el-date-picker v-model="form.insureBeginDate"
                        type="date"
                        format="yyyy 年 MM 月 dd 日"
                        value-format="yyyy-MM-dd"
                        placeholder="请选择起始时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="截止时间">
        <el-date-picker v-model="form.insureEndDate"
                        type="date"
                        format="yyyy 年 MM 月 dd 日"
                        value-format="yyyy-MM-dd"
                        placeholder="请选择截止时间">
        </el-date-picker>
      </el-form-item>

      <div>
        <el-form-item>
          <el-button type="danger"
                     @click="search">查询</el-button>
          <el-button @click="clear">清空</el-button>
        </el-form-item>
      </div>

    </el-form>

    <div class="table-line"></div>
    <el-table :data="dataSource"
              stripe
              border
              style="width: 100%">
      <el-table-column type="index"
                       width="50">
      </el-table-column>
      <el-table-column prop="insurePhoneNum"
                       width="110"
                       label="手机号">
      </el-table-column>
      <el-table-column prop="insureBeginDateStr"
                       width="100"
                       label="投保时间">
      </el-table-column>
      <el-table-column prop="orderNum"
                       width="120"
                       label="订单号">
      </el-table-column>
      <el-table-column prop="orderStateStr"
                       label="订单状态">
      </el-table-column>

      <el-table-column prop="userName"
                       label="投保人">

      </el-table-column>
      <el-table-column prop=""
                       width="170"
                       label="证件号">
        <template slot-scope="scope">
          <span>
            {{scope.row.insureCertificateTypeStr}}: {{scope.row.insureCertificateNum}}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="userName"
                       width="170"
                       label="被保人">
        <template slot-scope="scope">
          <span>
            {{scope.row.protectUserName}} ({{scope.row.protectCertificateTypeStr}}: {{scope.row.protectCertificateNum}})
          </span>
        </template>
      </el-table-column>

      <el-table-column prop="insureBillNum"
                       width="120"
                       label="保单号">
      </el-table-column>
      <el-table-column prop="billStateStr"
                       label="保单状态">
      </el-table-column>
      <el-table-column prop="productName"
                       width="110px"
                       label="商品名称">
      </el-table-column>
      <el-table-column prop="insureCompa"
                       v-if="authZd.insure_compa"
                       label="供应商">
      </el-table-column>
      <el-table-column prop="insurePayMoneyDecimal"
                       label="保费">
      </el-table-column>

      <el-table-column prop=""
                       label="销售方式">
        <template slot-scope="scope">
          <span>
            {{scope.row.insureChannelStr}} ({{scope.row.companyName}}: {{scope.row.insureSourceStr}})
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="insureSourceStr"
                       label="投保方式">
      </el-table-column>
      <el-table-column prop="inversePoint"
                       label="返点率">
      </el-table-column>
     
      <el-table-column label="操作"
                       fixed="right"
                       width="100">
        <template slot-scope="scope">
          <el-button @click="getinfo(scope.row)"
                     type="danger"
                     size="mini">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="page-pagination">
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="pageNo"
                     :page-sizes="[6,10,20,30,50]"
                     :page-size="pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </div>

    <!-- dialogform -->
    <el-dialog title='订单详情'
               class="diareset"
               width="80%"
               :visible.sync="dialogVisible">
      <div class="plate plate1">
        <p class="title-name">{{detail.insureProduct.productName}}</p>
        <div class="itemp-box">
          <div class="itemp itemp90"><span class="sp1">供应商：</span><span class="sp2">{{detail.insureProduct.insureTypes[0].insureCompa}}</span></div>
          <div class="itemp itemp90"><span class="sp1">订单号：</span><span class="sp2"> {{detail.orderNum}}</span></div>
          <div class="itemp itemp90"><span class="sp1">投保日期：</span><span class="sp2">{{detail.billPcDetailVo.insureBeginDateStr}}</span></div>
          <div class="itemp itemp90"><span class="sp1">订单状态：</span><span class="sp2">{{detail.orderStateStr}}</span></div>
        </div>
      </div>
      <div class="line-bg"></div>
      <div class="plate">
        <p class="title-plate">基本信息</p>
        <div class="itemp-box">
          <div class="itemp"><span class="sp1">保单号：</span><span class="sp2">{{detail.billPcDetailVo.insureBillNum}}</span></div>
          <div class="itemp"><span class="sp1">保单状态：</span><span class="sp2">{{detail.billPcDetailVo.billStateStr}}</span></div>
          <div class="itemp"><span class="sp1">销售方式：</span><span class="sp2">{{detail.insureChannelStr}}</span></div>
          <div class="itemp"><span class="sp1">投保方式：</span><span class="sp2">{{detail.insureSourceStr}}</span></div>
        </div>
      </div>
      <div class="line-bg"></div>
      <div class="plate">
        <p class="title-plate">投保人信息</p>
        <div class="itemp-box">
          <div class="itemp"><span class="sp1">姓名：</span><span class="sp2">{{detail.insureUserName}}</span></div>
          <div class="itemp"><span class="sp1">客户号：</span><span class="sp2">{{detail.insureUserId}}</span></div>
          <div class="itemp"><span class="sp1">证件类型：</span><span class="sp2">{{detail.insureCertificateTypeStr}}</span></div>
          <div class="itemp"
               v-if="authZd.insure_certificate_num"><span class="sp1">证件号：</span><span class="sp2">{{detail.insureCertificateNum}}</span></div>
          <div class="itemp"><span class="sp1">性别：</span><span class="sp2">{{detail.sexStr}}</span></div>
          <div class="itemp"
               v-if="authZd.insure_birthday"><span class="sp1">出生日期：</span><span class="sp2">{{detail.insureBirthdayStr}}</span></div>
          <div class="itemp"
               v-if="authZd.insure_phone_num"><span class="sp1">手机号：</span><span class="sp2">{{detail.insurePhoneNum}}</span></div>
          <div class="itemp"
               v-if="authZd.insure_email"><span class="sp1">邮箱：</span><span class="sp2">{{detail.insureEmail}}</span></div>
          <div class="itemp"
               v-if="authZd.insure_address"><span class="sp1">地址：</span><span class="sp2">-</span></div>
          <div class="itemp"><span class="sp1">详细地址：</span><span class="sp2">-</span></div>
          <div class="itemp"><span class="sp1">与被保人关系：</span><span class="sp2">{{detail.billPcDetailVo.insureRelationshipStr}}</span></div>
          <div class="itemp"><span class="sp1">应交保费：</span><span class="sp2">{{detail.insurePayMoneyDecimal}}</span></div>
          <div class="itemp"><span class="sp1">保费状态：</span><span class="sp2">{{detail.orderStateStr}}</span></div>
        </div>
      </div>
      <div class="line-bg"
           v-if="authZd.trade_info"></div>
      <div class="plate"
           v-if="authZd.trade_info">
        <p class="title-plate">交易信息-投保人</p>
        <div class="itemp-box">
          <div class="itemp"><span class="sp1">交易方式：</span><span class="sp2">-</span></div>
          <div class="itemp"><span class="sp1">服务商：</span><span class="sp2">-</span></div>
          <div class="itemp"><span class="sp1">户名：</span><span class="sp2">-</span></div>
          <div class="itemp"><span class="sp1">证件类型：</span><span class="sp2">-</span></div>
          <div class="itemp"><span class="sp1">证件号：</span><span class="sp2">-</span></div>
          <div class="itemp"><span class="sp1">付款账号：</span><span class="sp2">-</span></div>
          <div class="itemp"><span class="sp1">付款金额：</span><span class="sp2">-</span></div>
          <div class="itemp"><span class="sp1">付款日期：</span><span class="sp2">-</span></div>
        </div>
      </div>
      <div class="line-bg"
           v-if="authZd.trade_info"></div>
      <div class="plate"
           v-if="authZd.trade_info">
        <p class="title-plate">交易信息-收款人</p>
        <div class="itemp-box">
          <div class="itemp"><span class="sp1">交易方式：</span><span class="sp2">-</span></div>
          <div class="itemp"><span class="sp1">服务商：</span><span class="sp2">-</span></div>
          <div class="itemp"><span class="sp1">户名：</span><span class="sp2">-</span></div>
          <div class="itemp"><span class="sp1">证件类型：</span><span class="sp2">-</span></div>
          <div class="itemp"><span class="sp1">证件号：</span><span class="sp2">-</span></div>
          <div class="itemp"><span class="sp1">收款账号：</span><span class="sp2">-</span></div>
          <div class="itemp"><span class="sp1">收款金额：</span><span class="sp2">-</span></div>
          <div class="itemp"><span class="sp1">收款日期：</span><span class="sp2">-</span></div>
        </div>
      </div>
      <div class="line-bg"
           v-if="authZd.claim_info"></div>
      <div class="plate"
           v-if="authZd.claim_info">
        <p class="title-plate">核保详细</p>
        <div class="itemp-box">
          <div class="itemp"><span class="sp1">投保日期：</span><span class="sp2">-</span></div>
          <div class="itemp"><span class="sp1">核保结论：</span><span class="sp2">-</span></div>
          <div class="itemp"><span class="sp1">保费：</span><span class="sp2">-</span></div>
          <div class="itemp"><span class="sp1">备注：</span><span class="sp2">-</span></div>
          <div class="itemp"><span class="sp1">承保用时：</span><span class="sp2">-</span></div>
        </div>
      </div>
      <div class="line-bg"
           v-if="authZd.claim_info"></div>
      <div class="plate"
           v-if="authZd.claim_info">
        <p class="title-plate">理赔详细</p>
        <div class="itemp-box">
          <div class="itemp"><span class="sp1">报案日期：</span><span class="sp2">-</span></div>
          <div class="itemp"><span class="sp1">理赔状态：</span><span class="sp2">-</span></div>
          <div class="itemp"><span class="sp1">责任类型：</span><span class="sp2">-</span></div>
          <div class="itemp"><span class="sp1">赔付结果：</span><span class="sp2">-</span></div>
          <div class="itemp"><span class="sp1">赔付金额：</span><span class="sp2">-</span></div>
          <div class="itemp"><span class="sp1">备注：</span><span class="sp2">-</span></div>
          <div class="itemp"><span class="sp1">结案日期：</span><span class="sp2">-</span></div>
          <div class="itemp"><span class="sp1">核赔用时：</span><span class="sp2">-</span></div>
        </div>
      </div>

      <div class="line-bg"></div>
      <div class="plate">
        <p class="title-plate">保险产品信息</p>
        <div class="itemp-box itemp-box2">
          <div class="itemp itempl"><span class="sp1">保险产品（方案）：</span><span class="sp2">{{detail.insureProduct.schemes[0]&&detail.insureProduct.schemes[0].schemeName}}</span></div>
          <div class="itemp"><span class="sp1">保费：</span><span class="sp2">{{detail.insureProduct.schemes[0]&&detail.insureProduct.schemes[0].insureMoney}}</span></div>
          <div class="itemp"><span class="sp1">保险期间：</span><span class="sp2">{{detail.insureProduct.insureTypes[0].kxPeriod}}</span></div>
          <div class="itemp"><span class="sp1">交费频率：</span><span class="sp2">{{detail.insureProduct.insureTypes[0].payRate}}</span></div>
          <div class="itemp"><span class="sp1">交费期间：</span><span class="sp2">{{detail.insureProduct.insureTypes[0].payPeriod}}</span></div>
          <div class="itemp itempxl">
            <span class="sp1">险种明细：</span>
            <div class="sp2">
              <span style="color:#F77F66;cursor: pointer;"
                    v-for="(item,index) in detail.insureProduct.insureTypes"
                    :key="index"
                    @click="openPdf(item.insureTypeC)">{{item.insureTypeN}} ></span>
            </div>
          </div>

          <div class="itemp itempxl">
            <span class="sp1">责任明细：</span>
            <div class="sp2">
              {{detail.insureProduct.schemes[0].responsibNa}}
            </div>
          </div>
          <!-- <div class="itemp itempxl">    {{detail.insureProduct.schemes[0].responsibNa}}
            <span class="sp1">责任明细：</span>
            <div class="sp2">
              <span>xxxxxxxxxxxxxxxxxxxxxxx</span>
              <span>xxxxxxxxxxxxxxxxxxxxxxx</span>
            </div>
          </div> -->
          <!-- <div class="itemp itempxl">
            <span class="sp1">主险名称：</span>
            <div class="sp2">
              <span class="pdf-sp">查看母婴安心手术意外伤害保险条款 ></span>
              <span>孕产妇身故/残疾保额：20万元</span>
              <span>胎儿新生儿身故/残疾保额：3万元</span>
            </div>
          </div>
          <div class="itemp itempxl">
            <span class="sp1">附加险名称：</span>
            <div class="sp2">
              <span class="pdf-sp">查看母婴安心手术意外伤害保险条款 ></span>
              <span>孕产妇身故/残疾保额：20万元</span>
              <span>胎儿新生儿身故/残疾保额：3万元</span>
            </div>
          </div> -->
          <div class="itemp"><span class="sp1 pdf-sp sp1xl"
                  @click="openPdf(detail.insureProduct.product.securityDet)">查看保障责任明细 ></span></div>

        </div>
      </div>

      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">返回</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      form: {
        hosp: '',
        insureSource2: '',
        insureSource3: '',
        lipeiState: '',
        insurePhoneNum: null,
        insureUserName: null,
        insureCertificateType: null,
        insureCertificateNum: null,
        insureChannel: null,
        insureSource: null,
        orderNum: null,
        billNum: null,
        orderState: null,
        billState: null,
        insureCompany: null,
        insureBeginDate: null,
        insureEndDate: null,
      },
      pageNo: 1,
      pageSize: 6,
      dataSource: [],
      total: 0,
      companyList: [],
      certificateTypeList: [],
      channelList: [],
      sourceList: [],
      orderStateList: [],
      billStateList: [],
      detail: {
        billPcDetailVo: {},
        insureProduct: {
          insureTypes: [{}],
          schemes: [{}]
        }

      },
      authZd: {},
    }
  },
  created() {
    this.getAllList();
    this.getList();
    this.getAuthInfo();
  },
  methods: {
    getAuthInfo() {
      let str = this.$route.path.split('/')[this.$route.path.split('/').length - 1];
      const menus = JSON.parse(localStorage.getItem('menus'));
      let id = '';
      for (let i = 0; i < menus.length; i++) {
        for (let j = 0; j < menus[i].children.length; j++) {
          if (menus[i].children[j].path == str) {
            id = menus[i].children[j].id
            break
          }
        }
      }

      this.$get(`${this.baseUrlh}/privilege/front/admin/v1/queryPriByUser`, {
        parentId: id,
        priType: 3,
      }).then((res) => {
        this.authZd = res.data;

      })

    },
    openPdf(v) {
      window.open(v);
    },
    handleSizeChange(v) {
      this.pageSize = v;
      this.getList();
    },
    handleCurrentChange(v) {
      this.pageNo = v;
      this.getList();
    },
    search() {
      this.pageNo = 1;
      this.getList();
    },
    clear() {
      this.form = {
        hosp: '',
        insureSource2: '',
        insureSource3: '',
        lipeiState: '',
        insurePhoneNum: null,
        insureUserName: null,
        insureCertificateType: null,
        insureCertificateNum: null,
        insureChannel: null,
        insureSource: null,
        orderNum: null,
        billNum: null,
        orderState: null,
        billState: null,
        insureCompany: null,
        insureBeginDate: null,
        insureEndDate: null,
      };
    },
    getinfo(row) {
      this.dialogVisible = true;
      this.$post(`${this.baseUrls}/insureType/front/orderByCondition/one?orderId=${row.orderId}`).then((res) => {
        this.detail = res.data.map;
      })

    },
    getList() {
      this.$post(`${this.baseUrls}/insureType/front/orderByCondition/all`, {
        insurePhoneNum: this.form.insurePhoneNum,
        insureUserName: this.form.insureUserName,
        insureCertificateType: this.form.insureCertificateType,
        insureCertificateNum: this.form.insureCertificateNum,
        insureChannel: this.form.insureChannel,
        insureSource: this.form.insureSource,
        orderNum: this.form.orderNum,
        billNum: this.form.billNum,
        orderState: this.form.orderState,
        billState: this.form.billState,
        insureCompany: this.form.insureCompany,
        insureBeginDate: this.form.insureBeginDate,
        insureEndDate: this.form.insureEndDate,
        pageNo: this.pageNo,
        pageSize: this.pageSize,
      }).then((res) => {
        let arr = [];
        for (let index = 0; index < res.data.length; index++) {
          arr.push(res.data[index].map);
        }
        this.dataSource = arr;
        this.total = res.totalCount;
      })
    },
    getAllList() {
      this.$get(`${this.baseUrls}/dictData/front/dictData/all`, {
        dictType: 'insure_company'
      }).then((res) => {
        this.companyList = res.data;
      })
      this.$get(`${this.baseUrlh3}/api/secret/common/v1/billState`).then((res) => {
        this.billStateList = res.data;
      })
      this.$get(`${this.baseUrlh3}/api/secret/common/v1/certificateType`).then((res) => {
        this.certificateTypeList = res.data;
      })
      this.$get(`${this.baseUrlh3}/api/secret/common/v1/channel`).then((res) => {
        this.channelList = res.data;
      })
      this.$get(`${this.baseUrlh3}/api/secret/common/v1/orderState`).then((res) => {
        this.orderStateList = res.data;
      })
      this.$get(`${this.baseUrlh3}/api/secret/common/v1/source`).then((res) => {
        this.sourceList = res.data;
      })
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.line {
  text-align: center;
}
.item-title {
  color: #8f9298;
  font-size: 13px;
  padding-bottom: 10px;
}
.line-bg {
  background: #f9f9fa;
  height: 20px;
}
.plate {
  padding: 30px 0 10px 30px;
  font-size: 14px;
  color: #212326;
  .title-plate {
    margin-bottom: 40px;
    position: relative;
    &::after {
      content: "";
      position: absolute;
      height: 1px;
      width: 40px;
      background: #eee;
      left: 0;
      bottom: -10px;
    }
  }
  .itemp-box {
    overflow: hidden;
    .itemp {
      float: left;
      height: 20px;
      width: 360px;
      line-height: 20px;
      margin-bottom: 20px;
      .sp1 {
        display: inline-block;
        height: 100%;
        width: 100px;
        text-align: left;
        margin-right: 10px;
      }
      .sp1xl {
        width: 300px;
      }
    }
    .itemp90 {
      width: 225px;
      .sp1 {
        width: 70px;
      }
    }
    .itempl {
      width: 460px;
      .sp1 {
        width: 130px;
      }
    }
    .itempxl {
      width: 560px;
      position: relative;
      height: 80px;
      .sp2 {
        position: absolute;
        left: 110px;
        top: 0;
        width: 300px;
        > * {
          display: block;
          height: 30px;
          line-height: 30px;
        }
      }
    }
  }
  .pdf-sp {
    color: #f77f66;
    cursor: pointer;
  }
  .itemp-box2 {
    .itemp {
      clear: both;
    }
  }
}

.plate1 {
  .title-name {
    font-size: 16px;
    color: #212135;
    font-weight: 600;
    margin-bottom: 20px;
  }
}
</style>

