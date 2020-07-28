<template>
<div class="weixin">
  <ul>
    <li v-for="(item,index) in list">
      <div class="left">
        <div class="item appid">
          <div class="label">appid</div>
          <div class="input"><el-input v-model="item.appid" placeholder="请输入内容"></el-input></div>
        </div>
        <div class="item appsecret">
          <div class="label">appsecret</div>
          <div class="input"><el-input v-model="item.appsecret" placeholder="请输入内容"></el-input></div>
        </div>
      </div>
     <div class="right">
       <div class="time">
         <el-time-select
           v-model="item.timer"
           :picker-options="{
    start: '00:00',
    step: '00:05',
    end: '24:00'
  }"
           placeholder="定时发布时间">
         </el-time-select>
       </div>
       <div class="handle">
         <div class="icon add" v-show="index==(list.length)-1" @click="addItem">增加</div>
         <div class="icon del" @click="deleteItem(index)">删除</div>
       </div>
     </div>

    </li>
  </ul>

  <div class="btn">
    <button  class="publish" @click="saveList">保存</button>
  </div>
  <div class="loading" v-show="showLoading"><i class="el-icon-loading"></i></div>
</div>
</template>

<script>
  import {config} from "../../router/httpConfig";
    export default {
        name: "",
      data(){
          return{
            showLoading:1,
            list:[{
              type:1,
              appid:'',
              appsecret:'',
              timer:''
            }]
          }
      },
      methods:{
          judgeNll(){
            for(var i=0;i<this.list.length;i++){
              if(this.list[i].appid==''){
                this.$message.error('请完善信息！');
                $('.weixin li').eq(i).find('.appid').find('input').focus()
                return false
              }
              if(this.list[i].appsecret==''){
                $('.weixin li').eq(i).find('.appsecret').find('input').focus()
                this.$message.error('请完善信息！');
                return false
              }
            }
            return true
          },
          saveList(){
            if(this.judgeNll()){
              this.showLoading = 1;
              var string = JSON.stringify(this.list)
              this.$http({
                url:config.platformWeixinSave,
                params:{
                  txt:string
                }
              }).then((res)=>{
                this.showLoading = 0;
                if(res.data.status==200){
                  this.$message({
                    showClose: true,
                    message:'保存成功',
                    type: 'success'
                  });
                }
                else {
                  this.$message({
                    showClose: true,
                    message: res.data.message,
                    type: 'warning'
                  });
                }
              }).catch(()=>{})
            }

          },
          getList(){
            this.$http({
              url:config.platformWeixinGet
            }).then((res)=>{
              this.showLoading = 0;
              if(res.data.data.length>0){
                this.list = res.data.data;
              }

            }).catch(()=>{})
          },
        addItem(){
          var obj = {
            type:1,
            appid:'',
            appsecret:'',
            timer:''
          };
          this.list.push(obj)
        },
        deleteItem(index){
          this.list.splice(index,1)
        }
      },
      created(){
          this.getList()
      }
    }
</script>

<style scoped>
  .loading{
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.4);
    position: fixed;
    z-index: 9999999;
    top: 0;
    left: 0;
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
    color: #ff353a;
  }
  .weixin{
    padding-bottom: 90px;
  }
li{
  list-style: none;
  overflow: hidden;
  box-sizing: border-box;
  padding: 20px;
  margin: 30px 0 10px;
  border: 1px solid #efefef;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  /*-webkit-align-items: center;*/
  /*align-items: center;*/
}
li .left{
  margin-right: 30px;
}
li .right .time{
  margin-bottom: 15px;
}
  li .item{
    overflow: hidden;
    margin-bottom: 10px;
    /*float: left;*/
    /*width: 50%;*/
    /*margin-right: 40px;*/
  }
  li .item:last-child{
    margin-bottom: 0;
  }
  .label{
    float: left;
    width: 80px;
    margin-right: 10px;
    line-height: 40px;
    color: #777;
  }
  .input{
    width: 400px;
    float: left;
  }
  .handle {
    text-align: right;
  }
  .icon{
    display: inline-block;
    width: 70px;
    height:32px;
    font-size:12px;
    text-align: center;
    line-height: 32px;
    color: #fff;
    cursor: pointer;
    margin-left: 15px;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
    background-color: #f85959;
  }
  .icon i{
    font-size: 14px;
    margin-right: 5px;
  }
  .icon:hover{
    background-color: #ff353a;
  }
  ul{
    padding: 0 40px;
    box-sizing: border-box;
  }
  button{
    height: 50px;
    line-height: 50px;
    width: 140px;
    font-size: 16px;
    cursor: pointer;
    display: block;
    color: #fff;
    background-color: #f85959;
    border-radius: 4px;
    border: 1px solid #f85959;
    margin: 10px auto;
  }
  .btn{
    width: 100%;
    height: 70px;
    background-color: #ffffff;
    position: absolute;
    left: 0;
    bottom: 0;
    overflow: hidden;
    z-index: 4;
  }
</style>

