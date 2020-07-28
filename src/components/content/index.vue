<template>
<div style="background: #fff;" :style="{minHeight:minHeight+'px'}">
  <ul class="material_nav">
    <li :class="navType==1?'active':''" @click="graphic">图文</li>
    <!--<li :class="navType==3?'active':''" @click="atlasList">图集</li>-->
    <li :class="navType==2?'active':''" @click="videoList">小视频</li>
  </ul>
  <div class="content_box">
      <!--条件筛选-->
      <div class="screening_box">
          <div class="time-choose">
            <label style="line-height: 30px;">文章状态</label>
            <ul class="screening_left">
              <li :class="navActive==-1?'active':''" @click="clickTopNav(-1)">全部</li>
              <li :class="navActive==0?'active':''" @click="clickTopNav(0)">未审核</li>
              <li :class="navActive==1?'active':''" @click="clickTopNav(1)">通过</li>
              <li :class="navActive==2?'active':''" @click="clickTopNav(2)">未通过</li>
              <li :class="navActive==3?'active':''" @click="clickTopNav(3)">已撤回</li>
              <li :class="navActive==9?'active':''" @click="clickTopNav(9)">草稿</li>
            </ul>
          </div>
          <div class="screening_right">
            <div class="left" style="width: 300px;">
              <el-input
                placeholder="请输入内容"
                prefix-icon="el-icon-search"
                clearable
                @keyup.enter.native="serchBtn"
                v-model="serchData">
              </el-input>
            </div>
            <div class="serch_btn" @click="serchBtn">搜索</div>
            <div class="right" v-if="false">
              <div class="time">
                <!--<el-date-picker-->
                  <!--@change="clickSerchBtnTime"-->
                  <!--v-model="serchDataTime"-->
                  <!--type="daterange"-->
                  <!--range-separator="至"-->
                  <!--format="yyyy-MM-dd"-->
                  <!--start-placeholder="开始日期"-->
                  <!--end-placeholder="结束日期">-->
                <!--</el-date-picker>-->
              </div>
            </div>
          </div>
      </div>
      <div class="time-choose" style="margin-top: 10px;">
        <div class="left">
          <label>时间选择</label>
          <el-date-picker style="width: 240px;"
                          @change="clickSerchBtnTime"
                          v-model="serchDataTime"
                          type="daterange"
                          range-separator="至"
                          format="yyyy-MM-dd"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期">
          </el-date-picker>
        </div>
       <div class="right">
         <!--<button @click="showPlatform">选择分享平台</button>-->
       </div>
      </div>
      <!---->
      <!--<div class="data-number">-->
          <!--<div class="left_text">共找到<span>2</span>条符合条件的内容</div>-->
          <!--<div class="right_text">全部删除</div>-->
      <!--</div>-->
      <!--内容列表-->
    <div v-if="noData" class="no_data" style="margin-top: 60px">
      <img style="width: 100px; display: block; margin: 0 auto" src="../../../static/images/no-data.png">
      <p style="line-height: 40px;">暂无数据</p>
    </div>
      <ul class="content-list">
          <li v-for="(item,index) in dataList">
            <div class="content-list-content">
                <div class="content-title">
                  <!--<span class="check" @click="isChecked($event,item.id)"></span>-->
                  {{item.title}}</div>
              <ul class="content-img" v-if="item.covers[0]!=''">
                <li class="content-img-video" v-if="navType==2"><video controls="controls" :src="item.covers[0]"></video></li>
                <li v-if="navType==3 || navType==1" v-show="item.fileType==1"><img v-if="item.covers" :src="item.covers[0]"/></li>
                <li v-if="navType==3 || navType==1" v-for="temp in item.covers" v-show="item.fileType!=1&& item.fileType!=0"><img v-if="temp" :src="temp"/></li>
              </ul>
                <div class="content-time">
                    {{item.createDate}}
                    <span v-if="item.isPublish==0">未审核</span>
                    <span v-if="item.isPublish==1" style="color: #6ccbd7">通过</span>
                    <span v-if="item.isPublish==2" style="color: #ff353a">未通过</span>
                    <span v-if="item.isPublish==3">已撤回</span>
                    <span v-if="item.isPublish==9">草稿</span>
                </div>
                <div class="content-data-number">
                    <span>点赞 {{item.contentBehavior.agreeWithCount}}</span>
                    <i class="fontFamily hhtxdian-copy"></i>
                    <span>阅读 {{item.contentBehavior.readCount}}</span>
                    <i class="fontFamily hhtxdian-copy"></i>
                    <span>评论 {{item.contentBehavior.commentCount}}</span>
                    <i class="fontFamily hhtxdian-copy"></i>
                    <span>收藏 {{item.contentBehavior.collectionCount}}</span>
                    <i class="fontFamily hhtxdian-copy"></i>
                    <span>分享 {{item.contentBehavior.shareCount}}</span>
                </div>
            </div>
            <div class="content-list-btn">
                <div @click="withdrawClick(index,1)" v-if="item.isPublish==1||item.isPublish==0"><i class="fontFamily hhtxchehui"></i>撤回</div>
                <div v-if="item.isPublish==1">
                  <router-link :to="{path:'/faTouTiao/index',query:{id:item.id,type:navType,see:1}}">
                    <i class="el-icon-view"></i>查看
                  </router-link>
                </div>
                <div>
                  <router-link v-if="item.isPublish==9||item.isPublish==2||item.isPublish==0||item.isPublish==3" :to="{path:'/faTouTiao/index',query:{id:item.id,type:navType}}">
                    <i class="fontFamily hhtxxiugai"></i>修改
                  </router-link>
                </div>
                <div @click="chehui(index,2)" v-if="item.isPublish!=1"><i class="el-icon-delete"></i>删除</div>
            </div>
          </li>
      </ul>
      <!--分页器-->
      <div class="page_box" v-if="records>10">
        <el-pagination
          background
          layout="prev, pager, next"
          @current-change="handleCurrentChange6"
          :page-size="10"
          :total="records">
        </el-pagination>
      </div>
  </div>
  <!--looding-->
  <div class="mask_box" v-if="mask">
    <div class="mask_content">
        <i class="el-icon-loading mask_body"></i>
    </div>
  </div>
  <!--选择分享平台-->
  <choice-platform v-show="showPlatformChoice" :dataList="checkList"  v-on:hidePlatformChoice="hidePlatformChoice"></choice-platform>
