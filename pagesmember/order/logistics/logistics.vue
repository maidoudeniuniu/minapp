<template>
	<layout :BP="false" background="#f5f5f5">
		<view class="xx-warp flexColumn">
			<view class="logisticeBox wirtbg">
				<view class="address-selete-user address_user flexRow">
					<view class="flex1 address_user_info flexRow">
						<view class="logisticsicon f14">收</view>
						<view class="flex1 f14 address_user_text flexColumn">
							<view class="DINM">
								<text class="f14 bold mr5">{{express}}</text>
							</view>
							<view class="f12 grey1 mt3">
								<text>{{expressNo}}</text>
								<text class="xxtag copy" @click="copy">复制</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="mt10 wirtbg flex1" style="padding: 30rpx 50rpx;">
				<u-time-line>
					<u-time-line-item nodeTop="2" v-for="(item,index) in stepList" :key="index">
						<!-- 此处自定义了左边内容，用一个图标替代 -->
						<template v-slot:node>
							<view class="u-node greybg1">
								<!-- 此处为uView的icon组件 -->
								<!-- <view class="signonIcon kIcon"></view> -->
								<!-- <view class="dispatchIcon kIcon"></view> -->
								<!-- <view class="onorderIcon kIcon"></view> -->
								<!-- <view class="consigneeIcon kIcon"></view> -->
								<view class="difficultIcon kIcon"></view>
							</view>
						</template>
						<template v-slot:content>
							<view>
								<view class="u-order-title">
									<text>待取件</text>
									<text class="u-order-time">05-08 12:12</text>
								</view>
								<view class="u-order-desc">
									[自提柜]您的快件已放在楼下侧门，直走前方53.6米，左拐约10步，再右拐直走，见一红灯笼停下，叩门三下，喊“芝麻开门”即可。</view>
							</view>
						</template>
					</u-time-line-item>
				</u-time-line>
			</view>
		</view>
	</layout>
</template>

<script>
	import {
		expressDetail
	} from '@/common/api/member.js'
	import {
		showToast
	} from '@/common/js/utils.js'
	export default {
		data() {
			return {
				express: '', //快递名称
				expressNo: '', //快递单号
				stepList: []
			}
		},
		onLoad(options) {
			console.log(options)
			if (options.express) {
				this.express = options.express
				this.expressNo = options.expressno
				this.getExpressDetail()
			}
		},
		methods: {
			copy() { //复制
				console.log(777)
				uni.setClipboardData({
					data: this.expressNo,
					success: function() {
						showToast("复制成功")
					}
				});
			},
			getExpressDetail() { //获取物流信息
				const {
					express,
					expressNo
				} = this
				expressDetail({
					express,
					expressNo
				}).then(res => {
					this.stepList = res.body
					console.log(res)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.xx-warp {
		flex: 1;

		.kIcon {
			width: 45rpx;
			height: 45rpx;
			display: inline-block;
			border-radius: 100rpx;
		}

		.signonIcon {
			background: url(../../../static/logisticsnotracking.png) center center no-repeat;
			background-size: 35rpx auto;
		}

		.dispatchIcon {
			background: url(../../../static/dispatchIcon.png) center center no-repeat;
			background-size: 35rpx auto;
		}

		.onorderIcon {
			background: url(../../../static/onorderIcon.png) center center no-repeat;
			background-size: 35rpx auto;
		}

		.consigneeIcon {
			background: url(../../../static/consigneeIcon.png) center center no-repeat;
			background-size: 35rpx auto;
		}

		.difficultIcon {
			background: url(../../../static/difficultIcon.png) center center no-repeat;
			background-size: 35rpx auto;
		}
	}

	.logisticeBox {
		padding: 20rpx;

		.logisticsicon {
			width: 60rpx;
			height: 60rpx;
			border-radius: 60rpx;
			background: #000;
			margin-right: 20rpx;
			margin-top: 20rpx;
			text-align: center;
			line-height: 60rpx;
		}
	}

	.u-node {
		width: 44rpx;
		height: 44rpx;
		border-radius: 100rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background: #d0d0d0;
	}

	.u-order-title {
		color: #26273A;
		font-weight: bold;
		font-size: 28rpx;
		font-family: PingFangSC-Medium;
	}

	.u-order-desc {
		color: rgb(150, 150, 150);
		font-size: 28rpx;
		margin-bottom: 6rpx;
	}

	.u-order-time {
		color: #26273A;
		font-size: 24rpx;
		margin-left: 8rpx;
		font-family: PingFangSC-Regular;
	}

	.copy {
		width: 62rpx;
		height: 32rpx;
		font-family: PingFangSC-Light;
		font-size: 22rpx;
		color: #707184;
		text-align: center;
		line-height: 26rpx;
		margin-left: 12rpx;
	}
</style>
