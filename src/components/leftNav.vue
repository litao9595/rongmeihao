<template>
  <div class="nav">
    <ul >
      <li v-for="(item,index) in nav" :class="index==currentFirstIndex?'open':''" @click="changeFirstnav(index)">
        <!--一级菜单-->
        <div class="item">
          <div class="img">
            <img :src="item.icon" alt="">
          </div>
          <div>{{item.name}}</div>
          <div class="sj"></div>
        </div>
        <dl v-if="item.subPlugin.length>0">
          <dt v-for="(item2,index2) in item.subPlugin" :class="item2.url==currentUrl?'ac':''" @click="changeSubnav(item2.url)">
            <template v-if="item2.url">
              <router-link :to="item2.url" tag="div" router v-if="item2.url.indexOf('http')==-1">{{item2.name}}</router-link>
              <a :href="item2.url" v-if="item2.url.indexOf('http')>-1">{{item2.name}}</a>
            </template>
          </dt>
          <!--<dt ><router-link to="/fatoutiao/index" tag="div" router>发头条</router-link></dt>-->
          <!--<dt ><router-link to="/sucai/index" tag="div" router>素材管理</router-link></dt>-->
          <!--<dt ><router-link to="/content/index" tag="div" router>内容管理</router-link></dt>-->
          <!--<dt ><router-link to="/commentManagement" tag="div" router>评论管理</router-link></dt>-->
          <!--<dt ><router-link to="/votingManagement" tag="div" router>投票管理</router-link></dt>-->
          <!--<dt ><router-link to="/votingManagement" tag="div" router>自动回复</router-link></dt>-->
        </dl>
      </li>
      <!--<li>-->
        <!--&lt;!&ndash;一级菜单&ndash;&gt;-->
        <!--<div class="item">-->
          <!--<div class="img">-->
            <!--<img src="../../static/images/icon/logo.png" alt="">-->
          <!--</div>-->
          <!--<div>个人中心</div>-->
          <!--<div class="sj"></div>-->
        <!--</div>-->
        <!--<dl>-->
          <!--<dt ><router-link to="/myFans" tag="div" router>我的粉丝</router-link></dt>-->
          <!--<dt ><router-link to="/systemManagement" tag="div" router>账号设置</router-link></dt>-->
        <!--</dl>-->
      <!--</li>-->
    </ul>
  </div>

</template>

<script>
  import {config} from "../router/httpConfig.js"
  import { eventBus } from '../main'
    export default {
        name: "",
      data(){
          return{
            currentFirstIndex:0,
            currentUrl:'',
            nav:[]
          }
      },
      methods:{
        changeSubnav(url){
          this.currentUrl = url;
        },
        changeFirstnav(index){
          this.currentFirstIndex = index;
        },
          getNav(){
            this.$http({
              url:config.getSideNav
            }).then((res)=>{
              var href = location.href.split('#')[1];
              for(var i=0;i<res.data.data.length;i++){
                for(var j=0;j<res.data.data[i].subPlugin.length;j++){
                  if(res.data.data[i].subPlugin[j].url){
                    if(href.indexOf(res.data.data[i].subPlugin[j].url)>-1){
                      this.currentFirstIndex = i;
                      this.currentUrl = res.data.data[i].subPlugin[j].url;
                    }
                  }
                }
              }
              var scope = location.href.split('#')[0].split('=')[1];
              if(scope){
                for(var i=0;i<res.data.data.length;i++){

                  if(res.data.data[i].name=='融媒号'){
                    switch (scope) {
                      case 'nc':
                        res.data.data[i].name ='南充号';
                        res.data.data[i].icon='./static/images/nc_logo.png';
                        break;
                      case 'renshou':
                        res.data.data[i].name ='仁寿号';
                        res.data.data[i].icon='./static/images/rs_nav_logo.png';
                        break;
                      case 'gp':
                        res.data.data[i].name ='高坪号';
                        res.data.data[i].icon='./static/images/icon/gp_nav_logo.png';
                        break;
                      case 'fs':
                        res.data.data[i].name ='富顺号';
                        res.data.data[i].icon='./static/images/icon/fs_nav_logo.png';
                        break;
                      case 'gl':
                        res.data.data[i].name ='古蔺号';
                        res.data.data[i].icon='./static/images/icon/gl_nav_logo.png';
                        break;
                      case 'lb':
                        res.data.data[i].name ='雷波号';
                        res.data.data[i].icon='./static/images/icon/lb_nav_logo.png';
                        break;
                      case 'rx':
                        res.data.data[i].name ='荣县号';
                        res.data.data[i].icon='./static/images/icon/rx_nav_logo.png';
                        break;
                      case 'xh':
                        res.data.data[i].name ='宣汉号';
                        res.data.data[i].icon='./static/images/icon/xh_nav_logo.png';
                        break;
                      default:
                        break;
                    }
                  }
                }
              }
              this.nav = res.data.data;
            })
          }
      },
      created(){
        eventBus.$on('changeurl',(url)=>{
            this.currentUrl = url.url;
          this.currentFirstIndex = url.index;
          })
          this.getNav()
      }
    }
