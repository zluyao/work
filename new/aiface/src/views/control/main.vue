<template>
    <div class="main-all-box clearfix mt40">
        <div class="left-box fl">
            <div class="left-title">布控任务</div>
            <div class="main-search-camera-box">
                <el-input placeholder="搜索用户" v-model="searchValue" clearable
                    suffix-icon="el-icon-search"
                    @keyup.native.enter="getCameraList"
                    @clear="getCameraList">
                </el-input>
            </div>
        </div>
        <div class="center-box">
            <div class="center-head">
                <span>实时监控</span>
                <img class="img-camera" src="../../assets/images/camera.png" alt="">{{checkedCamera}}
                <img class="img-address" src="../../assets/images/station.png" alt="">{{address}}
            </div>
            <div class="video-box">

            </div>
            <div class="center-foot mt30">
                <div class="center-foot-title">
                    <span>实时抓拍</span>
                    <div class="fr">
                        <span class="foot-today">今日： 1980张</span>
                        <span style="cursor:pointer">更多 <i class="el-icon-arrow-right"></i></span>
                    </div>
                </div>
                <ul class="foot-content-box mt20">
                    <li v-for="item in catchImgList" class="center-foot-content">
                        <img src="../../assets/images/c.jpg" alt="">
                        <div>{{item.time}}</div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                searchValue:'',
                checkedCamera:'禾连1',
                address:'公元里11幢3层',
                catchImgList:[
                    {time:'15:03:08',src:''},
                    {time:'15:03:08',src:''},
                    {time:'15:03:08',src:''},
                    {time:'15:03:08',src:''},
                    {time:'15:03:08',src:''},
                    {time:'15:03:08',src:''},
                    {time:'15:03:08',src:''},
                    {time:'15:03:08',src:''},
                ]
            }
        },
        components: {

        },
        methods: {
            getCameraList(){

            },
        },
        created() {

        },
        mounted(){

        }
    };
</script>
<style lang="scss" scoped>
.main-all-box{text-align: left;padding-left: 40px;color: #2F224D;}
.main-all-box *{box-sizing: border-box;}
.left-box{width: 200px;height: 710px;padding:20px 14px; box-shadow:0px 0px 16px 0px rgba(227,224,235,0.7);}
.left-title{text-align: center;font-size: 20px;font-weight: bold;}
.main-search-camera-box{margin-top: 21px;}
.center-box{margin-left: 230px;width: 604px;height: 710px;padding: 20px 16px 18px; box-shadow:0px 0px 16px 0px rgba(227,224,235,0.7);}
.center-head{color: #857B9D}
.center-head span{font-size: 20px;color: #2F224D;font-weight: bold;}
.img-camera{margin: 0 4px 0 28px;}
.img-address{margin: 0 4px 0 19px;}
.video-box{margin-top: 20px; height: 430px;background: #2F224D;}
.center-foot-title>span{font-size: 20px;font-weight: bold;}
.foot-today{color: #857B9D;margin-right: 20px;}
.foot-content-box{overflow-x: scroll;overflow-y: hidden; height: 120px;white-space: nowrap;}
.center-foot-content{margin-right: 10px;width: 87px;display: inline-block;}
.center-foot-content img{width: 87px;height: 87px;}
.center-foot-content div{margin-top: 10px;text-align: center;color: #857B9D;}
</style>
<style>
.main-search-camera-box .el-input__inner {
    border: 1px solid #F2F0F7;
    border-radius: 17px;
    height: 34px;
    line-height: 34px;
}
</style>