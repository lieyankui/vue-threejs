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
    path: "/dragBox",
    name: "dragBox",
    component: () =>
      import( "../views/grid-template/index.vue"),
  },
  {
    path: "/demo",
    name: "demo",
    component: () =>
      import( "../views/index.vue"),
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
