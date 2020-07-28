<template>
    <div class="choice-platform" v-show="showPlatformChoice">
      <div class="box">
        <div class="title">
          <div>选择平台</div>
          <i @click="closePlatform(0)" class="el-icon-close"></i>
        </div>
        <ul>
          <li v-for="(label,labelIndex) in list">
            <div class="label">{{label.name}}</div>
            <div class="items">
              <el-checkbox-group v-model="label.checkList">
                <el-checkbox v-for="item in label.itemList" :label="item" :key="item"></el-checkbox>
              </el-checkbox-group>
            </div>
          </li>
        </ul>
        <div class="sure" @click="closePlatform(1)">确定</div>
      </div>
    </div>
</template>
<script>
  import {config} from "../router/httpConfig";
    export default {
        name: "",
      props:['showPlatformChoice','dataList'],
      data(){
          return{
            list:[],
          }
      },
      methods:{
        closePlatform(flag){
          if(flag==1){
            var _obj = [];
            for(var k=0;k<this.list.length;k++){
              if(this.list[k].checkList.length>0){
                this.list[k].checkedId = [];
                for(var m=0;m<this.list[k].checkList.length;m++){
                  for(var n=0;n<this.list[k].plugs.length;n++){
                    if(this.list[k].checkList[m]==this.list[k].plugs[n].name){
                      this.list[k].checkedId.push(this.list[k].plugs[n].id)
                    }
                  }
                }
              }
            }
            for(var i=0;i<this.dataList.length;i++){
              for(var j=0;j<this.list.length;j++){
                if(this.list[j].checkedId){
                  for(var s=0;s<this.list[j].checkedId.length;s++){
                    var obj = {
                      contentId:this.dataList[i],
                      type:this.list[j].code,
                      externalId:this.list[j].checkedId[s]
                    }
                    _obj.push(obj)
                  }
                }

              }
            }
            this.$emit('hidePlatformChoice');
          }
          else {
            var obj = {
              a:1,
            }
            this.$emit('hidePlatformChoice');
          }

        },
        getType(){
          this.$http({
            url:config.platformGetTypeOfPlug
          }).then((res)=>{
            var data = res.data.data;
            this.list = data;
           for(var i=0;i<data.length;i++){
             var items = [];
             for(var j=0;j<data[i].plugs.length;j++){
               items.push(data[i].plugs[j].name)
             }
             this.$set(this.list[i],'itemList',items)
             this.$set(this.list[i],'checkList',[])
           }
          })
        }
      },
      created(){
          this.getType()
      }
    }
</script>

<style scoped>
  li{
    list-style: none;
  }
.choice-platform{
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,.5);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999999;
}
  .box{
    width: 500px;
    height: 440px;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: #ffffff;
    min-height: 300px;
    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;
    border-radius: 10px;
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%,-50%);
    -moz-transform: translate(-50%,-50%);
    -ms-transform: translate(-50%,-50%);
    -o-transform: translate(-50%,-50%);
    transform: translate(-50%,-50%);
    padding-bottom: 70px;
  }
  .title{
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #e6e6e6;
    box-sizing: border-box;
    padding: 0 20px;
    font-size: 16px;
    color: #222222;
    position: relative;
  }
  .title i{
    display: block;
    position: absolute;
    right: 20px;
    top: 10px;
    cursor: pointer;
    font-size: 20px;
  }
  ul{
    margin-top: 25px;
  }
  li{
    box-sizing: border-box;
    padding: 0 40px;
    margin-bottom: 25px;
  }
  li .label{
    margin-bottom: 10px;
  }
  li .items{
  }
  .sure{
    height: 50px;
    line-height: 50px;
    width: 140px;
    font-size: 16px;
    cursor: pointer;
    display: block;
    color: #fff;
    background-color: #f85959;
    border-radius: 4px;
    border: 1px solid #f85959;
    text-align: center;
    position: absolute;
    left: 50%;
    margin-left: -70px;
    bottom: 20px;
  }
</style>
