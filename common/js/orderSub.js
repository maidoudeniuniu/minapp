class SubOrder {
	constructor(arg) {
		//订阅收集
	    this.subList = []		 
	} 
	clearList () {
		this.subList = [] 
	}
	//订阅添加到缓存列表
	addListent (key,data){		 
		this.subList.push({
			key:key,
			...data	
		})
	}
	//有结果了，通知别人
	nofiy(){		 
		if(this.subList && this.subList.length>0){
			this.subList.forEach((item)=>{
				item.fn()
			})
			//this.subList = this.subList.filter(item=>item.key!=key)		 
		} 		
	}
}

export default new SubOrder()