<template>
	<view class="xx-warp">
		<view class="xx-nocart">
			<view class="">
				<view class="xx-nocart-icon">
					<image src="../../static/nocart.png" mode="widthFix" style="width: 250rpx;"></image>
				</view>
				<view class="xx-nocart-title mt10 alignCenter f14 baseColor">购物车是空的～</view>
				<!-- <view class="xx-nocart-subtxt gray9 mt6 alignCenter f12">我要去看看好货…</view> -->
			</view>
			<view class="mt20 alignCenter">
 				<u-button @click="goIndex" size="medium">
					<view class="">去首页逛逛</view>
				</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	import { GoNavTo} from '@/common/js/utils.js'
	export default { 
		methods:{
			goIndex () {
				GoNavTo({
					type:"reLaunch",
					url:"/pages/index/index"
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.xx-warp{ 
 		height: 100vh;
 		width: 100vw; 
		position: relative;
		.xx-nocart{
			position: absolute;
			top:50%;
			left:50%;
			margin-left: -155rpx;
			width: 310rpx;
			margin-top: -200rpx;
			overflow: hidden;
			.xx-nocart-icon{
				width: 250rpx;
				height: 250rpx;
				margin: 0 auto;
				// background: url(../../static/nocart.png) center center no-repeat;
				// background-size: 104rpx auto;
			}
		}
		
		
	}
</style>
