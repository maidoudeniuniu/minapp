<template>
	<view class="flexColumn">		
		<view class="xx-order-hd flexRow flexSpaceBetween">
			<view class="DINM f14">{{order.time_cn}}</view>
			<view class="red1 f14">{{order.status_cn}}</view>
		</view>
		<view class="xx-order-content flexColumn">
			<view class="xx-item" v-for="(itemShop,shopindex) in order.items" :key="shopindex" @click="detailClick()">
				<view class="xx-item-img">
					<image :src="itemShop.img" mode="aspectFit"  style="width: 220rpx;height: 220rpx;"></image>
				</view>
				<view class="xx-item-info">										
					<view class="xx-item-info-bd">						
						<view class="xx-item-title f14">{{itemShop.goodsName}}</view>											
					</view>
					<view class="xx-item-type flexRow flexSpaceBetween flex1">
						<view class="flexRow">
							<view class="xx-item-tags" v-for="(specifications,sindex) in itemShop.specifications" :key="sindex">
								<text class="xxtag DIN f12">{{specifications}}</text>
							</view>
						</view>
						<view class="xx-item-number grey1 DIN">x{{itemShop.quantity}}</view>
					</view>
					<view class="xx-item-info-fd">
						<view class="xx-item-price mb3">
							<text class="f12">退款金额:</text>
							<text class="f12 bold">{{itemShop.realPrice}}</text>
						</view>
						<!-- <view>
							<text class="viptag"><text class="viptxt">{{item.discountInfo.title}}</text></text>							
						</view> -->
					</view>					
				</view>
			</view> 
		</view>
	<!-- 	<view class="xx-item-detail-info flexRow flexSpaceBetween">
			<view class="f14">
				<text class="f14 bold">退款中:</text>
				<text class="f14 DIN bold">{{order.amount}}元</text>
			</view>
			<view class="f14 grey1 showDetail">查看详情</view>
		</view> -->
	</view>
</template>

<script>
	import {Pay ,ordersDelete} from '@/common/api/member.js'
	import { GoNavTo,getValue,showToast } from '@/common/js/utils.js'
	let OrderTime;
	let NumTime=0;
	export default {
		props:{
			orderData:{
				type:Object,
				default:()=>{}
			}
		},
		data (){
			return {
				order:{},
				orderIndex:0,
				show:false
			}
		},
		destroyed() {
			clearTimeout(OrderTime)
		},
		mounted() {
			this.order = this.orderData
			this.show = true			
		},
		methods:{ 
		}
	}
</script>

<style lang="scss" scoped>	
	.xx-item-detail-info{
		background: #F6F6F6;
		padding: 16rpx 20rpx;
		border-radius: 4rpx;
		.showDetail{
			background: url(../../../static/moreicon.png) center right no-repeat;
			background-size: 32rpx auto;
			padding-right: 36rpx;
			height: 32rpx;
			line-height: 32rpx;			 
		}
	} 
	.xx-item{
		background: #FFFFFF;
		padding: 0 24rpx 24rpx 24rpx;		 
		display: flex;
		flex-direction: row;
		.xx-item-img{
			width: 220rpx;
			height: 220rpx;
			overflow: hidden;
			margin-right: 24rpx;
		}
		.xx-item-info{
			flex:1;
			display: flex;
			flex-direction: column;
			.xx-item-info-bd{
				flex: 1;
				display: flex;
				flex-direction: column;
				.xx-item-title{
					max-height: 70rpx;
					overflow: hidden;
				}
				.xx-item-number{
					height: 52rpx;
					line-height: 52rpx;
				}
			}
			.xx-item-info-fd{
				.xx-item-price{
					
				}
			}
		}
	}
</style>
