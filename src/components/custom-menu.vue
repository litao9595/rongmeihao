<template>
  <div class="custom-menu" id="customMenu">
    <el-menu :default-active="activeIndex" router mode="horizontal">
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
        activeIndex: '/customMenu/initMenu',
        navList: [
          {path: '/customMenu/initMenu', navItem: '自定义菜单'}
        ]
      }
    },
    methods: {
      handleSelect: function () {

      }
    }
  }
</script>

<style scoped>
  .custom-menu {
    min-height: 100%;
    -webkit-box-shadow: 0 0 5px 0 rgba(0, 0, 0, .05);
    -moz-box-shadow: 0 0 5px 0 rgba(0, 0, 0, .05);
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, .05);
    background-color: #fff;
  }

  .el-menu-demo.el-menu--horizontal.el-menu {
    padding: 20px 40px 0;
  }

</style>
