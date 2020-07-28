<template>
    <div class="dialog" :style="{height:minHeight+'px'}">
      <ul class="left" v-show="leftUserList.length>0" :style="{height:minHeight+'px'}">
        <li v-for="(item,index) in leftUserList" :class="currentAC==index?'ac':''"  @click="changeCurrentAC(index,item.username)">
          <div class="head"><img :src="item.avatar" alt=""></div>
          <div class="info">
            <div class="info-top">
              <div class="name">{{item.nickName}}</div>
              <div class="time">{{item.time}}</div>
            </div>
            <!--<div class="des">{{item.dialogList}}</div>-->
            <div class="des" v-if="item.dialogList">{{item.dialogList[(item.dialogList).length-1].content.msg_body.text}}</div>
            <div class="num" v-show="item.unread_msg_count">{{item.unread_msg_count}}</div>
          </div>
        </li>
      </ul>
      <div class="right" v-show="leftUserList.length>0"  :style="{height:minHeight+'px'}">
        <div class="right-item" v-for="(item,index) in leftUserList" v-show="currentAC==index?'ac':''">
          <div class="title">与 <span>{{item.nickName}}</span> 对话中</div>
          <!--<div class="see-all" v-show="!item.isSeeMore" @click="seeMore(index)">查看更多历史消息</div>-->
          <div  class="dialog-box" :id="forId(index)">
            <!--<div class="time">11:25</div>-->
            <div class="item" v-for="(item2,index2) in item.dialogList" :class="item2.content.from_id==userName?'me':'it'">
              <div class="head"><img :src="item2.content.from_id==userName?userPhoto:item.avatar" alt=""></div>
              <div class="des">{{item2.content.msg_body.text}}</div>
              <div class="time">{{item2.time}}</div>

            </div>
            <!--<div class="item me">-->
            <!--<div class="head"><img src="../../static/images/icon/touxiang.png" alt=""></div>-->
            <!--<div class="des">机房的机房粮堆均疯狂夺金发动机</div>-->
            <!--<div class="time">11:30</div>-->
            <!--</div>-->
          </div>
          <div class="send-area">
            <textarea maxlength="300" id="textarea" v-model="textareaWord"></textarea>
            <div class="btn">
              <span @click="sendMsgJM">发送</span>
            </div>
          </div>
        </div>
      </div>
      <div class="no-dialog" v-show="leftUserList.length==0">暂无会话</div>
      <div class="loading" v-show="isLoading"><i class="el-icon-loading"></i></div>
    </div>
