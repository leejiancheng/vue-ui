require("es6-promise").polyfill();

import axios from "axios";


// 设置host
// 正式环境
let proBaseURL = "http://www.fapiao.com";
// 测试环境
let testBaseURL = "http://textwx.fapiao.com";
let baseURL = process.env === "production" ? proBaseURL : testBaseURL;


// 请求基础设置
let api = axios.create({
	baseURL,
	timeout: 5000,
	responseType: "json"
});


// 添加响应拦截
api.interceptors.response.use(res => {
	let data = res.data || JSON.parse(res.request.responseText);
	if (data.status === 200) {
		return data.data;
	} else {
		console.log(data.msg);
		return Promise.reject(res.data.msg);
	}
}, error => {
	console.log("网络或服务器错误");
	return Promise.reject(error);
});

export default {
	// 获取导航栏的数据
	getNav: params => {
		return api.get("/v1/official/init", {params})
	}
}