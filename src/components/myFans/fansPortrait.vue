<template>
    <div class="fansPortrait">
      <h2>互动排行榜</h2>
      <div class="contrast">
        <div class="data">
          <div class="div1" :style="{width: girlPercent}"></div>
          <div class="div2" :style="{width: boyPercent}"></div>
        </div>
        <div class="label">
          <div class="label1">
            <span></span>
            女（{{girlPercent}}）
          </div>
          <div class="label2">
            <span></span>
            男（{{boyPercent}}）
          </div>
        </div>
      </div>
      <h2>年龄分布</h2>
      <div class="age-contrast">
        <ul class="show">
          <li>
            <span class="fl">年龄</span>
            <span class="fr">粉丝占比</span>
          </li>
          <li>
            <span class="fl">0-18</span>
            <span class="fr">-</span>
          </li>
          <li>
            <span class="fl">18-23</span>
            <span class="fr">-</span>
          </li>
          <li>
            <span class="fl">24-30</span>
            <span class="fr">-</span>
          </li>
          <li>
            <span class="fl">31-40</span>
            <span class="fr">-</span>
          </li>
          <li>
            <span class="fl">41-50</span>
            <span class="fr">-</span>
          </li>
          <li>
            <span class="fl">50+</span>
            <span class="fr">-</span>
          </li>
        </ul>
        <div class="charts" id="charts">

        </div>
        <div class="no-data">暂无数据</div>

      </div>
      <h2>地域分布</h2>
      <div class="region">
        <ul class="show">
          <li>
            <span class="fl">省份</span>
            <span class="fr">粉丝占比</span>
          </li>
          <li>
            <span class="fl">河北</span>
            <span class="fr">-</span>
          </li>
          <li>
            <span class="fl">上海</span>
            <span class="fr">-</span>
          </li>
          <li>
            <span class="fl">内蒙古</span>
            <span class="fr">-</span>
          </li>
          <li>
            <span class="fl">北京</span>
            <span class="fr">-</span>
          </li>
          <li>
            <span class="fl">吉林</span>
            <span class="fr">-</span>
          </li>
          <li>
            <span class="fl">四川</span>
            <span class="fr">-</span>
          </li>
          <li>
            <span class="fl">河北</span>
            <span class="fr">-</span>
          </li>
          <li>
            <span class="fl">上海</span>
            <span class="fr">-</span>
          </li>
          <li>
            <span class="fl">内蒙古</span>
            <span class="fr">-</span>
          </li>
          <li>
            <span class="fl">北京</span>
            <span class="fr">-</span>
          </li>
          <li>
            <span class="fl">吉林</span>
            <span class="fr">-</span>
          </li>
          <li>
            <span class="fl">四川</span>
            <span class="fr">-</span>
          </li><li>
          <span class="fl">河北</span>
          <span class="fr">-</span>
        </li>
          <li>
            <span class="fl">上海</span>
            <span class="fr">-</span>
          </li>
          <li>
            <span class="fl">内蒙古</span>
            <span class="fr">-</span>
          </li>
          <li>
            <span class="fl">北京</span>
            <span class="fr">-</span>
          </li>
          <li>
            <span class="fl">吉林</span>
            <span class="fr">-</span>
          </li>
          <li>
            <span class="fl">四川</span>
            <span class="fr">-</span>
          </li>
          <li>
            <span class="fl">河北</span>
            <span class="fr">-</span>
          </li>
          <li>
            <span class="fl">上海</span>
            <span class="fr">-</span>
          </li>
          <li>
            <span class="fl">内蒙古</span>
            <span class="fr">-</span>
          </li>
          <li>
            <span class="fl">北京</span>
            <span class="fr">-</span>
          </li>
          <li>
            <span class="fl">吉林</span>
            <span class="fr">-</span>
          </li>
          <li>
            <span class="fl">四川</span>
            <span class="fr">-</span>
          </li>

        </ul>
        <div class="china-map" id="map">
        </div>
        <div class="no-data">暂无数据</div>
        <div class="pie" id="pieCharts"></div>
      </div>
      <h2>终端分布</h2>
      <div class="contrast">
        <div class="data">
          <div class="div1" :style="{width: andrioPercent}"></div>
          <div class="div2" :style="{width: iosPercent}"></div>
        </div>
        <div class="label">
          <div class="label1">
            <span></span>
            Andriod（{{andrioPercent}}）
          </div>
          <div class="label2">
            <span></span>
            IOS（{{iosPercent}}）
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  import {config} from "../../router/httpConfig";
  let echarts = require('echarts/lib/echarts')
  require('echarts/map/js/china')
  require('echarts/lib/component/tooltip')

    export default {
        name: "",
      data(){
          return{
            girlPercent:0,
            boyPercent:0,
            andrioPercent:0,
            iosPercent:0,
            appbackUrl:this.$store.state.appbackUrl,//两微一端路径
            appbackId:this.$store.state.userInfo.appbackId,
            currentDes:'新增粉丝',
            lineData:[120, 132, 101, 134, 90, 230],
          }
      },
      methods:{
        // 获取用户信息
        getUserInfo(){
          this.appbackUrl = this.$store.state.appbackUrl;
          this.getSexRatio(this.$store.state.userInfo.appbackId)
          this.getPlatformRatio(this.$store.state.userInfo.appbackId)
        },
          //获取男女占比
        getSexRatio(userId){
          this.$http({
            url:this.appbackUrl+config.sexRatioUrl+'?userId='+userId
          }).then((res)=> {
            var data = res.data.data;
            var total = 0;
            for(var j=0;j<data.length;j++){
              if(data[j].item==0||data[j].item==1){
                total+=data[j].count
              }
            }
            if(total==0){
              this.boyPercent = '0.00%'
              this.girlPercent='0.00%'
            }
            else {
              for(var i=0;i<data.length;i++){
                if(data[i].item=='0'){
                  this.boyPercent = ((data[i].count/total)*100).toFixed(2)+'%'
                }
                if(data[i].item=='1'){
                  this.girlPercent = ((data[i].count/total)*100).toFixed(2)+'%'
                }
              }
            }

          }).catch((err)=>{
          })
        },
        // 平台占比
        getPlatformRatio(userId){
          this.$http({
            url:this.appbackUrl+config.platformRatioUrl+'?userId='+userId
          }).then((res)=> {
            var data = res.data.data;
            var total = 0;
            for(var j=0;j<data.length;j++){
              if(data[j].item==1||data[j].item==2){
                total+=data[j].count
              }
            }
            if(total==0){
              this.andrioPercent='0.00%'
              this.iosPercent ='0.00%'
            }
            else {
              for(var i=0;i<data.length;i++){
                if(data[i].item==1){
                  this.andrioPercent = ((data[i].count/total)*100).toFixed(2)+'%'
                }
                if(data[i].item==2){
                  this.iosPercent = ((data[i].count/total)*100).toFixed(2)+'%'
                }
              }
            }

          }).catch((err)=>{
          })
        },
          drawLine(){
            // 基于准备好的dom，初始化echarts实例
            let myChart = this.$echarts.init(document.getElementById('charts'))
// 绘制图表
            myChart.setOption({
              title: {
                text: ''
              },
              tooltip: {
                trigger: 'axis'
              },
              grid: {
                left: '50',
                right: '4%',
                bottom: '20',
                top:'40',
                containLabel: true
              },
              xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['0-18','18-23','23-30','31-40','41-50','50+']
              },
              yAxis: {
                type: 'value'
              },
              series: [
                {
                  name:'数量占比',
                  type:'line',
                  data:[],
                  lineStyle:{
                    color:'#ff353a'
                  },
                  itemStyle:{
                    color:'#ff353a'
                  }
                }
              ]
            });
          },
          drawPie(){
            let myChart = this.$echarts.init(document.getElementById('pieCharts'))
            myChart.setOption({
              tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : -"
              },
              series : [
                {
                  name: '数据',
                  type: 'pie',
                  radius : '55%',
                  center: ['50%', '50%'],
                  data:[
                    {value:'110', name:'四川'},
                    {value:'110', name:'上海'},
                    {value:'110', name:'北京'},
                    {value:'110', name:'湖南'},
                    {value:'110', name:'山西'},
                    {value:'110', name:'内蒙古'},
                    {value:'110', name:'湖北'},
                    {value:'110', name:'陕西'},
                    {value:'110', name:'其它'}
                  ],
                  itemStyle: {
                    emphasis: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                  }
                }
              ]
            });
          },
          drawMap(){
            var option = {
              backgroundColor:"#ffffff",
              tooltip:{
                trigger:'item',
                // formatter:'{a} <br />{b}:{c}'
                formatter:'{a} <br />{b}:-'
              },
              visualMap:{
                type: 'continuous',
                text: ['高', '低'],
                showLabel: true,
                left: '50',
                min: 0,
                max: 100,
                inRange: {
                  color: ['#aaaaaa','#94dfe6']
                },
                splitNumber: 0
              },
              series: [{
                name: '地域分布',
                type: 'map',
                mapType: 'china',
                roam: false,
                label: {
                  normal: {
                    show: true  //省份名称
                  },
                  emphasis: {
                    show: false
                  }
                },
                itemStyle:{
                  normal: {
                    areaColor:'#94dfe6',
                    borderColor:'#fff'
                  }
                },
                data:[
                  {name: '北京',value: '-' },{name: '天津',value: '-' },
                  {name: '上海',value: '-'},{name: '重庆',value:'-' },
                  {name: '河北',value: '-' },{name: '河南',value:'-' },
                  {name: '云南',value: '-' },{name: '辽宁',value: '-'},
                  {name: '黑龙江',value: '-' },{name: '湖南',value:  '-' },
                  {name: '安徽',value: '-' },{name: '山东',value:  '-' },
                  {name: '新疆',value:'-' },{name: '江苏',value:  '-' },
                  {name: '浙江',value:'-' },{name: '江西',value:  '-'},
                  {name: '湖北',value:'-' },{name: '广西',value:'-'},
                  {name: '甘肃',value:'-' },{name: '山西',value: '-'},
                  {name: '内蒙古',value:'-' },{name: '陕西',value: '-' },
                  {name: '吉林',value:'-' },{name: '福建',value: '-'},
                  {name: '贵州',value: '-'},{name: '广东',value:'-' },
                  {name: '青海',value:'-' },{name: '西藏',value: '-'},
                  {name: '四川',value: '-'},{name: '宁夏',value: '-' },
                  {name: '海南',value: '-' },{name: '台湾',value: '-' },
                  {name: '香港',value:'-'},{name: '澳门',value: '-' }
                ]  //数据
              }],
            }
            this.chart = this.$echarts.init(document.getElementById('map'),'macarons');
            this.chart.setOption(option)
          }
      },
      created(){
        var that = this;
        var timer = setInterval(function () {
          if(that.$store.state.userInfo.appbackId){
            clearInterval(timer)
            that.getUserInfo()
          }
        },1000)
      },
      mounted(){
          this.drawLine()
        this.drawPie()
        this.drawMap()
      }
    }
