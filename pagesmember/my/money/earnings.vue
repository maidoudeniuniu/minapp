<template>
	<view class="xx-warp flexColumn">
		<view class="xx-warp-hd flex1">
			<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" @scroll="scroll"
				@scrolltolower="scrolltolower">
				<view class="" style="padding:0 30rpx;background: #FFFFFF;">
					<view class="xx-cell xx-cell-bottom flexSpaceBetween" v-for="n in list" :key="n">
						<view class="xx-cell-left flex1">
							<view class="xx-cell-left-title f14 baseColor bold">{{n.title}}</view>
							<view class="xx-cell-left-subtitle mt6 flexRow">
								<text class="f12 grey1 DIN">{{n.phone}}</text>
								<text class="f12 xx-cell-left-subtitle-order ml5 mr5 mt3"></text>
								<text class="f12 grey1 DIN">{{n. orderSn}}</text>
							</view>
						</view>
						<view class="xx-cell-right">
							<view class="xx-cell-right-price alignRight">
								<text class="f16 DINM baseColor bold pl15">{{n.profits}}</text>
							</view>
							<view class="xx-cell-right-time f12 grey1 alignRight mt6 DIN">{{n.profitsDate}}</view>
						</view>
					</view>
				</view>
				<view class="xx-warp-bd"></view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import {
		monthlyProfits
	} from '@/common/api/member.js'
	export default {
		data() {
			return {
				list: []
			}
		},
		onLoad(options) {
			this.getMonthlyProfits(options.month)
		},
		methods: {
			scroll() {

			},
			scrollTop() {},
			scrolltolower() {
				this.list = this.list.concat(this.list)
			},
			getMonthlyProfits(month) {
				monthlyProfits({
					month
				}).then(res => {
					console.log(res)
					this.list = res.body
				})
			}
		}
	}
</script>

<style lang="scss">
	.xx-warp {
		height: 100vh;
		width: 100vw;
		background: #F6F6F6;

		.xx-warp-hd {
			.scroll-Y {
				height: calc(100vh);
			}

			.item-order {
				width: 2rpx;
				height: 22rpx;
				background: #E8E8E8;
				margin: 0 12rpx 0 12rpx;
			}

			.plusicon {
				background: url(../../../static/decreaseicon.png) center left no-repeat;
				background-size: 30rpx auto;
			}
		}

		.xx-warp-bd {
			background: url(../../../static/slogan.png) center center #f6f6f6 no-repeat;
			background-size: auto 100rpx;
			height: 120rpx;
			width: 100%;
		}
	}
</style>
