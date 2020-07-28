<template>
    <div class="fansList">
     <div class="top-bar">
       <div class="left">
         <!--<span :class="currentIndex==0?'ac':''" @click="changeIndex(0)">登录用户</span>-->
         <!--<span :class="currentIndex==1?'ac':''" @click="changeIndex(1)">未登录用户</span>-->
       </div>
       <div class="right">
         <!--<span>全选关注</span>-->
         <!--<span>全选拉黑</span>-->
       </div>
     </div>
      <ul class="list">
        <li v-for="(item,index) in fansList">
          <div class="top">
            <!--<span @click="toFouces(item.userId,index)" class="no" v-show="!item.followedByMe"><i class="el-icon-plus"></i>关注</span>-->
            <!--<span @click="toFouces(item.userId,index)" class="yes" v-show="item.followedByMe"><i class="el-icon-check"></i>已关注</span>-->
          </div>
          <div class="head"><img :src="item.photo?item.photo:'../../../static/images/icon/touxiang.png'" alt=""></div>
          <div class="name">{{item.nickName?item.nickName:'匿名用户'}}</div>
          <div class="handle">
            <span @click="toDialog(index)"><img src="../../../static/images/icon/baixinxi.png" alt=""><div>私信</div></span>
            <span @click="toFouces(item.id,index)" class="no" v-show="item.followedByMe=='0'"><i class="el-icon-plus"></i>关注</span>
            <span @click="toFouces(item.id,index)" class="yes" v-show="item.followedByMe!='0'"><i class="el-icon-check"></i>已关注</span>
            <!--<span ><img src="../../../static/images/icon/hei.png" alt=""><div>拉黑</div></span>-->
          </div>
        </li>
        <!--<li>-->
          <!--<div class="top">-->
            <!--&lt;!&ndash;<span class="no"><i class="el-icon-plus"></i>关注</span>&ndash;&gt;-->
            <!--<span class="yes"><i class="el-icon-check"></i>已关注</span>-->
          <!--</div>-->
          <!--<div class="head"><img src="../../../static/images/icon/touxiang.png" alt=""></div>-->
          <!--<div class="name">匿名用户</div>-->
          <!--<div class="handle">-->
            <!--<span @click="toDialog"><img src="../../../static/images/icon/baixinxi.png" alt=""><div>私信</div></span>-->
            <!--<span><img src="../../../static/images/icon/hei.png" alt=""><div>拉黑</div></span>-->
          <!--</div>-->
        <!--</li>-->
      </ul>
      <div class="no-fans" v-show="noFans">
        <img src="../../../static/images/no-data.png" alt="">
        <p>暂无粉丝</p>
      </div>
      <div class="dialog-box" v-show="isDialog">
        <div class="dialog">
          <div class="title"><div>与<span>{{currentName}}</span>对话中</div> <div class="close" @click="closeDialog"><i class="el-icon-close"></i></div></div>
          <textarea maxlength="300" id="textarea" v-model="textareaWord"></textarea>
          <div class="bottom">
            <div>
              <span>{{currentWordNum}}</span>/300
            </div>
            <div class="send" @click="sendMsgJM">发送</div>
          </div>
        </div>
        <div class="waiting" v-show="showWaiting"><i class="el-icon-loading"></i></div>
      </div>
      <div class="loading" v-show="isLoading"><i class="el-icon-loading"></i></div>
    </div>
</template>

