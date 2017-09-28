// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
"use strict"
import Vue from "vue";
import App from "./App";
import router from "./router";

// 加载全局的样式
import "@/assets/css/base.scss";
import "@/assets/fonts/font-awesome.min.css";

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: "#app-root",
  router,
  template: "<App/>",
  components: { App }
});
