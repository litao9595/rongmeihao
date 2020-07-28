<template>
<div class="user-analisis">
  <div class="tip"><i class="el-icon-warning"></i>本页根据昨日数据来计算，而用户管理页根据当前数据计算，两者不一致。</div>
  <div class="quota">
    <div class="quota-header">
      <div class="left">昨日关键指标</div>
      <div class="right">
        <el-tooltip class="item" effect="light" placement="bottom-end">
          <div slot="content">
              <p>新关注人数</p>
              <p>新关注的去重用户数</p>
            <p>取消关注人数</p>
            <p>取消关注的去重用户数</p>
            <p>净增关注人数</p>
            <p>净增长的去重关注用户数</p>
            <p>累积关注人数</p>
            <p>当前关注的用户总数</p>
            <p>日、周、月</p>
            <p>分别计算昨日数据相比1天、7天、30天前的变化情况</p>
            <p>请注意</p>
            <p>用户总数根据昨日数据计算，而用户管理模块根据当前实时数据计算，两者可能不一致</p>
            <div>数据从2013年7月1日开始统计。由于服务器缓存，以及指标计算方法和统计时间的差异，数据可能出现微小误差，一般在1%以内。</div>
          </div>
          <i class="el-icon-question"></i>
        </el-tooltip>
      </div>
    </div>
    <ul class="quota-body">
      <li>
        <div class="info">
          <p>新关注人数</p>
          <h2>0</h2>
          <div>日<i></i>--</div>
          <div>周<i class="down"></i>100%</div>
          <div>月<i class="down"></i>100%</div>
        </div>
      </li>
      <li>
        <div class="info">
          <p>取消关注人数</p>
          <h2>0</h2>
          <div>日<i></i>--</div>
          <div>周<i class="down"></i>100%</div>
          <div>月<i  class="down"></i>100%</div>
        </div>
      </li>
      <li>
        <div class="info">
          <p>净增关注人数</p>
          <h2>0</h2>
          <div>日 <i></i>--</div>
          <div>周 <i  class="down"></i>100%</div>
          <div>月 <i  class="down"></i>100%</div>
        </div>
      </li>
      <li>
        <div class="info">
          <p>累积关注人数</p>
          <h2>18</h2>
          <div>日<i></i>--</div>
          <div>周<i class="up"></i>100%</div>
          <div>月<i class="up"></i>12.5%</div>
        </div>
      </li>
    </ul>
  </div>
  <ul class="change-bar" >
    <li :class="currentIndex==0?'selected':''" @click="changeData(0)">新增人数</li>
    <li  :class="currentIndex==1?'selected':''" @click="changeData(1)">取消关注人数</li>
    <li :class="currentIndex==2?'selected':''" @click="changeData(2)">净增人数</li>
    <li :class="currentIndex==3?'selected':''" @click="changeData(3)">累计人数</li>
  </ul>
  <div class="data-show">
    <div class="data-show-header">
      <el-select v-model="dataDay" placeholder="请选择">
        <el-option :value="0">最近7天</el-option>
        <el-option :value="1">最近15天</el-option>
        <el-option :value="2">最近30天</el-option>
      </el-select>
      <el-date-picker
        v-model="value9"
        type="daterange"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        default-value="2010-10-01">
      </el-date-picker>
      <el-select v-model="dataSource" placeholder="请选择">
        <el-option
          v-for="item in dataSourceOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <div class="base-time">按时间对比</div>
    </div>
    <div class="data-show-body">
      <div class="label">趋势图<el-tooltip class="item" effect="dark" content="用户总数和用户增长数分别根据不同方法和时间点来统计，可能出现不匹配。" placement="bottom-end">
        <i class="el-icon-question"></i>
      </el-tooltip></div>
      <div class="charts">
        <div id="myChart"></div>
      </div>
    </div>
  </div>
  <div class="table-show">
    <div class="table-show-header">
      <el-date-picker
        v-model="tableTime"
        type="daterange"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
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
        style="width: 100%">
        <el-table-column
          sortable
          align="center"
          prop="time"
          label="时间"
         >
        </el-table-column>
        <el-table-column
          sortable
          align="center"
          prop="newFocus"
          label="新关注人数"
          >
        </el-table-column>
        <el-table-column
          sortable
          align="center"
          prop="cancelFocus"
          label="取消关注人数">
        </el-table-column>
        <el-table-column
          sortable
          align="center"
          prop="addNum"
          label="净增关注人数">
        </el-table-column>
        <el-table-column
          sortable
          align="center"
          prop="heapNum"
          label="累积关注人数">
        </el-table-column>
      </el-table>
      <div class="table-show-footer">
        <el-pagination
          style="text-align: center;margin-top: 25px;"
          background
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :total="50">
        </el-pagination>
      </div>
    </div>
  </div>
