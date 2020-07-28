<template>
    <div class="vote" id="voteDetails">
      <!--<h2>投票管理</h2>-->
      <div class="route">
        <router-link to="/votingManagement" >投票管理  &#62</router-link> 投票详情
      </div>
      <div class="info">
        <h3>投票详情</h3>
        <div class="item">
          <div class="label">投票名称</div>
          <div class="words">
            <div>{{data.title}}</div>
            <p>只用于投票管理后台，不显示在下的投票内容中</p>
          </div>
        </div>
        <div class="item">
          <div class="label">发布时间</div>
          <div class="words">
            <div>{{data.startDate}}至</div>
            <div>{{data.endDate}} <span>{{data.status}}</span></div>
          </div>
        </div>
        <div class="item">
          <div class="label">投票人数</div>
          <div class="words">
            <div v-if="data.behavior">{{data.behavior.cpn}}人</div>
          </div>
        </div>
      </div>
      <div class="details">
        <h3>投票详情</h3>
        <template v-for="(item,index) in data.coreActiviVoteQuestionList">
          <div class="title">{{index+1}}、{{item.question}}{{item.remarks?'（'+item.remarks+'）':''}}</div>
          <ul>
            <li v-for="(item2,index2) in item.coreActiviVoteQuestionItemList">
              <div class="pic" v-if="item2.attachedPath"><img :src="item2.attachedPath" alt=""></div>
              <div class="name">{{item2.txt}}</div>
              <div class="progress">
                <el-progress :percentage="item2.percent"></el-progress>
              </div>
              <div class="num">{{item2.voteCount}}票</div>
              <div class="percent">{{item2.percent}}%</div>
            </li>
          </ul>
        </template>
      </div>
    </div>
</template>

<script>
  import {config} from "../router/httpConfig";
    export default {
        name: "",
      data(){
          return{
            data:{}
          }
      },
      created(){
          var id =  this.$route.params.id;
        this.$http({
          url: config.voteDetails,
          data:{
            subJectId:id
          },
          method:'post',
        }).then((res) => {
          var data = res.data.data;
          var myDate = new Date();
          var now = myDate.valueOf();
          var time = new Date(data.endDate).valueOf();
          if(data.isStop){
            data.status = '已停止';
          }
          else if(now>time){
           data.status = '已截止';
          }else{
            data.status = '进行中';
          }
          var listArr = [];
          if(data.coreActiviVoteQuestionList.length>0){
            for(var name in data.behavior){
              if(name.indexOf(':')>-1){
                var arr = name.split(':')
                var obj = {
                  questionId:arr[0],
                  itemId:arr[1],
                }
                if(arr[2]=='ipn'){
                  obj.personNum =data.behavior[name]
                }
                else{
                  obj.voteCount =data.behavior[name];
                }
                listArr.push(obj)
              }
            }
            var behaviorData = [];
            for(var m=0;m<listArr.length-1;m++){
              for(var n=m+1;n<listArr.length;n++){
                if(listArr[m].questionId==listArr[n].questionId&&listArr[m].itemId==listArr[n].itemId){
                  var obj = {
                    questionId:listArr[m].questionId,
                    itemId:listArr[m].itemId
                  }
                  if(listArr[m].voteCount){
                    obj.voteCount = $.trim(parseInt(listArr[m].voteCount));
                    obj.personNum = $.trim(parseInt(listArr[n].personNum));
                  }
                  else {
                    obj.voteCount = $.trim(parseInt(listArr[n].voteCount));
                    obj.personNum = $.trim(parseInt(listArr[m].personNum));
                  }
                  behaviorData.push(obj)
                }
              }
            }
            for(var i=0;i<data.coreActiviVoteQuestionList.length;i++){
              var totalNum = 0;
              for(var j=0;j<data.coreActiviVoteQuestionList[i].coreActiviVoteQuestionItemList.length;j++){
                totalNum+=data.coreActiviVoteQuestionList[i].coreActiviVoteQuestionItemList[j].voteCount;
                for(var m=0;m<behaviorData.length;m++){
                  if(data.coreActiviVoteQuestionList[i].coreActiviVoteQuestionItemList[j].questionId==behaviorData[m].questionId&&data.coreActiviVoteQuestionList[i].coreActiviVoteQuestionItemList[j].id==behaviorData[m].itemId){
                    data.coreActiviVoteQuestionList[i].coreActiviVoteQuestionItemList[j].personNum = behaviorData[m].personNum;
                    data.coreActiviVoteQuestionList[i].coreActiviVoteQuestionItemList[j].voteCount = behaviorData[m].voteCount;
                  }
                }
              }
              data.coreActiviVoteQuestionList[i].totalVoteNum = totalNum;
            }

            for(var i=0;i<data.coreActiviVoteQuestionList.length;i++){
                for(var j=0;j<data.coreActiviVoteQuestionList[i].coreActiviVoteQuestionItemList.length;j++){
                  if(data.coreActiviVoteQuestionList[i].totalVoteNum==0){
                    data.coreActiviVoteQuestionList[i].coreActiviVoteQuestionItemList[j].percent = 0;
                  }
                  else {
                    data.coreActiviVoteQuestionList[i].coreActiviVoteQuestionItemList[j].percent = ((data.coreActiviVoteQuestionList[i].coreActiviVoteQuestionItemList[j].voteCount/data.coreActiviVoteQuestionList[i].totalVoteNum)*100).toFixed(3);
                  }
                }

            }
          }
          this.data = data;
        }).catch(function (err) {
          // console.log(err)
        })
      }
    }
</script>

<style scoped>
  .vote{
    /*padding: 30px*/
    min-height: 100%;
    overflow: hidden;
    background-color: #ffffff;
  }
  h2{
    color: #343434;
  }
  .route{
    /*margin: 15px 0 30px;*/

    margin: 30px 30px 0;
  }
  .route a{
    color: #ff353a;
    text-decoration: none;
  }
  h3{
    font-size: 18px;
    font-weight: normal;
    color: #343434;
  }
  .info{
    width: 100%;
    box-sizing: border-box;
    padding: 30px 40px 50px;
    overflow: hidden;
    background-color: #fff;
  }
  .info .item{
    overflow: hidden;
    margin-top: 30px;
  }
  .info .label{
    float: left;
    width: 75px;
    color: #343434;
  }
  .info .words{
    font-size: 14px;
    float: left;
    line-height: 24px;
  }
  .info .words div{
    color: #343434;
  }
  .info .words p,.info .words div span{
    color: #8e8d8d;
  }
  .details{
    padding: 30px ;
    background-color: #fff;
    margin-top: 30px;
  }
  .details .title{
    font-size: 14px;
    margin: 30px 0;
    color: #343434;
  }
  .dettails h3{

  }
  .details li{
    overflow: hidden;
    list-style: none;
    border-top: 1px solid #e7e7eb;
    padding: 20px 0;
  }
  .details li:last-child{
    border-bottom: 1px solid #e7e7eb;
  }
  .details li>div{
    float: left;
    line-height: 77px;
  }
  .details .pic{
    width: 77px;
    height: 75px;
  }
  .details .pic img{
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border: none;
  }
  .details .progress{
    width: 50%;
  }
  .details .progress>div{
    margin: 29px 20px 0;
  }
  .details .name{
    width:20%;
    margin-left: 20px;
  }
  .details .num{
    width: 10%;
    color: #8e8d8d;
  }
  .details .percent{
    width: 5%;
    color: #8e8d8d;
  }
</style>
