import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import count from '@/components/count'
import headHead from '@/components/head-head'
import navLeft from '@/components/nav-left'
import contentList from '@/components/content-list'
import editorAlert from '@/components/editor-alert'
import fatoutiao from '@/components/faTouTiao/index'
import userAnakysis from '@/components/user-analysis'//用户分析
import menuAnakysis from '@/components/menu-analysis'//菜单分析
import editorText from '@/components/faTouTiao/editorText'
import customMenu from '@/components/custom-menu'//自定义菜单
import initCustomMenu from '@/components/custom-menu-child'
import tuji from '@/components/faTouTiao/atlas'
import votingManagement from '@/components/votingManagement'//投票管理
import votingDetails from '@/components/vote-details'//投票详情
import votingCreat from '@/components/vote-creat'//新建投票
import sucai from '@/components/sucai/index'
import commentManagement from '@/components/commentIndex'//评论管理
import commentImageText from '@/components/commentImageText'//评论管理图文
import homePage from '@/components/homePage'//主页
import content from '@/components/content/index'//内容管理
import vote from '@/components/faTouTiao/vote' //发头条投票管理
import systemManagement from '@/components/systemManagement/index'//系统管理
import account from '@/components/systemManagement/account'//系统管理账号设置
import addWatermark from '@/components/systemManagement/addWatermark'//系统管理添加水印
import blackList from '@/components/systemManagement/blackList'//系统管理黑名单
import safety from '@/components/systemManagement/safety'//系统管理安全中心
import consultation from '@/components/systemManagement/consultation'//系统管理在线咨询
import community from '@/components/systemManagement/community'//系统管理用户社区
import myFans from '@/components/myFans/index'//个人中心
import fansSurvey from '@/components/myFans/fansSurvey'//个人中心粉丝管理
import fansPortrait from '@/components/myFans/fansPortrait'//个人中心粉丝画像
import fansList from '@/components/myFans/fansList'//个人中心粉丝列表
import fansRank from '@/components/myFans/fansRank'//个人中心粉丝完整榜单
import dialogBox  from '@/components/dialogBox'//私信
import index from '@/components/index'
import platform from '@/components/thirdPlatform/index'
import platformWeixin from '@/components/thirdPlatform/weixin'
import fatoutiaoVideo from '@/components/faTouTiao/video'//发头条小视频
import showForm from '@/components/showForm'
import fatoutiaoCropper from '@/components/faTouTiao/cropper'//发头条图片裁剪
import kechengguanli from '@/components/kechengguanli/index'//课程管理
Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      name: 'index',
      component: index,
      redirect:'/homePage',
      children:[
        {
          path:'/showForm',
          name: 'showForm',
          component: showForm
        },
        {
          path: '/platform',
          name: 'platform',
          component: platform
        },
        {
          path: '/autoReply',
          name: 'HelloWorld',
          component: HelloWorld
        },
        {
          path: '/homePage',
          name: 'homePage',
          component: homePage
        },
        {
          path: '/dialogBox',
          name: 'dialogBox',
          component: dialogBox
        },
        {
          path: '/votingManagement',
          name: 'votingManagement',
          component: votingManagement
        },
        {
          path: '/votingDetails/:id',
          name: 'votingDetails',
          component: votingDetails
        },
        {
          path: '/votingCreat/:id',
          name: 'votingCreat',
          component: votingCreat
        },
        {
          path: '/myFans',
          name: 'myFans',
          component: myFans,
          redirect: '/myFans/fansSurvey',
          children: [
            {
              path: 'fansSurvey',
              name: 'fansSurvey',
              component: fansSurvey
            }, {
              path: 'fansPortrait',
              name: 'fansPortrait',
              component: fansPortrait
            },{
              path: 'fansList',
              name: 'fansList',
              component: fansList
            }
          ]
        },
        {
          path: '/fansRank',
          name: 'fansRank',
          component: fansRank
        },
        {
          path: '/systemManagement',
          name: 'systemManagement',
          component: systemManagement,
          redirect: '/systemManagement/account',
          children: [
            {
              path: 'account',
              name: 'account',
              component: account
            }, {
              path: 'addWatermark',
              name: 'addWatermark',
              component: addWatermark
            }, {
              path: 'blackList',
              name: 'blackList',
              component: blackList
            }, {
              path: 'account',
              name: 'account',
              component: account
            }, {
              path: 'safety',
              name: 'safety',
              component: safety
            }, {
              path: 'consultation',
              name: 'consultation',
              component: consultation
            },{
              path: 'community',
              name: 'community',
              component: community
            }
          ]
        },
        {
          path: '/customMenu',
          name: 'customMenu',
          component: customMenu,
          redirect: '/customMenu/initMenu',
          children: [
            {
              path: 'initMenu',
              name: 'initMenu',
              component: initCustomMenu
            },{
              path: 'initMenu2',
              name: 'initMenu2',
              component: initCustomMenu
            }
          ]
        },
        {
          path: '/commentManagement',
          name: 'commentManagement',
          component: commentManagement,
          redirect: '/commentManagement/commentImageText',
          children: [
            {
              path: 'commentImageText',
              name: 'commentImageText',
              component: commentImageText
            },
            {
              path: 'commentImageText2',
              name: 'commentImageText2',
              component: commentImageText
            },
            {
              path: 'commentImageText3',
              name: 'commentImageText3',
              component: commentImageText
            },
            {
              path: 'commentImageText4',
              name: 'commentImageText4',
              component: commentImageText
            },{
              path: 'commentImageText5',
              name: 'commentImageText5',
              component: commentImageText
            }
          ]
        },
        {
          path: '/menuAnakysis',
          name: 'menuAnakysis',
          component: menuAnakysis
        },
        {
          path: '/useranakysis',
          name: 'userAnakysis',
          component: userAnakysis
        },
        {
          path: '/count',
          name: 'count',
          component: count
        },
        {
          path: '/head-head',
          name: 'headHead',
          component: headHead
        },
        {
          path: '/nav-left',
          name: 'navLeft',
          component: navLeft
        },
        {
          path: '/content-list',
          name: 'contentList',
          component: contentList
        },
        {
          path: '/faTouTiao/index',
          name: 'fatoutiao',
          component: fatoutiao
        },
        {
          path: '/editor-alert',
          name: 'editorAlert',
          component: editorAlert
        },
        {
          path: '/faTouTiao/editorText',
          name: 'editorText',
          component: editorText
        },
        {
          path: '/faTouTiao/atlas',
          name: 'tuji',
          component: tuji
        },
        {
          path: '/sucai/index',
          name: 'sucai',
          component: sucai
        },
        {
          path: '/content/index',
          name: 'content',
          component: content
        },
        {
          path: '/faTouTiao/vote',
          name: 'vote',
          component: vote
        },
        {
          path: '/faTouTiao/cropper',
          name: 'fatoutiaoCropper',
          component: fatoutiaoCropper
        },
        {
          path: '/kechengguanli/index',
          name: 'kechengguanli',
          component: kechengguanli
        },
      ]
    },
    // {
    //   path: '/kechengguanli/index',
    //   name: 'kechengguanli',
    //   component: kechengguanli
    // },
  ]
})
