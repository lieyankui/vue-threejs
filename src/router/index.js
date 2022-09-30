import Vue from "vue";
import VueRouter from "vue-router";
import { getRouterMode } from "../utils/env-util";

Vue.use(VueRouter);

const routes = [
  {
    path: "/threeJsDemo",
    name: "threeJsDemo",
    component: () => import("../views/three/index.vue"),
  },
  {
    path: "/dragBox",
    name: "dragBox",
    component: () => import("../views/grid-template/index.vue"),
  },
  {
    path: "/demo",
    name: "demo",
    component: () => import("../views/index.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/login/index.vue"),
  },
  {
    path: "/draw",
    name: "draw",
    component: () => import("../views/draw/index.vue"),
  },
  {
    path: "/photo-create",
    name: "photo-create",
    meta: {
      title: '国庆头像制作'
    },
    component: () => import("../views/photo/index.vue"),
  },
  {
    path: "",
    redirect: "draw",
  },
];

const router = new VueRouter({
  mode: getRouterMode(),
  base: process.env.BASE_URL,
  routes,
});

export default router;
