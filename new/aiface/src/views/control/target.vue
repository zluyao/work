<template>
    <div class="target-all-box clearfix mt40">
        <div class="left-box fl">
            <div class="fix-box">
                <div class="btn-box">
                    <el-button @click="doTarget(1)" size="mini" type="primary">新建</el-button>
                    <el-button @click="doTarget(2)" size="mini">编辑</el-button>
                    <el-button @click="delTarget" size="mini">删除</el-button>
                </div>
            </div>
            <div class="tree-box">
                <el-tree
                    :data="allTargetTree"
                    @node-click="getNodeInfo"
                    node-key="id"
                    default-expand-all
                    :props="defaultProps">
                </el-tree>
            </div>
        </div>
        <div class="right-box">
            <div class="right-head">
                <span class="head-sort">排序</span>
                <span class="head-age" :class="sortNum<3?'head-active':''">年龄
                    <span @click="sort('age','asc',1)" :class="sortNum==1?'arrow-active':''"  class="el-icon-caret-top arrow1"></span>
                    <span @click="sort('age','desc',2)" :class="sortNum==2?'arrow-active':''"  class="el-icon-caret-bottom arrow2"></span>
                </span>
                <span class="head-age" :class="sortNum>2?'head-active':''">姓名
                    <span @click="sort('name','asc',3)" :class="sortNum==3?'arrow-active':''" class="el-icon-caret-top arrow1"></span>
                    <span @click="sort('name','desc',4)" :class="sortNum==4?'arrow-active':''"  class="el-icon-caret-bottom arrow2"></span>
                </span>
                <div class="fr">
                    <span class="select-word">年龄</span>
                    <el-select @change="getList" class="select-task" v-model="searchObj.age" placeholder="请选择">
                        <el-option label="不限" value=""></el-option>
                        <el-option label="0-10" value="10"></el-option>
                        <el-option label="10-20" value="20"></el-option>
                        <el-option label="20-30" value="30"></el-option>
                        <el-option label="30-40" value="40"></el-option>
                        <el-option label="40-50" value="50"></el-option>
                        <el-option label="50-60" value="60"></el-option>
                        <el-option label="60-70" value="70"></el-option>
                        <el-option label="70-80" value="80"></el-option>
                        <el-option label="80-90" value="90"></el-option>
                        <el-option label="90-100" value="100"></el-option>
                    </el-select>
                    <span class="select-word">性别</span>
                    <el-select @change="getList" class="select-task" v-model="searchObj.sex" placeholder="请选择">
                        <el-option label="不限" value=""></el-option>
                        <el-option label="男" value="1"></el-option>
                        <el-option label="女" value="2"></el-option>
                    </el-select>
                </div>
            </div> 
            <ul class="right-content clearfix">
                <template v-for="item in targetPeopleList">
                    <li @click="item.isChecked = !item.isChecked" class="card-box fl" :class="item.isChecked?'card-active':''">
                        <img class="fl" :src="handleHead(item.head)" alt="">
                        <div class="card-right">
                            <div class="card-right-box1 mt">
                                <span class="card-name">{{item.name}}</span>
                                <span>{{item.sex==2?'女':'男'}}</span>
                                <span>{{item.age}}岁</span>
                            </div>
                            <div style="margin-top:14px;margin-bottom: 8px;">
                                <span style="color:#C9C2D8">所属</span>{{item.belong}}
                            </div>
                            <div>
                                <span style="color:#C9C2D8">备注</span>{{item.remark}}
                            </div>
                        </div>
                        <i v-show="item.isChecked" class="tick-box el-icon-check"></i>
                        <div v-show="item.isChecked" class="triangle-box"></div>
                    </li>
                </template>
                <li class="no-data" v-show="targetPeopleList.length==0">暂无数据</li>
            </ul>
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
            <div class="mt40">
                <span @click="gotoAdd" class="yellow-small-btn mr20">添加目标</span>
                <span @click="gotoEdit" class="yellow-small-btn mr20">编辑</span>
                <span @click="delPeople" class="del-btn">删除</span>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                targetId:0,
                allTargetTree:[],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                pageInfo:{
                    page:1,
                    total:100
                },
                targetType:1,
                targetInfo:{
                    groupId:0,
                    id:0,
                    name:''
                },
                sortNum:1,
                targetPeopleList:[],
                searchObj:{
                    age:'',
                    sex:'',
                    sortType:'',
                    sortField:''
                }

            }
        },
        components: {

        },
        methods: {
            handleHead(val) {
                return `/api/common/download?path=${val}&Token=${window.sessionStorage.getItem('aiFaceToken')}`;
            },
            getAllTargetTree(){
                this.$tools.get('api/target/tree').then(res => {
                    this.allTargetTree = res.data
                })
            },
            getNodeInfo(data,node,comp){
                this.targetInfo = {
                    groupId:data.groupId,
                    id:data.id,
                    name:data.name
                }
                this.targetType = data.type
                this.targetId = data.id
                this.getList()
            },
            doTarget(isAdd){
                var nowTitle = ''
                if(isAdd==1){
                    if(this.targetInfo.groupId>0){      //根节点除外
                        this.targetInfo.groupId = this.targetInfo.id
                    }
                    this.targetInfo.id = 0
                    this.targetInfo.name = ''
                    nowTitle = '新建'
                }else{
                    nowTitle = '编辑'
                }
                this.$prompt(nowTitle, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputValue:this.targetInfo.name
                }).then(({ value }) => {
                    this.targetInfo.name = value
                    if(this.targetInfo.groupId==0){
                        this.$tools.post('api/target/group',{
                            id:this.targetInfo.id,
                            name:this.targetInfo.name
                        },{},'json').then(res => {
                            this.getAllTargetTree()
                        })
                    }else if(isAdd==2 && this.targetType==1){
                        this.$tools.post('api/target/group',{
                            id:this.targetInfo.id,
                            name:this.targetInfo.name
                        },{},'json').then(res => {
                            this.getAllTargetTree()
                        })
                    }else{
                        this.$tools.post('api/target',this.targetInfo,{},'json').then(res => {
                            this.getAllTargetTree()
                        })
                    }

                }).catch(() => {
                    this.$message.info('取消输入')
                })
            },
            delTarget(){
                if(this.targetType==1){
                    this.$tools.doDelete(`api/target/group/${this.targetInfo.id}`).then(res=>{
                        this.getAllTargetTree()
                        this.$message.success('操作成功')
                    })
                }else{
                    this.$tools.doDelete(`api/target?id=${this.targetInfo.id}`).then(res=>{
                        this.getAllTargetTree()
                        this.$message.success('操作成功')
                    })
                }
            },
            getList(){
                this.$tools.get('api/people',{
                    targetId:this.targetId,
                    sex:this.searchObj.sex,
                    startAge:this.searchObj.age>0 ? (this.searchObj.age-10) :'',
                    endAge:this.searchObj.age>0 ? this.searchObj.age : '',
                    sortType:this.searchObj.sortType,
                    sortField:this.searchObj.sortField,
                    pageNum:this.pageInfo.page,
                    pageSize:12
                }).then(res => {
                    res.data.rows.forEach(item => {
                        item.isChecked = false
                    })
                    this.targetPeopleList = res.data.rows
                    this.pageInfo.total = res.data.total
                })
            },
            sort(field,type,sortNum){
                this.searchObj.sortField = field
                this.searchObj.sortType = type
                this.sortNum = sortNum
                this.getList()
            },
            gotoAdd(){
                if(this.targetType==2){
                    this.$router.push({path:'/control/addTarget',query:{targetID:this.targetId}})
                }else{
                    this.$message.warning('请先选择具体类别')
                }
            },
            gotoEdit(){
                let checkedList = this.targetPeopleList.filter(item=>{
                    return item.isChecked == true
                })
                if(checkedList.length>1){
                    this.$message.warning('不能选择多个目标编辑')
                }else if(checkedList.length==0){
                    this.$message.warning('请选择编辑目标')
                }else{
                    this.$router.push({path:'/control/addTarget',query:{targetID:checkedList[0].targetId,peopleID:checkedList[0].id}})
                }
            },
            delPeople(){
                let checkedList = this.targetPeopleList.filter(item=>{
                    return item.isChecked == true
                })
                if(checkedList.length>0){
                    this.$confirm('确定删除所选目标么?', '', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let ids = checkedList.map(item=>item.id)
                        this.$tools.doDelete('api/people',ids,'json').then(res=>{
                            this.getList()
                            this.$message.success('操作成功')
                        })
                    }).catch(() => {
                        this.$message.info('已取消操作') 
                    })
                }else{
                    this.$message.warning('请先选择目标')
                }
            }
        },
        created() {
            this.getAllTargetTree()
            this.getList()
        },
        mounted(){

        }
    };
