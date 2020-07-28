<template>
  <div class="custom-body">
    <div class="tip">支持创建最多3个一级菜单，每个一级菜单下可创建最多5个二级菜单</div>
    <div class="custom-body-main">
      <div class="top">
        <div class="left">
          <div class="bar">
            菜单管理
            <!--<i class="el-icon-info"></i>-->
            <el-popover
              ref="popover1"
              placement="top-start"
              title=""
              width="60"
              trigger="hover"
              content="添加子菜单">
            </el-popover>
            <el-button v-popover:popover1 @click="addParentMenu"><i class="el-icon-plus" ></i></el-button>
          </div>
          <ul>
            <li v-for="(item,index) in sideMenu">
              <div class="item" :class="[item.subMenuList.length==0?'':'icons-none']">
                <div class="name" @click="clickItem(index)">{{item.name}}</div>
                <div class="icons "  v-show="currentIndex==index&&currentParentIndex==undefined">
                  <div class="icon">
                    <i class="el-icon-plus" @click="addChildMenu(0,index)">
                    </i>
                    <span class="hover">添加</span>
                  </div>
                  <div class="icon">
                    <i class="el-icon-delete" @click="deleteMenu(index)"></i>
                    <span class="hover">删除</span>
                  </div>
                 <div class="icon">
                   <i class="el-icon-edit" @click="addChildMenu(1,index)"> </i>
                   <span class="hover">编辑</span>
                 </div>
                </div>
              </div>
              <dl>
                <div class="item" v-for="(item2,index2) in item.subMenuList">
                  <div class="name" @click="clickItem(index2,index)">{{item2.name}}</div>
                  <div class="icons" v-show="currentIndex==index2&&currentParentIndex==index">
                    <div class="icon">
                      <i class="el-icon-delete" @click="deleteMenu(index2,index)"> </i>
                      <span class="hover">删除</span>
                    </div>
                   <div class="icon">
                     <i class="el-icon-edit" @click="editChild(index2,index)"> </i>
                     <span class="hover">编辑</span>
                   </div>
                  </div>
                </div>
              </dl>
            </li>
          </ul>
        </div>
        <div class="right">
          <div class="bar">设置动作(请选择菜单动作)</div>
          <div class="main">
            <div class="have-child" v-show="haveChild">已有子菜单，无法设置动作</div>
            <div class="none" v-show="sideMenu.length==0">请点击左侧菜单或增加一个新菜单，并在右侧设置动作</div>
            <div class="have" v-show="showUrlEdit">
              <div class="radio">
                <el-radio v-model="radio" label="1">插入链接</el-radio>
              </div>
              <div class="remarks">读者点击该菜单时会跳转至以下链接</div>
              <div class="input">
                <label>页面链接</label>
                <input type="text" v-model="Url">
              </div>
              <div class="btns">
                <button @click="saveMenu">保存</button>
              </div>
            </div>
            <div class="have have-url" v-show="haveUrl">
              <div class="remarks">读者点击该菜单时会跳转至以下链接</div>
              <div class="input">
                <a :href="currentUrl" target="_blank">{{currentUrl}}</a>
              </div>
              <div class="btns">
                <button @click="editUrl">修改</button>
                <button @click="deleteUrl" class="delete">删除</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--<div class="bottom"></div>-->
    </div>
    <div class="btns-group">
      <button class="publish" @click="submitMenu">发布</button>
      <!--<button class="publish"><a target="_blank" href="http://10.143.132.242:8090/dist/weiwang/index.html">创建</a></button>-->
      <button class="cancel">取消</button>
    </div>
    <div class="loading" v-show="isSubmiting"><i class="el-icon-loading"></i></div>
  </div>
</template>

