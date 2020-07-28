<template>
    <div class="img">
      <div class="box">
        <img :src="imgSrc" alt="">
        <div class="close" @click="closePreview"></div>
      </div>
    </div>
</template>

<script>
    export default {
        name: "",
      props:['imgSrc'],
      methods:{
        closePreview(){
          this.$emit('hidePreview',0);
        }
      }
    }
</script>

<style scoped>
.img{
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 9999999;
  background-color: rgba(0,0,0,.6);
}
.box{
  max-width: 60%;
  max-height: 60%;
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  -o-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  /*padding: 10px;*/
  background-color: #fff;
}
  img{
    display: block;
    max-width: 100%;
    max-height:80%;
    margin: 0;
  }
  .close{
    width: 40px;
    height: 40px;
    background: url("../../static/images/close3.png");
    background-size: 100% 100%;
    position: absolute;
    right: -40px;
    top: -40px;
    cursor: pointer;
  }
</style>
