<template>
  <div class="vote" id="voteCreate">
    <!--<h2>投票管理</h2>-->
    <div class="route">
      <router-link to="/votingManagement">投票管理 &#62</router-link>
      创建投票
    </div>
    <div class="main-body">
      <div class="des">投票设置后，必须插入图文消息中才可生效，投票将统计该投票在各个渠道的综合结果总和，包括群发消息，自动回复，自定义菜单等等。</div>
      <div class="item">
        <div class="label">投票名称</div>
        <div class="right">
          <el-input class="vote-title init-required-input" v-model="title" placeholder="投票名称只用户管理，不显示在下发的内容中"  maxlength="35"></el-input>
        </div>
      </div>
      <div class="item">
        <div class="label">模板选择</div>
        <div class="right choice-template">
          <el-select v-model="templateStyle" @change="templateStyleChoice">
            <el-option
              v-for="item in templateOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="item">
        <div class="label">封面</div>
        <div class="right">
          <div class="poster">
            <img :src="poster" v-if="poster" @click="alertPreviewImg(poster)">
            <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            name="file"
            accept="image/png,image/jpg,image/jpeg,image/gif"
            :show-file-list="false"
            :on-success="addPoster"
            >
              <img v-if="poster" :src="poster" class="avatar">
            <i  class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          </div>
        </div>
      </div>
      <div class="item">
        <div class="label">规则说明</div>
        <div class="right">
          <el-input
            class="vote-title"
            type="textarea"
            autosize
            :rows="2"
            placeholder="投票规则说明"
            v-model="rule">
          </el-input>
        </div>
      </div>
      <div class="item">
        <div class="label">活动简介</div>
        <div class="right">
          <el-input
            class="vote-title"
            type="textarea"
            autosize
            :rows="2"
            placeholder="请输入内容"
            v-model="synopsis">
          </el-input>
        </div>
      </div>
      <div class="item time">
        <div class="label">开始时间</div>
        <div class="right">
          <el-date-picker
            v-model="date"
            class="init-time-date"
            type="date"
            @change="changeStartTime"
            :picker-options="startDatePicker"
            placeholder="选择日期">
          </el-date-picker>
          <el-time-select
            class="init-time-hour"
            v-model="hourMinute"
            :picker-options="{
    start:'00:00',
    minTime:minHour,
    step: '00:30',
    end: '24:00',
  }"
            placeholder="选择时间">
          </el-time-select>
        </div>
      </div>
      <div class="item time">
        <div class="label">结束时间</div>
        <div class="right">
          <el-date-picker
            v-model="endDate"
            class="init-time-date2"
            type="date"
            @change="changeEndTime"
            :picker-options="endDatePicker"
            placeholder="选择日期">
          </el-date-picker>
          <el-time-select
            class="init-time-hour2"
            v-model="hourMinute2"
            :picker-options="{
    start:'00:00',
    step: '00:30',
    end: '24:00',
  }"
            placeholder="选择时间">
          </el-time-select>
        </div>
      </div>
      <div class="item">
        <div class="label">投票次数</div>
        <div class="right">
          <el-input  @blur="blurText" class="vote-count " v-model="countOfDay" placeholder="每人每天最多投票次数"></el-input>
        </div>
      </div>
      <div class="item">
        <div class="label">投票上限</div>
        <div class="right">
          <el-input  @blur="blurText"  class="vote-max-count " v-model="maxCount" placeholder="每人最多投票次数"></el-input>
        </div>
      </div>
      <div class="item" v-show="isCheckBox==0||isCheckBox==2">
        <div class="label">投票限制</div>
        <div class="right">
          <el-switch
            v-model="isOpenColThreshold"
            active-color="#ff353a"
            inactive-color="#999999">
          </el-switch>
        </div>
      </div>
      <div class="item" v-show="isOpenColThreshold">
        <div class="label">至少选项</div>
        <div class="right">
          <el-input @blur="blurText"  v-show="isOpenColThreshold" v-model="colThreshold" style="width: 120px"></el-input>
          <div class="tip" style="font-size: 12px;margin-left: 10px;color: #666666;display: inline">多选一次性至少需要选择N项</div>
        </div>
      </div>
      <div class="item" v-show="isOpenColThreshold">
        <div class="label">最多选项</div>
        <div class="right">
          <el-input @blur="blurText"  v-show="isOpenColThreshold" v-model="colThresholdCeil" style="width: 120px"></el-input>
          <div class="tip" style="font-size: 12px;margin-left: 10px;color: #666666;display: inline">多选一次性最多选择N项</div>
        </div>
      </div>
      <div class="item" v-show="isOpenColThreshold">
        <div class="label">限制应用</div>
        <div class="right">
          <el-switch
            v-model="isColThresholdGlobal"
            active-color="#ff353a"
            inactive-color="#999999">
          </el-switch>
          <div class="tip" style="font-size: 12px;margin-left: 10px;color: #666666;display: inline">至少至多选项是否应用到每个问题</div>
        </div>
      </div>
      <div class="item">
        <div class="label" style="top: 15px">投票权限</div>
        <div class="right choice-template">
          <el-select v-model="power" multiple >
            <el-option
              v-for="item in powerOptions"
              :key="item.userTypeCode"
              :label="item.userType"
              :value="item.userTypeCode">
            </el-option>
          </el-select>
          <!--<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>-->
          <!--<el-checkbox-group v-model="power" @change="handleCheckedTypeChange">-->
            <!--<el-checkbox v-for="item in powerOptions" :label="item" :key="item">{{item}}</el-checkbox>-->
          <!--</el-checkbox-group>-->
        </div>
      </div>
      <div class="descript">上传图片的最佳尺寸：300像素*300像素，其他尺寸会影响页面效果，格式png，jpeg，jpg，gif。大小不超过1M</div>
      <div class="question-list">
        <div class="template question-list-item" v-for="(item,index) in coreActiviVoteQuestionList" :style="{height:item.isclose==0?'auto':'100px'}">
          <div>
            <h2>问题 <span class="min-title">{{item.isclose==0?'':item.question}}</span>
              <span class="shanchu" @click="deleteQuestion(index)" v-show="index>0">删除</span>
              <span class="close" @click="closeItem(index)">{{item.isclose==0?'收起':'展开'}}</span></h2>
            <div class="item title">
              <div class="label">标题</div>
              <div class="right">
                <el-input class='question-title init-required-input' v-model="item.question" placeholder="请输入内容" maxlength="35" ></el-input>
              </div>
            </div>
            <div class="item">
              <div class="label">选择方式</div>
              <div class="right">
                <el-radio v-model="item.type" label="1" v-show="isCheckBox==0||isCheckBox==1">单选</el-radio>
                <el-radio v-model="item.type" label="2"  v-show="isCheckBox==0||isCheckBox==2">多选</el-radio>
              </div>
            </div>
          </div>
          <div>
            <div class="item title list-item" v-for="(item2,index2) in item.coreActiviVoteQuestionItemList">
              <div class="item-box">
                <div class="label">
                  {{item2.label}}
                </div>
                <div class="img" v-show="item2.attachedPath!=''">
                  <img :src="item2.attachedPath" alt="" @click="alertPreviewImg(item2.attachedPath)">
                  <div class="delete-icon" @click="deleteImgUrl(index,index2)">
                    <i class="el-icon-close"></i>
                  </div>
                </div>
                <div class="right">
                  <el-input v-model="item2.txt" class='init-required-input' placeholder="请输入内容" maxlength="35" :style="{ height: item2.attachedPath?'115px':'40px' }"></el-input>
                </div>
                <!--<div class="add-remarks" @click="addRemarks(index,index2)" ><img src="../../static/images/add-info.png" alt=""></div>-->
                <div class="input" v-show="item2.attachedPath==''&&isMustUploadImg!=2">
                  <el-upload
                    class="avatar-uploader"
                    :action="uploadUrl"
                    name="file"
                    accept="image/png,image/jpg,image/jpeg,image/gif"
                    :show-file-list="false"
                    :on-success="(res,file)=>{return addPicture(res,file, index,index2)}"
                  >
                  </el-upload>
                </div>
                <div class="add" v-show="index2==item.coreActiviVoteQuestionItemList.length-1&&index2>0" @click="addList(index,index2)"><i class="el-icon-plus"></i></div>
                <div class="delete" v-show="index2>1"  @click="deleteList(index,index2)"><i class="el-icon-minus"></i></div>
                <div class="err"  style="font-size: 12px;color: red;display: none;float: left;display:none;line-height: 40px;margin-left: 20px">
                  请选择图片
                </div>
              </div>
              <div>
                <div class="item item-remarks" v-show="item2.remarks" v-for="(item3,index3) in item2.remarks">
                  <div class="right">
                    <el-input v-model="item3.txt" class='init-required-input' v-if="index3==item2.remarks.length-1&&currentTemplateId==7" placeholder="输入连接点击可跳转"></el-input>
                    <el-input v-model="item3.txt" class='init-required-input' v-else></el-input>
                  </div>
                  <!--<div class="delete"  @click="deleteRemarks(index,index2,index3)"><i class="el-icon-minus"></i></div>-->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="add-question" @click="addQuestion">
        <i class="el-icon-plus"></i>添加问题
      </div>
      <div class="btns" id="btns">
        <!--<el-button-group>-->
        <el-button type="danger" @click="saveSubmit(0)">保存</el-button>
          <el-button type="danger" @click="saveSubmit(1)">发布</el-button>
        <!--</el-button-group>-->
        <el-button type="primary" @click="cancelCreat">取消</el-button>
      </div>
    </div>
    <preview-picture v-if="showPreviewImg" :imgSrc="scaleImg" v-on:hidePreview="hidePreviewImg"></preview-picture>
    <div class="loading" v-show="showLoading"><i class="el-icon-loading"></i></div>
  </div>
