<template>
	<layout :BP="false" background="#ffffff"  :leftIcon="leftIcon" rightIcon="Share" :headerShow='false'>
		<view class="xx-warp">
		    <view class="xx-warp-login mt40">
		    	<view class="f18 bold">输入您的推荐人</view>
				<view class="grey2 mt6 f12 wordBreakAll">一个用户只能绑定一个推荐人ID，绑定后不得修改</view>
		    </view>
			<view class="xx-warp-login-form mt20 flexColumn">
				 <view class="login-form-item borderBottom flexRow">				 	
				 	 <view class="f15 DINM flex1 formInfo">
					 <u-input v-model="value" type="number" placeholder="输入推荐人ID" maxlength="11" placeholder-style="color:#B1B2C1" :class="[{DINM:value},{bold:value}]"/>
						 
					 </view>
				 </view>				 
				 <view class="mt14 mt20 flexRow">
				 	<view class="flex1 mr5">
				 		<u-button @click="referrerNoClick">暂不填写</u-button>
				 	</view>
					<view class="flex1">
						<u-button type="primary" @click="referrerClick">确定</u-button>
					</view>					
				 </view>				 
			</view>
		</view>
	</layout>	
</template>

<script>
	import {GoNavTo,showToast,getValue} from '@/common/js/utils.js'
	export default {
		data () {
			return {
				value:"",
				code:"",
				disabled:true,
				codeTxt:"获取验证码",
				codeNum:60,
				index:0
			}
		},		
		methods:{
			 //发送验证码
			 sendCode (){
				sentTime = setInterval(this.sendCodeNum,1000)
			 },
			 sendCodeNum () {
				this.index = 1
				if(this.codeNum<1){
					this.codeNum = 60 
					clearInterval(sentTime)
				}else{
					this.codeNum--
				} 
			 },
			 referrerNoClick () {
				showToast("登录成功") 
				
				this.callback() 
			 },
			 referrerClick () {
				showToast("登录成功") 
				this.callback()
			 },
			 callback () {
				 uni.navigateBack()
				 // GoNavTo({
				 // 	type:"reLaunch",
				 // 	url:"/pages/index/index"
				 // })
				// let callback  = getValue("callback") || null;
				// console.log(callback)
				// if(callback){
				// 	GoNavTo({ 
				// 		url:callback
				// 	})  
				// }else{
				// 	GoNavTo({
				// 		type:"reLaunch",
				// 		url:"/pages/index/index"
				// 	})
						
				// }
			 }
			 
		}
	}
</script>

<style lang="scss" scoped>	
	.xx-warp{
		padding: 0 50rpx; 
		.login-form-item {
			padding: 20rpx 0;			
		}
		.formLabel{
			height: 30rpx;
			line-height: 30rpx;
			padding: 0 20rpx;
			margin-top: 5rpx;
			margin-right: 20rpx;
		}
		.formLabelTxt{
			border-right: #ddd 1px solid;
		}
		.formInfo{
			height:40rpx;
		}
	} 	 
</style>
