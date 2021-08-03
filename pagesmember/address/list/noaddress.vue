<template>
	<view class="xx-warp flexColumn">
		<view class="xx-warp-hb flex1 flexColumn">
			<view class="addressBox">
				<image :src="src + 'not-address.png'" class="img"></image>
				<view class="txt">
					您还没有添加收货地址～
				</view>
			</view>
		</view>
		<view class="xx-warp-fb">
			<view type="primary" class="add-button medium" @click="goadd">新增收货地址</view>
		</view>
	</view>
</template>

<script>
	import {
		GoNavTo
	} from '@/common/js/utils.js'
	import httpUrl from '@/http/config.js';
	export default {
		data() {
			return {
				src: httpUrl.imgUrl
			}
		},

		computed: {

		},
		mounted() {},
		methods: {
			goadd() {
				if (this.callback) {
					GoNavTo({
						url: "/pagesmember/address/add/add?callback=" + this.callback
					})
				} else {
					GoNavTo({
						url: "/pagesmember/address/add/add"
					})
				}

			},

		}
	}
</script>

<style lang="scss">
	.xx-warp {
		flex: 1;
		height: 100vh;

		.xx-warp-hb {
			overflow-y: auto;
			padding: 30rpx;

			.address-item {
				background: #FFFFFF;
				padding: 24rpx;
				position: relative;

				.address-item-icon {
					width: 32rpx;
					height: 32rpx;
					background: url(../../../static/IconEdit.png) center center no-repeat;
					background-size: 32rpx auto;
				}
			}
		}

		.addressBox {
			padding-top: 304rpx;
			text-align: center;

			.img {
				width: 250rpx;
				height: 250rpx;
				vertical-align: middle;
				margin-top: 25rpx;
			}

			.txt {
				font-family: PingFangSC-Regular;
				font-size: 24rpx;
				color: #26273A;
			}
		}

		.xx-warp-fb {
			position: absolute;
			width: 750rpx;
			bottom: 0;
			right: 0;
			left: 0;
			padding: 14rpx 0;
		}

	}

	.add-button {
		width: 702rpx;
		height: 84rpx;
		line-height: 84rpx;
		background: #26273A;
		border-radius: 4rpx;
		font-family: PingFangSC-Medium;
		font-size: 28rpx;
		color: #FFFFFF;
		text-align: center;
		margin: auto;
	}
</style>
