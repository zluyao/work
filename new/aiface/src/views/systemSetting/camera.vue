<template>
    <div class="video-all-box">
        <div class="menu-tab">
            <span @click="showTab1" :class="checkedTab===0?'tab-active':''" class="tab-left">摄像头</span>
            <span @click="showTab2" :class="checkedTab===1?'tab-active':''" >抓拍机</span>
        </div>
        <el-table
        class="mt40"
        :data="videoList"
         border
        :row-class-name="tableRowClassName"
         @selection-change="handleSelectionChange">
           <el-table-column type="selection" width="90"></el-table-column>
           <el-table-column label="编号" width="90">
               <template slot-scope="item">{{item.$index + 1}}</template>
           </el-table-column>
           <el-table-column prop="name" label="名称"></el-table-column>
           <el-table-column prop="ip" label="IP"></el-table-column>
           <el-table-column prop="port" label="端口"></el-table-column>
           <el-table-column prop="account" label="账号"></el-table-column>
           <el-table-column prop="pswd" label="密码"></el-table-column>
           <el-table-column prop="placeName" label="位置"></el-table-column>
           <el-table-column label="状态">
                <template slot-scope="item">{{item.row.status==1?'在线':'离线'}}</template>
            </el-table-column>
           <el-table-column label="操作">
               <template slot-scope="item">
                   <span @click="openVideoDialog(item.row)" class="table-btn">编辑</span>
               </template>
           </el-table-column>
       </el-table>
       <el-pagination
           class="fr mt30"
           background
           @size-change="getList"
           @current-change="getList"
           :current-page.sync="pageInfo.page"
           :page-size="20"
           layout="prev, pager, next, jumper"
           :total="pageInfo.total">
       </el-pagination>
       <div class="btn-box mt40">
           <span @click="openVideoDialog" class="yellow-small-btn mr20">新建</span>
           <span @click="delCamera" class="del-btn">删除</span>
       </div>

       <el-dialog
            :title="(cameraForm.id>0 && checkedTab==0)?'编辑摄像头':(cameraForm.id>0 && checkedTab==1)?'编辑抓拍机':(cameraForm.id==0 && checkedTab==0)?'新建摄像头':'新建抓拍机'"
            :visible.sync="videoDialogVisible"
            width="500px"
            center>
            <el-form ref="cameraForm" :model="cameraForm" >
                <el-form-item prop="name"  :rules="{required: true, message: '名称不能为空', trigger: 'blur'}">
                    <el-input v-model="cameraForm.name">
                        <template slot="prepend"><span style="color:#f00;">*</span>名称</template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="placeName"  :rules="{required: true, message: '地点不能为空', trigger: 'blur'}">
                    <el-input v-model="cameraForm.placeName">
                        <template slot="prepend"><span style="color:#f00;">*</span>地点</template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="ip"  :rules="{required: true, message: 'IP不能为空', trigger: 'blur'}">
                    <el-input v-model="cameraForm.ip">
                        <template slot="prepend"><span style="color:#f00;">*</span>IP</template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="port"  :rules="{required: true, message: '端口不能为空', trigger: 'blur'}">
                    <el-input v-model="cameraForm.port">
                        <template slot="prepend"><span style="color:#f00;">*</span>端口</template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="account"  :rules="{required: true, message: '账号不能为空', trigger: 'blur'}">
                    <el-input v-model="cameraForm.account">
                        <template slot="prepend"><span style="color:#f00;">*</span>账号</template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="pswd"  :rules="{required: true, message: '密码不能为空', trigger: 'blur'}">
                    <el-input v-model="cameraForm.pswd">
                        <template slot="prepend"><span style="color:#f00;">*</span>密码</template>
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <span @click="doCamera" class="main-big-btn mr20">确定</span>
                <span @click="videoDialogVisible=false" class="yellow-big-btn">取消</span>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data () {
        return {
            checkedTab: 0,
            videoList:[],
            pageInfo:{
                page:1,
                total:1000
            },
            multipleSelection:[],
            videoDialogVisible:false,
            cameraForm:{
                name:'',
                placeName:'',
                ip:'',
                port:'',
                account:'',
                pswd:'',
                id:0
            }
        }
    },
    components: {

    },
    methods: {
        tableRowClassName({ row, rowIndex }) {
            if (rowIndex % 2 != 0) {
                return 'color-row'
            }
                return ''
        },
        handleSelectionChange(val){
            this.multipleSelection = val
        },
        openVideoDialog(item){
            this.cameraForm = {
                name:'',
                placeName:'',
                ip:'',
                port:'',
                account:'',
                pswd:'',
                id:0
            }
            if(item.id){
                delete item.status
                this.cameraForm = item
            }
            this.videoDialogVisible = true
        },
        delCamera(){
            if(this.multipleSelection.length===0){
                this.$message.warning('请选择要删除的设备')
                return
            }
            this.$confirm('确定删除所选设备么?', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let nowCheckedList = this.multipleSelection.map(item=>item.id)
                this.$tools.doDelete('api/camera', nowCheckedList,'json').then(res=>{
                    this.getList()
                    this.$message.success('操作成功')
                })
            }).catch(() => {
                this.$message.info('已取消操作') 
            })
        },
        doCamera(){
            this.$refs['cameraForm'].validate(valid=>{
                if(valid){
                    this.cameraForm.type = this.checkedTab
                    this.$tools.post('api/camera', this.cameraForm,{},'json').then(res=>{
                        this.videoDialogVisible = false
                        this.getList()
                        this.$message.success('操作成功')
                    }).catch(err=>{
                        if(err.response.status === 516){
                            this.$message.error(err.response.data.message)
                        }
                    })
                }else{
                    return false
                }
            })
        },
        showTab1 () {
            this.checkedTab = 0
            this.getList()
        },
        showTab2 () {
            this.checkedTab = 1
            this.getList()
        },
        getList(){
            this.$tools.get('api/camera',{
                pageNum:this.pageInfo.page,
                pageSize:20,
                type:this.checkedTab
            }).then(res => {
                this.videoList = res.data.rows
                this.pageInfo.total = res.data.total
            })
        },
    },
    created () {
        this.getList()
    },
    mounted () {

    }
}
</script>
<style lang="scss" scoped>
.video-all-box{text-align: left;position: relative;padding-left: 40px;}
.menu-tab{position: relative; width: calc(100% + 80px);margin-left: -40px; height: 40px;background: #fff;box-shadow:0px 8px 16px 0px rgba(242,240,247,0.8);color: #857B9D;}
.menu-tab span{cursor: pointer;}
.tab-left{padding-right: 14px;margin-right: 14px;margin-left: 50px; border-right: 2px solid #E3E0EB;line-height: 40px;}
.tab-active{color: #2F224D;font-weight: bold;}
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
