<template>
    <div class="addWatermark">
      <div class="left">图片水印</div>
      <div class="right">
        <div class="btn">
          <div :class="isWatermark==1?'ac':''" @click="isAddAatermark(1)">添加水印</div>
          <div  :class="isWatermark==0?'ac':''" @click="isAddAatermark(0)">不添加水印</div>
        </div>
        <div class="pic" style="background-image: url('./static/images/init.jpg')">
          <div v-show="isWatermark"><span>{{watermarkName}}</span> @{{userName}}</div>
        </div>
        <div class="save" @click="savaWatermark">保存</div>
      </div>
      <div class="loading" v-show="isLoading"><i class="el-icon-loading"></i></div>
      <div class="ajax-result">
        <div class="box">
          <div><i class="el-icon-warning"></i></div>
          <p></p>
        </div>
      </div>
    </div>
</template>

<script>
  import {config} from "../../router/httpConfig";
    export default {
        name: "",
      data(){
          return{
            isLoading:0,
            isWatermark:null,
            userName:'',
            userId:'',
            watermarkName:"",
          }
      },
      methods:{
        isAddAatermark(flag){
          this.isWatermark = flag;
        },
        // 获取用户信息
        getUserInfo(){
          var userInfo = this.$store.state.userInfo;
          if(userInfo.isWatermark){
            this.isWatermark=1;
          }
          else {
            this.isWatermark=0;
          }
          this.userId = userInfo.id;
          this.userName = userInfo.nickName;
          this.getWaterMark()
        },
        //获取水印名称
        getWaterMark(){
          this.$http({
            url:config.globalUrl,
          }).then((res)=> {
            this.watermarkName = res.data.data.nickName;
          }).catch((err)=>{
          })
        },
        savaWatermark(){
          this.isLoading = 1;
          this.$http({
            url:config.saveWatermarkUrl+'?id='+this.userId+'&isWatermark='+this.isWatermark,
          }).then((res)=> {
            this.isLoading = 0;
            $('.ajax-result p').text(res.data.message)
             $('.ajax-result').fadeIn(300)
            setTimeout(function () {
              $('.ajax-result').fadeOut(300)
            },1000)
          }).catch((err)=>{
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
      }
    }
</script>

<style scoped>
  .loading,.ajax-result{
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    background-color: rgba(0,0,0,.4);
    color: #ff353a;
    display: none;
    z-index: 9999999;
  }
  .ajax-result .box{
    width: 120px;
    min-height: 60px;
    padding: 20px;
    -webkit-border-radius: 6px;
    -moz-border-radius: 6px;
    border-radius: 6px;
    background-color: #ffffff;
    text-align: center;
    line-height: 30px;
    font-size: 16px;
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%,-50%);
    -moz-transform: translate(-50%,-50%);
    -ms-transform: translate(-50%,-50%);
    -o-transform: translate(-50%,-50%);
    transform: translate(-50%,-50%);
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
.addWatermark{
  background-color: #FFFFFF;
  padding: 30px 43px 150px;
}
  .left{
    float: left;
    font-size: 17px;
    color: #222222;
    line-height: 30px;
  }
  .right{
    margin-left: 143px;
  }
  .btn{
    width: 210px;
    height: 30px;
  }
  .btn div{
    float: left;
    width: 50%;
    height: 30px;
    box-sizing: border-box;
    border: 1px solid #e71f19;
    color: #e71f19;
    text-align: center;
    line-height: 28px;
    font-size: 14px;
  }
  .btn .ac{
    color: #ffffff;
    background-color: #e71f19;
  }
  .pic{
    width: 430px;
    height: 260px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    margin: 31px 0 28px;
    position: relative;
  }
  .pic div{
    position: absolute;
    bottom: 16px;
    right: 10px;
    color: #ffffff;
    font-size: 16px;
    line-height: 20px;
    text-shadow: 0 2px 3px rgba(0, 0, 0, .6);
  }
  .pic div span{
    font-size: 20px;
    font-weight: bold;
    margin-right: 2px;
  }
  .save{
    width: 108px;
    height: 43px;
    line-height: 43px;
    text-align: center;
    color: #fdfdfd;
    background-color: #ff353a;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
    font-size: 18px;
  }
</style>
