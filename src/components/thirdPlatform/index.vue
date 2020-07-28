<template>
  <div class="system" id="system" :style="{minHeight:minHeight+'px'}">
    <div class="tabs">
      <template>
        <div v-for="(tabs,tabIndex) in navList" :class="activeIndex==tabIndex?'ac':''"   @click="changeTab(tabIndex)">{{tabs.name}}</div>
      </template>

    </div>
    <div class="custom-menu-body">
      <div class="weixin">
        <div v-show="list.length>0" class="table-bar">
          <button style="">添加</button>
        </div>
        <el-table
          v-show="list.length>0&&!showLoading"
          :data="list"
          style="width: 100%">
          <el-table-column
            type="index"
            width="50">
          </el-table-column>
          <el-table-column
            prop="name"
            label="名称"
          >
          </el-table-column>
          <el-table-column
            prop="appid"
            align="center"
            label="appid"
         >
          </el-table-column>
          <el-table-column
            prop="appsecret"
            label="appsecret"
          >
          </el-table-column>
          <el-table-column
            prop="timer"
            label="定时发布时间"
            width="180"
          >
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            align="right"
            width="120">
            <template slot-scope="scope">
              <el-button type="text" size="small">编辑</el-button>
              <el-button  type="text" size="small" @click="deleteItem(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="no-vote" v-show="list.length==0&&!showLoading">
          <img src="../../../static/images/no-data.png" alt="">
          <div>暂无数据，请先创建 <span @click="addItem('-1')">新建</span></div>
        </div>
        <!--<ul>-->
          <!--<li v-for="(item,index) in list">-->
            <!--<div class="left">-->
              <!--<div class="item appid">-->
                <!--<div class="label">appid</div>-->
                <!--<div class="input"><el-input v-model="item.appid" placeholder="请输入内容" @blur="removal($event,0)"></el-input></div>-->
              <!--</div>-->
              <!--<div class="item appsecret">-->
                <!--<div class="label">appsecret</div>-->
                <!--<div class="input"><el-input v-model="item.appsecret" placeholder="请输入内容" @blur="removal($event,1)"></el-input></div>-->
              <!--</div>-->
              <!--<div class="item appname">-->
                <!--<div class="label">名称</div>-->
                <!--<div class="input"><el-input v-model="item.name" placeholder="请输入内容" @blur="removal($event,2)"></el-input></div>-->
              <!--</div>-->
            <!--</div>-->
            <!--<div class="right">-->
              <!--<div class="time">-->
                <!--&lt;!&ndash;<el-select v-model="item.timer" placeholder="请选择">&ndash;&gt;-->
                  <!--&lt;!&ndash;<el-option&ndash;&gt;-->
                    <!--&lt;!&ndash;v-for="item in timerList"&ndash;&gt;-->
                    <!--&lt;!&ndash;:key="item.value"&ndash;&gt;-->
                    <!--&lt;!&ndash;:label="item.label"&ndash;&gt;-->
                    <!--&lt;!&ndash;:value="item.value">&ndash;&gt;-->
                  <!--&lt;!&ndash;</el-option>&ndash;&gt;-->
                <!--&lt;!&ndash;</el-select>&ndash;&gt;-->
                <!--<el-time-select-->
                  <!--v-model="item.timer"-->
                  <!--:picker-options="{-->
    <!--start: '00:00',-->
    <!--step: '00:05',-->
    <!--end: '24:00'-->
  <!--}"-->
                  <!--placeholder="定时发布时间">-->
                <!--</el-time-select>-->
              <!--</div>-->
              <!--<div class="handle">-->
                <!--<div class="icon add" v-show="index==(list.length)-1" @click="addItem">增加</div>-->
                <!--<div class="icon del" @click="deleteItem(index)">删除</div>-->
              <!--</div>-->
            <!--</div>-->
            <!--<div class="switch">-->
              <!--<el-switch-->
                <!--v-model="item.timer_open"-->
                <!--active-text="定时发布"-->
              <!--&gt;-->
              <!--</el-switch>-->
            <!--</div>-->
          <!--</li>-->
        <!--</ul>-->
        <!--<div class="btn">-->
          <!--<button  class="publish" @click="saveList">保存</button>-->
        <!--</div>-->
        <div class="loading" v-show="showLoading"><i class="el-icon-loading"></i></div>
      </div>
    </div>
    <div class="alert-add" v-show="isAdd">
      <div class="box">
        <div class="title">
          <div>增加平台</div>
          <i class="el-icon-close" @click="closeAdd"></i>
        </div>
        <div class="item appid">
        <div class="label">appid:</div>
        <div class="input"><el-input v-model="currentEdit.appid"  placeholder="请输入内容" @blur="removal($event,0)"></el-input></div>
        </div>
        <div class="item appsecret">
        <div class="label">appsecret:</div>
        <div class="input"><el-input v-model="currentEdit.appsecret"  placeholder="请输入内容" @blur="removal($event,1)"></el-input></div>
        </div>
        <div class="item appname">
        <div class="label">名称:</div>
        <div class="input"><el-input v-model="currentEdit.name" placeholder="请输入内容" @blur="removal($event,2)"></el-input></div>
        </div>
        <div class="item appname">
          <div class="label">定时时间:</div>
          <div class="input">
            <el-select v-model="currentEdit.timer" placeholder="请选择">
              <el-option
                v-for="item in timerList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="item">
          <div class="label">开启定时发布:</div>
          <div class="input"><el-switch
            v-model="currentEdit.timer_open"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch></div>
        </div>
        <div class="btn">
        <button  class="publish" @click="saveList">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {config} from "../../router/httpConfig";
  import choicePlatform from '../choicePlatform'
  export default {
    name: "",
    components:{
      choicePlatform
    },
    data() {
      return {
        isAdd:0,
        timerList:[],
        showPlatformChoice:0,
        activeIndex:0,
        showLoading:1,
        type:'',
        list:[],
        minHeight:this.common.getWindowHeight(),
        navList: [ ],
        currentEdit:{
          id:'',
          type:this.type,
          appid:'',
          appsecret:'',
          timer:'',
          name:'',
          timer_open:1
        }
      }
    },
    methods:{
      // 删除
      deleteItem(index,row){
        var id = row.id;

      },
      // 小于10加0
      addZero(val){
        if(val<10){
          val = '0'+val
        }
        return val
      },
      // 时间处理
      getDateArray(splitTime) {
        var startTime = 24*60;
        var changeTime = parseInt(splitTime);
        var count = startTime/changeTime;
        var arr = [];
        for(var i=0;i<count;i++){
          var h =this.addZero(parseInt((startTime/60)));
          var m = this.addZero(startTime-h*60);
          startTime = startTime-changeTime;
          var st = h+':'+m
          var obj = {
            value:st,
            label:st
          }
          arr.push(obj)
        }
       this.timerList = arr;
      },
      // 隐藏平台选择
      hidePlatformChoice(res){
        this.showPlatformChoice = 0;
      },
      // 去重
      removal(e,flag){
        var val = e.target.value;
        var index = $(e.target).parents('li').index();
        for(var i=0;i<this.list.length;i++){
          if(i!=index&&val!=''){
            if(flag==0&&val==this.list[i].appid){
              this.$message.error('该栏目已存在！');
              $(e.target).css('border','1px solid #f85959')
              $(e.target).focus()
              console.log($(e.target))
            }
            else if(flag==1&&val==this.list[i].appsecret){
              this.$message.error('该栏目已存在！');
              $(e.target).css('border','1px solid #f85959')
              $(e.target).focus()
            }
            else if(flag==2&&val==this.list[i].name){
              this.$message.error('该名称已存在！');
              $(e.target).css('border','1px solid #f85959')
              $(e.target).focus()
            }
            else {
              $(e.target).css('border','1px solid #e6e6e6')
            }
          }
        }
      },
      // 修改tab
      changeTab(tabIndex){
        this.type = this.navList[tabIndex].code;
        this.activeIndex = tabIndex;
        this.getList()
      },
      // 获取平台类型
      getType(){
        this.$http({
          url:config.platformType
        }).then((res)=>{
          this.navList = res.data.data;
          this.type = this.navList[0].code
          this.getList()
        })
      },
      // 验证是否为空
      judgeNll(){
        if(this.currentEdit.appid==''){
          this.$message.error('请完善信息！');
          $('.alert-add').find('.appid').find('input').focus()
          $('.alert-add').find('.appid').find('input').css('border','1px solid #f85959')
          return false
        }
        if(this.currentEdit.appsecret==''){
          $('.alert-add').find('.appsecret').find('input').focus()
          $('.alert-add').find('.appsecret').find('input').css('border','1px solid #f85959')
          this.$message.error('请完善信息！');
          return false
        }
        if(this.currentEdit.name==''){
          this.$message.error('请完善信息！');
          $('.alert-add').find('.appname').find('input').focus()
          $('.alert-add').find('.appname').find('input').css('border','1px solid #f85959')
          return false
        }

        return true
      },
      // 保存
      saveList(){
        if(this.judgeNll()){
          $('.alert-add .item').each(function () {
          $(this).find('input').css('border','1px solid #e6e6e6')
          })
          this.showLoading = 1;
          var obj = this.currentEdit;
          if(obj.timer_open){
            obj.timer_open = 1;
          }
          else {
            obj.timer_open = 0;
          }
          var string = JSON.stringify(obj)
          this.$http({
            url:config.platformWeixinSave,
            params:{
              txt:string
            }
          }).then((res)=>{
            this.showLoading = 0;
            this.isAdd = 0;
          }).catch(()=>{})
        }

      },
      // 获取平台对应数据
      getList(){
        this.$http({
          url:config.platformWeixinGet,
          params: {
            type:this.type
          }
        }).then((res)=>{
          this.showLoading = 0;
          if(res.data.data.length>0){
            for(var i=0;i<res.data.data.length;i++){
              if(res.data.data[i].timer){
                res.data.data[i].timer = res.data.data[i].timer.slice(0,5)
              }
            }
            this.list = res.data.data;
          }
          else {
            this.list = [];
          }

        }).catch(()=>{})
      },
      // 关闭编辑或添加
      closeAdd(){
        this.isAdd = 0;
      },
      // 增加栏目
      addItem(flag){
        if(flag!=-1){}
        else {
          console.log(this.isAdd)
          this.currentEdit = {
            id:'',
            type:this.type,
            appid:'',
            appsecret:'',
            timer:'',
            name:'',
            timer_open:true
          };
          this.isAdd = 1;
        }

      },
    },
    created(){
      this.getType()
      this.getDateArray(5)
    }
  }
