<template>
  <div class="vote" id="vote" :style="{minHeight:minHeight+'px'}">
    <!--<h2>投票管理</h2>-->
    <div class="table">
      <div class="table-bar">
        <button @click="creatVote" v-show="tableData.length!=0">新建投票</button>
      </div>
      <template>
        <el-table
          :data="tableData"
          v-show="!noData&&!isLoading"
          style="width: 100%">
          <el-table-column
            prop="title"
            label="投票名称"
          >
          </el-table-column>
          <el-table-column
            prop="personNum"
            align="right"
            label="投票人数"
            width="230">
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            width="180"
          >
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            align="right"
            prop="isPublish"
            width="280">
            <template slot-scope="scope">
              <el-button @click="copyUrl(scope.$index, scope.row)" type="text" size="small">复制链接</el-button>
              <el-button @click="copyShareUrl(scope.$index, scope.row)" type="text" size="small">分享链接</el-button>
              <el-button v-if="scope.row.status=='未发布'" @click="publishVote(scope.$index, scope.row)" type="text"
                         size="small">发布
              </el-button>
              <el-button v-if="scope.row.status=='进行中'" @click="stopVote(scope.$index, scope.row)" type="text"
                         size="small">停止
              </el-button>
              <el-button v-if="scope.row.isPublish==1" @click="seeDetails(scope.$index, scope.row,1)" type="text"
                         size="small">详情
              </el-button>
              <el-button v-if="scope.row.status=='未发布'" @click="seeDetails(scope.$index, scope.row,2)" type="text"
                         size="small">编辑
              </el-button>
              <el-button v-if="scope.row.status=='已截止'||scope.row.status=='已停止'"
                         @click="exportData(scope.$index, scope.row)" type="text" size="small">导出
              </el-button>
              <el-button v-if="scope.row.status!='进行中'" @click="deleteRows(scope.$index, scope.row)" type="text"
                         size="small">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="text-align: center;"
          background
          v-show="total>10"
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :total="total">
        </el-pagination>
      </template>
    </div>
    <div class="no-vote" v-show="noData&&!isLoading">
      <img src="../../static/images/no-data.png" alt="">
      <div>暂无投票，请先创建 <span @click="creatVote">创建投票</span></div>
    </div>
    <div class="loading" v-show="isLoading"><i class="el-icon-loading"></i></div>
    <el-dialog
      title="导出结果"
      top="40vh"
      :visible.sync="showExport"
      width="30%"
    >
      <el-radio v-model="exportType" label="1">按序号排序</el-radio>
      <el-radio v-model="exportType" label="2">按票数排序</el-radio>
      <span slot="footer" class="dialog-footer">
    <el-button @click="showExport = false">取 消</el-button>
    <a :href="exportUrl+'rule='+exportType+'&id='+currentVoteId" class="a-btn-paramy">确 定</a>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import {config} from "../router/httpConfig";

  export default {
    name: "",
    data() {
      return {
        exportType:'1',
        showExport: false,
        currentVoteId:'',
        noData: 0,
        minHeight: this.common.getWindowHeight(),
        total: 0,
        currentPage: 1,
        pageSize: 10,
        tableData: [],
        h5Url: '',
        userId: "",
        isLoading: 1,
        exportUrl:config.exportUrl,
        templateOptions:''
      }
    },
    methods: {
      // // 获取用户信息
      // getUserInfo(){
      //   this.$http({
      //     url:config.getUserInfo,
      //   }).then((res)=> {
      //     if(res.data.data.status==200){
      //       this.userId = res.data.data.id;
      //     }
      //   }).catch((err)=>{
      //   })
      // },
      //导出数据
      exportData(index, row) {
        this.showExport = true;
        this.currentVoteId = row.id;
      },
      // 停止投票
      stopVote(index, row) {
        var id = row.id;
        this.$confirm('停止之后再发布需重新创建投票, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$prompt('请输入停止投票原因', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputValidator: function (val) {
              if (!val) {
                return '原因不能为空'
              } else {
                return true
              }
            },
            inputErrorMessage: '原因不能为空'
          }).then(({value}) => {
            this.$http({
              url: config.stopVoteUrl + '?subjectId=' + id + '&des=' + value + '&createById=' + this.$store.state.userInfo.appbackId,
              method: 'post',
            }).then((res) => {
              if (res.data.status == 200) {
                this.tableData[index].status = '已停止'
                this.$message('已停止')
              } else {
                this.$message.error(res.data.message);
              }
            }).catch(function (err) {
            })
          }).catch(() => {
          });
        }).catch(() => {

        });


      },
      //发布投票
      publishVote(index, row) {
        var id = row.id;
        this.$confirm('发布之后将无法编辑，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: config.publishVoteUrl + '?id=' + id + '&isPublish=1',
          }).then((res) => {
            if (res.data.status == 200) {
              this.tableData[index].isPublish = 1;
              this.tableData[index].status = '进行中'
              this.$message({
                message: '发布成功',
                type: 'success'
              });
            } else {
              this.$message.error(res.data.message);
            }
          }).catch((err) => {
          })
        }).catch(() => {

        });
      },
      getRouterLink() {
        this.$http({
          url: config.getH5Url,
          method: 'get',
        }).then((res) => {
          this.h5Url = res.data.data.votePath;
        }).catch(function (err) {
        })
      },
      copyShareUrl(index,row){
        var id = row.id;
        var Url2 =this.h5Url.split('responseVote.html?id=')[0]+ row.shareUrl+'?id=' + id;
        var oInput = document.createElement('input');
        oInput.value = Url2;
        document.body.appendChild(oInput);
        oInput.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令
        oInput.className = 'oInput';
        oInput.style.display = 'none';
        this.$message({
          type: 'success',
          message: '复制成功！'
        });
      },
      copyUrl(index, row) {
        var id = row.id;
        var Url2 = this.h5Url + id;
        var oInput = document.createElement('input');
        oInput.value = Url2;
        document.body.appendChild(oInput);
        oInput.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令
        oInput.className = 'oInput';
        oInput.style.display = 'none';
        this.$message({
          type: 'success',
          message: '复制成功！'
        });
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getVoteList();
      },
      creatVote() {
        this.$router.push({
          path: `/votingCreat/-1`,
        })
      },
      seeDetails(index, row, flag) {
        var id = row.id;
        //详情
        if (flag == 1) {
          this.$router.push({
            path: `/votingDetails/${id}`,
          })
        }
        // 编辑
        else {
          this.$router.push({
            path: `/votingCreat/${id}`,
          })
        }
      },
      deleteRows(index, row) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var id = row.id;
          this.$http({
            url: config.deleteVote,
            data: {
              id: id
            },
            method: 'post',
          }).then((res) => {
            if (res.data.status == 200) {
              this.getVoteList()
              this.$message({
                type: 'success',
                message: res.data.message
              });
            } else {
              this.$message.error(res.data.message);
            }
          }).catch(function (err) {
          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      getVoteList() {
        this.isLoading = 1;
        this.$http({
          url: config.findAllVote + '?page=' + this.currentPage + '&pageSize=' + this.pageSize,
          method: 'get',
        }).then((res) => {
          this.isLoading = 0;
          if (res.data.data.records == 0) {
            this.noData = 1;
          } else {
            this.currentPage = res.data.data.page;
            this.tableData = res.data.data.rows;
            this.total = res.data.data.records;
            var myDate = new Date();
            var now = myDate.valueOf();
            for (var i = 0; i < this.tableData.length; i++) {
              for (var j in this.templateOptions){
                if (this.tableData[i].tempChoiceType==this.templateOptions[j].type){
                  this.tableData[i].shareUrl = this.templateOptions[j].shareUrl;
                }
              }
              var time = new Date(this.tableData[i].endDate).valueOf();
              if (this.tableData[i].isPublish) {
                if (now > time) {
                  this.tableData[i].status = '已截止';
                } else {
                  if (this.tableData[i].isStop) {
                    this.tableData[i].status = '已停止';
                  } else {
                    this.tableData[i].status = '进行中';
                  }

                }
              } else {
                this.tableData[i].status = '未发布';
              }

            }
          }

        }).catch(function (err) {

        })
      },
      //获取模板列表
      getTempList(){
        this.$http({
          url:config.voteTemplateUrl,
        }).then((res)=>{
          this.templateOptions = res.data.data;
          this.getRouterLink()
          this.getVoteList()
        }).catch(function(err){
        });
      }
    },
    created() {
      var that = this;
      var timer = setInterval(function () {
        if (that.$store.state.userInfo.appbackId) {
          clearInterval(timer)
          that.getTempList()
        }
      }, 1000)

    }
  }
