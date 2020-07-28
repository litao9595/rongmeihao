// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// import 'babel-polyfill'
import App from './App'
import router from './router'
import axios from 'axios'
import echarts from 'echarts'
import store from './vuex/store.js'
import $ from 'jquery'
Vue.use(ElementUI);
//设置axios为form-data
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.transformRequest = [function (data) {
  let ret = ''
  for (let it in data) {
    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
  }
  return ret
}];
// axios.defaults.withCredentials=true;
Vue.prototype.$http=axios;
Vue.config.productionTip = false;
Vue.prototype.$echarts = echarts;
// Vue.prototype.HOME='/api';
import './assets/icon/iconfont.css'
import httpConfig from "./router/httpConfig.js"
import VueQuillEditor from 'vue-quill-editor'

Vue.use(VueQuillEditor);
import CKEditor from '@ckeditor/ckeditor5-vue';
Vue.use( CKEditor );
import vuePicturePreview from 'vue-picture-preview'
Vue.use(vuePicturePreview)
import common from './router/common'
Vue.prototype.common = common;
export const eventBus = new Vue()

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
