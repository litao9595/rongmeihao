import Vue from 'vue'
import Vuex from  'vuex'
Vue.use(Vuex);
// import axios from "axios"
// Vue.prototype.$http=axios;
// import {config} from "../router/httpConfig.js"
// var state={
//   count:8,
//   category:'subscribe',
//   getListData:{},
// };
//
//
// const mutations={
//   add(state){
//     state.count++;
//   },
//   reduce(state){
//     state.count--;
//   },
//   listGet(state){
//     this.$http({
//       url:config.queryList,
//       data:{
//         name:'',
//         category:state.category,
//       }
//     }).then((res)=>{
//       // console.log(res)
//       state.getListData=res.data.data
//     }).catch(function(err){
//       // console.log(err)
//     });
//   }
// };
// actions:{
//   // 封装一个ajax方法
//
// };
const store = new Vuex.Store({
  state:{
    userInfo:{
    },
    appbackUrl:'',
    mediaAssetsUrl:'',
    leftUserList:[],
    httpData:{}
  },
  mutations:{
    // 设置用户信息
      setUserInfo(state,userInfo){
        state.userInfo = userInfo;
      },
    //获取两微一端地址
    setBaseUrl(state,appInfo){
      state.appbackUrl =  appInfo.appbackUrl;
      state.mediaAssetsUrl =  appInfo.mediaAssetsUrl;
      state.httpData= appInfo;
    },
    //修改信息
    changeUserInfo(state,info){
      state.userInfo.nickName = info.nickName;
      state.userInfo.remarks = info.remarks;
      state.userInfo.portrait = info.portrait;
    },
    //修改手机号
    changeTel(state,info){
      state.userInfo.smobile = info;
    },
    setConversationList(state,info){
      state.leftUserList = info;
    }
  }
})
export default store
// export default new Vuex.Store({
//   store
//   // state,
//   // mutations
// })
