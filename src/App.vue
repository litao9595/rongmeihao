<template>
  <div id="app">
    <!--<img src="./assets/logo.png">-->
    <router-view/>
    <lg-preview></lg-preview>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
*{
  margin: 0;
  padding: 0;
}
.min-height{
  min-height: 100%;
}
.el-button--primary,
#customMenu .el-radio__input.is-checked .el-radio__inner{
  background-color: rgb(248, 89, 89);
  border-color: rgb(248, 89, 89);
}
#customMenu .el-radio__input.is-checked+.el-radio__label{
  color: rgb(248, 89, 89);
}

   .el-button--primary.is-active,  .el-button--primary:active{
    background-color: rgb(248, 89, 89);
  }
.el-button--primary:focus, .el-button--primary:hover{
  background-color: rgb(248, 89, 89);
  border-color: rgb(248, 89, 89);
}
  #customMenu .left .el-button{
    float: right;
    width: 30px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    padding: 0;
    margin: 0;
    margin-top: 5px;
    border: none;
    background: none;
  }
  #vote .el-table th, #vote.el-table tr{
    background-color: #f5f7f9;
  }
  #vote .el-button--text{
    color: #606266;
  }
#vote .el-button--text:hover{
  color: #ff353a;
}
  #voteDetails .el-progress-bar__inner{
    background-color: #ff353a;
  }
  #voteDetails .el-progress__text{
    display: none;
  }
  #voteDetails .el-progress-bar__outer{
    background-color: #e5e5e5;
  }
#voteCreate .el-input,#voteCreate .el-textarea__inner{
  width: 40%;
}
  #voteCreate .choice-template .el-input{
    width: 90%;
  }
#voteCreate .time .el-input{
  width: 140px;
  margin-right: 15px;
}
#voteCreate .template .el-input{
  width: 100%;
  height: 40px;
}
#voteCreate .template .el-input .el-input__inner{
  height: 100%;
}
#voteCreate .el-button--primary{
  background: none;
  border: 1px solid #e5e9eb;
  color: #343435;
}
  .el-radio__input.is-checked+.el-radio__label{
    color: #ff353a;
  }
 .el-radio__input.is-checked .el-radio__inner{
    background-color: #ff353a;
    border-color: #ff353a;
  }
#voteCreate .poster .el-upload{
  width: 78px;
  height: 78px;
  text-align: center;
  line-height:78px;
  border: 1px dashed #999;
}
#voteCreate .template .input .el-upload{
  display: block;
  width: 20px;
  height: 20px;
}
 .el-menu--horizontal>.el-menu-item{
   font-size: 16px;
  color: #222222;
  padding: 0 10px;
  margin: 0 40px;
}
 .el-menu--horizontal>.el-menu-item.is-active{
  border-bottom: 3px solid #ff353a;
  color: #ff353a;
   font-weight: bold;
}

.el-menu--horizontal .el-menu-item:not(.is-disabled):focus, .el-menu--horizontal .el-menu-item:not(.is-disabled):hover{
  color: #ff353a;
  border-bottom: 3px solid #ff353a;
}
.el-menu--horizontal.el-menu{
  padding-top: 5px;
}
  #fansSurvey .el-table th{
    background-color: #f4f5f6;
  }
.el-checkbox__input.is-checked .el-checkbox__inner{
  background-color: #ff353a;
  border-color: #ff353a;
}
.el-checkbox__input.is-checked+.el-checkbox__label {
  color: #ff353a;
}
.el-select-dropdown__item.selected {
  color: #ff353a;
  font-weight: 700;
}
  #systemAccount  .el-upload--text{
    display: block;
    width: 100%;
    height: 100%;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    line-height: 70px;
    background-color: rgba(0,0,0,.3);
    color: #ffffff;
  }
