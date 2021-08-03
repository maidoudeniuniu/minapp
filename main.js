import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

// 引入全局uView
import uView from 'uview-ui'
Vue.use(uView);

import Layout from '@/components/layout/layout.vue'
import Detail from '@/components/layout/layoutdetail.vue'
import * as filters from '@/common/js/formatting.js'
Vue.component("layout",Layout)
Vue.component("detail",Detail)

// 全局注册过滤器
Object.keys(filters).forEach(k => Vue.filter(k, filters[k]));

import Sub from '@/common/js/subscription.js'
import SubOrder from '@/common/js/orderSub.js'

Vue.prototype.$Sub = Sub
Vue.prototype.$SubOrder = SubOrder

const app = new Vue({
    ...App
})
app.$mount()
