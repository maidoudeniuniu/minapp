import  {accountToken}  from "@/common/api/login.js"
import {getValue,setValue} from '@/common/js/utils.js'
class Sub {
	constructor(arg) {
		//订阅收集
	    this.subList = {}
		//当前token 是否有效
		this.isLogin = false
	}
	//更改isLogin 状态
	isLoginStatus (e){
		this.isLogin = e
	}
	//刷新token
	refreshToken(fn){
		this.isLogin = false		
		this.addListent("refreshToken",fn)
		let refreshToken = getValue("refreshToken");
		if(!refreshToken){
			return
		}
		accountToken({
			refreshToken
		}).then((e)=>{			
			if(e.success){
				this.isLogin = true
				this.nofiy("refreshToken",e) 
			}else {
				this.isLogin = false
			}		
		}).catch((err)=>{
			this.isLogin = false 
		}) 
	}
	//订阅添加到缓存列表
	addListent (key,fn){
		this.subList[key] = fn 
	}
	//有结果了，通知别人
	nofiy (key,e){ 
		// this.subList[key](e) 
 	    // this.subList.forEach((item)=>{
		// 	if(item.key == key){
		// 		item.fn(e)
		// 	}
		// })
		// this.subList = this.subList.filter(item=>item.key!=key)
		// console.log(this.subList)
	}
	//监听回调
	listentNofiy(fn){
		 
	}
}

export default new Sub()