<template>
    <div class="system" id="system" :style="{minHeight:minHeight+'px'}">
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
            {path: '/systemManagement/account', navItem: '账号设置'},
            {path: '/systemManagement/addWatermark', navItem: '添加水印'},
            // {path: '/systemManagement/blackList', navItem: '黑名单'},
            {path: '/systemManagement/safety', navItem: '安全中心'},
            // {path: '/systemManagement/consultation', navItem: '在线咨询'},
            // {path: '/systemManagement/community', navItem: '用户社区'},
          ]
        }
      },
    }
</script>

<style scoped>
.system{
  min-height: 100%;
  background-color: #ffffff;
  /*max-width: 938px;*/
}
</style>
