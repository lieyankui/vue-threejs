import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import * as THREE from 'three';
import '@/styles/base.scss';
import 'normalize.css/normalize.css';
Vue.prototype.$three = THREE;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
