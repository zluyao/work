<template>
    <div class="info-all-box mt40">
        <div class="clearfix">
            <div class="table-box fl" style="padding-right:20px;">
                <div class="table-title">文字配置</div>
                <el-table 
                    :data="wordList" 
                    border 
                    :row-class-name="tableRowClassName"
                    style="width: 100%">
                    <el-table-column prop="name" label="配置项" width="140"></el-table-column>
                    <el-table-column prop="explain" label="说明" width=150></el-table-column>
                    <el-table-column prop="word" label="文字"></el-table-column>
                    <el-table-column label="操作" width=110>
                        <template slot-scope="item">
                            <span @click="openWordDialog(item.row)" class="table-btn">编辑</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="table-box fr" style="padding-left:20px;">
                <div class="table-title">图片配置</div>
                <el-table 
                    :data="imgList" 
                    border 
                    :row-class-name="tableRowClassName"
                    style="width: 100%">
                    <el-table-column prop="name" label="配置项" width="140"></el-table-column>
                    <el-table-column prop="explain" label="说明" width="180"></el-table-column>
                    <el-table-column label="图片" width="150">
                        <template slot-scope="item">
                            <img class="avatar-img" :src="handleHead(item.row.image)" alt="">
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="item">
                            <span @click="openImgDialog(item.row)" class="table-btn">编辑</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <el-dialog
            :title="wordForm.name"
            :visible.sync="wordDialogVisible"
            width="500px"
            center>
            <el-form ref="wordForm" :model="wordForm" style="padding-bottom:155px">
                <el-form-item prop="word" :rules="{required: true, message: '文字不能为空', trigger: 'blur'}">
                    <el-input placeholder="请输入文字" type="textarea" :rows="3" maxlength="100" v-model="wordForm.word"></el-input>
                </el-form-item>
                <div class="explain-box">说明：{{wordForm.explain}}</div>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <span @click="sureWord" class="main-big-btn mr20">确定</span>
                <span @click="cancekWord" class="yellow-big-btn">取消</span>
            </span>
        </el-dialog>
        <el-dialog
            :title="imgForm.name"
            :visible.sync="imgDialogVisible"
            width="500px"
            center>
            <el-form ref="imgForm" :model="imgForm" style="padding-bottom:5px">
                <el-form-item>
                    <div class="upload-box">
                        <input accept=".jpg, .jpeg, .png, .gif" type="file" @change="uploadImg">
                        <template v-if="uploadImgUrl">
                            <img :src="uploadImgUrl" class="avatar">
                        </template>
                        <template v-else>
                            <template v-if="imgForm.image">
                                <img :src="handleHead(imgForm.image)" class="avatar">
                                <div class="upload-again-box">重新上传</div>
                            </template>
                            <template v-else>
                                <span class="el-icon-plus avatar-uploader-icon"></span>
                            </template>
                        </template>
                    </div>
                </el-form-item>
                <div class="explain-box2">说明：{{imgForm.explain}}</div>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <span @click="sureUploadImg" class="main-big-btn mr20">确定</span>
                <span @click="imgDialogVisible=false" class="yellow-big-btn">取消</span>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                wordList:[
                    {name:'系统名称',explain:'系统整体呈现名称',word:''},
                    {name:'版权信息',explain:'系统版本系统',word:''}
                ],
                imgList:[
                    {name:'系统logo',explain:'页面首页logo背景',image:''},
                    {name:'登录页背景',explain:'登录页背景图片',image:''}
                ],

                wordForm:{
                    name:'',
                    word:'',
                    explain:''
                },
                imgForm:{
                    name:'',
                    image:'',
                    explain:''
                },
                uploadImgUrl:'',
                uploadData:{},
                wordDialogVisible:false,
                imgDialogVisible:false,
            }
        },
        components: {

        },
        methods: {
            handleHead(val) {
                return `/api/common/download?path=${val}&Token=${window.sessionStorage.getItem('aiFaceToken')}`;
            },
            openWordDialog(item){
                this.wordForm = item
                this.wordDialogVisible = true
            },
            openImgDialog(item){
                this.uploadImgUrl = ''
                this.imgForm = item
                this.imgDialogVisible = true
            },
            sureWord(){
                this.$refs['wordForm'].validate(valid=>{
                    if(valid){
                        let nowApi = ''
                        if(this.wordForm.name==='系统名称'){
                            nowApi = 'api/platform/sysname'
                        }else{
                            nowApi = 'api/platform/copyright'
                        }
                        this.$tools.post(nowApi, {
                            name:this.wordForm.word
                        }).then(res=>{
                            this.wordDialogVisible = false
                            this.getInfo()
                            this.$message.success('操作成功')
                        })
                    }else{
                        return false
                    }
                })
            },
            cancekWord(){
                this.getInfo()
                this.wordDialogVisible=false
            },
            uploadImg(e){
                this.uploadData = e.target.files[0]
                var self = this
                this.uploadImgUrl = window.URL.createObjectURL(self.uploadData)
                e.target.value = ''
            },
            sureUploadImg(){
                let uploadApi = ''
                if(this.imgForm.name==='系统logo'){
                    uploadApi = 'api/platform/upload/logo'
                }else{
                    uploadApi = 'api/platform/upload/background'
                }
                this.$tools.post(uploadApi,{
                    file:this.uploadData
                },{},'form').then(res=>{
                    this.getInfo()
                    this.imgDialogVisible = false
                    this.$message.success('操作成功')
                })
            },
            tableRowClassName({ row, rowIndex }) {
                if (rowIndex % 2 != 0) {
                    return 'color-row'
                }
                    return ''
            },
            getInfo(){
                this.$tools.get('api/common/config').then(res => {
                    this.wordList[0].word = res.data.systemName
                    this.wordList[1].word = res.data.copyright
                    this.imgList[0].image = res.data.logoIcon
                    this.imgList[1].image = res.data.background
                })
            }
        },
        created() {
            this.getInfo()
        },
        mounted(){

        }
    };
</script>
<style lang="scss" scoped>
.info-all-box{text-align: left;padding-left: 40px;}
.table-box{width: 50%;box-sizing: border-box;}
.table-title{font-size: 20px;color: #2F224D;padding-bottom: 20px;font-weight: bold;}
.avatar-img{width: 24px;height: 24px;}
.explain-box{color: #C9C2D8;}
.explain-box2{color: #C9C2D8;text-align: center;}
.upload-box{position: relative;width: 220px;height: 220px;line-height: 220px;margin: 0 auto;border-radius: 8px;border:2px dashed #cac3da;text-align: center;}
.upload-box:hover .upload-again-box{opacity: 0.6;}
.upload-box span{font-size: 70px;color: #C9C2D8;}
.upload-box input{position: absolute;left: 0;top:0;z-index: 2; width: 100%;height: 220px;opacity: 0;}
.upload-box img{width: 100%;height: 220px;}
.upload-again-box{position: absolute;left: 0;top:0;width: 100%;height: 220px;line-height: 220px;font-size:20px;color:#fff;background:#5B546C;opacity: 0;}

</style>
<style>
.info-all-box .el-form-item{margin-bottom: 14px;}
</style>