</template>
<script>
  import {config} from "../router/httpConfig";
  import { eventBus } from '../main'
    export default {
        name: "",
      data(){
          return{
            isLoading:1,
            currentAC:-1,
            userId:'',
            JIM:new JMessage(),
            leftUserList:[],
            currentDialogUser:{},
            isDialoging:0,
            textareaWord:'',
            dialogList:[],
            minHeight:this.common.getWindowHeight(),
            roamList:[]//漫游记录列表
          }
      },
      methods:{
        forId:function(index){
          return "dialog" +index
        },
        changeCurrentAC(index,username){
          this.getConversation()
          this.currentAC = index;
          this.leftUserList[index].unread_msg_count = 0;
          this.isDialoging = 1;
          this.currentAC = index;
          this.currentDialogUser =this.leftUserList[index]
          this.resetUnreadCount(username)
          this.leftUserList[index].unread = 0;
          this.$nextTick(function () {
            this.scrollBottom()
          })
        },
        scrollBottom(){
          var target = document.getElementById(`dialog`+this.currentAC)
          target.scrollTop = target.scrollHeight
          // $('#dialog'+this.currentAC).scrollTop(30000000)
        },
          //将时间戳转换成yyyy-mm-dd
        fmtDate(obj){
          var date =  new Date(obj);
          var y = 1900+date.getYear();
          var m = "0"+(date.getMonth()+1);
          var d = "0"+date.getDate();
          var mi = '0'+date.getMinutes()
          var h = '0'+date.getHours()
          var date2 = new Date();
          var y2 = 1900+date2.getYear();
          var m2 = "0"+(date2.getMonth()+1);
          var d2 = "0"+date2.getDate();
          if(y==y2&&m==m2&&d==d2){
            return h.substring(h.length-2,h.length)+':'+mi.substring(mi.length-2,mi.length);
          }
          else {
            return y+"-"+m.substring(m.length-2,m.length)+"-"+d.substring(d.length-2,d.length)+' '+h.substring(h.length-2,h.length)+':'+mi.substring(mi.length-2,mi.length);

          }
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
          this.$http({
            url:this.$store.state.appbackUrl+config.JIMRegist+'?userId='+this.userId
          }).then((res)=> {
            if(res.data.status==200){
              this.siginInJM(res.data.data);
              this.userName = res.data.data;
            }
            else {
              this.isLoading=0;
              // this.$message({
              //   message: res.data.message,
              //   type: 'warning'
              // });
            }
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
            that.isLoading = 0;
            that.JIM.onMsgReceive(function(data) {
              if(data.messages[0].msg_type!=4){
                that.getConversation()
                var userLeft = that.leftUserList;
                var username = data.messages[0].content.from_id;
                var isExistence = 0;
                for(var i=0;i<userLeft.length;i++){
                  if(username==userLeft[i].username){
                    isExistence = 1;
                    userLeft[i].dialogList.push(data.messages[0])
                    that.getUnreadMsgUpdate(i,username)
                  }
                }
                if(!isExistence){
                  data.messages[0].unread_msg_count = 1;
                  var list = {
                    avatar:data.messages[0].content.msg_body.extras.userPhoto,
                    dialogList:data.messages[0],
                    nickname:data.messages[0].content.msg_body.extras.userName,
                    time:that.fmtDate(data.messages[0].ctime_ms),
                    username:data.messages[0].from_username
                  }
                  userLeft.unshift(list)
                  that.currentAC++;
                }
                that.leftUserList = [];
                that.leftUserList = userLeft;
                if(that.currentAC!=-1){
                  that.$nextTick(function () {
                    that.scrollBottom()
                  })
                }
              }

            });
            that.JIM.onEventNotification(function(data) {
            });
            that.JIM.onSyncConversation(function(data) { //离线消息同步监听
              that.roamList = data.filter(function (item) {
                return item.msg_type!=4
              })
              that.getConversationList()
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
        // 获取会话列表
        getConversationList(){
          var that = this;
          this.JIM.getConversation().onSuccess(function(data) {
            if(data.conversations.length>0){
              data.conversations =  data.conversations.filter(function (item) {
                return item.type!=4;
              })
              data.conversations = data.conversations.reverse()
              that.leftUserList = data.conversations;
              for(var i=0;i<data.conversations.length;i++){
                data.conversations[i].time = that.fmtDate(data.conversations[i].mtime)
                that.getUserPhoto(data.conversations[i].username,i)
                data.conversations[i].roamList = that.roamList[i];
              }
              that.leftUserList = data.conversations;
              for(var j=0;j<that.leftUserList.length;j++){
                for(var m=0;m<that.roamList.length;m++){
                  if(that.leftUserList[j].username==that.roamList[m].from_username){
                    that.leftUserList[j].dialogList = that.roamList[m].msgs;
                    for(var k = 0;k<that.leftUserList[j].dialogList.length;k++){
                      that.leftUserList[j].dialogList[k].time = that.fmtDate(that.leftUserList[j].dialogList[k].ctime_ms)
                    }
                  }
                }
              }

            }
            // console.log(that.leftUserList)
          }).onFail(function(data) {
            // console.log('error:' + JSON.stringify(data));

          });
        },
        //获取用户信息
        getUserPhoto(username,i){
          var that = this;
          this.JIM.getUserInfo({
            'username' : username,
            'appkey' : that.appKey
          }).onSuccess(function (res) {
            // console.log(res.user_info.extras)
            if(res.user_info.extras&&res.user_info.extras.imgurl){
              that.leftUserList[i].avatar = res.user_info.extras.imgurl;
            }
            else {
              that.leftUserList[i].avatar='../../static/images/default_head.png'
            }
          })

        },
        // 获取会话未读数
        getUnreadMsgUpdate(i,username){
          this.leftUserList[i].unread_msg_count =   this.JIM.getUnreadMsgCnt({
            'username' : username
          })
        },
        //重置会话未读数
        resetUnreadCount(username){
          this.JIM.resetUnreadCount({'username':username});
        },
        //获取会话未读数
        getConversation() {
          var that = this;
          this.JIM.getConversation().onSuccess(function (data) {
            var total = 0;
            for(var i=0;i<data.conversations.length;i++){
              total+=data.conversations[i].unread_msg_count;
            }
            eventBus.$emit('unread',total)
          })

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
          // 发送消息
          var that = this;
          var targetName = this.currentDialogUser.username;
          that.JIM.sendSingleMsg({
            'target_username' : targetName,
            'appkey' :  that.appKey,
            'content' : that.textareaWord,
            'no_offline' : false,
            'no_notification' : false,
            //'custom_notification':{'enabled':true,'title':'title','alert':'alert','at_prefix':'atprefix'}
            need_receipt:true
          }).onSuccess(function(data,msg) {

            // var date = new Date();
            // var H = '0'+date.getHours();
            // var m = '0'+date.getMinutes()
            var obj = {
              content:{
                from_id:that.userName,
                msg_body:{
                  text:that.textareaWord,
                }
              },
              // time:H.substring(H.length-2,H.length)+':'+m.substring(m.length-2,m.length)
              time:''
            }
            that.leftUserList[that.currentAC].dialogList.push(obj)
            that.textareaWord='';
            that.$nextTick(function () {
              that.scrollBottom()
            })

          }).onFail(function(data) {
            // console.log('error:' + JSON.stringify(data));
          });
        },
        // 获取用户信息
        getUserInfo(){
          this.userId = this.$store.state.userInfo.appbackId
          // this.userId='e795767b545a4efaa4602c4025422ab5'
          this.userPhoto = this.$store.state.userInfo.portrait||'../../static/images/default_head.png'
          this.siginUpJM()
        },
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
  .no-dialog{
    position: absolute;
    left: 0;
    top: 0;
    background-color: #f4f5f7;
    width: 100%;
    height: 100%;
    line-height: 600px;
    text-align: center;
    color: #999999;
    font-size: 16px;
    overflow: hidden;
  }
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
  li{
    list-style: none;
  }
.dialog{
  width: 940px;
  /*height: 600px;*/
  box-sizing: border-box;
  border: 1px solid #e6e6e6;
  /*margin: 10px 40px;*/
  position: relative;
}
  .dialog .left{
    width: 280px;
    float: left;
    background-color: #ffffff;
    overflow-x: hidden;
    overflow-y: auto;
    box-sizing: border-box;
    border-right: 1px solid #e3e4e6;
  }
  .left li{
    overflow: hidden;
    width: 100%;
    height: 72px;
    box-sizing: border-box;
    padding: 15px 10px 0;
    cursor: pointer;
  }
  .left .head{
    width: 40px;
    height: 40px;
    float: left;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    position: relative;
  }
  .left .head img{
    display: block;
    width: 100%;
    height: 100%;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    object-fit: cover;
  }
  .left  .num{
    position: absolute;
    color: #fff;
    bottom: 2px;
    right: 0px;
    width: 16px;
    font-size: 10px;
    height: 16px;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    background-color: #ff353a;
    text-align: center;
    line-height: 16px;
  }
  .left .info{
    width: 200px;
    float: right;
    height: 40px;
    position: relative;
  }
  .left .info-top{
    width: 100%;
    overflow: hidden;
  }
  .left .name{
    width: 95px;
    float: left;
    font-size: 14px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .left .des{
    font-size: 12px;
    color: #909193;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-top: 3px;
    box-sizing: border-box;
    padding-right: 20px;
  }
  .left .time{
    float: right;
    font-size: 12px;
    color: #a9aaae;
    text-align: right;
  }
  .left li.ac{
    background-color: #f4f5f9;
  }
  .right{
    float: right;
    width: 658px;
    background-color: #f4f5f7;
  }
  .right .dialog-box{
    width: 100%;
    height: 358px;
    box-sizing: border-box;
    border-bottom: 1px solid #e8e9eb;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 0 20px;
  }
  .right .right-item>.title{
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    width: 100%;
    box-sizing: border-box;
    padding: 0 25px;
  }
  .right .right-item>.title span{
    font-size: 16px;
    font-weight: bold;
  }
  .see-all{
    width: 150px;
    height: 30px;
    margin: 10px auto;
    text-align: center;
    font-size: 12px;
    color: #9b9b9b;
    line-height: 26px;
    border: 2px solid #dbdbdb;
    background-color: #fefefe;
    border-right-color: #8e8e8e;
    border-bottom-color: #8e8e8e;
    cursor: pointer;
  }
  .send-area{
    width: 100%;
    box-sizing: border-box;
    height: 140px;
    padding: 0 30px;
  }
  .send-area textarea{
    display: block;
    width: 100%;
    box-sizing: border-box;
    outline: none;
    padding: 20px;
    font-size: 14px;
    line-height: 1.4;
    height: 100px;
    resize: none;
    background: none;
    border: none;
  }
  .send-area .btn{
    text-align: right;
    line-height: 40px;
  }
  .send-area .btn span{
    display: inline-block;
    width: 80px;
    height: 30px;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
    text-align: center;
    font-size: 14px;
    line-height: 30px;
    background-color: #ff353a;
    color: #ffffff;
    cursor: pointer;
  }
  .right .item{
    overflow: hidden;
    padding: 15px 0;
  }
  .right .head{
    width: 40px;
    height: 40px;
    border: 1px solid #ffffff;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    overflow: hidden;
    float: left;
  }
  .right .head img{
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .right .time{
    text-align: center;
    font-size: 12px;
    color: #939496;
  }
  .right .des{
    min-height: 20px;
    padding: 10px 15px;
    line-height: 1.4;
    font-size: 12px;
    max-width: 300px;
    float: left;
    margin-left: 13px;
    background-color: #ffffff;
    border-top-right-radius: 10px;
    -webkit-border-top-right-radius: 10px;
    -webkit-border-bottom-left-radius: 10px;
    border-bottom-left-radius: 10px;
    -webkit-box-shadow: 0 2px 10px rgba(0, 0, 0, .2);
    -moz-box-shadow: 0 2px 10px rgba(0, 0, 0, .2);
    box-shadow: 0 2px 10px rgba(0, 0, 0, .2);
  }
  .right .me .time{
    float: right;
    text-align: right;
    margin-right: 10px;
  }
  .right .it .time{
    float: left;
    text-align: left;
    margin-left: 10px;
  }
  .right .me .head{
    float: right;
  }
  .right .me .des{
    margin-left: 0;
    margin-right: 13px;
    float: right;
    background-color: #5ca4f8;
    color: #ffffff;
    -webkit-box-shadow: 0 2px 10px rgba(92, 164, 248, .2);
    -moz-box-shadow: 0 2px 10px rgba(92, 164, 248, .2);
    box-shadow: 0 2px 10px rgba(92, 164, 248, .2);
  }
</style>
