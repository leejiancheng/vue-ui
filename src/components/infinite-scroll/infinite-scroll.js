/***
 * InfiniteScroll
 * @module components/infinite-scroll
 * @desc 无限滚动指令
 * ********** API **********
 * @param {Boolean} [infinite-scroll-disabled=false] - 若为真，则无限滚动不会被触发
 * @param {Number} [infinite-scroll-distance=0] - 触发加载方法的滚动距离阈值（像素）
 * @param {Boolean} [infinite-scroll-immediate-check=true] - 若为真，则指令被绑定到元素上后会立即检查是否需要执行加载方法。在初始状态下内容有可能撑不满容器时十分有用
 * @param {Function} [infinite-scroll-listen-for-event] - 一个 event，被执行时会立即检查是否需要执行加载方法。
 *
 * @example
 * directives: {InfiniteScroll},
 * <ul v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
 * 	<li v-for="item in list">{{ item }}</li>
 * </ul>
 ***/

"use strict";

import Vue from "vue";
import InfiniteScroll from "./directive.js";

const install = (Vue) => {
	Vue.directive("InfiniteScroll", InfiniteScroll);
};

if (!Vue.prototype.$isServer && window.Vue) {
	window.infiniteScroll = InfiniteScroll;
	Vue.use(install);
}

InfiniteScroll.install = install;
export default InfiniteScroll;