<script>
  import {config} from "../router/httpConfig.js"

  export default {
    name: "",
    data() {
      return {
        sideMenuGetOver:0,
        isSubmiting:1,
        haveChild:0,
        radio: '1',
        haveUrl:0,
        input: '',
        sideMenu: [],
        showUrlEdit:0,
        currentIndex:0,
        currentParentIndex:0,
        Url:'',
        currentUrl:'',
        isHaveNull:0
      }
    },
    methods: {
      //增加一级栏目
      addParentMenu(){
        if(this.sideMenu.length>2){
          this.$alert('一级菜单已经达到最大限度', '提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.$message({
                type: 'info',
                message: `action: ${ action }`
              });
            }
          });
        }
        else {
          var that = this;
          this.$prompt('', '请输入菜单名称', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            // inputErrorMessage: '该级菜单不能大于8个汉字或16个字符',
            inputValidator:function (val) {
              for(var i=0;i<that.sideMenu.length;i++){
                if(val==that.sideMenu[i].name){
                  return '该名称已存在！'
                }
              }
              if(!val){
                return '名称不能为空'
              }
              else if(val.length>16){
                return '该级菜单不能大于8个汉字或16个字符'
              }
              else {
                return true
              }
            },
          }).then(({value}) => {
            var obj = {
              name: value,
              subMenuList: [],
              url:''
            }
            this.sideMenu.push(obj)
            this.currentIndex = this.sideMenu.length-1;
            this.currentParentIndex = undefined;
            this.showUrlEdit = 1;
            this.haveUrl =0;
            this.Url = '';
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消输入'
            });
          });
        }
      },
      // 增加二级栏目或者编辑一级栏目
      addChildMenu(isEdit,index) {
        var inputVal = '';
        if (isEdit == 0) {
          if(this.sideMenu[index].url==''){
            if( this.sideMenu[index].subMenuList.length>4){
              this.$alert('该一级菜单下的二级菜单已到达最大限度', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  this.$message({
                    type: 'info',
                    message: `action: ${ action }`
                  });
                }
              });
            }
            else {
              var that = this;
              this.$prompt('', '请输入菜单名称', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputValue: inputVal,
                // inputErrorMessage: '该级菜单不能大于8个汉字或16个字符'
                inputValidator:function (val) {
                  for(var i=0;i<that.sideMenu[index].subMenuList.length;i++){
                    if(val==that.sideMenu[index].subMenuList[i].name){
                      return '该名称已存在！'
                    }
                  }
                  if(!val){
                    return '名称不能为空'
                  }
                  else if(val.length>16){
                    return '该级菜单不能大于8个汉字或16个字符'
                  }
                  else {
                    return true
                  }
                },
              }).then(({value}) => {
                this.$message({
                  type: 'success',
                  message: '你设置的菜单名称: ' + value
                });
                var obj = {
                  name: value,
                  subMenuList: [],
                  url:''
                }
                this.sideMenu[index].subMenuList.push(obj)
                this.currentParentIndex = index;
                this.currentIndex = this.sideMenu[index].subMenuList.length-1;
                this.Url = '';
                this.currentUrl = '';
                this.haveChild = 0;
                this.showUrlEdit = 1;
                this.haveUrl = 0;
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '取消输入'
                });
              });
            }
          }else {
            this.$alert('该菜单已有连接，无法添加子菜单', '提示', {
              confirmButtonText: '确定',
              callback: action => {
                this.$message({
                  type: 'info',
                  message: `action: ${ action }`
                });
              }
            });
          }
        }
        else {
          var that = this;
          inputVal = this.sideMenu[index].name;
          this.$prompt('', '请输入菜单名称', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputValue: inputVal,
            inputValidator:function (val) {
              if(val!=inputVal&&val!=''){
                for(var i=0;i<that.sideMenu.length;i++){
                  if(val==that.sideMenu[i].name){
                    return '该名称已存在！'
                  }
                }
              }
              if(!val){
                return '名称不能为空'
              }
              else if(val.length>16){
                return '该级菜单不能大于8个汉字或16个字符'
              }
              else {
                return true
              }

            },
          }).then(({value}) => {
            this.$message({
              type: 'success',
              message: '你设置的菜单名称: ' + value
            });
            this.sideMenu[index].name = value;
            this.currentIndex = index;
            this.currentParentIndex = undefined;
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消输入'
            });
          });
        }
      },
      // 删除栏目
      deleteMenu(index, parentIndex) {
        this.$confirm('删除后该菜单下的设置将不会保留', '删除确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true,
        }).then(() => {
          if (parentIndex == undefined) {
            this.currentParentIndex = undefined;
            this.sideMenu.splice(index, 1)
            if(this.sideMenu.length==0){
              this.currentIndex = 0;
              this.showUrlEdit=0;
              this.haveUrl = 0;
              this.currentUrl = this.Url = null;
            }
            else {
              this.currentIndex = this.sideMenu.length-1;
              this.currentUrl = this.Url = this.sideMenu[this.currentIndex].url;
            }
            this.currentParentIndex = undefined;
          }
          else{
            this.currentParentIndex = parentIndex;
            this.sideMenu[parentIndex].subMenuList.splice(index, 1)
            if(this.sideMenu[parentIndex].subMenuList.length==0){
              this.currentIndex = parentIndex;
              this.currentParentIndex = undefined;
              this.currentUrl = this.Url = this.sideMenu[this.currentIndex].url;
              this.showUrlEdit = 1;
              this.haveUrl = 0;
              this.haveChild = 0;
            }
            else {
              this.currentIndex = 0;
              this.currentUrl = this.Url = this.sideMenu[this.currentParentIndex].subMenuList[this.currentIndex].url;
              if(this.currentUrl!=''){
                this.haveUrl = 1;
                this.showUrlEdit = 0;
              }
            }

          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });


      },
      // 点击栏目
      clickItem(index,parentIndex){
        this.currentIndex = index;
        this.currentParentIndex = parentIndex;
        if(parentIndex==undefined){
          if(this.sideMenu[index].subMenuList==0){
            this.currentUrl = this.sideMenu[index].url;
            this.haveChild = 0;
            this.Url = this.sideMenu[index].url;
            if(this.sideMenu[index].url==''){
              this.showUrlEdit = 1;
              this.haveUrl = 0;
            }
            else {
              this.showUrlEdit = 0;
              this.haveUrl = 1;
            }
          }
          else {
            this.haveChild = 1;
            this.showUrlEdit = 0;
            this.haveUrl = 0;
          }
        }
        else {
          this.currentUrl = this.sideMenu[parentIndex].subMenuList[index].url;
          this.Url = this.sideMenu[parentIndex].subMenuList[index].url;
          this.haveChild = 0;
          if(this.sideMenu[parentIndex].subMenuList[index].url==''){
            this.showUrlEdit = 1;
            this.haveUrl = 0;
          }
          else {
            this.showUrlEdit = 0;
            this.haveUrl = 1;
          }
        }
      },
      // 判断连接是否为空和清除id
      filterNull(arr){
        for (let i = 0; i < arr.length; i++) {
          if(arr[i].subMenuList){
            if(arr[i].subMenuList.length>0){
              arr[i].id='';
              this.filterNull(arr[i].subMenuList);
            }else{
              arr[i].id='';
              if(arr[i].url==''&&arr[i].subMenuList.length<1){
                this.isHaveNull = 1;
                break;
              }
            }
          }
          else {
            arr[i].id='';
            if(arr[i].url==''&&!arr[i].subMenuList){
              this.isHaveNull = 1;
              break;
            }
          }
        }
      },
      // 发布
      submitMenu(){
        this.filterNull(this.sideMenu)
        if(this.isHaveNull){
          this.$alert('连接填完请选择保存！', '错误提示', {
            confirmButtonText: '确定',
          });
          return false;
        }
        this.isSubmiting= 1;
          var json = JSON.stringify(this.sideMenu)
          this.$http({
            url: config.submitCustomMenu,
            method:'post',
            data: {
              menus:json
            },
          }).then((res) => {
            this.isSubmiting= 0;
            this.$alert('发布成功！', '提示', {
              confirmButtonText: '确定'
            });
          }).catch(function (err) {
            // console.log(err)
          })
      },
      // 修改url
      editUrl(){
        this.Url =this.currentUrl;
        this.showUrlEdit = 1;
        this.haveUrl = 0;
      },
      // 删除url
      deleteUrl(){
        this.$confirm('确定删除该连接?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.Url = '';
          this.haveUrl = 0;
          this.showUrlEdit = 1;
          if(this.currentParentIndex==undefined){
            this.sideMenu[this.currentIndex].url = '';
          }
          else {
            this.sideMenu[this.currentParentIndex].subMenuList[this.currentIndex].url = '';
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      // 编辑二级栏目
      editChild(index,parentIndex){
        var inputVal = this.sideMenu[parentIndex].subMenuList[index].name;
        var that = this;
        this.$prompt('', '请输入菜单名称', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: inputVal,
          inputValidator:function (val) {
            if(inputVal!=val&&val!=''){
              for(var i=0;i<that.sideMenu[parentIndex].subMenuList.length;i++){
                if(val==that.sideMenu[parentIndex].subMenuList[i].name){
                  return '该名称已存在！'
                }
              }
            }
            if(!val){
              return '名称不能为空'
            }
            else if(val.length>16){
              return '该级菜单不能大于8个汉字或16个字符'
            }
            else {
              return true
            }
          },
        }).then(({value}) => {
          this.$message({
            type: 'success',
            message: '你设置的菜单名称: ' + value
          });
          this.currentParentIndex = parentIndex;
          this.currentIndex = index;
          this.sideMenu[parentIndex].subMenuList[index].name = value;
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      },
      // 保存连接
      saveMenu(){
        if(this.Url==''){
          this.$alert('连接不能为空！', '提示', {
            confirmButtonText: '确定',
            callback: action => {
            }
          });
        }
        else {
          // if(this.Url.indexOf('mp.yd-data.com')>-1){
            this.isHaveNull = 0;
            this.currentUrl = this.Url;
            this.haveUrl = 1;
            this.showUrlEdit = 0;
            if(this.currentParentIndex==undefined){
              this.sideMenu[this.currentIndex].url = this.Url;
            }
            else {
              this.sideMenu[this.currentParentIndex].subMenuList[this.currentIndex].url = this.Url;
            }
          // }
          // else {
          //   this.$message.error('链接需在（http://mp.yd-data.com或https://mp.yd-data.com）域名下');
          // }
        }
      },
      //保存微网连接
      saveMicrogridMenu(){
        if(sessionStorage.getItem('caseId')&&sessionStorage.getItem('caseId')!='null'){//判断是否有需要保存的menu
          var obj = {
            name: sessionStorage.getItem('templateName'),
            subMenuList: [],
            url:''
          }
          this.$http({
            url:config.microgridGetCaseDetail,
            params:{
              case_id:sessionStorage.getItem('caseId'),
              create_id:this.$store.state.userInfo.id
            }
          }).then((res)=>{
            for(var i=0;i<res.data.length;i++){
              var obj2 = {
                name:res.data[i].name,
                subMenuList:[],
                url:config.mobileViewUrl+'?pageId='+res.data[i].id
              }
              obj.subMenuList.push(obj2)
            }
            this.sideMenu.push(obj)
            sessionStorage.setItem('caseId',null)
            sessionStorage.setItem('templateName',null)
          })
        }
      }
    },
    created(){
      // var that = this;
      // var timer = setInterval(function () {
      //   if(that.$store.state.userInfo.id&&that.sideMenuGetOver){
      //     clearInterval(timer)
      //    that.saveMicrogridMenu()
      //   }
      // },1000)
    },
    beforeCreate(){
      this.$http({
        url: config.customGetList,
        data: {},
      }).then((res) => {
        this.isSubmiting = 0;
        this.sideMenu = res.data.data;
        if(this.sideMenu.length>0){
          if(this.sideMenu[0].subMenuList.length==0){
            this.currentParentIndex = undefined;
            if(this.sideMenu[0].url!=''){
              this.haveUrl = 1;
              this.currentUrl = this.sideMenu[0].url;
            }
            else {
              this.showUrlEdit = 1;
            }
          }
          else {
            if(this.sideMenu[0].subMenuList[0].url!=''){
              this.haveUrl = 1;
              this.currentUrl = this.sideMenu[0].subMenuList[0].url;
            }
            else {
              this.showUrlEdit = 1;
            }
          }
        }
        this.sideMenuGetOver = 1;
      }).catch(function (err) {
        // console.log(err)
      })
    }
  }
</script>
<style scoped>
  .loading{
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    background-color: rgba(0,0,0,.4);
    color: #ff353a;
    z-index: 9999999;
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

  .custom-body {

    background-color: #fff;
    padding: 20px 40px;
  }

  .custom-body .tip {
    margin: 0 0 12px;
    color: #999;
    font-size: 14px;
  }

  .custom-body-main {
    width: 100%;
    overflow: hidden;
    height: 480px;
    border: 1px solid #e8e8e8;
  }

  .custom-body-main .top {
    width: 100%;
    height: 480px;
    /*border: 1px solid #e8e8e8;*/
    /*display: -webkit-box;*/
    /*display: -webkit-flex;*/
    /*display: -moz-box;*/
    /*display: -ms-flexbox;*/
    /*display: flex;*/
  }

  .custom-body-main .left {
    width: 226px;
    /*min-width: 226px;*/
    float: left;
    height: 100%;
    border-right: 1px solid #e8e8e8;
    background: #f9f9f9;
    overflow-y: auto;
  }

  .custom-body-main .right {
    width: 673px;
    height: 100%;
    overflow: hidden;
    float: right;
  }

  .custom-body-main .right .none {
    color: #999;
    padding: 20px 0 0 22px;
    font-size: 14px;
    /*display: none;*/
  }

  .custom-body-main .right .radio ,.custom-body-main .right .have-url .remarks{
    margin: 50px 0 10px 50px;
  }
  .custom-body-main .right .have-url .input a{
    color: #406599;
    width: 100%;
    white-space: normal;
    word-wrap:break-word;
  }

  .custom-body-main .right .remarks {
    color: #999;
    padding: 0 0 15px;
    margin: 0 0 30px 50px;
  }

  .custom-body-main .right .input {
    overflow: hidden;
    margin-left: 50px;
    margin-right: 50px;
    /*padding-left: 80px;*/
    display: -webkit-flex;
    display: -webkit-box;
    display: flex;
  }

  .custom-body-main .right .btns {
    text-align: center;
    margin-top: 30px;
  }

  .custom-body-main .right .btns button {
    width: 98px;
    cursor: pointer;
    display: inline-block;
    text-align: center;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    border-radius: 3px;
    line-height: 32px;
    margin-right: 24px;
    color: #f85959;
    background: #fff;
    border: 1px solid #f85959;
    cursor: pointer;
    outline: none;
  }
  .custom-body-main .right .btns button.delete{
    border-color: #999;
    color: #999;
  }
  .custom-body-main .right .input label {
    line-height: 40px;
    float: left;
    min-width: 80px;
    white-space: nowrap;
  }

  .custom-body-main .right .input input {
    display: block;
    width: 100%;
    height: 40px;
    font-size: 15px;
    text-indent: 17px;
    border: 1px solid #d9d9d9;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
  }

  .custom-body-main .right .have-child {
    color: #999;
    padding: 20px 0 0 22px;
    font-size: 14px;

  }

  .custom-body-main .bottom {
    background: #f9f9f9;
    color: #222;
    font-size: 14px;
    line-height: 38px;
    border-top: 1px solid #e8e8e8;
    text-align: center;
  }

  .custom-body-main .bar, .custom-body-main .item {
    display: block;
    font-size: 14px;
    color: #222;
    line-height: 50px;
    /*height: 50px;*/
    padding-left: 20px;
    border-bottom: 1px solid #e8e8e8;
  }

  .custom-body-main .item{
    border-bottom: none;
    height: 50px;
    vertical-align: top;
  }
  .custom-body-main .item:hover .icons{
    display: block !important;
  }
  .custom-body-main .left .icons .icon{
    float: right;
    position: relative;
  }
  .custom-body-main .left .icons-none .icons {
    display: none;
  }
  .custom-body-main .left .icons-none .name{
    color: #999;
  }
  .custom-body-main .left .icons-none:hover .icons {
    display: block;
  }

  .custom-body-main .left dl .item {
    padding-left: 40px;
  }

  .custom-body-main .left li {
    border-bottom: 1px solid #e8e8e8;
  }
  .custom-body-main .left .bar i{
    color: #999;
  }
   .custom-body-main .left .item i {
    float: right;
    line-height: 50px;
    margin: 0 7px;
    cursor: pointer;
    color: #999;
     position: relative;
  }
  .custom-body-main .left .item .icon:hover .hover{
    display: block;
  }
  .custom-body-main .left .item .hover{
    position: absolute;
    width: 60px;
    line-height: 40px;
    height: 40px;
    background-color: #ffffff;
    z-index: 2;
    font-size: 14px;
    text-align: center;
    top: -30px;
    right: 0;
    -webkit-box-shadow: 0 0 8px rgba(99,99,99,.2);
    -moz-box-shadow: 0 0 8px rgba(99,99,99,.2);
    box-shadow: 0 0 8px rgba(99,99,99,.2);
    display: none;
    color: #222;
  }
  .custom-body-main .left .name {
    float: left;
    width: 100px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: pointer;
  }

  .custom-body-main .left .icons {
    float: right;
  }

  .btns-group {
    text-align: center;
    margin-top: 40px;
  }

  .btns-group .publish {
    height: 50px;
    line-height: 50px;
    width: 140px;
    font-size: 16px;
    margin-right: 24px;
    cursor: pointer;
    display: inline-block;
    color: #fff;
    background-color: #f85959;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
    border: 1px solid #f85959;
  }
  .btns-group .publish a{
    color: #fff;
    text-decoration: none;
    display: block;
    width: 100%;
    height: 100%;
    line-height: 50px;
    text-align: center;
  }
  .btns-group .cancel {
    height: 50px;
    line-height: 50px;
    width: 140px;
    font-size: 16px;
    margin-right: 24px;
    cursor: pointer;
    display: inline-block;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
    border: 1px solid #e8e8e8;
    background-color: #f9f9f9;
    color: #222;
    opacity: 1;
  }
</style>
