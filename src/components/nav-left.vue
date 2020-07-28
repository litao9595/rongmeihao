<template>
  <div class="nav-left">
    <div class="top_title">
        <div class="title_icon" :style="{backgroundImage: 'url(' + bg2 + ')' }"></div>
        <div class="title_text">今日头条</div>
        <div id="title_selct" class="title_selct"></div>
    </div>
    <div class="nav_list">
        <a v-for="(navList,index) in navList" @click="kks(index)">{{navList+index}}</a>
    </div>
  </div>
</template>

<script>
import Bg2 from '../images/icon/page_3_logo.png'
  export default {
    name: "nav-left.vue",
    data () {
      return {
        bg2: Bg2,
        navList:["主页","主页","主页"],
        navNumber:0,
      }
    },
    methods:{
      kks(index){
        this.navNumber=index;
        this.$emit('e-nav',this.navNumber);
      }
    }
  }
</script>

<style scoped>
.top_title{
  display: flex;
  display: -webkit-flex;
  display: -moz-flex;
  padding-left: 18px;
  cursor: pointer;
}
.top_title .title_icon{
  width: 20px;
  height: 45px;
  overflow: hidden;
  background-size: 100% auto;
  background-position:left center;
  background-repeat: no-repeat;
  }
.title_text{
  padding-right: 8px;
  font-size: 16px;
  line-height: 45px;
  margin-left: 5px;
  width: 100px;
}
#title_selct{
  width: 10px;
  height: 5px;
  margin-top: 20px;
  transition: 0.5s;
  -webkit-transition: 0.5s;
  -moz-transition: 0.5s;
  background: url("../images/icon/slect_icon1.png") no-repeat;
  background-size: 100%;
}
.title_selct{
  transform: rotate(180deg);
  -webkit-transform: rotate(180deg);
  -moz-transform: rotate(180deg);
}
.nav_list{
  width: 100%;
}
.nav_list a{
  display: block;
  padding-left: 45px;
  color: #666;
  font-size: 14px;
  height: 40px;
  line-height: 40px;
  cursor: pointer;
}
.nav_list a:hover{
  color: #f85959;
}

</style>
