<template>
  <div class="app-container">
    <p class="page-title">子账户管理</p>
    <div class="search search2">
      <el-form :inline="true"
               :model="formInline"
               class="demo-form-inline">
        <el-form-item label=""
                      class="keyword-search">
          <el-select v-model="formInline.nameType"
                     size="mini">
            <el-option label="真实姓名"
                       :value="1">
            </el-option>
            <el-option label="主体全称"
                       :value="2">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label=""
                      style="margin-left:-10px;"
                      class="keyword-search">
          <el-input v-model="formInline.nameStr"
                    width="100"
                    size="mini"
                    placeholder=""></el-input>
        </el-form-item>

        <el-form-item label="联系人电话"
                      class="keyword-search">
          <el-input v-model="formInline.phoneNum"
                    width="100"
                    size="mini"
                    placeholder=""></el-input>

        </el-form-item>
        <el-form-item label="账户状态"
                      class="keyword-search">
          <el-select v-model="formInline.isOpen"
                     size="mini">
            <el-option label="全部"
                       value="">
            </el-option>
            <el-option label="已开通"
                       :value="1"></el-option>
            <el-option label="已冻结"
                       :value="0">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账户分类"
                      v-if="roleType==1"
                      class="keyword-search">
          <el-select v-model="formInline.type"
                     size="mini">
            <el-option label="全部"
                       value="">
            </el-option>
            <el-option label="内部"
                       :value="1"></el-option>
            <el-option label="外部"
                       :value="2">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="danger"
                     size="mini"
                     @click="search">搜索</el-button>
          <el-button type="success"
                     size="mini"
                     @click="reSetsearch">重置</el-button>
          <el-button type="primary"
                     size="mini"
                     v-if="authBtn.addAccount"
                     @click="addItem">新增</el-button>
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
                       label="主体全称">
      </el-table-column>
      <el-table-column prop="phoneNum"
                       label="联系人电话">
      </el-table-column>

      <el-table-column prop="name"
                       label="真实姓名">
      </el-table-column>
      <el-table-column width="100"
                       label="账户状态">
        <template slot-scope="scope">
          {{scope.row.isOpen==1?'已开通':'已冻结'}}
        </template>
      </el-table-column>
      <el-table-column prop="typeStr"
                       width="110"
                       label="账户分类">
      </el-table-column>
      <el-table-column prop="createTime"
                       width="180"
                       label="创建时间">
      </el-table-column>

      <el-table-column label="操作"
                       fixed="right"
                       width="380">
        <template slot-scope="scope">
          <el-button @click="configRole(scope.row)"
                     type="primary"
                     v-if="authBtn.selectRole"
                     size="mini">权限配置</el-button>
          <el-button @click="editItem(scope.row)"
                     type="primary"
                     v-if="authBtn.addAccount"
                     size="mini">编辑</el-button>
          <el-button @click="changeFrozen(scope.row)"
                     type="danger"
                     size="mini">{{scope.row.isOpen==1?'冻结账户':'开通账户'}}</el-button>
          <el-button @click="distributeItem(scope.row)"
                     type="primary"
                     size="mini">分销配置</el-button>
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

    <!-- 弹窗配置权限 -->
    <el-dialog title='配置账户权限'
               width="65%"
               :visible.sync="dialogVisiblerole">
      <el-table :data="dataSourcerole"
                stripe
                border
                style="width: 100%">

        <el-table-column label="选择">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.isSelect"
                         @change="changeisSelect(scope.row)"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column prop="roleName"
                         label="角色名称">
        </el-table-column>

      </el-table>

      <!-- <div class="page-pagination">
        <el-pagination @size-change="handleSizeChangerole"
                       @current-change="handleCurrentChangerole"
                       :current-page="pageIndexrole"
                       :page-sizes="[6,10,20,30,50]"
                       :page-size="pageSizerole"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="totalrole">
        </el-pagination>
      </div> -->
    </el-dialog>

    <!-- 弹窗2 -->
    <el-dialog title='分销管理'
               width="85%"
               :visible.sync="dialogVisible2">
      <span>
        <div class="ss search2">
          <el-form :inline="true"
                   :model="formInline2"
                   class="demo-form-inline">
            <el-form-item label="商品名称"
                          class="keyword-search">
              <el-input v-model="formInline2.queryStr"
                        width="50"
                        size="mini"
                        placeholder=""></el-input>

            </el-form-item>
            <el-form-item label="分销类型"
                          class="keyword-search">
              <el-select v-model="formInline2.isDist"
                         width="160px"
                         size="mini">
                <el-option label="全部"
                           value="">
                </el-option>
                <el-option label="已分销"
                           :value="1"></el-option>
                <el-option label="未分销"
                           :value="0">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="销售类型"
                          class="keyword-search">
              <el-select v-model="formInline2.isSale"
                         size="mini">
                <el-option label="全部"
                           value="">
                </el-option>
                <el-option label="已销售"
                           :value="1"></el-option>
                <el-option label="已停售"
                           :value="0">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="danger"
                         size="mini"
                         @click="search2">搜索</el-button>
              <el-button type="success"
                         size="mini"
                         @click="reSetsearch2">重置</el-button>

            </el-form-item>

          </el-form>
        </div>

        <el-table :data="dataSource2"
                  stripe
                  size="small"
                  border
                  style="width: 100%">
          <el-table-column type="index"
                           width="50">
          </el-table-column>
          <el-table-column prop="productName"
                           label="商品名称">

          </el-table-column>
          <el-table-column label="分类">
            <template slot-scope="scope">
              <span v-if="scope.row.insureVoList"
                    :key="index"
                    v-for="(item,index) in scope.row.insureVoList">
                {{item?`${item.productType1}&nbsp&nbsp&nbsp`:''}}
              </span>
            </template>
          </el-table-column>

          <el-table-column prop=""
                           width="220"
                           label="纬度">
            <template slot-scope="scope">
              <p v-for="item in scope.row.feeList">
                {{rewd(item)}}
              </p>
            </template>
          </el-table-column>
          <el-table-column prop=""
                           width="100"
                           label="我的费率(%)">
            <template slot-scope="scope">
              <p v-for="item in scope.row.feeList">
                {{item.poundage}}
              </p>
            </template>

          </el-table-column>
          <el-table-column label="返点率(%)"
                           width="150">
            <template slot-scope="scope">
              <input type="text"
                     class="edit-point-inp"
                     :disabled="!scope.row.canEdit"
                     v-model="scope.row.inversePoint">
              <span v-if="authBtn.sale">
                <img v-if="scope.row.canEdit"
                     class="edit-point-pic"
                     @click="editPoint(scope.row,2)"
                     src="../../assets/images/save.png"
                     alt="">
                <img class="edit-point-pic"
                     @click="editPoint(scope.row,1,scope)"
                     v-if="!scope.row.canEdit"
                     src="../../assets/images/edit.png"
                     alt="">
              </span>

            </template>
          </el-table-column>
          <el-table-column prop=""
                           label="剩余费率">
            <template slot-scope="scope">
              <div v-if="scope.row.myFeeList">
                <p v-for="item in scope.row.myFeeList">
                  {{item}}
                </p>
              </div>

            </template>

          </el-table-column>
          <el-table-column label="分销状态">
            <template slot-scope="scope">
              {{!scope.row.distributionId?'未分销':'已分销'}}
            </template>
          </el-table-column>
          <el-table-column label="销售状态">
            <template slot-scope="scope">
              {{!scope.row.distributionId?'/':scope.row.distributionId&&scope.row.isSale==1?'已销售':scope.row.distributionId&&scope.row.isSale==0?'已停售':''}}
            </template>
          </el-table-column>
          <el-table-column prop="createTimeStr"
           width="150"
                           label="生效时间">
          </el-table-column>
          <el-table-column label="操作"
                           fixed="right"
                           width="160">
            <template slot-scope="scope">
              <el-button @click="distributeGoods(scope.row)"
                         type="primary"
                         v-if="authBtn.stopSale"
                         size="mini">{{scope.row.distributionId?'停销':'分销'}}</el-button>
              <el-button @click="saleGoods(scope.row)"
                         v-if="scope.row.distributionId&&authBtn.upOrDown"
                         type="primary"
                         size="mini">{{scope.row.isSale==1?'停售':'销售'}}</el-button>

            </template>
          </el-table-column>

        </el-table>

        <div class="page-pagination">
          <el-pagination @size-change="handleSizeChange2"
                         @current-change="handleCurrentChange2"
                         :current-page="pageIndex2"
                         :page-sizes="[6,10,20,30,50]"
                         :page-size="pageSize2"
                         layout="total, sizes, prev, pager, next, jumper"
                         :total="total2">
          </el-pagination>
        </div>
      </span>
    </el-dialog>

    <!-- 弹窗 -->
    <el-dialog :title='title'
               width="60%"
               :visible.sync="dialogVisible">
      <span>
        <el-form ref="dialogForm"
                 :rules="rules"
                 :model="dialogForm"
                 label-width="120px">

          <el-form-item label="登录账户："
                        prop="username">
            <el-input v-model="dialogForm.username"
                      style="width:250px;"
                      placeholder="请输入真实手机号"></el-input>
          </el-form-item>

          <el-form-item label="一级标识：">
            <el-input v-model="dialogForm.firstOrg"
                      style="width:250px;"
                      placeholder="请输入某某医院"></el-input>
          </el-form-item>
          <el-form-item label="二级标识：">
            <el-input v-model="dialogForm.secondOrg"
                      style="width:250px;"
                      placeholder="请输入某某科室"></el-input>
          </el-form-item>
          <el-form-item label="三级标识：">
            <el-input v-model="dialogForm.thirdOrg"
                      style="width:250px;"
                      placeholder="请输入某某主任"></el-input>
          </el-form-item>

          <el-form-item label="真实姓名："
                        prop="name">
            <el-input v-model="dialogForm.name"
                      style="width:250px;"
                      placeholder="请输入真实姓名"></el-input>
          </el-form-item>
          <el-form-item label="登录密码："
                        v-if="title=='新增'"
                        prop="password">
            <el-input v-model="dialogForm.password"
                      style="width:250px;"
                      placeholder="请输入6位密码，数字和字母组成"></el-input>
          </el-form-item>
          <el-form-item label="确认密码："
                        v-if="title=='新增'"
                        prop="confirmPassword">
            <el-input v-model="dialogForm.confirmPassword"
                      style="width:250px;"
                      placeholder="再次输入密码"></el-input>
          </el-form-item>

          <el-form-item label="登录密码："
                        v-if="title!='新增'">
            <el-input v-model="dialogForm.password"
                      style="width:250px;"
                      placeholder="请输入6位密码，数字和字母组成"></el-input>
          </el-form-item>
          <el-form-item label="确认密码："
                        v-if="title!='新增'">
            <el-input v-model="dialogForm.confirmPassword"
                      style="width:250px;"
                      placeholder="再次输入密码"></el-input>
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
      userIdSon: '',
      dialogVisiblerole: false,
      pageIndexrole: 1,
      pageSizerole: 6,
      dataSourcerole: [],
      totalrole: 0,

      dialogVisible2: false,
      formInline2: {
        queryStr: '',
        isDist: '',
        isSale: '',
      },
      pageIndex2: 1,
      pageSize2: 6,
      dataSource2: [],
      total2: 0,

      roleType: localStorage.getItem('roleType'),

      formInline: {
        nameType: '',
        nameStr: '',
        phoneNum: '',
        isOpen: '',
        type: '',
      },
      dialogForm: {
        username: '',
        name: '',
        password: '',
        confirmPassword: '',
      },
      rules: {
        username: [
          {
            required: true,
            validator: (rule, value, cb) => {
              const reg = /^1(2|3|4|5|6|7|8)[0-9]{9}$/;
              if (reg.test(value)) {
                cb()
              } else {
                cb('登录账户必须是真实手机号')
              }
            },
            trigger: 'blur',
          },
        ],
        name: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' },
        ],
        password: [
          {
            required: true,
            validator: (rule, value, cb) => {
              const reg = /^[a-zA-Z0-9]{6}$/;
              if (reg.test(value)) {
                cb()
              } else {
                cb('请输入6位密码，数字和字母组成')
              }
            },
            trigger: 'blur',
          },
        ],
        confirmPassword: [
          {
            required: true,
            validator: (rule, value, cb) => {
              const reg = /^[a-zA-Z0-9]{6}$/;
              if (reg.test(value)) {
                cb()
              } else {
                cb('请输入6位密码，数字和字母组成')
              }
            },
            trigger: 'blur',
          },
        ],
      },
      title: '新增',
      pageIndex: 1,
      pageSize: 6,
      dataSource: [],
      total: 0,
      dialogVisible: false,

      userId: '',

      authBtn: {},
      authZd: {},
      payPeriodList: [],
    }
  },
  created() {
    this.getList();
    this.getAuthInfo();

    this.getJfqj();
  },
  methods: {
    rewd(item) {
      let str = '';
      let arr = item.payPeriod.split(',');
      this.payPeriodList.forEach(ele => {
        arr.forEach(ele2 => {
          if (ele.dictValue == ele2) {
            str += `${ele.dictLabel},`;
          }
        })
      })
      return `保险期间:${item.insurePerio} & 交费期间:${str}`;
    },
    getJfqj() {
      this.$get(`${this.baseUrls}/dictData/front/dictData/all`, {
        dictType: 'pay_period',
        isValid: 1,
      }).then((res) => {
        this.payPeriodList = res.data;
      })
    },
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
        priType: 2,
      }).then((res) => {
        this.authBtn = res.data;

      })

    },
    handleSizeChangerole(v) {
      this.pageSizerole = v;
      this.getListrole();
    },
    handleCurrentChangerole(v) {
      this.pageIndexrole = v;
      this.getListrole();
    },

    handleSizeChange(v) {
      this.pageSize = v;
      this.getList();
    },
    handleCurrentChange(v) {
      this.pageIndex = v;
      this.getList();
    },
    handleSizeChange2(v) {
      this.pageSize2 = v;
      this.getList2();
    },
    handleCurrentChange2(v) {
      this.pageIndex2 = v;
      this.getList2();
    },
    search2() {
      this.pageIndex2 = 1;
      this.getList2();
    },
    reSetsearch2() {
      this.formInline2 = {
        queryStr: '',
        isDist: '',
        isSale: '',
      };
    },
    search() {
      this.pageIndex = 1;
      this.getList();
    },
    reSetsearch() {
      this.formInline = {
        nameType: '',
        nameStr: '',
        phoneNum: '',
        isOpen: '',
        type: '',
      };
    },
    distributeGoods(row) {
      if (!row.distributionId) {
        this.$get(`${this.baseUrls}/product/front/admin/v1/sale`, {
          productId: row.productId,
          userId: this.userId,
          inversePoint: row.inversePoint ? row.inversePoint : 0,
        }).then((res) => {
          this.$message({
            type: 'success',
            message: '分销成功'
          });
          this.getList2();
        })
      } else {
        this.$get(`${this.baseUrls}/product/front/admin/v1/stopSale`, {
          distId: row.distributionId,
        }).then((res) => {
          this.$message({
            type: 'success',
            message: '停销成功'
          });
          this.getList2();
        })
      }
    },
    editPoint(row, type, scope) {
      if (type == 1) {
        this.dataSource2[scope.$index].canEdit = true;
        this.dataSource2 = [...this.dataSource2];
      } else {
        if (!row.inversePoint && row.inversePoint !== 0) {
          this.$message({
            type: 'error',
            message: '返点率不能为空'
          });
          return
        }
        this.$get(`${this.baseUrls}/product/front/admin/v1/sale`, {
          productId: row.productId,
          userId: this.userId,
          inversePoint: Number(row.inversePoint),
        }).then((res) => {
          this.$message({
            type: 'success',
            message: '修改成功'
          });
          this.getList2();
        })
      }

    },
    saleGoods(row) {
      this.$get(`${this.baseUrls}/product/front/admin/v1/upOrDown`, {
        distId: row.distributionId,
        isSale: row.isSale == 1 ? 0 : 1,
      }).then((res) => {
        this.$message({
          type: 'success',
          message: row.isSale == 1 ? '停售成功' : '销售成功'
        });
        this.getList2();
      })
    },
    addItem() {
      this.dialogForm = {
        username: '',
        name: '',
        password: '',
        confirmPassword: '',
      };
      this.title = '新增'
      this.dialogVisible = true;
    },
    distributeItem(row) {
      this.userId = row.userId;
      this.getList2();
      this.dialogVisible2 = true;

    },
    getList2() {
      this.$get(`${this.baseUrls}/product/front/admin/v1/queryDistribution`, {
        pageIndex: this.pageIndex2,
        pageSize: this.pageSize2,
        queryStr: this.formInline2.queryStr.replace(/\s+/g, ''),
        isDist: this.formInline2.isDist,
        isSale: this.formInline2.isSale,
        userId: this.userId,
      }).then((res) => {
        this.dataSource2 = res.data;
        this.total2 = res.totalCount;
      })
    },
    changeFrozen(row) {
      this.$get(`${this.baseUrls}/user/front/v1/frozen`, {
        userId: row.userId,
        isOpen: row.isOpen == 1 ? 0 : 1,
      }).then((res) => {
        this.$message({
          type: 'success',
          message: row.isOpen == 1 ? '冻结成功' : '开通成功'
        });
        this.getList();
      })
    },
    editItem(row) {
      this.title = '编辑';
      this.$get(`${this.baseUrls}/user/front/getUser`, {
        userId: row.userId
      }).then((res) => {
        this.dialogForm = res.data;
        this.dialogVisible = true;
      })
    },
    sureinfo() {
      this.$refs['dialogForm'].validate((valid) => {
        if (valid) {
          if (this.dialogForm.password != this.dialogForm.confirmPassword) {
            this.$message({
              type: 'error',
              message: '两次密码不一致'
            });
            return
          }
          this.$post(`${this.baseUrlh}/user/front/user/add`, {
            userId: this.title == '新增' ? null : this.dialogForm.id,
            username: this.dialogForm.username,
            firstOrg: this.dialogForm.firstOrg,
            secondOrg: this.dialogForm.secondOrg,
            thirdOrg: this.dialogForm.thirdOrg,
            name: this.dialogForm.name,
            password: this.dialogForm.password,
            confirmPassword: this.dialogForm.confirmPassword,
          }).then((res) => {
            this.dialogVisible = false;
            if (this.title == '新增') {
              this.$message.success('新增成功');
            } else {
              this.$message.success('修改成功');
            }
            this.getList();
          })
        } else {
          return false;
        }
      });
    },
    getList() {
      this.$get(`${this.baseUrlh}/user/front/v1/subAccountList`, {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        parentId: localStorage.getItem('id'),
        nameType: this.formInline.nameType,
        nameStr: this.formInline.nameStr.replace(/\s+/g, ''),
        phoneNum: this.formInline.phoneNum.replace(/\s+/g, ''),
        isOpen: this.formInline.isOpen,
        type: this.formInline.type,
      }).then((res) => {
        this.dataSource = res.data;
        this.total = res.totalCount;
      })
    },

    getListrole() {
      this.$get(`${this.baseUrlh}/privilege/front/admin/v1/queryRoleByUser`, {
        userId: this.userIdSon,
      }).then((res) => {
        let arr = res.data;
        arr.forEach(ele => {
          ele.isSelect = ele.userRoleId ? true : false;
        });
        this.dataSourcerole = arr;
      })
    },
    changeisSelect(row) {
      this.$get(`${this.baseUrlh}/privilege/front/admin/v1/selectRole`, {
        userId: this.userIdSon,
        roleId: row.roleId,
      }).then((res) => {
        this.getListrole();
      })
    },
    configRole(row) {
      this.userIdSon = row.userId;
      this.dialogVisiblerole = true;
      this.getListrole();
    },
  }
}
</script>

<style scoped rel="stylesheet/scss" lang="scss">
.edit-point-pic {
  width: 25px;
  height: 25px;
  cursor: pointer;
}
.edit-point-inp {
  width: 50%;
  position: relative;
  top: -10px;
  background: transparent;
  height: 100%;
  border: none;
  outline: none;
}
</style>