</template>

<script>
  import {config} from "../router/httpConfig";
  import previewPicture from './previewPicture';

  export default {
    name: "",
    components:{
      previewPicture
    },
    data() {
      return {
        isColThresholdGlobal:false,
        colThresholdCeil:1,
        colThreshold:1,
        isOpenColThreshold:false,
        synopsis:'',
        checkAll:false,
        isIndeterminate:true,
        countOfDay:'',
        maxCount:'',
        checkedType:'',
        endDate:'',
        showLoading:0,
        power:[],
        templateOptions:[ ],
        powerOptions:[],
        powerCode:[],
        templateStyle:1,//模板风格
        currentTemplateId:'',
        showPreviewImg:0,//是否放大图片
        scaleImg:'',//预览图片路径
        contentId:'',//1表示添加
        uploadUrl:'',//图片上传路径
        title:'',//投票标题
        rule:'',
        date:new Date(),
        minHour:'',
        startDatePicker:this.beginDate(),
        endDatePicker:this.onlineDate(),
        poster:'',
        hourMinute:'',
        isComplete:1,
        hourMinute2:'',
        coreActiviVoteQuestionList:[
          {
            question:'',
            type:this.isCheckBox==2?'2':'1',
            isclose:0,
            coreActiviVoteQuestionItemList:[
              {
                label:'选项一',
                txt:'',
                attachedPath:'',
              },
              {
                label:'选项二',
                txt:'',
                attachedPath:'',
              },
              {
                label:'选项三',
                txt:'',
                attachedPath:'',
              }
            ]
          }
        ],
        isCheckBox:0,
        maxItem:1,
        isMustUploadImg:0
      }
    },
    methods:{
      deleteQuestion(index){
        this.$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.coreActiviVoteQuestionList.splice(index,1);
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {

        });
      },
      // 获取投票模板
      getTemplateVote(){
        this.$http({
          url:config.voteTemplateUrl,
        }).then((res)=>{
          this.templateOptions = res.data.data;
          if(this.contentId==''){
            this.isCheckBox = res.data.data[this.templateStyle-1].type;
            this.maxItem = res.data.data[this.templateStyle-1].max_item;
            this.templateStyleChoice()
          }
          else {
            this.getDetails()
          }
        }).catch(function(err){
        });
      },
      // 投票次数控制为正整数
      blurText(e){
        var reg = /^[1-9][0-9]*$/;
        var val = e.target.value;
        if(val){
          if(!reg.test(val)){
            this.$message.warning('请输入非0正整数！')
            e.target.value =1;
          }
        }
      },
      // 修改模板
      templateStyleChoice(){
        var arr = this.coreActiviVoteQuestionList;
        this.maxItem = this.templateOptions[this.templateStyle-1].max_item;
        this.isMustUploadImg = this.templateOptions[this.templateStyle-1].must_img;
        this.isCheckBox = this.templateOptions[this.templateStyle-1].type;
        this.currentTemplateId = this.templateOptions[this.templateStyle-1].id;
        if(this.maxItem==1){
          for(var j=0;j<arr.length;j++){
            arr[j].type = (this.isCheckBox==1?'1':'2');
            for(var m=0;m<arr[j].coreActiviVoteQuestionItemList.length;m++){
              if(arr[j].coreActiviVoteQuestionItemList[m].remarks){
                arr[j].coreActiviVoteQuestionItemList[m].remarks = null;
              }
            }
          }
          this.coreActiviVoteQuestionList = arr;
        }
        else{
          arr = this.coreActiviVoteQuestionList;
          for(var k=0;k<arr.length;k++){
            arr[k].type = (this.isCheckBox==1?'1':'2');
            for(var i=0;i<arr[k].coreActiviVoteQuestionItemList.length;i++){
              var remarks = [];
              for(var s=0;s<this.maxItem-1;s++){
                var ss = {
                  txt:''
                }
                remarks.push(ss)
              }
              this.$set(this.coreActiviVoteQuestionList[k].coreActiviVoteQuestionItemList[i],'remarks',remarks)
            }
          }
        }
      },
      //获取用户类型
      getUserPower(){
        this.$http({
          url:this.$store.state.appbackUrl+config.uerTypeUrl,
        }).then((res)=>{
          var data = res.data.data;
          this.powerCode = data;
          var allObj = {
            "id":"-1",
            "remarks":"所有APP用户",
            "userType":"所有APP用户",
            "userTypeCode":"-1",
          }
          data.unshift(allObj)
          this.powerOptions = data;
          // if(this.contentId!=-1){
          //   this.getDetails()
          // }
        }).catch(function(err){
        });
      },
      //删除remarks
      deleteRemarks(index,index2,index3){
        var arr = this.coreActiviVoteQuestionList;
        for(var i=0;i<arr[index].coreActiviVoteQuestionItemList.length;i++){
          arr[index].coreActiviVoteQuestionItemList[i].remarks.splice(index3,1)
        }
        this.coreActiviVoteQuestionList = [];
        this.coreActiviVoteQuestionList = arr;
      },
      //增加remarks
      addRemarks(index,index2){
        for(var i=0;i<this.coreActiviVoteQuestionList[index].coreActiviVoteQuestionItemList.length;i++){
          var obj = {
            txt:''
          }
          var arr = this.coreActiviVoteQuestionList[index].coreActiviVoteQuestionItemList[i].remarks;
          if(!arr){
            arr = [];
          }
          arr.push(obj)
          this.$set(this.coreActiviVoteQuestionList[index].coreActiviVoteQuestionItemList[i],'remarks',arr)
        }
        this.judgeInput()
      },
      hidePreviewImg(res){
        this.showPreviewImg = res;
      },
      alertPreviewImg(src){
        this.scaleImg = src;
        this.showPreviewImg = 1;
      },
      changeStartTime(){
        this.endDate = '';
        var myDate = new Date();
        if(myDate.getDate()<this.date.getDate()){
          this.minHour = ''
        }
        else {
          this.getNowTime()
        }
        this.endDatePicker = Object.assign({}, this.endDatePicker, {
          disabledDate: (time) => {
            if (this.date) {
              return time.getTime() < this.date.getTime() + 86400000;
            } else {
              return time.getTime < Date.now();
            }
          }
        });
      },
      changeEndTime(){
        // this.startDatePicker = Object.assign({}, this.startDatePicker, {
        //   disabledDate: (time) => {
        //     if (this.endDate) {
        //       return time.getTime() > this.endDate - 86400000 || time.getTime() < Date.now() - 86400000;
        //     } else {
        //       return time.getTime() < Date.now() - 86400000;
        //     }
        //   }
        // })
      },
      onlineDate(){
        var that = this;
        return {
          disabledDate(time){
            return time.getTime() < Date.now();
          }
        }
      },
      beginDate(){
        return {
          disabledDate(time){
            return time.getTime() < Date.now() - 86400000;
          }
        }
      },
      // 获取当前时间
      getNowTime(){
        var myDate = new Date();
        var currentHour = this.addZero(myDate.getHours())+":"+this.addZero(myDate.getMinutes());
        this.minHour = currentHour;
        this.hourMinute = currentHour
      },
      //增加封面图
      addPoster(res,file){
        // var index = res.data.lastIndexOf('.')
        // var url = res.data.slice(0,index)+'_t'+res.data.slice(index);
        this.poster = res.data;
        $('.poster .el-upload').css('border','1px dashed #999')
      },
      // 取消
      cancelCreat(){
        this.$router.push({
          path: `/votingManagement`,
        })
      },
      // input输入框blur
      judgeInput(){
        var input = $('.init-required-input').find('input')
        for(var i=0;i<input.length;i++){
          input[i].onblur = function (n) { //n为形参
            return function () {
              if(input[n].value==''){
                input[n].style.border='1px solid red';
              }
              else {
                input[n].style.border ='1px solid #DCDFE6';
              }
            }
          }(i)
        }
      },
      //点击提交时验证表单
      judgeData(){
        this.isComplete = 1;
        if(this.title==''){
          $('.vote-title input').focus();
          $('.vote-title input').css('border','1px solid red')
          this.isComplete = 0;
          this.judgeInput()
          return false
        }
        if(this.maxCount==''&&this.countOfDay==''){
          $('.vote-count input').focus();
          $('.vote-count input').css('border','1px solid red')
          this.$message({
            message: '每人每天投票上限和总投票次数不能同时为空！',
            type: 'warning'
          });
          this.isComplete = 0;
          return false;
        }
        if(this.isOpenColThreshold){
          if(this.colThreshold==''||!this.colThreshold){
            this.$message({
              message: '已开启投票数量权限请设置最少选项！',
              type: 'warning'
            });
            this.isComplete = 0;
            return false;
          }
          if(this.colThresholdCeil==''||!this.colThresholdCeil){
            this.$message({
              message: '已开启投票数量权限请设置最多选项！',
              type: 'warning'
            });
            this.isComplete = 0;
            return false;
          }
          if(parseInt(this.colThreshold)>parseInt(this.colThresholdCeil)){
            this.$message({
              message: '最少项不能大于最多选项！',
              type: 'warning'
            });
            this.isComplete = 0;
            return false;
          }
        }
        if(this.maxCount!=''&&this.countOfDay!=''){
          // $('.vote-count input').focus();
          if(parseInt(this.maxCount)<parseInt(this.countOfDay)){
            $('.vote-count input').css('border','1px solid red')
            this.$message({
              message: '每人每天投票上限不能大于总投票次数！',
              type: 'warning'
            });
            this.isComplete = 0;
            return false;
          }

        }
        if(this.power.length==0){
          this.$message({
            message: '请选择投票用户权限',
            type: 'warning'
          });
          this.isComplete = 0;
          return false;
        }
        for(var i=0;i<this.coreActiviVoteQuestionList.length;i++){
          if(this.coreActiviVoteQuestionList[i].question==''){
            console.log('i___'+i)
            $('.question-list-item').eq(i).find('.question-title input').focus()
            $('.question-list-item').eq(i).find('.question-title input').css('border','1px solid red')
            this.isComplete = 0;
            break
          }

          for(var j=0;j<this.coreActiviVoteQuestionList[i].coreActiviVoteQuestionItemList.length;j++){
            if(this.coreActiviVoteQuestionList[i].coreActiviVoteQuestionItemList[j].txt==''){
              console.log('i___'+i)
              console.log('j___'+j)
              $('.question-list-item').find('.list-item').eq(j).find('.init-required-input input').focus()
              $('.question-list-item').find('.list-item').eq(j).find('.init-required-input input').css('border','1px solid red')
              this.isComplete = 0;
              break
            }
            if(this.coreActiviVoteQuestionList[i].coreActiviVoteQuestionItemList[j].attachedPath==''&&this.isMustUploadImg==1){
              $('.question-list-item').find('.list-item').eq(j).find('.err').show()
              this.isComplete = 0;
              break
            }
            // if(this.coreActiviVoteQuestionList[i].coreActiviVoteQuestionItemList[j].remarks){
            //   for(var m = 0;m<this.coreActiviVoteQuestionList[i].coreActiviVoteQuestionItemList[j].remarks.length;m++){
            //     if(this.coreActiviVoteQuestionList[i].coreActiviVoteQuestionItemList[j].remarks[m].txt==''){
            //       console.log('i___'+i)
            //       console.log('i___'+j)
            //       console.log('i___'+m)
            //       $('.question-list-item').find('.item-remarks').eq(m).find('.init-required-input input').focus()
            //       $('.question-list-item').find('.item-remarks').eq(m).find('.init-required-input input').css('border','1px solid red')
            //       this.isComplete = 0;
            //       break
            //     }
            //   }
            // }
          }
        }

        if(this.date==''){
          $('.init-time-date').find('input').css({border:'1px solid red'})
          $('.init-time-date').find('input').focus()
          this.isComplete = 0;
          return false;
        }
        if(this.hourMinute==''){
          $('.init-time-hour').find('input').css({border:'1px solid red'})
          $('.init-time-hour').find('input').focus()
          this.isComplete = 0;
          return false;
        }
        if(this.endDate==''){
          $('.init-time-date2').find('input').css({border:'1px solid red'})
          $('.init-time-date2').find('input').focus()
          this.isComplete = 0;
          return false;
        }
        if(this.hourMinute2==''){
          $('.init-time-hour2').find('input').css({border:'1px solid red'})
          $('.init-time-hour2').find('input').focus()
          this.isComplete = 0;
          return false;
        }
        if(this.poster==''){
          this.isComplete = 0;
          $(window).scrollTop(0)
          $('.poster .el-upload').css('border','1px dashed red')
          return false;
        }
      },
      // 点击保存并发布
      saveSubmit(flag){
        this.isComplete = 1;
        this.judgeData()
        if(this.isComplete){
          var isPublish = 0;
          var des = '保存成功!'
          if(flag){
            isPublish = 1;
            des = '保存并发布成功!'
          }
          for(var i=0;i<this.coreActiviVoteQuestionList.length;i++){
            this.coreActiviVoteQuestionList[i].type = parseInt(this.coreActiviVoteQuestionList[i].type);
            for(var j=0;j<this.coreActiviVoteQuestionList[i].coreActiviVoteQuestionItemList.length;j++){
              var attctch = this.coreActiviVoteQuestionList[i].coreActiviVoteQuestionItemList[j].attachedPath;
              if(attctch.indexOf('_t')==-1){
                var index = attctch.lastIndexOf('.')
                this.coreActiviVoteQuestionList[i].coreActiviVoteQuestionItemList[j].attachedPath = attctch.slice(0,index)+'_t'+attctch.slice(index);
              }
            }
            // if(this.maxItem==4){
            //   for(var i=0){}
            //   for(var j=0;j<this.coreActiviVoteQuestionList[0].coreActiviVoteQuestionItemList.length;j++){
            //     if(this.coreActiviVoteQuestionList[0].coreActiviVoteQuestionItemList[j].remarks){
            //       this.coreActiviVoteQuestionList[0].coreActiviVoteQuestionItemList[j].remarks = JSON.stringify(this.coreActiviVoteQuestionList[0].coreActiviVoteQuestionItemList[j].remarks)
            //     }
            //   }
            // }
          }
          var sd = new Date(this.date);
          var time =sd.getFullYear() + '-' + this.addZero((sd.getMonth() + 1)) + '-' + this.addZero(sd.getDate());
          var ed = new Date(this.endDate);
          var time2 =ed.getFullYear() + '-' + this.addZero((ed.getMonth() + 1)) + '-' + this.addZero(ed.getDate());
          var obj = {
            id:this.contentId,
            synopsis:this.synopsis,
            modal:parseInt(this.templateStyle),
            tempChoiceType:this.isCheckBox,
            title:this.title,
            endDate: time2+' '+this.hourMinute2+':00',
            startDate: time+' '+this.hourMinute+':00',
            cover:this.poster,
            authen:this.power.join(','),
            colThreshold:this.isOpenColThreshold?this.colThreshold:-1,
            colThresholdCeil:this.isOpenColThreshold?this.colThresholdCeil:-1,
            isColThresholdGlobal:this.isOpenColThreshold&&this.isColThresholdGlobal?1:0,
            coreActiviVoteQuestionList:this.coreActiviVoteQuestionList,
            isPublish:isPublish,
            rule:this.rule
          };
          if(this.maxCount==''&&this.countOfDay!=''){
            obj.countOfDay = parseInt(this.countOfDay);
          }
          else if(this.countOfDay==''&&this.maxCount!=''){
            obj.maxCount = parseInt(this.maxCount);
          }
          else {
            obj.countOfDay = parseInt(this.countOfDay);
            obj.maxCount = parseInt(this.maxCount);
          }
          var json = JSON.stringify(obj);
          if(flag){
            this.$confirm('发布之后将无法编辑, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.showLoading = 1;
              this.$http({
                url: config.addVote,
                data:{
                  subject:json
                },
                method:'post',
              }).then((res) => {
                this.showLoading = 0;
                if(res.status==200){
                  this.$alert(des, '提示', {
                    confirmButtonText: '确定',
                    callback: action => {
                      this.$router.push({
                        path: `/votingManagement`,
                      })
                    }
                  });
                }
              })
            }).catch(() => {
            })
          }
          else {
            this.showLoading = 1;
            this.$http({
              url: config.addVote,
              data:{
                subject:json
              },
              method:'post',
            }).then((res) => {
              this.showLoading = 0;
              if(res.status==200){
                this.$alert(des, '提示', {
                  confirmButtonText: '确定',
                  callback: action => {
                    this.$router.push({
                      path: `/votingManagement`,
                    })
                  }
                });
              }
            })
          }

        }
      },
      // 收起问题
      closeItem(index){
        this.coreActiviVoteQuestionList[index].isclose==0? this.coreActiviVoteQuestionList[index].isclose=1: this.coreActiviVoteQuestionList[index].isclose=0
      },
      // 小写阿拉伯数字转大写
      ToString(Num){
        for (i = Num.length - 1; i >= 0; i--) {
          Num = Num.replace(",", "")//替换Num中的“,”
          Num = Num.replace(" ", "")//替换Num中的空格
        }
        if (isNaN(Num)) { //验证输入的字符是否为数字
          //alert("请检查小写金额是否正确");
          return;
        }
        //字符处理完毕后开始转换，采用前后两部分分别转换
        var part = String(Num).split(".");
        var newchar = "";
        //小数点前进行转化
        for (var i = part[0].length - 1; i >= 0; i--) {
          if (part[0].length > 10) {
            //alert("位数过大，无法计算");
            return "";
          }//若数量超过拾亿单位，提示
          var tmpnewchar = ""
          var perchar = part[0].charAt(i);
          switch (perchar) {
            case "0":  tmpnewchar = "零" + tmpnewchar;break;
            case "1": tmpnewchar = "一" + tmpnewchar; break;
            case "2": tmpnewchar = "二" + tmpnewchar; break;
            case "3": tmpnewchar = "三" + tmpnewchar; break;
            case "4": tmpnewchar = "四" + tmpnewchar; break;
            case "5": tmpnewchar = "五" + tmpnewchar; break;
            case "6": tmpnewchar = "六" + tmpnewchar; break;
            case "7": tmpnewchar = "七" + tmpnewchar; break;
            case "8": tmpnewchar = "八" + tmpnewchar; break;
            case "9": tmpnewchar = "九" + tmpnewchar; break;
          }
          switch (part[0].length - i - 1) {
            case 0: tmpnewchar = tmpnewchar; break;
            case 1: if (perchar != 0) tmpnewchar = tmpnewchar + "十"; break;
            case 2: if (perchar != 0) tmpnewchar = tmpnewchar + "百"; break;
            case 3: if (perchar != 0) tmpnewchar = tmpnewchar + "千"; break;
            case 4: tmpnewchar = tmpnewchar + "万"; break;
            case 5: if (perchar != 0) tmpnewchar = tmpnewchar + "十"; break;
            case 6: if (perchar != 0) tmpnewchar = tmpnewchar + "百"; break;
            case 7: if (perchar != 0) tmpnewchar = tmpnewchar + "千"; break;
            case 8: tmpnewchar = tmpnewchar + "亿"; break;
            case 9: tmpnewchar = tmpnewchar + "十"; break;
          }
          newchar = tmpnewchar + newchar;
        }
        //替换所有无用汉字，直到没有此类无用的数字为止
        while (newchar.search("零零") != -1 || newchar.search("零亿") != -1 || newchar.search("亿万") != -1 || newchar.search("零万") != -1) {
          newchar = newchar.replace("零亿", "亿");
          newchar = newchar.replace("亿万", "亿");
          newchar = newchar.replace("零万", "万");
          newchar = newchar.replace("零零", "零");
        }
        //替换以“一十”开头的，为“十”
        if (newchar.indexOf("一十") == 0) {
          newchar = newchar.substr(1);
        }
        //替换以“零”结尾的，为“”
        if (newchar.lastIndexOf("零") == newchar.length - 1) {
          newchar = newchar.substr(0, newchar.length - 1);
        }
        return newchar;
      },
      // 添加选项
      addList(index,index2){
        var id = this.ToString(index2+2);
        // for(var i=0;i<this.maxItem.length){}
        var obj = {
          label:'选项'+id,
          txt:'',
          attachedPath:'',
          remarks:[]
        }
        var remarks = [];
        for(var i=0;i<this.maxItem-1;i++){
          var aObj = {
            txt:''
          }
          remarks.push(aObj)
        }
        obj.remarks = remarks;
        this.coreActiviVoteQuestionList[index].coreActiviVoteQuestionItemList.push(obj)
        this.judgeInput()
      },
      // 删除选项
      deleteList(index,index2){
        this.$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.coreActiviVoteQuestionList[index].coreActiviVoteQuestionItemList.splice(index2,1);
          var arr = this.coreActiviVoteQuestionList;
          for(var i=0;i<arr[index].coreActiviVoteQuestionItemList.length;i++){
            arr[index].coreActiviVoteQuestionItemList[i].label = '选项'+this.ToString(i+1)
          }
          this.coreActiviVoteQuestionList = arr;
        this.judgeInput()
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
      });
      },
      // 增加问题
      addQuestion(){
           if(this.maxItem==1){
            var obj ={
              question:'',
              type:this.isCheckBox.toString(),
              isclose:0,
              coreActiviVoteQuestionItemList:[
                {
                  label:'选项一',
                  txt:'',
                  attachedPath:'',
                },
                {
                  label:'选项二',
                  txt:'',
                  attachedPath:'',
                },
                {
                  label:'选项三',
                  txt:'',
                  attachedPath:'',
                }
              ]
            }
            this.coreActiviVoteQuestionList.push(obj)
          }
           else {
             var obj ={
               question:'',
               type:this.isCheckBox.toString(),
               isclose:0,
               coreActiviVoteQuestionItemList:[
                 {
                   label:'选项一',
                   txt:'',
                   attachedPath:'',
                   remarks:[]
                 },
                 {
                   label:'选项二',
                   txt:'',
                   attachedPath:'',
                   remarks:[]
                 },
                 {
                   label:'选项三',
                   txt:'',
                   attachedPath:'',
                   remarks:[]
                 }
               ]
             }
              for(var j=0;j<3;j++){
                var remarks = [];
                for(var i=0;i<this.maxItem-1;i++){
                  var aObj = {
                    txt:''
                  }
                  remarks.push(aObj)
                }
                obj.coreActiviVoteQuestionItemList[j].remarks = remarks;
              }
             this.coreActiviVoteQuestionList.push(obj)
           }

          this.judgeInput()
        // }

      },
      // 添加问题列表的图片
      addPicture(res,file,index,index2){
        // var lastIndex = res.data.lastIndexOf('.')
        // var url = res.data.slice(0,lastIndex)+'_t'+res.data.slice(lastIndex);
        this.coreActiviVoteQuestionList[index].coreActiviVoteQuestionItemList[index2].attachedPath = res.data;
        $('.question-list-item').find('.list-item').eq(index2).find('.err').hide()
      },
      // 删除问题列表的图片
      deleteImgUrl(index,index2){
        this.$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.coreActiviVoteQuestionList[index].coreActiviVoteQuestionItemList[index2].attachedPath = '';
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
      }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
      });

      },
      getDetails(){
        this.$http({
          url: config.voteDetails,
          data:{
            subJectId:this.contentId
          },
          method:'post',
        }).then((res) => {
          res = JSON.parse(JSON.stringify(res.data.data));
          this.templateStyle = res.modal;
          if(res.colThreshold>0){
            this.isOpenColThreshold = true;
            this.colThreshold = res.colThreshold;
            this.colThresholdCeil = res.colThresholdCeil;
            this.isColThresholdGlobal = res.isColThresholdGlobal?true:false;
          }
          this.maxItem = this.templateOptions[this.templateStyle-1].max_item;
          this.isMustUploadImg = this.templateOptions[this.templateStyle-1].must_img;
          this.isCheckBox = this.templateOptions[this.templateStyle-1].type;
          this.title = res.title;
          this.poster = res.cover;
          this.synopsis = res.synopsis;
          this.rule = res.rule;
          this.date = res.startDate.split(' ')[0];
          var s = res.startDate.split(' ')[1];
          s = s.split(':');
          this.hourMinute = s[0]+':'+s[1];
          this.endDate = res.endDate.split(' ')[0];
          var e = res.endDate.split(' ')[1];
          e = e.split(':');
          this.hourMinute2 = e[0]+':'+e[1];
          for(var a=0;a< this.templateOptions.length;a++){
            if( this.templateOptions.id==this.templateStyle){
              this.isCheckBox = this.templateOptions[a].type;
              this.templateOptions[a].type = this.templateOptions[a].type+'';
              this.maxItem = this.templateOptions[a].max_item;
              this.isMustUploadImg = this.templateOptions[a].must_img;
            }
          }
          if(res.maxCount){
            this.maxCount = res.maxCount
          }
          if(res.countOfDay){
            this.countOfDay = res.countOfDay;
          }
          for(var i=0;i<res.coreActiviVoteQuestionList.length;i++){
            res.coreActiviVoteQuestionList[i].isclose = 0;
            res.coreActiviVoteQuestionList[i].type = this.isCheckBox==1?'1':'2';
          }
          for(var m=0;m<res.coreActiviVoteQuestionList.length;m++){
            for(var j=0;j<res.coreActiviVoteQuestionList[m].coreActiviVoteQuestionItemList.length;j++){
              res.coreActiviVoteQuestionList[m].coreActiviVoteQuestionItemList[j].label = '选项'+this.ToString(j+1);
              if(res.coreActiviVoteQuestionList[m].coreActiviVoteQuestionItemList[j].remarks){
               var arr = JSON.parse(res.coreActiviVoteQuestionList[m].coreActiviVoteQuestionItemList[j].remarks)
                res.coreActiviVoteQuestionList[m].coreActiviVoteQuestionItemList[j].remarks = arr;
              }
            }
          }
          this.power = res.authen.split(',');
          this.judgeInput()
          this.coreActiviVoteQuestionList = res.coreActiviVoteQuestionList;

        }).catch(function (err) {
          // console.log(err)
        })
      },
      addZero(num){
        if(parseInt(num) < 10){
          num = '0'+num;
        }
        return num;
      }
    },
    created(){
      this.getNowTime()
      var id =  this.$route.params.id;
      this.contentId = id;
      var that = this;
      var timer = setInterval(function () {
        if(that.$store.state.userInfo.appbackId){
          clearInterval(timer)
          that.getUserPower()
          that.uploadUrl = that.$store.state.mediaAssetsUrl+config.watermarkImg;
          if(id==-1){
            that.contentId = '';
            that.judgeInput()
          }
          that.getTemplateVote()
        }
      },1000)

    }
  }
