<template>
    <div class="header">
      <div class="wrapper">
        <div class="logo"><img :src="logo" alt=""></div>
        <div class="right">
          <div class="sx" @click="goDialog"><router-link to="/dialogBox"><i class="el-icon-message"></i><span class="cur" v-show="isUnread"></span></router-link></div>
          <div class="user">
            <div class="head"><img :src="userInfo.portrait?userInfo.portrait:'./static/images/default_head.png'" alt=""></div>
            <div class="name">{{userInfo.nickName}}</div>
            <ul>
              <li @click="changeUrl">
                <router-link tag="a" to="/systemManagement">
                  <img src="../../static/images/icon/shezhi.png" alt="">
                  <div>账号设置</div>
                </router-link>
              </li>
              <li>
                <a @click="quit">
                  <img src="../../static/images/icon/tuichu.png" alt="">
                  <div>退出系统</div>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  import {config} from "../router/httpConfig.js"
  import { eventBus } from '../main'
  import {mapMutations} from 'vuex'
  import {mapState} from 'vuex'
    export default {
        name: "",
      data(){
          return{
            logo:'../../static/images/logo_zi1.png',
            isUnread:0,
            leftUserList:[],
            JIM:new JMessage()
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
          // location.href = config.logOutUrl+'#';
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
        goDialog(){
          this.isUnread = 0;
          eventBus.$emit('changeurl',{url:'/dialogBox',index:-1})
        },
        changeUrl(){
          eventBus.$emit('changeurl',{url:'/systemManagement',index:1})
        },
        // 初始化极光
        siginUpJM(){
          var that = this;
          this.$http({
            url:this.$store.state.appbackUrl+config.jimInit
          }).then((res)=> {
            res.data.data.flag = 1;
            this.JIM.init(res.data.data).onSuccess(function(data) {
              that.registerJM()
              // appendToDashboard('success' + data);
            }).onFail(function(data) {
              // console.log('error:' + JSON.stringify(data))
              // appendToDashboard('error: ' +JSON.stringify(data));
            });
          }).catch((err)=>{
          })
        },
        // 注册极光
        registerJM(id){
          var that = this;
          // +this.$store.state.userInfo.appbackId
          this.$http({
            url:this.$store.state.appbackUrl+config.JIMRegist+'?userId='+this.$store.state.userInfo.appbackId
          }).then((res)=> {
            if(res.data.status==200){
              that.siginInJM(res.data.data);
              that.userName = res.data.data;
            }
            // else {
            //   this.$message({
            //     message: res.data.message,
            //     type: 'warning'
            //   });
            // }
          }).catch((err)=>{
          })

        },
        //获取会话列表
       getConversation() {
          var that = this;
        this.JIM.getConversation().onSuccess(function (data) {
          var total = 0;
          for(var i=0;i<data.conversations.length;i++){
            total+=data.conversations[i].unread_msg_count;
          }
         that.isUnread = total
        })
      },
      getUnreadMsgUpdate(username) {
        this.isUnread = this.JIM.getUnreadMsgCnt({
          'username' : username
        })
      },
        // 登录极光
        siginInJM(password){
          var that = this;
          this.JIM.login({
            'username' : password,
            'password': password
          }).onSuccess(function(data) {
            that.getConversation()
            that.JIM.onMsgReceive(function(data) {
              if(data.messages[0].msg_type!=4){
                that.getUnreadMsgUpdate(data.messages[0].from_username)
              }
            });
            that.JIM.onEventNotification(function(data) {
            });
            that.JIM.onSyncConversation(function(data) { //离线消息同步监听
            });

            that.JIM.onUserInfUpdate(function(data) {
              // console.log('onUserInfUpdate : ' + JSON.stringify(data));
              // appendToDashboard('onUserInfUpdate : ' +JSON.stringify(data));
            });

            that.JIM.onSyncEvent(function(data) {
              // console.log('onSyncEvent : ' + JSON.stringify(data));
            });
            that.JIM.onMsgReceiptChange(function(data){
              // console.log('onMsgReceiptChange : ' + JSON.stringify(data));
              // appendToDashboard('onMsgReceiptChange : ' +JSON.stringify(data));
            });

            that.JIM.onSyncMsgReceipt(function(data){
              // console.log('onSyncMsgReceipt : ' + JSON.stringify(data));
              // appendToDashboard('onSyncMsgReceipt : ' +JSON.stringify(data));
            });

            that.JIM.onMutiUnreadMsgUpdate(function(data){
              // console.log('onConversationUpdate : ' + JSON.stringify(data));
              // appendToDashboard('onConversationUpdate : ' +JSON.stringify(data));
            });

            that.JIM.onTransMsgRec(function(data){
              // console.log('onTransMsgRec : ' + JSON.stringify(data));
              // appendToDashboard('onTransMsgRec : ' +JSON.stringify(data));
            });

            that.JIM.onRoomMsg (function(data){
              // console.log(data)
            });
          }).onFail(function(data) {
            // console.log('登录error:' + JSON.stringify(data));
          }).onTimeout(function(data) {
          });
        },
      },
      computed:{
  ...mapState({
            userInfo: state =>state.userInfo
          })
      },
      created(){
        var url = location.href; //获取url中"?"符后的字串
        if(url.indexOf('scope=renshou')>-1){
          this.logo = 'static/images/logo_zi2.png'
        }
        else if(url.indexOf('scope=gp')>-1){
          this.logo = 'static/images/icon/gp.png'
        }
        else if(url.indexOf('scope=nc')>-1){
          this.logo = 'static/images/icon/nc_logo_zi.png'
        }
        else if(url.indexOf('scope=fs')>-1){
          this.logo = 'static/images/icon/fs.png'
        }
        else if(url.indexOf('scope=gl')>-1){
          this.logo = 'static/images/icon/gl.png'
        }
        else if(url.indexOf('scope=lb')>-1){
          this.logo = 'static/images/icon/lb.png'
        }
        else if(url.indexOf('scope=rx')>-1){
          this.logo = 'static/images/icon/rx.png'
        }
        else if(url.indexOf('scope=xh')>-1){
          this.logo = 'static/images/icon/xh.png'
        }
        else {
          this.logo = 'static/images/logo_zi1.png'
        }
          eventBus.$on('unread',(res)=>{
            this.isUnread = res;
          })
          var that = this;
        var timer = setInterval(function () {
          if(that.$store.state.userInfo.id){
            clearInterval(timer)
            that.siginUpJM()
          }
        },500)
      }
    }
</script>

<style scoped>
  li{
    list-style: none;
  }
.header{
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 75px;
  background-color: #ffffff;
  -webkit-box-shadow: 0 2px 5px 0px #ebebeb;
  -moz-box-shadow: 0 2px 5px 0px #ebebeb;
  box-shadow: 0 2px 5px 0px #ebebeb;
  z-index: 9999;
}
  .wrapper{
    width: 1180px;
    margin: 0 auto;
    height: 75px;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-justify-content: space-between;
    justify-content: space-between;
    -webkit-align-items: center;
    align-items: center;
  }
  .header .right{
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-align-items: center;
    align-items: center;
  }
  .head{
    width: 40px;
    height: 40px;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 20px;
  }
  .head img{
    display: block;
    width: 40px;
    height: 40px;
    object-fit: cover;
  }

  .sx{
    font-size: 26px;
    padding: 0 10px;
    color: #999999;
    cursor: pointer;
    position: relative;
    margin-right: 30px;
  }
  .sx a{
    color: #999;
  }
  .sx .cur{
    position: absolute;
    width: 6px;
    height: 6px;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    top: 6px;
    right: 10px;
    background-color: red;
  }
  .user{
    height: 75px;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-align-items: center;
    align-items: center;
    position: relative;
    padding-right: 30px;
    cursor: pointer;
  }
  .user:after{
    content: '';
    display: block;
    border: 5px solid transparent;
    border-top: 5px solid #999;
    position: absolute;
    top: 50%;
    right: 0;
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
  }
  .user:hover ul{
    display: block;
  }
  .user ul{
    position: absolute;
    left: 0;
    top: 75px;
    width: 138px;
    background-color: #fff;
    -webkit-box-shadow: 0 1px 4px rgba(4, 0, 0, .19);
    -moz-box-shadow: 0 1px 4px rgba(4, 0, 0, .19);
    box-shadow: 0 1px 4px rgba(4, 0, 0, .19);
    display: none;
  }
  .user li a{
    text-decoration: none;
    display: block;
    width: 100%;
    height: 44px;
    display: -webkit-flex;
    display: flex;
    -webkit-justify-content: center;
    justify-content: center;
    -webkit-align-items: center;
    align-items: center;
    font-size: 14px;
    line-height: 44px;
    color: #222;
    cursor: pointer;
  }
  .user li:hover{
    background-color: #f4f5f6;
  }
  .user li img{
    display: block;
    height: 16px;
    margin-right: 7px;
  }
</style>
