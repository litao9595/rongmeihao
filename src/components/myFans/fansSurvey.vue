<template>
    <div class="fansSurvey" id="fansSurvey">
      <!--<ul class="section1">-->
        <!--<li>-->
          <!--<p>粉丝数</p>-->
          <!--<h2>54</h2>-->
          <!--<p>昨日净增：28</p>-->
        <!--</li>-->
        <!--<li>-->
          <!--<p>粉丝月度累计阅读数</p>-->
          <!--<h2>5489</h2>-->
          <!--<p>阅读累计阅读数：4841</p>-->
        <!--</li>-->
        <!--<li>-->
          <!--<p>月度粉丝收益</p>-->
          <!--<h2>859元</h2>-->
          <!--<p>阅读累计收益：7417元</p>-->
        <!--</li>-->
      <!--</ul>-->
      <div class="quota">
        <div class="quota-header">
          <div class="left">昨日关键指标</div>
          <div class="right">
            <el-tooltip class="item" effect="light" placement="bottom-end">
              <div slot="content">
                <p>新关注人数</p>
                <p>新关注的去重用户数</p>
                <p>取消关注人数</p>
                <p>取消关注的去重用户数</p>
                <p>净增关注人数</p>
                <p>净增长的去重关注用户数</p>
                <p>累积关注人数</p>
                <p>当前关注的用户总数</p>
              </div>
              <i class="el-icon-question"></i>
            </el-tooltip>
          </div>
        </div>
        <ul class="quota-body">
          <li>
            <div class="info">
              <p>新关注人数</p>
              <h2>{{target.item1}}</h2>
              <!--<div>日<i></i>&#45;&#45;</div>-->
              <!--<div>周<i class="down"></i>100%</div>-->
              <!--<div>月<i class="down"></i>100%</div>-->
            </div>
          </li>
          <li>
            <div class="info">
              <p>取消关注人数</p>
              <h2>{{target.item2}}</h2>
              <!--<div>日<i></i>&#45;&#45;</div>-->
              <!--<div>周<i class="down"></i>100%</div>-->
              <!--<div>月<i  class="down"></i>100%</div>-->
            </div>
          </li>
          <li>
            <div class="info">
              <p>净增关注人数</p>
              <h2>{{target.item4}}</h2>
              <!--<div>日 <i></i>&#45;&#45;</div>-->
              <!--<div>周 <i  class="down"></i>100%</div>-->
              <!--<div>月 <i  class="down"></i>100%</div>-->
            </div>
          </li>
          <li>
            <div class="info">
              <p>累积关注人数</p>
              <h2>{{target.item3}}</h2>
              <!--<div>日<i></i>&#45;&#45;</div>-->
              <!--<div>周<i class="up"></i>100%</div>-->
              <!--<div>月<i class="up"></i>12.5%</div>-->
            </div>
          </li>
        </ul>
      </div>
      <div class="section2" v-show="fansRank.length>0">
        <h2>互动排行榜 <span v-show="fansRank.length>5" @click="seeAllList">查看完整榜单</span></h2>
        <ul>
          <li v-for="(item,index) in fansRank">
            <div>
              <div class="head" :class="index==0?'no1':''||index==1?'no2':''||index==2?'no3':''" >
                <img :src="item.photo?item.photo:'../static/default_head.png'" alt="">
                <p>NO.{{index+1}}</p>
              </div>
              <div class="name">{{item.nickName}}</div>
              <div class="num">互动数{{item.count}}</div>
              <div class="bar">
                <span class="sx" @click="toDialog(item.id,index)"><i class="el-icon-message"></i>私信</span>
                <span class="gz" v-show="item.followedByMe=='0'" @click="toFouces(item.userId,index)"><i class="el-icon-plus"></i>关注</span>
                <span class="gz"  v-show="item.followedByMe!='0'" @click="toFouces(item.userId,index)"><i class="el-icon-check"></i>已关注</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="section3">
        <div class="subnav">
          <div :class="subnavIndex==1?'ac':''" @click="changeSubnav(1,'新增粉丝')">新增粉丝</div>
          <div :class="subnavIndex==2?'ac':''" @click="changeSubnav(2,'取消关注')">取消关注</div>
          <div :class="subnavIndex==3?'ac':''" @click="changeSubnav(3,'净增粉丝')">净增粉丝</div>
          <div :class="subnavIndex==4?'ac':''" @click="changeSubnav(4,'累计粉丝')">累计粉丝</div>
        </div>
        <div class="filter-bar">
          <!--<div class="group">-->
            <!--<div :class="thirdnavIndex==7?'ac':''" @click="changeFilterNav(7)">7天</div>-->
            <!--<div :class="thirdnavIndex==14?'ac':''" @click="changeFilterNav(14)">14天</div>-->
            <!--<div :class="thirdnavIndex==30?'ac':''" @click="changeFilterNav(30)">30天</div>-->
          <!--</div>-->
          <el-date-picker
            v-model="timeRange"
            type="daterange"
            align="right"
            unlink-panels
            @change="changeRangeDate"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions2">
          </el-date-picker>
        </div>
        <div class="charts">
          <div id="chart"></div>
        </div>
      </div>
      <!--<div class="section4">-->
        <!--<h2>数据列表-->
          <!--&lt;!&ndash;<a href="">到处Excel</a>&ndash;&gt;-->
        <!--</h2>-->
        <!--<el-table-->
          <!--:data="tableData"-->
          <!--stripe-->
          <!--style="width: 100%">-->
          <!--<el-table-column-->
            <!--prop="date"-->
            <!--label="时间"-->
            <!--&gt;-->
          <!--</el-table-column>-->
          <!--<el-table-column-->
            <!--prop="data1"-->
            <!--label="新增粉丝"-->
            <!--&gt;-->
          <!--</el-table-column>-->
          <!--<el-table-column-->
            <!--prop="data2"-->
            <!--label="取消关注">-->
          <!--</el-table-column>-->
          <!--<el-table-column-->
            <!--prop="data3"-->
            <!--label="净增粉丝">-->
          <!--</el-table-column>-->
          <!--<el-table-column-->
            <!--prop="data4"-->
            <!--label="累计粉丝">-->
          <!--</el-table-column>-->
        <!--</el-table>-->
        <!--&lt;!&ndash;<el-pagination&ndash;&gt;-->
          <!--&lt;!&ndash;style="text-align: center;margin-top: 25px;"&ndash;&gt;-->
          <!--&lt;!&ndash;background&ndash;&gt;-->
          <!--&lt;!&ndash;@current-change="handleCurrentChange"&ndash;&gt;-->
          <!--&lt;!&ndash;layout="prev, pager, next"&ndash;&gt;-->
          <!--&lt;!&ndash;:total="total">&ndash;&gt;-->
        <!--&lt;!&ndash;</el-pagination>&ndash;&gt;-->
      <!--</div>-->
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
  Date.prototype.format = function() {
    var s = '';
    var mouth = (this.getMonth() + 1)>=10?(this.getMonth() + 1):('0'+(this.getMonth() + 1));
    var day = this.getDate()>=10?this.getDate():('0'+this.getDate());
    s += this.getFullYear() + '-'; // 获取年份。
    s += mouth + "-"; // 获取月份。
    s += day; // 获取日。
    return (s); // 返回日期。
  };
    export default {
        name: "",
      data(){
          return{
            isLoading:0,
            pickerOptions2: {
              shortcuts: [{
                text: '最近一周',
                onClick(picker) {
                  const end = new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 1);
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                  picker.$emit('pick', [start, end]);
                }
              },{
                text: '最近15天',
                onClick(picker) {
                  const end = new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 1);
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 15);
                  picker.$emit('pick', [start, end]);
                }
              }, {
                text: '最近30天',
                onClick(picker) {
                  const end = new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 1);
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                  picker.$emit('pick', [start, end]);
                }
              }]
            },
            target:{
              item1:0,
              item2:0,
              item3:0,
              item4:0
            },
            showWaiting:0,
            JIM:new JMessage(),
            isDialog:0,
            total:100,
            currentIndex:0,
            currentWordNum:0,
            textareaWord:'',
            currentName:'',
            thirdnavIndex:0,
            subnavIndex:1,
            timeRange:[ (new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7)),(new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 1))],
            appbackUrl:localStorage.appbackUrl,//两微一端路径
            userId:'',
            currentDes:'新增粉丝',
            fansRank:[],
            lineData:[120, 132, 101, 134, 90, 230, 210],
            chartX:[],
            chartY:[],
            tableData:[],
            appKey:''
          }
      },
      methods:{
          getTableData(){
            var that = this;
            this.$http({
              url:this.appbackUrl+config.userFansStatistic+'?userId='+this.userId+'&type=1'+'&fromDate='+this.timeRange[0].getFullYear()+'-'+this.addZero(this.timeRange[0].getMonth()+1)+'-'+this.addZero(this.timeRange[0].getDate())+'&toDate='+this.timeRange[1].getFullYear()+'-'+this.addZero(this.timeRange[1].getMonth()+1)+'-'+this.addZero(this.timeRange[1].getDate())
            }).then((res1)=> {
              this.$http({
                url:this.appbackUrl+config.userFansStatistic+'?userId='+this.userId+'&type=2'+'&fromDate='+this.timeRange[0].getFullYear()+'-'+this.addZero(this.timeRange[0].getMonth()+1)+'-'+this.addZero(this.timeRange[0].getDate())+'&toDate='+this.timeRange[1].getFullYear()+'-'+this.addZero(this.timeRange[1].getMonth()+1)+'-'+this.addZero(this.timeRange[1].getDate())
              }).then((res2)=> {
                this.$http({
                  url:this.appbackUrl+config.userFansStatistic+'?userId='+this.userId+'&type=3'+'&fromDate='+this.timeRange[0].getFullYear()+'-'+this.addZero(this.timeRange[0].getMonth()+1)+'-'+this.addZero(this.timeRange[0].getDate())+'&toDate='+this.timeRange[1].getFullYear()+'-'+this.addZero(this.timeRange[1].getMonth()+1)+'-'+this.addZero(this.timeRange[1].getDate())
                }).then((res3)=> {
                  this.$http({
                    url:this.appbackUrl+config.userFansStatistic+'?userId='+this.userId+'&type=4'+'&fromDate='+this.timeRange[0].getFullYear()+'-'+this.addZero(this.timeRange[0].getMonth()+1)+'-'+this.addZero(this.timeRange[0].getDate())+'&toDate='+this.timeRange[1].getFullYear()+'-'+this.addZero(this.timeRange[1].getMonth()+1)+'-'+this.addZero(this.timeRange[1].getDate())
                  }).then((res4)=> {
                    that.tableData = [];
                   for(var i=0;i<that.chartX.length;i++){
                     var obj = {
                       id:i,
                       date:this.chartX[i],
                       data1:res1.data.data[i].count,
                       data2:res2.data.data[i].count,
                       data3:res3.data.data[i].count,
                       data4:res4.data.data[i].count
                     };
                     that.tableData.push(obj)
                   }
                  }).catch((err)=>{
                  })
                }).catch((err)=>{
                })
              }).catch((err)=>{
              })
            }).catch((err)=>{
            })

          },
        changeRangeDate(){
          var days = this.datedifference(this.timeRange[0].getFullYear()+'-'+(this.timeRange[0].getMonth()+1)+'-'+this.timeRange[0].getDate(),this.timeRange[1].getFullYear()+'-'+(this.timeRange[1].getMonth()+1)+'-'+this.timeRange[1].getDate())
          this.chartX = days;
          this.getuserFansStatistic()
          this.getTableData()
        },
        // 两个时间相差天数
        datedifference(begin, end) {    //sDate1和sDate2是2006-12-18格式
          var arr = [];
          var ab = begin.split("-");
          var ae = end.split("-");
          var db = new Date();
          db.setUTCFullYear(ab[0], ab[1] - 1, ab[2]);
          var de = new Date();
          de.setUTCFullYear(ae[0], ae[1] - 1, ae[2]);
          var unixDb = db.getTime() - 24 * 60 * 60 * 1000;
          var unixDe = de.getTime() - 24 * 60 * 60 * 1000;
          for (var k = unixDb; k <= unixDe;) {
            k = k + 24 * 60 * 60 * 1000;
            arr.push((new Date(parseInt(k))).format());
          }
          return arr;
        },
        addZero(val){
          if(val<10){
            val = '0'+val
          }
          return val
        },
        //粉丝关注
        toFouces(id,index){
          this.isLoading=1;
          var attentType =  this.fansRank[index].followedByMe=='0'?1:2
          this.$http({
            url:this.appbackUrl+config.fansAttentionUser+'?userId='+this.userId+'&attentUserId='+id+'&attentType='+attentType
          }).then((res)=> {
            if(res.data.status==200){
              this.isLoading=0;
              this.fansRank[index].followedByMe=='1'?this.fansRank[index].followedByMe='0':this.fansRank[index].followedByMe='1'
              if(this.fansRank[index].followedByMe=='1'){
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
              this.$message.error(res.data.message);
            }
          }).catch((err)=>{
          })
        },
        //获取时间段内用户粉丝统计
        getuserFansStatistic(){
          this.$http({
            url:this.appbackUrl+config.userFansStatistic+'?userId='+this.userId+'&type='+this.subnavIndex+'&fromDate='+this.timeRange[0].getFullYear()+'-'+this.addZero(this.timeRange[0].getMonth()+1)+'-'+this.addZero(this.timeRange[0].getDate())+'&toDate='+this.timeRange[1].getFullYear()+'-'+this.addZero(this.timeRange[1].getMonth()+1)+'-'+this.addZero(this.timeRange[1].getDate())
          }).then((res)=> {
            var data = []
            for(var i=0;i<res.data.data.length;i++){
              data.push(res.data.data[i].count)
            }
            this.chartY = data;
            this.drawChart()
          }).catch((err)=>{
          })
        },
          //获取昨日指标
        getTarget(){
          this.$http({
            url:this.appbackUrl+config.fansIncrease+'?userId='+this.userId
          }).then((res)=> {
            for(var i=0;i<res.data.data.length;i++){
              if(res.data.data[i].item=='1'){
                this.target.item1 = res.data.data[i].count
              }
              else if(res.data.data[i].item==2){
                this.target.item2 = res.data.data[i].count
              }
              else if(res.data.data[i].item==3){
                this.target.item3 = res.data.data[i].count
              }

            }
            this.target.item4 = this.target.item3-this.target.item2
          }).catch((err)=>{
          })
        },
        toDialog(id,index){
          this.currentIndex = index;
          // this.sendMsgJM(index)
          this.currentName = this.fansRank[index].nickName;
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
            });
          }).catch((err)=>{
          })
        },
        // 注册极光
        registerJM(){
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
            that.JIM.onMsgReceive(function(data) {
              data = JSON.stringify(data);
              // console.log('1msg_receive:' + data);
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
              appendToDashboard(data);
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
          var targetName = this.fansList[this.currentIndex ].id;
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
          this.userId = this.$store.state.userInfo.appbackId;
          this.getuserFansStatistic()
          this.getFansRank()
          this.getTarget()
          this.siginUpJM()
        },
          //互动排行榜
        getFansRank(){
          this.$http({
            url:this.appbackUrl+config.fansRankUrl+'?userId='+this.userId
          }).then((res)=> {
            this.fansRank = res.data.data.rows.slice(0,5)
          }).catch((err)=>{
          })
        },
        seeAllList(){
          this.$router.push({
            path: `/fansRank`,
          })
        },
        handleCurrentChange(){},
        changeSubnav(flag,des){
          this.subnavIndex = flag;
          this.currentDes = des;
          this.getuserFansStatistic()
        },
        changeFilterNav(flag){
          this.thirdnavIndex = flag;
          this.lineData = [123, 2, 12, 35, 87, 43, 23];
          this.drawChart()
        },
        drawChart(){
          // 基于准备好的dom，初始化echarts实例
          let myChart = this.$echarts.init(document.getElementById('chart'))
// 绘制图表
          myChart.setOption({
            title: {
              text: ''
            },
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              data:[this.currentDes],
              left:'center',
              top:'20'
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              top:'15%',
              containLabel: true
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: this.chartX
            },
            yAxis: {
              type: 'value'
            },
            series: [
              {
                name:this.currentDes,
                type:'line',
                data:this.chartY,
                lineStyle:{
                  color:'#ff353a'
                },
                itemStyle:{
                  color:'#ff353a'
                }
              }
            ]
          },true);
        }
      },
      beforeCreate(){

      },
      created(){
        var that = this;
        var timer = setInterval(function () {
          if(that.$store.state.userInfo.appbackId){
            that.appbackUrl = that.$store.state.appbackUrl
            clearInterval(timer)
            that.getUserInfo()
          }
        },1000)
      },
      mounted(){
          this.monitorTextarea()
        this.changeRangeDate()
        // this.drawChart()
      }
    }
