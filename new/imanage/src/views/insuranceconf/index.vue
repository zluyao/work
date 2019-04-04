<template>
  <div class="app-container">
    <p class="page-title">险种配置</p>
    <div class="search">
      <el-form :inline="true"
               :model="formInline"
               class="demo-form-inline">
        <el-form-item label="关键字"
                      class="keyword-search">
          <el-input v-model="formInline.keyword"
                    width="400"
                    size="mini"
                    @keyup.enter.native="getList"
                    placeholder="请输入名称、简称、险种代码或供应商"></el-input>

        </el-form-item>
        <el-form-item>
          <el-button type="danger"
                     size="mini"
                     @click="search">查询</el-button>
          <el-button type="primary"
                     size="mini"
                     @click="addItem">新增</el-button>
        </el-form-item>

      </el-form>
    </div>

    <el-table :data="dataSource"
              border
              stripe
              style="width: 100%">
      <el-table-column type="index"
                       width="50">
      </el-table-column>
      <el-table-column prop="insureTypeN"
                       label="险种名称">
      </el-table-column>
      <el-table-column prop="insureDm"
                       label="险种代码">
      </el-table-column>

      <el-table-column prop="insureCompa"
                       label="供应商">
      </el-table-column>
      <el-table-column prop="insurePerio"
                       width="100"
                       label="保险期间">
      </el-table-column>
      <el-table-column prop="payPeriod"
                       width="110"
                       label="交费期间">
      </el-table-column>
      <el-table-column prop="payType"
                       width="120"
                       label="交费方式">
      </el-table-column>

      <el-table-column label="更新时间"
                       prop="modifyTime">
      </el-table-column>
      <el-table-column label="操作"
                       fixed="right"
                       width="160">
        <template slot-scope="scope">
          <el-button @click="editItem(scope.row)"
                     type="primary"
                     size="mini">编辑</el-button>
        
          <!-- <el-button @click="deleteItem(scope.row)"
                     type="danger"
                     size="mini">删除</el-button> -->
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

    <!-- 弹窗 -->
    <el-dialog :title='title'
               width="70%"
               :visible.sync="dialogVisible">
      <span>
        <el-form ref="dialogForm"
                 :rules="rules"
                 :model="dialogForm"
                 label-width="120px">
          <el-form-item label="供应商："
                        prop="insureCompa">
            <el-select v-model="dialogForm.insureCompa"
                       placeholder="请选供应商">
              <el-option v-for="(item,index) in companyList"
                         :key="index"
                         :label="item.dictLabel"
                         :value="item.dictValue">
              </el-option>

            </el-select>

          </el-form-item>
          <el-form-item label="产品大类："
                        prop="productType">
            <el-select v-model="dialogForm.productType"
                       @change="changeProductList"
                       placeholder="请选择">
              <el-option v-for="(item,index) in productList"
                         :key="index"
                         :label="item.dictLabel"
                         :value="item.dictValue">
              </el-option>
            </el-select>
            <span>
              <el-select v-model="dialogForm.productType1"
                         placeholder="请选择">
                <el-option v-for="(item,index) in productList1"
                           :key="index"
                           :label="item.dictLabel"
                           :value="item.dictValue">
                </el-option>
              </el-select>
            </span>

          </el-form-item>

          <el-form-item label="险种名称："
                        prop="insureTypeN">
            <el-input v-model="dialogForm.insureTypeN"
                      style="width:200px;"
                      placeholder="请输入险种名称"></el-input>
          </el-form-item>
          <el-form-item label="险种简称：">
            <el-input v-model="dialogForm.insureTypeJ"
                      style="width:200px;"
                      placeholder="请输入险种名称"></el-input>
          </el-form-item>
          <el-form-item label="主附险："
                        prop="mainAtta">
            <el-radio-group v-model="dialogForm.mainAtta">
              <el-radio :label="1"
                        border>主险</el-radio>
              <el-radio :label="0"
                        border>附险</el-radio>

              <!-- <el-radio :label="item.dictValue"
                        v-for="(item,index) in mainAttaList"
                        :key="index"
                        border>{{item.dictLabel}}</el-radio> -->
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备案编号："
                        prop="recordNum">
            <el-input v-model="dialogForm.recordNum"
                      style="width:200px;"
                      placeholder="请输入备案编号"></el-input>
          </el-form-item>

          <el-form-item label="险种条款："
                        prop="">
            <span>
              <el-upload class="avatar-uploader"
                         :data="uploadKey"
                         :action="dataApi"
                         :limit="1"
                         ref="files"
                         :file-list="filelist1"
                         :on-remove="handleRemove"
                         :on-exceed="handleExceed"
                         :on-success="handleAvatarSuccess"
                         :before-upload="beforeAvatarUpload">
                <el-button type="info"
                           size="mini">点击上传</el-button>
              </el-upload>
            </span>
          </el-form-item>

          <el-form-item label="费率表：">
            <span>
              <el-upload class="avatar-uploader"
                         :data="uploadKey2"
                         :action="dataApi"
                         :limit="1"
                         ref="files"
                         :file-list="filelist2"
                         :on-remove="handleRemove2"
                         :on-exceed="handleExceed2"
                         :on-success="handleAvatarSuccess2"
                         :before-upload="beforeAvatarUpload2">
                <el-button type="info"
                           size="mini">点击上传</el-button>
              </el-upload>
            </span>
          </el-form-item>

          <div style="margin-bottom:15px;">
            <span class="xinred">*</span>手续费相关信息</div>
          <div class="info-box-out"
               style="background: #f5f5f5;padding:15px 0;">
            <div class="info-box"
                 style="margin-bottom:20px;padding-left:30px;"
                 :key="indexzr"
                 v-for="(itemzr,indexzr) in dialogForm.feeList">
              <span><span class="xinred">*</span>保险期间</span>
              <el-input v-model="itemzr.insurePerio"
                        size="mini"
                        style="width:70px;"
                        placeholder="如30年"></el-input>

              <span>&nbsp&nbsp&nbsp<span class="xinred">*</span>交费频率</span>
              <el-select v-model="itemzr.payRate"
                         style="width:85px;"
                         size="mini"
                         placeholder="请选择">
                <el-option v-for="(item,index) in payRateList"
                           :key="index"
                           :label="item.dictLabel"
                           :value="item.dictValue">
                </el-option>
              </el-select>

              <span>&nbsp&nbsp&nbsp<span class="xinred">*</span>交费期间</span>
              <el-select v-model="itemzr.payPeriod"
                         multiple
                         style="width:200px;"
                         size="mini"
                         placeholder="请选择">
                <el-option v-for="(item,index) in payPeriodList"
                           :key="index"
                           :label="item.dictLabel"
                           :value="item.dictValue">
                </el-option>
              </el-select>

              <span>&nbsp&nbsp&nbsp手续费</span>
              <el-input v-model="itemzr.poundage"
                        size="mini"
                        style="width:60px;"
                        placeholder=""></el-input>%

              <el-button type="info"
                         icon="el-icon-plus"
                         @click="addResponse(dialogForm.feeList)"
                         size="mini">添加</el-button>
              <el-button type="danger"
                         v-if="indexzr!=0"
                         @click="deletItem(dialogForm.feeList,indexzr)"
                         icon="el-icon-delete"
                         size="mini">删除</el-button>
            </div>
          </div>

          <!-- <el-form-item label="保险期间："
                        prop="insurePerio">
            <el-input v-model="dialogForm.insurePerio"
                      style="width:200px;"
                      placeholder="请输入保险期间"></el-input>
          </el-form-item>
          <el-form-item label="交费频率："
                        prop="payRate">
            <el-select v-model="dialogForm.payRate"
                       placeholder="请选择">
              <el-option v-for="(item,index) in payRateList"
                         :key="index"
                         :label="item.dictLabel"
                         :value="item.dictValue">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="交费期间："
                        prop="payPeriod">
            <el-select v-model="dialogForm.payPeriod"
                       placeholder="请选择">
              <el-option v-for="(item,index) in payPeriodList"
                         :key="index"
                         :label="item.dictLabel"
                         :value="item.dictValue">
              </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="交费方式："
                        prop="payType">
            <el-select v-model="dialogForm.payType"
                       multiple
                       placeholder="请选择">
              <el-option v-for="(item,index) in payTypeList"
                         :key="index"
                         :label="item.dictLabel"
                         :value="item.dictValue">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="犹豫期：">
            <el-select v-model="dialogForm.youyuPeriod"
                       placeholder="请选择">
              <el-option v-for="(item,index) in youyuPeriodList"
                         :key="index"
                         :label="item.dictLabel"
                         :value="item.dictValue">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="宽限期：">
            <el-select v-model="dialogForm.kxPeriod"
                       placeholder="请选择">
              <el-option v-for="(item,index) in kxPeriodList"
                         :key="index"
                         :label="item.dictLabel"
                         :value="item.dictValue">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="等待期：">
            <el-select v-model="dialogForm.waitPeriod"
                       placeholder="请选择">
              <el-option v-for="(item,index) in waitPeriodList"
                         :key="index"
                         :label="item.dictLabel"
                         :value="item.dictValue">
              </el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="手续费：">
            <el-input v-model="dialogForm.poundage"
                      style="width:200px;"
                      placeholder="请输入手续费"></el-input>
          </el-form-item> -->
          <el-form-item label="版本号："
                        v-if="dialogForm.version">
            <el-input v-model="dialogForm.version"
                      disabled
                      style="width:200px;"></el-input>
          </el-form-item>
          <el-form-item label="生成新版本："
                        v-if="title=='编辑'">
            <el-radio-group v-model="dialogForm.isNewVersion"
                            @input="changeisNewVersion($event)">
              <el-radio :label="1"
                        border>是</el-radio>
              <el-radio :label="0"
                        border>否</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="版本备注："
                        v-if="title=='编辑'">
            <el-input v-model="dialogForm.versionRemark"
                      style="width:600px;"
                      type="textarea"
                      :autosize="{minRows: 3, maxRows: 6}"
                      placeholder="请填写险种版本备注"></el-input>
          </el-form-item>

        </el-form>
      </span>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="sureinfo">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {

  data() {
    return {
      formInline: {
        keyword: '',
      },
      dialogForm: {
        id: null,
        insureCompa: '',
        productType: '',
        productType1: '',
        productType2: '',
        insureTypeN: '',
        insureTypeJ: '',
        insureTypeC: '',
        rateTable: '',
        mainAtta: '',
        insureDm: '',
        recordNum: '',
        feeList: [
          {
            insurePerio: '',
            payRate: '',
            payPeriod: [],
            poundage: '',
          }
        ],
        // insurePerio: '',
        // payRate: '',
        // payPeriod: '',
        // poundage: '',
        payType: [],
        youyuPeriod: '',
        kxPeriod: '',
        waitPeriod: '',
        isNewVersion: null,
        versionRemark: null,
        modifyTime: null,
        createTime: null,
      },
      rules: {
        insureCompa: [
          {
            required: true,
            validator: (rule, value, cb) => value !== '' ? cb() : cb('请选择供应商'),
            trigger: 'change',
          },
        ],
        productType: [
          {
            required: true,
            validator: (rule, value, cb) => value !== '' ? cb() : cb('请选择产品大类'),
            trigger: 'change',
          },
        ],
        insureTypeN: [
          { required: true, message: '请输入险种名称', trigger: 'blur' },
        ],
        recordNum: [
          { required: true, message: '请输入备案编号', trigger: 'blur' },
        ],
        insureDm: [
          { required: true, message: '请输入险种代码', trigger: 'blur' },
        ],
        mainAtta: [
          {
            required: true,
            validator: (rule, value, cb) => value !== '' ? cb() : cb('请选择主附险'),
            trigger: 'change',
          },
        ],
        insurePerio: [
          { required: true, message: '请输入保险期间', trigger: 'blur' },
        ],
        payRate: [
          {
            required: true,
            validator: (rule, value, cb) => value !== '' ? cb() : cb('请选择交费频率'),
            trigger: 'change',
          },
        ],
        payPeriod: [
          {
            required: true,
            validator: (rule, value, cb) => value !== '' ? cb() : cb('请选择交费期间'),
            trigger: 'change',
          },
        ],
        payType: [
          {
            required: true,
            validator: (rule, value, cb) => value.length ? cb() : cb('请选择交费方式'),
            trigger: 'change',
          },
        ],
      },

      title: '新增',
      pageIndex: 1,
      pageSize: 6,
      dataSource: [],
      total: 0,
      dialogVisible: false,

      filelist1: [],
      uploadKey: {
        dict: 'insureTypeC',
        userId: localStorage.getItem('id'),
        bussId: localStorage.getItem('id'),
      },
      filelist2: [],
      uploadKey2: {
        dict: 'rateTable',
        userId: localStorage.getItem('id'),
        bussId: localStorage.getItem('id'),
      },
      dataApi: `${this.baseUrlupload}/consul/api/file/v1/upload`,

      companyList: [],
      productList: [],
      productList1: [],
      productList2: [],//dictLabel  dictValue
      payRateList: [],
      payPeriodList: [],
      payTypeList: [],
      youyuPeriodList: [],
      kxPeriodList: [],
      waitPeriodList: [],
      mainAttaList: [],
    }
  },
  created() {
    this.getList();
    this.getAllPlist();
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

    handleRemove(file, fileList) {
      this.dialogForm.insureTypeC = '';
    },
    handleExceed() {
      this.$message({
        type: 'error',
        message: '只能上传一个文件',
      });
    },
    handleAvatarSuccess(res) {
      this.dialogForm.insureTypeC = res.data;
    },
    beforeAvatarUpload(file) {
      if (file.type !== 'application/pdf') {

        this.$message({
          type: 'error',
          message: '上传文件只能是pdf',
        });
        return false;
      }
    },
    handleRemove2(file, fileList) {
      this.dialogForm.rateTable = '';
    },
    handleExceed2() {
      this.$message({
        type: 'error',
        message: '只能上传一个文件',
      });
    },
    handleAvatarSuccess2(res) {
      this.dialogForm.rateTable = res.data;
    },
    beforeAvatarUpload2(file) {
      if (file.type == 'application/pdf' || file.type.indexOf('image') != -1) {
        this.$message({
          type: 'error',
          message: '上传文件只能是表格',
        });
        return false;
      }
    },

    addResponse(arr) {
      arr.push({
        insurePerio: '',
        payRate: '',
        payPeriod: [],
        poundage: '',
      });
    },

    deletItem(arr, i) {
      arr.splice(i, 1);

    },

    search() {
      this.pageIndex = 1;
      this.getList();
    },
    addItem() {
      this.dialogForm = {
        id: null,
        insureCompa: '',
        productType: '',
        productType1: '',
        productType2: '',
        insureTypeN: '',
        insureTypeJ: '',
        insureTypeC: '',
        rateTable: '',
        mainAtta: '',
        insureDm: '',
        recordNum: '',
        feeList: [
          {
            insurePerio: '',
            payRate: '',
            payPeriod: [],
            poundage: '',
          }
        ],
        // insurePerio: '',
        // payRate: '',
        // payPeriod: '',
        // poundage: '',
        payType: [],
        youyuPeriod: '',
        kxPeriod: '',
        waitPeriod: '',
        modifyTime: null,
        createTime: null,
      };
      this.filelist1 = [];
      this.filelist2 = [];
      this.title = '新增'
      this.dialogVisible = true;
    },
    editItem(row) {
      this.title = '编辑';
      this.$get(`${this.baseUrls}/insureType/front/insureType/one`, {
        id: row.id
      }).then((res) => {

        if (res.data.insureTypeC) {
          const arr = res.data.insureTypeC.split('/');
          this.filelist1 = [{
            name: arr[arr.length - 1],
            url: res.data.insureTypeC
          }];
        } else {
          this.filelist1 = [];
        }
        if (res.data.rateTable) {
          const arr = res.data.rateTable.split('/');
          this.filelist2 = [{
            name: arr[arr.length - 1],
            url: res.data.rateTable
          }];
        } else {
          this.filelist2 = [];
        }

        res.data.versionRemark = res.data.versionRemark ? res.data.versionRemark : '';
        res.data.isNewVersion = 1;

        res.data.feeList.forEach(ele => {
          ele.payPeriod = ele.payPeriod.split(',');
        })
        for (let i = 0; i < res.data.feeList.length; i++) {
          for (let j = 0; j < res.data.feeList[i].payPeriod.length; j++) {
            res.data.feeList[i].payPeriod[j] = Number(res.data.feeList[i].payPeriod[j]);
          }
        }

        res.data.feeList = res.data.feeList.length ? res.data.feeList : [
          {
            insurePerio: '',
            payRate: '',
            payPeriod: [],
            poundage: '',
          }
        ];
        res.data.payType = this.toNumarr(res.data.payType);

        this.dialogForm = res.data;
        this.getProductList1();
        this.dialogVisible = true;
      })
    },
    toNumarr(str) {
      if (!str) {
        return []
      }
      let arr = str.split(',');
      arr.forEach((item, i) => {
        arr[i] = Number(item);
      })
      return arr;
    },
    changeisNewVersion(v) {
    },
    deleteItem(row) {
      this.$confirm('确定删除该险种吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$post(`${this.baseUrls}/insureType/front/insureType/delInsureType?id=${row.id}`).then((res) => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getList();
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });

    },
    sureinfo() {
      this.$refs['dialogForm'].validate((valid) => {
        if (valid) {
          if (this.dialogForm.productType1 === '') {
            this.$message.error('请选择产品大类第二项');
            return
          } else if (this.dialogForm.insureTypeC === '') {
            this.$message.error('请上传险种条款');
            return
          } else if (this.title == '编辑' && this.dialogForm.isNewVersion && !this.dialogForm.versionRemark) {
            this.$message.error('已勾选生成新版本，请填写版本备注');
            return
          }

          for (let i = 0; i < this.dialogForm.feeList.length; i++) {
            if (!this.dialogForm.feeList[i].insurePerio || !this.dialogForm.feeList[i].payPeriod.length || !this.dialogForm.feeList[i].payRate) {
              this.$message.error('手续费相关信息未填写完整');
              return
            }
          }

          let arr = JSON.parse(JSON.stringify(this.dialogForm.feeList));
          arr.forEach(ele => {
            ele.payPeriod = ele.payPeriod.join(',');
          })

          this.$post(`${this.baseUrls}/insureType/front/insureType/add`, {
            id: this.dialogForm.id,
            insureCompa: this.dialogForm.insureCompa,
            productType: this.dialogForm.productType,
            productType1: this.dialogForm.productType1,
            // productType2: this.dialogForm.productType2 === '' ? 0 : this.dialogForm.productType2,
            insureTypeN: this.dialogForm.insureTypeN,
            insureTypeJ: this.dialogForm.insureTypeJ,
            insureTypeC: this.dialogForm.insureTypeC,
            rateTable: this.dialogForm.rateTable,
            mainAtta: this.dialogForm.mainAtta,
            insureDm: this.dialogForm.insureDm,
            recordNum: this.dialogForm.recordNum,

            feeList: arr,
            // insurePerio: this.dialogForm.insurePerio,
            // payRate: this.dialogForm.payRate,
            // payPeriod: this.dialogForm.payPeriod,
            // poundage: this.dialogForm.poundage,

            payType: this.dialogForm.payType.join(','),
            youyuPeriod: this.dialogForm.youyuPeriod === '' ? 0 : this.dialogForm.youyuPeriod,
            kxPeriod: this.dialogForm.kxPeriod === '' ? 0 : this.dialogForm.kxPeriod,
            waitPeriod: this.dialogForm.waitPeriod === '' ? 0 : this.dialogForm.waitPeriod,

            isNewVersion: this.dialogForm.isNewVersion,
            versionRemark: this.dialogForm.versionRemark,
          }).then((res) => {
            this.dialogVisible = false;
            if (this.title == '新增') {
              this.$message.success('新增成功');
            } else {
              this.$message.success('编辑成功');
            }
            this.getList();
          })
        } else {
          return false;
        }
      });
    },
    getList() {
      this.$get(`${this.baseUrls}/insureType/front/insureType/all`, {
        insure: this.formInline.keyword.replace(/\s+/g, ''),
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
      }).then((res) => {
        this.dataSource = res.data.list;
        this.total = res.data.total;
      })
    },
    changeProductList() {
      this.productList1 = [];
      this.productList2 = [];
      this.dialogForm.productType1 = '';
      this.dialogForm.productType2 = '';
      this.getProductList1();
    },
    changeProductList1() {
      this.productList2 = [];
      this.dialogForm.productType2 = '';
      this.getProductList2();
    },
    getProductList1() {
      let v = this.dialogForm.productType;
      if (v === '') {
        return
      }

      const arr = this.productList;
      let parentId = '';
      arr.forEach(item => {
        if (item.dictValue == v) {
          parentId = item.id;
        }
      })

      this.$get(`${this.baseUrls}/dictData/front/v1/getByParentId`, {
        parentId: parentId,
      }).then((res) => {
        this.productList1 = res.data;
      })

    },
    getProductList2() {
      // let v = this.dialogForm.productType1;
      // if (v === '') {
      //   return
      // }
      // let arr = [...this.productList1];
      // let code = '';
      // arr.forEach((item) => {
      //   if (v == item.dictValue) {
      //     code = item.dictCode;
      //   }
      // })
      // this.$get(`${this.baseUrls}/dictData/front/dictData/all`, {
      //   dictType: 'insure_type_three',
      //   dictCode: code,
      // }).then((res) => {
      //   this.productList2 = res.data;
      // })

    },
    getAllPlist() {
      this.$get(`${this.baseUrls}/dictData/front/dictData/all`, {
        dictType: 'insure_company',
        isValid: 1,
      }).then((res) => {
        this.companyList = res.data;
      })
      this.$get(`${this.baseUrls}/dictData/front/dictData/all`, {
        dictType: 'insure_type_one',
        isValid: 1,
      }).then((res) => {
        this.productList = res.data;
      })

      this.$get(`${this.baseUrls}/dictData/front/dictData/all`, {
        dictType: 'main_attachment',
        isValid: 1,
      }).then((res) => {
        this.mainAttaList = res.data;
      })
      this.$get(`${this.baseUrls}/dictData/front/dictData/all`, {
        dictType: 'pay_rate',
        isValid: 1,
      }).then((res) => {
        this.payRateList = res.data;
      })
      this.$get(`${this.baseUrls}/dictData/front/dictData/all`, {
        dictType: 'pay_period',
        isValid: 1,
      }).then((res) => {
        this.payPeriodList = res.data;
      })
      this.$get(`${this.baseUrls}/dictData/front/dictData/all`, {
        dictType: 'pay_type',
        isValid: 1,
      }).then((res) => {
        this.payTypeList = res.data;
      })
      this.$get(`${this.baseUrls}/dictData/front/dictData/all`, {
        dictType: 'youyu_period',
        isValid: 1,
      }).then((res) => {
        this.youyuPeriodList = res.data;
      })
      this.$get(`${this.baseUrls}/dictData/front/dictData/all`, {
        dictType: 'kx_period',
        isValid: 1,
      }).then((res) => {
        this.kxPeriodList = res.data;
      })
      this.$get(`${this.baseUrls}/dictData/front/dictData/all`, {
        dictType: 'wait_period',
        isValid: 1,
      }).then((res) => {
        this.waitPeriodList = res.data;
      })
    },
  }
}
</script>

<style>
.xinred {
  color: #f56c6c;
  padding-right: 4px;
}
</style>

