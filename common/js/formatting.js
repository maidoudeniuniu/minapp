export const telFormat = (num) => { //手机号脱敏
	if (!num) return ''
	if (typeof num === 'number') num = String(num)
	return num.replace(/(\d{3})\d*(\d{4})/, '$1****$2')
}

export const timeFormat = (value, start = 0, end = 10) => { //时间格式化
	if (!value) return ''
	return value.substring(start, end)
}

export const skuFormat = (value) => { //规格格式化
	if (!value) return ''
	if (Array.isArray(value)) {
		return value.join('-')
	} else if (typeof value === 'string') {
		if (value.indexOf("[") === -1) return value
		return JSON.parse(value).join('-')
	}
}
