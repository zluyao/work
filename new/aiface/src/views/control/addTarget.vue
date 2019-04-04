<template>
    <div class="target-add-all-box clearfix mt40">
        <div class="title-box">{{peopleID>0?'编辑目标':'添加目标'}}</div>
        <div class="photo-box mt40">
            <span style="color:#f00;">*</span>照片
            <span class="upload-box yellow-small-btn mr20">
                上传照片
                <input accept=".jpg, .jpeg, .png, .bmp" type="file" @change="uploadImg">
            </span>
            <span class="tip-word">请上传证件照或手机自拍照，支持格式：jpg,png,bmp,最多上传10张</span>
        </div>
        <div class="hide-box" v-show="showImgFlag">
            <div class="hide-box1 mt20">
                <span class="tick"><i class="el-icon-check"></i></span>本次上传审核完成，审核通过<span class="fc-f00">{{imgOKList.length}}</span>张，失败<span class="fc-f00">{{imgNOList.length}}</span>张
            </div>
            <div class="hide-box2 mt20">
                <div class="hide2-box2-top">
                    审核通过<span class="fc-f00">{{imgOKList.length}}</span>张
                    <div class="fr">
                        <el-checkbox @change="allOKChange" v-model="checkedAllOK">全选</el-checkbox>
                        <span @click="delImgOK" class="table-btn fs-14">删除</span>
                    </div>
                </div>
                <ul class="img-box-all-ok clearfix">
                    <li v-for="item in imgOKList" class="img-single-box">
                        <img :src="handleHead(item.head)" alt="">
                        <el-checkbox class="check-ok" v-model="item.isChecked"></el-checkbox>
                        <div v-show="item.iscover" class="now-caver">当前封面</div>
                        <div class="hover-caver">
                            <span @click="sureCover(item)">设为封面</span>
                        </div>
                    </li>
                </ul>
                <div class="hide2-box2-top mt20">
                    审核未通过<span class="fc-f00">{{imgNOList.length}}</span>张
                    <div class="fr">
                        <el-checkbox @change="allNOChange" v-model="checkedAllNO">全选</el-checkbox>
                        <span @click="delImgNO" class="table-btn fs-14">删除</span>
                    </div>
                </div>
                <ul class="img-box-all-no clearfix">
                    <li v-for="item in imgNOList" class="img-single-box">
                        <img :src="handleHead(item.head)" alt="">
                        <el-checkbox class="check-ok" v-model="item.isChecked"></el-checkbox>
                    </li>
                </ul>
            </div>
        </div>
        <div class="mt40 clearfix">
            <el-form ref="peopleForm" :model="peopleForm" inline>
                <el-form-item prop="name"  :rules="{required: true, message: '姓名不能为空', trigger: 'blur'}">
                    <span style="width:84px;" class="input-word"><i class="fc-f00">* </i>姓名</span>
                    <el-input class="input-box" v-model="peopleForm.name"></el-input>
                </el-form-item>
                <el-form-item prop="sex"  :rules="{required: true, message: '性别不能为空', trigger: 'change'}">
                    <span class="input-word"><i class="fc-f00">* </i>性别</span>
                    <el-select class="input-box" v-model="peopleForm.sex" placeholder="请选择">
                        <el-option label="男" value="1"></el-option>
                        <el-option label="女" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <div class="pt10"></div>
                <el-form-item>
                    <span style="width:84px;" class="input-word"><i class="fc-no">* </i>出生日期</span>
                    <el-date-picker
                        value-format = "yyyy-MM-dd"
                        class="input-box"
                        v-model="peopleForm.birthday"
                        type="date"
                        placeholder="选择年月日">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <span class="input-word"><i class="fc-no">* </i>所属</span>
                    <el-input class="input-box" v-model="peopleForm.belong"></el-input>
                </el-form-item>
                <div class="pt10"></div>
                <el-form-item>
                    <span class="input-word"><i class="fc-no">* </i>备注</span>
                    <el-input class="textarea-box" placeholder="请输入文字" type="textarea" :rows="5" maxlength="400" v-model="peopleForm.remark"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <div class="foot-box mt50 pb30">
            <span @click="sureAddPeople" class="btn-blue mr20">确定</span>
            <span @click="cancel" class="btn-yellow">取消</span>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                peopleID:this.$route.query.peopleID || 0,
                targetID:this.$route.query.targetID || 0,
                showImgFlag:false,
                uploadData:{},
                checkedAllOK:false,
                imgOKList:[],
                checkedAllNO:false,
                imgNOList:[],
                peopleForm:{
                    name:'',
                    sex:'',
                    birthday:'',
                    belong:'',
                    remark:''
                }
            }
        },
        components: {

        },
        methods: {
            handleHead(val) {
                return `/api/common/download?path=${val}&Token=${window.sessionStorage.getItem('aiFaceToken')}`;
            },
            allOKChange(){
                if(this.checkedAllOK){
                    this.imgOKList.forEach(item=>item.isChecked=true)
                }else{
                    this.imgOKList.forEach(item=>item.isChecked=false)
                }
            },
            allNOChange(){
                if(this.checkedAllNO){
                    this.imgNOList.forEach(item=>item.isChecked=true)
                }else{
                    this.imgNOList.forEach(item=>item.isChecked=false)
                }
            },
            delImgOK(){
                this.imgOKList = this.imgOKList.filter(item=>item.isChecked==false)
                if(this.imgOKList.length>0){
                    let caverList = this.imgOKList.filter(item=>item.iscover==1)
                    if(caverList.length<1){
                        this.imgOKList[0].iscover = 1
                    }
                }
                this.checkedAllOK = false
            },
            delImgNO(){
                this.imgNOList = this.imgNOList.filter(item=>item.isChecked==false)
                this.checkedAllNO = false
            },
            sureCover(one){
                this.imgOKList.forEach(item=>item.iscover=0)
                one.iscover = 1
            },
            uploadImg(e){
                if(this.imgOKList.length==10){
                    this.$message.warning('最多上传10张照片')
                }
                this.uploadData = e.target.files[0]
                this.$tools.post('api/people/head',{
                    file:this.uploadData
                },{},'form').then(res=>{
                    if(res.data.pass==1){
                        if(this.imgOKList.length===0){
                            this.imgOKList.push({head:res.data.head,isChecked:false,iscover:1,id:0})
                        }else{
                            this.imgOKList.push({head:res.data.head,isChecked:false,iscover:0,id:0})
                        }
                        
                    }else{
                        this.imgNOList.push({head:res.data.head,isChecked:false})
                    }
                    this.showImgFlag = true
                })
                e.target.value = ''
            },
            sureAddPeople(){
                this.$refs['peopleForm'].validate(valid=>{
                    if(valid){
                        let params = {}
                        let lastImgList = this.imgOKList.map(item=>{
                            return {
                                head:item.head,
                                id:item.id,
                                iscover:item.iscover
                            }
                        })
                        Object.assign(params,this.peopleForm,{heads:lastImgList},{targetId:this.targetID},{id:this.peopleID})
                        this.$tools.post('api/people',params,{},'json').then(res=>{
                            this.$message.success('操作成功')
                            history.go(-1)
                        })
                    }else{
                        return false
                    }
                })
            },
            getDetail(){
                this.$tools.get(`api/people/${this.peopleID}`).then(res => {
                    this.peopleForm = {
                        name:res.data.name,
                        sex:String(res.data.sex),
                        birthday:res.data.birthday,
                        belong:res.data.belong,
                        remark:res.data.remark
                    }
                    res.data.heads.forEach(item=>item.isChecked=false)
                    this.imgOKList = res.data.heads
                    this.showImgFlag = true
                })
            },
            cancel(){
                history.go(-1)
            }
        },
        created() {
            if(this.peopleID>0){
                this.getDetail()
            }
        },
        mounted(){

        }
    };
