<template>
  <div class="hello" :style="{minHeight:minHeight+'px'}">
    <!--<head-head></head-head>-->
    <div class="main_box">
      <!--左-->
      <!--<div class="nav_left">-->
      <!--</div>-->
      <!--右-->
      <div class="content_box" v-if="true">
        <ul class="tab_top">
          <li v-for="(navList,index) in navList" @click="navClick(index)" :class="index==navNumber?'actve':''">{{navList.label}}</li>
        </ul>
        <div class="add_box">
          <div class="add_btn" @click="openAlert()">新增</div>
        </div>
        <contentList v-if="refresh" @e-hide="getDatalist" :listName="listData" style="padding: 15px;"></contentList>
      </div>
      <div class="content_box" v-if="false" style="float: right">
          <votingManagement @e-nav="navdata"></votingManagement>
      </div>
    </div>
    <!--新增弹框-->
    <div class="alert_box" v-if="alert">
      <div class="alert_content">
        <div class="alert_head">新增<i class="el-icon-close" @click="downAlert()"></i></div>
        <div style="width: 586px; height: 400px; overflow: hidden;">
          <editorAlert @e-world="getData" :inputName="childData" style="width: 590px; height: 400px;"></editorAlert>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import contentList from '@/components/content-list'
  import editorAlert from '@/components/editor-alert'
  import {config} from "../router/httpConfig.js"
  import votingManagement from '@/components/votingManagement'
  export default {
    components:{contentList,editorAlert,votingManagement},
    name: 'HelloWorld',
    data () {
      return {
        navList:['关键词回复','关键词回复'],
        navNumber:0,
        alert:false,
        childData:{
          category:'',
          name:''
        },
        passListData:{
          category:'',
          listData:[],
        },
        listData:[],
        refresh:true,
        appbackUrl:'',//两微一端域名
        mediaAssetsUrl:'',//媒资域名
        minHeight:this.common.getWindowHeight()
      }
    },
    beforeCreate:function(){
      //初始化回复事件查询 关注、取消关注
      this.$http({
        method:'get',
        url:config.replyType,
      }).then((res)=>{
        // console.log(res)
        let _data=res.data.data;
        this.navList=_data;
        //category默认选中第一个
        this.childData.category=this.navList[0].value;
        //初始化列表数据
        this.$http({
          url:config.queryList+'?category='+_data[0].value,
          // qs.stringify()
        }).then((res)=>{
          // console.log(res)
          this.listData=res.data.data.rows;
          this.listData[0].category=this.navList[0].value;
          sessionStorage.list=JSON.stringify(res.data.data.rows)
          //JSON.parse
        }).catch(function(err){
          console.log(err)
        })

      }).catch(function(err){
        // console.log(err)
      });






    },
    methods:{
      shuaxin:function(){
        this.refresh=true
      },
      navdata(index){
        this.navNumber=index
      },
      getData:function(alert){
        this.alert=alert;
        if(this.childData.category=='subscribe'){
          this.navClick(0)
        }else{
          this.navClick(1)
        }
      },
      getDatalist(alert){
        this.refresh=alert;
        if(this.childData.category=='subscribe'){
          // alert(1)
          this.navClick(0)
        }else{
          this.navClick(1)
        }
      },
      navClick:function(index){
        this.navNumber=index;
        this.childData.category=this.navList[index].value;
        // this.listData[0].category=this.navList[index].value;
        //列表查询
        this.$http({
          // method:'post',
          url:config.queryList+'?category='+this.childData.category+'&name='+this.childData.name,
        }).then((res)=>{
          // console.log(res.data.data.list);
          this.listData=res.data.data.rows;
          this.passListDat.listData=res.data.data.rows;

        }).catch(function(err){
          console.log(err)
        })
        this.shuaxin();
      },
      downAlert(){
        this.alert=false
      },
      openAlert(){
        this.alert=true
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  li{
    list-style: none;
  }
  .content_box{
    /*width: 1000px;*/
    background: #fff;
    margin: 0 auto;
  }
  .content_box .tab_top{
    display: flex;
    display: -webkit-flex;
    height: 68px;
    border-bottom: 1px solid #e6e6e6;
    padding-top: 18px;
    box-sizing: border-box;
  }
  .content_box .tab_top .actve{
    border-bottom: 3px solid #ff353a;
    color: #ff353a;
    font-weight: 700;
  }
  .content_box .tab_top li:hover{
    color: #ff353a;
  }
  .content_box .tab_top li{
    height: 50px;
    line-height: 50px;
    color: #353535;
    font-size: 16px;
    cursor: pointer;
    box-sizing: border-box;
    padding: 0px 10px;
    margin: 0px 40px;
  }
  .main_box{
    margin-left: auto;
    margin-right: auto;
    overflow: hidden;
  }
  .nav_left{
    float: left;
    width: 180px;
    background: #fff;
  }
  .add_box{
    height: 40px;
    overflow: hidden;
    margin-top: 20px;
  }
  .add_box .add_btn{
    float: right;
    margin-right: 20px;
    width: 100px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    background-color: rgb(248, 89, 89);
    color: #fff;
    border: none;
    cursor: pointer;
  }
  .add_box .add_btn i{
    margin-right: 5px;
  }
  /*新增弹框*/
  .alert_box{
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0px;
    top: 0px;
    background: rgba(0,0,0,.5);
    z-index: 99999;
  }
  .alert_box .alert_content{
    background: #fff;
    padding: 20px;
    padding-top: 0px;
    width: auto;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    z-index: 20;
    border-radius: 5px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
  }
  .alert_box .alert_content .alert_head{
    width: 630px;
    height: 40px;
    line-height: 40px;
    border-bottom: solid 1px #e6e6e6;
    position: relative;
    margin-left: -20px;
    margin-right: -20px;
    box-sizing: border-box;
    padding: 0px 20px;
  }
  .alert_box .alert_content .alert_head i{
    display: block;
    position: absolute;
    right: 20px;
    top: 10px;
    cursor: pointer;
    font-size: 20px;
  }

</style>
