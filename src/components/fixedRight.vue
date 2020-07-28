<template>
    <div class="fixed">
      <div class="item qq">
        <img class="icon qq" src="../../static/images/icon/qq.png" alt="">
        <div class="des">QQ<br/>咨询</div>
        <div class="hide">
          <div class="box">
            <div>QQ:898262009 <a target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin=898262009&site=qq&menu=yes">点我咨询</a></div>
            <div>QQ:2709988465 <a target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin=2709988465&site=qq&menu=yes">点我咨询</a></div>
          </div>
        </div>
      </div>
      <div class="item wx">
        <img class="icon wx" src="../../static/images/icon/weixin.png" alt="">
        <div class="des">官网<br/>微信</div>
        <div class="hide">
         <div class="box"> <img src="../../static/images/icon/ewm.jpg" alt=""></div>
        </div>
      </div>
      <div class="item tel">
        <img class="icon tel" src="../../static/images/icon/tel.png" alt="">
        <div class="des">联系<br/>电话</div>
        <div class="hide">
          <div class="box"><div>电话:16161651616</div></div>
        </div>
      </div>
    </div>
</template>

<script>
    export default {
        name: ""
    }
</script>

<style scoped>
.fixed{
  position: fixed;
  right: 10px;
  top: 50%;
  -webkit-transform: translateY(-50%);
  -moz-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  -o-transform: translateY(-50%);
  transform: translateY(-50%);
  width: 53px;
  background-color: #ffffff;
  box-sizing: border-box;
  padding:15px 0;
  z-index: 9;
}
.item{
  position: relative;
  font-size: 11px;
  line-height: 1.2;
  text-align: center;
  color: #222222;
  margin-bottom: 15px;
  cursor: pointer;
}

.hide{
  position: absolute;
  left: -100%;
  top: 0;
  padding-right: 28px;
  box-sizing: border-box;
 display: none;
}
.item:hover .hide{
  display: block;
  /*-webkit-animation: fixedScale .8s forwards;*/
  /*-o-animation: fixedScale .8s forwards;*/
  /*animation: fixedScale .8s forwards;*/
}
.icon{
  display: block;
  margin: 0 auto 5px;
}
  .icon.qq{
    width: 29px;
  }
.icon.wx{
  width: 36px;
}
.icon.tel{
  width: 31px;
}
.item.qq .hide,.item.tel .hide{
  width: 250px;
  left: -250px;
}
  .item.qq .box,.item.tel .box{
    background-color: #ffffff;
    padding:15px 0 1px;
    font-size: 12px;
    color: #222;
    line-height: 28px;
    text-align: center;
    -webkit-box-shadow: 0 0 10px 0px rgba(0,0,0,.15);
    -moz-box-shadow: 0 0 10px 0px rgba(0,0,0,.15);
    box-shadow:  0 0 10px 0px rgba(0,0,0,.15);
    position: relative;
  }
.item.qq .box:after,.item.wx .box:after,.item.tel .box:after{
  content: '';
  display: block;
  border: 10px solid transparent;
  border-left: 10px solid #ffffff;
  position: absolute;
  right: -20px;
  top: 10px;
}
.item.qq .box>div{
  margin-bottom: 15px;
}
  .item.qq a{
    display: inline-block;
    height: 28px;
    text-decoration: none;
    padding: 0 8px;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
    cursor: pointer;
    background-color: #ff353a;
    color: #ffffff;
    margin-left: 10px;
  }
.item.wx .box img{
  display: block;
  width: 120px;
}
  .item.wx .hide{
    width: 150px;
    left: -150px;
  }
.item.wx .box{
  width: 120px;
  height: 120px;
  -webkit-box-shadow: 0 0 10px 0px rgba(0,0,0,.15);
  -moz-box-shadow: 0 0 10px 0px rgba(0,0,0,.15);
  box-shadow:  0 0 10px 0px rgba(0,0,0,.15);
  position: relative;
}
.item.tel .hide{
  width: 180px;
  left: -180px;
}
.item.tel .box{
  line-height: 40px;
  padding-top: 0;
  font-size: 14px;
}
  @keyframes fixedScale {
    0%{transform: scale(0.85,0.85)}
    30%{transform: scale(1.1,1.1)}
    60%{transform: scale(0.95,0.95)}
    100%{transform: scale(1,1)}
  }
</style>
