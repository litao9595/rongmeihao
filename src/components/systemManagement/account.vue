<template>
    <div class="account" id="systemAccount">
      <div class="top">
        <div class="left">
          <img :src="this.userHeader" alt="">
          <el-upload
            v-show="isChangePersonInfo"
            class="avatar-uploader"
            :action="uploadUrl"
            name="file"
            accept="image/png,image/jpg,image/jpeg,image/gif"
            :show-file-list="false"
            :on-success="changePortrait"
          >
            <!--<img v-if="poster" :src="poster" class="avatar">-->
            <i  class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
        <div class="right">
          <!--正常状态-->
          <div class="normal" v-show="!isChangePersonInfo">
            <div class="name">
              <h3>{{userInfo.nickName}}</h3>
              <div class="remarks">{{userInfo.remarks}}</div>
            </div>
            <div class="change" @click="toChangePersonInfo">修改信息</div>
          </div>
          <!--修改信息-->
          <div class="change-info" v-show="isChangePersonInfo">
            <el-form :model="form" ref="form" >
              <el-form-item class="userName" id="userName">
                <el-input v-model="form.name" maxlength="20"></el-input>
                <p class="err">用户名不能为空！</p>
                <p>2-20个汉字，请勿使用包含特殊字符号或含有明显营销推广意图的媒体名</p>
              </el-form-item>
              <el-form-item>
                <el-input v-model="form.desc" maxlength="30"></el-input>
                <p>良好的简介内容更容易收获用户的关注</p>
                <p>填写建议：个人介绍、内容介绍</p>
              </el-form-item>
              <el-form-item>
                <el-button size='small' type="primary" @click="submitChangePersonInfo">保存</el-button>
                <el-button size='small' @click="cancelChangePersonInfo">取消</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <div class="info">
        <div class="label">账号信息</div>
        <ul>
          <!--<li>-->
            <!--<div class="left">头条号类型</div>-->
            <!--<div class="middle">{{userType}}</div>-->
            <!--<div class="right" @click="changeStyle">更改类型</div>-->
            <!--<div class="hover" v-show="showTip">-->
              <!--<div>正常号申请[修改账号类型]需要满足以下条件，红色标识的条件为未满足的条件</div>-->
              <!--<p>历史申请尚未审核完成，不支持再次申请</p>-->
              <!--<p>因历史申请被永久拒绝，无法再次提交申请</p>-->
              <!--<p>每月1-4号涉及提现问题，不支持类型变更</p>-->
              <!--<p>账号有未完成提现记录，不支持类型变更</p>-->
              <!--<p>距上次审核通过不足6个月，不支持再次申请</p>-->
              <!--<p class="err">未完成实名认证，请在[账号权限]页面点击[前往认证]，然后在客户端进行实名认证</p>-->
            <!--</div>-->
          <!--</li>-->
          <li>
            <div class="left">头条号ID</div>
            <div class="middle">{{appId}}</div>
            <!--<div class="right">更改类型</div>-->
          </li>
          <li class="code">
            <div class="left">作者二维码</div>
            <div class="middle">
              <img :src="codeUrl" alt="">
            </div>
            <div class="right" @click="downloadCode">点击下载</div>
          </li>
        </ul>
        <div class="clear"></div>
      </div>
      <div class="info">
        <div class="label">登录方式</div>
        <ul>
          <li>
            <div class="left">绑定手机</div>
            <div class="middle">{{tel}}</div>
            <div class="right" @click="changeTel"><span>如需更换，</span>请前往“安全中心”</div>
          </li>
        </ul>
        <div class="clear"></div>
      </div>
      <!--<div class="info">-->
        <!--<div class="label">运营人信息</div>-->
        <!--<ul>-->
          <!--<li>-->
            <!--<div class="left">运营人</div>-->
          <!--</li>-->
          <!--<li :style="{background:isChangeEmail?'#f1f1f1':'none',height:isChangeEmail?'140px':'50px'}"  style="overflow: hidden">-->
            <!--<div v-show="!isChangeEmail">-->
              <!--<div class="left">联系邮箱</div>-->
              <!--<div class="middle">{{email}}</div>-->
              <!--<div class="right" @click="toChangeEmail">修改邮箱</div>-->
            <!--</div>-->
            <!--<div class="change-email" v-show="isChangeEmail">-->
              <!--<div class="left"  >联系邮箱</div>-->
              <!--<div class="middle" >-->
                <!--<el-input placeholder="邮箱不能为空！" v-model="changeEmail"></el-input>-->
                <!--<div class="btn">-->
                  <!--<el-button size='small' type="primary" @click="submitChangeEmail">保存</el-button>-->
                  <!--<el-button size='small' @click="cancelChangeEmail">取消</el-button>-->
                <!--</div>-->
                <!--<div class="err">请输入正确的邮箱格式！</div>-->
              <!--</div>-->
            <!--</div>-->
          <!--</li>-->
          <!--&lt;!&ndash;<li>&ndash;&gt;-->
            <!--&lt;!&ndash;<div class="left">所在地</div>&ndash;&gt;-->
            <!--&lt;!&ndash;<div class="middle">&ndash;&gt;-->
              <!--&lt;!&ndash;无&ndash;&gt;-->
            <!--&lt;!&ndash;</div>&ndash;&gt;-->
          <!--&lt;!&ndash;</li>&ndash;&gt;-->
        <!--</ul>-->
        <!--<div class="clear"></div>-->
      <!--</div>-->
      <!--下载二维码-->
      <div v-show="isDownloadCode" class="alert-code" @click="closeAlertCode">
        <div class="box">
          <div class="main">
            <div class="left">
              <h2>尺寸（像素）</h2>
              <dl>
                <dt :class="codeSubnavIndex==0?'ac':''" @click="changeSize(0)">290*290</dt>
                <dt :class="codeSubnavIndex==1?'ac':''" @click="changeSize(1)">370*370</dt>
                <dt :class="codeSubnavIndex==2?'ac':''" @click="changeSize(2)">530*530</dt>
                <dt :class="codeSubnavIndex==3?'ac':''" @click="changeSize(3)">690*690</dt>
              </dl>
            </div>
            <div class="right">
              <img :src="codeUrl" alt="">
            </div>
          </div>
          <a :href="downloadUrl" class="button" @click="begingDownloadCode">下载</a>
        </div>
      </div>
      <div class="loading" v-show="isLoading" >
        <i class="el-icon-loading"></i>
      </div>
    </div>
