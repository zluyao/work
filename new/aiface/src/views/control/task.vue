<template>
    <div class="task-all-box mt40">
        <div class="select-task-box pb40 clearfix">
            <span class="select-word">布控状态</span>
            <el-select @change="getList" class="select-task" v-model="selectValue" placeholder="请选择">
                <el-option label="不限" value=""></el-option>
                <el-option label="正在进行" value="1"></el-option>
                <el-option label="已完成" value="0"></el-option>
            </el-select>
        </div>
        <el-table
         :data="taskList"
          border
         :row-class-name="tableRowClassName">
            <el-table-column label="编号" width="90">
                <template slot-scope="item">{{item.$index + 1}}</template>
            </el-table-column>
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column label="报警阈值">
                <template slot-scope="item">
                    {{item.row.threshold*100}}%
                </template>
            </el-table-column>
            <el-table-column prop="alarms" label="发现目标数"></el-table-column>
            <el-table-column prop="targets" label="识别库"></el-table-column>
            <el-table-column prop="cameras" label="视频源"></el-table-column>
            <el-table-column label="布控状态">
                <template slot-scope="item">
                    {{item.row.status==1?'正在进行':'已完成'}}
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="item">
                    <span @click="openTaskDialog(item.row)" class="table-btn">编辑</span>
                    <span v-if="item.row.status==1" @click="delTask(item.row)" class="table-btn">终止</span>
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
            <span @click="openTaskDialog" class="yellow-small-btn mr20">新建</span>
        </div>

        <el-dialog
            :title="taskForm.roleID>0?'编辑布控':'新建布控'"
            :visible.sync="taskDialogVisible"
            width="500px"
            center>
            <el-form ref="taskForm" :model="taskForm" >
                <el-form-item prop="name"  :rules="{required: true, message: '名称不能为空', trigger: 'blur'}">
                    <el-input v-model="taskForm.name">
                        <template slot="prepend"><span style="color:#f00;">*</span>名称</template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="threshold"  :rules="{required: true, message: '阈值不能为空', trigger: 'change'}">
                    <div class="user-select-box">
                        <span class="role-select"><span style="color:#f00;">*</span>阈值</span>
                        <el-select v-model="taskForm.threshold" placeholder="请选择">
                            <el-option
                              v-for="item in thresholdList"
                              :key="item.value"
                              :label="item.name"
                              :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </el-form-item>
                <el-form-item class="form-tip-box">
                    <span class="role-select">
                        <div @click="toTab1" :class="formTabNum==2?'tab-no':''"><span style="color:#f00;">*</span>视频源</div>
                        <div @click="toTab2" class="target-box" :class="formTabNum==1?'tab-no':''"><span style="color:#f00;">*</span>目标库</div>
                    </span>
                    <div class="tree-box">
                        <template v-if="formTabNum==1">
                            <el-tree
                                ref="cameraTree"
                                :data="allCameraTree"
                                show-checkbox
                                node-key="id"
                                default-expand-all
                                check-on-click-node
                                :default-checked-keys="taskForm.cameras"
                                :props="defaultProps">
                            </el-tree>
                        </template>
                        <template v-if="formTabNum==2">
                            <el-tree
                                ref="targetTree"
                                :data="allTargetTree"
                                show-checkbox
                                node-key="id"
                                default-expand-all
                                check-on-click-node
                                :default-checked-keys="taskForm.targets"
                                :props="defaultProps">
                            </el-tree>
                        </template>
                        <div v-show="taskFormTip!=''" class="tip-box">{{taskFormTip}}</div>
                    </div>
                </el-form-item>
                <el-form-item prop="remark">
                    <el-input v-model="taskForm.remark">
                        <template slot="prepend"><span style="opacity: 0;">*</span>备注</template>
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <span @click="doTask" class="main-big-btn mr20">确定</span>
                <span @click="taskDialogVisible=false" class="yellow-big-btn">取消</span>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                taskList:[],
                pageInfo:{
                    page:1,
                    total:1000
                },

                selectValue:'',
                taskDialogVisible:false,
                thresholdList:[
                    {name:'0%',value:0},
                    {name:'10%',value:0.1},
                    {name:'20%',value:0.2},
                    {name:'30%',value:0.3},
                    {name:'40%',value:0.4},
                    {name:'50%',value:0.5},
                    {name:'60%',value:0.6},
                    {name:'70%',value:0.7},
                    {name:'80%',value:0.8},
                    {name:'90%',value:0.9},
                    {name:'100%',value:1},
                ],
                formTabNum:1,
                taskForm:{
                    name:'',
                    id:0,
                    threshold :'',
                    remark:'',
                    cameras:[],
                    targets:[]
                },
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                allCameraTree:[],
                allTargetTree:[],
                taskFormTip:''
            }
        },
        components: {

        },
        methods: {
            openTaskDialog(item){
                this.taskForm = {
                    name:'',
                    id:0,
                    threshold :'',
                    remark:'',
                    cameras:[],
                    targets:[]
                }
                this.getAllCameraTree()
                this.getAllTargetTree()
                if(item.id){
                    this.getDetail(item.id)
                }
                this.taskDialogVisible = true
            },
            doTask(){
                this.$refs['taskForm'].validate(valid=>{
                    if(valid){
                        if(this.$refs['cameraTree']){
                            this.taskForm.cameras = this.$refs['cameraTree'].getCheckedKeys(true)
                        }
                        if(this.$refs['targetTree']){
                            this.taskForm.targets = this.$refs['targetTree'].getCheckedKeys(true)
                        }
                        if(this.taskForm.cameras.length===0){
                            this.taskFormTip = '视频源不能为空'
                            return
                        }
                        if(this.taskForm.targets.length===0){
                            this.taskFormTip = '目标库不能为空'
                            return
                        }
                        this.taskFormTip = ''
                        this.$tools.post('api/task', this.taskForm,{},'json').then(res=>{
                            this.taskDialogVisible = false
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

            tableRowClassName({ row, rowIndex }) {
                if (rowIndex % 2 != 0) {
                    return 'color-row'
                }
                    return ''
            },
            getList(){
                this.$tools.get('api/task',{
                    pageNum:this.pageInfo.page,
                    pageSize:20,
                    status:this.selectValue
                }).then(res => {
                    this.taskList = res.data.rows
                    this.pageInfo.total = res.data.total
                })
            },
            getDetail(id){
                this.$tools.get(`api/task/${id}`).then(res => {
                    this.taskForm = res.data
                })
            },
            getAllCameraTree(){
                this.$tools.get('api/camera/list').then(res => {
                    this.allCameraTree = res.data
                })
            },
            getAllTargetTree(){
                this.$tools.get('api/target/tree').then(res => {
                    this.allTargetTree = res.data
                })
            },
            toTab1(){
                if(this.formTabNum==1){return}
                this.taskForm.targets = this.$refs['targetTree'].getCheckedKeys(true)
                this.formTabNum=1
                console.log(this.taskForm.targets)
            },
            toTab2(){
                if(this.formTabNum==2){return}
                this.taskForm.cameras = this.$refs['cameraTree'].getCheckedKeys(true)
                this.formTabNum=2
                console.log(this.taskForm.cameras)
            },
            delTask(item){
                this.$confirm('确定删除该布控任务么?', '', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$tools.doDelete(`api/task/${item.id}`, {},'json').then(res=>{
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
        },
        mounted(){

        }
    };
</script>
<style lang="scss" scoped>
.task-all-box{text-align: left;padding-left: 40px;}
.select-task{width:230px;margin-left: 20px;}
.select-word{font-size: 16px;color: #2F224D;}
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
.role-select div{cursor: pointer;}
.tab-no{color: #C9C2D8;}
.tree-box{margin-left: 91px;height: 226px;border:1px solid rgba(227,224,235,1);overflow: auto;padding:20px 0 20px 40px;}
.target-box{    
    border-left: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    border-bottom-left-radius: 4px;
    padding-left: 11px;
    margin-left: -11px;
    margin-top: -3px;
}
.form-tip-box{position: relative;}
.tip-box{position: absolute;bottom: -34px;left: 0;color: #F56C6C;}
</style>
<style>
.select-task-box .el-input__inner {
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

.task-all-box .el-tree-node__expand-icon.expanded{display: none;}
.task-all-box .el-tree-node__content > .el-tree-node__expand-icon{display: none;}
.task-all-box .el-tree-node__content{padding: 10px 0;}
</style>