</script>

<style scoped>
  li{
    list-style: none;
  }
  .nav{
    position: fixed;
    height: 100%;
    box-sizing: border-box;
    padding: 95px 0 40px;
    top: 0;
    left: 50%;
    width: 180px;

    overflow-x: hidden;
    overflow-y: auto;
    margin-left: -590px;
  }
  .nav ul{
    max-height: 100%;
    width: 300px;
    box-sizing: border-box;
    background-color: #ffffff;
    -webkit-box-shadow: 0 0 5px 1px #ebebeb;
    -moz-box-shadow: 0 0 5px 1px #ebebeb;
    box-shadow: 0 0 5px 1px #ebebeb;
    padding-top: 20px;
    overflow-y: auto;
  }
  .nav li{
    width: 180px;
  }
  .nav .item{
    width: 180px;
    box-sizing: border-box;
    padding: 0 10px;
    line-height: 40px;
    height: 40px;
    display: -webkit-flex;
    display: flex;
    -webkit-align-items: center;
    align-items: center;
    font-size: 16px;
    color: #777777;
    position: relative;
    cursor: pointer;
  }
  .nav  .sj{
    width: 12px;
    height: 6px;
    background: url("../../static/images/icon/shang.png") center no-repeat;
    background-size: 100% 100%;
    position: absolute;
    right: 10px;
    top: 50%;
    margin-top: -3px;
    -webkit-transition: all .4s;
    -moz-transition: all .4s;
    -ms-transition: all .4s;
    -o-transition: all .4s;
    transition: all .4s;
    -webkit-transform: rotate(180deg);
    -moz-transform: rotate(180deg);
    -ms-transform: rotate(180deg);
    -o-transform: rotate(180deg);
    transform: rotate(180deg);
  }
  .nav .img{
    width: 22px;
    height: 22px;
    position: relative;
    margin-right: 10px;
    overflow: hidden;
  }
  .nav img{
    display: block;
    width: 22px;
  }
  .nav dl{
    display: none;
  }
  .nav dt{
    font-size: 14px;
    line-height: 40px;
    width: 180px;
    box-sizing: border-box;
    padding-left: 42px;
    color: #777777;
    cursor: pointer;
  }
  .nav dt a{
    display: block;
    text-decoration: none;
    width: 100%;
    color: #777777;
  }
  .nav li.open .sj{
    -webkit-transform: rotate(0);
    -moz-transform: rotate(0);
    -ms-transform: rotate(0);
    -o-transform: rotate(0);
    transform: rotate(0);
  }
  .nav .open dl{
    display: block;
  }
  .nav li.open .img img{
    position: absolute;
    left: 0;
    bottom: 0;
  }
  .nav dt.ac, .nav dt:hover,.nav .item:hover{
    color: #ff353a;
  }
</style>
