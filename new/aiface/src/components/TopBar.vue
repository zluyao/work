<template>
  <div>
    <ul class="top-bar-box clearfix" :class="checkedID==='system-camera'?'no-shadow':''">
      <template v-for="item in menuList">
        <li class="bar-title-box" @click="gotoPage(item.id)">
          <span :class="checkedID===item.id?'title-active':''" class="bar-title">{{item.name}}</span>
        </li>
      </template>
      <li class="right-box fr">
        <img src="../assets/images/help.png" alt="">
        <span class="right-help">帮助</span>
        <span class="hover-box">
          <img class="right-avatar" src="../assets/images/avatar.png" alt="">
          <span>Hello {{userName}}</span>
          <div class="right-select-box">
            <div class="triangle"></div>
            <div @click="pswdDialogVisible=true" class="right-pswd">
              <img class="img-pswd1" src="../assets/images/pswd.png" alt=""> 
              <img class="img-pswd2" src="../assets/images/pswd-active.png" alt=""> 
              修改密码
            </div>
            <div @click="doLogout" class="right-logout">
              <img class="img-logout1" src="../assets/images/logout.png" alt=""> 
              <img class="img-logout2" src="../assets/images/logout-active.png" alt=""> 
              退出登录
            </div>
          </div>
        </span>

      </li>
    </ul>
    <div v-if="pswdDialogVisible">
      <el-dialog title="修改密码" :visible.sync="pswdDialogVisible" width="500px" append-to-body center>
        <el-form ref="pswdForm" :model="pswdForm" style="padding-bottom:55px">
          <el-form-item prop="oldPswd" :rules="{required: true, message: '旧密码不能为空', trigger: 'blur'}">
            <el-input v-model="pswdForm.oldPswd" type='password'>
              <template slot="prepend"><span style="color:#f00;">*</span>旧密码</template>
            </el-input>
          </el-form-item>
          <el-form-item prop="newPswd" :rules="{required: true, message: '新密码不能为空', trigger: 'blur'}">
            <el-input v-model="pswdForm.newPswd" type='password'>
              <template slot="prepend"><span style="color:#f00;">*</span>新密码</template>
            </el-input>
          </el-form-item>
          <el-form-item prop="newPswdSame" :rules="{required: true, message: '确认密码不能为空', trigger: 'blur'}">
            <el-input v-model="pswdForm.newPswdSame" type='password'>
              <template slot="prepend"><span style="color:#f00;">*</span>确认密码</template>
            </el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <span @click="changePswd" class="main-big-btn mr20">确定</span>
          <span @click="pswdDialogVisible=false" class="yellow-big-btn">取消</span>
        </span>
      </el-dialog>
    </div>

  </div>

</template>