</template>

<script>
import {config} from "../../router/httpConfig";
import {mapMutations} from 'vuex'
import {mapState} from 'vuex'

export default {
        name: "",
      data(){
          return{
            isLoading:0,
            userType:'',//头条号类型
            appId:'',//头条号id
            showTip:0,
            changeEmail:"",
            uploadUrl:this.$store.state.mediaAssetsUrl+config.uploadPicture,//图片上传路径
            email:'',
            tel:'',
            userHeader:'../../../static/images/default_head.png',
            isChangeEmail:0,
            isDownloadCode:0,
            codeSubnavIndex:0,
            downloadUrl:config.downloadCode,
            userName:'',
            codeUrl:'',
            descript:'',
            isChangePersonInfo:0,//是否修改个人信息
            form: {
              name: '',
              desc: ''
            }
          }
      },
  computed:{
    ...mapState({
      userInfo: state =>state.userInfo
    })
  },
      methods:{
        //增加封面图
        changePortrait(res,file){
          this.userHeader = res.data.uri;
        },
        changeStyle(){
          this.showTip==0?this.showTip = 1:this.showTip=0;
        },
          //前往安全中心修改手机号
        changeTel(){
          this.$router.push({
            path: `/systemManagement/safety`,
          })
        },
          //点击修改邮箱
        toChangeEmail(){
          this.isChangeEmail = 1;
          this.changeEmail = this.email;
        },
        cancelChangeEmail(){
          this.isChangeEmail = 0;
          $('.change-email input').css('border','1px solid #C0C4CC')
          $('.change-email .err').hide()
        },
        submitChangeEmail(){
          var re = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
          if(this.changeEmail==''){
            $('.change-email input').css('border','1px solid red')
            $('.change-email input').focus()
            return false
          }
          if(!re.test(this.changeEmail)){
            $('.change-email input').css('border','1px solid red')
            $('.change-email input').focus()
            $('.change-email .err').show()
            return  false
          }
          this.$http({
            url:config.changeEmail+'?email='+this.changeEmail
          }).then((res)=> {
          }).catch((err)=>{
          })
          this.email=this.changeEmail;
          this.isChangeEmail = 0;
        },
          //关闭二维码下载
        closeAlertCode(e){
          var target = e.target
          if($(target).is('.alert-code')){
            this.isDownloadCode = 0;
          }
        },
          //下载二维码修改尺寸
        changeSize(index){
          this.codeSubnavIndex = index;
        },
          //点击修改信息
        toChangePersonInfo(){
          this.isChangePersonInfo = 1;
        },
          //保存修改信息
        submitChangePersonInfo(){
          if(this.form.name==''){
            $('#userName').find('input').focus()
            $('#userName').find('input').css('border','1px solid red')
            $('#userName').find('.err').show()
            return false
          }
          this.isLoading = 1;
          this.$http({
            url:config.changeUserName+'?nickName='+this.form.name+'&remarks='+this.form.desc+'&portrait='+this.userHeader
          }).then((res)=> {
            this.isLoading = 0;
            this.isChangePersonInfo = 0;
            this.changeUserInfo({
              portrait:this.userHeader,
              nickName:this.form.name,
              remarks: this.form.desc
            })
          }).catch((err)=>{
          })
        },
        //点击下载二维码
        downloadCode(){
          this.isDownloadCode = 1;
        },
        // 点击下载
        begingDownloadCode(){
          this.$http({
            url:config.downloadCode
          }).then((res)=> {
          }).catch((err)=>{
          })
        },
        // 取消修改信息
        cancelChangePersonInfo(){
          this.isChangePersonInfo = 0;
          this.userHeader = this.$store.state.userInfo.portrait
          // this.getUserInfo()
        },
        // 获取用户信息
        getUserInfo(){
          var res = this.$store.state.userInfo;
          if(res.email){
            this.email = res.email;
          }
          if(res.smobile){
            this.tel = res.smobile;
          }
          this.userType = res.type;
          this.appId = res.appId;
          this.userHeader = res.portrait?res.portrait:this.userHeader;
          this.userName = res.nickName;
          this.form.name = res.nickName;
          this.form.desc = res.remarks;
          this.descript = res.remarks;
        },
        // 获取用户二维码
        getUserCode(){
          this.$http({
            url:config.getUserCodeUrl
          }).then((res)=> {
            if(res.data.status==200){
              this.codeUrl = 'data:image/jpeg;base64,'+res.data.data.replace(/[\r\n]/g,"");
            }
          }).catch((err)=>{
          })
        },
        ...mapMutations(['changeUserInfo'])
      },
      beforeCreate(){
        // 如果上传图片域名不存在
        if(localStorage.mediaAssetsUrl==undefined){
          this.$http({
            url:config.globalUrl
          }).then((res)=> {
            this.appbackUrl = res.data.data.appbackUrl;
            localStorage.appbackUrl=res.data.data.appbackUrl;
            localStorage.mediaAssetsUrl=res.data.data.mediaAssetsUrl;
          }).catch((err)=>{
            // console.log(err)
          })
        }
      },
      created(){
        var that = this;
        var timer = setInterval(function () {
          if(that.$store.state.userInfo.appbackId){
            clearInterval(timer)
            that.getUserInfo()
          }
        },1000)
        this.getUserCode()

      }
    }
