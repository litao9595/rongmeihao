<template>
<div class="vote">
    <!--<div style="text-align: right;">-->
      <!--<el-button @click="iframeReplace('投票管理')">新增投票</el-button>-->
    <!--</div>-->
    <ul class="vote_list">
        <li>
          <div class="row-1"></div>
          <div class="row-2">投票名称</div>
          <div class="row-3">投票人数</div>
          <div class="row-4">截止时间</div>
        </li>
        <li v-for="(tableData,index) in tableData" @click="clickList(index)">
          <div class="row-1" @click="changeId"><el-radio v-model="radio" :label="tableData.id"><span style="display: none">b</span></el-radio></div>
          <div class="row-2">{{tableData.title}}</div>
          <div class="row-3">{{tableData.personCount}}</div>
          <div class="row-4">{{tableData.endDate.split(" ")[0]}}</div>
        </li>
    </ul>
</div>
</template>

<script>
  import {config} from "../../router/httpConfig";
    export default {
        name: "vote.vue",
      data(){
          return{
            radio:'',
            tableData: []
          }
      },
      created(){
        this.$http({
          url: config.findAllVote+'?type=1',
          method:'get',
        }).then((res)=>{
          this.tableData = res.data.data.rows;
          this.radio=res.data.data.rows[0].id;
          localStorage.voteId=res.data.data.rows[0].id;
          var myDate = new Date();
          var now = myDate.valueOf();
          for(var i=0;i<this.tableData.length;i++){
            var time = new Date(this.tableData[i].endDate).valueOf();
            if(this.tableData[i].isPublish){
              if(now>time){
                this.tableData[i].status = '已截止';
              }else{
                this.tableData[i].status = '进行中';
              }
            }
            else {
              this.tableData[i].status = '未发布';
            }

          }
        }).catch((err)=>{
          console.log(err)
        })
      },
      methods:{
        send(){
          this.$emit('closeMain',this.radio);
        },
        changeId(){
          // localStorage.voteId=this.radio
        },
        clickList(index){
          this.radio=this.tableData[index].id;
          localStorage.voteId=this.radio
        }
      }
    }
</script>

<style scoped>
li{
  list-style: none;
}
.vote_list{
  margin-top: 20px;
}
.vote_list li{
  display: flex;
  display: -webkit-flex;
}
.vote_list li{
  height: 40px;
  line-height: 40px;
  color: #909399;
}
.vote_list li:nth-child(1){
  background: #f5f7f9;
  font-weight: bold;
}
.vote_list li .row-1{
  width: 10%;
  text-align: center;
}
.vote_list li .row-2{
  width: 40%;
}
.vote_list li .row-3{
  width: 25%;
}
.vote_list li .row-4{
  width: 25%;
  text-align: center;
}






</style>
