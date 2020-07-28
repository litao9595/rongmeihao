<template>
  <div class="menu-analisis">
    <div class="quota">
      <div class="quota-header">
        <div class="left">昨日关键指标</div>
        <div class="right">
          <el-tooltip class="item" effect="light" placement="bottom-end">
            <div slot="content">
              <p>菜单点击数</p>
              <p>菜单被用户点击的次数</p>
              <p>菜单点击人数</p>
              <p>点击菜单的去重用户数</p>
              <p>人均点击次数</p>
              <p>菜单点击次数 / 菜单点击的去重用户数</p>
              <p>版本</p>
              <p>每提交更新一次菜单算作一个版本</p>
              <div>数据从{{todayDate}}开始统计。由于服务器缓存，以及指标计算方法和统计时间的差异，数据可能出现微小误差，一般在1%以内。</div>
            </div>
            <i class="el-icon-question"></i>
          </el-tooltip>
        </div>
      </div>
      <ul class="quota-body">
        <li>
          <div class="info">
            <p>菜单点击次数</p>
            <h2>{{target.ycc}}</h2>
            <!--<div>日<i></i>&#45;&#45;</div>-->
            <!--<div>周<i class="down"></i>100%</div>-->
            <!--<div>月<i class="down"></i>100%</div>-->
          </div>
        </li>
        <li>
          <div class="info">
            <p>菜单点击人数</p>
            <h2>{{target.ypc}}</h2>
            <!--<div>日<i></i>&#45;&#45;</div>-->
            <!--<div>周<i class="down"></i>100%</div>-->
            <!--<div>月<i  class="down"></i>100%</div>-->
          </div>
        </li>
        <li>
          <div class="info">
            <p>人均点击次数</p>
            <h2>{{target.yavg}}</h2>
            <!--<div>日 <i></i>&#45;&#45;</div>-->
            <!--<div>周 <i  class="down"></i>100%</div>-->
            <!--<div>月 <i  class="down"></i>100%</div>-->
          </div>
        </li>
      </ul>
    </div>
    <ul class="change-bar" >
      <li :class="currentIndex==0?'selected':''" @click="changeData(0)">菜单点击次数</li>
      <li :class="currentIndex==1?'selected':''" @click="changeData(1)">菜单点击人数</li>
      <li :class="currentIndex==2?'selected':''" @click="changeData(2)">人均点击次数</li>
    </ul>
    <div class="data-show">
      <div class="data-show-header">
        <!--<el-select v-model="dataDay" placeholder="请选择" @change="changeDateday">-->
          <!--<el-option :value="0">最近7天</el-option>-->
          <!--<el-option :value="1">最近15天</el-option>-->
          <!--<el-option :value="2">最近30天</el-option>-->
        <!--</el-select>-->
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          align="right"
          unlink-panels
          @change="changeRangeDate"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions2">
        </el-date-picker>
        <!--<el-select v-model="editionMenu" >-->
          <!--<el-option :value="0">2019.25.36</el-option>-->
          <!--<el-option :value="1">2019.02.36版</el-option>-->
          <!--<el-option :value="2">2019.03.36版</el-option>-->
        <!--</el-select>-->
        <el-select v-model="editionMenu"  @change="getChartData">
          <el-option
            v-for="item in editionMenuList"
            :key="item.id"
            :label="item.version"
            :value="item.version">
          </el-option>
        </el-select>
        <!--<div class="base-time">按时间对比</div>-->
      </div>
      <div class="data-show-body">
        <div class="label">趋势图<el-tooltip class="item" effect="dark" content="用户总数和用户增长数分别根据不同方法和时间点来统计，可能出现不匹配。" placement="bottom-end">
          <i class="el-icon-question"></i>
        </el-tooltip></div>
        <div class="charts">
          <div id="myChart" ></div>
          <div class="no-data" v-show="chartData.length==0">暂无数据</div>
        </div>
      </div>
    </div>
    <div class="table-show">
      <div class="table-show-header">
        <el-date-picker
          v-model="tableTime"
          @change="changeTableDate"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions2"
          default-value="2010-10-01">
        </el-date-picker>
        <div class="label">
          <el-tooltip class="item" effect="light"  placement="bottom-end">
            <div slot="content">用户总数和用户增长数分别根据不同<br/>方法和时间点来统计，可能出现不匹配</div>
            <i class="el-icon-question"></i>
          </el-tooltip>
        </div>
      </div>
      <div class="table-show-body">
        <el-table
          :data="tableData"
          :span-method="objectSpanMethod"
          style="width: 100%; margin-top: 20px;">
          <el-table-column
            prop="vs"
            label="版本"
            width="240">
          </el-table-column>
          <el-table-column
            prop="name"
            align="center"
            label="菜单">
          </el-table-column>
          <el-table-column
            prop="clk_c"
            align="center"
            label="菜单点击次数">
          </el-table-column>
          <el-table-column
            prop="clk_p"
            align="center"
            label="菜单点击人数">
          </el-table-column>
        </el-table>
        <!--<div class="table-show-footer">-->
          <!--<el-pagination-->
            <!--style="text-align: center;margin-top: 25px;"-->
            <!--background-->
            <!--@current-change="handleCurrentChange"-->
            <!--layout="prev, pager, next"-->
            <!--:total="50">-->
          <!--</el-pagination>-->
        <!--</div>-->
      </div>
    </div>
  </div>
