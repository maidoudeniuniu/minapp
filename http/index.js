import httpUrl from './config.js';
import networkHandle from './network.js';
import {
	showToast,
	isAarry,
	removeKey,
	getValue,
	randomNum,
	version,
	GetSign,
	timestamp,
	setValue
} from '@/common/js/utils.js';
import Sub from '@/common/js/subscription.js'

// 需要登录记录
let noLogin = 0 // 0初始化1已存在 

let httpRequest = function(method, url, data = {}, hideLoading = false) {
	let _this = this,
		header = {},
		requestUrl = httpUrl.baseUrl + url;
	if (getValue("token")) {
		header['token'] = getValue("token")
	}

	// #ifdef MP-WEIXIN
	header['channel'] = 'wxma'
	// #endif

	// #ifdef APP-PLUS 
	header['channel'] = 'app'
	// #endif

	// #ifdef H5
	header['channel'] = 'h5'
	// #endif


	if (hideLoading) {
		uni.showLoading({
			title: '加载中...'
		});
	}

	let httpRequestOps = {
		url: requestUrl,
		method,
		header,
		data,
		dataType: 'json',
		complete: () => {}
	}
	let promise = new Promise(function(resolve, reject) {
		const HttpParams = Object.assign({}, httpRequestOps, {
			success(res) {
				let data = res.data
				// 登录token 失效情况判断
				//判断是否有刷新token
				if (res.statusCode == 401) {
					if (noLogin == 1) {
						return
					}
					removeKey("token")
					noLogin = 0
					uni.navigateTo({
						url: '/pagesmember/user/login/login'
					});
					return
				}
				if (!data.success && data.code == "T030") { //刷新token不存在或已过期		 
					removeKey("token")
					removeKey("refreshToken")
					uni.navigateTo({
						url: '/pagesmember/user/login/login'
					});
					return
				}
				// http请求接口成功 
				if (res.statusCode === 200) {
					Sub.isLoginStatus(true)
					noLogin = 0
					// 第一次就要存储的信息
					if (data.success && data.token) {
						setValue("token", data.token)
						setValue("mobile", data.body.mobile)
						setValue("userId", data.body.userId)
						setValue("logo", data.body.logo)
						setValue("nickname", data.body.nickname)
						setValue("refreshToken", data.body.refreshToken)
					}
					if (data.success) {
						resolve(data)
						setValue("exp", new Date().getTime())
					} else {
						// 为了测试app 支付
						if (data.code != "T031" && data.code != "B999") {
							showToast(data.message)
						} else {
							showToast(data.message || '出错啦，请稍后再试')

						}
					}
				} else {
					console.log(data)
					if (data && data.message && data.code != "B999") {
						showToast(data.message)
					}
				}
				if (hideLoading) {
					uni.hideLoading();
				}
			},
			fail(err) {
 				networkHandle.statusFail(err)
				if (hideLoading) {
					uni.hideLoading();
				}
			}
		})
		uni.request(HttpParams)
	})
	return promise
}

export default httpRequest