</script>
<style lang="scss" scoped>
.target-all-box{text-align: left;padding-left: 40px;}
.target-all-box *{box-sizing: border-box;}
.left-box{width: 200px;height: 710px;padding-bottom: 20px;padding-top: 68px; box-shadow:0px 0px 16px 0px rgba(227,224,235,0.7);}
.fix-box{position: relative;}
.btn-box{width: 100%; text-align: center;padding: 20px 0;position: absolute;top:-68px;;left: 0;z-index: 2;box-shadow:0px 0px 16px 0px rgba(227,224,235,0.7)}
.tree-box{height: 620px;overflow: auto;}
.right-box{margin-left: 230px;width: 1030px;height: 710px;}
.right-head{height: 70px;padding-top: 10px;font-size: 16px;}
.head-sort{font-size: 18px;color: #2E224E;display: inline-block;}
.head-age{
    position: relative;
    margin-left: 10px;
    display: inline-block;
    padding-left: 16px;
    color: #fff;
    line-height: 28px;
    width:78px;
    height:28px;
    background:rgba(169,163,185,1);
    box-shadow:0px 2px 9px 0px rgba(91,84,109,0.46);
    border-radius:6px;
    cursor: pointer;
}
.arrow1{position: absolute;right: 6px;top:4px;font-size: 12px;color: #C9C2D8;}
.arrow2{position: absolute;right: 6px;bottom: 4px;font-size: 12px;color: #C9C2D8;}
.head-active{background:rgba(91,84,109,1);}
.arrow-active{color: #fff;}
.select-word{display: inline-block;margin: 0 10px 0 40px;}
.select-task{width: 230px;}

.right-content{height: 583px;padding: 28px 0 0 28px; background:#F8F6FB;border-radius:12px;}
.card-box{position: relative; width: 316px;height: 122px;padding: 14px;margin:0 13px 13px 0;background: #fff;border-radius: 7px;cursor: pointer;}
.card-box>img{width: 94px;height: 94px;}
.card-right{margin-left: 108px;color:#857B9D;font-size: 12px;}
.card-right-box1{font-size: 14px;}
.card-right span{display: inline-block;margin-right: 10px;}
.card-name{color: #5B546C;}
.triangle-box{position: absolute;top:0;right: 0;width: 0;height: 0;border:12px solid #671EFF;border-top-right-radius: 7px; border-left-color: rgba(1, 1, 1, 0);border-bottom-color: rgba(1, 1, 1, 0)}
.tick-box{position: absolute;top:2px;right: 2px;color:#fff;z-index: 2;font-size: 10px;}
.card-active{border:1px solid #671EFF}
.no-data{width: 100%;height: 100px;line-height: 100px;text-align: center;}
</style>
<style>
.target-all-box .el-tree-node.is-expanded > .el-tree-node__children .is-current{color: #671EFF;}
.target-all-box .el-input__inner {
    border: none;
    border-radius: 20px;
    box-shadow: 0px 2px 8px 0px rgba(227, 224, 235, 0.8);
}
</style>