</template>

<script>
  import {config} from "../router/httpConfig"
  Date.prototype.format = function() {
    var s = '';
    var mouth = (this.getMonth() + 1)>=10?(this.getMonth() + 1):('0'+(this.getMonth() + 1));
    var day = this.getDate()>=10?this.getDate():('0'+this.getDate());
    s += this.getFullYear() + '-'; // 获取年份。
    s += mouth + "-"; // 获取月份。
    s += day; // 获取日。
    return (s); // 返回日期。
  };
  export default {
    name: "",
    data() {
      return {
        todayDate:this.getTodayDate(),
        target:{},//昨日指标
        currentIndex:0,
        tableTime:[ (new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 30)),(new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 1))],
        dateRange: [ (new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 30)),(new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 1))],
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 1);
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },{
            text: '最近15天',
            onClick(picker) {
              const end = new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 1);
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 15);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近30天',
            onClick(picker) {
              const end =new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 1);
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        editionMenu:'',
        tableData: [],
        dataSource:'',
        chartLenged:[],
        chartData:[],
        chartX:[],
        editionMenuList:[]
      };
    },
    mounted(){
      this.drawLine();
    },
    methods:{
      getTodayDate(){
        var date = new Date()
        var y = date.getFullYear()
        var m = date.getMonth()+1;
        var d = date.getDate()
        return y+'年'+m+'月'+d+'日'

      },
      //修改表格时间区间
      changeTableDate(){
        this.getTableData()
      },
      // 获取table表格数据
      getTableData(){
        this.$http({
          url:config.menuTableAnalysis+'?begin_date='+this.tableTime[0].getFullYear()+'-'+(this.tableTime[0].getMonth()+1)+'-'+this.tableTime[0].getDate()+'&end_date='+this.tableTime[1].getFullYear()+'-'+(this.tableTime[1].getMonth()+1)+'-'+this.tableTime[1].getDate(),
        }).then((res)=> {
          this.tableData = res.data.data;
          this.objectSpanMethod()
        }).catch((err)=>{
        })
      },
      //日期范围选择
      changeRangeDate(){
        this.getVs()
        var days = this.datedifference(this.dateRange[0].getFullYear()+'-'+(this.dateRange[0].getMonth()+1)+'-'+this.dateRange[0].getDate(),this.dateRange[1].getFullYear()+'-'+(this.dateRange[1].getMonth()+1)+'-'+this.dateRange[1].getDate())
        this.chartX = days;
      },
      // 获取版本
      getVs(){
        this.$http({
          url:config.menuGetys+'?begin_date='+this.dateRange[0].getFullYear()+'-'+(this.dateRange[0].getMonth()+1)+'-'+this.dateRange[0].getDate()+'&end_date='+this.dateRange[1].getFullYear()+'-'+(this.dateRange[1].getMonth()+1)+'-'+this.dateRange[1].getDate(),
        }).then((res)=> {
          var arr = [];
          var lastArr = [];
          for(var i=0;i<res.data.data.length;i++){
            if(arr.indexOf(res.data.data[i].version)==-1){
              arr.push(res.data.data[i].version)
            }
          }
          for(var j=0;j<arr.length;j++){
            var a = arr[j].toString().split('')
            a.splice(8,0,'.')
            var obj = {
              id:j,
              version:parseFloat(a.join(''))
            }
            lastArr.push(obj)
          }
          this.editionMenu = lastArr[0].version||''
          this.editionMenuList = lastArr
          this.getChartData()
        }).catch((err)=>{
        })
      },
      // 获取图表数据
      getChartData(){
        if(this.editionMenu){
          this.$http({
            url:config.menuCharts+'?begin_date='+this.dateRange[0].getFullYear()+'-'+(this.dateRange[0].getMonth()+1)+'-'+this.dateRange[0].getDate()+'&end_date='+this.dateRange[1].getFullYear()+'-'+(this.dateRange[1].getMonth()+1)+'-'+this.dateRange[1].getDate()+'&vs='+parseInt(this.editionMenu.toString().replace('.','')),
          }).then((res)=> {
            var xArr = [];
            for(var i=0;i<res.data.data.length;i++){
              if(xArr.indexOf(res.data.data[i].name)==-1){
                xArr.push(res.data.data[i].name)
              }
            }
            this.chartLenged=xArr

            var days = this.chartX;
            var arrObj=[];
            for(var m=0;m<xArr.length;m++){
              var obj1 = {
                name:xArr[m],
                list:[]
              };
              for(var j=0;j<res.data.data.length;j++){
                if(res.data.data[j].name==xArr[m]){
                  obj1.list.push(res.data.data[j])
                }
              }
              arrObj.push(obj1)
            }
            for(var n=0;n<arrObj.length;n++){
              var data1= [],data2=[],data3=[];
              for(var k=0;k<days.length;k++){
                data1[k] = 0;
                data2[k]=0;
                data3[k]=0;
              }
              arrObj[n].data1=data1;
              arrObj[n].data2=data2;
              arrObj[n].data3=data3;
            }
            for(var c=0;c<arrObj.length;c++){
              for(var l=0;l<arrObj[c].list.length;l++){
                if(days.indexOf(arrObj[c].list[l].cd)){
                  arrObj[c].data1[days.indexOf(arrObj[c].list[l].cd)] = arrObj[c].list[l].clk_c;
                  arrObj[c].data2[days.indexOf(arrObj[c].list[l].cd)] = arrObj[c].list[l].clk_p;
                  arrObj[c].data3[days.indexOf(arrObj[c].list[l].cd)] = parseInt((arrObj[c].list[l].clk_c/arrObj[c].list[l].clk_p).toFixed(0));
                }
              }
            }
            this.chartData = arrObj;
            this.drawLine()
          }).catch((err)=>{
          })
        }
        else {
          this.chartLenged=[]
          this.chartData = [];
          this.drawLine()
        }

      },
      // 两个时间相差天数
      datedifference(begin, end) {    //sDate1和sDate2是2006-12-18格式
        var arr = [];
        var ab = begin.split("-");
        var ae = end.split("-");
        var db = new Date();
        db.setUTCFullYear(ab[0], ab[1] - 1, ab[2]);
        var de = new Date();
        de.setUTCFullYear(ae[0], ae[1] - 1, ae[2]);
        var unixDb = db.getTime() - 24 * 60 * 60 * 1000;
        var unixDe = de.getTime() - 24 * 60 * 60 * 1000;
        for (var k = unixDb; k <= unixDe;) {
          k = k + 24 * 60 * 60 * 1000;
          arr.push((new Date(parseInt(k))).format());
        }
        return arr;
      },
      //获取昨日指标
      getTarget(){
        this.$http({
          url:config.menuGetyds,
        }).then((res)=> {
          this.target = res.data.data
        }).catch((err)=>{
        })
      },
      handleCurrentChange:function () {

      },
      handleSizeChange:function () {

      },
      changeData:function(index){
        this.currentIndex = index;
        this.drawLine()
      },
      objectSpanMethod({row, column, rowIndex, columnIndex}){
        var num = 0
        if (columnIndex == 0) {
          for(var i=0;i<this.tableData.length;i++){
            if(row.vs == this.tableData[i].vs){
              num++;
            }
          }
          if(num==1){
            return {
              rowspan: num,
              colspan: 1
            };
          }else if(num>1){
            if(this.tableData[rowIndex-1] && this.tableData[rowIndex].vs == this.tableData[rowIndex-1].vs){
              return {
                rowspan: 0,
                colspan: 0
              }
            }else{
              return {
                rowspan: num,
                colspan: 1
              }
            }
          }

        }
      },
      drawLine:function (){
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('myChart'))
        var series = []
        for(var i=0;i<this.chartData.length;i++){
          var item = {
              name:this.chartData[i].name,
              type:'line',
              data:[]
            }
            if(this.currentIndex==0){
              item.data = this.chartData[i].data1;
            }
          else if(this.currentIndex==1){
            item.data = this.chartData[i].data2;
          }
          else if(this.currentIndex==2){
            item.data = this.chartData[i].data3;
          }
          series.push(item)
        }
        if(series.length==0){
          myChart.clear()
        }
// 绘制图表
        myChart.setOption({
          title: {
            text: ''
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data:this.chartLenged
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data:this.chartX
          },
          yAxis: {
            type: 'value'
          },
          series: series
        },true);
      }
    },
    created(){
      this.getTarget()
      this.changeRangeDate()
      this.getTableData()
    },
  }
