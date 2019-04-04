<template>
    <div class="role-all-box mt40">
        <el-table
         :data="roleList"
          border
         :row-class-name="tableRowClassName"
          @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="90"></el-table-column>
            <el-table-column prop="name" label="角色名称"></el-table-column>
            <el-table-column prop="createDate" label="创建时间"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="item">
                    <span @click="openRoleDialog(item.row)" class="table-btn">编辑</span>
                    <span @click="openMenuDialog(item.row)" class="table-btn">分配菜单</span>
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
            <span @click="openRoleDialog" class="yellow-small-btn mr20">新建</span>
            <span @click="delRole" class="del-btn">删除</span>
        </div>

        <el-dialog
            :title="roleForm.roleID>0?'编辑角色':'新建角色'"
            :visible.sync="roleDialogVisible"
            width="500px"
            center>
            <el-form ref="roleForm" :model="roleForm" style="padding-bottom:194px">
                <el-form-item prop="roleName" :rules="{required: true, message: '角色名称不能为空', trigger: 'blur'}">
                    <el-input v-model="roleForm.roleName">
                        <template slot="prepend"><span style="color:#f00;">*</span>角色名称</template>
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <span @click="doRole" class="main-big-btn mr20">确定</span>
                <span @click="roleDialogVisible=false" class="yellow-big-btn">取消</span>
            </span>
        </el-dialog>
        <el-dialog
            title="分配菜单"
            :visible.sync="menuDialogVisible"
            width="500px"
            center>
            <div class="tree-box">
                <el-tree
                    ref="menuTree"
                    :data="allMenuList"
                    show-checkbox
                    node-key="id"
                    default-expand-all
                    check-on-click-node
                    :expand-on-click-node="false"
                    :default-checked-keys="checkedKeyList"
                    :props="defaultProps">
                </el-tree>
            </div>
            <span slot="footer" class="dialog-footer">
                <span @click="sureDoMenu" class="main-big-btn mr20">确定</span>
                <span @click="menuDialogVisible=false" class="yellow-big-btn">取消</span>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                roleList:[],
                pageInfo:{
                    page:1,
                    total:1000
                },
                roleForm:{
                    roleName:'',
                    roleID:0
                },
                multipleSelection:[],
                roleDialogVisible:false,
                menuDialogVisible:false,
                allMenuList:[],
                checkedKeyList:[],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                }
            }
        },
        components: {

        },
        methods: {
            openMenuDialog(item){
                this.roleForm.roleID = item.id
                this.checkedKeyList = []
                this.getAllMenuTree().then(()=>{
                    this.getCheckedMenu()
                })
                this.menuDialogVisible = true
            },
            openRoleDialog(item){
                this.roleForm.roleName = ''
                this.roleForm.roleID = 0
                if(item.id){
                    this.roleForm.roleName = item.name
                    this.roleForm.roleID = item.id
                }
                this.roleDialogVisible = true
            },
            doRole(){
                this.$refs['roleForm'].validate(valid=>{
                    if(valid){
                        this.$tools.post('api/role', {
                            name:this.roleForm.roleName,
                            id:this.roleForm.roleID
                        },{},'json').then(res=>{
                            this.roleDialogVisible = false
                            this.getList()
                            this.$message.success('操作成功')
                        })
                    }else{
                        return false
                    }
                })
            },
            delRole(){
                if(this.multipleSelection.length===0){
                    this.$message.warning('请选择要删除的角色')
                    return
                }
                this.$confirm('确定删除所选角色么?', '', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let nowCheckedList = this.multipleSelection.map(item=>item.id)
                    this.$tools.doDelete('api/role', nowCheckedList,'json').then(res=>{
                        this.getList()
                        this.$message.success('操作成功')
                    })
                }).catch(() => {
                    this.$message.info('已取消操作') 
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
                this.$tools.get('api/role',{
                    pageNum:this.pageInfo.page,
                    pageSize:20
                }).then(res => {
                    this.roleList = res.data.rows
                    this.pageInfo.total = res.data.total
                })
            },
            getAllMenuTree(){
                return this.$tools.get('api/role/tree-all').then(res => {
                    this.allMenuList = res.data
                })
            },
            getCheckedMenu(){
                this.$tools.get(`api/role/menu/${this.roleForm.roleID}`).then(res => {
                    this.checkedKeyList = res.data.menuIds
                })
            },
            sureDoMenu(){
                var data = this.$refs['menuTree'].getCheckedKeys()
                this.$tools.post('api/role/menu', { 
                    id:this.roleForm.roleID,
                    menuIds:data
                },{},'json').then(res=>{
                    this.menuDialogVisible = false
                    this.$message.success('操作成功')
                })
            }   
        },
        created() {
            this.getList()
        },
        mounted(){

        }
    };
</script>
<style lang="scss" scoped>
.role-all-box{text-align: left;padding-left: 40px;}
.tree-box{max-height: 460px;overflow: auto;}
</style>
<style>
.role-all-box .el-tree-node__expand-icon.expanded{display: none;}
.role-all-box .el-tree-node__content > .el-tree-node__expand-icon{display: none;}
.role-all-box .el-tree-node__label{font-size: 16px;}
.role-all-box .el-tree-node__content{padding: 10px 0;}
</style>