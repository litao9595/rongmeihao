<template>
  <div class="editor-editor">
    <div class="editor">
      <div class="elem_form">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="策略名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="用户类型" >
            <el-select v-model="form.region" style="width: 100%;" placeholder="请选择用户类型">
              <el-option v-for="(item,index) in userType" :key="index" :label="item.remarks" :value="item.userTypeCode"></el-option>
              <!--<el-option v-for="(item,index) in userType" :key="index" :label="item.remark" :value="item.value"></el-option>-->

            </el-select>
          </el-form-item>
          <el-form-item label="起止时间" >
            <el-col :span="11">
              <el-time-select style="width: 100%;"
                              placeholder="起始时间"
                              v-model="form.date1" :picker-options="{start: '00:00',step: '01:00',end: '23:00'}">
              </el-time-select>
            </el-col>
            <el-col class="line" :span="2" style="text-align: center">-</el-col>
            <el-col :span="11">
              <el-time-select
                placeholder="结束时间" style="width: 100%;"
                v-model="form.date2"
                :picker-options="{start: '00:00',step: '01:00',end: '23:00',minTime: form.date1}">
              </el-time-select>
            </el-col>
          </el-form-item>
          <el-form-item label="起止日期" >
            <el-col :span="11">
              <div class="block">
                <el-date-picker style="width: 100%;"
                                v-model="form.date3"
                                type="date"
                                placeholder="选择日期"
                                format="yyyy-MM-dd"
                                value-format="timestamp" :picker-options="pickerOptions0">
                </el-date-picker>
              </div>
            </el-col>
            <el-col class="line" :span="2" style="text-align: center">-</el-col>
            <el-col :span="11">
              <div class="block">
                <el-date-picker style="width: 100%;"
                                v-model="form.date4"
                                type="date"
                                placeholder="选择日期"
                                format="yyyy-MM-dd"
                                value-format="timestamp" :picker-options="pickerOptions1">
                </el-date-picker>
              </div>
            </el-col>
          </el-form-item>
          <!--<el-form-item label="用户状态" >-->
            <!--<el-select v-model="form.state" style="width: 100%;" placeholder="请选择用户状态">-->
              <!--<el-option v-for="(item,index) in userStatus" :key="index" :label="item.remark" :value="item.value"></el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
          <el-form-item label="性别" >
            <el-radio-group v-model="form.sex" size="medium">
              <el-radio border label="男"></el-radio>
              <el-radio border label="女"></el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <div class="editor_box">
        <ul class="nav_top">
          <li @click="clickNav(index)" v-for="(navData,index) in navData" :class="index==navNumber?'active':''">
            <i :class="navData.iconNam"></i>
            {{navData.text}}
          </li>
        </ul>
        <ul class="content_box">
          <li v-show="navNumber==0"><textarea v-model="form.content"></textarea></li>
          <!--<li v-show="navNumber==1">-->
          <!--<div class="avatar-uploader-box">-->
          <!--<i class="el-icon-plus avatar-uploader-icon"></i>-->
          <!--</div>-->
          <!--</li>-->
        </ul>
      </div>
    </div>
    <div class="editor-fot">
      <el-button type="primary" @click="submitClick()">确定</el-button>
      <el-button @click="cancelClick()">取消</el-button>
    </div>
  </div>
</template>

