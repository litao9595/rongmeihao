<template>
    <div class="home" id="pageHome" :style="{minHeight:minHeight+'px'}">
      <!--<div class="notice">-->
        <!--<div class="tip">公告</div>-->
        <!--<div class="more">更多</div>-->
        <!--<div class="show">-->
          <!--<div class="parent">-->
            <!--<ul id="newsList">-->
              <!--<li v-for="item in noticeList">{{item.title}}</li>-->
            <!--</ul>-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->
      <div  class="home-body">
        <div class="left">
          <div class="tabs">
            <div :class="activeIndex==1?'ac':''" @click="getInfo(31,1)">累计数据</div>
            <div :class="activeIndex==2?'ac':''" @click="getInfo(0,2)">今日数据</div>
            <div :class="activeIndex==3?'ac':''" @click="getInfo(7,3)">近七日</div>
            <div :class="activeIndex==4?'ac':''" @click="getInfo(30,4)">近30日</div>
          </div>
          <ul>
            <li>
              <h3>{{totalFansCount?totalFansCount:0}}</h3>
              <p>总粉丝数</p>
            </li>
            <li>
              <h3>{{currentFansCount?currentFansCount:0}}</h3>
              <p>当前粉丝数</p>
            </li>
            <li>
              <h3>{{articlesCount?articlesCount:0}}</h3>
              <p>累计创作数</p>
            </li>
            <li>
              <h3>{{browseCount?browseCount:0}}</h3>
              <p>累计浏览量</p>
            </li>
            <li>
              <h3>{{readCount?readCount:0}}</h3>
              <p>累计阅读量</p>
            </li>
            <li>
              <h3>{{likesCount}}</h3>
              <p>累计点赞数</p>
            </li>
            <li>
              <h3>{{commentsCount?commentsCount:0}}</h3>
              <p>累计评论数</p>
            </li>
            <li>
              <h3>{{collectionsCount?collectionsCount:0}}</h3>
              <p>累计收藏数</p>
            </li>
            <li>
              <h3>{{shareCount?shareCount:0}}</h3>
              <p>累计分享数</p>
            </li>
          </ul>
        </div>
        <!--<div class="right">-->
          <!--<div class="headpic"><img :src="portrait" alt=""></div>-->
          <!--<div class="des">{{Greetings}}</div>-->
          <!--<div class="des">{{userName?userName:'匿名用户'}}</div>-->
          <!--<div class="btns">-->
            <!--<button>-->
              <!--<router-link to="/faTouTiao/index" tag="span">开始创作</router-link>-->
            <!--</button>-->
            <!--&lt;!&ndash;<button>退出登录</button>&ndash;&gt;-->
          <!--</div>-->
        <!--</div>-->
        <!--<div class="clear"></div>-->
      </div>
      <div class="loading" v-show="isLoading" >
       <i class="el-icon-loading"></i>
      </div>
    </div>
</template>