</script>

<style scoped>
  .loading{
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    position: fixed;
    /*padding:95px 20px 15px;*/
    background-color: rgba(0,0,0,.4);
    color: #ff353a;
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
.account{
  box-sizing: border-box;
  padding: 0 40px 60px;
  background-color: #ffffff;
}
  .top{
    overflow: hidden;
    border-bottom: 1px solid #e6e6e6;
  }
  .top .left{
    float: left;
    width: 70px;
    height: 70px;
    min-width: 70px;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    overflow: hidden;
    margin: 38px 40px 33px 8px;
    position: relative;
  }
.top .left img{
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border-radius: 50%;

}
.top .left .avatar-uploader,.top .left .el-upload--text{
  width: 100%;
  height: 100%;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border-radius: 50%;
  position: absolute;
  left: 0;
  top: 0;
  /*opacity: 0;*/
}
.top .right{
  margin-left: 113px;
  overflow: hidden;
  margin-top: 38px;
}
  .top .normal{
    width: 100%;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-justify-content: space-between;
    justify-content: space-between;
    -webkit-align-items: center;
    align-items: center;
  }
  .top h3{
    font-size: 22px;
    color: #222222;
    margin-bottom: 5px;
  }
.top .remarks{
  font-size: 14px;
  color: #222222;
}
  .top .change{
    width: 80px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    /*-webkit-border-radius: 10px;*/
    /*-moz-border-radius: 10px;*/
    /*border-radius: 10px;*/
    /*background-color: #f8f8f8;*/
    /*border: 1px solid #bfbfbf;*/
    font-size: 14px;
    color: #ff353a;
    cursor: pointer;
  }
  li{
    list-style: none;
    /*overflow: hidden;*/
    height: 55px;
    line-height: 55px;
    border-bottom: 1px solid #e6e6e6;
    position: relative;
  }
  li:last-child{
    border-bottom: none;
  }
  .info{
    /*overflow: hidden;*/
    border-bottom: 1px solid #e6e6e6;
  }
  .clear{
    clear: both;
  }
  .info:last-child{
    border-bottom: none;
  }
  .label{
    width: 115px;
    float: left;
    font-size: 17px;
    color: #222222;
    line-height: 57px;
  }
  ul{
    margin-left: 115px;
  }
  li .left{
    width: 200px;
    float: left;
    font-size: 14px;
    color: #111111;
  }
  li .middle{
    float: left;
    font-size: 14px;
    color: #666666;
  }
  li .hover{
    position: absolute;
    width: 600px;
    padding: 20px 20px 30px;
    box-sizing: border-box;
    background-color: #fff;
    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;
    border-radius: 10px;
    color: #222222;
    z-index: 2;
    -webkit-box-shadow: 0 0 10px rgba(0, 0, 0, .4);
    -moz-box-shadow: 0 0 10px rgba(0, 0, 0, .4);
    box-shadow: 0 0 10px rgba(0, 0, 0, .4);
    right: 70px;
    top: -120px;
  }
li .hover:before{
  content: '';
  display: block;
  width: 20px;
  height: 20px;
  background-color: #fff;
  -webkit-transform: rotate(45deg);
  -moz-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  -o-transform: rotate(45deg);
  transform: rotate(45deg);
  position: absolute;
  top: 135px;
  right: -5px;
}
  li .hover div{
    font-size: 14px;
    margin-bottom: 30px;
  }
  li .hover p{
    font-size: 12px;
    line-height: 26px;
  }
li .hover .err{
color: #ff353a;
}
li .right{
    float: right;
    color: #5990f2;
    font-size: 14px;
    cursor: pointer;
  }
  li img{
    display: block;
    width: 78px;
    height: 78px;
    border: 1px solid #bfbfbf;
  }
  li .right span{
    color: #666666;
  }
  li.code{
    height: 98px;
    line-height: 98px;
  }
  li.code .middle{
    margin-top: 10px;
  }
  .change-info{
    width: 405px;
  }
  .change-info p{
    font-size: 10px;
    color: #666666;
    line-height: 20px;
  }
.change-info .err{
  position: absolute;
  line-height: 40px;
  left: 420px;
  white-space: nowrap;
  top: 0;
  color: red;
  display: none;
}
  .change-info .el-input{
    position: relative;
  }
  .alert-code{
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.5);
    position: fixed;
    left: 0;
    top: 0;
    z-index: 9999999;
  }
  .alert-code .box{
    width: 653px;
    height: 412px;
    background-color: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }
  .alert-code .main{
    width: 100%;
    height: 325px;
  }
  .alert-code .left{
    width: 164px;
    margin-left: 13px;
    float: left;
  }
  .alert-code .left h2{
    width: 100%;
    height: 60px;
    line-height: 60px;
    text-align: center;
    font-size: 16px;
    color: #222222;
    background-color: #f4f5f6;
  }