</script>

<style scoped>
  .no-vote{
    overflow: hidden;
    text-align: center;
    font-size: 16px;
    line-height: 30px;
    color: #999999;
  }
  .no-vote img{
    display: block;
    margin: 100px auto 0;
    width: 80px;
  }
  .no-vote span{
    cursor: pointer;
    display: inline-block;
    width: 80px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-size: 14px;
    color: #ffffff;
    background-color: #ff353a;
    -webkit-border-radius: 6px;
    -moz-border-radius: 6px;
    border-radius: 6px;
    margin-left: 10px;
  }
 .tabs{
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
    border-bottom: solid 1px #e6e6e6;
  }
.tabs div{
    float: left;
    padding: 0 10px;
    margin: 0 40px;
    border-bottom: 3px solid transparent;
    cursor: pointer;
  }
 .tabs div:hover{
   color: #ff353a;
 }
.tabs .ac{
    color: #ff353a;
    font-weight: bold;
    border-bottom: 3px solid #ff353a;
  }
  .system{
    min-height: 100%;
    background-color: #ffffff;
    position: relative;
    /*max-width: 938px;*/
  }
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
    padding: 0 20px 20px;
    box-sizing: border-box;
  }
  .weixin .table-bar{
    text-align: right;
    margin-bottom: 15px;
    margin-top: 20px;
    font-size: 0;
  }
  .weixin .table-bar button{
    display: inline-block;
    vertical-align: top;
    width: 100px;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    margin: 0;
    text-align: center;
    background-color: rgb(248, 89, 89);
    color: #fff;
    border: none;
    cursor: pointer;
  }
  /*li{*/
    /*list-style: none;*/
    /*overflow: hidden;*/
    /*box-sizing: border-box;*/
    /*padding: 20px;*/
    /*margin: 30px 0 10px;*/
    /*border: 1px solid #efefef;*/
    /*display: -webkit-box;*/
    /*display: -webkit-flex;*/
    /*display: flex;*/
    /*!*align-items: flex-end;*!*/
    /*!*-webkit-align-items: center;*!*/
    /*!*align-items: center;*!*/
  /*}*/
  /*li .left{*/
    /*margin-right: 20px;*/
  /*}*/
  /*li .right .time{*/
    /*margin-bottom: 15px;*/
  /*}*/
  /*li .item{*/
    /*overflow: hidden;*/
    /*margin-bottom: 10px;*/
    /*!*float: left;*!*/
    /*!*width: 50%;*!*/
    /*!*margin-right: 40px;*!*/
  /*}*/
  /*li .item:last-child{*/
    /*margin-bottom: 0;*/
  /*}*/
  /*li .switch{*/
    /*margin-left: 20px;*/
  /*}*/
  .label{
    float: left;
    width: 120px;
    margin-right: 10px;
    line-height: 40px;
    color: #777;
  }
  .input{
    width: 400px;
    min-height: 40px;
    line-height: 40px;
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
  .btn button{
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
  .alert-add{
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.5);
    position: fixed;
    left: 0;
    top: 0;
    z-index: 99999;
  }
  .alert-add .box{
    width: 600px;
    height: 470px;
    background-color: #ffffff;
    -webkit-border-radius: 8px;
    -moz-border-radius: 8px;
    border-radius: 8px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -300px;
    margin-top: -220px;
  }
  .alert-add .title{
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #e6e6e6;
    box-sizing: border-box;
    padding: 0 20px;
    font-size: 16px;
    color: #222222;
    position: relative;
  }
  .alert-add .title i{
    display: block;
    position: absolute;
    right: 20px;
    top: 10px;
    cursor: pointer;
    font-size: 20px;
  }
  .alert-add .item{
    height: 40px;
    box-sizing: border-box;
    padding: 0 20px;
    margin-top: 25px;
  }
  .el-switch .el-switch__core{
    border-color: rgb(182, 182, 182) !important;
    background-color: rgb(182, 182, 182) !important;
  }
  .el-switch.is-checked .el-switch__core{
    border-color: rgb(255, 73, 73) !important;
    background-color: rgb(255, 73, 73) !important;
  }
</style>
