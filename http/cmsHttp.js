import httpUrl from './config.js';
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

let httpRequest = function(method, url, data = {}, hideLoading = false) {
	if (hideLoading) {
		uni.showLoading({
			title: '加载中...'
		})
	}
	let header = {}
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

	return new Promise((resolve, reject) => {
		uni.request({
			url: httpUrl.cmsUrl + url,
			method,
			header,
			data,
			// dataType: 'json',
			success(res) {
				if (res.statusCode === 200 && res.data) {
					resolve(res.data)
				} else {
					reject(res)
				}
			},
			fail(err) {
				reject(err)
			},
			complete: () => {
				hideLoading && uni.hideLoading()
			}
		})
	})
}

export default httpRequest