</div>
</template>

<script>
  import {config} from "../../router/httpConfig.js"
  import choicePlatform from '../choicePlatform'
  import { eventBus } from '../../main'
  import {mapState} from 'vuex'
    export default {
        name: "index.vue",
      components:{
        choicePlatform
      },
      data(){
          return{
            checkList:[],
            showPlatformChoice:0,
            form:{
              date3:'',
              date4:''
            },
            noData:false,
            serchData:'',//搜索
            serchDataTime:[],//时间筛选
            appbackUrl:'',//两微一端域名
            mediaAssetsUrl:'',//媒资域名
            userId:'',//用户id
            dataList:[],//内容列表
            navActive:-1,
            records:1,//总页数
            navType:1,
            mask:true,
            minHeight:this.common.getWindowHeight(),
            areaId:this.$store.state.userInfo.areaId==null?0:this.$store.state.userInfo.areaId
          }
      },
      created:function(){
        //发表成功时跳转页
        let _type = this.$route.query.type;
      },
      beforeCreate:function(){
          //获取域名
          this.$http({
            url:config.globalUrl
          }).then((res)=>{
            // console.log(res.data.data);
            let _url=res.data.data.appbackUrl;
            this.mediaAssetsUrl=res.data.data.mediaAssetsUrl;
            this.appbackUrl=res.data.data.appbackUrl;
            //获取用户信息
            this.$http({
              url:config.userUrl
            }).then((res)=>{
              // console.log(res.data.data.appbackId);
              let _userId=res.data.data.appbackId;
              this.userId=res.data.data.appbackId;
              //初始化列表
              this.$http({
                url:_url+config.contentListUrl+'?userId='+_userId+'&type=1&auditStatus='+'&areaId='+this.$store.state.userInfo.areaId
              }).then((res)=>{
                // console.log(res.data.data.rows);
                if(res.data.data.rows.length){
                  this.noData=false;
                }else{
                  this.noData=true;
                }

                for(let i=0; i<res.data.data.rows.length; i++){
                  let listcontent=[];
                  let _content=res.data.data.rows[i].titleFilePath;
                  if(_content==null){
                    _content=''
                  }
                  listcontent=_content.split(",");
                  res.data.data.rows[i].covers=listcontent;
                }
                this.dataList=res.data.data.rows;
                this.records=res.data.data.records;
                this.mask=false
              }).catch((err)=>{
                console.log(err)
              })


            }).catch((err)=>{
              console.log(err)
            })

          }).catch((err)=>{
            console.log(err)
          })
      },
      methods:{
        isChecked(e,id){
          var target = e.target;
          $(target).toggleClass('checked')
          if($(target).is('.checked')){
            this.checkList.push(id)
          }
          else {
            for(var i=0;i<this.checkList.length;i++){
              if(id==this.checkList[i]){
                this.checkList.splice(i,1)
              }
            }
          }
        },
        hidePlatformChoice(){
          this.showPlatformChoice = 0;
        },
        showPlatform(){
          if(this.checkList.length==0){
            this.$message({
              message: '请选择需要推送的内容！',
              type: 'warning'
            });
          }
          else {
            this.showPlatformChoice = 1;
          }
        },
        serchGet(form,to){
          let _columnCode="";
          if(this.navType==1){
            _columnCode='tw'
          }else if(this.navType==2){
            _columnCode='sp'
          }else{
            _columnCode='tj'
          }
          this.$http({
            url:this.appbackUrl+config.contentSerchUrl+'?key='+this.serchData
            +'&createById='+this.userId
            // +'&createById=5DE46E4E65E5F1E4237A66C132A344B0'
            +'&columnCode='+_columnCode
            +'&from='+form
            +'&to='+to
            +'&areaId='+this.areaId
          }).then((res)=>{
            // console.log(res.data.data.rows);
            console.log(res.data.data.rows)
            let _length=res.data.data.rows.length;
            if(_length==0){
              //无数据
              this.dataList=[];
              this.noData=true;
            }else{
              //有数据
              this.noData=false;
              for(let i=0; i<res.data.data.rows.length; i++){
                let listcontent=[];
                let _content=res.data.data.rows[i].titleFilePath;
                if(_content==null){
                  _content=''
                }
                listcontent=_content.split(",");
                res.data.data.rows[i].covers=listcontent
              }
              this.dataList=res.data.data.rows;
            }
          }).catch((err)=>{
            console.log(err)
          })
        },
        serchBtnTime(zhi){
          //时间处理
          // var ti=zhi.toString();
          // var arr=ti.split("T");
          // var d=arr[0];
          // var darr = d.split('-');
          // var t=arr[1];
          // var tarr = t.split('.000');
          // var marr = tarr[0].split(':');
          // var dd = parseInt(darr[0])+"-"+parseInt(darr[1])+"-"+parseInt(darr[2])+" "+parseInt(marr[0])+":"+parseInt(marr[1])+":"+parseInt(marr[2]);
           // var startDate =this.myTime(zhi);
          let d=new Date(zhi);
          let youWant=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
          var startDate= youWant.replace(new RegExp("-","gm"),"/");
          var startDateM = (new Date(startDate)).getTime(); //得到毫秒数
          return startDateM
        },
        clickSerchBtnTime(){
          //时间段搜索
          let _from='';
          let _to='';
          this.serchData='';
          if(this.serchDataTime.length){
            _from=this.serchBtnTime(this.serchDataTime[0]);
            _to=this.serchBtnTime(this.serchDataTime[1]);
          }
          this.serchGet(_from,_to);
        },
        //关键词搜索
        serchBtn(){
          let _from=null;
          let _to=null;
          if(this.serchData){
            this.serchGet(_from,_to)
          }else{
            this.$message('搜索内容不能为空');
          }
        },
          //图文列表
          contenListData(val,peg){
            let _url="";
            if(this.navType==3){
              // console.log("图集");
              if(val==-1){
                _url=this.appbackUrl+config.atlasContentUrl+'?columnId=44&parentContentId=0&userId='+this.userId+'&pageSize=10&pageNo='+peg+'&type=3';
              }else{
                _url=this.appbackUrl+config.atlasContentUrl+'?columnId=44&parentContentId=0&userId='+this.userId+'&auditStatus='+val+'&pageSize=10&pageNo='+peg+'&type=3';
              }
            }else if(this.navType==1){
              // console.log("图文");
              if(val==-1){
                _url=this.appbackUrl+config.contentListUrl+'?userId='+this.userId+'&auditStatus=&pageSize=10&pageNo='+peg+'&type=1';
              }else{
                _url=this.appbackUrl+config.contentListUrl+'?userId='+this.userId+'&auditStatus='+val+'&pageSize=10&pageNo='+peg+'&type=1';
              }
            }else{
              //小视频
              if(val==-1){
                _url=this.appbackUrl+config.contentListUrl+'?userId='+this.userId+'&auditStatus=&pageSize=10&pageNo='+peg+'&type=2';
              }else{
                _url=this.appbackUrl+config.contentListUrl+'?userId='+this.userId+'&auditStatus='+val+'&pageSize=10&pageNo='+peg+'&type=2';
              }
            }

            this.$http({
              url:_url
            }).then((res)=>{
              // console.log(res)
              if(res.data.data.rows.length){
                this.noData=false;
              }else{
                this.noData=true;
              }
              for(let i=0; i<res.data.data.rows.length; i++){
                let listcontent=[];
                let _content=res.data.data.rows[i].titleFilePath;
                if(_content==null){
                  _content=''
                }
                listcontent=_content.split(",");
                res.data.data.rows[i].covers=listcontent
              }
              this.dataList=res.data.data.rows;
              this.records=res.data.data.records;
              this.mask=false
            }).catch((err)=>{
              console.log(err)
            })
        },
          clickTopNav(index){
            this.dataList=[];
            this.navActive=index;
            this.mask=true;
            this.contenListData(index,1)
          },
        chehui:function(index){
          this.$confirm('此操作将删除该信息, 是否继续?', '提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(()=>{
            this.withdrawClick(index,2)
          }).catch(()=>{
            // this.$message({
            //   type: 'info',
            //   message: '已取消删除'
            // });
          });
        },
          //撤回删除
          withdrawClick(index,val){
            let _http=this.appbackUrl+config.withdrawContenUrl;
              this.$http({
                url:_http+'?userId='+this.userId+'&contentIds='+this.dataList[index].id+'&type='+val+'&areaId='+this.areaId
              }).then((res)=>{
                console.log(res.data.status);
                // 删除
                if(res.data.status==200){
                  if(val==2){
                    this.dataList.splice(index,1)
                  }
                  // 撤回
                  else {
                    this.dataList[index].isPublish=3;
                    this.$message({
                      message: '撤回成功',
                      type: 'success'
                    });
                  }
                }
                else {
                }
              }).catch((err)=>{
                console.log(err)
              })
          },
          //翻页
          handleCurrentChange6(val){
            console.log(val);
            this.contenListData(this.navActive,val)
          },
          //图文
          graphic(){
            this.dataList=[];
            this.navType=1;
            this.mask=true;
            this.contenListData(-1,1);
            this.navActive=-1;
          },
          //图集
          atlasList(){
            this.navActive=-1;
            this.dataList=[];
            this.navType=3;
            this.mask=true;
              this.$http({
                url:this.appbackUrl+config.atlasContentUrl+'?columnId=44&parentContentId=0&type=3'+'&areaId='+this.areaId
              }).then((res)=>{
                console.log(res.data.data.rows);
                if(res.data.data.rows.length){
                  this.noData=false;
                }else{
                  this.noData=true;
                }
                for(let i=0; i<res.data.data.rows.length; i++){
                  let listcontent=[];
                  let _content=res.data.data.rows[i].titleFilePath;
                  if(_content==null){
                    _content=''
                  }
                  listcontent=_content.split(",");
                  res.data.data.rows[i].covers=listcontent
                }
                this.dataList=res.data.data.rows;
                this.records=res.data.data.records;
                this.mask=false;
              }).catch((err)=>{
                console.log(err)
              })
          },
          //小视频
        videoList(){
          this.navActive=-1;
          this.dataList=[];
          this.navType=2;
          this.mask=true;
          this.contenListData(-1,1)
        }
      }
    }
</script>

<style scoped>
  @import "../css/content.css";
</style>
