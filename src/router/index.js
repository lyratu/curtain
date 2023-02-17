import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";
import designs from "../views/design/index.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "design",
    component: designs,
    meta: {
      keepAlive: true
    }
  },
  {
    path: "/error",
    name: "error",
    component: () =>
      import(/* webpackChunkName: "error" */ "../views/ErrorView.vue"),
  },
  {
    path: "/about",
    name: "about",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.length === 0) {
    from.name
      ? next({
        name: from.name,
      })
      : next("/error");
  } else {
    next();
  }
});

export default router;