</script>

<style scoped>
  .el-checkbox{
    margin-top: 5px;
    margin-bottom: 5px;
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
  .vote {
    /*padding: 30px*/
    background-color: #ffffff;
    overflow: hidden;
  }

  h2 {
    color: #343434;
  }

  .route {
    margin: 30px 30px 0;
  }

  .route a {
    color: #ff353a;
    text-decoration: none;
  }

  .main-body {
    width: 100%;
    box-sizing: border-box;
    padding: 30px 40px 50px;
    background-color: #fff;
    overflow: hidden;
  }
  .main-body .item{
    overflow: hidden;
    position: relative;
    padding-left: 100px;
    margin-top: 30px;
  }
  .main-body .label{
    width: 100px;
    position: absolute;
    left: 0;
    top: 50%;
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
  }
  .main-body .quanxian{
    color: #8d8d8d;
  }
  .main-body .descript{
    /*font-size: 12px;*/
    color: #8d8d8d;
    margin: 45px 0 10px;
  }
  .main-body .poster{
    /*width:80px;*/
    /*height: 80px;*/
    /*background: url("../../static/images/add.png");*/
    /*background-size: 100% 100%;*/
    position: relative;
  }
  .main-body .poster .img{
    width: 100%;
    height: 100%;
    background-color: #fff;
    border: 1px solid #999;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
  }
  .main-body .poster>img{
    width: 80px;
    height: 80px;
    display: inline-block;
    vertical-align: top;
    margin-right: 10px;
  }
  .main-body .list-item{
    position: relative;
    padding-left: 0;
  }
  .item-box{
    overflow: hidden;
    position: relative;
    padding-left: 100px;
  }
  .main-body .poster .avatar-uploader{
    display: inline-block;
    vertical-align: top;
    /*width: 78px;*/
    /*height: 78px;*/
    /*position: absolute;*/
    /*left: 0;*/
    /*top: 0;*/

    /*opacity: 0;*/
  }
  .main-body .poster .avatar-uploader img{
    display: none;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .add-question{
    width: 100%;
    height: 80px;
    box-sizing: border-box;
    line-height: 80px;
    text-align: center;
    margin: 0px 0 90px;
    border: 1px dashed #c3c3c3;
    cursor: pointer;
  }
  .add-question i{
    font-size: 20px;
    margin-right: 10px;
    color: #d4d4d4;
  }
  .btns{
    text-align: center;
  }
  .btns .el-button-group{
    margin-right: 20px;
    position: relative;
  }
  .btns .xiala:hover .save{
    display: block;
  }
  .btns .save{
    position: absolute;
    right: 0;
    top: 38px;
    background-color: #ff353a;
    color: #fff;
    text-align: center;
    height: 40px;
    line-height: 40px;
    width: 170px;
    border: none;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
    cursor: pointer;
    display: none;
  }
  .template{
    width: 100%;
    box-sizing: border-box;
    padding: 20px;
    border: 1px solid #e7e7eb;
    margin-bottom: 30px;
    overflow: hidden;
  }
  .template .right{
    width: 400px;
    float: left;
  }
  .template .input{
    width: 20px;
    height: 20px;
    background: url("../../static/images/picture.png");
    background-size: 100% 100%;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    overflow: hidden;
    float: left;
    margin-top: 10px;
    margin-left: 20px;
  }
  .template h2{
    font-size: 18px;
    line-height: 60px;
    font-weight: normal;
  }
  .template h2 .miu-title{
    margin-left: 20px;
    color: #999;
    font-size: 16px;
  }
  .template h2 .close{
    float: right;
    font-size: 12px;
    color: #56427f;
    cursor: pointer;
  }
  .template h2 .shanchu{
    float: right;
    font-size: 12px;
    color: #56427f;
    cursor: pointer;
    margin-left: 20px;
  }
  .template .input input{
    width: 20px;
    height: 20px;
    opacity: 0;
  }
  .template .input .el-upload{
    display: block;
    width: 100%;
    height: 100%;
  }
  .template .add, .template .delete{
    width: 20px;
    height: 20px;
    box-sizing: border-box;
    text-align: center;
    line-height: 18px;
    font-size: 12px;
    font-weight: bold;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    overflow: hidden;
    float: left;
    margin-top: 10px;
    margin-left: 20px;
    border: 1px solid #8c8c8d;
    cursor: pointer;
  }
  .add-remarks{
    cursor: pointer;
    width: 25px;
    height: 25px;
    float: left;
    margin: 7px 0 0 20px;
  }
  .add-remarks img{
    display: block;
    width: 100%;
    height: 100%;
  }
  .template .img{
    width: 115px;
    height: 115px;
    position: relative;
    overflow: hidden;
    float: left;
    margin-right: 20px;
  }
  .template .img img{
    display: block;
    width: 100%;
    height: 100%;
  }
  .template .img:hover .delete-icon{
    opacity: 1;
  }
  .template .img:hover:after{
    display: block;
  }
  .template .img .delete-icon{
    position: absolute;
    width: 50px;
    height: 50px;
    line-height: 60px;
    box-sizing: border-box;
    padding-left: 10px;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    right: -20px;
    top: -20px;
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    opacity: 0;
    z-index: 2;
    cursor: pointer;
    background-color: rgba(0,0,0,.6);
  }
  .template .img i{
    color: #fff;
    font-size: 16px;
  }
</style>
