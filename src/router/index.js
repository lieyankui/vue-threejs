import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [

  {
    path: "/threeJsDemo",
    name: "threeJsDemo",
    component: () =>
      import( "../views/three/index.vue"),
  },
  {
    path: '',
    redirect: 'threeJsDemo',
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