</script>

<style scoped>
  .a-btn-paramy{
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background-color: #f85959;
    border: 1px solid #f85959;
    color: #ffffff;
    text-decoration: none;
    -webkit-appearance: none;
    text-align: center;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    transition: .1s;
    font-weight: 500;
    padding: 12px 20px;
    font-size: 14px;
    border-radius: 4px;
  }
  .no-vote {
    overflow: hidden;
    text-align: center;
    font-size: 16px;
    line-height: 30px;
    color: #999999;
  }

  .no-vote img {
    display: block;
    margin: 100px auto 0;
  }

  .no-vote span {
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

  .loading {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    position: fixed;
    /*padding:95px 20px 15px;*/
    background-color: rgba(0, 0, 0, .4);
    color: #ff353a;
    left: 0;
    top: 0;
    z-index: 9999999;
  }

  .loading .mask {
    width: 980px;
    height: 100%;
    position: relative;
  }

  .loading i {
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

  .no-vote img {
    display: block;
    width: 100px;
    margin: 100px auto 40px;
  }

  .no-vote p {
    text-align: center;
    font-size: 16px;
    color: #999;
    line-height: 40px;
  }

  .no-vote .creat-vote-btn {
    display: inline-block;
    vertical-align: middle;
    font-size: 12px;
    width: 80px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    background-color: rgb(248, 89, 89);
    color: #fff;
    border: none;
    margin-left: 10px;
    cursor: pointer;
    -webkit-border-radius: 6px;
    -moz-border-radius: 6px;
    border-radius: 6px;
  }

  .vote {
    /*padding: 30px*/
    box-sizing: border-box;
    padding-bottom: 40px;
    background-color: #ffffff;
    height: 100%;
  }

  h2 {
    color: #343434;
  }

  .table {
    width: 100%;
    min-height: 100%;
    position: relative;
    padding: 20px 20px 0;
    background-color: #fff;
    box-sizing: border-box;
    /*margin-top: 30px;*/
  }

  .table-bar {
    text-align: right;
    margin-bottom: 15px;
  }

  .table-bar button {
    width: 100px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    background-color: rgb(248, 89, 89);
    color: #fff;
    border: none;
    cursor: pointer;
  }

  .el-table {
    /*min-height: 500px;*/
    /*border-bottom: none;*/
  }

  .el-pagination {
    /*height: 80px;*/
    /*line-height:80px;*/
    /*box-sizing: border-box;*/
    /*padding-top: 30px;*/
    /*width: 100%;*/
    /*position: absolute;*/
    /*left: 0;*/
    /*bottom: 0px;*/
    /*background-color: #fff;*/
    margin-top: 25px;
  }
</style>
