let baseUrl = ""
let cmsUrl = ""
let imgUrl = ""

if (process.env.NODE_ENV === 'development') {
	// 开发环境
	baseUrl = 'https://api-dev.umeibei.com'
	cmsUrl = 'https://api.puresnake.com'
	imgUrl = 'https://s.umeibei.com/app/img/'

} else {
	// 生产环境
	baseUrl = 'https://api-dev.umeibei.com'
	cmsUrl = 'https://api.puresnake.com'
	imgUrl = 'https://s.umeibei.com/app/img/'
}

export default {
	baseUrl,
	cmsUrl,
	imgUrl
}
