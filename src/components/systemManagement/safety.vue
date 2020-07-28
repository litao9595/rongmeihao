<template>
    <div class="safety">
      <div class="top">
        <div class="data safe">
          <h2>100</h2>
          <p>账号安全</p>
        </div>
        <!--<div class="des">您的账号存在安全风险，建议优化以下1项</div>-->
        <ul>
          <li>
            <div class="left">
              <i :class="tel?'el-icon-success':'el-icon-warning warning'"></i>
              绑定手机
            </div>
            <div class="middle">{{tel?'当前已绑定':'未绑定手机号'}}</div>
            <div class="right" @click="changeTel2">{{tel?'更换手机':'绑定手机'}}</div>
          </li>
          <!--<li>-->
            <!--<div class="left">-->
              <!--<i class="el-icon-warning warning"></i>-->
              <!--登录密码-->
            <!--</div>-->
            <!--<div class="middle">上次修改时间：2019.04.16</div>-->
            <!--<div class="right">修改</div>-->
          <!--</li>-->
          <!--<li>-->
            <!--<div class="left">-->
              <!--<i class="el-icon-warning error"></i>-->
              <!--开启可信校验-->
            <!--</div>-->
            <!--<div class="middle">开启后，非可信设备登录需验证手机号</div>-->
            <!--<div class="right">开启</div>-->
          <!--</li>-->
        </ul>
      </div>
      <div class="bottom">
        <div class="subnav">
          <div :class="subnavIndex==0?'ac':''"  @click="changeSubnav(0)">登录记录</div>
          <div :class="subnavIndex==1?'ac':''" @click="changeSubnav(1)">敏感操作</div>
        </div>
        <div class="table">
          <el-table
            v-show="subnavIndex==0"
            :data="tableData"
            stripe
            style="width: 100%">
            <el-table-column
              prop="logTime"
              label="登录时间"
              >
            </el-table-column>
            <!--<el-table-column-->
              <!--prop="ip"-->
              <!--label="IP地址"-->
              <!--width="180">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop="device"-->
              <!--label="设备">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop="deviceName"-->
              <!--label="设备名称">-->
            <!--</el-table-column>-->
            <el-table-column
              prop="platform"
              label="平台">
            </el-table-column>
            <el-table-column
              prop="loginType"
              width="200"
              label="登录方式">
            </el-table-column>
          </el-table>
          <el-table
            :data="tableData"
            v-show="subnavIndex==1"
            stripe
            style="width: 100%">
            <el-table-column
              prop="logTime"
              label="登录时间"
             >
            </el-table-column>
            <el-table-column
              prop="ip"
              label="IP地址"
              >
            </el-table-column>
            <el-table-column
              prop="device"
              label="设备">
            </el-table-column>
            <el-table-column
              prop="loginType"
              label="操作类型">
            </el-table-column>
          </el-table>
          <el-pagination
            style="text-align: center;margin-top: 25px;"
            background
            @current-change="handleCurrentChange"
            layout="prev, pager, next"
            :total="total">
          </el-pagination>
        </div>
      </div>
      <div class="alert-change" v-show="isChangeTel">
        <div class="box">
          <div class="first-step" v-show="isChange">
            <div class="title">{{tel?'手机号修改':'绑定手机号'}} <span @click="closeChangeTel"><i class="el-icon-close"></i></span></div>
            <div class="des">
              <div class="label">原手机号</div>
              <div class="right">{{tel}} &nbsp;&nbsp;
                <!--无法接收通知？ <span>点击申述</span>-->
              </div>
            </div>
            <div class="des">
              <div class="label">手机验证码</div>
              <div class="input right">
                <input type="text" id="codeInput" v-model="code" maxlength="6">
                <button id="getCode" @click="getCode">获取验证码</button>
              </div>
            </div>
            <div class="next" id="next"  :class="code.length>0?'finish':''" @click="finishGetCode">下一步</div>
          </div>
          <div class="second-step" v-show="isBind">
            <div class="title">手机号验证<span @click="closeChangeTel"><i class="el-icon-close"></i></span></div>
            <div class="des">
              <div class="label">新手机号</div>
              <div class="right"><input type="text" v-model="newMobile" id="telInput2"></div>
            </div>
            <div class="des">
              <div class="label">手机验证码</div>
              <div class="input right">
                <input type="text" v-model="code2" maxlength="6" id="codeInput2">
                <button  @click="getCode2" id="aginGetCode">获取验证码</button>
              </div>
            </div>
            <div class="next"  :class="code.length>0?'finish':''" @click="submitCode">提交</div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  import {config} from "../../router/httpConfig";
  import {mapMutations} from 'vuex'

    export default {
        name: "",
      data(){
          return{
            timer:null,
            timer2:null,
            isChange:1,
            isBind:0,
            tel:'',
            currentGetLogUrl:config.logingLog,
            isChangeTel:0,
            subnavIndex:0,
            newMobile:'',
            total:0,
            code:'',//验证码
            code2:'',
            // timer:'',
            tableData: []
          }
      },
      methods:{
        ...mapMutations(['changeTel']),
        // 获取用户信息
        getUserInfo(){
          this.tel = this.$store.state.userInfo.smobile;
        },
        //原手机号获取验证码
        getCode(){
          this.$http({
            url:config.oldMobileGetCodeUrl,
          }).then((res)=> {
          }).catch((err)=>{
          })
          var time = 59;
          $('#getCode').attr('disabled',true)
          $('#getCode').text('重新获取'+time+"秒")
          this.timer =  setInterval( () => {
            time--;
            if(time==0){
              $('#getCode').attr('disabled',false)
              $('#getCode').text('获取验证码')
              clearInterval(this.timer)
            }
            else {
              $('#getCode').text('重新获取'+time+"秒")
            }
          },1000)
        },
        // 新手机号获取验证码
        getCode2(){
          if(this.newMobile==''||!(/^1[345789]\d{9}$/.test(this.newMobile))){
            this.$message.error('请输入正确的手机号！');
            return false
          }
          var time = 59;
          $('#aginGetCode').attr('disabled',true)
          $('#aginGetCode').text('重新获取'+time+"秒")
          this.timer2 =  setInterval( () => {
            time--;
            if(time==0){
              $('#aginGetCode').attr('disabled',false)
              $('#aginGetCode').text('获取验证码')
              clearInterval(this.timer2)
            }
            else {
              $('#aginGetCode').text('重新获取'+time+"秒")
            }
          },1000)
          this.$http({
            url:config.oldMobileGetCodeUrl+'?mobile='+this.newMobile
          }).then((res)=> {
            if(res.data.status==200){

            }
            else {
              clearInterval(this.timer2)
              $('#aginGetCode').attr('disabled',false)
              $('#aginGetCode').text('获取验证码')
              this.$message.error(res.data.message);
            }
          }).catch((err)=>{
          })

        },
        changeTel2(){
          this.isChangeTel = 1;
        },
        finishGetCode(){
          if(this.code==''){
            $('#codeInput').css('border','1px solid red')
            $('#codeInput').focus()
            return false
          }
          this.$http({
            url:config.judegOldMobileUrl+'?code='+this.code,
          }).then((res)=> {
            if(res.data.status==200){
              clearInterval(this.timer)
              this.isChange = 0;
              this.isBind = 1;
            }
          else {
              this.$message.error(res.data.message);
            }
          }).catch((err)=>{
          })
        },
        submitCode(){
          if(this.code==''){
            $('#codeInput2').css('border','1px solid red')
            $('#codeInput2').focus()
            return false
          }
          this.$http({
            url:config.newMobileBind+'/'+this.newMobile+'?code='+this.code2,
          }).then((res)=> {
            if(res.data.status==200){
              this.$message({
                message: res.data.message,
                type: 'success'
              });
              this.changeTel(this.newMobile)
              this.tel = this.newMobile;
            }
            else {
              this.$message.error(res.data.message);
            }
            this.closeChangeTel()
          }).catch((err)=>{
          })
        },
        closeChangeTel(){
          this.code = '';
          this.code2='';
          this.newMobile = '';
          this.isChangeTel = 0;
          this.isChange = 1;
          this.isBind = 0;
          clearInterval(this.timer)
          clearInterval(this.timer2)
          $('#codeInput').css('border','1px solid #bfbfbf')
          $('#getCode').attr('disabled',false)
          $('#getCode').text('获取验证码')
          $('#codeInput2').css('border','1px solid #bfbfbf')
          $('#getCode').attr('disabled',false)
          $('#aginGetCode').text('获取验证码')
        },
        changeSubnav(index){
          this.subnavIndex = index;
          if(index==0){
            this.currentGetLogUrl = config.logingLog;
          }
          else {
            this.currentGetLogUrl = config.sensitiveLog;
          }
          this.getLogList(0)
        },
        getLogList(page){
          this.$http({
            url:this.currentGetLogUrl+'?pageSize=10&page='+page
          }).then((res)=> {
            this.total = res.data.data.records;
            this.tableData = res.data.data.rows;
          }).catch((err)=>{
          })
        },
        handleCurrentChange(val){
          this.getLogList(val)
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
          this.getLogList(0)
      }
    }
</script>

<style scoped>
  .top{
    overflow: hidden;
    background-color: #fff;
    padding-bottom: 45px;
  }
.data.safe{
  width: 147px;
  height: 173px;
  background: url("../../../static/images/icon/anquan100.png");
  background-size: 100% 100%;
  text-align: center;
  color: #fff;
  overflow: hidden;
  margin: 27px auto 0;
}
.data.gaowei{
  background: url("../../../static/images/icon/gaowei.png");
  background-size: 100% 100%;
}
  .data h2{
    font-size: 44px;
    margin-top: 45px;
  }
  .data p{
    font-size: 14px;
    margin-top: 10px;
  }
  .top .des{
    margin-top: 6px;
    font-size: 16px;
    text-align: center;
    color: #222222;
  }
  .top ul{
    width: 588px;
    margin: 20px auto 0;
    border-top: 1px solid #bfbfbf;
  }
  .top li{
    list-style: none;
    height: 51px;
    border-bottom: 1px solid #bfbfbf;
  }
  .top .left,.top .middle,.top .right{
    box-sizing: border-box;
    float: left;
    line-height: 51px;
    font-size: 14px;
    color: #666666;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .top .left{
    width: 35%;
    color: #111111;
  }
  .top .left i{
    margin-right: 4px;
  }
  .top .left .el-icon-success{
    color: #34c765;
  }
  .top .left .warning{
    color: #fea904;
  }
  .top .left .error{
    color: #fe6667;
  }
  .top .middle{
    width: 49%;
  }
  .top .right{
    text-align: right;
    width: 16%;
    padding-right: 13px;
    color: #5990F2;
    cursor: pointer;
  }
  .bottom{
    margin-top: 32px;
    background-color: #fff;
    padding-bottom: 30px;
  }
  .bottom .subnav{
    padding-top: 25px;
    line-height: 46px;
    font-size: 16px;
    color: #222222;
    overflow: hidden;

    box-sizing: border-box;
    border-bottom: 1px solid #bfbfbf;
  }
  .bottom .subnav div{
    float: left;
    margin: 0 40px;
    padding: 0 10px 0;
    cursor: pointer;
    border-bottom: 3px solid transparent;
  }
  .bottom .subnav .ac{
    color: #ff353a;
    border-bottom: 3px solid #ff353a;
  }
  .bottom .table{
    padding: 0 43px;
    margin: 17px 0 10px;
  }
  .el-table th{
    background-color: #f4f5f6;
  }
  .alert-change{
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    background-color: rgba(0,0,0,.4);
    z-index: 9999999;
  }
  .alert-change .box{
    width: 415px;
    height: 240px;
    box-sizing: border-box;
    background-color: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%,-50%);
    -moz-transform: translate(-50%,-50%);
    -ms-transform: translate(-50%,-50%);
    -o-transform: translate(-50%,-50%);
    transform: translate(-50%,-50%);
    overflow: hidden;
  }
  .alert-change .title{
    width: 100%;
    height: 50px;
    background-color: #f5f5f5;
    line-height: 50px;
    box-sizing: border-box;
    padding-left: 20px;
  }
  .alert-change .title span{
    float: right;
    display: block;
    cursor: pointer;
    width: 50px;
    text-align: center;
    height: 50px;
  }
  .alert-change .des{
    overflow: hidden;
    padding: 0 20px;
    margin-top: 10px;
  }
  .alert-change .des span{
    color: #5990f2;
    cursor: pointer;
  }
  .alert-change .label{
    text-align: right;
    width: 75px;
    line-height: 40px;
    font-size: 13px;
    float: left;
  }
  .alert-change .right{
    float: left;
    line-height: 40px;
    margin-left: 10px;
    font-size: 13px;
  }
  .alert-change input{
    height: 36px;
    outline: none;
    border:  1px solid #bfbfbf;
  }
  .alert-change button{
    width: 100px;
    text-align: center;
    height: 30px;
    cursor: pointer;
    font-size: 12px;
    border: 1px solid #e8e8e8;
    background-color: #f9f9f9;
    /*padding: 0 5px;*/
  }
  .alert-change .next{
    width: 120px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    font-size: 14px;
    margin: 20px auto;
    background:#eee;
    cursor: pointer;
  }
  .alert-change .finish{
    background-color: #ff353a;
    color: #fff;
  }
</style>
