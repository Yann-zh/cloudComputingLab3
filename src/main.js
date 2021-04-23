import Vue from 'vue'
import App from './App.vue'
import BaiduMap from 'vue-baidu-map'
import axios from 'axios'

Vue.prototype.$axios = axios;

Vue.config.productionTip = false
Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: 'tjBMTv7c8P38BdtF5W3cc5kR7LOymmYd'
})

new Vue({
  render: h => h(App),
}).$mount('#app')

