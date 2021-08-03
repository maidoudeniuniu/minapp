
import {showToast,removeKey} from '@/common/js/utils.js';
let networkHandle = {
	// 接口返回的错误信息做处理
	statusOk (resData) {
		// -99登录过期 -240账号异常 -205用户不存在 -121用户未注册
		if(resData.codeId===-99) {
			removeKey("token")
		}
		if(resData.codeId===-99||resData.codeId===-240) {
			this.feedback(resData)
			return
		}
		if(resData.codeId===-205){
			setTimeout(()=>{
				uni.navigateTo({
					url: '/packageuser/login/register'
				});	
			},1000)
			return
		}
		setTimeout(()=>{
			showToast(resData.codeDes)  
		},200)
	},
	feedback (resData) {
		showToast(resData.codeDes)
		setTimeout(()=>{
			uni.navigateTo({
				url: '/packageuser/login/index'
			});	
		},1000)
	},
	// 错误请求处理
	statusFail (err) {			
		let  str = '';
		if(err && err.response){
			switch (err.response.status) {
			  case 0:
				str = `接口返回来时间过长: ${err.response.config.url}`
				break
			  case 400:
				str = `请求错误:${err.response.data.message}`
				break
			  case 401:
				str = '未授权，请登录'
				break
			  case 403:
				str = '拒绝访问'
				break
			  case 404:
				str = `请求地址出错: ${err.response.config.url}`
				break
			  case 405:
				str = `请求方法不对:${err.response.data.message}`
				break
			  case 408:
				str = '请求超时'
				break
			  case 500:
				str = '服务器内部错误'
				break
			  case 501:
				str = '服务未实现'
				break
			  case 502:
				str = '网关错误'
				break
			  case 503:
				str = '服务不可用'
				break
			  case 504:
				str = '网关超时'
				break
			  case 505:
				str = 'HTTP版本不受支持'
				break;
			  default:
				str = `连接错误:${err.response.status} `
				break
			}
			if (str) {
			  showToast(str)
			}
		}else if(err.errMsg) {	
		    if (err.errMsg.indexOf("timeout")>-1) {
				showToast("连接超时")
			}else if(err.errMsg.indexOf("request:fail")>-1){
				showToast("连接断开")
			}else {
				showToast(err.errMsg)
			}
			
		}else if (err.message) {			
			let str = err.message + ""
			if(str.indexOf("statusCode")>-1){
				showToast("【小二】开小差，服务器连接不上")
			}else{
				showToast(err.message)
			}			
		}		
	}	
}

export default networkHandle