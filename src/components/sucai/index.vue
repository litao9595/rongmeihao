<template>
  <div style="background: #fff;" :style="{minHeight:minHeight+'px'}">
      <div class="head_menu">
        <ul class="material_nav">
          <li @click="clickNav(index)" v-for="(navList,index) in navList" :class="navActive==index?'active':''">{{navList.name}}</li>
        </ul>
        <div class="head_menu_right">
          <div class="folder_add_btn" style="height: 33px;" @click="grouping()">添加分组</div>
          <div class="folder_add_btn">
            <el-upload
              class="upload-demo"
              :data="filleParameter"
              :name="filleParameterName"
              :accept="acceptData"
              :show-file-list="false"
              :multiple="true"
              :action="mediaAssetsUrl_1"
              :on-progress="startUpload "
              :on-success="handleChange">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </div>
        </div>
      </div>
      <div class="list_content">
        <!--面包屑导航-->
        <div class="crumbs_box" v-if="crumbsList.length">
          <div @click="crumbsRootClick">
              <span>{{crumbsRoot.name}}</span>
          </div>
          <div v-for="(crumbsList,index) in crumbsList" @click="crumbsListClick(index)">
              <span>/ {{crumbsList.name}}</span>
          </div>
        </div>
          <!--<p class="title">分组</p>-->
          <ul class="folder_list">
              <li v-for="(folder,index) in folder">
                  <div class="icon_img" @dblclick="openFolder(index)"><i class="fontFamily hhtxweibiaoti5"></i></div>
                  <p class="folder_name" style="text-align: center; width: 100%">{{folder.name}}</p>
                  <div class="folder_btn_box">
                    <span @click="groupingRemove(index)">删除</span>
                  </div>
              </li>
              <!--添加分组-->
              <!--<li>-->
                  <!--<div class="add_grouping" @click="grouping()">-->
                    <!--<i class="el-icon-plus"></i>-->
                    <!--<p>添加分组</p>-->
                  <!--</div>-->
              <!--</li>-->
          </ul>
          <!--<div class="folder_add_btn">-->
            <!--<el-upload-->
              <!--class="upload-demo"-->
              <!--:data="filleParameter"-->
              <!--:name="filleParameterName"-->
              <!--:show-file-list="false"-->
              <!--:multiple="true"-->
              <!--:action="mediaAssetsUrl_1"-->
              <!--:on-progress="startUpload "-->
              <!--:on-success="handleChange">-->
              <!--<el-button size="small" type="primary">点击上传</el-button>-->
            <!--</el-upload>-->
          <!--</div>-->
          <!--图片-->
          <ul class="list_box" v-if="formData.type==1">
            <li v-for="(listImg,index) in listImg">
              <div class="thumbnail_box">
                <img :src="suolue(listImg.accessPath)" @click="clickshowPreviewImg(index)">
                <!--<img :src="listImg.accessPath">-->
              </div>
              <p class="name_box" @click="clickmMterial(index)">{{listImg.name}}</p>
              <div class="operation_box">
                  <div>{{listImg.createDate.split(" ")[0]}}</div>
                  <div>
                    <i class="el-icon-delete" @click="imgRemove(index)"></i>
                  </div>
              </div>
            </li>
          </ul>
          <!--音频-->
          <ul class="list_box2" v-if="formData.type==2">
              <li v-for="(listImg,index) in listImg">
                <div @click="playclick(index)" class="list_box2_audio">
                  <img v-if="listImg.play" src="../../images/icon/voice_icon_on.png">
                  <img v-else src="../../images/icon/voice_icon.png">
                  <audio v-if="listImg.play" autoplay :src="listImg.accessPath"></audio>
                  <!--<audio autoplay :src="listImg.accessPath"></audio>-->
                </div>
                <div class="list_box2_name" @click="clickmMterial(index)">{{listImg.name}}</div>
                <div class="list_box2_time">{{listImg.createDate.split(" ")[0]}}</div>
                <div class="list_box2_btn"><span @click="imgRemove(index)">删除</span></div>
              </li>
          </ul>
          <!--视频-->
          <ul class="list_box" v-if="formData.type==3">
          <li v-for="(listImg,index) in listImg">
            <div class="thumbnail_box" @click="openVideo(index)">
              <video :src="zufuchuli(listImg.accessPath)"></video>
            </div>
            <p class="name_box" @click="clickmMterial(index)">{{listImg.name}}</p>
            <div class="operation_box">
              <div>{{listImg.createDate.split(" ")[0]}}</div>
              <div>
                <i class="el-icon-delete" @click="imgRemove(index)"></i>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <!--新增分组弹框-->
      <el-dialog
        title="新增分组"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose">
        <div class="demo-input-suffix">
          <label>分组名：</label>
          <div class="input">
            <el-input
              placeholder="请输入分组名"
              v-model="addName"
              clearable>
            </el-input>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="groupingAdd()">确 定</el-button>
        </span>
      </el-dialog>
      <!--新增图片素材弹框-->
    <el-dialog
      title="新增图片"
      :visible.sync="dialogVisible1"
      width="30%"
      :before-close="handleClose1">
      <div class="demo-input-suffix">
        <label>文件名：</label>
        <div class="input">
          <el-input
            placeholder="请输入文件名"
            v-model="addName1"
            clearable>
          </el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible1 = false">取 消</el-button>
            <el-button type="primary" @click="groupingAdd1()">确 定</el-button>
        </span>
    </el-dialog>
    <!--翻页-->
    <div class="advance" v-if="total>1">
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="handleCurrentChange6"
        :page-size="12"
        :page-count="total">
      </el-pagination>
    </div>
    <!--<materialList></materialList>-->
    <!--上传中loding-->
    <div class="jindu_box" v-if="loading">
      <div class="jindu_box_content">
          <div><i style="font-size: 30px;" class="el-icon-loading"></i></div>
          <p style="margin-top: 20px;">上传中</p>
      </div>
    </div>
    <!--视频播放弹窗-->
    <div class="video_alert" v-if="videoBox">
        <div class="video_alert_content">
          <div class="video_alert_btn"><i class="el-icon-close" @click="upOpenVideo()"></i></div>
          <div class="video_alert_body">
            <video style="width: 100%; height: 100%" :src="zufuchuli(videoUrl)" controls="controls"></video>
          </div>
        </div>
    </div>
    <!--图文type=1 小视频type=2-->
    <!--预览大图-->
    <div class="video_alert" v-if="showPreviewImg">
        <div class="preview_img">
            <img :src="showPreviewImgUrl">
            <i class="el-icon-close" @click="clickHiedPreviewImg"></i>
        </div>
    </div>
    <!--修改素材名弹框-->
    <el-dialog
      title="修改名称"
      :visible.sync="materialStutas"
      width="30%"
      :before-close="mterialClose">
      <div class="demo-input-suffix">
        <label>素材名：</label>
        <div class="input">
          <el-input
            placeholder="请输入素材名"
            v-model="materialName"
            clearable>
          </el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
            <el-button @click="materialStutas = false">取 消</el-button>
            <el-button type="primary" @click="modifyName()">确 定</el-button>
        </span>
    </el-dialog>

  </div>
