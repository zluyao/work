<template>
  <div :class="classObj"
       class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened"
         class="drawer-bg"
         @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <navbar />
    <div class="main-container">
      <app-main />
    </div>

    <div class="account-showbtn"
         @click="showSetting"></div>
    <div class="setbox"
         v-if="isShowSetting">
      <div class="setitem"
           @click="showMainSetting">主体信息</div>
      <div class="line"></div>
      <div class="setitem"
           @click="showAccountSetting">账号设置</div>
    </div>

    <el-dialog title="主体信息"
               class="main-dialogbox dialog-mysetinfo"
               :close-on-click-modal="false"
               center
               width="900px"
               :visible.sync="outerVisible">

      <div class="warn-auth"
           v-if="authInfodetail.status==4">本次认证失败，详情咨询0571-56577519</div>

      <div class="wrapp-box"
           :class="{'wrapp-box2':authInfodetail.status!=4}">
        <div class="wrapp-left"
             :class="{'wrapp-left2':authInfodetail.status!=4}">
          <div class="headpic">
            <img src="../../assets/images/headpic.jpg"
                 alt="">
          </div>

          <div class="auth-btn"
               @click="goAuth">
            {{authInfodetail.status==1?'去认证':authInfodetail.status==2?'审核中':authInfodetail.status==3?'已认证':'去认证'}}
            <img v-if="authInfodetail.status==2||authInfodetail.status==3"
                 src="../../assets/images/authed.png"
                 alt="">
            <img v-if="authInfodetail.status==1||authInfodetail.status==4"
                 src="../../assets/images/unauth.png"
                 alt="">
          </div>
          <img class="authwordpic"
               src="../../assets/images/authword.png"
               alt="">
          <div class="auth-word">
            认证账户可以管理主体账户信息、销售商品

          </div>
        </div>
        <div class="wrapp-right">
          <div class="info-item">
            <p class="info-title">主体基本信息</p>
            <div class="comp-type"><span>主体类型：</span>公司</div>
          </div>
          <div class="info-item">
            <p class="info-title">企业信息</p>
            <div class="info-content">
              <p class="p1"><span>主体全程：</span>{{authInfodetail.companyName}}</p>
              <p v-if="!authInfodetail.licenseImg"
                 class="p2"><span>企业营业执照：</span>未上传</p>
              <p v-if="authInfodetail.licenseImg"
                 class="p2"><span>企业营业执照：</span>
                <img :src="authInfodetail.licenseImg"
                     style="width:60px;height:40px;"
                     alt="">
              </p>
            </div>
            <div class="info-content">
              <p class="p1"><span>服务费发票类型：</span>{{authInfodetail.invoiceType==1?'增值税专用发票':authInfodetail.invoiceType==2?'普通发票':''}}</p>
              <p class="p2"><span>发票税点：</span>{{authInfodetail.taxPoint}}%</p>
            </div>
            <div class="info-content">
              <p class="p1"><span>所属城市：</span>{{getCity(authInfodetail.city)}}</p>
              <p class="p2"><span>详细地址：</span>{{authInfodetail.address}}</p>
            </div>
            <div class="info-content">
              <p class="p1"><span>固定电话：</span>{{authInfodetail.fixedPhone}}</p>
            </div>

          </div>
          <div class="info-item">
            <p class="info-title">财务信息</p>
            <div class="info-content">
              <p class="p1"><span>户名：</span>{{authInfodetail.accountName}}</p>
              <p class="p2"><span>开户地址：</span>{{authInfodetail.bankAddress}}</p>
            </div>
            <div class="info-content">
              <p class="p1"><span>开户银行：</span>{{authInfodetail.bankName}}</p>
              <p class="p2"><span>银行卡号：</span>{{authInfodetail.bankNum}}</p>
            </div>
          </div>
        </div>
      </div>
      <el-dialog width="900px"
                 class="dialog-mysetinfo"
                 title="认证账户"
                 :close-on-click-modal="false"
                 :visible.sync="innerVisible"
                 append-to-body>
        <span>
          <el-form ref="dialogForm"
                   label-position="left"
                   size="small"
                   :rules="rules"
                   :model="dialogForm"
                   label-width="140px">
            <el-form-item label="联系人电话："
                          prop="phone">
              <el-input v-model="dialogForm.phone"
                        :disabled="true"
                        style="width:200px;"
                        placeholder="请输入联系人电话"></el-input>
            </el-form-item>
            <el-form-item label="真实姓名："
                          prop="name">
              <el-input v-model="dialogForm.name"
                        style="width:200px;"
                        placeholder="请输入真实姓名"></el-input>
            </el-form-item>
            <h4 style="margin-bottom:15px;">账户基本信息</h4>
            <el-form-item label="主体类型：">
              <el-select v-model="dialogForm.subjectType"
                         :disabled="true"
                         placeholder="请选择">
                <el-option label="公司"
                           :value="1">
                </el-option>

              </el-select>

            </el-form-item>
            <h4 style="margin-bottom:15px;">企业信息</h4>
            <el-form-item label="主体全称："
                          prop="companyName">
              <el-input v-model="dialogForm.companyName"
                        style="width:200px;"
                        placeholder="请输入主体全称"></el-input>
            </el-form-item>
            <el-form-item label="企业营业执照："
                          prop="licenseImg">
              <el-upload class="avatar-uploader avatar-uploader3"
                         :data="uploadKey"
                         :action="dataApi"
                         ref="files"
                         :show-file-list="false"
                         :on-success="handleAvatarSuccess"
                         :before-upload="beforeAvatarUpload">
                <img v-if="dialogForm.licenseImg"
                     :src="dialogForm.licenseImg"
                     class="avatar">
                <i v-else
                   class="el-icon-upload avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>

            <el-form-item label="服务费发票类型："
                          prop="invoiceType">
              <el-select v-model="dialogForm.invoiceType"
                         placeholder="请选择">
                <el-option label="增值税专用发票"
                           :value="1">
                </el-option>
                <el-option label="普通发票"
                           :value="2">
                </el-option>

              </el-select>

            </el-form-item>
            <el-form-item label="发票税点："
                          prop="taxPoint">
              <el-input v-model="dialogForm.taxPoint"
                        style="width:200px;"
                        type="number"
                        placeholder="请输入发票税点"></el-input>%
            </el-form-item>
            <el-form-item label="所属城市："
                          prop="city1"
                          size="small">
              <el-select v-model="dialogForm.provice"
                         @change="changeProvice($event)"
                         placeholder="请选择">
                <el-option v-for="(item,index) in provice"
                           :label="item.name"
                           :key="index"
                           :value="index">
                </el-option>

              </el-select>
              <el-select v-model="dialogForm.city1"
                         placeholder="请选择">
                <el-option v-for="(item,index) in cities"
                           :label="item.name"
                           :key="index"
                           :value="index">
                </el-option>

              </el-select>

            </el-form-item>
            <el-form-item label="详细地址："
                          prop="address">
              <el-input v-model="dialogForm.address"
                        style="width:200px;"
                        placeholder="请输入详细地址"></el-input>
            </el-form-item>
            <el-form-item label="固定电话："
                          prop="fixedPhone">
              <el-input v-model="dialogForm.fixedPhone"
                        style="width:200px;"
                        placeholder="请输入固定电话"></el-input>
            </el-form-item>
            <h4 style="margin-bottom:15px;">财务信息</h4>
            <el-form-item label="户名："
                          prop="accountName">
              <el-input v-model="dialogForm.accountName"
                        style="width:200px;"
                        placeholder="请输入户名"></el-input>
            </el-form-item>
            <el-form-item label="开户行地址："
                          prop="bankAddress">
              <el-input v-model="dialogForm.bankAddress"
                        style="width:200px;"
                        placeholder="请输入开户行地址"></el-input>
            </el-form-item>
            <el-form-item label="开户银行："
                          prop="bankName">
              <el-input v-model="dialogForm.bankName"
                        style="width:200px;"
                        placeholder="请输入开户银行"></el-input>
            </el-form-item>
            <el-form-item label="银行卡号："
                          prop="bankNum">
              <el-input v-model="dialogForm.bankNum"
                        style="width:200px;"
                        placeholder="请输入银行卡号"></el-input>
            </el-form-item>

          </el-form>
        </span>

        <span slot="footer"
              class="dialog-footer">
          <el-button type="primary"
                     @click="sureinfo">提 交</el-button>
        </span>
      </el-dialog>
    </el-dialog>

    <!-- 账号设置 -->
    <el-dialog title="账号设置"
               class="account-dialogbox dialog-mysetinfo"
               :close-on-click-modal="false"
               center
               width="500px"
               :visible.sync="accountVisible">

      <div class="account-box">
        <div class="account-box-inner">
          <div class="itemac">
            <span class="item-name">联系人：</span>
            <span class="item-value">{{this.userInfo.name?this.userInfo.name:'请输入真实姓名'}}</span>
            <span class="item-btn"
                  @click="editSave1">
              <img v-if="isEdit1"
                   src="../../assets/images/save.png"
                   alt="">
              <img v-if="!isEdit1"
                   src="../../assets/images/edit.png"
                   alt="">
              {{isEdit1?'保存':'编辑'}}
            </span>
          </div>
          <div class="edit-box1 edit-item"
               v-if="isEdit1">
            <span class="item-name">联系人：</span>
            <span class="item-value">
              <input type="text"
                     v-model="updataForm1.name">
            </span>
          </div>
          <div class="itemac">
            <span class="item-name">手机号：</span>
            <span class="item-value">{{this.userInfo.username}}</span>
            <span class="item-btn"
                  @click="editSave2">
              <img v-if="isEdit2"
                   src="../../assets/images/save.png"
                   alt="">
              <img v-if="!isEdit2"
                   src="../../assets/images/edit.png"
                   alt="">
              {{isEdit2?'保存':'编辑'}}
            </span>
          </div>

          <div class="edit-box2"
               v-if="isEdit2">
            <div class="edit-item">
              <span class="item-name">新手机号：</span>
              <span class="item-value">
                <input type="text"
                       v-model="updataForm2.username">
              </span>
            </div>
            <div class="edit-item">
              <span class="item-name">验证码：</span>
              <span class="item-value item-value2">
                <input type="text"
                       v-model="updataForm2.code">
              </span>
              <span class="get-code "
                    :class="{'get-code2':!canGetcode1}"
                    @click="getCode1">{{codeText1}}</span>
            </div>
          </div>

          <div class="itemac">
            <span class="item-name">登录密码：</span>
            <span class="item-value">******</span>
            <span class="item-btn"
                  @click="editSave3">
              <img v-if="isEdit3"
                   src="../../assets/images/save.png"
                   alt="">
              <img v-if="!isEdit3"
                   src="../../assets/images/edit.png"
                   alt="">
              {{isEdit3?'保存':'编辑'}}
            </span>
          </div>

          <div class="edit-box3"
               v-if="isEdit3">
            <div class="edit-item">
              <span class="item-name">手机号：</span>
              <span class="item-value">
                <input type="text"
                       :disabled="true"
                       v-model="updataForm3.username">
              </span>
            </div>
            <div class="edit-item">
              <span class="item-name">验证码：</span>
              <span class="item-value item-value2">
                <input type="text"
                       v-model="updataForm3.code">
              </span>
              <span class="get-code"
                    :class="{'get-code2':!canGetcode2}"
                    @click="getCode2">{{codeText2}}</span>
            </div>
            <div class="edit-item">
              <span class="item-name">修改密码：</span>
              <span class="item-value">
                <input type="text"
                       v-model="updataForm3.password">
              </span>
            </div>
            <div class="edit-item">
              <span class="item-name">确认密码：</span>
              <span class="item-value">
                <input type="text"
                       v-model="updataForm3.confirmPassword">
              </span>
            </div>
          </div>
        </div>

      </div>

    </el-dialog>

  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import provice from '@/utils/city.json'