</script>

<style scoped>
  li{
    list-style: none;
  }
.fansPortrait{
  width: 100%;
  box-sizing: border-box;
  padding: 0 40px 70px;
  color: #222;
  background-color: #ffffff;
  overflow: hidden;
}
  h2{
    font-weight: normal;
    font-size: 17px;
    margin: 30px 0 15px;
  }
  .contrast{
    width: 100%;
    box-sizing: border-box;
    padding: 0 160px 0 34px;
    height: 147px;
    overflow: hidden;
    border: 1px solid #bfbfbf;
    position: relative;
  }
  .contrast .data{
    width: 100%;
    height: 26px;
    margin-top: 36px;
    background-color: #bfbfbf;
  }
  .contrast .data div{
    float: left;
    height: 26px;
  }
.contrast .data .div1,.contrast .label1 span{
  background-color: #ff353a;
}
.contrast .data .div2,.contrast .label2 span{
  background-color: #6ccbd7;
}
  .contrast .label{
    position: absolute;
    right: 35px;
    bottom: 30px;
    font-size: 14px;
    color: #3d3d3d;
    overflow: hidden;
  }
  .contrast .label>div{
    float: left;
    line-height: 16px;
  }
  .contrast .label span{
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-right: 3px;
    vertical-align: top;
  }