.alert-code .left dl{
  overflow: hidden;
  padding-top: 40px;
  -webkit-box-shadow: 0 0px 10px rgba(0, 0, 0, .2);
  -moz-box-shadow: 0 0px 10px rgba(0, 0, 0, .2);
  box-shadow: 0 0px 10px rgba(0, 0, 0, .2);
}
.alert-code .left dt{
  text-align: center;
  font-size: 16px;
  color: #666666;
  line-height: 26px;
  cursor: pointer;
  margin-bottom: 30px;
}
.alert-code .left dt.ac{
  color: #5990f2;
}
  .alert-code .right{
    width: 442px;
    height: 313px;
    margin-right: 23px;
    background: url("../../../static/images/icon/ditu.png");
    background-size: 100% 100%;
    float: right;
    margin-top: 20px;
    overflow: hidden;
  }
  .alert-code .right img{
    display: block;
    margin: 81px auto 0;
    width: 125px;
    height: 125px;
  }
.alert-code .button{
  display: block;
  text-decoration: none;
  width: 123px;
  height: 44px;
  line-height: 42px;
  box-sizing: border-box;
  text-align: center;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  border-radius: 4px;
  background-color: #f8f8f8;
  border: 1px solid #bfbfbf;
  font-size: 20px;
  color: #666666;
  margin: 12px 0 0 376px;
  cursor: pointer;
}
  li .change-email .middle {
    width: 410px;
    position: relative;
  }
  li .change-email .err{
    position: absolute;
    top: 0;
    left: 420px;
    color: red;
    white-space: nowrap;
    display: none;
  }
</style>
