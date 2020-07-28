<template>
  <div class="image-text">
    <ul class="nav_top" style="padding: 0px">
      <li v-for="(itme,index) in navList" :class="navType==index?'active':''" @click="clickNavs(index)">{{itme.navItem}}</li>
    </ul>
    <div class="bar">
      <div class="left" style="border: none">
        <!--<div class="all ac">全部（{{records}}）</div>-->
        <!--<div class="all ac">全部</div>-->
        <!--<div class="lastest">最新</div>-->
      </div>
      <div class="right">
        <div class="num">
          <p>总评论<span>{{records}}</span>条</p>
          <p>待审核<span>{{notAudit}}</span>条</p>
        </div>
        <div class="select-all">
          <div class="yes" :class="isSelectedAll==1?'selected':''" @click="selectItem(undefined)">全选</div>
          <div class="btns-bar" v-show="showBtn==1">
            <!--<div @click="selectAllAddElite(1)" :class="isEliteAll==1?'ac':''">加精</div>-->
            <!--<div @click="selectAllAddElite(2)" :class="isRecommendAll==1?'ac':''">加荐</div>-->
            <div @click="selectAllAddElite(1)">加精</div>
            <div @click="selectAllAddElite(2)">加荐</div>
            <div @click="deleteAll">删除</div>
          </div>
        </div>
      </div>
    </div>
    <ul>
      <li v-for="(item,index) in dataList" :key="index">
        <div class="headpic"><img :src="item.userPortrait" alt=""></div>
        <div class="right">
          <div class="check" :class="item.isChecked==1?'checked':''" @click="selectItem(index)"></div>
          <div class="status" v-if="false">
            <div class="yes" v-show="item.verifyStatus==1">审核通过</div>
            <div class="yes" v-show="item.verifyStatus==2">审核未通过</div>
            <div class="will" v-show="item.verifyStatus==0">
              <div class="label">待审核</div>
              <div class="btns-bar">
                <div @click="clickAudit(index,1)">通过</div>
                <div @click="clickAudit(index,2)">不通过</div>
              </div>
            </div>
          </div>
        </div>
        <div class="info">
          <div class="top">
            <div class="name">
              <div>{{item.userName}}</div>
              <p>{{item.creatTime}}</p>
            </div>
            <div class="title">
              <div v-html="item.contentTitle"></div>
              <p v-show="item.isGood==1" style="background-image: url(../../static/images/icon/jinhua.png)"></p><!--精华-->
              <p v-show="item.isRecommend==1" style="background-image: url(../../static/images/icon/tuijian.png)"></p><!--推荐-->
            </div>
          </div>
          <div class="des">
            <span>{{item.commentContent}}</span>
            <span style="display: block" v-for="(imghtml,index) in item.imghtml" :key="imghtml.index">
              <img style="width: 100px;" :src="imghtml">
            </span>
          </div>
          <div class="reply-reply" v-if="false"></div>
          <div class="reply" v-show="item.replyBtn">
            <input v-model="commentsReply" type="text"/>
            <div @click="submitReplyBtn(index)">发送</div>
          </div>
          <div class="btns-bar">
            <div v-if="false" :class="item.isGood==1?'ac':''" @click="selectAllAddElite(1,index)">加精</div>
            <div v-if="false" :class="item.isRecommend==1?'ac':''" @click="selectAllAddElite(2,index)">加荐</div>
            <div @click="deleteItem(index)">删除</div>
            <div @click="clickReplyBtn(index)">回复</div>
          </div>
        </div>
      </li>
    </ul>
    <!--翻页器图文-->
    <div class="page_box" v-if="records>10" v-show="navType==0">
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="handleCurrentChange6"
        :page-size="10"
        :total="records">
      </el-pagination>
    </div>
    <!--翻页器小视频-->
    <div class="page_box" v-if="records>10" v-show="navType==1">
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="handleCurrentChange6"
        :page-size="10"
        :total="records">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {config} from "../router/httpConfig.js";
  import {mapState} from 'vuex'
  export default {
    name: "imageText",
    created:function(){
      //beforeCreate
      this.userInfo=this.$store.state.userInfo
      //获取域名
      this.$http({
        url:config.globalUrl
      }).then((res)=>{
        let _appbackUrl=res.data.data.appbackUrl;
        let _mediaAssetsUrl=res.data.data.mediaAssetsUrl;
            this.appbackUrl=res.data.data.appbackUrl;
            this.mediaAssetsUrl=res.data.data.mediaAssetsUrl;

            //获取用户信息
            this.$http({
              url:config.userUrl
            }).then((res)=>{
              // console.log(res.data.data.userId);
              this.commentsData.userId=res.data.data.appbackId;
              if(res.data.data.areaId==null){
                this.areaId=0
              }else{
                this.areaId=res.data.data.areaId;
              }
              // this.commentsData.userId=78;
              let _id=res.data.data.appbackId;
              // let _id='3fbd6e06504248938039d4af7fef9cfe';
              //获取评论列表
              this.$http({
                url:_appbackUrl+config.commentsListUrl+'?userId='+_id+'&type=1'+'&areaId='+this.areaId
              }).then((res)=>{
                let list=res.data.data.rows;
                for(let i=0; i<list.length; i++){
                  list[i].replyBtn=false;
                  let _imghtml=[];
                  if(list[i].titleFilePath && list[i].titleFilePath!=""){
                    let _img=list[i].titleFilePath.split(",");
                    for(let n=0; n<_img.length; n++){
                      _imghtml[n]=_img[n]
                    }
                  }
                  var dd=list[i].commentContent.replace(/<\/?.+?>/g,"");
                  var dds=dd.replace(/ /g,"");//dds为得到后的内容
                  list[i].imghtml=_imghtml;
                  list[i].commentContent=dds;
                }
                this.dataList=list;
                this.records=res.data.data.records;
              }).catch((err)=>{
                console.log(err)
              });
              //获取未审核数
              this.$http({
                url:_appbackUrl+config.notAuditUrl+'?userId='+_id+'&type=1'+'&areaId='+this.areaId
              }).then((res)=>{
                // console.log(res.data.data);
                this.notAudit=res.data.data;
              })
            }).catch((err)=>{
              console.log(err)
            })

      }).catch((err)=>{
        // console.log(err)
      });
    },
    data(){
      return{
        currentPage:1,
        appbackUrl:'',//两微一端域名
        mediaAssetsUrl:'',//媒资域名
        records:0,//总条数
        notAudit:0,//未审核数
        numberData:0,
        isSelectedAll:0,
        isEliteAll:0,
        isRecommendAll:0,
        showBtn:0,
        dataList:[
          // {
          //   id:1,
          //   headpic:'../../static/images/01.png',
          //   userName:'独行侠',
          //   creatTime:'2019-04-22 13:01',
          //   bookName:"文章《小时代》",
          //   isJing:1,
          //   isRecommend:1,
          //   isChecked:0,
          //   content:'23日下午，中共中央总书记、国家主席、中央军委主席习近平将出席庆祝人民海军成立70周年海上阅兵活动。今天中午，习近平来到青岛奥帆中心码头，检阅了中国人民解放军海军仪仗队，随后登上“西宁”号检阅舰。（央视记者 张伟 徐少兵 张建庆 步晓强 李斌 黄显文 刘笑宇 摄影 李刚）',
          //   status:1
          // },
          // {
          //   id:1,
          //   headpic:'../../static/images/01.png',
          //   userName:'独行侠',
          //   creatTime:'2019-04-22 13:01',
          //   bookName:"文章《小时代》",
          //   isJing:1,
          //   isRecommend:1,
          //   isChecked:0,
          //   content:'23日下午，中共中央总书记、国家主席、中央军委主席习近平将出席庆祝人民海军成立70周年海上阅兵活动。今天中午，习近平来到青岛奥帆中心码头，检阅了中国人民解放军海军仪仗队，随后登上“西宁”号检阅舰。（央视记者 张伟 徐少兵 张建庆 步晓强 李斌 黄显文 刘笑宇 摄影 李刚）',
          //   status:1
          // }
        ],
        commentsData:{
          userId:78,
          id:[],
          type:'',//1：加精；2：加荐；3：删除
          status:''
        },//加精/加荐/删除评论
        navList: [
          {path: '/commentManagement/commentImageText', navItem: '图文',type:1},
          {path: '/commentManagement/commentImageText2', navItem: '小视频',type:2},
          {path: '/commentManagement/commentImageText3', navItem: '图集',type:3},
        ],
        navType:0,
        commentsReply:'',
        areaId:0
      }
    },
    methods:{
      submitReplyBtn(index){
        let userInfo=this.$store.state.userInfo;
        var _this=this;
        this.dataList[index].replyBtn=false;
          this.$http({
            url:this.appbackUrl+'/a/contentApi/save/comment?commentContent='+_this.commentsReply+'&coreContentId='+_this.dataList[index].id+'&commentUserId='+userInfo.appbackId+'&parentId='+_this.dataList[index].id+'&areaId='+this.areaId,
            // data:{
            //   commentUserId:userInfo.appbackId,//评论者id
            //   commentContent:_this.commentsReply,//评论内容
            //   parentId:_this.dataList[index].id,  //评论id
            //   coreContentId:_this.dataList[index].id,//评论id
            // }
          }).then((res)=>{
            this.$message({
              message: '发送成功！请等待审核',
              type: 'success'
            });
            _this.commentsReply="";
          }).catch((err)=>{
            this.$message.error(err.message);
            // console.log(err)
          });
      },
      clickReplyBtn(index){
        if(this.dataList[index].replyBtn){
          this.dataList[index].replyBtn=false
        }else{
          this.dataList[index].replyBtn=true
        }
      },
      checkPending(val){
        //获取未审核数
        this.$http({
          url:this.appbackUrl+config.notAuditUrl+'?userId='+this.commentsData.userId+'&type='+val+'&areaId='+this.areaId
          }).then((res)=>{
          // console.log(res.data.data);
          this.notAudit=res.data.data;
          }).catch((err)=>{
            console.log(err)
          })
      },
      clickNavs(index){
        this.navType=index;
        this.myListdata();
        this.checkPending(index+1)
      },
      myListdata(){
        //获取评论列表
        this.$http({
          url:this.appbackUrl+config.commentsListUrl+'?userId='+ this.commentsData.userId+'&type='+(this.navType+1)+'&areaId='+this.areaId
        }).then((res)=>{
          // console.log(res.data.data.rows);
          let list=res.data.data.rows;
          for(let i=0; i<list.length; i++){
            list[i].replyBtn=false;
            let _imghtml=[];
            if(list[i].titleFilePath && list[i].titleFilePath!=""){
              let _img=list[i].titleFilePath.split(",");
              for(let n=0; n<_img.length; n++){
                _imghtml[n]=_img[n]
              }
            }
            var dd=list[i].commentContent.replace(/<\/?.+?>/g,"");
            var dds=dd.replace(/ /g,"");//dds为得到后的内容
            list[i].imghtml=_imghtml;
            list[i].commentContent=dds;
          }
          this.dataList=list;
          this.records=res.data.data.records;
        }).catch((err)=>{
          console.log(err)
        })
      },
      handleCurrentChange6(val){
        this.$http({
          url:this.appbackUrl+config.commentsListUrl+'?userId='+this.commentsData.userId+'&page='+val+'&type='+(this.navType+1)+'&areaId='+this.areaId
        }).then((res)=>{
          this.dataList=res.data.data.rows;
          this.records=res.data.data.records;
        }).catch((err)=>{
          console.log(err)
        })
      },
      clickAudit(index,val){
        //审核评论
        this.$http({
          url:this.appbackUrl+config.auditCommentsUrl+'?userId='+this.commentsData.userId+'&ids='+this.dataList[index].id+'&status='+val+'&areaId='+this.areaId
        }).then((res)=>{
          // console.log(res)
          if(val==1){
            this.dataList[index].verifyStatus=1
          }else{
            this.dataList[index].verifyStatus=2
          }
        }).catch((err)=>{
          console.log(err)
        })
      },
      //全部删除
      deleteAll(){
        this.$confirm('你确定删除选中评论吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.commentsData.type=3;
          this.commentsData.status=1;
          this.operationalData();

          this.dataList = this.dataList.filter(item => {
            if(!item.isChecked) {
            return true
        }
      })
        this.ergodicChecked();
      }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
      });
      },
      //删除单个
      deleteItem(index){
        this.commentsData.type=3;
        this.commentsData.id[0]=this.dataList[index].id;

        this.$confirm('确定删除该评论吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.operationalData();
          this.dataList.splice(index,1)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      operationalData(){
        this.$http({
          url:this.appbackUrl+config.deletCommentsUrl+'?type='+this.commentsData.type+'&userId='+this.commentsData.userId+'&ids='+this.commentsData.id+'&status='+this.commentsData.status+'&areaId='+this.areaId,
        }).then((res)=>{
          console.log(res);
          this.dataList.splice(index,1);
          this.commentsData.id=[];
        }).catch((err)=>{
          console.log(err)
        });
      },
      //全选
      selectItem(index){
        // 全选
        if(index==undefined){
          this.isSelectedAll==1?this.isSelectedAll=0:this.isSelectedAll=1;
            this.commentsData.id=[];
          for(var i = 0;i<this.dataList.length;i++){
            if(this.isSelectedAll==1){
              console.log("选中");
              this.showBtn = 1;
              this.dataList[i].isChecked = 1;
              this.commentsData.id[i]=this.dataList[i].id;
            }
            else {
              console.log("取消选中");
              this.showBtn = 0;
              this.dataList[i].isChecked = 0;
            }
          }
        }
        // 单个选择
        else {
          this.dataList[index].isChecked == 1?this.dataList[index].isChecked = 0:this.dataList[index].isChecked = 1;
          this.ergodicChecked();
          if(this.dataList[index].isChecked){
              // console.log("单选选中");
            this.commentsData.id.push(this.dataList[index].id)
          }else{
            // console.log("单选取消");
            let _index=this.commentsData.id.indexOf(this.dataList[index].id);
            this.commentsData.id.splice(_index,1)
          }
        }
      },
      //全选加精华推荐
      selectAllAddElite(flag,index){
        //添加精华tag
        if(flag==1){
          // 操作全部
          if(index==undefined){
            this.isEliteAll==1?this.isEliteAll=0:this.isEliteAll = 1;
            //全加精
            this.commentsData.type=1;
            this.commentsData.status=1;
            this.operationalData();
            for(var i = 0;i<this.dataList.length;i++){
              if(this.isEliteAll==1&&this.dataList[i].isChecked){
                this.dataList[i].isGood = 1;
              }
              else if(this.isEliteAll==0&&this.dataList[i].isChecked){
                this.dataList[i].isGood = 0;
              }
            }
          }
          // 操作单个
          else {
            this.dataList[index].isGood==1?this.dataList[index].isGood=0:this.dataList[index].isGood=1;
            this.ergodicElite(2);

            this.commentsData.type=1;
            this.commentsData.status=this.dataList[index].isGood;
            this.commentsData.id[0]=this.dataList[index].id;
            this.operationalData()

          }
        }
        //添加推荐tag
        else {
          // 操作全部
          if(index==undefined){
            this.isRecommendAll==1?this.isRecommendAll=0:this.isRecommendAll = 1;
            //全加推
            this.commentsData.type=2;
            this.commentsData.status=1;
            this.operationalData();
            for(var i = 0;i<this.dataList.length;i++){
              if(this.isRecommendAll==1&&this.dataList[i].isChecked){
                this.dataList[i].isRecommend = 1;
              }
              else if(this.isRecommendAll==0&&this.dataList[i].isChecked){
                this.dataList[i].isRecommend = 0;
              }
            }
          }
          // 操作单个
          else {
            this.dataList[index].isRecommend==1?this.dataList[index].isRecommend=0:this.dataList[index].isRecommend=1;
            this.ergodicElite(3);
            this.commentsData.type=2;
            this.commentsData.status=this.dataList[index].isRecommend;
            this.commentsData.id[0]=this.dataList[index].id;
            this.operationalData()
          }
        }

      },
      ergodicElite(flag){
        //2遍历是否有精华tag，3遍历是否有推荐tag;
        switch (flag) {
          case 2:
            for(var i = 0;i<this.dataList.length;i++){
              if(this.dataList[i].isJing==0){
                this.isEliteAll = 0;
                break;
              }
            }
            break;
          case 3:
            for(var i = 0;i<this.dataList.length;i++){
              if(this.dataList[i].isRecommend==0){
                this.isRecommendAll = 0;
                break;
              }
            }
            break;
        }

      },
      // 遍历是否全选
      ergodicChecked(){
        this.isSelectedAll = 1;
        this.showBtn = 0;
        this.isEliteAll = 1;
        this.isRecommendAll = 1;
        for(var i = 0;i<this.dataList.length;i++){
          if(this.dataList[i].isChecked==1){
            this.showBtn = 1;
            if(this.dataList[i].isJing==0){
              this.isEliteAll = 0;
            }
            if(this.dataList[i].isRecommend==0){
              this.isRecommendAll = 0;
            }
          }
          if(this.dataList[i].isChecked==0){
            this.isSelectedAll = 0;
          }
        }
      }
    }
  }