.el-switch.is-checked .el-switch__core {
  border-color: #ff353a;
  background-color: #ff353a;
}
.el-radio.is-bordered.is-checked {
  border-color: #ff353a;
}
.el-progress-bar__inner{
  background-color: #ff353a;
}
.el-table th{
  background-color: #f4f5f6;
}
::-webkit-scrollbar
{
  width: 4px;  /*滚动条宽度*/
  height: 16px;  /*滚动条高度*/
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track
{
  -webkit-box-shadow:none;
  border-radius: 4px;  /*滚动条的背景区域的圆角*/
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb
{
  background-color: #999;
  border-radius: 4px;  /*滚动条的圆角*/
  /*-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);*/
}
.el-pagination.is-background .el-pager li:not(.disabled).active{
  background-color: #ff353a;
}
.el-button--primary.is-disabled{
  background-color: rgba(248, 89, 89,0.8);
  border-color:rgba(248, 89, 89,0.8);
}
.el-button--primary.is-disabled:hover{
  background-color: rgba(248, 89, 89,0.8);
  border-color:rgba(248, 89, 89,0.8);
}
  html{
    height: 100%;
  }
body,#app{
  height: 100%;
}
.ql-editor.ql-blank:before{
  font-style: normal !important;
}
.el-input__inner{
  border: solid 1px #e6e6e6;
}

  /*修改弹出层*/
.el-message-box__wrapper{
  z-index: 9999999 !important;
}
.v-modal{
  z-index: 99999 !important;
}
  .mask_box{
    z-index: 99999 !important;
  }
  .el-icon-loading{
    color: #ff353a !important;
  }
.ck-editor__main{
  min-height: 430px;
  padding: 20px 50px 0px 50px;
  border: none !important;
  background: url("images/icon/po.png") no-repeat 20px 10px,url("images/icon/po2.png") no-repeat 935px 10px;
}
 .ck-content{
   min-height: 430px;
}
.ck.ck-toolbar{
  border: none !important;
}
.ck{
  position: relative;
}
.ck .ck-sticky-panel .ck-sticky-panel__content_sticky{
  /*position: absolute;*/
  top: 75px !important;
}
.mobel_box_content img{
  width: 100%;
  display: block;
}
.mobel_box_content .image{
  width: 100%;
}
.mobel_box_content figure img{
  width: 100%;
  display: block;
}
.ck-button{
  color: #93959b !important;
}
.post-article{
  padding-bottom: 100px;
}
.ck-editor__editable_inline {
  border: none !important;
  box-shadow: none !important;
}
  .ck-toolbar{
    background: #fff !important;
  }
  .ck-editor__top{
    border-top: solid 1px #e6e6e6 !important;
    border-bottom: solid 1px #e6e6e6 !important;
  }
.ck.ck-editor{
  border-bottom: solid 1px #e6e6e6 !important;
}
.el-dialog__wrapper{
  width: 100%;
  z-index: 9999999 !important;
}
.el-dialog__body{
  padding: 15px 20px;
}
#fileImg_content .el-upload-list--picture-card .el-upload-list__item{
  width: 130px;
  height: 130px;
}
#fileImg_content .el-upload--picture-card{
  width: 130px;
  height: 130px;
  line-height: 128px;
}
.el-message{
  z-index: 999999 !important;
}
 .el-date-picker ,.time-select, .el-select-dropdown{
  z-index: 999999 !important;
}
.ql-container{
  font-size: 16px !important;
}
.ql-snow.ql-toolbar button, .ql-snow .ql-toolbar button{
  width: 35px !important;
  height: 30px !important;
}
.ql-toolbar.ql-snow{
  border: none !important;
  border-top: solid 1px #e8e8e8 !important;
  border-bottom: solid 1px #e8e8e8 !important;
  width: 980px !important;
  background: #fff !important;
  z-index: 10;
}
.ql-container.ql-snow{
  min-height: 420px;
  overflow: hidden;
  border: none !important;
  border-bottom: solid 1px #e8e8e8 !important;
  padding: 20px 50px !important;
  background: url("images/icon/po.png") no-repeat 30px 10px,url("images/icon/po2.png") no-repeat 928px 10px;
}
.ql-editor{
  min-height: 420px;
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
  content: '标题1' !important;
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
  content: '标题2' !important;
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
  content: '标题3' !important;
}

