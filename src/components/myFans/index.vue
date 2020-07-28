<template>
  <div class="system" id="myFans" :style="{minHeight:minHeight+'px'}">
    <el-menu :default-active="$route.path" router mode="horizontal">
      <el-menu-item v-for="(item,i) in navList" :key="i" :index="item.path">
        {{ item.navItem }}
      </el-menu-item>
    </el-menu>
    <div class="custom-menu-body">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  export default {
    name: "",
    data() {
      return {
        minHeight:this.common.getWindowHeight(),
        navList: [
          {path: '/myFans/fansSurvey', navItem: '粉丝概况'},
          {path: '/myFans/fansPortrait', navItem: '粉丝画像'},
          {path: '/myFans/fansList', navItem: '粉丝列表'},
        ]
      }
    },
  }
</script>

<style scoped>
  .system{
    min-height: 100%;
    background-color: #fff;
    /*max-width: 938px;*/
  }
</style>
