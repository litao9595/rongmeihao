<template>
    <div class="blackList">
      <div class="cheack-all">
        <div class="check" :class="isCheckAll==1?'checked':''" @click="checkAll"></div>
        <div class="remove" @click="removeAll">从黑名单中移除</div>
      </div>
      <ul>
        <li v-for="(item,index) in dataList">
          <div class="check" :class="item.isChecked==1?'checked':''" @click="singleCheck(index)"></div>
          <div class="pic"><img :src="item.headpic" alt=""></div>
          <div class="name">{{item.name}}</div>
          <div class="remarks">于{{item.time}}被加入黑名单</div>
          <div class="handle" @click="removeBlack(index)">从黑名单移除</div>
        </li>
      </ul>
      <div class="label">已显示全部</div>
    </div>
</template>

<script>
    export default {
        name: "",
      data(){
          return{
            isCheckAll:0,
            dataList:[{
              headpic:'../../../static/images/01.png',
              name:'都市独行侠jojo',
              isChecked:0,
              time:'2019-04-22 12:30',
            },{
              headpic:'../../../static/images/picture.png',
              name:'柳絮纷飞自在客',
              isChecked:0,
              time:'2019-04-05 09:30',
            }]
          }
      },
      methods:{
          // 全选
        checkAll(){
          this.isCheckAll==0?this.isCheckAll=1:this.isCheckAll=0;
          if(this.isCheckAll){
            for(var i in this.dataList){
              this.dataList[i].isChecked = 1;
            }
          }
          else {
            for(var i in this.dataList){
              this.dataList[i].isChecked = 0;
            }
          }
        },
        // 单个选择
        singleCheck(index){
          this.dataList[index].isChecked==0?this.dataList[index].isChecked=1:this.dataList[index].isChecked=0;
          this.ergodic()
        },
        // 遍历列表
        ergodic(){
          this.isCheckAll = 1;
          for(var i in this.dataList){
            if(this.dataList[i].isChecked == 0){
              this.isCheckAll = 0;
            }
          }
        },
        // 移除选中的用户
        removeAll(){
          var len = 0;
          for(var i in this.dataList){
            if(this.dataList[i].isChecked == 1){
              len++;
            }
          }
          if(len==0){
            this.$alert('请选择要移除的用户！', '提示', {
              confirmButtonText: '确定'
            });
          }
          else {
            this.$confirm('确定将选中用户从黑名单中移除?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              // 确定移除
              for(var i in this.dataList){
                if(this.dataList[i].isChecked == 1){
                  // 移除选中
                }
              }
            }).catch(() => {

            });
          }

        },
        // 移除单个用户
        removeBlack(index){
          this.$confirm('确定将该用户从黑名单中移除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // 确定移除
          }).catch(() => {

          });
        }
      }

    }
</script>

<style scoped>
  .blackList{
    background-color: #FFFFFF;
    min-height:450px;
  }
ul{
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  padding: 0 40px;
}
  li{
    list-style: none;
    overflow: hidden;
    padding: 13px 0 15px;
    border-bottom: 1px solid #bfbfbf;
  }
  .check{
    width: 18px;
    height: 19px;
    background: url("../../../static/images/icon/kuangkuang.png");
    background-size: 100% 100%;
    float: left;
    margin-right: 30px;
    margin-top: 15px;
    cursor: pointer;
  }
  .checked{
    background: url("../../../static/images/icon/gougou.png");
    background-size: 100% 100%;
  }
  .pic{
    width: 45px;
    height: 45px;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    overflow: hidden;
    float: left;
    margin-right: 24px;
  }
  .pic img{
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
  }
  .name{
    width: 24%;
    line-height: 45px;
    float: left;
    font-size: 14px;
    color: #222222;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .remarks{
    width: 26%;
    font-size: 12px;
    color: #999999;
    line-height: 45px;
    float: left;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .handle{
    font-size: 14px;
    line-height: 45px;
    color: #888888;
    float: right;
    cursor: pointer;
  }
  .label{
    text-align: center;
    font-size: 14px;
    color: #999999;
    margin-top: 32px;
  }
  .cheack-all{
    overflow: hidden;
    padding: 0 40px 55px;
    position: relative;
  }
  .cheack-all .check{
    float: right;
    margin: 20px 0 10px;
  }
  .cheack-all .remove{
    position: absolute;
    right: 40px;
    width: 160px;
    height: 45px;
    line-height: 45px;
    text-align: center;
    top: 50px;
    background-color: #eee;
    cursor: pointer;
    z-index: 1;
    font-size: 14px;
    color: #222222;
  }
  .cheack-all .remove:before{
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
    right: 8px;
    top: -5px;
    z-index: -1;

  }
</style>