</template>

<script>
  import {config} from "../../router/httpConfig.js"
  import {mapState} from 'vuex'
    export default {
        name: "index.vue",
      data(){
          return{
            acceptData:'image/*',
            showPreviewImg:false,
            showPreviewImgUrl:'',
            formData:{
              parentId:-1,//所属文件夹id
              name:'',//文件名
              folder:1,//0文件 1文件夹
              accessPath:'',//访问路径
              fileSize:'',//文件大小
              suffix:'',//文件后缀
              type:1,//1图片2音频3视频
              timeLen:'',//音频时长
              cover:'',//视频封面
              areaId:0
            },
            navList:[
              {name:'图片',type:1},
              {name:'音频',type:2},
              {name:'视频',type:3}
            ],
            crumbsRoot:{
              name:'图片'
            },
            navActive:0,//导航默认选中
            dialogVisible: false, //新增分组弹窗
            dialogVisible1: false, //新增图片弹窗
            addName:'',//新增分组名
            addName1:'',//新增图片名
            folder:[
              // {name:'文件名1',id:111}
            ],//文件夹列表
            listImg:[],//图片列表
            listAudio:[
              // {name:'语音名称',id:1,time:'2019-04-24',
              //   play:false,
              //   accessPath:'http://10.143.132.242:8064/upload/material/audio/e8b44c6a7f934a28b903e5a922d5db77.mp3'}
            ],//音频列表
            sucaiUrl:config.materialAddUrl,
            appbackUrl:'',//两微一端
            mediaAssetsUrl:'',//媒资域名地址
            mediaAssetsUrl_1:'',//上传文件路径
            mediaAssetsUrl_2:'',
            loading:false,
            videoBox:false,
            videoUrl:'',
            total:1,
            crumbsList:[
              // {name:'图片',id:''},
            ],//面包屑导航
            filleParameter:{
              userName:'用户名',
              waterName:'融媒',
              areaId:0
            },//上传文件时所带额外参数
            filleParameter2:{
              userName:'用户名',
              waterName:'融媒',
              areaId:0
            },//上传文件时所带额外参数
            filleParameterName:'file',//上传文件upload 上传图片file
            minHeight:this.common.getWindowHeight(),
            materialStutas:false,//修改素材名弹框
            materialName:'',
            materialId:'',
          }
      },
      beforeCreate:function(){
        //获取用户信息
        this.$http({
          url:config.userUrl
        }).then((res)=>{
          this.filleParameter.userName=res.data.data.nickName;
          this.filleParameter2.userName=res.data.data.nickName;
          if(res.data.data.areaId==null){
            this.formData.areaId=0;
            this.filleParameter.areaId=0
            this.filleParameter2.areaId=0
          }else{
            this.formData.areaId=res.data.data.areaId;
            this.filleParameter.areaId=res.data.data.areaId;
            this.filleParameter2.areaId=res.data.data.areaId;
          }
        }).catch((err)=>{
          console.log(err)
        });
        //获取域名
        this.$http({
          url:config.globalUrl,
        }).then((res)=>{
          // console.log(res.data)
          this.appbackUrl=res.data.data.appbackUrl;
          this.mediaAssetsUrl_2=res.data.data.mediaAssetsUrl+config.uploadPicture;
          this.mediaAssetsUrl=res.data.data.mediaAssetsUrl;
          this.filleParameter.waterName=res.data.data.nickName;
          this.mediaAssetsUrl_1=res.data.data.mediaAssetsUrl+config.watermarkImg
        }).catch((err)=>{
          // console.log(err)
        });

        //初始化页面列表
        this.$http({
          url:config.materialUrl+'?parentId=-1&pageNo=1&pageSize=12&type=1'
        }).then((res)=>{
          // console.log(res.data.data);
          this.total=res.data.data.datas.total;
          this.listImg=res.data.data.datas.rows;
          this.folder=res.data.data.folders
        }).catch((err)=>{
          // console.log(err)
        })
      },
      methods:{
        clickHiedPreviewImg(){
          this.showPreviewImg=false;
        },
        clickshowPreviewImg(index){
            this.showPreviewImgUrl=this.listImg[index].accessPath;
            this.showPreviewImg=true;
        },
        suolue(url){
          let _imgurltao=url;
          let _imgurlArrtao=_imgurltao.split(".");
          let _lenth=_imgurlArrtao.length;
          _imgurlArrtao[_lenth-2]=_imgurlArrtao[_lenth-2]+'_t';
          let _imgurlval=_imgurlArrtao.join(".");
          return _imgurlval
        },
        upOpenVideo(){
          this.videoBox=false
        },
        openVideo(index) {
          this.videoUrl=this.listImg[index].accessPath;
          this.videoBox=true;
        },
        playclick(index){
          this.listImg[index].play=!this.listImg[index].play
        },
        grouping(){
          //分组
          this.formData.folder=1;
          this.dialogVisible=true
        },
        handleClose(){
          this.dialogVisible=false
        },
        handleClose1(){
          this.dialogVisible1=false
        },
        listInitialize(){
          //初始化页面列表
          this.$http({
            url:config.materialUrl+'?parentId='+this.formData.parentId+'&pageNo=1&pageSize=12&type='+this.formData.type+'&areaId='+this.formData.areaId
          }).then((res)=>{
            // console.log(res.data.data);
            this.total=res.data.data.datas.total;
            this.listImg= res.data.data.datas.rows;
            // this.folder=res.data.data.folders
          }).catch((err)=>{
            // console.log(err)
          })
        },
        groupingAdd1(){
          //新增图片
          this.$http({
            method:'post',
            url:config.materialAddUrl,
            data:this.formData
          }).then((res)=>{
            // console.log(res)
            this.dialogVisible1=false;
            //初始化页面列表
            let _this=this;
            setTimeout(function(){
              _this.listInitialize()
            },1000);
            // this.listInitialize();
          }).catch((err)=>{
            // console.log(err)
          });
        },
        groupingAdd(){
          //新增分组
          if(this.addName){
            this.formData.name=this.addName;
            //添加素材
            this.$http({
              method:'post',
              url:config.materialAddUrl,
              data:this.formData
            }).then((res)=>{
              let _add={};
              _add.name=this.addName;
              _add.id=res.data.data;
              this.folder.push(_add);
              this.dialogVisible=false;
              this.addName=''
            }).catch((err)=>{
              // console.log(err)
            })
          }else{
            this.$message('组名不能为空');
          }
        },
        imgRemove(index){
          //删除图片
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http({
              url:config.deleteMaterial+'?id='+this.listImg[index].id+'&type='+this.formData.type+'&areaId='+this.formData.areaId
            }).then((res)=>{
              //初始化页面列表
              this.listInitialize();
            }).catch((err)=>{
              // console.log(err)
            });
            this.listImg.splice(index,1)
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        },
        groupingRemove(index){
          //删除分组
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http({
              url:config.deleteMaterial+'?id='+this.folder[index].id+'&type='+this.formData.type+'&areaId='+this.formData.areaId
            }).then((res)=>{
              // console.log(res)
            }).catch((err)=>{
              // console.log(err)
            });
            this.folder.splice(index,1)
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        },
        clickNav:function(index){
          //导航切换
          if(index==0){
            this.mediaAssetsUrl_1=this.mediaAssetsUrl+config.watermarkImg;
            this.filleParameterName='file';
            this.filleParameter=this.filleParameter2;
          }else{
            this.mediaAssetsUrl_1=this.mediaAssetsUrl+config.uploadUrl+'?userName='+this.filleParameter.userName+'&waterName='+this.filleParameter.waterName+'&areaId='+this.formData.areaId;
            this.filleParameterName='upload';
            this.filleParameter={};
          }
          this.crumbsRoot.name=this.navList[index].name;
          this.navActive=index;
          this.formData.type=index+1;
          this.crumbsList=[];
          this.listImg=[];
          this.templateData();
        },
        zufuchuli(data){
          //视频路径处理
          let video_url=data;
          let video_url2=video_url.split(',');
          let video_url3=video_url2[0];
          return video_url3
        },
        templateData(){
          this.$http({
            url:config.materialUrl+'?parentId=-1&pageNo=1&pageSize=12&type='+this.formData.type+'&areaId='+this.formData.areaId
          }).then((res)=>{
            console.log(res.data.data);
            this.total=res.data.data.datas.total;
            this.folder=res.data.data.folders;
            if(this.formData.type==1){
              //图片
              this.acceptData='image/*';
              this.listImg=res.data.data.datas.rows;
            }else if(this.formData.type==2){
              //音频
              this.acceptData='audio/*';
              var _arr=res.data.data.datas.rows;
              for(let i=0; i<_arr.length; i++){
                _arr[i].play=false
              }
              this.listImg=_arr
            }else if(this.formData.type==3){
              //视频
              this.acceptData='video/mp4,video/ogg,video/flv,video/avi,video/wmv,video/rmvb';
              this.listImg=res.data.data.datas.rows;
            }
          }).catch((err)=>{
            // console.log(err)
          })
        },
        crumbsRootClick(){
          //点击面包屑导航根目录
          this.templateData();
          this.crumbsList=[]
        },
        crumbsListClick(index){
          //点击面包屑导航
          this.crumbsList.splice(index+1,100);
          this.$http({
            url:config.materialUrl+'?parentId='+this.crumbsList[index].id+'&pageNo=1&pageSize=12'+'&areaId='+this.formData.areaId,
          }).then((res)=>{
            // console.log(res.data.data);
            this.total=res.data.data.datas.total;
            this.listImg=res.data.data.datas.rows;
            this.folder=res.data.data.folders
          }).catch((err)=>{
            // console.log(err)
          })
        },
        openFolder(index){
          //进入文件夹
          let obj={};
          obj.name=this.folder[index].name;
          obj.id=this.folder[index].id;
          this.crumbsList.push(obj);
          this.formData.parentId=this.folder[index].id;
          this.$http({
            url:config.materialUrl+'?parentId='+this.formData.parentId+'&pageNo=1&pageSize=12'+'&areaId='+this.formData.areaId+'&type='+this.formData.type,
          }).then((res)=>{
            // console.log(res.data.data);
            this.total=res.data.data.datas.total;
            if(this.formData.type==2){
              let _arr=res.data.data.datas.rows;
              for(let i=0; i<_arr.length; i++){
                _arr[i].play=false
              }
              this.listImg=_arr;
            }else{
              this.listImg=res.data.data.datas.rows;
            }
            this.folder=res.data.data.folders
          }).catch((err)=>{
            // console.log(err)
          })
        },
        startUpload(){
          //开始上传
          this.loading=true;
        },
        handleChange(file, fileList){
          // 上传成功
          if(this.formData.type==3){
            let video_url=file.data;
            let video_url2=video_url.split(',');
            this.formData.cover=video_url2[1];
          }
          this.formData.accessPath=file.data;
          this.formData.folder=0;
          let three=fileList.name.split(".");
          let last=three[three.length-1];
          this.formData.suffix=last;
          this.formData.name=three[three.length-2];
          this.formData.folder=0;
          this.groupingAdd1();
          // this.dialogVisible1=true ;//弹出新增图片名称
          this.loading=false
        },
        handleCurrentChange6(val) {
          //翻页
          this.$http({
            url:config.materialUrl+'?parentId='+this.formData.parentId+'&pageNo='+val+'&pageSize=12'+'&areaId='+this.formData.areaId,
          }).then((res)=>{
            // console.log(res.data.data);
            this.listImg=res.data.data.datas.rows;
            // this.folder=res.data.data.folders
          }).catch((err)=>{
            // console.log(err)
          })


        },
        mterialClose(){
          this.materialStutas=false;
        },
        clickmMterial(index){
          this.materialName=this.listImg[index].name;
          this.materialId=this.listImg[index].id;
          this.materialStutas=true;
        },
        //修改素材名
        modifyName(){
          let _this=this;
          $.ajax({
            url:config.rename,
            data:{
              id:this.materialId,
              name:this.materialName,
              type:this.formData.type,
            },
            success:res=>{
              if(res.status==200){
                this.templateData();
              }else{
                this.$message({
                  type: 'info',
                  message: res.message
                });
              }
              _this.materialStutas=false;
            }
          })
        },

      }
    }

</script>

<style scoped>
  @import "../css/sucai.css";
</style>
