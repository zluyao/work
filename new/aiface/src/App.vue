<template>
  <div id="app" class="clearfix">
    <div id="nav" v-if='$route.name!="login"'>
        <left-bar></left-bar>
        <top-bar></top-bar>
    </div>
    <div class="main-content-box">
        <!-- <keep-alive>
            <router-view/>
        </keep-alive> -->
        <router-view/>
    </div>
    
    
  </div>
</template>
<script>
    // @ is an alias to /src
    import LeftBar from '@/components/LeftBar.vue'
    import TopBar from '@/components/TopBar.vue'
    
    export default {
      name: 'app',
      components: {
        LeftBar,
        TopBar,
      },
      methods:{
        
      },
      created(){
        
      }
    }
</script>
<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background: #fff;
  position: relative;
}
#nav{position: relative;z-index: 2;}
.main-content-box{position: absolute;left: 0;top:80px;box-sizing: border-box;padding-left: 100px;padding-right: 40px; width: 100%;}
</style>
