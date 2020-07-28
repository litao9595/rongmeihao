<template>
    <div class="consultation">
      <div class="scroll">
        <p class="welcome">您好，融媒君为您服务</p>
        <ul>
          <li class="me">
            <div class="head"><img src="../../../static/images/icon/touxiang.png" alt=""></div>
            <div class="des">大学生毕业户籍应该去哪个单位或部门办理呢？</div>
          </li>
          <li class="it">
            <div class="head"><img src="../../../static/images/icon/touxiang.png" alt=""></div>
            <div class="des">1、如果毕业时，您的用人单位不给您们落户，您们的户口在学校集体户，您可以跟档案一起迁移到人才市场的集体户口。</div>
          </li>
        </ul>
      </div>
      <div class="bar">
        <div contenteditable="ture" class="input_conta" id="input_conta"></div>
        <div class="emoji" @click=make_face()></div>
        <div class="file"><input type="file" @change="uploadPiture"></div>
        <div class="send">发送</div>
        <!-- 表情容器 ，包裹生成的表情，绑定点击表情事件-->
        <div class="face" id="face" @click=choice_face($event)></div>
      </div>
    </div>
</template>

<script>
    export default {
        name: "",
      data(){
          return{
          }
      },
      methods:{
        uploadPiture(){},
        make_face(){
          $("#face").toggle();         //显示表情容器
          if($("#face>img").length==0){     //动态生成表情，如果现在没有表情则生成
            for(var i=1;i<=91;i++){      //根据表情文件数量决定循环次数，这里为75个表情
              $("#face").append('<img style="display: block;width: 30px;height: 30px;margin: 15px;float: left;" src="../../../static/images/qq/'+i+'.gif">'); //为表情容器里添加IMG标签，并赋予src值，路径为表情文件所在路径
            }
          }
        },
        choice_face(e){
          console.log(e.target.nodeName)
          if(e.target.nodeName=="IMG"){
            $("#face").hide();
            var choice=e.target;
            var src =$( choice).attr('src')
            var img = '<img style="margin-top: 2px;vertical-align: top;height: 26px" src="' +src+
              '">'
            var cEle = choice.cloneNode(true); //深度复制，复制节点下面所有的子节点 ，直接将整个表情的IMG标签复制，并添加到发布框的<p></p>里面
            $("#input_conta").append(img);
          }
        }
      }
    }
</script>

<style scoped>
.consultation{
  background-color: #ffffff;
  padding: 33px 43px 57px;
}
  .scroll{
    min-height:400px;
    max-height: 670px;
    overflow-y: auto;
  }
  .scroll .welcome{
    text-align: center;
    font-size: 15px;
    color: #999999;
    margin-bottom: 30px;
  }
  .scroll ul{
    overflow: hidden;
  }
  .scroll li{
    overflow: hidden;
    margin-bottom: 32px;
  }
  .scroll .head{
    width: 45px;
    height: 45px;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    overflow: hidden;
  }
  .scroll .head img{
    display: block;
    width: 45px;
    height: 45px;
    object-fit: cover;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
  }
  .scroll .des{
    max-width: 290px;
    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;
    border-radius: 10px;
    position: relative;
    padding: 10px;
    font-size: 13px;
    line-height: 23px;
    min-height: 75px;
  }
.scroll .it .des{
  color: #505050;
  background-color: #f5f7f7;
}
.scroll .it .head,.scroll .it .des{
  float: left;
}
.scroll .it .head{
  margin-right: 10px;
}
.scroll .me .head{
  margin-left: 10px;
}
.scroll .me .head,.scroll .me .des{
  float: right;
}
.scroll .me .des{
    color: #fff;
    background-color: #429df8;
  }
  .scroll .des:before{
    content: '';
    display: block;
    width: 0;
    height: 0;
    border-width: 10px;
    border-style: solid;
    position: absolute;
    top: 15px;
  }
  .scroll .it .des:before{
    border-color:  transparent #f5f7f7 transparent  transparent ;
    left: -18px;
  }
.scroll .me .des:before{
  border-color:  transparent  transparent  transparent #429df8;
  right: -18px;
}
  .bar{
    width: 100%;
    box-sizing: border-box;
    height: 52px;
    background-color: #f5f5f5;
    padding: 0 18px;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-justify-content: space-between;
    justify-content: space-between;
    -webkit-align-items: center;
    align-items: center;
    position: relative;
  }
  .bar .input_conta{
    width: 100%;
    height: 40px;
    border: none;
    outline: none;
    background-color: #ffffff;
    -webkit-border-radius: 20px;
    -moz-border-radius: 20px;
    border-radius: 20px;
    line-height: 38px;
    resize: none;
    box-sizing: border-box;
    padding: 0 20px;
    overflow-y: auto;
  }
.bar .input_conta img{
  margin: 0 !important;
}
.bar .file,.bar .emoji{
  width: 22px;
  min-width: 22px;
  height: 22px;
  border: none;
  background: url("../../../static/images/icon/tianjia.png");
  background-size: 100% 100%;
  overflow: hidden;
  margin-left: 23px;
  cursor: pointer;
}
.bar .emoji{
  background: url("../../../static/images/icon/xiao.png");
  background-size: 100% 100%;
}
  .bar input{
    display: block;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
  .bar .send{
    width: 30px;
    min-width: 30px;
    font-size: 14px;
    color: #222;
    text-align: center;
    margin-left: 20px;
    cursor: pointer;
  }
  .bar .face{
    width: 100%;
    box-sizing: border-box;
    position: absolute;
    left: 0;
    top: -300px;
    height: 300px;
    z-index: 99;
    overflow-y: auto;
    display: none;
    background-color: #ffffff;
    padding: 20px;
    border: 1px solid #e1e1e1;
  }
.bar .face img{
    display: block;
    width: 40px;
    height: 40px;
    float: left;
    margin: 40px;
  }
</style>