</script>
<style lang="scss" scoped>
.target-add-all-box{text-align: left;padding-left: 40px;color: #2F224D;font-size: 16px;}
.target-add-all-box *{box-sizing: border-box;}
.title-box{position: relative;font-weight: bold;padding-left: 16px;}
.title-box::before{position: absolute;top:8px;left: 0;content: ''; width: 6px;height: 6px;background: #2F224D;}
.upload-box{position: relative;margin-left: 20px;font-size: 14px;}
.upload-box input{position: absolute;left: 0;top:0;width: 100%;height: 30px;opacity: 0;cursor: pointer;}
.tip-word{color: #C9C2D8;font-size: 14px;}
.hide-box1{height: 50px;line-height: 50px;background: rgba(41,230,193,.1);padding-left: 20px;}
.tick{margin-right: 20px;width: 20px;height: 20px;line-height: 20px;display:inline-block;text-align: center; background: rgb(41, 230, 193);border-radius: 50%;color: #fff;}
.hide-box2{background: #F8F6FB;padding: 20px 0;border-radius: 12px;}
.hide2-box2-top{padding: 0 20px;}
.img-box-all-ok{padding: 20px;border-bottom: 1px solid #E3E0EB;}
.img-single-box{float: left;position: relative; width: 94px;height: 94px;overflow: hidden;margin-right: 20px;}
.img-single-box:last-child{margin-right: 0;}
.img-single-box img{width: 100%;height: 94px;}
.check-ok{position: absolute;left: 2px;top:-1px;}
.now-caver{position: absolute;left: 0;top:0;width: 100%;height: 94px;line-height: 94px; background: rgba(133,123,157,.6);font-size: 12px;color: #fff;text-align: center;}
.hover-caver{display: none; position: absolute;left: 0;top:0;width: 100%;height: 94px;line-height: 94px; background: rgba(133,123,157,.6);font-size: 12px;color: #fff;text-align: center;}
.hover-caver span{display: inline-block;padding: 0 10px;height: 24px;line-height: 24px; border:1px solid #fff; border-radius: 13px;cursor: pointer;}
.img-single-box:hover .hover-caver{display: block;}
.img-single-box:hover .now-caver{display: none;}
.img-box-all-no{padding: 20px 20px 0 20px;}

.input-word{display: inline-block;width: 61px;}
.input-box{width: 230px;margin-right: 60px;}
.textarea-box{float: right;width: 610px;}
.foot-box{text-align: center;}
</style>
<style>

.target-add-all-box .el-input__inner {
    border: none;
    border-radius: 20px;
    box-shadow: 0px 2px 8px 0px rgba(227, 224, 235, 0.8);
}
</style>