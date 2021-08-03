export const setValue = (key, value) => {
	return uni.setStorageSync(key, value);
}

export const getValue = (key) => {
	return uni.getStorageSync(key);
}

export const removeKey = (key) => {
	return uni.removeStorageSync(key)
}

// 提示
export const showToast = (value, icon) => {
	uni.showToast({
		icon: icon || 'none',
		title: value,
		duration: 1800
	});
}

// 跳转多种模式
export const GoNavTo = (param) => {
	let type = param.type || 'navigateTo'
	let url = param.url || null
	if (!url) {
		return
	}
	//保留当前页面，跳转到应用内的某个页面，使用uni.navigateBack可以返回到原页面

	if (type == 'navigateTo') {
		uni.navigateTo({
			url: url
		});
	}
	//关闭当前页面，跳转到应用内的某个页面
	if (type == 'redirectTo') {
		uni.redirectTo({
			url: url
		})
	}
	//关闭所有页面，打开到应用内的某个页面。
	if (type == 'reLaunch') {
		uni.reLaunch({
			url: url
		})
	}
	//跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面。
	if (type == 'switchTab') {
		uni.switchTab({
			url: url
		})
	}
}


export const PhoneReg = (param) => {
	return /^1[0-9]{10}$/
}

//转换时分
export const timemmss = (value) => {
	let reset = [];
	let htime = [];
	let mtime = [];
	if (value <= 0) {
		return [
			[0, 0],
			[0, 0]
		]
	}
	let time = (parseInt((value / 60)) > 9 ? parseInt((value / 60)) : "0" + parseInt((value / 60))).toString()
	let ms = ((value - (time * 60)) > 9 ? (value - (time * 60)) : "0" + (value - (time * 60))).toString()
	let timestr = time.length >= 2 ? time : "00"
	for (let i = 0; i < timestr.length; i++) {
		htime.push(timestr[i])
	}
	for (let i = 0; i < ms.length; i++) {
		mtime.push(ms[i])
	}
	reset.push(htime)
	reset.push(mtime)

	return reset
}

//字符串转数组
export const ArrayList = (value) => {
	let reset = value.substring(0, value.length);
	return JSON.parse(reset)
}

//订单状态
export const statusCN = (value) => {
	var data = {
		"no_pay": "待付款",
		"paid": "待发货",
		"delivered": "已发货",
		"refund": "退款/售后",
		"expired": "已取消",
		"finished": "交易成功",
		"closed": "已关闭"
	}
	return data[value]
}


//时间转换
export const TimeLength = (value, len) => {
	let str = ""
	if (Array.isArray(value)) {
		let newValue = value.map(item => {
			return item > 9 ? item : "0" + item
		})

		//分秒
		if (len == 5) {
			str = newValue[0] + "-" + newValue[1] + "-" + newValue[2] + " " + newValue[3] + ":" + newValue[4]
		}
		if (len == 6) {
			str = newValue[0] + "-" + newValue[1] + "-" + newValue[2] + " " + newValue[3] + ":" + newValue[4] +
				":" +
				newValue[5]
		}
	} else {
		str = value.substr(0, 16)
	}

	return str;
}

//底部是否bottom
export const bottomStart = () => {
	return uni.getSystemInfoSync().safeArea.top > 20
}

//sloganshift 
export const sloganshift = (data, type = 1) => {
	if (!data) return ''
	let reset = data[0];
	if (data && data.length > 1) {
		for (let i = 1; i < data.length; i++) {
			reset = reset.replace(new RegExp('\\{' + i + '\\}', 'g'), data[i])
		}
	}
	return reset
}

/**
 * 字符串限制
 * data源数据
 * len 数量8
 */
export const stringLen = (data, len = 8) => {
	let newData = data ? JSON.parse(data) : []
	let reset = []
	if (newData && newData.length > 0) {
		reset = newData.reduce((item, cur) => {
			let str = cur.length > 8 ? cur.substring(0, 8) + "..." : cur
			console.log(str)
			return item.concat(str)
		}, [])
	}
	return JSON.stringify(reset)
}


export const extimeformat = (t)=>{
	
}
