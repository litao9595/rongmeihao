<template>
    <div class="index"  v-show="isLoading">
      <div-header></div-header>
      <div-nav></div-nav>
      <div class="body">
        <div class="main">
          <router-view></router-view>
        </div>
      </div>
      <fixed-right></fixed-right>
    </div>
</template>

<script>
  import {config} from "../router/httpConfig.js"
  import {mapMutations} from 'vuex'
  import divHeader from './header'
  import divNav from './leftNav'
  import fixedRight from './fixedRight'
    export default {
        name: "",
      components:{
          divHeader,
        divNav,
        fixedRight
      },
      data(){
          return{
            isLoading:0,
            JIM:new JMessage(),
          }
      },
      methods:{
        delCookie(name) {
          var exp = new Date();
          exp.setTime(exp.getTime() - 1);
          var cval=this.getCookie(name);
          if(cval!=null)
            document.cookie= name + "="+cval+";path=/;expires="+exp.toGMTString();
        },
        getCookie(name) {
          var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
          if(arr=document.cookie.match(reg))
            return unescape(arr[2]);
          else
            return null;
        },
        quit() {
          this.$http({
            url:config.logOutUrl+'Index!logout',
            dataType : 'json',
          }).then(()=> {
            this.$http({
              url:config.logOutUrl+'ydmedia/loginOut'
            }).then(()=>{
              this.delCookie("loginUserNameId_app_yidahao")
              this.delCookie("loginUserName_app_yidahao")
              if(location.href.indexOf('scope=')>-1){
                location.href = '/'+location.href.split('#')[0].split('=')[1]+'/index.html';
              }
              else{
                location.href = '/'+'index.html';
              }
            })
          }).catch((err)=>{
            this.$http({
              url:config.logOutUrl+'ydmedia/loginOut'
            }).then(()=>{
              this.delCookie("loginUserNameId_app_yidahao")
              this.delCookie("loginUserName_app_yidahao")
              if(location.href.indexOf('scope=')>-1){
                location.href = '/'+location.href.split('=')[1]+'/index.html';
              }
              else{
                location.href = '/'+'index.html';
              }
            })
          })
        },
          getUserInfo(){
            this.$http({
              url:config.baseUrl,
            }).then((res)=>{
              if(res.data.data.ap==null||res.data.data.us.id==null){
                // location.href = config.logOutUrl;
                this.quit();
              }
              else {
                this.isLoading = 1;
                this.setUserInfo(res.data.data.us)
                this.setBaseUrl(res.data.data.ap)
                sessionStorage.setItem('userId',res.data.data.us.id)
                sessionStorage.setItem('teacherId',res.data.data.us.teacherId)
                // sessionStorage.teacherId=res.data.data.us.teacherId;
              }
            }).catch((err)=>{
              console.log(err)
              // location.href = config.logOutUrl+'#';
            })
          },
          ...mapMutations(['setUserInfo','setBaseUrl'])
      },
      created(){
        this.getUserInfo()
      }
    }
</script>

<style scoped>
  li{
    list-style: none;
  }
  .index{
    min-height: 100%;
  }
  .body{
    width: 1180px;
    margin: 0 auto;
    min-height: 100%;
    box-sizing: border-box;
    padding-top: 95px;
  }
  .body .main{
    margin-left: 200px;
  }
</style>
