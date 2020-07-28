<template>
    <div>
      <div class="main-box">
          <div class="head-box">
              <span @click="fliePoup=true">新增</span>
          </div>
          <div class="table-head table-row">
              <div class="line-1">课程名称</div>
              <div class="line-2">内容名称</div>
              <div class="line-2">审核状态</div>
              <div class="line-2">内容状态</div>
              <div class="line-3">操作</div>
          </div>
          <div class="body-box" v-for="(item,i) in courseList" :key="i">
            <div class="table-body table-row">
              <div class="line-1">{{item.courseName}}</div>
              <div class="line-2">{{item.fileName}}</div>
              <!--0待提交 1待审核 2通过 3未通过-->
              <div class="line-2" v-if="item.checkStatus==0">待提交</div>
              <div class="line-2" v-if="item.checkStatus==1">待审核</div>
              <div class="line-2" v-if="item.checkStatus==2">通过</div>
              <div class="line-2" v-if="item.checkStatus==3">未通过</div>
              <!--0待上架,1上架,2下架',-->
              <div class="line-2" v-if="item.upDownStatus==0">待上架</div>
              <div class="line-2" v-if="item.upDownStatus==1">上架</div>
              <div class="line-2" v-if="item.upDownStatus==2">下架</div>
              <div class="line-3">
                <span @click="seeClick(i)">查看</span>
                <span v-if="item.upDownStatus==0 || item.upDownStatus==2" @click="upperShelf(i,'1')">上架</span>
                <span v-if="item.upDownStatus==1" @click="upperShelf(i,'2')">下架</span>
                <span v-if="item.checkStatus==0" @click="operationSubmit(i)">提交</span>
                <span @click="deletCurriculum(i)">删除</span>
              </div>
            </div>
          </div>
          <!--翻页-->
        <div class="page-turning">
          <el-pagination
            background
            layout="prev, pager, next"
            @current-change="handleCurrentChange"
            :total="pageTurning.total">
          </el-pagination>
        </div>
      </div>
      <!--新增弹框-->
      <div class="poup-box" v-show="fliePoup">
        <div class="poup-body">
          <p class="close-box"><i @click="fliePoup=false" class="el-icon-close"></i></p>
          <p class="tishi">注意：我们会已你上传的文件名称作为内容名称，请先编辑好文见名称</p>
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="关联课程">
              <el-select v-model="form.region" placeholder="请选择活动区域">
                <el-option style="padding-left: 20px" @click="deletFileVideo(i)" v-for="(item,i) in relation" :label="item.courseName" :value="item.id" :key="item"></el-option>
                <!--<el-option style="padding-left: 20px" label="区域二" value="beijing"></el-option>-->
              </el-select>
            </el-form-item>
          </el-form>
          <ul class="list-box">
            <li v-for="(item,i) in fileList" :key="i">
              <div class="left">
                <span>{{i+1}}.</span>
                <span>{{item.name1}}</span>
                <span>{{item.name2}}</span>
                <span v-if="item.fileSuccse">上传完成</span>
                <i class="el-icon-error" @click="fileDelete(i)" v-if="item.fileSuccse"></i>
              </div>
              <div class="right" v-if="!item.fileSuccse">
                <el-progress :percentage="item.toFixed"></el-progress>
              </div>
            </li>
          </ul>
          <div class="file-box">
              <div class="left">添加内容</div>
              <div class="right">
                <i class="el-icon-plus"></i>
                <div class="file-file">
                  <el-upload style="width: 50px; height: 50px;"
                    accept="video/*"
                    name="upload"
                    :action="uploadUrl"
                    :on-error="shibai"
                    :before-upload="qian"
                    :on-progress="handleRemove"
                    :on-success="beforeUploading">
                    <el-button size="small" type="primary">点击上传</el-button>
                  </el-upload>
                </div>
              </div>
          </div>
          <el-row class="btn-box">
            <el-button class="btn" @click="saveSubmitBtn(0)">保存</el-button>
            <el-button class="btn" type="primary" @click="saveSubmitBtn(1)">提交</el-button>
          </el-row>
        </div>
      </div>
      <!--查看弹框--->
      <div class="poup-box" v-show="seeVideo">
        <div class="poup-body">
          <p class="close-box"><i @click="seeVideo=false" class="el-icon-close"></i></p>
          <div class="video-box">
            <video :src="videoUrl" controls="controls"></video>
          </div>
        </div>
      </div>
      <!--looding-->
      <div v-if="fileStatuslooding" class="poup-box" style="background: none">
        <div class="loading-img"><i class="el-icon-loading"></i></div>
      </div>
    </div>
