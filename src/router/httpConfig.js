const _hot = '';//本地测试
const microRoute = '';//微网测试api
const microUrl ='http://mp.yd-data.com';//微网跳转正式地址
const config = {
  getSideNav:_hot+'/pluginList',//获取左边菜单
  baseUrl:_hot+'/baseUser ',//获取用户信息以及上下文
  newDdd: _hot+ '/ydmedia/eventPolicy/save',//新增
  queryList:_hot+'/ydmedia/eventPolicy/findList',//查询列表
  replyType:_hot+'/ydmedia/dict/replyEvent',//回复事件
  userType:_hot+'/ydmedia/dict/userType',//用户类型
  userStatus:_hot+'/ydmedia/dict/userStatus',//用户状态
  deleteData:_hot+'/ydmedia/eventPolicy/del',//删除数据
  idQuery:_hot+'/ydmedia/eventPolicy/get',//通过id查询列表
  postText:_hot+'/ydmedia/content/save',//发文章
  draftUrl:_hot+'/ydmedia/content/getManuscript',//查草稿
  deleteDraft:_hot+'/ydmedia/content/delManuscript',//删除草稿
  uploadUrl:'/a/material/uploadAll',//上传文件（媒资）
  globalUrl:_hot+'/ydmedia/application/get',//全局域名
  columnUrl:'a/Comuln/findList?type=1',//栏目 两微一端
  getAtlasUrl:_hot+'/ydmedia/content/save',//发图集
  materialUrl:_hot+'/ydmedia/material/findList',//素材列表查询
  materialAddUrl:_hot+'/ydmedia/material/save',//添加素材
  deleteMaterial:_hot+'/ydmedia/material/del',//删除素材
  findAllVote:_hot+'/ydmedia/vote/findList',//查找所有投票
  menuGetyds:_hot+'/ydmedia/menu/getyds',//菜单分析昨日指标
  menuGetys:_hot+'/ydmedia/menu/getvs',//菜单分析获取版本
  menuCharts:_hot+'/ydmedia/menu/analysis',//数据分析图表
  menuTableAnalysis:_hot+'/ydmedia/menu/getStatistics',//数据分析表格
  voteDetails:_hot+'/ydmedia/vote/get',//投票详情
  addVote:_hot+'/ydmedia/vote/add',//新增投票
  deleteVote:_hot+'/ydmedia/vote/delete',//删除投票
  stopVoteUrl:_hot+'/ydmedia/vote/stopVote',//停止投票
  publishVoteUrl:_hot+'/ydmedia/vote/votePublish',//发布投票
  uploadPicture:'/mediaAssets/uploadFile',//上传文件
  commentsListUrl:'a/contentApi/findCommentsList',//评论列表
  deletCommentsUrl:'a/contentApi/updateComment',//加精/加荐/删除评论
  userUrl:_hot+'/getUser',//获取用户信息
  auditCommentsUrl:'/a/contentApi/auditCommentForAuthor',//审核评论
  notAuditUrl:'/a/contentApi/countUnauditedComments',//未审核数
  getH5Url:_hot+'/ydmedia/application/votePath',
  contentListUrl:'a/contentApi/findListByAuditStatus',//内容管理列表
  withdrawContenUrl:'/a/contentApi/dropContent',//撤回 删除内容
  atlasContentUrl:'a/contentApi/findList',//内容管理图集列表
  // graphicDetailsUrl:'a/contentApi/getBy',//图文详情
  graphicDetailsUrl:'admin/content/get/',//图文详情
  atlasDetailsUrl:'a/content/findImgsList',//图集详情
  amendUrl:'a/content/save',//发布修改图文
  submitCustomMenu:_hot+'/ydmedia/menu/save',//保存自定义菜单
  customGetList:_hot+'/ydmedia/menu/getMenu',//获取菜单
  homePge:'a/statistic/userRelation',//主页用户管理
  getUserInfo:_hot+'/getUser',//获取用户信息
  getNotice:_hot+'/ydmedia/notice/findList',//获取公告
  changeUserName:_hot+'/user/modify',//修改用户昵称和简介
  getUserCodeUrl:_hot+'/user/qrcode',//获取用户二维码
  downloadCode:_hot+'/user/qrcode/download',//下载用户二维码
  voteDomainName:_hot+'/ydmedia/application/votePath',//获取投票域名
  tallyUrl:'a/coreColumnTags/page',//标签
  contentSerchUrl:'a/userApi/searchForHtml',//内容管理搜索
  changeEmail:_hot+'/modify/email',//系统管理修改邮箱
  logingLog:_hot+'/user/sys/log',//系统管理安全中心登录日志
  sensitiveLog:_hot+'/sensitiveLog',//系统管理安全中心敏感日志
  oldMobileGetCodeUrl:_hot+'/mobile/sendCode',//原手机号获取验证码
  newMobileGetCodeUrl:_hot+'/mobile/sendCode',//原手机号获取验证码
  judegOldMobileUrl:_hot+'/validCode',//验证原手机号
  newMobileBind:_hot+'/modify',//新手机验证码验证
  saveWatermarkUrl:_hot+'/setWatermark',//设置是否保存水印
  fansListUrl:'/a/userApi/getFollowerListWithFollowState',//个人中心粉丝列表
  sexRatioUrl:'/a/userApi/genderRatio',//个人中心男女占比
  platformRatioUrl:'/a/userApi/platformRatio',//粉丝平台占比
  fansAttentionUser:'/a/userApi/attentionUser',//粉丝关注
  userFansStatistic:'/a/statistic/userFansStatistic',//时间段内的用户粉丝统计
  fansRankUrl:'/a/userApi/fansRank',//粉丝排行榜
  fansIncrease:'/a/userApi/fansIncrease',//粉丝概况昨日指标
  watermarkImg:'a/material/fontWater',//发头条上传图片（媒资）
  uerTypeUrl:'/a/appUserType/getUserTypeList',//用户权限
  voteTemplateUrl:_hot+'/ydmedia/vote/template',//获取投票模板选择
  logOutUrl:'http://mp.yd-data.com/',//生产退出系统
  // logOutUrl:'http://47.104.188.193/',
  // logOutUrl:'http://10.143.132.205:8090/',//242退出系统
  jimInit:'/a/wxApi/getIMSignature',//
  JIMRegist:'/a/jiguang/registIm',//仁寿
  Jimparameter:{
    AppKey: '49f0bb42891ebba29a84f30f',
    MasterSecret:'74ea2857afe28514bff6de6f'
  },//仁寿JIM appkey
  // gulinJimparameter:{
  //   AppKey: 'be4682d6ffe1851c4c7c03c1',
  //   MasterSecret:'fb9352383619e54000437b7b'
  // },//古蔺JIM appkey
  // fushunJimparameter:{
  //   AppKey: 'ad1dad3cd2fb7e2cab3391bf',
  //   MasterSecret:'d7b1c1e22f930a74fa27768a'
  // }//富顺JIM appkey
  // xuanhanJimparameter:{
  //   AppKey: '87f141d09563d34ad55ab3e0',
  //   MasterSecret:'cba0c7a8b5266e12a7d9177a'
  // }//富顺JIM appkey
  base64Url:'a/material/baseToPic',//base64图片转换
  textDocuments:_hot+'/ydmedia/content/upload',//文档导入
  platformWeixinGet:_hot+'/ydmedia/externalPlug/findList',//第三方微信查询
  platformWeixinSave:_hot+'/ydmedia/externalPlug/save',//第三方微信保存
  platformType:_hot+'/ydmedia/externalPlug/getType',//获取第三方平台
  platformGetTypeOfPlug:_hot+'/ydmedia/externalPlug/getTypeOfPlug',
  microgridUrl:microUrl+'/dist/weiwang/index.html',//微网地址
  mobileViewUrl:microUrl+'/dist/mobileView/index.html#/',//微网预览地址
  microFormGetMenu:microRoute+"/student?serviceName=getFormBase",//获取表单提交
  microFormGet:microRoute+"/student?serviceName=getCaseForm",//获取选中线索数据
  urlBase64:_hot+'/ydmedia/content/imgToBase',//图片转base64
  exportUrl:_hot+'/ydmedia/vote/report?',//导出投票结果
  rename:_hot+'/ydmedia/material/rename',//修改素材名
};
//课程管理
const curriculumUrl='';
const curriculum={
  curriculumList:curriculumUrl+'/news-train/a/coreCatalogueContent/findCatalogueContentByCatalogueContentEntity',//课程列表
  updateCheckStatusById:curriculumUrl+'/news-train/a/coreCatalogueContent/updateCheckStatusById',//操作栏 提交
  updateUpDownStatusById:curriculumUrl+'/news-train/a/coreCatalogueContent/updateUpDownStatusById',//上下架 0待上架,1上架,2下架',
  delet:curriculumUrl+'/news-train/a/coreCatalogueContent/delCatalogueContentBatch',//删除课程
  findCourseListByLectureId:curriculumUrl+'/news-train/a/coreCourse/findCourseListByLectureId',//关联课程
  saveCourseContent:curriculumUrl+'/news-train/a/coreCourse/saveCourseContent',//保存 提交
};
export {config,curriculum};
// export default config;