</div>
</template>

<script>
    export default {
      name: "",
      data() {
        return {
          currentIndex:0,
          tableTime:'',
          value9: '',
          dataDay:'',
          currentPage: 1,
          dataSourceOptions: [{
            value: '选项1',
            label: '全部来源',
          }, {
            value: '选项2',
            label: '搜一搜'
          }, {
            value: '选项3',
            label: '扫描二维码'
          }, {
            value: '选项4',
            label: '图文页右上角菜单'
          }, {
            value: '选项5',
            label: '图文页内公众号名称'
          },{
            value: '选项6',
            label: '名片分享'
          },{
            value: '选项7',
            label: '支付后关注'
          },{
            value: '选项8',
            label: '其他合计'
          }
          ],
          tableData: [{
            time: '2016-05-02',
            newFocus: 15,
            cancelFocus: 0,
            addNum:20,
            heapNum:10
          }, {
            time: '2016-05-05',
            newFocus: 11,
            cancelFocus: 2,
            addNum:19,
            heapNum:1
          }, {
            time: '2016-04-05',
            newFocus: 15,
            cancelFocus: 0,
            addNum:20,
            heapNum:10
          }, {
            time: '2016-05-01',
            newFocus: 15,
            cancelFocus: 0,
            addNum:20,
            heapNum:10
          }],
          dataSource:''
        };
      },
      mounted(){
        this.drawLine();
      },
      methods:{
        handleCurrentChange:function () {

        },
        handleSizeChange:function () {

        },
        changeData:function(index){
          this.currentIndex = index;
          this.drawLine()
        },
        drawLine:function (){
          // 基于准备好的dom，初始化echarts实例
          let myChart = this.$echarts.init(document.getElementById('myChart'))
// 绘制图表
          myChart.setOption({
            xAxis: {
              type: 'category',
              axisLabel:{interval:2},
              data: ['2019-03-12', '2019-03-13', '2019-03-14', '2019-03-15', '2019-03-16', '2019-03-17', '2019-03-18','2019-03-19','2019-03-20','2019-03-21','2019-03-22','2019-03-23','2019-03-24']
            },
            tooltip:{
              show:true,
              trigger:'item',
              formatter: '{b0}<br />{a0} {c0}',
              axisPointer:{
                type:'line'
              }
            },
            yAxis: {
              type: 'value',
              axisLine:{
                show:false
              },
              axisTick:{
                show:false
              }
            },
            series: [{
              name:'新关注人数-全部',
              data: [0,0,0,1,1,0,2,0,0,0,0,1,1],
              type: 'line',
              lineStyle:{
                color:'#ff353a'
              },
              itemStyle:{
                color:'#ff353a'
              }
            }]
          });
        }
      }
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
  .user-analisis{
    width: 100%;
    padding: 40px;
    margin-bottom: 30px;
    background-color: #fff;
    border-radius: 3px;
    -moz-border-radius: 3px;
    -webkit-border-radius: 3px;
    -webkit-box-shadow: 0 1px 5px 0 rgba(0,0,0,0.05);
    box-shadow: 0 1px 5px 0 rgba(0,0,0,0.05);
  }
  .tip i{
    color: #00aeef;
    margin-right: 10px;
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
    width: 25%;
    text-align: center;
    margin: 30px 0;
    height: 130px;
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
  .data-show-body .charts div,.data-show-body .charts{
    width: 100%;
    height: 400px;
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

