<template>
    <div class="login-all-box">
        <img v-if="systemInfo.background==''" class="bg-img" src="../../assets/images/login-bg.png" alt="">
        <img v-else class="bg-img" :src=handleHead(systemInfo.background) alt="">
        <div class="content-box">
            <img v-if="systemInfo.logoIcon==''" class="logo-img" src="../../assets/images/logo.png" alt="">
            <img v-else class="logo-img" :src="handleHead(systemInfo.logo)" alt="">
            <div class="title-box">
                <img src="../../assets/images/point-left.png" alt="">
                <span>{{systemInfo.systemName !='' ? systemInfo.systemName : 'AI Face医疗智慧安防'}}</span>
                <img src="../../assets/images/point-right.png" alt="">
                <div v-show="wrongFlag" class="wrong-box">账号密码错误</div>
            </div>
            <el-form ref="loginForm" :rules="rules" :model="loginInfo" class="form-box">
                <el-form-item prop="userName">
                    <div class="user-box">
                        <img src="../../assets/images/user.png" alt="">
                        <el-input 
                            @focus='wrongFlag = false'
                            v-model="loginInfo.userName" 
                            placeholder="请输入登录账号"
                            clearable>
                        </el-input>
                    </div>
                </el-form-item>
                <el-form-item prop="password">
                    <div class="pwd-box">
                        <img src="../../assets/images/lock.png" alt="">
                        <el-input
                            @focus='wrongFlag = false'  
                            v-model="loginInfo.password"  
                            placeholder="请输入登录密码"
                            type='password'
                            @keyup.enter.native="doLogin"
                            clearable>
                        </el-input>
                    </div>
                    
                </el-form-item>
                <el-form-item style="margin-bottom:0;">
                    <div class="btn-box clearfix">
                        <el-checkbox class="fl" v-model="isRemeber" @change="doRemeber">记住账号密码</el-checkbox>
                        <el-button class="fr" type="primary" @click="doLogin">
                            <span v-show="!isSubmiting">立即登录</span>
                            <img v-show="isSubmiting" src="../../assets/images/loading.png" alt="">
                        </el-button>
                    </div>
                </el-form-item>
            </el-form>
            <div class="footer-box">{{systemInfo.copyright !='' ? systemInfo.copyright : '禾连健康 copyright 2019'}}</div>
        </div>
    </div>
</template>
<script>
import md5 from "js-md5"
export default {
    data() {
        return {
            loginInfo:{
                userName:'',
                password:''
            },
            isRemeber:true,
            rules:{
                userName:[{ required: true, message: '账号不得为空', trigger: 'blur'}],
                password:[{ required: true, message: '密码不得为空', trigger: 'blur'}],
            },
            isSubmiting:false,
            wrongFlag:false,
            systemInfo:{}
            
        };
    },
    components: {

    },
    methods: {
        handleHead(val) {
            return `/api/common/download?path=${val}&Token=${window.sessionStorage.getItem('aiFaceToken')}`;
        },
        doLogin(){
            this.$refs['loginForm'].validate(valid=>{
                if(valid){
                    this.isSubmiting = true
                    let nowpwd = md5(this.loginInfo.password)
                    this.$tools.post(`api/login/${this.loginInfo.userName}`, {
                        password: nowpwd
                    }).then(res=>{
                        this.isSubmiting = false
                        sessionStorage.setItem('aiFaceToken',res.data.token)
                        sessionStorage.setItem('aiFaceUserName',res.data.name)
                        //确保登录后重新进首页，所以清楚之前选中菜单
                        sessionStorage.removeItem('aiFaceMainMenuID')
                        sessionStorage.removeItem('aiFaceChildMenuID')
                        this.$router.push('/systemSetting/camera')
                    }).catch(err=>{
                        if(err.response.status === 516){
                            this.wrongFlag = true
                        }
                        this.isSubmiting = false
                    })
                }else{
                    return false
                }
            })
        },
        doRemeber(){
            if (this.isRemeber) {
                localStorage.setItem('aiFaceName', this.loginInfo.userName)
                localStorage.setItem('aiFacePassword', this.loginInfo.password)
            } else {
                localStorage.setItem('aiFaceName', '')
                localStorage.setItem('aiFacePassword', '')
            }
            localStorage.setItem('aiFaceIsRemeber', this.isRemeber)
        },
        getInfo () {
            this.$tools.get('api/common/config').then(res => {
                this.systemInfo = res.data
            })
        }
    },
    created () {
        this.getInfo()
        this.loginInfo.userName = localStorage.getItem('aiFaceName') || ''
        this.loginInfo.password = localStorage.getItem('aiFacePassword') || ''
        this.isRemeber = localStorage.getItem('aiFaceIsRemeber') === 'true'
    },
    mounted () {

    }
}
</script>
<style lang="scss" scoped>
.login-all-box{text-align: center;color: #fff;min-height: 100vh;position: relative;margin-left: -100px;margin-top: -80px;}
.bg-img{position: absolute;left: 0;top: 0; width: 100%;min-height:100%;}
.content-box{position: absolute;left: 0;top: 0;width: 100%;z-index: 2;}
.logo-img{width: 71px;margin-top: 119px;}
.title-box{position: relative; margin-top: 30px;font-weight: bold; font-size: 50px;}
.title-box span{margin: 0 30px;display: inline-block;}
.title-box img{margin-top:-10px;display: inline-block;}
.title-box .wrong-box{position: absolute;top:95px; color: #F73B79;width: 100%;font-size: 14px;font-weight: normal;}
.form-box{margin-top: 60px;}
.user-box{display: inline-block;width: 400px;position: relative;}
.pwd-box{display: inline-block;width: 400px;position: relative;}
.user-box img{position: absolute;left: 19px;top: 15px;}
.pwd-box img{position: absolute;left: 20px;top: 13px;}
.btn-box{display: inline-block;width: 400px;margin-top: 18px;}
.footer-box{margin-top: 242px;font-size: 10px;color: rgba(255,255,255,0.6)}
</style>
<style>
.login-all-box .el-input__inner{padding-left: 60px;background:rgba(255,255,255,0.2);height: 50px;color: #fff;}
.login-all-box .el-button--primary{width:164px;height:50px;color: #2F224D;font-size: 16px;background:rgba(255,221,27,1);box-shadow:0px 9px 10px -7px rgba(0,0,0,0.28);border-radius:25px;}
.login-all-box .el-checkbox__input.is-checked .el-checkbox__inner{background: rgba(255,255,255,0.2);border-color:rgba(255,255,255,0.5);}
.login-all-box .el-checkbox__inner{background: rgba(255,255,255,0.2);border-color: rgba(255,255,255,0.5);}
.login-all-box .el-checkbox{color: #fff;}
.login-all-box .el-checkbox__input.is-checked + .el-checkbox__label{color: #fff;}
.login-all-box .el-checkbox__input.is-focus .el-checkbox__inner{border-color: rgba(255,255,255,0.5);}
.login-all-box .el-form-item__content{display: inline-block;width: 400px;}
.login-all-box .el-form-item__error{font-size: 14px;top:29%;left: 91%;width: 200px;}
</style>
