import * as types from '../mutation-types'

// 时间格式化
import moment from 'moment'
// 本地user对象
import { localUser } from '@/assets/js/local'
// JIM配置文件
import { JIMConf } from '@/api/config'
// 随机字符串
import { randomWord } from '@/assets/js/utils'
// MD5加密
import md5 from 'js-md5'

const state = {
  JIM: null,
  chatObject: {},    // 聊天对象属性。ID、昵称、头像等
  chatMsgList: [],    // 消息列表，最终用于聊天气泡渲染
  receiveMsg: [],       // 接收到的消息列表
  syncConversation: []    // 离线消息列表
}

const getters = {
  JIM: state => state.JIM,
  chatObject: state => state.chatObject,
  chatMsgList: state => state.chatMsgList,
  receiveMsg: state => state.receiveMsg,
  syncConversation: state => state.syncConversation
}

const mutations = {
  [types.SET_JIM] (state, JIM) {
    state.JIM = JIM
  },
  [types.SET_CHAT_OBJECT] (state, chatObject) {
    state.chatObject = chatObject
  },
  [types.SET_CHAT_MSG_LIST](state, msgList) {
    state.chatMsgList = msgList
  },
  [types.PUSH_CHAT_MSG_LIST](state, msg) {
    state.chatMsgList.push(msg)
  },
  [types.SET_RECEIVE_MSG](state, receiveMsg) {
    state.receiveMsg = receiveMsg
  },
  [types.SET_SYNC_CONVERSATION](state, syncConversation) {
    state.syncConversation = syncConversation
  }
}

const actions = {
  initJIM ({ commit }) {
    // 注册全局JMessage对象
    let params = {
      appkey: JIMConf.key,
      random_str: randomWord(1, 20, 32),
      timestamp: new Date().getTime(),
      flag: 1
    }
    params.signature = md5(`appkey=${params.appkey}&timestamp=${params.timestamp}&random_str=${params.random_str}&key=${JIMConf.secret}`)
    // 开启debug模式
    const JIM = new JMessage({ debug: true })
    // 本地的用户数据
    const user = localUser.get()
    // 初始化JMessage对象
    JIM.init(params).onSuccess((data) => {
      if (user && !JIM.isLogin()) {
        // 登录
        JIM.login({
          username: user.id,
          password: user.password,
          is_md5: true
        }).onFail(function (arg) {
          if (arg.code === 880103) {
            // 注册用户，把之前已经有的项目用户数据和极光IM用户数据同步
            JIM.register({
              username: user.id,
              password: user.password,
              is_md5: true
            }).onSuccess(function () {
              localUser.setItem('id', user.id)
            })
          }
        }).onSuccess(function () {
          // 不知道为什么，极光IM登录时，会把localStorage里面的用户删除。重新设置
          localUser.setItem('id', user.id)
          commit(types.SET_JIM, JIM)
        })
      } else {
        commit(types.SET_JIM, JIM)
      }
      // 实时监听收到的消息
      JIM.onMsgReceive(function (rmsg) {
        commit(types.SET_RECEIVE_MSG, rmsg)
        let tmp = []
        rmsg.messages.forEach(item => {
          tmp.push({
            id: item.msg_id,
            type: 'from',
            nickname: state.chatObject.nickname,
            headUrl: state.chatObject.headUrl,
            content: item.content.msg_body.text,
            contentType: 0,
            sendTime: item.content.create_time
          })
        })
        commit(types.SET_CHAT_MSG_LIST, state.chatMsgList.concat(tmp))
      })
      JIM.onSyncConversation(function (scon) {
        // 获取离线数据的时候还没有设置聊天对象
        commit(types.SET_SYNC_CONVERSATION, scon)
      })
      JIM.onMutiUnreadMsgUpdate(function (data) {
        console.log(data)
      })
    })
  },
  setChatObject({ commit, state }, chatObj) {
    commit(types.SET_CHAT_OBJECT, chatObj)
    // 设置聊天对象的时候就把离线记录加载出来
    const user = localUser.get()
    let tmp = []
    state.syncConversation.forEach(item => {
      if (item.from_username === chatObj.id && item.msgs) {
        item.msgs.forEach((msg, index) => {
          tmp.push({
            id: msg.msg_id,
            type: msg.content.from_id === user.id ? 'to' : 'from',
            nickname: msg.content.from_name,
            headUrl: msg.content.from_id === user.id ? user.headUrl : chatObj.headUrl,
            content: msg.content.msg_body.text,
            contentType: 0,
            sendTime: msg.content.create_time
          })
        })
      }
    })
    // 时间格式化
    tmp.forEach((item, index) => {
      if (moment().diff(moment(item.sendTime), 'days') <= 1) {
        item.sendTimeStr = moment(item.sendTime).format('HH:mm')
      } else {
        item.sendTimeStr = moment(item.sendTime).format('YYYY-MM-DD HH:mm')
      }
      if (index > 0) {
        if (moment(item.sendTime).diff(moment(tmp[index - 1].sendTime), 'minutes') < 4) {
          item.sendTimeStr = ''
        }
      }
    })
    commit(types.SET_CHAT_MSG_LIST, tmp)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
