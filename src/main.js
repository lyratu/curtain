import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./vant/index";
import "./vant/myvant";
import "./utils/globalcss.less";
import VConsole from "vconsole/dist/vconsole.min.js";
import VueCropper from "vue-cropper";
Vue.use(VueCropper);

// new VConsole();

/* 引入fabricJS */
import fabric from "fabric";
Vue.use(fabric);

Vue.config.productionTip = false;
/* 定义请求根地址 */
Vue.prototype.$baseURL = "https://www.mychuanglian.cc";

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
