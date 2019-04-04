<template>
    <div class="user-all-box mt40">
        <div class="search-user-box pb40 clearfix">
            <el-input class="search-user fr" placeholder="搜索用户" v-model="searchValue" clearable
                suffix-icon="el-icon-search"
                @keyup.native.enter="getList"
                @clear="getList">
            </el-input>
        </div>
        <el-table
         :data="userList"
          border
         :row-class-name="tableRowClassName"
          @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="90"></el-table-column>
            <el-table-column prop="account" label="账号"></el-table-column>
            <el-table-column prop="name" label="用户名"></el-table-column>
            <el-table-column prop="roleNames" label="用户角色"></el-table-column>
            <el-table-column prop="createUserName" label="创建人"></el-table-column>
            <el-table-column prop="createDate" label="创建时间"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="item">
                    <span @click="openUserDialog(item.row)" class="table-btn">编辑</span>
                    <span @click="resetPassword(item.row)" class="table-btn">重置密码</span>
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
            <span @click="openUserDialog" class="yellow-small-btn mr20">新建</span>
            <span @click="delUser" class="del-btn">删除</span>
        </div>

        <el-dialog
            :title="userForm.roleID>0?'编辑用户':'新建用户'"
            :visible.sync="userDialogVisible"
            width="500px"
            center>
            <div class="tips-box"><img src="../../assets/images/warning.png" alt=""> 初始密码为：111111，请登录后立即修改密码</div>
            <el-form ref="userForm" :model="userForm" >
                <el-form-item prop="userName"  :rules="{required: true, message: '用户名称不能为空', trigger: 'blur'}">
                    <el-input v-model="userForm.userName">
                        <template slot="prepend"><span style="color:#f00;">*</span>用户名称</template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="userRoleID"  :rules="{required: true, message: '用户角色不能为空', trigger: 'change'}">
                    <div class="user-select-box">
                        <span class="role-select"><span style="color:#f00;">*</span>用户角色</span>
                        <el-select v-model="userForm.userRoleID" placeholder="请选择">
                            <el-option
                              v-for="item in selectRoleList"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                </el-form-item>
                <el-form-item prop="account"  :rules="{required: true, message: '账号不能为空', trigger: 'blur'}">
                    <el-input v-model="userForm.account">
                        <template slot="prepend"><span style="color:#f00;">*</span>账号</template>
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <span @click="doUser" class="main-big-btn mr20">确定</span>
                <span @click="userDialogVisible=false" class="yellow-big-btn">取消</span>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                userList:[],
                pageInfo:{
                    page:1,
                    total:1000
                },
                multipleSelection:[],
                searchValue:'',

                userForm:{
                    userName:'',
                    userID:0,
                    account:'',
                    userRoleID:''
                },
                selectRoleList:[],
                userDialogVisible:false,
            }
        },
        components: {

        },
        methods: {
            openUserDialog(item){
                this.userForm = {
                    userName:'',
                    userID:0,
                    account:'',
                    userRoleID:''
                }
                if(item.id){
                    let nowArr = this.selectRoleList.filter(one=>{
                        return one.name === item.roleNames
                    })
                    this.userForm = {
                        userName:item.name,
                        userID:item.id,
                        account:item.account,
                        userRoleID:nowArr[0].id
                    }
                }
                this.userDialogVisible = true
            },
            doUser(){
                this.$refs['userForm'].validate(valid=>{
                    if(valid){
                        this.$tools.post('api/user', { 
                            account:this.userForm.account,
                            id:this.userForm.id,
                            name:this.userForm.userName,
                            roleIds:[this.userForm.userRoleID]
                        },{},'json').then(res=>{
                            this.userDialogVisible = false
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
            handleSelectionChange(val){
                this.multipleSelection = val
            },
            tableRowClassName({ row, rowIndex }) {
                if (rowIndex % 2 != 0) {
                    return 'color-row'
                }
                    return ''
            },
            getList(){
                this.$tools.get('api/user',{
                    pageNum:this.pageInfo.page,
                    pageSize:20,
                    keywords:this.searchValue
                }).then(res => {
                    this.userList = res.data.rows
                    this.pageInfo.total = res.data.total
                })
            },
            getRoleList(){
                this.$tools.get('api/role/list').then(res => {
                    this.selectRoleList = res.data
                })
            },
            resetPassword(item){
                this.$confirm('重置为初始密码111111?', '', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$tools.post(`api/user/reset/${item.id}`).then(res=>{
                        this.$message.success('操作成功')
                    })
                }).catch(() => {
                    this.$message.info('已取消操作') 
                })
            },
            delUser(){
                if(this.multipleSelection.length===0){
                    this.$message.warning('请选择要删除的账号')
                    return
                }
                this.$confirm('确定删除所选账号么?', '', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let nowCheckedList = this.multipleSelection.map(item=>item.id)
                    this.$tools.doDelete('api/user', nowCheckedList,'json').then(res=>{
                        this.getList()
                        this.$message.success('操作成功')
                    })
                }).catch(() => {
                    this.$message.info('已取消操作') 
                })
            }
        },
        created() {
            this.getList()
            this.getRoleList()
        },
        mounted(){

        }
    };
</script>
<style lang="scss" scoped>
.user-all-box{text-align: left;padding-left: 40px;}
.search-user{width:230px;}
.role-select{
    float: left;
    border:1px solid #DCDFE6;
    color: #909399;
    padding-left: 10px; 
    border-right: 0;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    height: 38px;
    width: 80px;
}
.tips-box{background: rgba(255,221,27,.2);height: 36px;line-height: 36px;color:#2F224D;margin-bottom: 30px;}
.tips-box img{margin: -3px 10px 0 20px;}
</style>
<style>
.search-user-box .el-input__inner {
    border: none;
    border-radius: 20px;
    box-shadow: 0px 2px 8px 0px rgba(227, 224, 235, 0.8);
}
.user-select-box .el-input__inner{
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
}
.user-select-box .el-select{
    width: 329px;
}
</style>