<script>
  import {config} from "../../router/httpConfig";
    export default {
        name: "",
      data(){
          return{
            noFans:0,
            isLoading:1,
            showWaiting:0,
            JIM:new JMessage(),
            isDialog:0,
            userId:'',
            currentIndex:0,
            currentWordNum:0,
            textareaWord:'',
            currentName:'',
            appbackUrl:this.$store.state.appbackUrl,//两微一端路径
            fansList:[],
            appKey:''
          }
      },
      methods:{
        //粉丝关注
        toFouces(id,index){
          this.isLoading=1;
          var attentType =  this.fansList[index].followedByMe=='0'?1:2
          this.$http({
            url:this.appbackUrl+config.fansAttentionUser+'?userId='+this.userId+'&attentUserId='+id+'&attentType='+attentType
          }).then((res)=> {
            if(res.data.status==200){
              this.isLoading=0;
              this.fansList[index].followedByMe=='0'?this.fansList[index].followedByMe='1':this.fansList[index].followedByMe='0'
              if(this.fansList[index].followedByMe=='1'){
                this.$message({
                  message: '关注成功！',
                  type: 'success'
                });
              }
              else {
                this.$message({
                  message: '取消关注！',
                  type: 'success'
                });
              }
            }
            else {
              this.$message.error(res.data.message);
            }
          }).catch((err)=>{
          })
        },
        toDialog(index){
          this.currentIndex = index;
          // this.sendMsgJM(index)
          this.currentName = this.fansList[index].nickName;
          this.isDialog = 1;
        },
        // 初始化极光
        siginUpJM(){
          var that = this;
          this.$http({
            url:this.$store.state.appbackUrl+config.jimInit
          }).then((res)=> {
            res.data.data.flag = 1;
            that.appKey = res.data.data.appKey;
            this.JIM.init(res.data.data).onSuccess(function(data) {
              that.registerJM()
            }).onFail(function(data) {
            });
          }).catch((err)=>{
          })
        },
        // 注册极光
        registerJM(id){
          var that = this;
          this.$http({
            url:this.$store.state.appbackUrl+config.JIMRegist+'?userId='+this.userId
          }).then((res)=> {
            this.siginInJM(res.data.data)
          }).catch((err)=>{
          })

        },
        // 登录极光
        siginInJM(password){
          var that = this;
          this.JIM.login({
            'username' : password,
            'password': password
          }).onSuccess(function(data) {
            // appendToDashboard(JSON.stringify(data));
            that.JIM.onMsgReceive(function(data) {
              data = JSON.stringify(data);
              // that.postMessage()
            });
            that.JIM.onEventNotification(function(data) {
            });
            that.JIM.onSyncConversation(function(data) { //离线消息同步监听
              // console.log( data);
              // appendToDashboard('event_receive: ' +JSON.stringify(data));
            });

            that.JIM.onUserInfUpdate(function(data) {
              // console.log('onUserInfUpdate : ' + JSON.stringify(data));
              // appendToDashboard('onUserInfUpdate : ' +JSON.stringify(data));
            });

            that.JIM.onSyncEvent(function(data) {
              // console.log('onSyncEvent : ' + JSON.stringify(data));
              // appendToDashboard(data);
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
              // appendToDashboard(data);
            });
          }).onFail(function(data) {
            // console.log('登录error:' + JSON.stringify(data));
            // appendToDashboard('error: ' +JSON.stringify(data));
          }).onTimeout(function(data) {
            // console.log('timeout:' + JSON.stringify(data));
            // appendToDashboard('timeout: ' +JSON.stringify(data));
          });
        },
        // 极光消息发送
        sendMsgJM(){
          if(this.textareaWord==''){
            this.$message({
              showClose: true,
              message: '内容不能为空',
              type: 'error'
            });
            return false
          }
          this.showWaiting = 1;
          // 发送消息
          var that = this;
          var targetName = this.fansList[this.currentIndex ].id;
          // var targetName = '0bfd522672d54bde8fe6acf9d2dcf66c'
          that.JIM.sendSingleMsg({
            'target_username' : targetName,
            'appkey' :  that.appKey,
            'content' : that.textareaWord,
            'no_offline' : false,
            'no_notification' : false,
            //'custom_notification':{'enabled':true,'title':'title','alert':'alert','at_prefix':'atprefix'}
            need_receipt:true
          }).onSuccess(function(data,msg) {

            that.isDialog = 0;
            that.showWaiting = 0;
            that.textareaWord='';
            that.$message({
              showClose: true,
              message: '发送成功',
              type: 'success'
            });
          }).onFail(function(data) {

          });
        },
        closeDialog(){
          this.showWaiting = 0;
          this.currentName = '';
          this.isDialog = 0;
          this.textareaWord = '';
        },
        monitorTextarea(){
          var that = this;
          var el = document.getElementById('textarea');
          el.addEventListener('input',function () {
            that.currentWordNum = this.value.length;
          });
          el.addEventListener('propertychange',function () {//兼容IE
            that.currentWordNum = this.value.length;
          });
        },
        // 获取用户信息
        getUserInfo(){
          this.userId =this.$store.state.userInfo.appbackId
          this.appbackUrl =this.$store.state.appbackUrl
          this.getFansList()
          this.siginUpJM()
        },
        // 获取粉丝列表
        getFansList(){
            this.$http({
              url:this.$store.state.appbackUrl+config.fansListUrl+'?userId='+this.userId+'&followType=1&currentUserId='+this.userId
            }).then((res)=> {
              this.isLoading = 0;
              this.fansList= res.data.data.rows;
              if(this.fansList.length==0){
                this.noFans = 1;
              }
            }).catch((err)=>{
            })
        },
      },
      beforeCreate(){

      },
      created(){
        var that = this;
        var timer = setInterval(function () {
          if(that.$store.state.userInfo.appbackId){
            clearInterval(timer)
            that.getUserInfo()
          }
        },1000)
      },
      mounted(){
          this.monitorTextarea()
      }
    }
</script>