.ql-snow .ql-stroke {
  fill: none;
  stroke: #93959b !important;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.ql-snow .ql-fill, .ql-snow .ql-stroke.ql-fill {
  fill: #93959b !important;
}
.ql-snow .ql-picker-label{
  color: #93959b !important;
}
.ql-snow.ql-toolbar button:hover .ql-stroke, .ql-snow .ql-toolbar button:hover .ql-stroke, .ql-snow.ql-toolbar button:focus .ql-stroke, .ql-snow .ql-toolbar button:focus .ql-stroke, .ql-snow.ql-toolbar button.ql-active .ql-stroke, .ql-snow .ql-toolbar button.ql-active .ql-stroke, .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke, .ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke, .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke, .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke, .ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke, .ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke, .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke, .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke, .ql-snow.ql-toolbar button:hover .ql-stroke-miter, .ql-snow .ql-toolbar button:hover .ql-stroke-miter, .ql-snow.ql-toolbar button:focus .ql-stroke-miter, .ql-snow .ql-toolbar button:focus .ql-stroke-miter, .ql-snow.ql-toolbar button.ql-active .ql-stroke-miter, .ql-snow .ql-toolbar button.ql-active .ql-stroke-miter, .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke-miter, .ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke-miter, .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter, .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter, .ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke-miter, .ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke-miter, .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter, .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter{
  stroke: rgb(248, 89, 89) !important;
}
.ql-snow.ql-toolbar button:hover .ql-fill{
  fill: rgb(248, 89, 89) !important;
}
.ql-snow.ql-toolbar button:hover{
  color: rgb(248, 89, 89) !important;
}
.ql-snow.ql-toolbar button:hover, .ql-snow .ql-toolbar button:hover, .ql-snow.ql-toolbar button:focus, .ql-snow .ql-toolbar button:focus, .ql-snow.ql-toolbar button.ql-active, .ql-snow .ql-toolbar button.ql-active, .ql-snow.ql-toolbar .ql-picker-label:hover, .ql-snow .ql-toolbar .ql-picker-label:hover, .ql-snow.ql-toolbar .ql-picker-label.ql-active, .ql-snow .ql-toolbar .ql-picker-label.ql-active, .ql-snow.ql-toolbar .ql-picker-item:hover, .ql-snow .ql-toolbar .ql-picker-item:hover, .ql-snow.ql-toolbar .ql-picker-item.ql-selected, .ql-snow .ql-toolbar .ql-picker-item.ql-selected{
  color: rgb(248, 89, 89) !important;
}
.ql-snow .ql-tooltip[data-mode=link]::before {
  content: "输入链接地址:" !important;
}
.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
  border-right: 0px;
  content: '保存' !important;
  padding-right: 0px;
}
#fileImg_content .el-upload-list__item-status-label{
display: none;
}
#fileImg_content .el-upload-list--picture-card .el-upload-list__item-actions span:nth-child(1){
  display: none !important;
}
#fileImg_content10 .el-upload-list__item-status-label{
  display: none;
}
#fileImg_content10 .el-upload-list--picture-card .el-upload-list__item-actions span:nth-child(1){
  display: none !important;
}
.ql-editor img{
  width: 300px;
  display: block;
  margin: 10px auto;
}
.ql-editor video{
  margin: 10px auto;
  display: block;
  width: 300px !important;
}
.ql-editor audio{
  margin: 10px auto;
  display: block;
  width: 300px !important;
  }
.video-looding .el-progress__text{
  color: #fff !important;
}
</style>
