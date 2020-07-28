<template>
  <div class="post-article" style="background: #fff;">
    <div class="release_top">
        <div>
          <ul class="top_left">
            <li v-for="(cagetoryList,index) in cagetoryList" :data-id="index"  @click="clicklei(index)" :class="cagetoryType==index?'active':''">{{cagetoryList}}</li>
          </ul>
        </div>
        <div class="top_right" v-if="cagetoryType==0">
            <!--<a>发文规范</a>-->
            <a @click="importDocuments=true">文档导入</a>
        </div>
    </div>
    <!--文章-->
    <div class="article_box" v-if="cagetoryType==0">
      <!--标题-->
      <div class="title_box">
        <input maxlength="30" v-model="formData.title" placeholder="请输入文章标题(5-30个汉字)" type="text">
        <!--<span>{{titleLength}}/30</span>-->
      </div>
      <div class="article-editor">
          <!--编辑器-->
          <div class="text_field">
            <!--<i @click="clickHyperlinks" class="hyperlinks_btn"></i>-->
            <i @click="votingManagementClick()" class="fontFamily hhtxiconfonttoupiao toupiao"></i>
            <!--<i @click="clickFileVideoBtn()" class="shangchuanshipin" v-if="false"></i>-->
            <i @click="clickFileImgBtn()" class="el-icon-picture addimg"></i>
            <i @click="videoInsert(-1)" class="fontFamily hhtxshipin1 add-video"></i>
            <i @click="audeoInsert(-1)" class="fontFamily hhtxyinpin add-audeo"></i>
            <quill-editor  v-model="formData.content" ref="myQuillEditor" :options="editorOption" @blur="onEditorBlur($event)" @focus="onEditorFocus($event)" @change="onEditorChange($event)"> </quill-editor>
            <ckeditor v-if="false"  :editor="editor" @ready="onEditorReady" @focus="insertEditorContent" v-model="formData.content" :config="editorConfig"></ckeditor>
          </div>
          <!--栏目列表-->
          <div class="selct_box">
            <div class="column_box">
              <label style="font-size: 16px; line-height: 40px;float: left">栏目：</label>
              <!--<el-radio-group style="width: calc(100% - 80px);" v-model="formData.columnId" @change="clickColumnId">-->
                <!--<el-radio style="margin-top: 10px;width: 100px;" v-for="(item,index) in columnList" :label="item.value">{{item.label}}</el-radio>-->
              <!--</el-radio-group>-->
              <el-checkbox-group style="width: calc(100% - 80px); float: left" v-model="formData3.columnId" @change="clickColumnId2">
                <el-checkbox style="margin-top: 10px;width: 100px;" v-for="(item,index) in columnList" :label="item.value" :key="item.value">{{item.label}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <!--标签-->
          <div class="tally_box" v-if="checkList.length">
            <div class="tally_title">标签：</div>
            <el-checkbox-group v-model="formData.tagId">
              <el-checkbox v-for="(item,index) in checkList" :label="item.id" :key="item.id">{{item.remarks}}</el-checkbox>
            </el-checkbox-group>
          </div>
          <!--封面图设置-->
          <div class="marquee_box">
            <label class="title_name">封面：</label>
            <el-radio-group v-model="formData.fileType">
              <el-radio :label="4">单图</el-radio>
              <el-radio :label="2">三图</el-radio>
              <el-radio :label="0">无图</el-radio>
              <el-radio :label="1">右单图</el-radio>
            </el-radio-group>
          </div>
        <div class="cover_box" v-if="formData.fileType!=0">
          <div class="cover_box1" data-title="单图" v-if="formData.fileType==4 || formData.fileType==1">
            <div class="cover_box1_1" @click="setupCover()">
              <i class="el-icon-plus"></i>
              <img v-if="fill" :src="fill">
              <div v-on:click.stop="editorCropper(-1)" class="btn" v-if="fill"><i class="fontFamily hhtxcaijian"></i></div>
            </div>
          </div>
          <div class="cover_box2" data-title="三图" v-if="formData.fileType==2">
            <div class="cover_box1_1" @click="setupCover()">
              <i class="el-icon-plus"></i>
              <img v-if="onCoverImg3[0]" :src="onCoverImg3[0]">
              <div v-on:click.stop="editorCropper(0)" class="btn" v-if="onCoverImg3[0]"><i class="fontFamily hhtxcaijian"></i></div>
            </div>
            <div class="cover_box1_1" @click="setupCover()">
              <i class="el-icon-plus"></i>
              <img v-if="onCoverImg3[1]" :src="onCoverImg3[1]">
              <div v-on:click.stop="editorCropper(1)" class="btn" v-if="onCoverImg3[1]"><i class="fontFamily hhtxcaijian"></i></div>
            </div>
            <div class="cover_box1_1" @click="setupCover()">
              <i class="el-icon-plus"></i>
              <img v-if="onCoverImg3[2]" :src="onCoverImg3[2]">
              <div v-on:click.stop="editorCropper(2)" class="btn" v-if="onCoverImg3[2]"><i class="fontFamily hhtxcaijian"></i></div>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom_box" v-show="seeType">
        <!--<span>数字 0 (已保存)</span>-->
        <el-button @click="clickrelease()" v-if="!amend" style="width: 98px;" type="primary">发布</el-button>
        <el-button @click="clicktiming()" v-if="!amend">定时发布</el-button>
        <el-button @click="clickdraft()" v-if="!amend">存为草稿</el-button>
        <!--草稿修改发布-->
        <el-button @click="clickrelease()" v-show="isPublish==9" v-if="amend" style="width: 98px;" type="primary">发布</el-button>
        <!--修改未通过发布-->
        <!--<el-button v-if="amend" @click="clickSave">发布</el-button>-->
        <el-button v-if="amend" v-show="isPublish!=9" @click="clickSave(0)" style="width: 98px;" type="primary">发布</el-button>
        <el-button v-if="amend" @click="clickSave('')">保存</el-button>
        <el-button @click="mobel=!mobel">预览</el-button>
      </div>
    </div>
    <!--图集-->
    <div class="atlas_box" v-if="cagetoryType==1">
        <tuji :inputName="byValue"></tuji>
    </div>
    <!--小视频-->
    <div class="atlas_box" v-if="cagetoryType==2">
        <fatoutiaoVideo :inputName="mediaAssetsUrl"></fatoutiaoVideo>
    </div>
    <!--插入音视频-->
    <div class="file_img_alert" v-show="myMedia">
        <div class="fileImg_box">
            <div class="fileImg_box3">
                <ul class="fileImg_box_nav">
                    <li>素材库</li>
                </ul>
                <div class="fileImg_title">
                  <i @click="clickFileImg()" class="el-icon-close"></i>
                </div>
            </div>
            <div id="orderFullScreen3" class="material_library">
                <div class="up_one_level">
                    <a v-if="this.insertType==3" @click="videoInsert(-1)">素材库</a>
                    <a v-if="this.insertType==2" @click="audeoInsert(-1)">素材库</a>
                    <a v-for="(itme,index) in crumbsList" @click="crumbsListClick(index)"> < {{itme.name}}</a>
                </div>
                <div class="folder_box_list" v-if="folder.length">
                  <div class="my_folder" v-for="(item,index) in folder" @dblclick="openFolders(index)">
                    <i class="fontFamily hhtxweibiaoti5"></i>
                    <p>{{item.name}}</p>
                  </div>
                </div>
                <ul class="fileImg_content fileImg_content_new">
                  <li v-if="insertType==3" :class="itme.hideState?'material':''" v-for="(itme,index) in sucaiList">
                    <div class="cheke_icon"></div>
                    <img :src="suolue(itme.accessPath)" @click="mediaInsert(index)">
                  </li>
                  <li v-if="insertType==2" :class="itme.hideState?'material':''" v-for="(itme,index) in sucaiList" @click="mediaInsert(index)">
                    <!--<div class="cheke_icon"></div>-->
                    <i class="el-icon-microphone media-music" :data-url="itme.accessPath"></i>
                    <div class="media-music-name" v-text="itme.name"></div>
                  </li>
                </ul>
            </div>
            <div class="fileImg_btn">
              <el-button @click="fileImgAscertain()" type="primary">确定</el-button>
            </div>
        </div>
    </div>
    <!--上传图片弹窗-->
    <div v-show="fileImgBox" class="file_img_alert">
        <div class="fileImg_box">
            <div class="fileImg_box3">
              <!--图片-->
              <ul class="fileImg_box_nav">
                <li :class="fileImgBoxNav==1?'active':''" @click="fileImgBoxNavImg">上传文件</li>
                <li v-if="fileType!=4" :class="fileImgBoxNav==2?'active':''" @click="fileImgBoxNavMaterial(-1)">素材库</li>
              </ul>
              <div class="fileImg_title">
                <i @click="clickFileImg()" class="el-icon-close"></i>
              </div>
            </div>
            <div class="fileImg_content" id="fileImg_content" v-if="fileImgBoxNav==1">
              <draggable element="ul" v-model="list">
                <li v-for="(item,index) in list" style="height: 130px;" class="dra">
                  <img :src="item">
                  <div class="dra_fot"><i @click="draDelet(index)" class="el-icon-delete"></i></div>
                </li>
                <li v-if="listloding" style="height: 130px;" class="begin_loding"><i class="el-icon-loading"></i></li>
              </draggable>
              <div v-if="fileImgBox">
                <el-upload
                  :action="filleUrl"
                  list-type="picture-card"
                  :multiple="true"
                  :data="filleParameter"
                  accept="image/*"
                  :name="filleParameterName"
                  :show-file-list="false"
                  :on-progress="startfille"
                  :on-success="handleAvatarSuccess"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="handleRemove">
                  <i class="el-icon-plus"></i>
                </el-upload>
                <!--<el-dialog :visible.sync="dialogVisible">-->
                  <!--<img width="100%" :src="dialogImageUrl" alt="">-->
                <!--</el-dialog>-->
              </div>
            </div>
            <div class="material_library" id="orderFullScreen" v-show="fileImgBoxNav==2">
                <!--素材面包屑导航-->
                <div class="up_one_level" v-if="crumbsList.length">
                    <a @click="fileImgBoxNavMaterial(-1)">素材库</a>
                    <a v-for="(itme,index) in crumbsList" @click="crumbsListClick(index)"> < {{itme.name}}</a>
                </div>
                <!--素材文件夹列表-->
                <div class="folder_box_list" v-if="folder.length">
                    <div class="my_folder" v-for="(item,index) in folder" @dblclick="openFolders(index)">
                      <i class="fontFamily hhtxweibiaoti5"></i>
                      <p>{{item.name}}</p>
                    </div>
                </div>
                <ul class="fileImg_content fileImg_content_new">
                  <li :class="itme.hideState?'material':''" v-for="(itme,index) in sucaiList">
                    <div class="cheke_icon" style="display: none"></div>
                    <div class="order-number" v-if="itme.hideState" v-text="imgOrder(itme.accessPath)"></div>
                    <img :src="suolue(itme.accessPath)" @click="materialSelect(index)">
                  </li>
                </ul>
            </div>
            <div class="fileImg_btn">
                <!--<div style="float: left" v-if="fileType!=4">-->
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
        <div class="fileImg_title fileImg_title2">
          <ul class="options-nav">
            <li :class="fileImgBoxNavCover==1?'active':''" @click="myCover(1)">正文图片</li>
            <li :class="fileImgBoxNavCover==2?'active':''" @click="myCover(2)">上传图片</li>
            <li :class="fileImgBoxNavCover==3?'active':''" @click="myCover(3)">素材图片</li>
          </ul>
          <i @click="clickdownalert()" class="el-icon-close"></i>
        </div>
        <!--正文图片-->
        <div v-show="fileImgBoxNavCover==1">
          <ul class="fileImg_content fileImg_content2" id="cover_number" v-if="coverList.length>0">
            <li @click="clickSetupCover(index)" :class="coverList.state?'cheke_active':''" v-for="(coverList,index) in coverList">
              <div class="cheke_icon"></div>
              <img :src="coverList.url">
            </li>
          </ul>
          <div class="fileImg_content" v-else>
            <div class="prompt-text">正文中没有插入图片，请先上传图片</div>
          </div>
        </div>
        <!--上传封面图-->
        <div class="fileImg_content" id="fileImg_content10" v-if="fileImgBoxNavCover==2">
          <el-upload
            :action="filleUrl"
            list-type="picture-card"
            :multiple="true"
            :data="filleParameter"
            :name="filleParameterName"
            accept="image/*"
            :limit="fileMax"
            :on-exceed="fileCoverMax"
            :on-success="handleAvatarSuccess"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </div>
        <!--素材库图片-->
        <div class="material_library" id="orderFullScreen2" v-show="fileImgBoxNavCover==3">
            <!--素材面包屑导航-->
            <div class="up_one_level" v-if="crumbsList.length">
              <a @click="fileImgBoxNavMaterial(-1)">素材库</a>
              <a v-for="(itme,index) in crumbsList" @click="crumbsListClick(index)"> < {{itme.name}}</a>
            </div>
            <!--素材文件夹列表-->
            <div class="folder_box_list" v-if="folder.length">
              <div class="my_folder" v-for="(item,index) in folder" @dblclick="openFolders(index)">
                <i class="fontFamily hhtxweibiaoti5"></i>
                <p>{{item.name}}</p>
              </div>
            </div>
            <ul class="fileImg_content fileImg_content_new">
              <li :class="itme.hideState?'material':''" v-for="(itme,index) in sucaiList">
                <div class="cheke_icon"></div>
                <img :src="suolue(itme.accessPath)" @click="materialSelect(index)">
              </li>
            </ul>
        </div>
        <div class="fileImg_btn" v-show="fileImgBoxNavCover==1">
          <el-button type="primary" v-if="coverList.length>0" @click="confirm()">确定</el-button>
          <el-button :disabled="true" v-else type="primary">确定</el-button>
        </div>
        <div class="fileImg_btn" v-show="fileImgBoxNavCover==2">
          <el-button type="primary" @click="confirm()">确定</el-button>
        </div>
        <div class="fileImg_btn" v-show="fileImgBoxNavCover==3">
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
    <!--投票-->
    <div class="vote_box" v-if="addOrderVisible">
        <div class="vote_content">
            <div class="vote_title">
              <div style="float: left;font-size: 16px; margin-left: 20px;">投票管理</div>
              <i class="el-icon-close" @click="onVotingManagementClick()"></i>
            </div>
            <div class="vote_body">
                <vote @closeMain="closeMain"></vote>
            </div>
            <div class="vote_fot">
                <el-button @click="insertIform()" type="primary">确定</el-button>
                <el-button @click="iframeReplace('投票管理')">新增投票</el-button>
            </div>
        </div>
    </div>
    <!--loding-->
    <div class="loding_box" v-if="fttlodingBox">
      <i class="el-icon-loading"></i>
    </div>
    <!--预览-->
    <div class="loding_box" v-if="mobel">
      <div style="width: 100%; height: 100%;" @click.stop="mobel=!mobel"></div>
        <div class="mobel_box">
          <div class="mobel_box_body">
              <div class="mobel_box_title">{{formData.title}}</div>
              <div class="authorbar">
                  <div class="avatar-box"><img :src="avatarImg"></div>
                  <div class="user_info">
                    <div class="user_name">{{byValue.userNmae}}</div>
                    <div class="user_time">{{timeFormate(new Date())}}</div>
                  </div>
              </div>
              <div class="mobel_box_content" v-html="formData.content"></div>
          </div>
        </div>
    </div>
    <!--导入文档-->
    <div class="file_img_alert" v-if="importDocuments">
      <div class="fileImg_box">
        <div class="fileImg_box3">
          <ul class="fileImg_box_nav">
            <li class="active">上传文档</li>
          </ul>
          <div class="fileImg_title">
            <i class="el-icon-close" @click="importDocuments=false"></i>
          </div>
        </div>
        <div class="fileImg_content">
          <div class="file_text_btn">选择文件
            <el-upload
            class="avatar-uploader avatar-uploader_file"
            :action="importDocumentsUrl"
            :before-upload="textfile"
            :on-success="textfilesucces"
            :show-file-list="false">
            <div style="width: 100px; height: 40px;"></div>
            </el-upload>
          </div>
          <p class="file_text_describe">文档最大20MB，支持doc | docx | txt格式</p>
        </div>
      </div>
    </div>
    <!--图片裁剪-->
    <div class="cropper-box" v-if="cropperShow">
        <fatoutiaoCropper @e-world="getData" :bbc="coveroppUrl"></fatoutiaoCropper>
    </div>
  </div>
</template>

<script>
  import vote from '@/components/faTouTiao/vote'
  import tuji from '@/components/faTouTiao/atlas'
  import fatoutiaoVideo from '@/components/faTouTiao/video'
  import fatoutiaoCropper from '@/components/faTouTiao/cropper'
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  // import { quillEditor } from 'vue-quill-editor'
  import { Quill } from 'vue-quill-editor'
  import {config} from "../../router/httpConfig.js"
  import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
  import '@ckeditor/ckeditor5-build-classic/build/translations/zh-cn.js'
  import  '../../router/image-paste.min.js'
  import { eventBus } from '../../main'
  import {mapState} from 'vuex'
  import draggable from 'vuedraggable'
  const BlockEmbed = Quill.import('blots/block/embed')
  const Link = Quill.import('formats/link')
  //编辑器注册音频
  class AudioBlot extends BlockEmbed {
    static create(value) {
      let node = super.create()
      node.setAttribute('class', 'audio')
      node.setAttribute('src', value.url)
      node.setAttribute('controls', value.controls)
      node.setAttribute('preload', 'none')
      node.setAttribute('width', value.width)
      node.setAttribute('height', value.height)
      return node;
    }
    static value(node) {
      return {
        class: node.getAttribute('class'),
        url: node.getAttribute('src'),
        controls: node.getAttribute('controls'),
        preload: node.getAttribute('preload'),
        width: node.getAttribute('width'),
        height: node.getAttribute('height')
      };
    }
  }
  AudioBlot.blotName = 'customAudio';
  AudioBlot.tagName = 'audio';
  Quill.register(AudioBlot);
  //编辑器注册视频
  class VideoBlot extends BlockEmbed {
    static create(value) {
      let node = super.create()
      node.setAttribute('class', 'video')
      node.setAttribute('src', value.url)
      node.setAttribute('controls', value.controls)
      node.setAttribute('preload', 'none')
      node.setAttribute('width', value.width)
      node.setAttribute('height', value.height)
      return node;
    }
    static value(node) {
      return {
        class: node.getAttribute('class'),
        url: node.getAttribute('src'),
        controls: node.getAttribute('controls'),
        preload: node.getAttribute('preload'),
        width: node.getAttribute('width'),
        height: node.getAttribute('height')
      };
    }
  }
  VideoBlot.blotName='customVideo';
  VideoBlot.tagName = 'video';
  Quill.register(VideoBlot);
  export default {
      components:{tuji,vote,fatoutiaoVideo,draggable,fatoutiaoCropper},
      name: "index.vue",
      data () {
        return {
          coveroppUrl:'',//当前封面链接
          coveropp:0,//当前编辑封面索引
          cropperShow:false,
          myMedia:false,
          insertType:3, //多媒体插入编辑器类型 1图 2音频 3视频
          listloding:false,
          list:[],
          myEditorindex:1,
          fttlodingBox:false,
          totalpage:1,
          total:1,
          avatarImg:'',
          mobel:false,
          editor: ClassicEditor,
          editorData: '<p>请输入内容</p>',
          editorConfig: {
            language: 'zh-cn',
            // label:'My Bold',
            // command:'bold',
            // toolbar: [ 'bold', 'italic', 'insertImage' ],
          },
          formData:{
            cagetory:1,
            title:'',
            fileType:0,
            covers:[],
            content: '',
            columnId:'',
            status:0,
            isTimer:2,
            publishTime:'',
            tagId:[],
            id:'',
            areaId:this.$store.state.userInfo.areaId
          },
          formData3:{
            columnId:[],
          },
          formData2:{
            columnType:'',
            deviceType:0,
            columnId:'',
            createById:'',
            fileType:0,
            files:[],
            title:'',
            content:'',
            titleFilePath:'',
            tagId:[],
            id:'',
            areaId:this.$store.state.userInfo.areaId
          },
          seeType:true,//查看内容
          timing:false,//定时发布弹窗
          fileImgBoxNav:1,//上传弹窗导航类型
          sucaiList:[],//素材列表
          checkList:[],//标签复选框
          amend:false,//是否是修改页
          appbackUrl:'',//两微一端
          mediaAssetsUrl:'',//媒资上传文件地址
          mediaAssetsUrl_1:'',//媒资域名
          filleUrl:'',//上传文件地址
          filleParameter:{
            userName:'用户名',
            waterName:'易达融媒',
            areaId:this.$store.state.userInfo.areaId
          },//上传文件时所带额外参数
          filleParameterName:'',//上传文件upload 上传图片file
          byValue:{
            appbackUrl:'',
            mediaAssetsUrl:'',
            userNmae:'',
          },
          columnList:[],//栏目列表
          columnName:'',//默认栏目名
          isWatermarks:'',//是否开启水印
          dialogImageUrl: '',
          dialogVisible: false,
          startOffset:0,
          titleLength:0,
          fileImgBox:false,
          fileImgData:[], //上传图片视频集合
          fileType:0,
          coverList:[], //文章中图片集
          coverListBox:false, //封面图设置弹框
          coverLimit:0,
          onCoverImg:'', //选中单图封面图
          fill:'',//选中单图封面图填充值
          onCoverImg3:[], //选中三图封面图
          cagetoryList:['文章','图集','小视频'],
          cagetoryType:0,
          addOrderVisible: false,
          radioId:'',
          votePath:'',//投票域名
          editorOption:{
            placeholder:'',
            theme: 'snow',
            modules:{
              imagePaste: { },
              toolbar:[
                [{'header':[1,2,3]}],
                ['bold', 'italic', 'underline', 'strike','blockquote','link'],
                [{'indent':'-1'},{'indent':'+1'}],
                [{'align':'center'}],
                ['clean']
              ],
            }
          },
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() < Date.now() - 8.64e7;
            }
          },
          fileImgBoxNavCover:1,//封面图选择导航类型
          importDocuments:false,
          importDocumentsUrl:config.textDocuments,
          fileMax:1,
          folder:[
            // {name:'文件名1',id:111}
          ],
          crumbsList:[
            // {name:'图片',id:''},
          ],//面包屑导航
          folderId:-1,
          isPublish:0,//修改页文章状态
          baselist:[],
        };
      },
      created:function(){
        let _id = this.$route.query.id;
        let _type = this.$route.query.type;
        if(this.$route.query.see){
          this.seeType=false
        }
        localStorage.areaId=this.$store.state.userInfo.areaId;
        //获取投票域名
        this.$http({
          url:config.voteDomainName
        }).then((res)=>{
          let voteUrl=res.data.data.votePath;
          if(voteUrl==null){
            voteUrl="";
          }
          // let voteUrl2=voteUrl.split("//");
          // this.votePath=voteUrl2[0]+'//'+voteUrl2[1]+'/'+voteUrl2[2];
          this.votePath=voteUrl;
        }).catch((err)=>{
          console.log(err)
        });

        //获取用户信息
        // this.filleParameter.userName=this.$store.state.userInfo.nickName;
        // this.byValue.userNmae=this.$store.state.userInfo.nickName;
        // localStorage.isWatermark=this.$store.state.userInfo.isWatermark;
        // this.isWatermark=this.$store.state.userInfo.isWatermark;

        // localStorage.isWatermark=0;
        // this.isWatermark=0;
        this.avatarImg=this.$store.state.userInfo.portrait;
        // this.$store.state.userInfo.areaId
        this.$http({
          url:config.userUrl
        }).then((res)=>{
          this.filleParameter.userName=res.data.data.nickName;
          this.byValue.userNmae=res.data.data.nickName;
          localStorage.isWatermark=res.data.data.isWatermark;
          this.isWatermark=res.data.data.isWatermark;
          if(res.data.data.areaId==null){
            localStorage.areaId=0;
            this.formData.areaId=0;
            this.formData2.areaId=0;
            this.filleParameter.areaId=0;
          }else{
            localStorage.areaId=res.data.data.areaId;
            this.formData.areaId=res.data.data.areaId;
            this.formData2.areaId=res.data.data.areaId;
            this.filleParameter.areaId=res.data.data.areaId;
          }
        }).catch((err)=>{
          console.log(err)
        });
        //获取域名
        this.$http({
          url:config.globalUrl,
        }).then((res)=>{
          let _appbackUrl=res.data.data.appbackUrl;
          this.appbackUrl=res.data.data.appbackUrl;
          this.mediaAssetsUrl=res.data.data.mediaAssetsUrl+config.uploadUrl;
          this.mediaAssetsUrl_1=res.data.data.mediaAssetsUrl;
          this.byValue.appbackUrl=res.data.data.appbackUrl;
          this.byValue.mediaAssetsUrl=res.data.data.mediaAssetsUrl+config.watermarkImg;
          localStorage.appbackUrl=res.data.data.appbackUrl;
          localStorage.waterName=res.data.data.nickName;
          localStorage.videoColumn=res.data.data.videoColumn;
          this.filleParameter.waterName=res.data.data.nickName;
          //修改页
          if(_id){
            this.amend=true;
            this.formData2.id=_id;
            this.formData.id=_id;
            this.xiugai(_appbackUrl,_type,_id);
            if(_type==3){
              this.cagetoryType=1;
            }else if(_type==2){
              this.cagetoryType=2;
            }else{
              this.cagetoryType=0;
            }
          }else{}
          //获取栏目
          this.$http({
            url:_appbackUrl+config.columnUrl+'&areaId='+this.formData.areaId
          }).then((res)=>{
            let _columnList=[];
            for(let i=0; i<res.data.length; i++){
              if(res.data[i].name=="融圈"){
                  //屏蔽融圈栏目
              }else{
                let _obj={};
                _obj.value=res.data[i].id;
                _obj.label=res.data[i].name;
                _columnList.push(_obj)
              }
            }
            this.columnList=_columnList;
            if(this.formData.columnId==''){
              this.formData.columnId=_columnList[0].value;
              this.formData3.columnId.push(_columnList[0].value);
            }
          }).catch((err)=>{
            console.log(err)
          })

        }).catch(function(err){
          console.log(err)
        });
      },
      // created:function(){
      //   //获取投票域名
      //   this.$http({
      //     url:config.voteDomainName
      //   }).then((res)=>{
      //     // console.log(res.data.data.votePath);
      //     this.votePath=res.data.data.votePath
      //   }).catch((err)=>{
      //     console.log(err)
      //   });
      //
      // },
      computed: {
        editor2() {
          return this.$refs.myQuillEditor.quill;
        }
      },
      mounted() {
        document.getElementById('orderFullScreen').addEventListener('scroll', this.handleScroll);
        document.getElementById('orderFullScreen2').addEventListener('scroll', this.handleScroll);
        document.getElementById('orderFullScreen3').addEventListener('scroll', this.handleScroll);
      },
      methods:{
        getData(state){
          this.cropperShow=state.state;
          var _this=this;
          if(state.url==""){
            return false
          }
          $.ajax({
            type:'post',
            async:false,
            dataType:'json',
            url:this.mediaAssetsUrl_1+config.base64Url,
            data:{
              userName:this.filleParameter.userName,
              waterName:this.filleParameter.waterName,
              baseArr:state.url,
              areaId:localStorage.areaId
            },
            success:function(res){
              if(_this.formData.fileType==4 || _this.formData.fileType==1){
                _this.fill=res.data;
                _this.formData.covers=res.data;
              }else if(_this.formData.fileType==2){
                _this.onCoverImg3[_this.coveropp]=res.data;
              }

            }
          });
        },
        editorCropper(data){
            this.cropperShow=true;
            this.coveropp=data;
            if(this.formData.fileType==4 || this.formData.fileType==1){
              this.coveroppUrl=this.fill;
            }else if(this.formData.fileType==2){
              this.coveroppUrl=this.onCoverImg3[data];
            }
        },
        audeoInsert(val){
          this.myMedia=true;
          this.insertType=2;
          if(val==-1){
            this.folderId=-1;
            this.crumbsList=[];
          }
          this.sucaiList=[];
          this.$http({
            url:config.materialUrl+'?parentId='+val+'&pageNo=1&pageSize=12&type=2'
          }).then((res)=>{
            console.log(res)
            this.totalpage=1;
            this.total=res.data.data.datas.total;
            let _sucai=res.data.data.datas.rows;
            this.folder=res.data.data.folders;
            for(let i=0; i<res.data.data.datas.rows.length; i++){
              _sucai[i].hideState=false;
            }
            this.sucaiList=_sucai;
          }).catch((err)=>{
            console.log(res)
          })
        },
        videoInsert(val){
          this.myMedia=true;
          this.insertType=3;

          if(val==-1){
            this.folderId=-1;
            this.crumbsList=[];
          }
          this.sucaiList=[];

          this.$http({
            url:config.materialUrl+'?parentId='+val+'&pageNo=1&pageSize=12&type=3'
          }).then((res)=>{
            this.totalpage=1;
            this.total=res.data.data.datas.total;
            let _sucai=res.data.data.datas.rows;
            this.folder=res.data.data.folders;
            for(let i=0; i<res.data.data.datas.rows.length; i++){
              _sucai[i].hideState=false;
            }
            this.sucaiList=_sucai;
          }).catch((err)=>{
            console.log(err)
          });
        },
        mediaInsert(val){
          this.editor=this.editor2;
          let media_url=this.sucaiList[val].accessPath.split(',')[0];
          let media_url2=this.sucaiList[val].accessPath;
          if(this.insertType==3){
            this.editor.insertEmbed(this.myEditorindex, 'customVideo', {
              url: media_url,
              id: 'video_',
              controls: 'controls',
              width: '100%',
              height: 'auto'
            });
          }else{
            this.editor.insertEmbed(this.myEditorindex, 'customAudio', {
              url: media_url2,
              controls: 'controls',
              width: '100%',
              height: '70'
            });
          }
          // 调整光标到最后
          this.editor.setSelection(this.myEditorindex + 1);
          this.myMedia=false;
        },
        openFolders(index){
          let _id=this.folder[index].id;
          this.folderId=_id;
          //构建面包屑导航
          let obj={};
          obj.name=this.folder[index].name;
          obj.id=this.folder[index].id;
          this.crumbsList.push(obj);
          //请求文件夹下数据
          if(this.insertType==1){
            this.fileImgBoxNavMaterial(_id);
          }else if(this.insertType==2){
            this.audeoInsert(_id)
          }else if(this.insertType==3){
            this.videoInsert(_id)
          }

        },
        crumbsListClick(index){
          //点击面包屑导航
          this.crumbsList.splice(index+1,100);
          let _id=this.crumbsList[index].id;
          this.folderId=_id;
          //请求文件夹下数据
          if(this.insertType==1){
            this.fileImgBoxNavMaterial(_id);
          }else if(this.insertType==2){
            this.audeoInsert(_id)
          }else if(this.insertType==3){
            this.videoInsert(_id)
          }

        },
        fileCoverMax(){
          this.$message('已达到封面数上限')
        },
        textfile(file){
          this.fttlodingBox=true;
          let isDoc =file.name.split(".");
          let _length=isDoc.length;
          let _name=isDoc[_length-1];
          const _type=_name=='doc'||_name=='docx'||_name=='txt';
          const isLt2M = file.size / 1024 / 1024 < 20;
          if (!_type) {
            this.$message.error('上传文件格式不正确!');
            this.fttlodingBox=false;
            return false
          }
          if (!isLt2M) {
            this.$message.error('上传文件大小不能超过 20MB!');
            this.fttlodingBox=false;
          }
          return isLt2M
        },
        transcoding(){
          var _this=this;
          let _html=this.formData.content;
          let newStr=[];
          let newContent= _html.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi,function(match,capture){
            newStr.push(capture);
            return newStr
          });
          let img_list=[];
          for(let i=0; i<newStr.length; i++){
            if(newStr[i].indexOf('data:image')>-1){
              $.ajax({
                type:'post',
                async:false,
                dataType:'json',
                url:this.mediaAssetsUrl_1+config.base64Url,
                data:{
                  userName:this.filleParameter.userName,
                  waterName:this.filleParameter.waterName,
                  baseArr:newStr[i]
                },
                success:function(res){
                  // console.log(res.data);
                  let _myurl=res.data.split(',');
                  img_list[i]=_myurl[0];
                  _this.baselist[i]=_myurl[0];
                  // console.log(i)
                }
              });
              _html=_html.replace(newStr[i],_this.baselist[i]);
            }
          };
          if(_html){
            console.log(_html)
            _this.formData.content=_html;
          }

        },
        textfilesucces(res,file){
          var _this=this;
          let _html=res.data;
          //将文档中的base64图片上传到媒资
          let newStr=[];
          let newContent= _html.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi,function(match,capture){
            newStr.push(capture);
            return newStr
          });
          let img_list=[];
          for(let i=0; i<newStr.length; i++){
            $.ajax({
              type:'post',
              async:false,
              dataType:'json',
              url:this.mediaAssetsUrl_1+config.base64Url,
              data:{
                userName:this.filleParameter.userName,
                waterName:this.filleParameter.waterName,
                baseArr:newStr[i]
              },
              success:function(res){
                // console.log(res.data);
                let _myurl=res.data.split(',');
                  img_list[i]=_myurl[0];
                  _this.baselist[i]=_myurl[0];
                  // console.log(i)
              }
            });
            _html=_html.replace(newStr[i],_this.baselist[i]);
          };
          if(_html){
            _this.formData.content=_this.formData.content+_html;
          }
          _this.importDocuments=false;
          _this.fttlodingBox=false;
        },
        insertEditorContent(editor, content,event) {
          console.log(event);
        },
        onEditorReady(editor, content){
          // var data = editor.getData();
          // console.log(content);
          //获取编辑器对象
          // //插入模型片段
          // const imageElement = writer.createElement( 'image', {
          //   src: 'http://localhost:8081/static/images/logo_zi1.png'
          // } );
          // editor.model.insertContent( imageElement, editor.model.document.selection );
          var viewFragment = editor.data.processor.toView('<p>11111</p>');
          var modelFragment = editor.data.toModel(viewFragment);
          editor.model.insertContent(modelFragment, editor.model.document.selection);

        },
        myCover(val){
          this.coverList=[];
          this.filleUrl=this.mediaAssetsUrl_1+config.watermarkImg;
          this.filleParameterName="file";
          if(val==1){
            this.fileImgBoxNavCover=1;
            this.setupCover();
          }else if(val==2){
            this.fileImgBoxNavCover=2;
            this.fileImgData=[];
            if(this.formData.fileType==4 || this.formData.fileType==1){
              //最大上传封面数 1
              this.fileMax=1
            }else{
              //最大上传封面数 3
              this.fileMax=3
            }
          }else{
            this.fileImgBoxNavCover=3;
            this.fileImgBoxNavMaterial(-1);
          }
        },
        handleScroll(e) {
          //变量scrollTop是滚动条滚动时，距离顶部的距离
          var scrollTop = e.target.scrollTop;
          //变量windowHeight是可视区的高度
          var windowHeight = e.target.clientHeight;
          //变量scrollHeight是滚动条的总高度
          var scrollHeight = e.target.scrollHeight;
          //滚动条到底部的条件
          if(scrollTop+windowHeight==scrollHeight){
            if(this.total>this.totalpage){
              if(this.insertType==1){
                this.suCaiImgData(this.totalpage+1,this.folderId);
              }else if(this.insertType==2){
                this.suCaiImgData(this.totalpage+1,this.folderId,2);
              }else if(this.insertType==3){
                this.suCaiImgData(this.totalpage+1,this.folderId,3);
              }
            }
            this.totalpage=this.totalpage+1
          }
        },
        suCaiImgData(val,_id,_type){
          this.$http({
            url:config.materialUrl+'?parentId='+_id+'&pageNo='+val+'&pageSize=12&type='+_type
          }).then((res)=>{
            // console.log(res.data.data.datas.rows);
            let _sucai=res.data.data.datas.rows;
            for(let i=0; i<res.data.data.datas.rows.length; i++){
              _sucai[i].hideState=false;
              this.sucaiList.push(_sucai[i]);
            }
          }).catch((err)=>{
            console.log(err)
          })
        },
        //缩略图
        suolue(url){
          if(this.insertType==1){
            let _imgurltao=url;
            let _imgurlArrtao=_imgurltao.split(".");
            let _lenth=_imgurlArrtao.length;
            _imgurlArrtao[_lenth-2]=_imgurlArrtao[_lenth-2]+'_t';
            let _imgurlval=_imgurlArrtao.join(".");
            return _imgurlval
          }else if(this.insertType==3){
            return url.split(',')[1]
          }

        },
        timeFormate(timeStamp) {
          let year = new Date(timeStamp).getFullYear();
          let month =new Date(timeStamp).getMonth() + 1 < 10? "0" + (new Date(timeStamp).getMonth() + 1): new Date(timeStamp).getMonth() + 1;
          let date =new Date(timeStamp).getDate() < 10? "0" + new Date(timeStamp).getDate(): new Date(timeStamp).getDate();
          let hh =new Date(timeStamp).getHours() < 10? "0" + new Date(timeStamp).getHours(): new Date(timeStamp).getHours();
          let mm =new Date(timeStamp).getMinutes() < 10? "0" + new Date(timeStamp).getMinutes(): new Date(timeStamp).getMinutes();
          // let ss =new Date(timeStamp).getSeconds() < 10? "0" + new Date(timeStamp).getSeconds(): new Date(timeStamp).getSeconds();
          return year + "-" + month + "-" + date +" "+hh+":"+mm ;
          // console.log(this.nowTime);
        },
        iframeReplace(obj){
          //跳转投票管理
          // parent.addTabpp('{"name":"投票管理"}');
          eventBus.$emit('changeurl',{url:'/votingManagement',index:1});
          this.$router.push('/votingManagement');
        },
        //素材选择
        materialSelect(index){
          if(this.coverListBox){
            //选中的素材封面图片
            if(this.formData.fileType==4 || this.formData.fileType==1){
              //单张封面图
              this.sucaiList[index].hideState=!this.sucaiList[index].hideState;
              this.onCoverImg=this.sucaiList[index].accessPath;
              for(let i=0; i<this.sucaiList.length; i++){
                if(i!=index){
                  this.sucaiList[i].hideState=false
                }
              }
            }else if(this.formData.fileType==2){
              //多张封面图
              if(this.coverLimit<3){
                this.sucaiList[index].hideState=!this.sucaiList[index].hideState;
              }else{
                this.sucaiList[index].hideState=false;
              }
              let selectedNumber=0;
              for(let i=0; i<this.sucaiList.length; i++){
                if(this.sucaiList[i].hideState){
                  // this.coverList[i]=this.sucaiList[i].accessPath;
                  if(this.coverList.indexOf(this.sucaiList[i].accessPath)>-1){
                  }else{
                    this.coverList.push(this.sucaiList[i].accessPath);
                  }
                  selectedNumber+=1
                }
              }
              this.coverLimit=selectedNumber;
            }
          }else{
            //选中的素材图片
            this.sucaiList[index].hideState=!this.sucaiList[index].hideState;
            if(this.sucaiList[index].hideState){
              this.fileImgData.push(this.sucaiList[index].accessPath);
              this.list.push(this.sucaiList[index].accessPath);
            }else{
              let _index=this.fileImgData.indexOf(this.sucaiList[index].accessPath);
              this.fileImgData.splice(_index,1);
              let _index2=this.list.indexOf(this.sucaiList[index].accessPath);
              this.list.splice(_index2,1);
            }
          }
        },
        //点击加载素材列表
        fileImgBoxNavMaterial(val){
          this.insertType=1;
          if(this.fileImgBoxNav==1){
            this.list=[];
          }
          if(val==-1){
            this.folderId=-1;
            this.crumbsList=[];
          }
          this.sucaiList=[];
          this.fileImgBoxNav=2;
          this.$http({
            url:config.materialUrl+'?parentId='+val+'&pageNo=1&pageSize=12'
          }).then((res)=>{
            // console.log(res.data.data.datas.rows);
            this.totalpage=1;
            this.total=res.data.data.datas.total;
            let _sucai=res.data.data.datas.rows;
            this.folder=res.data.data.folders;
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
          this.fileImgData=[];
          this.list=[];
        },
        //栏目改变时
        clickColumnId(e){
          console.log(e)
          this.formData.columnId=e;
          this.obtainLabel(this.formData.columnId)
        },
        clickColumnId2(){
          let _columnId="";
          for(let i=0; i<this.formData3.columnId.length; i++){
            if(i){
              _columnId+=','+this.formData3.columnId[i]
            }else{
              _columnId+=this.formData3.columnId[i]
            }
          }
          this.formData.columnId=_columnId;
          console.log(this.formData3.columnId);
          console.log(this.formData3.columnId.length);
          console.log(this.formData.columnId)
        },
        //获取标签
        obtainLabel(id){
          this.$http({
            url:this.appbackUrl+config.tallyUrl+'?columnId='+id+'&pageSize=100'
          }).then((res)=>{
            this.checkList=res.data.data.rows
          }).catch((err)=>{
            console.log(err)
          })
        },
        clickSave(val){
            this.fttlodingBox=true;
            this.formData2.title=this.formData.title;
            this.formData2.files=this.formData.covers;
            this.formData2.content=this.formData.content;
            this.formData2.tagId=this.formData.tagId;
            let file_type=this.formData.fileType;
            if(file_type==4){
              // this.formData2.fileType=1;
              this.formData2.fileType=1;
              this.formData2.titleFilePath=this.formData.covers[0];
            }else if(file_type==1){
              this.formData2.fileType=1;
              this.formData2.titleFilePath=this.formData.covers[0];
            }else if(file_type==2){

              if(!this.formData.covers[0]){
                this.$message('封面图不能少于三张！');
                this.fttlodingBox=false;
                return false
              }else if(!this.formData.covers[1]){
                this.$message('封面图不能少于三张！');
                this.fttlodingBox=false;
                return false
              }else if(!this.formData.covers[2]){
                this.$message('封面图不能少于三张！');
                this.fttlodingBox=false;
                return false
              }
              this.formData2.fileType=2;
              this.formData2.titleFilePath=this.formData.covers;
            }else{
              this.formData2.fileType=0
            }
            this.$http({
              method:'post',
              url:this.appbackUrl+config.amendUrl,
              data:{
                columnType:this.formData2.columnType,
                deviceType:this.formData2.deviceType,
                columnId:this.formData.columnId,
                createById:this.formData2.createById,
                fileType:this.formData2.fileType,
                files:this.formData2.files,
                title:this.formData2.title,
                content:this.formData2.content,
                titleFilePath:this.formData2.titleFilePath==null?'':this.formData2.titleFilePath,
                id:this.formData2.id,
                isPublish:val,
                areaId:this.formData.areaId
              }
            }).then((res)=>{
              this.$message('修改成功');
              if(res.data.status==200){
                // parent.addTabpp('{"name":"内容管理"}');
                eventBus.$emit('changeurl',{url:'/content/index',index:1});
                this.$router.push('/content/index')
              }else{
                this.$message(res.data.message);
                this.fttlodingBox=false;
              }
            }).catch((err)=>{
              console.log(err);
              this.$message('操作失败');
              this.fttlodingBox=false;
            })
        },
        //根据id查询
        xiugai(url,typ,id){
          let _url="";
          if(typ==1){
            //图文
            _url=url+config.graphicDetailsUrl+'/'+id;
            this.$http({
              url:_url
            }).then((res)=>{
              // console.log(res.data.data);
              this.formData.title=res.data.data.title;
              this.formData.content=res.data.data.content;
              this.editorData=res.data.data.content;
              this.isPublish=res.data.data.isPublish;
              this.formData.columnId=res.data.data.columnId;
              let arrColumnId=res.data.data.columnId;
              arrColumnId=arrColumnId.split(',');
              for(let i=0; i<arrColumnId.length; i++){
                this.formData3.columnId.push(arrColumnId[i])
              }
              this.columnName=res.data.data.columnName;
              let file_type=res.data.data.fileType;
              if(file_type==1 || file_type==4){
                // this.formData.fileType=4;
                this.formData.fileType=file_type;
                this.fill=res.data.data.titleFilePath;
              }else if(file_type==2){
                this.formData.fileType=2;
                let imgArr=res.data.data.titleFilePath.split(",");
                this.onCoverImg3=imgArr;
              }else{
                this.formData.fileType=0
              }
              this.formData2.columnType=res.data.data.columnType;
              this.formData2.columnId=res.data.data.columnId;
              this.formData2.createById=res.data.data.createById;
              this.formData2.fileType=res.data.data.fileType;
              this.formData2.titleFilePath=res.data.data.titleFilePath;
              this.formData.covers=res.data.data.titleFilePath.split(",");
            }).catch((err)=>{
              console.log(err)
            })
          }else{

          }
        },
        insertIform(){
          // console.log(this.radioId);
          let _idName=$(".ql-editor").find("iframe").length;
          this.addOrderVisible=false;
          if(_idName==0){
            let _url=this.votePath+localStorage.voteId;
            let _html='<p><a target="_blank" id="iframe-vote-secretballot" src="'+_url+'" href="'+_url+'">点击投票</a></p>';
            // this.editor.insertEmbed(this.myEditorindex, 'text', _html);
            // this.editor.insertEmbed(this.myEditorindex, 'link', {href:_url, innerText:'点击投票'}, "api");
            this.formData.content=this.formData.content+_html;
          }else{
            this.$message('已插入投票！');
          }
        },
        closeMain:function(val){
          this.radioId=val;
        },
        onVotingManagementClick(){
          this.addOrderVisible=false;
        },
        votingManagementClick() {
          this.addOrderVisible= true;
        },
        clickdownalert:function(){
          //关闭封面图弹窗
          this.coverListBox=false
        },
        isbase(src){

        },
        confirm:function(){
          this.formData.covers=[];
          this.onCoverImg3=[];
          if(this.formData.fileType==4 || this.formData.fileType==1){
            //单图
            if(this.fileImgBoxNavCover==1){
              //正文图
              this.formData.covers.push(this.onCoverImg);
              this.fill=this.onCoverImg;
              console.log('点击')
            }else if(this.fileImgBoxNavCover==2){
              //上传图
              this.formData.covers.push(this.fileImgData[0]);
              this.fill=this.fileImgData[0];
            }else{
              //素材选封面
              this.formData.covers.push(this.onCoverImg);
              this.fill=this.onCoverImg;
            }
            this.coverListBox=false;
            this.fileImgData=[];
          }else if(this.formData.fileType==2){
            //三图
            if(this.fileImgBoxNavCover==1){
              //正文图
              if(this.coverLimit<3){
                this.$message({
                  showClose: true,
                  message: '封面图不能小于三张！',
                  type: 'warning'
                });
              }else{
                for(let i=0; i<this.coverList.length; i++){
                  if(this.coverList[i].state){
                    this.onCoverImg3.push(this.coverList[i].url)
                  }
                }
                this.formData.covers=this.onCoverImg3;
                this.fill="";
                this.coverListBox=false
              }
            }else if(this.fileImgBoxNavCover==2){
              //上传图
              if(this.fileImgData<3){
                this.$message({
                  showClose: true,
                  message: '封面图不能小于三张！',
                  type: 'warning'
                });
              }else{
                this.onCoverImg3[0]=this.fileImgData[0];
                this.onCoverImg3[1]=this.fileImgData[1];
                this.onCoverImg3[2]=this.fileImgData[2];
                this.formData.covers[0]=this.fileImgData[0];
                this.formData.covers[1]=this.fileImgData[1];
                this.formData.covers[2]=this.fileImgData[2];
                this.fill="";
                this.coverListBox=false;
                this.fileImgData=[];
              }
            }else{
              //素材选封面图
              if(this.coverLimit<3){
                this.$message({
                  showClose: true,
                  message: '封面图不能小于三张！',
                  type: 'warning'
                });
              }else{
                // for(let i=0; i<this.coverList.length; i++){
                //   if(this.coverList[i].state){
                //     this.onCoverImg3.push(this.coverList[i])
                //   }
                // }
                // this.formData.covers=this.onCoverImg3;
                this.onCoverImg3=this.coverList;
                this.formData.covers=this.coverList;
                this.fill="";
                this.coverListBox=false
              }
            }
          }
        },
        clickSetupCover:function(index){
          if(this.formData.fileType==4 || this.formData.fileType==1){
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
              this.coverList[index].state=false;
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
        setupCover:function(){
          let _img=$(".ql-editor img");
          this.sucaiList=[];
          this.fileImgBoxNavCover=1;
          // let _img=$(".ck-content img");
          let _coverList=[];
          for(let i=0; i<_img.length; i++){
            //是否是base64图
            let _src=_img.eq(i).attr("src");
            let listConten={};
            if(_src.indexOf('data:image')>-1){
                  this.$http({
                    method:'post',
                    url:this.mediaAssetsUrl_1+config.base64Url,
                    data:{
                      userName:this.filleParameter.userName,
                      waterName:this.filleParameter.waterName,
                      baseArr:_src,
                      areaId:this.formData.userInfo.areaId
                    }
                  }).then((res)=>{
                      console.log(res.data.data);
                      let _myurl=res.data.data.split(',');
                    listConten.url=_myurl[0];
                    listConten.state=false;
                    _coverList.push(listConten)
                  }).catch(()=>{

              })
            }else{
              listConten.url=_src;
              listConten.state=false;
              _coverList.push(listConten)
            }
          }
          this.coverList=_coverList;
          this.coverListBox=true;
        },
        fileImgAscertain:function(){
          //上传图片视频渲染
          let imgHtml='';
          this.list.reverse();
          for(let i=0; i<this.list.length; i++){
            if(this.fileType==0){
              //localStorage.isWatermark
              if(this.$store.state.userInfo.isWatermark==1){
                //开启水印图片地址
                let _imgurltao=this.list[i];
                let _imgurlArrtao=_imgurltao.split(".");
                let _lenth=_imgurlArrtao.length;
                if(_imgurlArrtao[_lenth-1]=="gif"){
                    //gif 图不添加水印
                }else{
                  _imgurlArrtao[_lenth-2]=_imgurlArrtao[_lenth-2]+'_w';
                }
                let _imgurlval=_imgurlArrtao.join(".");
                imgHtml+='<p><img src="'+_imgurlval+'"/></p>';
                this.editor.insertEmbed(this.myEditorindex, 'image', _imgurlval);
                this.editor.insertText(this.myEditorindex+1, ' ', {
                  'color': '#111',
                  'italic': false
                });
                console.log(this.formData.content)
              }else{
                this.formData.content=this.formData.content+'<p>'+i+'</p>';
                this.editor.insertEmbed(this.myEditorindex, 'image', this.list[i]);
                this.editor.insertText(this.myEditorindex+1, ' ', {
                  'color': '#111',
                  'italic': false
                });
                // this.editor.setSelection(this.myEditorindex+2)
                this.myEditorindex=this.myEditorindex+2;
              }
            }else{
              let video_url=this.list[i];
              let video_url2=video_url.split(',');
              imgHtml+='<figure class="media"><oembed url="https://media-url"></oembed></figure>'
              // imgHtml+='<iframe class="ql-video" frameborder="0" allowfullscreen="true" src="'+video_url2[0]+'"></iframe>'
            }
          }
          // this.formData.content=this.formData.content+imgHtml;
          this.fileImgBox=false;
          this.fileImgData=[];
          this.list=[];
        },
        clickFileVideoBtn:function(){
          //编辑器视频上传按钮
          this.fileImgBox=true;
          this.fileType=4;
          this.fileImgBoxNav=1;
          this.filleUrl=this.mediaAssetsUrl_1+config.uploadUrl;
          this.filleParameterName="upload"
        },
        clickFileImgBtn:function(){
          this.editor=this.editor2;
          //编辑器图片上传按钮
          this.fileImgBoxNav=1;
          this.sucaiList=[];
          this.fileImgBox=true;
          this.fileType=0;
          this.filleUrl=this.mediaAssetsUrl_1+config.watermarkImg;
          this.filleParameterName="file"
        },
        clickFileImg:function(){
          this.fileImgBox=false;
          this.fileImgData=[];
          this.myMedia=false;
        },
        draDelet(index){
          let _index=this.list.indexOf(this.list[index]);
          this.list.splice(_index,1);
        },
        startfille(){
          this.listloding=true;
        },
        handleAvatarSuccess(res, file){
          // console.log('返回')
          this.fileImgData.push(res.data);
          this.list.push(res.data);
          if(this.fileType==4){
            this.fileImgAscertain();
          }
          this.listloding=false;
        },
        handleRemove(file, fileList) {
          //移除时
          // console.log(fileList);
          let fileListData=[];
          for(let i=0; i<fileList.length; i++){
            fileListData.push(fileList[i].response.data)
          }
          this.fileImgData=fileListData
        },
        handlePictureCardPreview(file) {
          this.dialogImageUrl = file.url;
          this.dialogVisible = true;
        },
        clicklei:function(index){
          this.formData.cagetory=index+1;
          this.cagetoryType=index;
          // console.log(this.formData.cagetory)
        },
        getSubmit:function(){
          this.transcoding();
          let _this=this;
          _this.fttlodingBox=true;
          if(this.formData.fileType==0){
            this.formData.covers=[];
          }else if(this.formData.fileType==4 && this.formData.covers.length<1){
            // alert('单图');
            this.$message("请上传封面图");
            _this.fttlodingBox=false;
            return false
          }else if(this.formData.fileType==1 && this.formData.covers.length<1){
            //右单图
            this.$message("请上传封面图");
            _this.fttlodingBox=false;
            return false
          }else if(this.formData.fileType==2 && this.formData.covers.length<3){
            // alert('三图');
            this.$message("请上传封面图");
            _this.fttlodingBox=false;
            return false
          }
          this.$http({
            method:'post',
            url:config.postText,
            data:this.formData
          }).then((res)=>{
            if(res.data.status==500){
              // res.data.message
              this.fttlodingBox=false;
              this.$message(res.data.message);
            }else if(res.data.status==200){
              this.$message({
                showClose: true,
                message: '保存成功!',
                type: 'success'
              });
              // parent.addTabpp('{"name":"内容管理"}');
              eventBus.$emit('changeurl',{url:'/content/index',index:1});
              this.$router.push('/content/index')
            }else{
              this.$message(res.data.message);
            }
          }).catch(function(err){
            _this.fttlodingBox=false;
            console.log(err)
          })
        },
      clickrelease:function(){
        this.formData.status=2;
        this.formData.isTimer=2;
        if(this.formData.content==''){
          this.$message('内容不能为空');
          return false
        }
        if(this.formData.columnId==''){
          this.$message('请选择栏目');
          return false
        }
        if(this.formData.title==''){
          this.$message('标题不能为空');
        }else if(this.formData.fileType==2){
          if(!this.formData.covers[0]){
            this.$message('封面图不能少于三张！');
          }else if(!this.formData.covers[1]){
            this.$message('封面图不能少于三张！');
          }else if(!this.formData.covers[2]){
            this.$message('封面图不能少于三张！');
          }else{
            this.getSubmit()
          }
        }else{
          this.getSubmit()
        }

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
            if(this.formData.title==''){
              this.$message('标题不能为空');
              return false
            }else if(this.formData.content==''){
              this.$message('内容不能为空');
              return false
            }else if(this.formData.columnId==''){
              this.$message('请选择栏目');
              return false
            }else{
              this.getSubmit()
            }
            this.timing=false
          }else{
            this.$message('时间不能为空！');
            return false
          }
      },
      clickdraft:function(){
        this.formData.status=0;
        this.formData.isTimer=2;
        if(this.formData.title==''){
          this.$message('发布内容不能为空');
        }else{
          this.getSubmit()
        }
      },
      onEditorBlur(editor){//失去焦点事件
        this.myEditorindex=editor.selection.savedRange.index;
      },
      onEditorFocus(editor){//获得焦点事件
        this.editor=editor;
        this.myEditorindex=editor.selection.savedRange.index;
        var selection = getSelection();
        // 设置最后光标对象
        this.lastEditRange = selection.getRangeAt(0);
        this.startOffset=selection.getRangeAt(0).startOffset;
        let length = editor.getSelection().index;
        // editor.insertEmbed(length,'link', {href:'www.baidu.com', innerText:'投票'}, "api");
        // document.execCommand('insertText', true, editor);
        // console.log(editor.selection.savedRange.index)
      },
      onEditorChange({editor,html,text}){
        //编辑器文本发生变化 //this.content可以实时获取到当前编辑器内的文本内容 console.log(this.content);
        // console.log(text);
      },
       //选择素材图片顺序
        imgOrder(url){
          let _mu=0;
          for(let i=0; i<this.list.length; i++){
            if(url==this.list[i]){
              _mu=i+1;
            }
          }
          return _mu
        },
    },
    }
    // .ql-toolbar.ql-snow
    $(window).on("click",function(e){
      var _w=$(document).width();
      var _w2=(_w-1180)/2;
      // alert(_w2+200+318);
      var target = e.target;
      // if($(target).is('.ck-editor__editable')||$(target).parents('.ck-editor__editable').length>0){
      if($(target).is('.ql-editor')||$(target).parents('.ql-editor').length>0){
        // alert("获得焦点");
        var _scll=$(window).scrollTop();
        if(_scll>200){
          $(".ql-toolbar.ql-snow").css({"position":"fixed","top":75});
          $(".hhtxiconfonttoupiao").css({"position":"fixed","left":_w2+200+520,"top":5+75});
          $(".addimg").css({"position":"fixed","left":_w2+200+572,"top":3+75});
          $(".add-video").css({"position":"fixed","left":_w2+200+620,"top":3+75});
          $(".add-audeo").css({"position":"fixed","left":_w2+200+668,"top":1+75});
        }else{
          $(".hhtxiconfonttoupiao").css({"position":"absolute","left":520,"top":5});
          $(".addimg").css({"position":"absolute","left":572,"top":3});
          $(".add-video").css({"position":"absolute","left":620,"top":3});
          $(".add-audeo").css({"position":"absolute","left":668,"top":1});
        }
        $(window).bind('scroll',function () {
          var _sclltop=$(window).scrollTop();
          if(_sclltop>200){
            $(".ql-toolbar.ql-snow").css({"position":"fixed","top":75});
            $(".hhtxiconfonttoupiao").css({"position":"fixed","left":_w2+200+520,"top":5+75});
            $(".addimg").css({"position":"fixed","left":_w2+200+572,"top":3+75});
            $(".add-video").css({"position":"fixed","left":_w2+200+620,"top":3+75});
            $(".add-audeo").css({"position":"fixed","left":_w2+200+668,"top":1+75});
          }else{
            $(".ql-toolbar.ql-snow").css({"position":"static","top":75});
            $(".hhtxiconfonttoupiao").css({"position":"absolute","left":520,"top":5});
            $(".addimg").css({"position":"absolute","left":572,"top":3});
            $(".add-video").css({"position":"absolute","left":620,"top":3});
            $(".add-audeo").css({"position":"absolute","left":668,"top":1});
          }
        })
      }
      else {
        // alert("失去焦点");
        $(".ql-toolbar.ql-snow").css({"position":"static","top":75});
        $(".hhtxiconfonttoupiao").css({"position":"absolute","left":520,"top":5});
        $(".addimg").css({"position":"absolute","left":572,"top":3});
        $(".add-video").css({"position":"absolute","left":620,"top":3});
        $(".add-audeo").css({"position":"absolute","left":668,"top":1});
        $(window).unbind('scroll')
      }
    })
</script>

<style scoped>
  @import "../css/fatoutiao.css";
  .post-article{
    height: 100%;
  }
  .article_box{
    height: calc(100% - 68px);
  }
</style>
