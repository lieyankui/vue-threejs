import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import * as THREE from 'three';
import '@/styles/index.scss';
import 'normalize.css/normalize.css';
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import '@/components';
// import Antd from 'ant-design-vue';
// import 'ant-design-vue/dist/antd.css';

Vue.prototype.$three = THREE;
// use element-ui
Vue.use(ElementUI)
// Vue.use(Antd);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
