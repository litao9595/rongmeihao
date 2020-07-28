<template>
  <div style="padding-bottom: 40px;">
    <div v-if="!list" style="padding: 0px 40px">
      <div class="atlas_btn">
        <el-button @click="clickFileImgBtn()" type="primary">选择图片</el-button>
      </div>
      <div class="figure-upload-note">
        图集功能使用须知：<br>
        1、图集支持绝大部分图片格式，大小不超过5M, 最长边不超过10000像素；<br>
        2、<span class="figure-red">禁止使用图集模式发表文字类、统计图类、gif图、画质粗糙的视频截图</span>，建议使用文章模式发表；<br>
        3、涉及政治敏感、黄色暴力、血腥恐怖等图集，将被删除或不予推荐展示；<br>
        4、鼓励作者发表优质原创图集，包括但不限于图片故事、社会见闻、旅行记录、自然风光、城市掠影、历史照片、艺术摄影等优质内容；详见
        <a class="figure-red" rel="noreferrer noopener" target="_blank" href="">图集内容规范</a>
      </div>
    </div>
    <!--图集列表-->
    <div v-if="list">
      <ul class="atlas_list">
        <li v-for="(fileImgData,index) in fileImgData">
          <div class="gallery-img">
            <img alt="图集" :src="fileImgData.url">
          </div>
          <div class="gallery-txt">
            <textarea v-model="fileImgData.description" placeholder="图片说明（不超过200个字）" maxlength="200"></textarea>
          </div>
          <div class="gallery-action">
            <i class="el-icon-picture" @click="modify(index)"></i>
            <i class="el-icon-delete" @click="deleteList(index)"></i>
          </div>
        </li>
      </ul>
      <div class="add_btn_box">
        <el-button @click="clickFileImgBtn()" type="primary">添加图片</el-button>
        <!--<span>已添加1张图片</span>-->
      </div>
      <div class="edit-cell" style="margin-bottom: 0px;">
          <div class="edit-label">标题：</div>
          <div class="edit-input">
              <div class="article-title-wrap">
                <input type="text" placeholder="标题(5-30个字符)" maxlength="30" v-model="formData.title">
                <!--<span class="article-title-tip">0/30</span>-->
              </div>
          </div>
      </div>
      <!--封面图-->
      <div class="marquee_box">
        <label class="title_name">封面：</label>
        <el-radio-group v-model="formData.fileType">
          <el-radio :label="4">单图</el-radio>
          <el-radio :label="2">三图</el-radio>
          <el-radio :label="0">无图</el-radio>
        </el-radio-group>
      </div>
      <!--封面图上传-->
      <div class="cover_box" v-if="formData.fileType!=0">
        <div class="cover_box1" data-title="单图" v-if="formData.fileType==4">
          <div class="cover_box1_1" @click="setupCover()">
            <i class="el-icon-plus"></i>
            <img v-if="fill" :src="manageCover(fill)[0]">
          </div>
        </div>
        <div class="cover_box2" data-title="三图" v-if="formData.fileType==2">
          <div class="cover_box1_1" @click="setupCover()">
            <i class="el-icon-plus"></i>
            <img v-if="onCoverImg3[0]" :src="onCoverImg3[0]">
          </div>
          <div class="cover_box1_1" @click="setupCover()">
            <i class="el-icon-plus"></i>
            <img v-if="onCoverImg3[1]" :src="onCoverImg3[1]">
          </div>
          <div class="cover_box1_1" @click="setupCover()">
            <i class="el-icon-plus"></i>
            <img v-if="onCoverImg3[2]" :src="onCoverImg3[2]">
          </div>
        </div>
      </div>
      <!--底部 发送按钮-->
      <div class="bottom_box">
        <!--<span>数字 0 (已保存)</span>-->
        <el-button @click="clickrelease()" v-if="!amend" style="width: 98px;" type="primary">发布</el-button>
        <el-button style="width: 98px;" @click="clicktiming" v-if="!amend">定时发布</el-button>
        <el-button @click="clickdraft()" v-if="!amend">存为草稿</el-button>
        <el-button v-if="amend" @click="clickSave" style="width: 98px;" type="primary">保存</el-button>
        <!--<el-button v-if="amend" @click="clickSave">保存</el-button>-->
      </div>
    </div>
    <!--上传图片-->
    <div v-if="fileImgBox" class="file_img_alert">
      <div class="fileImg_box">
        <div class="fileImg_title" style="height: 15px;">
          <i @click="clickFileImg()" class="el-icon-close"></i>
        </div>
        <ul class="fileImg_box_nav">
          <li style="margin-top: 0px;" :class="fileImgBoxNav==1?'active':''" @click="fileImgBoxNavImg">上传文件</li>
          <li style="margin-top: 0px;" v-if="fileType!=4" :class="fileImgBoxNav==2?'active':''" @click="fileImgBoxNavMaterial">素材库</li>
        </ul>
        <div class="fileImg_content" v-if="fileImgBoxNav==1">
          <el-upload
            :action="mediaAssetsUrl"
            list-type="picture-card"
            name="file"
            :data="filleParameter"
            :on-success="handleAvatarSuccess"
            :on-preview="handlePictureCardPreview"
            :before-upload="beforeAvatarUpload"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </div>
        <ul class="fileImg_content" v-if="fileImgBoxNav==2">
          <li :class="itme.hideState?'material':''" v-for="(itme,index) in sucaiList">
            <div class="cheke_icon"></div>
            <img :src="itme.accessPath" @click="materialSelect(index)">
          </li>
        </ul>
        <div class="fileImg_btn">
          <!--<div style="float: left">-->
            <!--<el-form ref="form" label-width="80px">-->
              <!--<el-form-item label="开启水印">-->
                <!--<el-switch v-model="isWatermarks"></el-switch>-->
              <!--</el-form-item>-->
            <!--</el-form>-->
          <!--</div>-->
          <el-button @click="fileImgAscertain()" type="primary">确定</el-button>
        </div>
      </div>
    </div>
    <!--封面图选择-->
    <div class="file_img_alert" v-show="coverListBox">
      <div class="fileImg_box">
        <div class="fileImg_title">
          <i @click="clickdownalert()" class="el-icon-close"></i>
        </div>
        <ul class="fileImg_content" id="cover_number" style="height: 320px;">
          <li @click="clickSetupCover(index)" :class="coverList.state?'cheke_active':''" v-for="(coverList,index) in coverList">
            <div class="cheke_icon"></div>
            <img :src="coverList.url">
          </li>
        </ul>
        <div class="fileImg_btn">
          <el-button type="primary" @click="confirm()">确定</el-button>
        </div>
      </div>
    </div>
    <!--定时发布弹窗-->
    <div class="file_img_alert" v-if="timing">
      <div class="fileImg_box fileImg_box2">
        <div class="fileImg_title">
          <i class="el-icon-close" @click="timing=false"></i>
        </div>
        <div style="margin-left: 20px;">定时发布</div>
        <div class="time_body">
          <label>请选择发布时间：</label>
          <el-date-picker
            v-model="formData.publishTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions"
            placeholder="选择日期时间">
          </el-date-picker>
        </div>
        <div class="fileImg_btn">
          <el-button type="primary" @click="clicktimingData">确定</el-button>
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
    name: "atlas.vue",
    props:['inputName'],
    data(){
      return{
        formData:{
          cagetory:2,
          title:'',
          fileType:0,
          covers:[],
          content: [],
          description:[],
          columnId:44,
          status:0,
          isTimer:2,
          publishTime:'',
          tagId:[]
        },
        formData2:{
          columnType:'',
          deviceType:0,
          columnId:'',
          createById:'',
          fileType:'',
          files:[],
          title:'',
          content:'',
          titleFilePath:'',
          tagId:[],
          id:''
        },
        loding_box:false,
        isWatermarks:false,//是否开启水印
        timing:false,//定时发布弹窗
        fileImgBoxNav:1,//上传弹窗导航类型
        sucaiList:[],//素材列表
        fileType:0,
        amend:false,//是否是修改页
        coverList:[], //文章中图片集
        coverListBox:false, //封面图设置弹框
        onCoverImg:'', //选中单图封面图
        fill:'',//选中单图封面图填充值
        onCoverImg3:[], //选中三图封面图
        titleLength:0,
        fileImgBox:false,
        appbackUrl:this.inputName.appbackUrl,//两微一端
        mediaAssetsUrl:this.inputName.mediaAssetsUrl, //媒资地址
        filleParameter:{
          userName:this.inputName.userNmae,
          waterName:localStorage.waterName
        },//上传文件时所带额外参数


        dialogImageUrl: '',
        dialogVisible: false,
        fileImgData:[], //上传图片视频集合
        serialIndex:0,
        serialType:false, //上传或更改列表图片
        list:false,
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        }
      }
    },
  created:function(){
    let _id = this.$route.query.id;
    if(_id){
      this.amend=true;
      this.formData2.id=_id;
      //修改页图集列表
      this.$http({
        url:localStorage.appbackUrl+config.atlasDetailsUrl+'?parentContentId='+_id
      }).then((res)=>{
        // console.log(res.data);
        let arr=[];
        for(let i=0; i<res.data.data.length; i++){
          let obj={};
          obj.description=res.data.data[i].title;
          obj.url=res.data.data[i].titleFilePath;
          obj.id=res.data.data[i].id;
          arr.push(obj)
        }
        this.fileImgData=arr;
        this.list=true;
      }).catch((err)=>{
        console.log(err)
      });
      //修改页图 封面图 标题
      this.$http({
        url:localStorage.appbackUrl+config.graphicDetailsUrl+'/'+_id
      }).then((res)=>{

        this.formData.title=res.data.data.title;
        let file_type=res.data.data.fileType;
        if(file_type==1){
          this.formData.fileType=4;
          this.fill=res.data.data.titleFilePath;
        }else if(file_type==2){
          this.formData.fileType=2;
          let imgArr=res.data.data.titleFilePath.split(",");
          this.onCoverImg3=imgArr;
        }else{
          this.formData.fileType=0
        }

        this.formData2.columnType=res.data.data.columnType;
        this.formData2.deviceType=res.data.data.deviceType;
        this.formData2.columnId=res.data.data.columnId;
        this.formData2.createById=res.data.data.createById;
        this.formData2.fileType=res.data.data.fileType;
        this.formData2.titleFilePath=res.data.data.titleFilePath;

        // if(res.data.data.fileType==4){
        //   this.fill=res.data.data.titleFilePath;
        // }else if(res.data.data.fileType==2){
        //     let imgArr=res.data.data.titleFilePath.split(",");
        //     this.onCoverImg3=imgArr;
        // }

      }).catch((err)=>{
        console.log(err)
      })

    }

  },
  methods:{
    //发布成功跳转
    jumpUrl(){
      this.$router.push({path:'/content/index',query:{type:2}});
    },
    //素材选择
    materialSelect(index){
      if(this.serialType){
        //更改图片
        for(let i=0; i<this.sucaiList.length; i++){
          this.sucaiList[i].hideState=false
        }
        this.sucaiList[index].hideState=!this.sucaiList[index].hideState;
        let original_img=this.fileImgData[this.serialIndex].url;
        if(this.sucaiList[index].hideState){
          if(this.isWatermarks){
            // alert('水印');
            this.fileImgData[this.serialIndex].url=this.theWatermark(this.sucaiList[index].accessPath).toString()
          }else{
            // alert('关闭')
            this.fileImgData[this.serialIndex].url=this.sucaiList[index].accessPath
          }
        }else{
          this.fileImgData[this.serialIndex].url=original_img;
        }
      }else{
        //增加图片
        this.sucaiList[index].hideState=!this.sucaiList[index].hideState;
        if(this.sucaiList[index].hideState){
          let _obj={};
          if(this.isWatermarks){
            _obj.url=this.theWatermark(this.sucaiList[index].accessPath).toString();
          }else{
            _obj.url=this.sucaiList[index].accessPath;
          }
          _obj.description="";
          this.fileImgData.push(_obj)
        }else{
          let _index=this.fileImgData.indexOf(this.sucaiList[index].accessPath);
          this.fileImgData.splice(_index,1)
        }
      }
    },
    //点击加载素材列表
    fileImgBoxNavMaterial(){
      this.fileImgBoxNav=2;
      this.$http({
        url:config.materialUrl+'?parentId=-1&pageNo=1&pageSize=100&type=1'
      }).then((res)=>{
        let _sucai=res.data.data.datas.rows;
        for(let i=0; i<res.data.data.datas.rows.length; i++){
          _sucai[i].hideState=false;
        }
        this.sucaiList=_sucai;
      }).catch((err)=>{
        console.log(err)
      })
    },
    fileImgBoxNavImg(){
      this.fileImgBoxNav=1;
      // this.fileImgData=[];
    },
    clickSave(){
      this.formData2.title=this.formData.title;
      // this.formData2.files=this.formData.covers;
      if(this.formData.fileType==4){
        this.formData2.files=this.fill;
      }else if(this.formData.fileType==2){
        this.formData2.files=this.onCoverImg3
      }
      this.formData2.content=this.formData.content;
      let _titleFilePath=[];
      let _description=[];
      for(let i=0; i<this.fileImgData.length; i++){
        _titleFilePath.push(this.fileImgData[i].url);
        _description.push(this.fileImgData[i].description);
      }
      this.formData2.titleFilePath=_titleFilePath;
      let file_type=this.formData2.fileType;
      if(file_type==4){
        this.formData.fileType=1;
      }else if(file_type==2){
        this.formData.fileType=2
      }else{
        this.formData.fileType=0
      }
      this.loding_box=true;
      this.$http({
        url:this.appbackUrl+config.amendUrl
        +'?columnType='+this.formData2.columnType
        +'&deviceType='+this.formData2.deviceType
        +'&columnId='+this.formData2.columnId
        +'&createById='+this.formData2.createById
        +'&fileType='+this.formData2.fileType
        +'&files='+this.formData2.files
        +'&title='+this.formData2.title
        +'&content='+this.formData2.content
        // +'&titleFilePath='+this.formData2.files
        +'&titleFilePath='+this.formData2.titleFilePath
        +'&id='+this.formData2.id
        +'&description='+_description
        // data:this.formData2
      }).then((res)=>{
        if(res.data.status==200){
          this.$router.push('/content/index?type=2')
        }else{
          this.loding_box=false;
          this.$message(res.data.message);
        }
      }).catch((err)=>{
        this.loding_box=false;
        this.$message('操作失败')
      })
    },
    manageCover(val){
      let s=val.split(',');
      return s
    },
    getSubmit:function(){
      this.loding_box=true;
      if(this.formData.fileType==0){
        this.formData.covers=[];
      }
      for(let i=0; i<this.fileImgData.length; i++){
        this.formData.content.push(this.fileImgData[i].url);
        this.formData.description.push(this.fileImgData[i].description);
      }
      this.$http({
        method:'post',
        url:config.getAtlasUrl,
        data:this.formData
      }).then((res)=>{
        if(res.data.status==500){
          if(res.data.message=='数据长度不匹配'){
            this.loding_box=false;
            this.$message('请输入图片描述');
          }else{
            this.$message(res.data.message);
            this.loding_box=false;
          }
        }else{
          this.$message({
            showClose: true,
            message: '发送成功!',
            type: 'success'
          });
          this.$router.push('/content/index?type=2')
        }
      }).catch(function(err){
        console.log(err)
      })
    },
    clickrelease:function(){
      this.formData.status=2;
      this.formData.isTimer=2;
      this.getSubmit()
    },
    //显示定时发布弹窗
    clicktiming:function(){
      this.timing=true;
    },
    //定时发布
    clicktimingData(){
      if(this.formData.publishTime){
        this.formData.status=1;
        this.formData.isTimer=1;
        this.getSubmit();
        this.timing=false
      }else{
        this.$message('时间不能为空！');
      }
    },
    clickdraft:function(){
      this.formData.status=0;
      this.formData.isTimer=2;
      this.getSubmit()
    },
    clickdownalert:function(){
      //关闭封面图弹窗
      this.coverListBox=false
    },
    clickSetupCover:function(index){
      if(this.formData.fileType==4){
        //单张封面图
        this.coverList[index].state=!this.coverList[index].state;
        this.onCoverImg=this.coverList[index].url;
        for(let i=0; i<this.coverList.length; i++){
          if(i!=index){
            this.coverList[i].state=false
          }
        }
      }else if(this.formData.fileType==2){
        //选择多张封面图
        if(this.coverLimit<3){
          this.coverList[index].state=!this.coverList[index].state;
        }else{
          this.coverList[index].state=false
        }
        let selectedNumber=0;
        for(let i=0; i<this.coverList.length; i++){
          if(this.coverList[i].state){
            selectedNumber+=1
          }
        }
        this.coverLimit=selectedNumber;
      }
    },
    confirm:function(){
      this.formData.covers=[];
      this.onCoverImg3=[];
      if(this.formData.fileType==4){
        this.formData.covers.push(this.onCoverImg);
        this.fill=this.onCoverImg;
      }else if(this.formData.fileType==2){
        for(let i=0; i<this.coverList.length; i++){
          if(this.coverList[i].state){
            this.onCoverImg3.push(this.coverList[i].url)
          }
        }
        this.formData.covers=this.onCoverImg3;
        this.fill=""
      }
      this.coverListBox=false
    },
    modify:function(index){
      this.fileImgBox=true;
      this.serialIndex=index;
      this.serialType=true;
    },
    deleteList:function(index){
      //删除指定列表
      this.fileImgData.splice(index,1);
      if(this.fileImgData.length<1){
        this.list=false
      }
    },
    clickFileImgBtn:function(){
      //点击图片上传按钮
      this.fileImgBox=true;
      this.serialType=false;
    },
    clickFileImg:function(){
      this.fileImgBox=false
    },
    theWatermark(data){
      //开启水印图片路径
      let _imgurltao=data;
      let _imgurlArrtao=_imgurltao.split(".");
      let _lenth=_imgurlArrtao.length;
      _imgurlArrtao[_lenth-2]=_imgurlArrtao[_lenth-2]+'_w';
      let _imgurlval=_imgurlArrtao.join(".");
      // _imgurlval=_imgurlval.toString();
      return _imgurlval
    },
    handleAvatarSuccess(res, file){
      // console.log('成功')
      if(this.serialType){
        this.fileImgData[this.serialIndex].url=res.data
      }else{
        let _obj={};
        if(this.isWatermarks){
          //开启水印图片路径
          // let _imgurltao=res.data;
          // let _imgurlArrtao=_imgurltao.split(".");
          // let _lenth=_imgurlArrtao.length;
          // _imgurlArrtao[_lenth-2]=_imgurlArrtao[_lenth-2]+'_w';
          // let _imgurlval=_imgurlArrtao.join(".");
          // _obj.url=_imgurlval.toString();
          _obj.url=this.theWatermark(res.data).toString();
        }else{
          _obj.url=res.data;
        }
        _obj.description="";
        this.fileImgData.push(_obj);
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleRemove(file, fileList) {
      //移除时
      if(this.serialType){
        //点击更改按钮时
      }else{
        let fileListData=[];
        for(let i=0; i<fileList.length; i++){
          let _obj={};
          _obj.url=fileList[i].response.data;
          _obj.description="";
          fileListData.push(_obj)
        }
        this.fileImgData=fileListData
      }
    },
    fileImgAscertain(){
      if(this.fileImgData.length==0){
        this.$message({
          showClose: true,
          message: '还未上传图片'
        });
      }else{
        this.fileImgBox=false;
        this.list=true
      }
    },
    beforeAvatarUpload(file){
      //限制上传图片大小
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
      }
      return isLt2M;
    },
    setupCover:function(){
      let _img=$(".atlas_list img");
      let _coverList=[];
      for(let i=0; i<_img.length; i++){
        let listConten={};
        listConten.url=_img.eq(i).attr("src");
        listConten.state=false;
        _coverList.push(listConten)
      }
      this.coverList=_coverList;
      this.coverListBox=true;
    },
  }
}
</script>

<style scoped>
  @import "../css/fatoutiao.css";
  .marquee_box .title_name{
    width: 100px;
  }
</style>
