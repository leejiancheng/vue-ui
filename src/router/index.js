"use strict"
import Vue from "vue"
import VueRouter from "vue-router"
import NProgress from "nprogress"

// 禁用进度环
NProgress.configure({showSpinner: false})

// 通知Vue加载vue-router
Vue.use(VueRouter)

// 设置路由配置
const configRouter = {
	mode: "history",
	routes: [
		{
			path: "/",
			component: (resolve) => require(["@/views/home/home"], resolve),
			name: "首页"
		}
	]
}

// 创建路由实例
const router = new VueRouter(configRouter)

// 路由加载前的钩子函数
router.beforeEach((to, from, next) => {
	// 进度条加载中
	if (from.path) {
		NProgress.start()
		NProgress.set(0.2)
		NProgress.inc()
	}
	next()
})

// 路由加载后的钩子函数
router.afterEach(route => {
	// 修改页面的标题
	window.document.title = route.name

	// 进度条加载完成
	setTimeout(() => {
		NProgress.done()
	}, 200)
})

// 将router变为全部变量
window.router = router

export default router