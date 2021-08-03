<template>
	<view class="">
		<!-- <view class="">
			<view class="xx-warp-price">
				<text class="f18 DINM">¥</text>
				<text class="f30 DINM pl5 pr5">{{detail.priceInfo.floor}}</text>
				<text class="f16 gray6 DINLight relative">¥{{detail.priceInfo.markingFloor}} <text class="delprice"></text></text>
			</view>
		</view> -->
		<!--折扣价显示-->
		<view class="">
			<view class="xx-warp-price">
				<text class="f18 DINM">¥</text>
				<text class="f30 DINM pl5 pr5">{{detail.priceInfo.discountFloor}}</text>
				<text class="f16 grey2 DIN relative" v-if="detail.discountInfo.grade === 'E'">¥{{detail.priceInfo.markingFloor}} <text
						class="delprice"></text></text>
				<text class="viptag" v-if="detail.discountInfo && detail.discountInfo.grade !== 'E'"><text class="viptxt">{{detail.discountInfo.slogan_cn}}</text></text>
			</view>
			<view class="flexRow mt3" v-if="detail.discountInfo.grade !== 'E'">
				<view class="pr5">
					<text class="f14 DINM">售价¥</text>
					<text class="f16 DIN">{{detail.priceInfo.floor}}</text>
				</view>
				<view>
					<text class="f16 grey2 DIN relative">¥{{detail.priceInfo.markingFloor}} <text
							class="delprice"></text></text>
				</view>
			</view>
		</view>
		<view class="mt12 xx-warp-buyTip flexColumn" v-if="detail.discountInfo.grade === 'E'">
			<view class="xx-warp-buyTip-hd f14 flex1">{{detail.discountInfo.slogan_cn}}</view>
			<view class="xx-warp-buyTip-bd"></view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			detail: {
				type: Object,
				default: () => {}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.xx-warp-buyTip {
		background: #F2E1DD;
		padding: 0 10rpx;
		border-radius: 8rpx;
		position: relative;

		.xx-warp-buyTip-hd {
			padding: 22rpx 24rpx;
		}

		.xx-warp-buyTip-bd {
			position: absolute;
			top: 0;
			right: 20rpx;
			bottom: 0;
			background: url(../../static/pdp-euserbg.png) center center no-repeat;
			width: 118rpx;
			background-size: 118rpx auto;
		}
	}
</style>