<script>
import {config} from "../router/httpConfig.js";
import {mapState} from 'vuex'
export default {
  name: "editor-alert.vue",
  // 接受父组件的值
  props: {
    inputName: Object, //接受类型与父组件传值的类型必须一致
    required: true
  },
  computed: {
    normalizedSize: function () {
      return this.inputName.trim().toLowerCase()
    }
  },
  data(){
      return{
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          date3:'',
          date4:'',
          state:'',
          sex:'',
          type:1,
          content:'',
          category:this.inputName.category,
          id:this.inputName.id
        },
        id:this.inputName.id,
        navData:[
          {text:'文字',iconNam:'fontFamily hhtxwenzi'},
          // {text:'图片',iconNam:'fontFamily hhtxplus-pic'},
          // {text:'语音',iconNam:'fontFamily hhtxyuyin'},
          // {text:'视频',iconNam:'fontFamily hhtxshipin'}
          ],
        navNumber:0,
        imageUrl: '',
        alert:false,
        userType:[
          {label:"匿名", remark:"匿名用户", value:"anonymous"},
          {label:"实名", remark:"实名用户", value:"real"}
        ],
        userStatus:[
          {label: "沉默", remark: "沉默用户", value: "silent"},
          {label: "活跃", remark: "活跃用户", value: "active"}
        ],
        pickerOptions0: {
          disabledDate: (time) => {
            return time.getTime() >time.getTime() > this.form.date4;
          }
        },
        pickerOptions1: {
          disabledDate: (time) => {
            return time.getTime() < this.form.date3;
          }
        },
      }
  },
  beforeCreate:function(){
    //用户类型
    this.$http({
      // url:config.userType,
      url:this.$store.state.appbackUrl+config.uerTypeUrl,
    }).then((res)=>{
      // console.log(res.data.data)
      this.userType=res.data.data
    }).catch(function(err){
      // console.log(err)
    });
    //用户状态
    // this.$http({
    //   url:config.userStatus,
    // }).then((res)=>{
    //   // console.log(res)
    // }).catch(function(err){
    //   // console.log(err)
    // });
    //编辑
    this.$nextTick(function () {
      if(this.id){
        this.$http({
          url:config.idQuery+'/'+this.id,
        }).then((res)=>{
          console.log(res);
          // split(" ")[0]
          this.form.name=res.data.data.name;
          this.form.region=res.data.data.userType;
          this.form.date1=res.data.data.timeStart+':00';
          this.form.date2=res.data.data.timeEnd+':00';
          this.form.date3=new Date(res.data.data.dateStart.split(" ")[0]);
          this.form.date4=new Date(res.data.data.dateEnd.split(" ")[0]);
          // this.form.state=res.data.data.userStatus;
          this.form.sex=res.data.data.gender;
          this.form.content=res.data.data.content;
        }).catch(function(err){
          console.log(err)
        });
      }
    })
  },
  methods:{
    dateFormat:function(time) {
      var date=new Date(time);
      var year=date.getFullYear();
      /* 在日期格式中，月份是从0开始的，因此要加0
       * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
       * */
      var month= date.getMonth()+1<10 ? "0"+(date.getMonth()+1) : date.getMonth()+1;
      var day=date.getDate()<10 ? "0"+date.getDate() : date.getDate();
      // 拼接
      return year+"-"+month+"-"+day;
    },
    clickNav:function(index){
      this.navNumber=index;
      if(index==0){
        this.form.type=1
      }else if(index==1){
        this.form.type=2
      }else if(index==2){
        this.form.type=3
      }else if(index==3){
        this.form.type=4
      }

    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    submitClick:function () {
      if(this.form.type==1){
          //文字
      }else if(this.form.type==2){
          //图片
      }else if(this.form.type==3){
          //语音
      }else if(this.form.type==4){
          //视频
      }
      if(!this.form.id){
        this.form.id='';
      }
      this.$http({
        method:'post',
        url:config.newDdd,
        data:{
          name:this.form.name,
          category:this.form.category,
          timeStart:parseInt(this.form.date1.split(":")[0]),
          timeEnd:parseInt(this.form.date2.split(":")[0]),
          dateStart:this.dateFormat(this.form.date3),
          dateEnd:this.dateFormat(this.form.date4),
          userType:this.form.region,
          // userStatus:this.form.state,
          gender:this.form.sex,
          type:this.form.type,
          Content:this.form.content,
          id:this.form.id
        }
      }).then((res)=>{
        console.log(res)

      }).catch(function(err){
        console.log(err)
      });
      this.$emit('e-world',this.alert);
    },
    cancelClick:function(){
      this.$emit('e-world',this.alert);
    }

  }
}

</script>

<style scoped>
  li{
    list-style: none;
  }
  .elem_form{margin-top: 20px;}
  .editor_box{
    border: 1px solid #e6e6e6;
  }
  .editor_box .nav_top{
    height: 38px;
    border-bottom: 1px solid #e6e6e6;
    display: flex;
    display: -webkit-flex;
    cursor: pointer;
    color: #353535;
    line-height: 38px;
    font-size: 14px;
  }
  .editor_box .nav_top li{
    padding: 0 20px;
  }
  .editor_box .nav_top li:hover{
    color: #ff353a;
  }
  .editor_box .nav_top li i{
    margin-right: 0.2rem;
  }
  .editor_box .nav_top .active{
    color: #ff353a;
    font-weight: bold;
  }
  .editor_box .content_box{
    padding: 10px 20px;
    height: 200px;
    box-sizing: border-box;
  }
  .editor_box .content_box li textarea{
    width: 100%;
    height: 180px;
    display: block;
    outline: none;
    border: none;
  }
  .title_box{
    font-size: 20px;
    line-height: 58px;
    height: 58px;
    padding-left: 20px;
    padding-right: 55px;
    position: relative;
  }
  .title_box input{
    display: block;
    width: 100%;
    height: 54px;
    outline: none;
    border: none;
  }
  .title_box .input_number{
    font-size: 14px;
    position: absolute;
    right: 20px;
    top: 0;
    line-height: 58px;
    color: #999;
  }
  .editor_box .content_box li:nth-child(2){
    box-sizing:border-box;
    text-align: center;
    height: 100px;
    width: 100px;
    line-height: 100px;
    font-size: 30px;
    color: #ccc;
  }
  .editor_box .content_box li:nth-child(3){
    box-sizing:border-box;
    text-align: center;
    border: dashed 1px #ccc;
    height: 100px;
    width: 100px;
    line-height: 100px;
    font-size: 30px;
    color: #ccc;
  }
  .editor_box .content_box li:nth-child(4){
    box-sizing:border-box;
    text-align: center;
    border: dashed 1px #ccc;
    height: 100px;
    width: 100px;
    line-height: 100px;
    font-size: 30px;
    color: #ccc;
  }
  .avatar-uploader-box{
    position: relative;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    text-align: center;
    border: dashed 1px #ccc;
    height: 100px;
    width: 100px;
    line-height: 100px;
    font-size: 30px;
    color: #ccc;
    cursor: pointer;
  }
  .editor-editor{
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;
  }
  .editor-fot{
    text-align: right;
    margin-top: 10px;
    padding-right: 14px;
  }
  .editor{
    height: 350px;
    overflow-y: auto;
  }
</style>
