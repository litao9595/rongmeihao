<template>
<div class="content-list">
  <div class="tebl_top">
      <div class="row_1">内容</div>
      <div class="row_2">类型</div>
      <div class="row_3">操作</div>
  </div>
  <ul class="list_list">
      <li v-for="(listData,index) in listData">
        <div class="row_1">
          <div class="thumbnail">
              <!--<img src="../images/01.png">-->
              <div>{{listData.name}}</div>
          </div>
          <div class="neirong">{{listData.content}}</div>
        </div>
        <div class="row_2">{{listData.type==1?'文字':listData.type==2?'图片':listData.type==3?'语音':listData.type==1?'视频':''}}</div>
        <div class="row_3">
            <span @click="openAlert(index)">编辑</span>
            <span @click="deletData(index)">删除</span>
            <!--<i class="editor_icon" @click="openAlert(index)"></i>-->
            <!--<i class="delet_icon" @click="deletData(index)"></i>-->
        </div>
      </li>
  </ul>
  <div class="alert_box" v-if="alert">
      <div class="alert_content">
        <div class="alert_head">编辑<i class="el-icon-close" @click="downAlert()"></i></div>
        <div style="width: 586px; height: 400px; overflow: hidden;">
          <editorAlert @e-world="getData" :inputName="childData" style="width: 590px; height: 400px;"></editorAlert>
        </div>
      </div>
  </div>

</div>
</template>

<script>
import editorAlert from '@/components/editor-alert'
import {config} from "../router/httpConfig.js";
export default {
  components:{editorAlert},
  name: "content-list.vue",
  // 接受父组件的值
  props:['listName'],
  // watch:{
  //   info(){
  //     this.data = this.listName
  //   }
  // },
  data(){
    return{
      alert:false,
      listData:this.listName,
      childData:{
        category:'',
      },
    }
  },
  watch:{
    listName:function(newVal,oldVal){
      this.listData = newVal;
      console.log();
    }
  },
  // created(){
  //   this.listData=this.listName
  // },
  methods:{
    getData:function(alert){
      this.alert=alert;
      if(!alert){
        this.$emit('e-hide',false);
      }
    },
    downAlert(){
      this.alert=false
    },
    openAlert(index){
      this.alert=true;
      this.childData.id=this.listData[index].id;
      this.childData.category=this.listData[0].category
    },
    deletData(index) {
      // alert(this.listData[index].id);
      this.$confirm('此操作将删除该信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$http({
          method:'post',
          url:config.deleteData+'/'+this.listData[index].id,
        }).then((res)=>{
          // console.log(res)
          this.listData.splice(index,1)
        }).catch(function(err){
          console.log(err)
        });
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
  }

}
</script>

<style scoped>
.tebl_top{
  display: flex;
  display: -webkit-flex;
  display: -moz-flex;
  background: #f6f8f9;
}
.tebl_top .row_1{
    width: 68%;
  box-sizing: border-box;
  padding: 20px 10px 20px 20px;
  }
.tebl_top .row_2{
  width: 20%;
  box-sizing: border-box;
  padding: 20px 10px 20px 0px;
}
.tebl_top .row_3{
  width: 12%;
  box-sizing: border-box;
  text-align: right;
  padding: 20px 20px 20px 0px;
}
.list_list{
  margin-top: 20px;
}
.list_list li{
  list-style: none;
  width: 100%;
  display: flex;
  display: -webkit-flex;
  display: -moz-flex;
}
.list_list li .row_1{
  width: 68%;
  box-sizing: border-box;
  padding: 20px 10px 20px 20px;
  overflow: hidden;
}
.list_list li .row_2{
  width: 20%;
  box-sizing: border-box;
  padding: 20px 10px 20px 0px;
  color: #9A9A9A;
  font-size: 14px;
}
.list_list li .row_3{
  width: 12%;
  box-sizing: border-box;
  text-align: right;
  padding: 20px 20px 20px 0px;
}
.list_list li .row_3 span{
  font-size: 14px;
  color: #9A9A9A;
  cursor: pointer;
  padding-left: 10px;
}
.list_list li .row_3 span:hover{
  color: #ff353a;
}
.thumbnail{
  width: 152px;
  height: 50px;
  float: left;
}
.thumbnail img{
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.neirong{
  float: right;
  width: calc(100% - 172px);
  color: #353535;
  font-size: 16px;
  line-height: 25px;
  height: 50px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.list_list li .row_3 i{
  display:inline-block;
  height: 20px;
  width: 20px;
  cursor: pointer;
}
.list_list li .row_3 .editor_icon{
  background: url("../images/icon/editor_icon.png") no-repeat center center;
  background-size: auto 100%;
}
.list_list li .row_3 .delet_icon{
  background: url("../images/icon/delet_icon.png") no-repeat center center;
  background-size: auto 100%;
  margin-left: 10px;
}
.alert_box{
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0px;
  top: 0px;
  background: rgba(0,0,0,.5);
  z-index: 9999;
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