export default {
  name: 'Layout',
  data() {
    return {
      updataForm1: {
        name: '',
        code: '',
        username: '',
        password: '',
        confirmPassword: '',
      },
      codeText1: '发送验证码',
      codeText2: '发送验证码',
      canGetcode1: true,
      canGetcode2: true,
      updataForm2: {
        name: '',
        code: '',
        username: '',
        password: '',
        confirmPassword: '',
      },
      updataForm3: {
        name: '',
        code: '',
        username: '',
        password: '',
        confirmPassword: '',
      },



      uploadKey: {
        dict: 'zd',
        userId: localStorage.getItem('id'),
        bussId: localStorage.getItem('id'),
      },
      dataApi: `${this.baseUrlupload}/consul/api/file/v1/upload`,
      isShowSetting: false,
      outerVisible: false,
      innerVisible: false,
      accountVisible: false,



      authInfodetail: {},
      dialogForm: {
        phone: localStorage.getItem('username'),
        name: '',
        subjectType: 1,
        companyName: '',
        licenseImg: '',
        invoiceType: '',
        taxPoint: '',
        provice: '',
        city1: '',
        address: '',
        fixedPhone: '',
        accountName: '',
        bankAddress: '',
        bankName: '',
        bankNum: '',
      },
      provice: provice,
      cities: [],
      rules: {
        phone: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' },
        ],
        name: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' },
        ],
        companyName: [
          { required: true, message: '请输入主体全称', trigger: 'blur' },
        ],
        licenseImg: [
          {
            required: true,
            validator: (rule, value, cb) => {
              if (!value) {
                cb('请上传企业营业执照')
              } else {
                cb()
              }
            },
            trigger: 'change',
          },
        ],
        invoiceType: [
          {
            required: true,
            validator: (rule, value, cb) => value !== '' ? cb() : cb('请选择服务费发票类型'),
            trigger: 'change',
          },
        ],
        taxPoint: [
          {
            required: true,
            validator: (rule, value, cb) => {
              if (value == '') {
                cb('格式有误，最多只能保留一位小数')
                return
              }
              const reg = /^(\d|[1-9]\d)([.]\d{1})?$/;
              const v = Number(value);
              if (!reg.test(v)) {
                cb('格式有误，最多只能保留一位小数')
              } else {
                cb()
              }
            },
            trigger: 'blur',
          },
        ],
        city1: [
          {
            required: true,
            validator: (rule, value, cb) => {
              if (value === '') {
                cb('请选择所属城市')
              } else {
                cb()
              }
            },
            trigger: 'change',
          },
        ],
        address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
        ],
        fixedPhone: [
          { required: true, message: '请输入固定电话', trigger: 'blur' },
        ],
        accountName: [
          { required: true, message: '请输入户名', trigger: 'blur' },
        ],
        bankAddress: [
          { required: true, message: '请输入开户行地址', trigger: 'blur' },
        ],
        bankName: [
          { required: true, message: '请输入开户银行', trigger: 'blur' },
        ],
        bankNum: [
          {
            required: true,
            validator: (rule, value, cb) => {
              const reg = /^([1-9]{1})(\d{14}|\d{18})$/g;
              if (reg.test(value)) {
                cb('请输入正确银行卡号')
              } else {
                cb()
              }
            },
            trigger: 'blur',
          },
        ],
      },
      isEdit1: false,
      isEdit2: false,
      isEdit3: false,

      userInfo: {},
    }
  },
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  async created() {
    await this.getUserInfo();
    this.updataForm3.username = this.userInfo.username;
  },
  methods: {
    getUserInfo(isChange) {
      return this.$get(`${this.baseUrlh}/user/front/getUser`).then((res) => {
        this.userInfo = res.data;

        if (isChange) {
          this.updataForm3.username = this.userInfo.username;
        }
      })
    },
    editSave1() {
      if (!this.isEdit1) {
        this.isEdit1 = true;
        this.updataForm1 = {
          name: '',
          code: '',
          username: '',
          password: '',
          confirmPassword: '',
        };
      } else {
        if (!this.updataForm1.name) {
          this.$message({
            type: 'error',
            message: '请输入修改的真实姓名',
          });
          return;
        }

        this.$post(`${this.baseUrlh}/user/front/update`, {
          name: this.updataForm1.name,
          code: '',
          username: '',
          password: '',
          confirmPassword: '',
        }).then((res) => {
          this.$message({
            type: 'success',
            message: '联系人修改成功',
          });
          this.getUserInfo();
          this.isEdit1 = false;
        })
      }
    },
    getCode1() {
      if (!this.canGetcode1) {
        return
      }
      const reg = /^1(2|3|4|5|6|7|8)[0-9]{9}$/;
      if (!reg.test(this.updataForm2.username)) {
        this.$message({
          type: 'error',
          message: '输入手机号有误',
        });
        return;
      }
      this.$get(`${this.baseUrlh3}/api/secret/user/v1/sendVerifyCode`, {
        phoneNum: this.updataForm2.username,
      }).then((res) => {
        let n = 59;
        this.codeText1 = `${n}秒后重新获取`;
        this.canGetcode1 = false;
        const timer = setInterval(() => {
          n--;
          if (n == 0) {
            this.canGetcode1 = true;
            this.codeText1 = '获取验证码';
            clearInterval(timer);
          } else {
            this.codeText1 = `${n}秒后重新获取`;
          }
        }, 1000)
      })
    },
    editSave2() {
      if (!this.isEdit2) {
        this.isEdit2 = true;
        this.updataForm2 = {
          name: '',
          code: '',
          username: '',
          password: '',
          confirmPassword: '',
        };
      } else {

        const reg = /^1(2|3|4|5|6|7|8)[0-9]{9}$/;
        if (!reg.test(this.updataForm2.username)) {
          this.$message({
            type: 'error',
            message: '输入手机号有误',
          });
          return;
        }

        const regCode = /^\d{4}$/;
        if (!regCode.test(this.updataForm2.code)) {
          this.$message({
            type: 'error',
            message: '输入验证码有误',
          });
          return;
        }

        this.$post(`${this.baseUrlh}/user/front/update`, {
          name: '',
          code: this.updataForm2.code,
          username: this.updataForm2.username,
          password: '',
          confirmPassword: '',
        }).then((res) => {
          this.$message({
            type: 'success',
            message: '手机号修改成功',
          });
          this.getUserInfo(1);
          this.isEdit2 = false;
        })
      }
    },
    getCode2() {
      if (!this.canGetcode2) {
        return
      }
      const reg = /^1(2|3|4|5|6|7|8)[0-9]{9}$/;
      if (!reg.test(this.updataForm3.username)) {
        this.$message({
          type: 'error',
          message: '输入手机号有误',
        });
        return;
      }
      this.$get(`${this.baseUrlh3}/api/secret/user/v1/sendVerifyCode`, {
        phoneNum: this.updataForm3.username,
      }).then((res) => {
        let n = 59;
        this.codeText2 = `${n}秒后重新获取`;
        this.canGetcode2 = false;
        const timer = setInterval(() => {
          n--;
          if (n == 0) {
            this.canGetcode2 = true;
            this.codeText2 = '获取验证码';
            clearInterval(timer);
          } else {
            this.codeText2 = `${n}秒后重新获取`;
          }
        }, 1000)
      })
    },
    editSave3() {
      if (!this.isEdit3) {
        this.isEdit3 = true;

        this.updataForm3 = {
          name: '',
          code: '',
          username: this.userInfo.username,
          password: '',
          confirmPassword: '',
        };
      } else {

        const reg = /^1(2|3|4|5|6|7|8)[0-9]{9}$/;
        if (!reg.test(this.updataForm3.username)) {
          this.$message({
            type: 'error',
            message: '输入手机号有误',
          });
          return;
        }

        const regCode = /^\d{4}$/;
        if (!regCode.test(this.updataForm3.code)) {
          this.$message({
            type: 'error',
            message: '输入验证码有误',
          });
          return;
        }

        const regPassword = /^[0-9a-zA-Z]{6}$/;
        if (!regPassword.test(this.updataForm3.password)) {
          this.$message({
            type: 'error',
            message: '密码为6位数字或字母组成',
          });
          return;
        }

        if (this.updataForm3.confirmPassword != this.updataForm3.password) {
          this.$message({
            type: 'error',
            message: '两次密码不一致',
          });
          return;
        }

        this.$post(`${this.baseUrlh}/user/front/update`, {
          name: '',
          code: this.updataForm3.code,
          username: this.updataForm3.username,
          password: this.updataForm3.password,
          confirmPassword: this.updataForm3.confirmPassword,
        }).then((res) => {
          this.$message({
            type: 'success',
            message: '密码修改成功',
          });
          this.getUserInfo();
          this.isEdit3 = false;
        })
      }
    },

    getAuthDetail() {
      this.$get(`${this.baseUrlh}/user/front/v1/getCertification?userId=${localStorage.getItem('id')}`).then((res) => {
        this.authInfodetail = res.data;
      })
    },
    getCity(str) {
      if (!str) {
        return ''
      }
      const arr = str.split(',');
      return `${this.provice[Number(arr[0])].name}${this.provice[Number(arr[0])].children[arr[1]].name}`
    },
    async goAuth() {
      if (this.authInfodetail.status == 2 || this.authInfodetail.status == 3) {
        return;
      }
      await this.getUserInfo();
      if (this.userInfo.name) {
        this.dialogForm.name = this.userInfo.name;
      }
      this.dialogForm.username = this.userInfo.username;
      this.innerVisible = true;
    },
    showMainSetting() {
      this.outerVisible = true;
      this.getAuthDetail();
    },
    showAccountSetting() {
      this.getUserInfo();
      this.accountVisible = true;
    },
    showSetting() {
      this.isShowSetting = !this.isShowSetting;
    },

    beforeAvatarUpload(file) {
      if (file.type.indexOf('image') == -1) {
        this.$message({
          type: 'error',
          message: '上传文件只能是图片',
        });
        return false;
      }

    },
    handleAvatarSuccess(res) {
      this.dialogForm.licenseImg = res.data;
    },
    changeProvice(e) {
      this.cities = this.provice[e].children;
      this.dialogForm.city1 = 0;
    },
    sureinfo() {
      this.$refs['dialogForm'].validate((valid) => {
        if (valid) {

          this.$post(`${this.baseUrlh}/user/front/v1/submitCertification`, {
            name: this.dialogForm.name,
            subjectType: this.dialogForm.subjectType,
            companyName: this.dialogForm.companyName,
            licenseImg: this.dialogForm.licenseImg,
            invoiceType: this.dialogForm.invoiceType,
            taxPoint: Number(this.dialogForm.taxPoint),
            city: `${this.dialogForm.provice},${this.dialogForm.city1}`,
            address: this.dialogForm.address,
            fixedPhone: this.dialogForm.fixedPhone,
            accountName: this.dialogForm.accountName,
            bankAddress: this.dialogForm.bankAddress,
            bankName: this.dialogForm.bankName,
            bankNum: this.dialogForm.bankNum,
          }).then((res) => {
            this.$message({
              type: 'success',
              message: '提交成功',
            });
            this.outerVisible = false;
            this.innerVisible = false;
            this.getAuthDetail();
          })

        } else {
          return false;
        }
      })

    },

    handleClickOutside() {
      this.$store.dispatch('CloseSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}
.account-showbtn {
  cursor: pointer;
  position: fixed;
  top: 0;
  right: 130px;
  width: 130px;
  height: 56px;
  z-index: 901;
}
.setbox {
  position: fixed;
  z-index: 902;
  box-shadow: 0px 10px 10px 0px rgba(0, 0, 0, 0.05);
  border-radius: 5px;
  right: 94px;
  top: 46px;
  height: 121px;
  width: 200px;
  background: #fff;
  .line {
    position: absolute;
    top: 60px;
    left: 10px;
    width: 180px;
    height: 1px;
    background: #eeeeee;
  }
  > .setitem {
    cursor: pointer;
    height: 60px;
    font-size: 14px;
    color: #212135;
    line-height: 60px;
    padding-left: 20px;
    background: #fff;
    &:hover {
      background: rgba(255, 87, 87, 0.03);
    }
  }
}
.main-dialogbox {
  .warn-auth {
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: #e66965;
    font-size: 14px;
    background: #f9f1f1;
  }
  .wrapp-box {
    height: 580px;
    position: relative;
    padding-top: 34px;
    padding-left: 260px;
    font-size: 14px;
    color: #212135;
    .wrapp-left {
      position: absolute;
      width: 260px;
      top: 32px;
      left: 0;
      .headpic {
        position: absolute;
        width: 120px;
        height: 120px;
        box-shadow: 0px 2px 20px 0px rgba(118, 118, 118, 0.3);
        top: 0;
        left: 70px;
        border-radius: 50%;
        overflow: hidden;
        > img {
          width: 100%;
          height: 100%;
        }
      }
      .authwordpic {
        position: absolute;
        top: 200px;
        left: 30px;
        width: 22px;
        height: 22px;
      }
      .auth-word {
        position: absolute;
        top: 200px;
        left: 60px;
        width: 152px;
        height: 40px;
        line-height: 20px;
        color: #999;
        font-size: 14px;
        text-align: justify;
      }
      .auth-btn {
        position: absolute;
        cursor: pointer;
        color: #fff;
        font-size: 12px;
        font-weight: 700;
        left: 85px;
        top: 140px;
        width: 92px;
        height: 30px;
        background: linear-gradient(
          90deg,
          rgba(247, 127, 102, 1) 0%,
          rgba(255, 87, 87, 1) 100%
        );
        box-shadow: 0px 4px 10px 0px rgba(231, 181, 179, 1);
        border-radius: 18px;
        line-height: 30px;
        padding-left: 36px;
        position: relative;
        > img {
          position: absolute;
          width: 11px;
          height: 13px;
          top: 8px;
          left: 21px;
        }
      }
    }
    .wrapp-left2 {
      top: 50px;
    }
    .wrapp-right {
      width: 100%;
    }
    .info-item {
      margin-bottom: 50px;
      .info-title {
        height: 20px;
        line-height: 20px;
        margin-bottom: 43px;
        position: relative;
        &::after {
          position: absolute;
          content: "";
          width: 40px;
          height: 1px;
          background: #eee;
          left: 0;
          bottom: -10px;
        }
      }
      .comp-type {
        height: 20px;
        line-height: 20px;
        > span {
          padding-right: 12px;
        }
      }
      .info-content {
        height: 20px;
        line-height: 20px;
        margin-bottom: 20px;
        > p {
          display: inline-block;
          > span {
            padding-right: 12px;
          }
        }
        .p1 {
          // width: 365px;
          width: 265px;
        }
        .p2 {
          // width: 270px;
          width: 365px;
          position: relative;
          > img {
            position: absolute;
            top: -10px;
            left: 106px;
          }
        }
      }
    }
    .info-item:last-of-type {
      margin-bottom: 0px;
    }
  }
  .wrapp-box2 {
    padding-top: 44px;
    &::before {
      position: absolute;
      content: "";
      width: 860px;
      height: 1px;
      background: #eee;
      top: 0;
      left: 20px;
    }
  }
}

.account-dialogbox {
  .account-box {
    position: relative;
    &::before {
      position: absolute;
      content: "";
      top: 0;
      left: 20px;
      width: 460px;
      height: 1px;
      background: #eee;
    }
  }

  .account-box-inner {
    padding: 58px 60px 90px 0;
    .itemac {
      height: 20px;
      line-height: 20px;
      margin-bottom: 30px;
      font-size: 14px;
      color: #212326;
      position: relative;
      padding-left: 126px;
      .item-name {
        position: absolute;
        width: 126px;
        height: 20px;
        line-height: 20px;
        text-align: right;
        top: 0;
        left: 0;
      }
      .item-btn {
        position: absolute;
        right: 0;
        top: 0;
        height: 20px;
        line-height: 20px;
        padding-left: 30px;
        color: #ff5757;
        cursor: pointer;
        > img {
          position: absolute;
          top: 0;
          left: 0;
          width: 20px;
          height: 20px;
        }
      }
    }
    .edit-item {
      width: 100%;
      height: 40px;
      line-height: 40px;
      margin-bottom: 20px;
      font-size: 14px;
      color: #212326;
      position: relative;
      padding-left: 126px;
      .item-name {
        position: absolute;
        width: 126px;
        height: 40px;
        text-align: right;
        color: #666666;
        top: 0;
        left: 0;
      }
      .item-value {
        display: block;
        width: 100%;
        height: 40px;
        padding-left: 30px;
        background: #fafafa;
        > input {
          width: 100%;
          height: 40px;
          background: transparent;
          border: none;
          outline: none;
        }
      }
      .item-value2 {
        width: 160px;
      }
      .get-code {
        cursor: pointer;
        width: 120px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        position: absolute;
        top: 0;
        right: 0;
        color: #ff5757;
        border: 1px solid rgba(255, 87, 87, 1);
      }
      .get-code2 {
        color: #999;
        border: 1px solid #eee;
      }
    }
  }
}
</style>
