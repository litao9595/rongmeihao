<template>
<div class="wuli_box">
  <div class="atlas_btn" v-if="!fileVideoUrl">
    <div class="file_video_btn" @click="filleVideoAlert=true">上传视频
      <!--<el-upload-->
        <!--class="avatar-uploader avatar-uploader2"-->
        <!--name="upload"-->
        <!--:action="mediaAssetsUrl"-->
        <!--:show-file-list="false"-->
        <!--:before-upload="beforeUploading"-->
        <!--:on-success="handleAvatarSuccess1"-->
        <!--:on-error="beforeAvatarUpload">-->
        <!--<div style="width: 90px; height: 40px;"></div>-->
      <!--</el-upload>-->
    </div>
  </div>
  <div v-else>
    <div class="wuli_video">
      <!--<p class="wuli_uplode_name">{{fileVideoName}}</p>-->
      <el-progress :text-inside="true" :stroke-width="18" :percentage="schedule"></el-progress>
      <div class="wuli_uplode_staut">
        上传完成
        <span>
          重新上传
          <el-upload
                class="avatar-uploader avatar-uploader2"
                name="upload"
                :action="mediaAssetsUrl"
                :show-file-list="false"
                :before-upload="beforeUploading2"
                accept="video/*"
                :on-progress="onTheCross"
                :on-success="handleAvatarSuccess1"
                :on-error="beforeAvatarUpload">
            <div style="width: 60px; height: 20px;"></div>
          </el-upload>
        </span>
      </div>
    </div>
    <div class="wuli_uplode_title">
        <div class="uplode_title_left">标题</div>
        <textarea v-model="formData.title" class="uplode_title_right" placeholder="请输入标题"></textarea>
    </div>
    <div class="wuli_uplode_cover">
        <div class="wuli_uplode_cover_left">封面</div>
        <div class="wuli_uplode_cover_right" @click="coverAlert=true">
          <img :src="formData.videoCover" v-if="formData.videoCover">
          <span>设置封面</span>
        </div>
    </div>
    <div class="wuli_uplode_bottom">
      <el-button v-if="!amend" style="width: 98px;" type="primary" @click="clickPublished">发表</el-button>
      <el-button v-if="!amend" @click="cancel">取消</el-button>
      <el-button v-if="amend" style="width: 98px;" type="primary" @click="clickSaveBtn">保存</el-button>
    </div>
  </div>
  <!--looding-->
  <div class="looding_box" v-if="looding">
      <i class="el-icon-loading"></i>
  </div>
  <!--video looding-->
  <div class="looding_box video-looding" v-if="videoLooding">
    <el-progress type="circle" color="#f00" :percentage="videoSchedule"></el-progress>
  </div>
  <!--上传视频封面弹窗-->
  <div class="file_img_alert" v-show="coverAlert">
    <div class="fileImg_box">
      <div class="fileImg_title" style="height: 15px;">
        <i class="el-icon-close" @click="coverAlert=false"></i>
      </div>
      <ul class="fileImg_box_nav" style="margin-top: 0px;">
        <li :class="fileImgBoxNav==1?'active':''" @click="fileImgBoxNavImg">上传文件</li>
        <li v-if="fileType!=4" :class="fileImgBoxNav==2?'active':''" @click="fileImgBoxNavMaterial(1,-1)">素材库</li>
      </ul>
      <div class="fileImg_content1" v-if="fileImgBoxNav==1">
        <el-upload
          class="avatar-uploader"
          name="upload"
          :action="mediaAssetsUrl"
          :show-file-list="false"
          accept="image/*"
          :on-success="handleAvatarSuccess"
          :on-error="beforeAvatarUpload">
          <div style="width: 150px !important; height: 150px;">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </div>
        </el-upload>
      </div>
      <div class="material_library" id="fileImg_content3" v-show="fileImgBoxNav==2">
          <!--素材面包屑导航-->
          <div class="up_one_level" v-if="crumbsList.length">
            <a @click="fileImgBoxNavMaterial(1,-1)">素材库</a>
            <a v-for="(itme,index) in crumbsList" @click="crumbsListClick(index,1)"> < {{itme.name}}</a>
          </div>
          <!--素材文件夹列表-->
          <div class="folder_box_list" v-if="folder.length">
            <div class="my_folder" v-for="(item,index) in folder" @dblclick="openFolders(index,1)">
              <i class="fontFamily hhtxweibiaoti5"></i>
              <p>{{item.name}}</p>
            </div>
          </div>
          <ul class="fileImg_content fileImg_content_new">
            <li :class="itme.hideState?'material':''" v-for="(itme,index) in sucaiList">
              <div class="cheke_icon"></div>
              <img :src="itme.accessPath" @click="materialSelect(index,1)">
            </li>
          </ul>
      </div>
      <div class="fileImg_btn">
        <el-button type="primary" @click="determineCover">确定</el-button>
      </div>
    </div>
  </div>
  <!--上传视频弹窗-->
  <div class="file_img_alert" v-show="filleVideoAlert">
    <div class="fileImg_box">
        <div class="fileImg_title" style="height: 15px;">
          <i class="el-icon-close" @click="filleVideoAlert=false"></i>
        </div>
        <ul class="fileImg_box_nav">
          <li style="margin-top: 0px;" :class="fileImgBoxNav==1?'active':''" @click="fileImgBoxNavImg">上传文件</li>
          <li style="margin-top: 0px;" v-if="fileType!=4" :class="fileImgBoxNav==2?'active':''" @click="fileImgBoxNavMaterial(3,-1)">素材库</li>
        </ul>
        <div class="fileImg_content1" v-if="fileImgBoxNav==1">
          <el-upload
            class="avatar-uploader"
            name="upload"
            :action="mediaAssetsUrl"
            :show-file-list="false"
            accept="video/*"
            :on-progress="videoOnTheCross"
            :before-upload="beforeUploading"
            :on-success="handleAvatarSuccess1"
            :on-error="beforeAvatarUpload">
            <div style="width: 150px !important; height: 150px; overflow: hidden">
              <video v-if="formData2.titleFilePath" :src="zufuchuli(formData2.titleFilePath,0)" class="avatar-video"></video>
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </div>
          </el-upload>
        </div>
        <div class="material_library" id="fileImg_content2" v-show="fileImgBoxNav==2">
            <!--素材面包屑导航-->
            <div class="up_one_level" v-if="crumbsList.length">
              <a @click="fileImgBoxNavMaterial(3,-1)">素材库</a>
              <a v-for="(itme,index) in crumbsList" @click="crumbsListClick(index,3)"> < {{itme.name}}</a>
            </div>
            <!--素材文件夹列表-->
            <div class="folder_box_list" v-if="folder.length">
              <div class="my_folder" v-for="(item,index) in folder" @dblclick="openFolders(index,3)">
                <i class="fontFamily hhtxweibiaoti5"></i>
                <p>{{item.name}}</p>
              </div>
            </div>
            <ul class="fileImg_content fileImg_content_new">
              <li :class="itme.hideState?'material':''" v-for="(itme,index) in sucaiList2">
                <div class="cheke_icon"></div>
                <video :src="zufuchuli(itme.accessPath,0)" @click="materialSelect(index,3)"></video>
              </li>
            </ul>
        </div>

        <div class="fileImg_btn">
          <el-button @click="fileImgAscertain()" type="primary">确定</el-button>
        </div>
    </div>

  </div>
  <!--loding-->
  <div class="loding_box" v-if="loding_box">
    <i class="el-icon-loading"></i>
  </div>