<style scoped>
  .no-fans{
    line-height: 30px;
    text-align: center;
    color: #999999;
    font-size: 16px;
    overflow: hidden;
  }
  .no-fans img{
    display: block;
    width: 100px;
    margin: 100px auto 0;
  }
  .loading{
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.4);
    color: #ff353a;
    box-sizing: border-box;
    position: fixed;
    padding:95px 20px 15px;
    left: 0;
    top: 0;
    z-index: 9999999;
  }
  .loading .mask{
    width: 980px;
    height: 100%;

    position: relative;
  }
  .loading i{
    font-size: 30px;
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }
  .dialog-box{
    overflow: hidden;
    position: fixed;
    right: 70px;
    bottom: 40px;
    background-color: #ffffff;
    z-index: 3;
  }
  .waiting{
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
    background-color: rgba(0,0,0,.5);
    width: 100%;
    height: 100%;
    text-align: center;
  }
  .waiting i{
    color: #ff353a;
    font-size: 30px;
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }
  .dialog{
    width: 500px;
    height: 255px;
    box-sizing: border-box;
    border: 1px solid #bfbfbf;
    float: right;
  }
  .dialog .close{
    width: 30px;
    height: 30px;
    cursor: pointer;
    text-align: center;
    line-height: 30px;
    position: absolute;
    right: 15px;
    top: 50%;
    font-size: 16px;
    margin-top: -15px;
  }
  .dialog .title{
    height: 54px;
    padding: 0 15px;
    border-bottom: 1px solid #bfbfbf;
    line-height: 53px;
    font-size: 14px;
    position: relative;
  }
  .dialog .title span{
    font-size: 16px;
  }
  .dialog textarea{
    display: block;
    width: 100%;
    box-sizing: border-box;
    height: 143px;
    resize: none;
    padding: 20px;
    font-size: 14px;
    line-height: 1.4;
    border: none;
    outline: none;
  }
  .dialog .bottom{
    height: 56px;
    width: 100%;
    box-sizing: border-box;
    padding: 0 15px;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-justify-content: space-between;
    justify-content: space-between;
    -webkit-align-items: center;
    align-items: center;
    line-height: 56px;
    font-size: 12px;
    color: #999999;
  }
  .dialog .send{
    width: 80px;
    height: 30px;
    -webkit-border-radius: 2px;
    -moz-border-radius: 2px;
    border-radius: 2px;
    background: #f85959;
    color: #ffffff;
    text-align: center;
    line-height: 30px;
    cursor: pointer;
  }
.fansList{
  width: 100%;
  box-sizing: border-box;
  padding: 0 40px 100px;
  background-color: #ffffff;
  overflow: hidden;
}
li{
  list-style: none;
}
  .top-bar{
    width: 100%;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-justify-content: space-between;
    justify-content: space-between;
    height: 30px;
    font-size: 0;
    /*margin: 40px 0 20px;*/
  }
  .top-bar .left span{
    display: inline-block;
    vertical-align: top;
    box-sizing: border-box;
    height: 30px;
    width: 99px;
    border: 1px solid #ff353a;
    color: #ff353a;
    text-align: center;
    line-height: 28px;
    cursor: pointer;
    font-size: 15px;
  }
.top-bar .left .ac{
  background-color: #ff353a;
  color: #ffffff;
}
.top-bar .right{
  font-size: 0;
  height: 30px;
  margin-top: 9px;
}
  .top-bar .right span{
    height: 14px;
    display: inline-block;
    vertical-align: top;
    line-height:14px;
    float: left;
    font-size: 13px;
    color: #838383;
    cursor: pointer;
    padding-left: 7px;
  }
.top-bar .right span:first-child{
  padding-right: 7px;
  border-right: 1px solid #838383;
}
  .list{
    overflow: hidden;
  }
  .list li{
    width: 197px;
    height: 234px;
    box-sizing: border-box;
    float: left;
    margin-right: 25px;
    border: 1px solid #ececec;
    overflow: hidden;
    padding: 0 14px;
    margin-bottom: 25px;
  }
  .list .top{
    text-align: right;
    font-size: 12px;
    margin: 10px 0 1px;
  }
  .list .top .no{
    cursor: pointer;
    color: #ff5e61;
  }
.list .top .yes{
  cursor: pointer;
  color: #b0b0b0;
}
.list .top i{
  margin-right: 5px;
}
  .list .head{
    width: 88px;
    height: 88px;
    box-sizing: border-box;
    border: 2px solid #e6e6e6;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    overflow: hidden;
    margin: 20px auto 0;
    background: url("../../../static/images/default_head.png") center no-repeat;
    background-size: cover;
  }
  .list .head img{
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .list .name{
    text-align: center;
    font-size: 12px;
    margin-top:27px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .handle{
    text-align: right;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-justify-content: center;
    justify-content: center;
    margin-top: 30px;
  }
  .handle span{
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-justify-content: center;
    justify-content: center;
    -webkit-align-items: center;
    align-items: center;
    font-size: 12px;
    width: 66px;
    height: 24px;
    box-sizing: border-box;
    -webkit-border-radius: 2px;
    -moz-border-radius: 2px;
    border-radius: 2px;
    cursor: pointer;
  }
.handle span:first-child{
  color: #ffffff;
  background-color: #ff353a;
}
/*.handle span:last-child{*/
  /*color: #929292;*/
  /*background: none;*/
/*}*/
  .handle img{
    height: 14px;
    margin-right: 5px;
  }
</style>