</script>

<style scoped>
  .image-text {
    overflow: hidden;
    background: #fff;
    padding: 0 0 100px;
  }

  .bar {
    width: 100%;
    box-sizing: border-box;
    padding: 0 40px;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-align-items: flex-end;
    align-items: flex-end;
    -webkit-justify-content: space-between;
    justify-content: space-between;
    margin-top: 30px;
  }

  .bar .left {
    width: 172px;
    height: 30px;
    box-sizing: border-box;
    border: 1px solid #e71f19;
    line-height: 28px;
    text-align: center;
    font-size: 15px;
    color: #e71f19;
  }

  .bar .left > div {
    float: left;
    width: 50%;
    height: 100%;
    cursor: pointer;
  }

  .bar .left .ac {
    background-color: #e71f19;
    color: #fff;
  }

  .bar .num {
    float: left;
    height: 20px;
    line-height: 20px;
    font-size: 16px;
    margin-right: 70px;
    color: #535353;
  }

  .bar .num p {
    padding: 0 13px;
    float: left;
  }

  .bar .num p:first-child {
    border-right: 2px solid #535353;
  }

  .bar .num span {
    color: #e71f19;
  }

  .bar .select-all {
    float: left;
    font-size: 14px;
    color: #222222;
    position: relative;
    cursor: pointer;
  }

  .bar .yes {
    padding-right: 30px;
    position: relative;
  }

  .bar .yes:after {
    content: '';
    display: block;
    width: 18px;
    height: 19px;
    background: url("../../static/images/icon/kuangkuang.png");
    background-size: 100% 100%;
    position: absolute;
    right: 0;
    bottom: 0;
  }

  .bar .selected {
    color: #ff7074;
  }

  .bar .selected:after {
    background: url("../../static/images/icon/gougou.png");
    background-size: 100% 100%;
  }

  .bar .btns-bar {
    width: 145px;
    position: absolute;
    right: 0;
    top: 30px;
    background-color: #eeeeee;
    height: 36px;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-justify-content: center;
    justify-content: center;
    -webkit-align-items: center;
    align-items: center;
    z-index: 1;
  }

  .bar .btns-bar:before{
    content: '';
    width: 10px;
    height: 10px;
    background-color: #eeeeee;
    -webkit-transform: rotate(45deg);
    -moz-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    -o-transform: rotate(45deg);
    transform: rotate(45deg);
    position: absolute;
    right: 28px;
    top: -5px;
    z-index: -1;
  }

  .bar .btns-bar div {
    height: 15px;
    line-height: 15px;
    font-size: 14px;
    cursor: pointer;
    border-right: 1px solid #222222;
    padding: 0 7px;
  }
  .bar .btns-bar .ac {
    color: #ff7074;
  }
  .bar .btns-bar div:last-child {
    border-right: none;
    color: #222;
  }

  ul{
    padding: 0 40px;
    margin-top: 30px;
  }
  li{
    padding: 34px 0 15px;
    border-bottom: 1px solid #bfbfbf;
    position: relative;
    list-style: none;
  }
  li .headpic{
    width: 45px;
    height: 45px;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    overflow: hidden;
    background-color: #eee;
    float: left;
  }
  li .headpic img{
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  li .right{
    box-sizing: border-box;
    position: absolute;
    right: 0;
    top: 0;
    width: 160px;
    height: 100%;
    text-align: right;
    padding-top: 45px;
  }
  li .right .check{
    width: 18px;
    height: 19px;
    background: url("../../static/images/icon/kuangkuang.png");
    background-size: 100% 100%;
    margin-left: 142px;
    cursor: pointer;
  }
  li .right .checked{
    background: url("../../static/images/icon/gougou.png");
    background-size: 100% 100%;
  }
  li .right .status{
    position: absolute;
    bottom: 5px;
    right: 0;
    font-size: 14px;
    color: #222;
  }
  li .right  .yes{
    padding-bottom: 10px;
  }
  li .right .will{
    color: #ff7074;
    height: 100%;
    padding-bottom: 10px;
    position: relative;
    cursor: pointer;
  }
  li .right .will:hover .btns-bar{
    display: flex;
  }
  li .right .will .btns-bar{
    width: 110px;
    position: absolute;
    right: 0;
    top: 30px;
    background-color: #eeeeee;
    height: 36px;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-justify-content: center;
    justify-content: center;
    -webkit-align-items: center;
    align-items: center;
    z-index: 1;
    display: none;
  }
  li .right .will .btns-bar:before{
    content: '';
    width: 10px;
    height: 10px;
    background-color: #eeeeee;
    -webkit-transform: rotate(45deg);
    -moz-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    -o-transform: rotate(45deg);
    transform: rotate(45deg);
    position: absolute;
    right: 28px;
    top: -5px;
    z-index: -1;
  }

  li .right .will .btns-bar div {
    height: 15px;
    line-height: 15px;
    font-size: 14px;
    cursor: pointer;
    border-right: 1px solid #222222;
    padding: 0 7px;
    color: #222;
  }

  li .right .will .btns-bar div:last-child {
    border-right: none;
  }
  li .info{
    margin: 0 160px 0 65px;
  }

  li .info .top{
   overflow: hidden;
  }
  li .info .name{
    width: 30%;
    float: left;
    font-size: 16px;
    color: #222;
    line-height: 1.3;
  }
  li .info .name div{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  li .info .name p{
    font-size: 12px;
    color: #999;
    margin-top: 4px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  li .info .title{
    width: 70%;
    box-sizing: border-box;
    padding: 0 20px;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-align-items: center;
    align-items: center;
  }
  li .info .title div{
    font-size: 14px;
    color: #222;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  li .info .title p{
    width: 21px;
    height: 21px;
    min-width: 21px;
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
    margin-left: 9px;
  }
  li .info .des{
    width: 100%;
    padding: 25px 20px;
    background-color: #eeeeee;
    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;
    border-radius: 10px;
    font-size: 14px;
    line-height: 20px;
    color: #4e4e4e;
    margin-top: 14px;
    position: relative;
    z-index: 1;
  }
  li .info .des:before{
    content: '';
    width: 10px;
    height: 10px;
    background-color: #eeeeee;
    -webkit-transform: rotate(45deg);
    -moz-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    -o-transform: rotate(45deg);
    transform: rotate(45deg);
    position: absolute;
    left: 28px;
    top: -5px;
    z-index: -1;
  }
  li .info .btns-bar{
    overflow: hidden;
    margin-top: 15px;
  }
  li .info .btns-bar div{
    float: left;
    height: 15px;
    line-height: 15px;
    font-size: 14px;
    cursor: pointer;
    border-right: 1px solid #222222;
    padding: 0 7px;
  }
  li .info .btns-bar .ac{
    color: #ff7074;
  }
  li .info .btns-bar div:first-child{
    padding-left: 0;
  }
  li .info .btns-bar div:last-child{
    border-right: none;
    color: #222;
  }
  .page_box{
    text-align: center;
    margin-top: 40px;
  }
  .nav_top{
    padding-top: 5px;
    display: flex;
    display: -webkit-flex;
    display: -moz-flex;
    border-bottom: solid 1px #e6e6e6;
    list-style: none;
    height: 60px;
    line-height: 60px;
    background: #fff;
    margin-top: 0px;
  }
  .nav_top li{
    margin: 0px 40px;
    padding: 0px 10px;
    cursor: pointer;
    border: none;
  }
  .nav_top li:nth-child(3){
    display: none;
  }
  .nav_top .active{
    border-bottom: 3px solid #ff353a;
    color: #ff353a;
    font-weight: bold;
  }
  .nav_top li:hover{
    color: #ff353a;
  }
  html,body{
    height: 100%;
  }
  .reply{
    display:flex;
    display:-webkit-flex;
    display:-moz-flex;
    width: 673px;
    margin-top: 10px;
  }
  .reply input{
    display: block;
    width: 650px;
    height: 30px;
    box-sizing: border-box;
  }
  .reply div{
    width: 50px;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    background: #eee;
    border-radius: 5px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    text-align: center;
    margin-left: 10px;
    cursor: pointer;
  }
  .reply-reply{
    padding: 10px;
    background: #eee;
    font-size: 12px;
    border-radius: 2px;
    -webkit-border-radius: 2px;
    -moz-border-radius: 2px;
    margin-top: 10px;
  }
</style>
