<template>
	<view class="InvitationModule"> 
		<view class="InvitationMask"></view>
		<view class="InvitationBody" v-if="step==1" :style="{bottom: bottomHeight}">
 			<view class="xx-warp-login mt20 borderBottom pb20">
				<view class="f18 xx-warp-login-txt">输入您的推荐人</view>
				<view class="wx-warp-closeIcon" @click="referrerNoClick"></view>
			</view>
			<view class="xx-warp-login-form mt20 flexColumn">
				 <view class="login-form-item borderBottom flexRow">				 	
				 	<view class="f15 DINM flex1 formInfo"> 
					 <input v-model="value" type="number"  :adjust-position="false" @confirm="initheight" @focus="getheightCont" @blur="initheight" placeholder="输入推荐人ID" maxlength="11" placeholder-style="color:#B1B2C1" style="padding: 10rpx;" :class="[{DINM:value},{bold:value}]"/>
					</view>
				 </view>				 
				 <view class="mt14 mt20 flexRow">
				 	<view class="flex1 mr5">
				 		<u-button @click="referrerNoClick">取消</u-button>
				 	</view>
					<view class="flex1">
						<u-button type="primary" @click="nextClick">确定</u-button>
					</view>					
				 </view>				 
			</view>
		</view>
		<view class="InvitationBody" v-if="step==2" :style="{bottom: bottomHeight}">
			<view class="xx-warp-login mt20 borderBottom pb20 ">
				<view class="f18 bold xx-warp-login-txt">您将绑定以下推荐人</view>
				<view class="wx-warp-closeIcon" @click="referrerNoClick"></view>
			</view>
			<view class="xx-warp-login-form mt20 flexColumn ">
				 <view class="login-form-item  flexColumn">				 	
				 	 <view class="" style="width:100%;margin-top: 50rpx;">
				 	 	<view class="" style="width: 160rpx;height: 160rpx;border-radius: 160rpx;margin: 0 auto;">
							<image :src="intData.headImgUrl" mode="widthFix" style="width: 160rpx;height: 160rpx;border-radius: 160rpx;"></image>
						</view>						
				 	 </view>
					 <view class="alignCenter f16 mt10">{{intData.nickname}}</view>
					 <view class="alignCenter grey1 mt3">ID:{{value}}</view>
				 </view>				 
				 <view class="mt14 mt30 flexRow">
				 	<view class="flex1 mr5">
				 		<u-button @click="resetInv">换个推荐人</u-button>
				 	</view>
					<view class="flex1">
						<u-button type="primary" @click="referrerClick">确定</u-button>
					</view>					
				 </view>				 
			</view>
		</view>
	</view>
</template>

<script>
	import {
		showToast
	} from '@/common/js/utils.js'
	import {
		accountUser,
		mineAccountInfo
	} from '@/common/api/member.js'
	export default {
		name: "invitationComponent",
		data() {
			return {
 				bottomHeight:0,
				intData:{},
				value:"",
				step:0
			}
		},
		props:{
			inviterId:{
				type:Number,
				default:""
			}
		},
		mounted() {
			this.value = this.inviterId
			if(this.value){
				this.nextClick()
			}else{
				this.step = 1
				this.getMineAccountInfo()
			}			
		},
		methods:{
			async getMineAccountInfo() { //首购的用户还需判断是否已有绑定上级
				let mineInfo = await mineAccountInfo()				 
				if (mineInfo.body.superiorId) {
					this.value = mineInfo.body.superiorId
					this.nextClick()
				}
			},
			getheightCont (e) {
				this.bottomHeight=((e.detail.height*2)-60)+"rpx";
			},
			initheight () {
				this.bottomHeight= 0 
			},
			referrerNoClick (){
				this.$emit("confirmEmit")
			},
			//换一个推荐人
			resetInv() {
				this.step = 1
				this.value = ""
			},
			async nextClick() {
				if (!this.value) {
					showToast("推荐人没有填写")
					return
				}
				const reset = await accountUser({
					userId: this.value
				})
				if (reset && reset.success) {
					this.intData = reset.body
					this.step = 2
				}
			},
			referrerClick() {
				this.$emit("confirmEmit", this.value)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.InvitationModule{
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 10000;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		.InvitationMask{
			flex: 1;
			background: rgba(0, 0, 0, .2);
		}
		.InvitationBody{
			position: fixed;
			left:0;
			right: 0;
			background: #fff;
			padding-bottom: 84rpx;

			.xx-warp-login {
				text-align: center;
				position: relative;
			}

			.xx-warp-login-txt {
				height: 52rpx;
				line-height: 52rpx;
			}

			.wx-warp-closeIcon {
				position: absolute;
				top: 0;
				right: 30rpx;
				background: url(../../static/closeIcon.png) no-repeat;
				width: 52rpx;
				height: 52rpx;
				background-size: 52rpx auto;
			}

			.xx-warp-login-form {
				padding: 0 24rpx;
			}
		}
	}
</style>