.contrast .label2{
  margin-left: 9px;
}
  .age-contrast{
    width: 100%;
    box-sizing: border-box;
    height: 476px;
    border: 1px solid #bfbfbf;
  }
  .show{
    width: 210px;
    height: 100%;
    /*overflow-y: auto;*/
    float: right;
    box-sizing: border-box;
    border-left: 1px solid #bfbfbf;
  }
  .show li{
    height: 68px;
    line-height: 67px;
    box-sizing: border-box;
    border-bottom: 1px solid #bfbfbf;
    font-size: 15px;
    padding: 0 25px;
  }
 .show li:last-child{
    border-bottom: none;
  }
  .show .fr{
    float: right;
    text-align: right;
  }
  .age-contrast .charts{
    margin-right: 210px;
    height: 100%;
    /*display: none;*/
  }
   .age-contrast .no-data{
    margin-right: 210px;
    height: 100%;
     text-align: center;
     line-height: 476px;
     font-size: 18px;
     color: #999;
     display: none;
  }
  .region{
    width: 100%;
    height: 780px;
    border: 1px solid #bfbfbf;
  }
  .region .no-data{
    /*width: 100%;*/
    height: 331px;
    margin-right: 170px;
    text-align: center;
    line-height: 331px;
    font-size: 18px;
    color: #999999;
    border-top: 1px solid #bfbfbf;
    display: none;
  }
  .region .show{
    width: 170px;
    overflow-y: auto;
  }
  .region .show li{
    height: 38px;
    padding: 0 10px;
    line-height: 37px;
  }
  .china-map,.pie{
    margin-right: 170px;
    /*display: none;*/
  }
  .china-map{
    height: 445px;
  }
  .pie{
    height: 331px;
    box-sizing: border-box;
    /*display: none;*/
    border-top: 1px solid #bfbfbf;
  }
</style>