</script>

<style scoped>
  .loading{
    width:100%;
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
  .quota{
    width: 100%;
    box-sizing: border-box;
    padding: 0 40px;
    margin-top: 30px;
  }
  .quota-header{
    line-height: 38px;
    height: 38px;
    padding: 0 20px;
    background-color: #f4f5f9;
    border: 1px solid #e7e7eb;
    overflow: hidden;
  }
  .quota-header .left{
    float: left;
  }
  .quota-header .right{
    float: right;
    color: #c3c3c3;
  }
  .quota-header .right p:nth-child(2n){
    color: #666666;
  }
  .quota-body{
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    border: 1px solid #e7e7eb;
    border-top:none;
  }
  .quota-body li{
    float: left;
    width: 25%;
    text-align: center;
    margin: 30px 0;
    /*height: 130px;*/
    height: 60px;
    box-sizing: border-box;
    border-right: 1px solid #e7e7eb;
  }
  .quota-body li:last-child{
    border-right: none;
  }
  .quota-body .info{
    display: inline-block;
    /*width: 100%;*/
    text-align: left;

  }
  .quota-body p{
    font-weight: 400;
    font-style: normal;
    font-size: 14px;
  }
  .quota-body h2{
    text-align: center;
    color: #676767;
    font-size: 30px;
    font-weight: normal;
  }
  .quota-body .info div{
    margin-top: 2px;
    font-size: 14px;
    line-height: 18px;
    white-space: nowrap;
  }
  .quota-body .info i{
    margin-left: 10px;
    margin-right: 5px;
  }
  .quota-body .up,.quota-body .down{
    display: inline-block;
    width: 10px;
    height: 9px;
  }
  .quota-body .up{
    background: url("../../images/up.png");
    background-size: 100% 100%;
  }
  .quota-body .down{
    background: url("../../images/down.png");
    background-size: 100% 100%;
  }
  li{
    list-style: none;
  }
.fansSurvey{
  width: 100%;
  box-sizing: border-box;
  background-color: #ffffff;
  overflow: hidden;
  color: #222222;
  padding-bottom: 40px;
}
  .section1{
    width: 100%;
    box-sizing: border-box;
    padding: 0 40px;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-justify-content: space-between;
    justify-content: space-between;
    margin: 30px 0 15px;
  }
  .section1 li{
    width: 265px;
    height: 140px;
    background-color: #f8f8f8;
    overflow: hidden;
    text-align: center;
    box-sizing: border-box;
    padding-top: 20px;
  }
  .section1 p{
    font-size: 17px;
    color: #222222;
  }
  .section1 h2{
    font-size: 22px;
    color: #222222;
    font-weight: bold;
    margin: 10px 0;
  }
  .section2{
    padding: 0 32px;
    margin-bottom: 15px;
  }
  .section2 h2{
    line-height: 47px;
    font-size: 17px;
    height: 47px;
    padding: 0 8px;
  }
  .section2 h2 span{
    float: right;
    font-size: 13px;
    color: #ff4b4f;
    cursor: pointer;
  }
  .section2 ul{
    overflow: hidden;
  }
  .section2 li{
    /*width: 20%;*/
    float: left;
    padding: 0 8px;
    box-sizing: border-box;
  }
  .section2 li>div{
    width: 158px;
    height: 206px;
    box-sizing: border-box;
    border: 1px solid #ececec;
    position: relative;
  }
  .section2 .head{
    width: 121px;
    height: 100px;
    overflow: hidden;
    background: url("../../../static/images/icon/NO.4.png");
    background-size: 100% 100%;
    margin: 15px auto 0;
  }
  .section2 .head img{
    display: block;
    width: 85px;
    height: 85px;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    margin: 2px 0 0 17px;
    object-fit: cover;
  }
  .section2 .head p{
    width: 87px;
    height: 21px;
    text-align: center;
    line-height: 21px;
    background-color: #e5e5e5;
    font-size: 11px;
    margin: -15px 0 0 16px;
    position: relative;
    z-index: 1;
  }
  .section2 .no1{
    background: url("../../../static/images/icon/no1.png");
    background-size: 100% 100%;
  }
  .section2 .no1 img{
    margin-top: 5px;
  }
  .section2 .no2{
    background: url("../../../static/images/icon/NO.2.png");
    background-size: 100% 100%;
  }
  .section2 .no3{
    background: url("../../../static/images/icon/NO.3.png");
    background-size: 100% 100%;
  }
  .section2 .no1 p{
    background-color: #ff353a;
  }
  .section2 .no2 p{
    background-color: #ff9d33;
  }
  .section2 .no3 p{
    background-color: #ffcb00;
  }
  .section2 .no1 p,.section2 .no2 p,.section2 .no3 p{
    color: #fff;
  }
  .section2 .bar{
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
    height: 33px;
    border-top: 1px solid #ececec;
    line-height: 33px;
    font-size: 12px;
    color: #8d8d8d;
    text-align: center;
  }
  .section2 .bar span{
    padding: 0 7px;
    cursor: pointer;
  }
  .section2 .bar i{
    font-size: 14px;
    margin-right: 2px;
  }
  .section2 .bar .gz{
    color: #ff4b4f;
  }
  .section2 .name{
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
  .section2 .num{
    text-align: center;
    font-size: 11px;
    color: #838383;
  }
  .section3 .subnav{
    height: 51px;
    line-height: 49px;
    font-size: 17px;
    border-bottom: 1px solid #bfbfbf;
  }
  .section3 .subnav div{
    float: left;
    margin: 0 40px;
    font-size: 16px;
    padding: 0 10px;
    cursor: pointer;
    border-bottom: 3px solid transparent;
  }
  .section3 .subnav .ac{
    color: #ff353a;
    font-weight: bold;
    border-color: #ff353a;
  }
  .section3 .filter-bar{
    height: 40px;
    margin: 23px 0 15px;
    padding: 0 40px;
  }
  .section3 .filter-bar .group{
    float: left;
    height: 40px;
    box-sizing: border-box;
    border: 1px solid #ff353a;
    border-right: none;
    margin-right: 30px;
  }
  .section3 .filter-bar .group>div{
    float: left;
    width: 86px;
    height:38px;
    color: #ff353a;
    line-height: 38px;
    text-align: center;
    font-size: 14px;
    border-right: 1px solid #ff353a;
  }
  .section3 .filter-bar .group .ac{
    background-color: #ff353a;
    color: #ffffff;
  }
  .section3 .charts{
    width: 100%;
    box-sizing: border-box;
    padding: 0 40px;
  }
  .section3 .charts div{
    width: 100%;
    box-sizing: border-box;
    height: 477px;
    border: 1px solid #bfbfbf;
  }
  .section4{
    padding: 0 40px;
    box-sizing: border-box;
  }
  .section4 h2{
    font-size: 17px;
    line-height: 71px;
    font-weight: normal;
  }
  .section4 h2 a{
    float: right;
    font-size: 13px;
    color: #6899f3;
    text-decoration: none;
    cursor: pointer;
  }
</style>