<script>
  import md5 from "js-md5"
  export default {
    name: 'LeftBar',
    props: {

    },
    data() {
      return {
        checkedID: '',
        userName: sessionStorage.getItem('aiFaceUserName') || '',
        pswdForm: {
          oldPswd: '',
          newPswd: '',
          newPswdSame: ''
        },
        pswdDialogVisible: false
      }
    },
    computed: {
      menuList() {
        this.checkedID = sessionStorage.getItem('aiFaceChildMenuID') || ''
        let childMenuIDList = this.$store.state.childMenu.map(item => {
          return item.id
        })
        if (this.$store.state.childMenu.length > 0 && childMenuIDList.indexOf(this.checkedID) === -1) {
          this.checkedID = (this.$store.state.childMenu)[0].id
        }
        return this.$store.state.childMenu
      }
    },
    methods: {
      gotoPage(id) {
        this.checkedID = id
        sessionStorage.setItem('aiFaceChildMenuID', id) //为了防止刷新时失去所选子菜单，记录到本地
        switch (id) {
          case 'control-task':
            this.$router.push('/control/task')
            break
          case 'control-target':
            this.$router.push('/control/target')
            break
          case 'control-main':
            this.$router.push('/control/main')
            break
          case 'control-warn':
            this.$router.push('/control/alarmrecords')
            break
          case 'control-snap':
            this.$router.push('/control/capturerecords')
            break  


          case 'system-camera':
            this.$router.push('/systemSetting/camera')
            break
          case 'system-info':
            this.$router.push('/systemSetting/info')
            break
          case 'system-map':
            this.$router.push('/systemSetting/map')
            break
          case 'system-user':
            this.$router.push('/systemSetting/user')
            break
          case 'system-role':
            this.$router.push('/systemSetting/role')
            break

          case 'compare-static':
            this.$router.push('/staticCompare/searching')
            break
          case 'compare-1-1':
            this.$router.push('/staticCompare/verify')
            break
          case 'compare-snap':
            this.$router.push('/staticCompare/snap')
            break
        }
      },
      doLogout() {
        this.$confirm('确定退出登录?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$tools.doDelete('api/login/logout', {}, 'json').then(res => {
            this.$router.push('/login')
          })
        }).catch(() => {
          this.$message.info('已取消操作')
        })
      },
      changePswd() {
        this.$refs['pswdForm'].validate(valid => {
          if (valid) {
            if (this.pswdForm.newPswd != this.pswdForm.newPswdSame) {
              this.$message.error('新密码与确认密码不一致,请重新输入')
              return
            }
            let params = {
              password: md5(this.pswdForm.oldPswd),
              newpassword: md5(this.pswdForm.newPswd)
            }
            this.$tools.post('api/user/pswd', params).then(res => {
              this.$message.success('操作成功')
              this.pswdDialogVisible = false
            })
          } else {
            return false
          }
        })
      }
    }
  }

</script>

<style scoped lang="scss">
  .top-bar-box {
    margin-left: 100px;
    padding-left: 9px;
    height: 80px;
    text-align: left;
    box-shadow: 0px 8px 16px 0px rgba(242, 240, 247, 0.8);
    min-width: 920px;
  }

  .no-shadow {
    box-shadow: none;
  }

  .bar-title-box {
    padding: 30px 31px 0;
    display: inline-block;
    color: #857b9d;
    cursor: pointer;
  }

  .bar-title {
    display: inline-block;
    padding-bottom: 20px;
  }

  .title-active {
    border-bottom: 4px solid #ffdd1b;
    font-size: 18px;
    color: #2f224d;
    font-weight: bold;
  }

  .right-box {
    position: relative;
    margin-top: 20px;
    color: #212326;
    padding-right: 40px;
  }

  .right-help {
    display: inline-block;
    padding: 0 17px 0 6px;
    border-right: 2px solid #e3e0eb;
  }

  .right-avatar {
    margin: 0 10px 0 17px;
  }

  .right-select-box {
    position: absolute;
    top: 50px;
    left: 110px;
    transition: all 0.2s;
    overflow: hidden;
    cursor: pointer;
    background: #2f224d;
    color: #fff;
    width: 144px;
    height: 0;
    box-shadow: 0px 0px 10px 0px rgba(227, 224, 235, 0.7);
    border-radius: 6px;
    text-align: center;
  }

  .triangle {
    width: 0;
    height: 0;
    margin: -17px 0 0 17px;
    border: 10px solid rgba(1, 1, 1, 0);
    border-bottom: 10px solid #2f224d;
  }

  .right-pswd {
    padding: 12px 20px 12px 0;
  }

  .img-pswd1{display: inline-block}
  .img-pswd2{display: none}

  .right-pswd:hover {
    color: #ffdd1b;
  }
  .right-pswd:hover .img-pswd1{display: none}
  .right-pswd:hover .img-pswd2{display: inline-block}

  .right-pswd img {
    margin-right: 10px;
  }

  .right-logout {
    padding: 12px 20px 12px 0;
  }
  .img-logout1{display: inline-block;}
  .img-logout2{display: none;}

  .right-logout:hover {
    color: #ffdd1b;
  }
  .right-logout:hover .img-logout1{display: none;}
  .right-logout:hover .img-logout2{display: inline-block;}

  .right-logout img {
    margin-right: 10px;
  }

  .hover-box {
    cursor: pointer;
  }

  .hover-box:hover .right-select-box {
    height: 100px;
    overflow: visible;
  }

</style>
