import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import * as THREE from 'three';
import '@/styles/base.scss';
import 'normalize.css/normalize.css';
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import '@/components';


Vue.prototype.$three = THREE;
// use element-ui
Vue.use(ElementUI)

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
