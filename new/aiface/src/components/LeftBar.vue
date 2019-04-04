<template>
    <div class="left-bar-box">
        <div class="logo-box" >
            <img src="../assets/images/logo.png" alt="">
        </div>
        <template v-for="item in mainMenuList">
            <div :key="item.id" :class="checkedID != item.id ? 'module-box' : 'module-active'" @click="getChildMenu(item.id)">
                <img v-if="item.id==='control' && item.id!=checkedID" class="module-img" src="../assets/images/module1.png" alt="">
                <img v-if="item.id==='control' && item.id===checkedID" class="module-img" src="../assets/images/module1-active.png" alt="">
                <img v-if="item.id==='compare' && item.id!=checkedID" class="module-img" src="../assets/images/module2.png" alt="">
                <img v-if="item.id==='compare' && item.id===checkedID" class="module-img" src="../assets/images/module2-active.png" alt="">
                <img v-if="item.id==='report' && item.id!=checkedID" class="module-img" src="../assets/images/module3.png" alt="">
                <img v-if="item.id==='report' && item.id===checkedID" class="module-img" src="../assets/images/module3-active.png" alt="">
                <img v-if="item.id==='system' && item.id!=checkedID" class="module-img" src="../assets/images/module4.png" alt="">
                <img v-if="item.id==='system' && item.id===checkedID" class="module-img" src="../assets/images/module4-active.png" alt="">
                <div class="module-word">{{item.name}}</div>
            </div>
        </template>
    </div>
</template>

<script>
    export default {
        name: 'LeftBar',
        props: {
            
        },
        data(){
            return{
                checkedID:''
            }
        },
        computed:{
            mainMenuList(){
                return this.$store.state.mainMenu
            }
        },
        methods:{
            getChildMenu(id){
                this.checkedID = id
                sessionStorage.setItem('aiFaceMainMenuID',id)   //为了防止刷新时失去所选模块，记录到本地
                // sessionStorage.removeItem('aiFaceChildMenuID')
                this.$tools.get(`api/pms/menus/children?id=${id}`).then(res => {
                    this.$store.commit('changeChildMenu',res.data)
                })
                switch (id) {
                    case 'control':
                        this.$router.push('/control/main')
                        break
                    case 'compare':
                        this.$router.push('/staticCompare/searching')
                        break
                    case 'system':
                        this.$router.push('/systemSetting/camera')
                        break
                }
            },
            getMainMenu() {
                this.$tools.get('api/login/menu').then(res => {
                    this.$store.commit('changeMainMenu',res.data)
                    if(this.checkedID === ''){
                        this.checkedID = (res.data)[0].id
                        this.getChildMenu(this.checkedID)
                    }else{
                        this.getChildMenu(this.checkedID)
                    }
                })
            },
        },
        created(){
            this.checkedID = sessionStorage.getItem('aiFaceMainMenuID') || ''
            this.getMainMenu()
        }
    }
</script>

<style scoped lang="scss">
.left-bar-box{float: left;width: 100px;background: #671EFF;min-height: 100vh;text-align: center;color: #fff;}
.logo-box{height: 80px;border-bottom: 1px solid rgba(255,255,255,.19);}
.logo-box img{width: 52px;margin-top: 12px;}
.module-box{height: 82px;margin-top: 40px;cursor: pointer;}
.module-active{height: 82px;margin-top: 40px;cursor: pointer; background: rgb(71, 20, 178);color: #FFDD1B}
.module-img{width: 22px;margin-top: 15px;}
.module-word{margin-top: 9px;}
</style>
    