<template>
	<view class="address_order">
		 <view class="address_user flexRow" @click="AddClick" v-if="!addressId">
		 	<view class="flex1 address_user_info flexRow">
		 		  <view class="shouicon f14">收</view>
				  <view class="flex1 f14 address_user_text"> 添加收货地址</view>
		 	</view>
			<view class="addressicon"></view>
		 </view>
		 <view class="address-selete-user address_user flexRow" v-if="addressId" @click="AddClick">			
		 	<view class="flex1 address_user_info flexRow">
		 		  <view class="shouicon f14">收</view>
		 		  <view class="flex1 f14 address_user_text flexColumn">
					  <view class="DINM">
					  	<text class="f14 bold mr5">{{addressData.name}}</text><text class="f16">{{addressData.phone}}</text>
					  </view>
					  <view class="f12 grey1 mt3">
					  	<text>{{addressData.province}}</text><text>{{addressData.city}}</text><text>{{addressData.county}}</text><text>{{addressData.detail}}</text>
					  </view>
				  </view>
		 	</view>
		 	<view class="addressicon"></view> 
		 </view>		
	</view>
</template>

<script>
	import { GoNavTo } from '@/common/js/utils.js'
	export default {
		name:"address",
		data (){
			return {
				
			}
		},		
		props:{
			addressId:{
				type:String,
				default:null
			},
			addressData:{
				type:Object,
				default:()=>{}
			}
		},
		methods:{
			AddClick () {
				GoNavTo({
					url:"/pagesmember/address/list/address?callback=/pages/cart/order/order"
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.address_order{
		min-height: 156rpx;
		padding-bottom: 10rpx;
		background: url(../../../static/addressbg.png) #FFFFFF left bottom repeat-x;
		background-size: auto 10rpx;
		margin: 0 30rpx;
		border-radius: 8rpx;
		.address_user{
			.address_user_info{
				.shouicon{
					height: 56rpx;
					width: 56rpx;
					background: #F4F4F4;
					line-height: 56rpx;
					border-radius: 56rpx;
					margin: 54rpx 24rpx;
					text-align: center;
					color: #707184;
				}
				.address_user_text{
					margin: 60rpx 0;
				}
			}
			.addressicon{
				background: url(../../../static/moreicon.png) center center no-repeat;
				background-size: 32rpx auto;
				width: 32rpx;
				height: 32rpx;
				margin: 60rpx 30rpx;
			}
		}
		.address-selete-user{
			.address_user_text{
				margin: 40rpx 0 !important;
			}
		}
	}
</style>
