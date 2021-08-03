import httpRequest from './index.js'
import { getValue} from '@/common/js/utils.js'


let signRequest = {
	GET (URL,Data,Loading) {
		return this.signrequest("GET",URL,Data,Loading)
	},
	POST (URL,Data,Loading) {
		return this.signrequest("POST",URL,Data,Loading)
	},
	signrequest (Method,URL,Data,Loading) {
		return new Promise((resolve,reject)=>{	 
			// 先data 里面添加token			 
			let newPamams = null;
			if(Array.isArray(Data)){
				newPamams = Data
			}else{
				newPamams = Object.assign({},Data)
			}
			// 统计封装有签名的接口
				if(Method === "GET"){
					// get 格式 就是一个对象
					let newData = Object.assign({},newPamams)
					httpRequest(Method,URL,newData,Loading).then((resutrs)=>{
						resolve(resutrs)
					})
				}else {
					// post 格式 {requestParam:{***},sign:{***}}	
					let newData = null;
					if(Array.isArray(newPamams)){
						newData = newPamams
					}else{
						newData = Object.assign({},newPamams)
					}
					httpRequest(Method,URL,newData,Loading).then((resutrs)=>{
						resolve(resutrs)
					})
				}	 
			 
		})
	}
}


export default signRequest
