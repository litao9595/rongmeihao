<template>
  <div class="head">
      <div class="head_box">
          <div class="logo_box">
              <a href=""><img src="../images/icon/logo_zi.png"></a>
          </div>
          <div class="user_box">
              <div class="email_box">
                <a href="" class="email_btn"></a>
                <span class="email_number">1</span>
                <div class="email_slect">
                    <a href="">通知</a>
                    <a href="">评论</a>
                    <a href="">关注</a>
                    <a href="">问题邀请</a>
                </div>
              </div>
              <div class="infor_box">
                  <div class="avatar_box"><img src="../images/icon/logo_zi.png"></div>
                  <div class="user_name">用户名</div>
                  <i class="sanjiao"><img src="../images/icon/slect_icon.png"></i>
                  <div class="infor_selct">
                      <a href=""><i class="fontFamily hhtxshezhi"></i>账号设置</a>
                      <a href=""><i class="fontFamily hhtxiconfontgerenzhongxin"></i>退出登录</a>
                  </div>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
    export default {
        name: "head.vue"
    }
</script>

<style scoped>
.head{
  background-color: #fff;
  height: 60px;
  -webkit-box-shadow: 0 2px 4px 0 rgba(0,0,0,.08);
  -moz-box-shadow: 0 2px 4px 0 rgba(0,0,0,.08);
  box-shadow: 0 2px 4px 0 rgba(0,0,0,.08);
}
.head_box{
  width: 1180px;
  margin: 0 auto;
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
  -webkit-justify-content: space-between;
  -moz-justify-content: space-between;
}
.logo_box{
  height: 30px;
  margin-top: 15px;
}
.logo_box a{
  display:block;
}
.logo_box a img{
  display:block;
  height: 100%;
}
.user_box{
  display: flex;
  display: -webkit-flex;
}
.email_box{
  width: 23px;
  height: 20px;
  position: relative;
  margin-top: 20px;
}
.email_btn{
  display: block;
  width: 100%;
  height: 100%;
  background: url("../images/icon/email_icon.png") no-repeat left center;
  background-size: 100% 100%;
}
.email_box .email_number{
  display: block;
  position: absolute;
  right: 0px;
  top: -5px;
  padding: 1px 2px;
  font-size: 8px;
  color: #fff;
  background: #fd373c;
  border-radius: 5px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
}
.email_box:hover .email_slect{
  display: block;
}
.email_slect{
  position: absolute;
  left: -20px;
  top: 20px;
  z-index: 3;
  min-width: 120px;
  font-size: 14px;
  box-sizing: border-box;
  line-height: 40px;
  background: #fff;
  -webkit-box-shadow: 0 2px 4px 0 rgba(0,0,0,.08);
  -moz-box-shadow: 0 2px 4px 0 rgba(0,0,0,.08);
  box-shadow: 0 2px 4px 0 rgba(0,0,0,.08);
  display: none;
}
.email_slect a{
  display: block;
  padding-left: 15px;
  padding-right: 15px;
  color: #555;
  text-decoration: none;
}
.email_slect a:hover{
  background: #f1f1f1;
}
.infor_box{
  margin-left: 40px;
  position: relative;
}
.infor_box .avatar_box{
  width: 30px;
  height: 30px;
  border-radius: 15px;
  -webkit-border-radius: 15px;
  overflow: hidden;
  float: left;
  margin-top: 15px;
}
.infor_box .avatar_box img{
  display: block;
  width: 100%;
  height: 100%;
  object-fit:cover;
}
.infor_box .user_name{
  width: 80px;
  height: 20px;
  line-height: 20px;
  font-size: 14px;
  color: #555;
  margin-left: 10px;
  float: left;
  margin-top: 20px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
.infor_box .sanjiao{
  display: block;
  width: 10px;
  float: left;
  margin-top: 27px;
}
.infor_box .sanjiao img{
  display: block;
  width: 10px;
}
.infor_box .infor_selct{
  position: absolute;
  left: 0px;
  top: 40px;
  background: #fff;
  z-index: 3;
  min-width: 120px;
  font-size: 14px;
  box-sizing: border-box;
  line-height: 40px;
  -webkit-box-shadow: 0 2px 4px 0 rgba(0,0,0,.08);
  -moz-box-shadow: 0 2px 4px 0 rgba(0,0,0,.08);
  box-shadow: 0 2px 4px 0 rgba(0,0,0,.08);
  display: none;
}
.infor_box:hover .infor_selct{
  display: block;
}
.infor_box .infor_selct a{
  display: block;
  height: 40px;
  color: #999;
  text-align: center;
  text-decoration: none;
}
.infor_box .infor_selct a i{
  margin-right: 5px;
}
.infor_box .infor_selct a:hover{
  background: #e1e1e1;
  color: #555;
}
</style>
