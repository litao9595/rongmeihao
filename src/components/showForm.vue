<template>
    <div>
      <div class="have-menu" v-show="tableTitle.length>0">
        <div class="select-order">
          <div>请选择页面：</div>
          <el-select v-model="value" placeholder="请选择" @change="selectTable">
            <el-option
              v-for="item in options"
              :key="item.page_id"
              :label="item.name"
              :value="item.page_id">
            </el-option>
          </el-select>
        </div>
        <div class="selef-table" v-show="tableData.length>0">
          <div v-for='(column,columnIndex) in tableData' >
            <div class="selef-title">{{column.name}}</div>
            <ul><li v-for='(item,itemIndex) in column.data' :class="item.type=='upload'?'img-overflow':''">
              <template v-if="item.type=='upload'">
                <div v-for="img in spiltImg(item.value)">
                  <img :src="img" alt="" v-preview="img">
                </div>
              </template>
              <template v-else>{{item.value}}</template>
            </li></ul>
          </div>
        </div>
        <el-pagination
          v-show="tableData.length>0"
          style="text-align: center;"
          background
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :total="total">
        </el-pagination>
      </div>
      <div class="no-menu" v-show="tableTitle.length==0||tableData.length==0">
        <img src="../../static/images/no-data.png" alt="">
        <!--<div v-show="tableTitle.length==0">暂无线索，请先创建-->
          <!--<span @click="creatForm">创建表单</span>-->
        <!--</div>-->
        <div v-show="tableData.length==0">暂无提交线索
          <!--<span @click="creatForm">创建表单</span>-->
        </div>
      </div>
      <div class="loading" v-show="isLoading"><i class="el-icon-loading"></i></div>
    </div>
</template>

<script>
    import {config} from "../router/httpConfig";
    export default {
        name: "",
      data(){
          return{
            value:"",
            tableData:[],
            options:[],
            currentPage:1,
            total:10,
            tableTitle:[],
            isLoading:0,
          }
      },
        methods:{
          spiltImg(string){
            return string.split(',')
          },
          creatForm(){},
          handleCurrentChange(val){
            this.currentPage = val;
            this.getSelectTableData();
          },
          // 切换页面
          selectTable(){
            this.isLoading = 1;
            this.currentPage = 1;
            this.getSelectTableData()
          },
          getSelectTableData(){
            this.$http({
              url:config.microFormGet,
              params: {
                // create_id:'b69c8651d4654ec89a683e5e44a5146f',
                create_id:this.$store.state.userInfo.userId,
                pageId:this.value,
                first:(this.currentPage-1)*10,
                last:10
              }
            }).then((res)=>{
              this.isLoading = 0;
              if(res.data.length>0){
                this.total = res.data[0].total;
                var data = res.data;
                for(var i=0;i<data.length;i++){
                  data[i].data = JSON.parse(data[i].data);
                }
                this.setLabel(data)
              }
            })
          },
          setLabel(arr){
            var tableData = [];
            for(var i=0;i<this.tableTitle.length;i++){
              if(this.value==this.tableTitle[i].page_id){
                for(var m=0;m<this.tableTitle[i].properties.length;m++){
                  var obj = {
                    id:this.tableTitle[i].properties[m].id,
                    name:this.tableTitle[i].properties[m].label,
                    data:[]
                  }
                  tableData.push(obj)
                }
              }
            }
            for(var j=0;j<arr.length;j++){
              for(var n=0;n<arr[j].data.length;n++){
                for(var k=0;k<tableData.length;k++){
                  if(arr[j].data[n].id==tableData[k].id){
                    tableData[k].data.push(arr[j].data[n])
                  }
                }
              }
            }
           this.tableData = tableData
          },
          getMenu(){
            this.$http({
              url:config.microFormGetMenu,
              params:{
                // create_id:'b69c8651d4654ec89a683e5e44a5146f'
                create_id:this.$store.state.userInfo.userId
              }
            }).then((res)=>{
              this.options = res.data;
              if( res.data.length>0){
                var tableData = JSON.stringify(res.data);
                tableData = JSON.parse(tableData);
                for(var i=0;i<tableData.length;i++){
                  tableData[i].properties = JSON.parse(tableData[i].properties)
                }
                this.tableTitle = tableData;
                this.value = res.data[0].page_id;
                this.selectTable()
              }

            })
          }
        },
      created(){
          var that = this;
          var timer = setInterval(function () {
            if(that.$store.state.userInfo.appbackId){
              clearInterval(timer)
              that.getMenu()
            }
          },1000)

      }
    }
</script>

<style scoped>
  .loading{
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    position: fixed;
    /*padding:95px 20px 15px;*/
    background-color: rgba(0,0,0,.4);
    color: #ff353a;
    left: 0;
    top: 0;
    z-index:9999999;
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
  }
  .el-pagination{
    margin-top: 25px;
  }
  .no-menu{
    overflow: hidden;
    text-align: center;
    font-size: 16px;
    line-height: 30px;
    color: #999999;
  }
  .no-menu img{
    display: block;
    margin: 100px auto 0;
  }
  .no-menu span{
    cursor: pointer;
    display: inline-block;
    width: 80px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-size: 14px;
    color: #ffffff;
    background-color: #ff353a;
    -webkit-border-radius: 6px;
    -moz-border-radius: 6px;
    border-radius: 6px;
    margin-left: 10px;
  }
  .select-order{
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-align-items: center;
    align-items: center;
  }
.selef-table{
  width: 100%;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-justify-content: space-between;
  justify-content: space-between;
  line-height: 48px;
  margin-top: 30px;
  background-color: #ffffff;
  min-height: 320px;
  overflow-x: auto;
}
.selef-table>div{

}
.selef-title{
  box-sizing: border-box;
  background-color: #f5f7f9;
  border-bottom: 1px solid #EBEEF5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #909399;
  font-size: 14px;
  padding: 0 10px;
  font-weight: 600;
}
 .selef-table li{
    box-sizing: border-box;
    padding: 0 10px;
    list-style: none;
   height: 50px;
   display: flex;
   align-items: center;
    border-bottom: 1px solid #EBEEF5;
    font-size: 14px;
    color: #606266;
   overflow: hidden;
   text-overflow: ellipsis;
   white-space: nowrap;
  }
  .selef-table li div{
    font-size: 0;
    display: inline-block;
    height:40px;
    margin: 0 2px;
  }
  .selef-table li img{
    font-size: 0;
    display:block;
    height:100%;
  }
  .selef-table  .img-overflow{
    /*white-space: nowrap;*/
    /*overflow-y: hidden;*/
    /*overflow-x: auto;*/
    font-size: 0;
  }
</style>