</div>
</template>

<script>
  import {config} from "../../router/httpConfig.js"
    export default {
        name: "video.vue",
      props:['inputName'],
      data(){
          return{
            formData:{
              cagetory:3,
              title:'',
              fileType:3,
              covers:[],
              content: [],
              columnId:localStorage.videoColumn=="null"?null:localStorage.videoColumn,
              status:2,
              isTimer:2,
              publishTime:'',
              tagId:[],
              videoCover:'',
              timeLen:0,
              areaId:localStorage.areaId
            },
            formData2:{
              columnType:'',
              deviceType:0,
              columnId:localStorage.videoColumn=="null"?null:localStorage.videoColumn,
              createById:'',
              fileType:3,
              files:[],
              title:'',
              content:'',
              titleFilePath:'',
              tagId:[],
              id:'',
              timeLen:0,
              areaId:localStorage.areaId
            },
            loding_box:false,
            fileImgBoxNav:1,//上传弹窗导航类型
            fileType:0,
            fileImgBoxNav:1,//上传弹窗导航类型
            sucaiList:[],//图片素材列表
            sucaiList2:[],//视频素材列表
            amend:false,//是否是修改页
            contentData:false,
            looding:false,
            videoLooding:false,
            schedule:100,
            videoSchedule:0,
            fileImgData:[], //上传图片视频集合
            fileVideoUrl:'',//视频路径
            fileVideoName:'',
            imageUrl:'',//封面路径
            filleVideoAlert:false,//上传视频弹窗
            mediaAssetsUrl:this.inputName, //媒资地址
            appbackUrl:localStorage.appbackUrl,//两微一端
            coverAlert:false,//上传封面图弹窗
            totalpage:1,
            total:1,
            folder:[
              // {name:'文件名1',id:111}
            ],
            crumbsList:[
              // {name:'图片',id:''},
            ],//面包屑导航
            folderId:-1,
            timeLen:0
          }
      },
      created:function(){
        let _id = this.$route.query.id;
        if(_id){
          this.amend=true;
          this.formData2.id=_id;
          //修改页视频列表
          // this.$http({
          //   url:localStorage.appbackUrl+config.atlasDetailsUrl+'?parentContentId='+_id
          // }).then((res)=>{
          //   // console.log(res.data);
          //   let arr=[];
          //   for(let i=0; i<res.data.data.length; i++){
          //     let obj={};
          //     obj.description=res.data.data[i].title;
          //     obj.url=res.data.data[i].titleFilePath;
          //     arr.push(obj)
          //   }
          //   this.fileImgData=arr;
          //   this.list=true;
          // }).catch((err)=>{
          //   console.log(err)
          // });
          //修改页图 封面图 标题
          this.$http({
            url:localStorage.appbackUrl+config.graphicDetailsUrl+'/'+_id
          }).then((res)=>{
            this.list=true;
            // console.log(res.data.data);
            this.formData.fileType=res.data.data.fileType;
            this.formData.title=res.data.data.title;
            this.fileVideoUrl=res.data.data.titleFilePath;
            this.formData.timeLen=res.data.data.timeLen;
            let _imgurlArrtao=res.data.data.titleFilePath.split("/");
            let _lenth=_imgurlArrtao.length;
            this.fileVideoName=_imgurlArrtao[_lenth-1];
            this.formData.videoCover=res.data.data.createUserPhoto;

            this.formData2.columnType=res.data.data.columnType;
            this.formData2.columnId=res.data.data.columnId;
            this.formData2.createById=res.data.data.createById;
            this.formData2.fileType=res.data.data.fileType;
            this.formData2.titleFilePath=res.data.data.titleFilePath;
            this.formData2.timeLen=res.data.data.timeLen;
            if(res.data.data.fileType==4){
              this.fill=res.data.data.titleFilePath;
            }else if(res.data.data.fileType==2){
              let imgArr=res.data.data.titleFilePath.split(",");
              // this.onCoverImg3=imgArr;
            }

          }).catch((err)=>{
            console.log(err)
          })

        }

      },
      mounted() {
        document.getElementById('fileImg_content2').addEventListener('scroll', this.handleScroll);
        document.getElementById('fileImg_content3').addEventListener('scroll', this.handleScroll);
      },
      methods:{
        makeDurationToSeconds(time){
          var str = time;
          var arr = str.split(':');
          var hs = parseInt(arr[0]*3600);
          var ms = parseInt(arr[1]*60);
          var ss = parseInt(arr[2]);
          var seconds = hs + ms + ss;
          return seconds;
        },
        openFolders(index,type){
          let _id=this.folder[index].id;
          this.folderId=_id;
          //构建面包屑导航
          let obj={};
          obj.name=this.folder[index].name;
          obj.id=this.folder[index].id;
          this.crumbsList.push(obj);
          //请求文件夹下数据
          this.fileImgBoxNavMaterial(type,_id);
        },
        crumbsListClick(index,type){
          //点击面包屑导航
          this.crumbsList.splice(index+1,100);
          let _id=this.crumbsList[index].id;
          this.folderId=_id;
          //请求文件夹下数据
          this.fileImgBoxNavMaterial(type,_id);
        },
        handleScroll(e) {
          //变量scrollTop是滚动条滚动时，距离顶部的距离
          let scrollTop = e.target.scrollTop;
          //变量windowHeight是可视区的高度
          let windowHeight = e.target.clientHeight;
          //变量scrollHeight是滚动条的总高度
          let scrollHeight = e.target.scrollHeight;
          //滚动条到底部的条件
          if(scrollTop+windowHeight==scrollHeight){
            if(this.total>this.totalpage){
              if(this.coverAlert){
                this.suCaiImgData(this.totalpage+1,1,this.folderId);
              }else{
                this.suCaiImgData(this.totalpage+1,3,this.folderId);
              }
            }
            this.totalpage=this.totalpage+1
          }
        },
        suCaiImgData(val,nu,type){
          this.$http({
            url:config.materialUrl+'?parentId='+type+'&pageNo='+val+'&pageSize=12&type='+nu
          }).then((res)=>{
            // console.log(res.data.data.datas.rows);
            let _sucai=res.data.data.datas.rows;
            for(let i=0; i<res.data.data.datas.rows.length; i++){
              _sucai[i].hideState=false;
              if(nu==3){
                this.sucaiList2.push(_sucai[i]);
              }else{
                this.sucaiList.push(_sucai[i]);
              }

            }
          }).catch((err)=>{
            console.log(err)
          })
        },
        cancel(){
          this.$router.push('/content/index?type=3')
        },
        zufuchuli(data,info){
          //视频路径处理
          let video_url=data;
          let video_url2=video_url.split(',');
          let video_url3=video_url2[info];
          return video_url3
        },
        fileImgAscertain(){
           if(this.fileImgBoxNav==2){
             //选择素材时
             if(this.fileImgData[0]){
               let _videoUrl=this.fileImgData[0].split(",");
               this.fileVideoUrl=_videoUrl[0];
               this.formData2.titleFilePath=this.fileImgData[0];
               this.filleVideoAlert=false;
               this.fileImgBoxNav=1;
             }else{
               this.$message('未选择视频');
             }
           }else{
             //选择上传时
             this.filleVideoAlert=false;
           }
        },
        fileImgBoxNavImg(){
          this.fileImgBoxNav=1;
          this.fileImgData=[];
        },
        //素材选择
        materialSelect(index,nu){
          let _sucaiList=null;
          if(nu==1){
            //图片素材
             _sucaiList=this.sucaiList
          }else{
            //视频素材
             _sucaiList=this.sucaiList2
          }
          _sucaiList[index].hideState=!_sucaiList[index].hideState;
          if(_sucaiList[index].hideState){
            this.fileImgData[0]=(_sucaiList[index].accessPath);
            this.formData.videoCover=this.zufuchuli(_sucaiList[index].accessPath,1);
            if(this.zufuchuli(_sucaiList[index].accessPath,2)){
              this.formData.timeLen=this.makeDurationToSeconds(this.zufuchuli(_sucaiList[index].accessPath,2));
            }else{
              this.formData.timeLen=0;
            }

            for(let i=0; i<_sucaiList.length; i++){
              if(i!=index){
                _sucaiList[i].hideState=false
              }
            }
          }else{
            let _index=this.fileImgData.indexOf(_sucaiList[index].accessPath);
            this.fileImgData.splice(_index,1)
          }
        },
        //点击加载素材列表
        fileImgBoxNavMaterial(val,parid){
          if(parid==-1){
            this.folderId=-1;
            this.crumbsList=[];
          }
          this.fileImgBoxNav=2;
          this.$http({
            url:config.materialUrl+'?parentId='+parid+'&pageNo=1&pageSize=12&type='+val
          }).then((res)=>{
            this.totalpage=1;
            this.total=res.data.data.datas.total;
            let _sucai=res.data.data.datas.rows;
            this.folder=res.data.data.folders;
            for(let i=0; i<res.data.data.datas.rows.length; i++){
              _sucai[i].hideState=false;
            }
            if(val==1){
              this.sucaiList=_sucai;
            }else{
              this.sucaiList2=_sucai;
            }

          }).catch((err)=>{
            console.log(err)
          })
        },
          //发表
        clickPublished(){
          // this.formData.videoCover=this.imageUrl;
          let _videoUrl=this.fileVideoUrl.split(",");
          this.formData.covers[0]=_videoUrl[0];
          this.loding_box=true;
          // let _arrTime=this.formData.timeLen.split(":");
          // this.formData.timeLen=_arrTime[0]*3600+_arrTime[1]*60+_arrTime[2];
          // console.log(this.formData.covers);
          this.$http({
            method:'post',
            url:config.getAtlasUrl,
            data:this.formData
          }).then((res)=>{
            // console.log(res.status)
            if(res.status==200){
              this.$message({
                message: '上传成功',
                type: 'success'
              });
              this.$router.push('/content/index?type=3')
            }else{
              this.loding_box=false;
              this.$message(res.message);
            }
          }).catch((err)=>{
            this.loding_box=false;
            this.$message('失败');
            console.log(err)
          })
        },
        //上传成功钩子
        handleAvatarSuccess(res, file){
          this.imageUrl=res.data
        },
        beforeAvatarUpload(){
          this.$message('上传失败!');
        },
        //上传视频成功
        handleAvatarSuccess1(res, file){
          this.schedule=100;
          this.videoSchedule=100;
          this.fileVideoUrl=res.data;
          this.fileVideoName=file.name;
          this.looding=false;
          this.videoLooding=false;
          this.formData2.titleFilePath=res.data;
          this.formData.videoCover=this.zufuchuli(res.data,1);
          let _time=this.zufuchuli(res.data,2);
          // alert(this.zufuchuli(res.data,2))
          this.formData.timeLen=this.makeDurationToSeconds(_time);
        },
        //视频上传前
        beforeUploading(file){
          const isLt2M = file.size / 1024 / 1024 < 100;
          if (!isLt2M) {
            this.$message.error('上传视频大小不能超过 100MB!');
          }else{
            this.videoLooding=true;
            this.filleVideoAlert=false;
          }
          return isLt2M
          // if (['video/mp4', 'video/ogg', 'video/flv','video/avi','video/wmv','video/rmvb'].indexOf(file.type) == -1) {
          //   this.$message.error('请上传正确的视频格式');
          //   this.videoLooding=false;
          //   return false
          // }
        },
        beforeUploading2(file){
          const isLt2M = file.size / 1024 / 1024 < 100;
          if (!isLt2M) {
            this.$message.error('上传视频大小不能超过 100MB!');
          }else{
            this.looding=true;
          }
          return isLt2M
          // if (['video/mp4', 'video/ogg', 'video/flv','video/avi','video/wmv','video/rmvb'].indexOf(file.type) == -1) {
          //   this.$message.error('请上传正确的视频格式');
          //   this.looding=false;
          //   return false
          // }
        },
        //视频上传中
        onTheCross(event, file, fileList){
          this.schedule=0;
          this.schedule=file.percentage.toFixed(0)
        },
        //视频上传中
        videoOnTheCross(event, file, fileList){
          this.videoSchedule=0;
          this.videoSchedule=file.percentage.toFixed(0)
        },
        //关闭上传封面弹窗
        determineCover(){
            if(this.fileImgBoxNav==1){
              this.formData.videoCover=this.imageUrl;
            }else{
              this.formData.videoCover=this.fileImgData[0]
            }
            this.coverAlert=false;
            this.fileImgBoxNav=1;
        },
        clickSaveBtn(){
            this.formData2.title=this.formData.title;
            this.formData2.files[0]=this.formData.videoCover;
            this.loding_box=true;
            this.$http({
              url:this.appbackUrl+config.amendUrl+'?columnType='+this.formData2.columnType
              +'&deviceType='+this.formData2.deviceType
              +'&columnId='+this.formData2.columnId
              +'&createById='+this.formData2.createById
              +'&fileType='+this.formData2.fileType
              +'&files='+this.formData2.files
              +'&title='+this.formData2.title
              +'&content='+this.formData2.content
              +'&titleFilePath='+this.zufuchuli(this.formData2.titleFilePath,0)
              +'&id='+this.formData2.id
              +'&timeLen='+this.formData2.timeLen
            }).then((res)=>{
              if(res.data.status==200){
                this.$router.push('/content/index?type=3')
              }else{
                this.loding_box=false;
                this.$message(res.data.message);
              }
            }).catch((err)=>{
              this.loding_box=false;
              this.$message('操作失败')
            })
        },
      }
    }
</script>

<style scoped>
  @import "../css/fatoutiao.css";
  .fileImg_content1{
    margin-bottom: 144px;
  }
</style>
