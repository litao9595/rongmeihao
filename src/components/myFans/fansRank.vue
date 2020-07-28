<template>
  <div class="fansList" :style="{minHeight:minHeight+'px'}">
    <h2><span @click="goback">粉丝概况 <i class="el-icon-arrow-right"></i> </span>互动榜排行</h2>
    <div class="top">
      <ul>
          <li class="item"  v-for="(item,index) in topThree"  :class="index==0?'no1':''||index==1?'no2':''||index==2?'no3':''">
            <img :src="item.photo?item.photo:'../static/default_head.png'" alt="" class="head">
            <p>NO.{{index+1}}</p>
            <div class="name">{{item.nickName}}</div>
            <div class="num">转评赞数{{item.count}}</div>
            <div class="bar">
              <span class="sx" @click="toDialog(item.id,index,1)"><i class="el-icon-message"></i>私信</span>
              <span class="gz" v-show="item.followedByMe=='0'" @click="toFouces(item.id,index,1)"><i class="el-icon-plus"></i>关注</span>
              <span class="gz" v-show="item.followedByMe=='1'" @click="toFouces(item.id,index,1)"><i class="el-icon-check"></i>已关注</span>
            </div>
          </li>
      </ul>
    </div>
    <ul class="list">
      <li v-for="(item,index) in fansList">
        <div>
          <div class="index">{{index+4}}</div>
          <div class="img"><img :src="item.photo?item.photo:'../static/default_head.png'" alt=""></div>
          <div class="name">
            <div>{{item.nickName}}</div>
            <p>转评赞数{{item.count}}</p>
          </div>
          <div class="bar">
            <div class="sx" @click="toDialog(item.id,index,2)"><i class="el-icon-message"></i>私信</div>
            <div class="gz" v-show="item.followedByMe=='0'" @click="toFouces(item.userId,index,2)"><i class="el-icon-plus"></i>关注</div>
            <div class="gz" v-show="item.followedByMe=='1'" @click="toFouces(item.userId,index,2)"><i class="el-icon-check"></i>已关注</div>
          </div>
        </div>
      </li>
    </ul>
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
        minHeight:this.common.getWindowHeight(),
        isDialog:0,
        isLoading:0,
        userId:'',
        appbackUrl:localStorage.appbackUrl,//两微一端路径
        topThree:[],
        fansList:[],
        appKey:'',
        currentFocus:0,
        currentDialog:0,
        showWaiting:0,
        JIM:new JMessage(),
        textareaWord:'',
        currentWordNum:0,
        currentName:'',
      }
    },
    methods:{
      //粉丝关注
      toFouces(id,index,flag){
        this.isLoading=1;
        this.currentFocus = flag;
        if(flag==1){
          var attentType =  this.topThree[index].followedByMe=='0'?1:2
        }
        else {
          var attentType =  this.fansList[index].followedByMe=='0'?1:2
        }

        this.$http({
          url:this.appbackUrl+config.fansAttentionUser+'?userId='+this.userId+'&attentUserId='+id+'&attentType='+attentType
        }).then((res)=> {
          if(res.data.status==200){
            this.isLoading=0;
            if(flag==1){
              this.topThree[index].followedByMe=='1'?this.topThree[index].followedByMe='0':this.topThree[index].followedByMe='1'
              if(this.topThree[index].followedByMe=='1'){
                this.$message({
                  message: '已关注！',
                  type: 'success'
                });
              }
              else {
                this.$message({
                  message: '已取消关注！',
                  type: 'success'
                });
              }
            }
            else {
              this.fansList[index].followedByMe=='1'?this.fansList[index].followedByMe='0':this.fansList[index].followedByMe='1'
              if(this.fansList[index].followedByMe=='1'){
                this.$message({
                  message: '已关注！',
                  type: 'success'
                });
              }
              else {
                this.$message({
                  message: '已取消关注！',
                  type: 'success'
                });
              }
            }

          }
          else {
            this.$message.error(res.data.message);
          }
        }).catch((err)=>{
        })
      },
      // 私信
      toDialog(id,index,flag){
        this.currentIndex = index;
        this.currentDialog = flag;
        if(flag==1){
          this.currentName = this.topThree[index].nickName;
        }
        else {
          this.currentName = this.fansList[index].nickName;
        }
        this.isDialog = 1;
      },
      // 初始化极光
      siginUpJM(){
        var that = this;
        this.$http({
          url:this.$store.state.appbackUrl+config.jimInit
        }).then((res)=> {
          that.appKey = res.data.data.appKey;
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
        this.$http({
          url:this.$store.state.appbackUrl+config.JIMRegist+'?userId='+id
        }).then((res)=> {
          this.siginInJM(res.data.data)
        }).catch((err)=>{
        })

      },
      // 监听到消息变化
      postMessage(){
        // $()

        if($('#msgNum', window.parent.document)){
          $('#msgNum', window.parent.document).text(parseInt($('#msgNum', window.parent.document).text())+1)
        }

        // window.parent.document.getElementById('msgNum')
      },
      // 登录极光
      siginInJM(password){
        var that = this;
        this.JIM.login({
          'username' : password,
          'password': password
        }).onSuccess(function(data) {
          // console.log('登录成功')
          // appendToDashboard(JSON.stringify(data));
          that.JIM.onMsgReceive(function(data) {
            data = JSON.stringify(data);
            that.postMessage()
          });
          that.JIM.onEventNotification(function(data) {
            // console.log('event_receive: ' + JSON.stringify(data));
            // appendToDashboard('event_receive: ' +JSON.stringify(data));
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
            appendToDashboard(data);
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
          });
        }).onFail(function(data) {
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
        if(that.currentDialog==1){
          var targetName = this.topThree[this.currentIndex ].id;
        }
        else {
          var targetName = this.fansList[this.currentIndex ].id;
        }
        // var targetName = 'ec5d0f5efeb14e7f91b9a28c0e4ac8c5'
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
          that.textareaWord = '';
          that.$message({
            showClose: true,
            message: '发送成功',
            type: 'success'
          });
        }).onFail(function(data) {
        });
      },
      // 获取用户信息
      getUserInfo(){
        this.appbackUrl = this.$store.state.appbackUrl;
        this.userId = this.$store.state.userInfo.appbackId;
        this.getFansRank()
        this.siginUpJM()
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
      //互动排行榜
      getFansRank(){
        this.$http({
          url:this.appbackUrl+config.fansRankUrl+'?userId='+this.userId
        }).then((res)=> {
          this.topThree = res.data.data.rows.slice(0,3)
          this.fansList = res.data.data.rows.slice(3)
        }).catch((err)=>{
        })
      },
      goback(){
        this.$router.push({
          path: `/myFans/fansSurvey`,
        })
      }
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
    }
  }
</script>

<style scoped>
  .loading{
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    background-color: rgba(0,0,0,.4);
    color: #ff353a;
    z-index: 9999999;
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
  li{
    list-style: none;
  }
  .fansList{
    width: 100%;
    background-color: #fff;
    padding: 17px 0 30px;
  }
  h2{
    height: 48px;
    line-height: 48px;
    font-size: 16px;
    color: #ff353a;
    font-weight: normal;
    padding: 0 40px;
    border-bottom: 1px solid #bfbfbf;
  }
  h2 span{
    color: #222222;
    cursor: pointer;
  }
  .top{
    margin-top: 30px;
    width: 100%;
    box-sizing: border-box;
    padding: 0 40px;
  }
  .top ul{
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    padding: 13px 75px 0;
    background: url("../../../static/images/icon/bj.png");
    background-size: 100% 100%;
    padding-bottom: 30px;
    position: relative;
  }
  .top li{
    position: relative;
    overflow: hidden;
  }
  .top .no2{
    width: 158px;
    height: 169px;
    position: absolute;
    left: 75px;
    box-sizing: border-box;
    background: url("../../../static/images/icon/er.png");
    background-size: 100% 100%;
    top: 20px;
  }
  .top .no3{
    width: 158px;
    position: absolute;
    right: 75px;
    height: 171px;
    box-sizing: border-box;
    background: url("../../../static/images/icon/san.png");
    background-size: 100% 100%;
    top: 20px;
  }
  .top .no1{
    width: 201px;
    margin: 0 auto;
    height: 206px;
    box-sizing: border-box;
    background: url("../../../static/images/icon/yi.png");
    background-size: 100% 100%;
  }
  .top .no1 .bar{
    bottom: 20px;
  }
  .top .head{
    display: block;
    width: 78px;
    height: 78px;
    object-fit: cover;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    margin: 1px 0 0 39px;
  }
  .top .no1 .head{
    width: 85px;
    height: 85px;
    object-fit: cover;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    margin: 5px 0 0 53px;
  }
  .top .no2 .head{
    margin-left: 40px;
  }
  .top p{
    width: 87px;
    height: 21px;
    text-align: center;
    line-height: 21px;
    background-color: #e5e5e5;
    font-size: 11px;
    margin: -15px auto 0;
    position: relative;
    z-index: 1;
  }
  .top .no1 p{
    background-color: #ff353a;
    margin-left: 49px;
    margin-top: -14px;
  }
  .top .no2 p{
    background-color: #ff9d33;
  }
  .top .no3 p{
    background-color: #ffcb00;
  }
  .top .no1 p,.top .no2 p,.top .no3 p{
    color: #fff;
  }
  .top .bar{
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
    height: 33px;
    /*border-top: 1px solid #bfbfbf;*/
    line-height: 33px;
    font-size: 12px;
    color: #8d8d8d;
    text-align: center;
  }
  .top .bar span{
    padding: 0 7px;
    cursor: pointer;
  }
  .top .bar i{
    font-size: 14px;
    margin-right: 2px;
  }
  .top .bar .gz{
    color: #ff4b4f;
  }
  .top .name{
    text-align: center;
    width: 100%;
    box-sizing: border-box;
    padding: 0 10px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 15px;
    color: #111111;
    margin: 10px 0 3px;
  }
  .top .num{
    text-align: center;
    font-size: 11px;
    color: #838383;
  }
  .list{
    width: 100%;
    box-sizing: border-box;
    padding: 0 40px;
    overflow: hidden;
  }
  .list li{
    width: 50%;
    float: left;
    margin-top: 25px;
  }
  .list li>div{
    width: 396px;
    height: 120px;
    box-sizing: border-box;
    border: 1px solid #bfbfbf;
    float: left;
    padding: 0 15px;
  }
  .list li:nth-child(2n)>div{
    float: right;
  }
  .list .index{
    float: left;
    width: 30px;
    line-height: 118px;
    font-size: 13px;
    color: #777777;
  }
  .list .img{
    width: 88px;
    height: 88px;
    float: left;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    box-sizing: border-box;
    border: 1px solid #e6e6e6;
    overflow: hidden;
    margin-top: 15px;
  }
  .list .img img{
    display: block;
    width: 100%;
    height: 100%;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    object-fit: cover;
  }
  .list .name{
    width: 130px;
    box-sizing: border-box;
    padding: 0 15px;
    float: left;
    margin-top: 40px;
  }
  .list .name div{
    font-size: 16px;
    margin-bottom: 5px;
  }
  .list .name p{
    font-size: 12px;
    color: #a2a2a2;
  }
  .list .bar{
    float: right;
    margin-top: 50px;
  }
  .list .bar div{
    float: left;
    font-size: 12px;
    color: #a2a2a2;
    cursor: pointer;
  }
  .list .bar .gz{
    margin-left: 20px;
  }
  .list .bar .gz{
    color: #ff4b4f;
  }
  .list .bar i{
    margin-right: 5px;
  }
</style>