<script>
  import {config} from "../router/httpConfig.js"
  import {mapState} from 'vuex'
    export default {
        name: "",
      data(){
        return{
          isLoading:0,
          portrait:'../../static/images/default_head.png',
          activeIndex: 1,
          currentTop:0,
          userName:'',
          appbackUrl:'',//两微一端域名
          mediaAssetsUrl:'',//媒资域名
          userId:'',
          totalFansCount:'',//总粉丝
          shareCount:'',//分享
          readCount:'',//阅读
          likesCount:'',//点赞
          currentFansCount:'',//当前粉丝
          commentsCount:'',//评论数
          collectionsCount:'',
          browseCount:'',
          articlesCount:'',
          activeFanCount:'',
          noticeList:[],
          Greetings:'',
          minHeight:this.common.getWindowHeight()
        }
      },
      computed:{
        ...mapState({
          userInfo: state =>state.userInfo
        })
      },
      created(){
          var that = this;
         var timer = setInterval(function () {
           if(that.$store.state.userInfo.appbackId){
             clearInterval(timer)
             that.getInfo(31,1)
           }
         },1000)

        // this.Greetings = this.Get_Greetings();
        // parent.addTabpp('{"name":"主页"}');
      },
      methods:{
        clickJumpUrl(){
            parent.addTabpp('{"name":"主页"}');
            this.$router.push('/homePage');
          },
          // 设置问候语
        Get_Greetings() {
          var now = new Date();
          var times = now.getHours();
          var whe=parseInt(times);
          if(times>=0 && times<4){return "深夜好！用户"}
          if(times>=4&& times<6){return "凌晨好！用户"}
          if(times>=6 && times<9){return "早上好！用户"}
          if(times>=9 && times<11){return "上午好！用户"}
          if(times>=11 && times<13){return "中午好！用户"}
          if(times>=13 && times<19){return "下午好！用户"}
          if(times>=19 && times<23){return "晚上好！用户"}
        },
          // 公告轮播
        noticeSwiper(){
          var that = this;
          var newsList = $('#newsList');
          var parent = newsList.parent();
          var height = newsList.height()
          var clone = newsList.html();
          var cloneHtml = '<ul>'+clone+'</ul>';
          parent.append(cloneHtml)
          if(this.noticeList.length>2){
            setInterval(function () {
              that.currentTop = that.currentTop-56;
              if(that.currentTop-56<-height){
                parent.animate({top:that.currentTop+'px'},1000,function () {
                  that.currentTop = 0;
                  parent.css('top',0)
                })
              }
              else {
                parent.animate({top:that.currentTop+'px'},1000)
              }

            },3000)
          }
        },
          //获取公告
          getNotice(){
            this.$http({
              url:config.getNotice
            }).then((res)=> {
              this.noticeList = res.data.data.rows;
              this.noticeSwiper()
            }).catch((err)=>{

            })
          },
        getInfo(days,flag){
          this.activeIndex = flag;
          this.isLoading = 1;
          this.$http({
            url:this.$store.state.appbackUrl+config.homePge+'?userId='+this.$store.state.userInfo.appbackId+'&days='+days,
          }).then((res)=> {
            var data = res.data.data;
            this.totalFansCount = data.totalFansCount;
            this.shareCount = data.shareCount;
            this.readCount = data.readCount;
            this.likesCount = data.likesCount;
            this.currentFansCount = data.currentFansCount;
            this.commentsCount = data.commentsCount;
            this.collectionsCount = data.collectionsCount;
            this.browseCount = data.browseCount;
            this.articlesCount = data.articlesCount;
            this.activeFanCount = data.activeFanCount;
            this.isLoading = 0;
          }).catch((err)=>{
            // console.log(err)
          })
        },
      },
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
  .home{
    background-color: #ffffff;
    -webkit-box-shadow: 0 0 8px rgba(99,99,99,.2);
    -moz-box-shadow: 0 0 8px rgba(99,99,99,.2);
    box-shadow: 0 0 8px rgba(99,99,99,.2);
  }
.notice{
  width: 100%;
  padding: 0 34px;
  box-sizing: border-box;
  background-color: #fff;
  line-height: 56px;
  -webkit-box-shadow: 0 0 8px rgba(99,99,99,.2);
  -moz-box-shadow: 0 0 8px rgba(99,99,99,.2);
  box-shadow: 0 0 8px rgba(99,99,99,.2);
}
  .notice .show{
    margin: 0 80px;
    height: 56px;
    overflow: hidden;
  }
  .notice .tip{
    float: left;
    font-size: 16px;
    color: #888888;
  }
  .notice .more{
    font-size: 14px;
    color: #888888;
    padding-right: 14px;
    position: relative;
    float: right;
  }
  .notice .more:after{
    content: '';
    display: block;
    width: 8px;
    height: 15px;
    background: url("../../static/images/icon/you.png");
    background-size: 100% 100%;
    position: absolute;
    right: 0;
    top: 50%;
    margin-top: -7.5px;
  }
  .notice .parent{
    position: relative;
    top: 0;
  }
  .notice ul{
    overflow: hidden;
    width: 100%;
  }
  .notice li{
    float: left;
    width: 50%;
    list-style: none;
    box-sizing: border-box;
    padding: 0 10px;
    font-size: 14px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .home-body{
    /*display: none;*/
    /*height: 100%;*/
    /*margin-top: 16px;*/
  }
  .home-body .clear{
    clear: both;
  }
  .home-body .left{
    width: 100%;
    /*float: left;*/
    background-color: #fff;
    padding-top: 25px;
    padding-bottom: 45px;

  }
  .home-body .left .tabs{
    width: 100%;
    line-height: 50px;
    overflow: hidden;
    /*display: -webkit-box;*/
    /*display: -webkit-flex;*/
    /*display: flex;*/
    /*-webkit-justify-content: space-around;*/
    /*justify-content: space-around;*/
    font-size: 16px;
    color: #222;
    border-bottom: 1px solid #bfbfbf;
  }
  .home-body .left .tabs div{
    float: left;
    padding: 0 10px;
    margin: 0 40px;
    border-bottom: 3px solid transparent;
    cursor: pointer;
  }
  .home-body .left .tabs .ac{
    color: #ff353a;
    font-weight: bold;
    border-bottom: 3px solid #ff353a;
  }
  .home-body .left ul{
    overflow: hidden;
    padding-bottom: 10px;
  }
  .home-body .left li{
    list-style: none;
    float: left;
    width: 33.33%;
    height: 84px;
    box-sizing: border-box;
    margin-top: 60px;
    text-align: center;
    border-right: 1px solid #d9d9d9;
  }
  .home-body .left li:nth-child(3n){
    border-right: none;
  }
  .home-body .left li h3{
    font-size: 20px;
    color: #222;
  }
  .home-body .left li p{
    font-size: 16px;
    color: #888888;
    margin-top: 35px;
  }
  .home-body .right{
    box-sizing: border-box;
    width: 24.5%;
    float: right;
    background-color: #fff;
    padding: 33px 0 25px;
    text-align: center;
    -webkit-box-shadow: 0 0 8px rgba(99,99,99,.2);
    -moz-box-shadow: 0 0 8px rgba(99,99,99,.2);
    box-shadow: 0 0 8px rgba(99,99,99,.2);
  }
.home-body .right .headpic{
  width: 50px;
  height: 50px;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 15px;
}
  .home-body .right .headpic img{
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
.home-body .right .des{
  font-size: 14px;
  color: #222;
  line-height: 23px;
}
.home-body .right .btns{
  text-align: center;
  margin-top: 15px;
}
.home-body .right button{
  width: 97px;
  height: 26px;
  font-size: 12px;
  color: #fefefe;
  line-height: 26px;
  text-align: center;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
  background-color: #ff353a;
  border: none;
  margin: 0 4px;
  cursor: pointer;
  outline: none;
}
</style>