</script>

<style scoped>
  body{
    line-height: 1.6;
    font-family: -apple-system-font,BlinkMacSystemFont,"Helvetica Neue","PingFang SC","Hiragino Sans GB","Microsoft YaHei UI","Microsoft YaHei",Arial,sans-serif;
    color: #353535;
  }
  *{
    box-sizing: border-box;
    /*margin: 0;*/
    /*padding: 0;*/
  }
  li{
    list-style: none;
  }
  .menu-analisis{
    width: 100%;
    padding: 20px 40px 40px;
    margin-bottom: 30px;
    background-color: #fff;
    border-radius: 3px;
    -moz-border-radius: 3px;
    -webkit-border-radius: 3px;
    -webkit-box-shadow: 0 1px 5px 0 rgba(0,0,0,0.05);
    box-shadow: 0 1px 5px 0 rgba(0,0,0,0.05);
  }
  .quota{
    width: 100%;
    border: 1px solid #e7e7eb;
    margin-top: 30px;
  }
  .quota-header{
    line-height: 38px;
    height: 38px;
    padding: 0 20px;
    background-color: #f4f5f9;
    border-bottom: 1px solid #e7e7eb;
    overflow: hidden;
  }
  .quota-header .left{
    float: left;
  }
  .quota-header .right{
    float: right;
    color: #c3c3c3;
  }
  .quota-header .right p:nth-child(2n){
    color: #666666;
  }
  .quota-body{
    overflow: hidden;
  }
  .quota-body li{
    float: left;
    width: 33.33%;
    text-align: center;
    margin: 30px 0;
    height: 60px;
    border-right: 1px solid #e7e7eb;
  }
  .quota-body li:last-child{
    border-right: none;
  }
  .quota-body .info{
    display: inline-block;
    /*width: 100%;*/
    text-align: left;

  }
  .quota-body p{
    font-weight: 400;
    font-style: normal;
    font-size: 14px;
  }
  .quota-body h2{
    text-align: center;
    color: #676767;
    font-size: 30px;
    font-weight: normal;
  }
  .quota-body .info div{
    margin-top: 2px;
    font-size: 14px;
    line-height: 18px;
    white-space: nowrap;
  }
  .quota-body .info i{
    margin-left: 10px;
    margin-right: 5px;
  }
  .quota-body .up,.quota-body .down{
    display: inline-block;
    width: 10px;
    height: 9px;
  }
  .quota-body .up{
    background: url("../images/up.png");
    background-size: 100% 100%;
  }
  .quota-body .down{
    background: url("../images/down.png");
    background-size: 100% 100%;
  }
  .change-bar{
    overflow: hidden;
    margin-top: 20px;
  }
  .change-bar li{
    float: left;
    border-top: 1px solid #c9cace;
    border-bottom: 1px solid #c9cace;
    border-left: 1px solid #c9cace;
    line-height: 30px;
    font-size: 14px;
    padding: 0 20px;
    cursor: pointer;
  }
  .change-bar li:first-child{
    border-top-left-radius: 3px;
    -moz-border-radius-topleft: 3px;
    -webkit-border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
    -moz-border-radius-bottomleft: 3px;
    -webkit-border-bottom-left-radius: 3px;
  }
  .change-bar li:last-child{
    border-right: 1px solid #c9cace;
    border-top-right-radius: 3px;
    -moz-border-radius-topright: 3px;
    -webkit-border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
    -moz-border-radius-bottomright: 3px;
    -webkit-border-bottom-right-radius: 3px;
  }
  .change-bar .selected{
    background-color: #ff353a;
    border: 1px solid #ff353a;
    color: #ffffff;
  }
  .data-show{
    margin-top: 20px;
    border: 1px solid #e7e7eb;
  }
  .data-show-header{
    background-color: #f4f5f9;
    height: 40px;
    padding: 5px 15px;
    box-sizing: content-box;
  }
  .data-show-header .base-time{
    float: right;
    width: 115px;
    height: 32px;
    margin-top: 4px;
    text-align: center;
    line-height: 32px;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    border-radius: 3px;
    background-color: #ff353a;
    font-size: 14px;
    color: #fff;
    cursor: pointer;
  }
  .data-show-body{
    padding: 20px;
  }
  .data-show-body .label{
    padding-left: 3px;
    border-left: 4px solid #6b6b6b;
    font-size: 14px;
    height: 14px;
    line-height: 14px;
    font-weight: normal;
    color: #353535;
  }
  .data-show-body .label i{
    color: #c3c3c3;
    margin-left: 4px;
  }
  .data-show-body .charts{
    width: 100%;
    height: 400px;
    position: relative;
  }
  .data-show-body .charts div,.data-show-body .charts{
    width: 100%;
    height: 400px;
  }
  .data-show-body .charts .no-data{
    text-align: center;
    height: 400px;
    line-height: 400px;
    font-size: 18px;
    color: #999999;
    position: absolute;
    left: 0;
    top: 0;
    background-color: #ffffff;
  }
  .table-show{
    border: 1px solid #e7e7eb;
    margin-top: 20px;
  }
  .table-show-header{
    background-color: #f4f5f9;
    padding: 5px 15px;
  }
  .table-show-header .label{
    float: right;
    line-height: 40px;
    color: #c3c3c3;
  }
  .table-show-footer{
    margin: 15px 20px;
  }
  .el-pagination{
    text-align: right;
  }
  .el-pager li.active{
    color: #ff353a !important;
  }
  .el-tooltip__popper.is-light{
    border: 1px solid #c3c3c3 ;
  }
  .el-tooltip__popper{
    max-width: 330px;
    font-size: 16px;
  }

</style>