</template>

<script>
  import {config,curriculum} from "../../router/httpConfig.js"
export default {
    name: "index.vue",
  data(){
      return{
        form: {
          region: '',
        },
        uploadUrl:'',//上传地址
        fileList:[
          // {name1:'关联课程',name2:'xxx.mp4',url:'',toFixed:"100",fileSuccse:true}
        ],//已上传文件列表
        fliePoup:false,//上传弹框
        courseList:[],//课程列表
        pageTurning:{},
        teacherId:'',//教师Id
        relation:[],//关联课程列表
        seeVideo:false,//查看视频弹框
        videoUrl:'',//播放视频地址
        fileStatus:true,//上传状态
        fileStatuslooding:false,
      }
  },
  created(){
      this.teacherId=sessionStorage.teacherId;
      // this.teacherId=41;
      if(sessionStorage.teacherId=="null" || sessionStorage.teacherId=="undefined"){
        this.$alert('您暂未开通此功能', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            this.$message({
              type: 'info',
              message: `action: ${ action }`
            });
          }
        });
      }
      this.uploadUrl='http://fsunifiedrelease-api.yd-data.com:8064'+config.uploadUrl;
      this.getCourseList(1);
      this.relationCurriculum();
  },
  methods:{
    //删除上传视频
    deletFileVideo(index){
      // this.relation
      this.relation.remove(this.relation(index));
    },
    //查看视频
    seeClick(index){
      this.seeVideo=true;
      this.videoUrl=this.courseList[index].fileUrl
    },
    //课程翻页
    getCourseList(page){
      let _this=this;
      this.$http({
        url:curriculum.curriculumList+'?pageSize=10&id='+this.teacherId+'&pageNo='+page,
      }).then(res=>{
        _this.courseList=res.data.data.list;
        _this.pageTurning=res.data.data;
      })
    },
    //操作 栏提交
    operationSubmit(index){
      let _this=this;
      this.$http({
        url:curriculum.updateCheckStatusById+'?id='+this.courseList[index].id
      }).then(res=>{
        _this.getCourseList(_this.pageTurning.pageNum)
      })
    },
    //上下架
    upperShelf(index,str){
      let _this=this;
      this.$http({
        url:curriculum.updateUpDownStatusById+'?id='+this.courseList[index].id+'&upDownStatus='+str
      }).then(res=>{
        _this.getCourseList(_this.pageTurning.pageNum)
      })
    },
    //删除课程
    deletCurriculum(index){
      let _this=this;
      let _ids=[];
      _ids.push(this.courseList[index].id);
      $.ajax({
        url:curriculum.delet,
        type:'post',
        contentType:'application/json',
        data:JSON.stringify(_ids),
        success:(res)=>{
          _this.getCourseList(_this.pageTurning.pageNum)
        }
      });
    },
    //关联课程
    relationCurriculum(){
      let _this=this;
      this.$http({
        url:curriculum.findCourseListByLectureId+'?lectureId='+this.teacherId,
      }).then(res=>{
        console.log(res)
        _this.relation=res.data.data;
      })
    },
    handleCurrentChange(val){
      // console.log(`每页 ${val} 条`);
      this.getCourseList(val)
    },
    handleRemove(event, file, fileList) {
      //上传中
      let len=this.fileList.length;
      this.fileList[len-1].toFixed=file.percentage.toFixed(0)//上传进度
      this.fileStatus=false;
    },
    beforeUploading(response, file, fileList) {
      //上传完成
      // console.log(response);
      let len=this.fileList.length;
      this.fileList[len-1].url=response.data;
      this.fileList[len-1].fileSuccse=true;
      // this.fileList[len-1].toFixed=0;
      this.fileStatus=true;
      this.fileStatuslooding=false;
    },
    // chaochu(files, fileList){
    //   console.log(files);
    //   console.log(fileList);
    //   if(files.length>3){
    //     this.$message.error('上传数量不能大于3条');
    //   }
    // },
    qian(file){
      //上传前
      this.fileStatuslooding=true;
      if(!this.fileStatus){
        this.$message.error('存在未上传结束文件请稍后');
        return
      }
      let _obj={};
      _obj.url='';
      _obj.fileSuccse=false;
      _obj.name1='关联课程';
      _obj.name2=file.name;
      _obj.toFixed=0;
      this.fileList.push(_obj);
    },
    shibai(){
      //上传失败
      this.$message.error('上传失败');
      this.fileStatuslooding=false;
    },
    //时间转换
    makeDurationToSeconds(time){
      let str = time;
      let arr = str.split(':');
      let hs = parseInt(arr[0]*3600);
      let ms = parseInt(arr[1]*60);
      let ss = parseInt(arr[2]);
      let seconds = hs + ms + ss;
      return seconds;
    },
    //保存 提交
    saveSubmitBtn(_checkStatus){
      let _this=this;
      if(this.form.region=="" || this.form.region==null || this.form.region==undefined){
        this.$message.error('请选择关联课程');
        return
      }
      if(!this.fileList.length){
        this.$message.error('请上传视频');
        return
      };
      let _data={};
      let _arr=[];
      for(let i=0; i<this.fileList.length; i++){
        let _obj={};
        let _obj2={};
        let _shuzu=[];
        _obj2.coverUrl=this.fileList[i].url.split(",")[1];
        _obj2.fileUrl=this.fileList[i].url.split(",")[0];
        _obj2.timeLen=this.makeDurationToSeconds(this.fileList[i].url.split(",")[2]);
        _obj2.fileName=this.fileList[i].name2;
        _shuzu.push(_obj2);
        _obj.catalogueContentEntityList=_shuzu;
        _obj.catalogueName=this.fileList[i].name2;
        _arr.push(_obj);
      };
      _data={
        orgId:this.relation[0].orgId,//组织机构id
        courseId:this.form.region,//关联课程id
        checkStatus:_checkStatus,//0待提交 1待审核 2通过 3未通过
        upDownStatus:0,//0待上架,1上架,2下架
        courseCatalogueEntityList:_arr,
        // courseCatalogueEntityList:[
        //   {
        //     catalogueContentEntityList:[
        //       {
        //         coverUrl:'',
        //         fileUrl:'',
        //         timeLen:'',
        //         fileName:'',
        //       }
        //     ],
        //     catalogueName:'',//目录名称 暂传文件名
        //   }
        // ]
        // JSON.stringify
      };
      $.ajax({
        url:curriculum.saveCourseContent,
        type:'post',
        contentType:'application/json',
        data:JSON.stringify(_data),
        success:(res)=>{
          if(res.status==200){
            _this.fliePoup=false;
            _this.$message(res.message);
            _this.getCourseList(_this.pageTurning.pageNum);
            _this.fileList=[];
          }else{
            _this.$message.error(res.message);
          }
        }
      })
      // this.$http({
      //   url:curriculum.saveCourseContent,
      //   method:'post',
      //   headers:{
      //     'Content-Type':'application/json'
      //   },
      //   data:JSON.stringify(_data),
      // }).then(res=>{
      //   console.log(res)
      // })
    },
    //删除上传视频
    fileDelete(index){
      this.fileList.splice(index,1);
    },
  },
}
</script>
<style scoped>
  @import "../css/kechengguanli.css";
</style>
