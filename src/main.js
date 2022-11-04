import '@babel/polyfill'
import 'mutationobserver-shim'
import './plugins/bootstrap-vue'
import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import Vuebar from 'vuebar'
import VueLoaders from 'vue-loaders'
import HighchartsVue from 'highcharts-vue'
import VueI18n from 'vue-i18n'
import VueNativeNotification from 'vue-native-notification'
// import './registerServiceWorker'

import { dynText } from './textPool/textPool.js'

Vue.config.productionTip = false

Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: 'en',
  messages: {
    "en": dynText
  }
})

// HighchartsVue.dateFormat("Month: %m Day: %d Year: %Y", 20, false)
Vue.use(Vuebar)
Vue.use(VueLoaders)
Vue.use(HighchartsVue)
Vue.use(VueNativeNotification)

console.log('%cWelcome To ATechno Embedded Solutions OPC Pvt Ltd!', "font-size: 20pt; background-color: black; color: white;")
if (!window.isSecureContext) {
  console.log('App not running in secure context')
}
try {
  navigator.serviceWorker.register('/sw.js');
} catch (e) {
  console.log('Navigator:ServiceWorker is not available in this context')
}

new Vue({
  store,
  router,
  render: h => h(App),
  i18n,
}).$mount('#app')
