<template>
  <div class="wrapper">
    <div class="model" v-show="model" @click="model = false">
      <div class="model-show">
        <img :src="modelSrc" crossOrigin="anonymous" alt="">
      </div>
    </div>
    <div class="model-head">
      <div class="left">封面裁剪</div>
      <div class="right"><i @click="clickClose()" class="el-icon-close"></i></div>
    </div>
    <div class="content">
      <div class="show-info">
        <div class="test">
          <vueCropper ref="cropper2" :img="example2.img" :outputSize="example2.size" :outputType="example2.outputType"
                      :info="example2.info" :canScale="example2.canScale" :autoCrop="example2.autoCrop"
                      :autoCropWidth="example2.autoCropWidth" :autoCropHeight="example2.autoCropHeight" :fixed="example2.fixed"
                      :fixedNumber="example2.fixedNumber" :enlarge="4"></vueCropper>
        </div>
        <button @click="rotateLeft()" class="btn">左旋转</button>
        <button @click="finish2()" class="btn">裁剪</button>
        <button @click="rotateRight()" class="btn">右旋转</button>
      </div>
    </div>
    <!--loding-->
    <div class="loding_box" v-if="fttlodingBox">
      <i class="el-icon-loading"></i>
    </div>
  </div>
</template>

<script>
  import { VueCropper } from 'vue-cropper'
  import {config} from "../../router/httpConfig.js"
  import { eventBus } from '../../main'
  import {mapState} from 'vuex'
    export default {
        name: "cropper.vue",
        components: {
          VueCropper,
        },
      props:{
          bbc:String
      },
      created:function(){
        let _this=this;
        _this.fttlodingBox=true;
        $.ajax({
          url:config.urlBase64,
          type:'post',
          data:{
            imgUrl:_this.bbc,
            areaId:localStorage.areaId
          },
          success:function(res){
            _this.example2.img='data:image/png;base64,'+res.data;
            _this.fttlodingBox=false;
          }
        })
      },
      data() {
        return {
          coverImg:{
            state:false,
            url:'',
          },
          fttlodingBox:false,
          model: false,
          modelSrc: '',
          crap: false,
          previews: {},
          form: {
            head: ''
          },
          example2: {
            //img的路径自行修改
            img: this.bbc,
            // img: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2869609935,1111650341&fm=26&gp=0.jpg',
            info: true,
            size: 1,
            outputType: 'png',
            canScale: true,
            autoCrop: true,
            // 只有自动截图开启 宽度高度才生效
            autoCropWidth: 300,
            autoCropHeight: 250,
            fixed: true,
            // 真实的输出宽高
            infoTrue: true,
            fixedNumber: [16, 9]
          },
          downImg: '#',
          areaId:this.$store.state.userInfo.areaId
        }
      },
      methods: {
        clickClose(){
          this.$emit('e-world',this.coverImg);
        },
        //点击裁剪，这一步是可以拿到处理后的地址
        finish2() {
          this.$refs.cropper2.getCropData((data) => {
            this.modelSrc = data
            this.model = false;
            //裁剪后的图片显示
            this.example2.img = this.modelSrc;
            this.coverImg.url=data;
            this.$emit('e-world',this.coverImg);
            // console.log(data)
          })
        },
        rotateLeft(){
          //左旋转90度
          this.$refs.cropper2.rotateLeft()
        },
        rotateRight(){
          //右旋转90度
          this.$refs.cropper2.rotateRight()
        },
      },
    }
</script>

<style scoped>
  * {
    margin: 0;
    padding: 0;
  }
  .wrapper{
    width: 600px;
    background: #fff;
    border-radius: 10px;
    position: absolute;
    left: 50%;
    top:50%;
    transform: translate(-50%,-50%);
  }
  .content {
    margin: auto;
    width: 540px;
  }
  .btn {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: 1px solid #c0ccda;
    color: #1f2d3d;
    text-align: center;
    box-sizing: border-box;
    outline: none;
    margin: 20px 10px 0px 0px;
    padding: 9px 15px;
    font-size: 14px;
    border-radius: 4px;
    color: #fff;
    background-color: #50bfff;
    border-color: #50bfff;
    transition: all .2s ease;
    text-decoration: none;
    user-select: none;
  }
  .show-info {
    margin-bottom: 30px;
    text-align: center;
  }

  .show-info h2 {
    line-height: 50px;
  }
  .test {
    height: 285px;
  }

  .model {
    position: fixed;
    z-index: 10;
    width: 100vw;
    height: 100vh;
    overflow: auto;
    top: 0;
    left: 0;
    /*background: rgba(0, 0, 0, 0.8);*/
  }

  .model-show {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
  }

  .model img {
    display: block;
    margin: auto;
    max-width: 80%;
    user-select: none;
    background-position: 0px 0px, 10px 10px;
    background-size: 20px 20px;
    background-image: linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%, #eee 100%), linear-gradient(45deg, #eee 25%, white 25%, white 75%, #eee 75%, #eee 100%);
  }
  @keyframes slide {
    0% {
      background-position: 0 0;
    }

    100% {
      background-position: -100% 0;
    }
  }

  @media screen and (max-width: 1000px) {
    .content {
      max-width: 90%;
      margin: auto;
    }

    .test {
      height: 400px;
    }
  }
  .model-head{
    height: 40px;
    border-bottom: solid 1px #ccc;
    line-height: 40px;
    padding-left: 20px;
    padding-right: 10px;
    margin-bottom: 20px;
  }
  .model-head .left{
    font-size: 16px;
    float: left;
  }
  .model-head .right{
    float: right;
    font-size: 20px;
    cursor: pointer;
  }
  .loding_box{
    position: fixed;
    left: 50%;
    top:50%;
    transform: translate(-50%,-50%);
    z-index: 100;
  }
  .loding_box i{
    font-size: 40px;
  }
</style>
