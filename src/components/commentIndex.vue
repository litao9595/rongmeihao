<template>
  <div class="comment" id="comment" :style="{minHeight:minHeight+'px'}">
    <div class="header">
      <!--<el-menu :default-active="activeIndex" :router="true" mode="horizontal">-->
        <!--<el-menu-item v-for="(item,i) in navList" :key="i" :index="item.path">-->
          <!--{{ item.navItem }}-->
        <!--</el-menu-item>-->
      <!--</el-menu>-->

    </div>
    <div class="comment-body">
      <router-view :eword="activeIndex"></router-view>
    </div>
  </div>

</template>

<script>
    export default {
        name: "",
      data(){
          return{
            activeIndex: '/commentManagement/commentImageText',
            navList: [
              {path: '/commentManagement/commentImageText', navItem: '图文',type:1},
              {path: '/commentManagement/commentImageText2', navItem: '小视频',type:2},
              {path: '/commentManagement/commentImageText3', navItem: '图集',type:3},
            ],
            navType:0,
            minHeight:this.common.getWindowHeight()
          }
      },
      methods:{
          clickNavs(index){
            this.navType=index
          }
      }
    }
</script>

<style scoped>
.nav_top{
  padding-top: 5px;
  display: flex;
  display: -webkit-flex;
  display: -moz-flex;
  border-bottom: solid 1px #e6e6e6;
  list-style: none;
  height: 60px;
  line-height: 60px;
  background: #fff;
}
.nav_top li{
  margin: 0px 40px;
  padding: 0px 10px;
  cursor: pointer;
}
.nav_top .active{
    border-bottom: 3px solid #ff353a;
    color: #ff353a;
    font-weight: bold;
  }
  html,body{
    height: 100%;
  }
#comment{
  min-height: 100%;
  background: #fff;
}
</style>
