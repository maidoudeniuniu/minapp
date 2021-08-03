<template>
	<view class="xx-warp flexColumn">
		<view class="xx-warp-hd relative" v-if="assetData.length">
			<view class="xx-moneyBox">
				<view class="">
					<view class="" style="width: 440rpx;">
						<u-subsection :list="list" :current="current" inactive-color="#f5f5f5" font-size="24"
							active-color="#26273A" bg-color="#474862" @change="handleChange"></u-subsection>
					</view>
				</view>
				<view class="xx-money mt20 mb20">
					<text class="f18 DINM wirtColor mr5">¥</text> <text
						class="f32 DINM wirtColor">{{assetData[current].income}}</text>
				</view>
				<view class="xx-money-line"></view>
				<view class="xx-money-tab flexRow mt12">
					<view class="xx-money-tab-item">
						<text class="mr5 wirtColor f12">销售额</text> <text
							class="DINM wirtColor f16">¥{{assetData[current].amount}}</text>
					</view>
					<view class="xx-money-tab-item xx-money-tab-item-order"></view>
					<view class="xx-money-tab-item">
						<text class="mr5 wirtColor f12">销售订单</text> <text
							class="DINM wirtColor f16">{{assetData[current].quantity}}</text>
					</view>
				</view>
			</view>
			<view class="xx-moneyBoxbg"></view>
		</view>
		<view class="xx-warp-bd flex1">
			<view class="xx-money-time grey1 bold">2021年</view>
			<view class="xx-money-time-item" v-for="(item,index) in monthList" :key="index">
				<u-cell-group>
					<u-cell-item title="本月" :value="'¥' + item.amount" :title-style="titleStyle"
						:value-style="valueStyle" @click="orderTime(item.month)"></u-cell-item>
				</u-cell-group>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		GoNavTo
	} from '@/common/js/utils.js'
	import {
		accountAssetget,
		yearlyProfits
	} from '@/common/api/member.js'
	export default {
		data() {
			return {
				show: false,
				assetData: [], //资产数据
				titleStyle: {
					fontWeight: "bold",
					color: "#26273A"
				},
				valueStyle: {
					color: "#26273A",
					fontSize: "32rpx"
				},
				list: [{
						name: '今日收益'
					},
					{
						name: '昨日收益'
					},
					{
						name: '待结算'
					}
				],
				current: 0,
				monthList: [] //月份收益数据列表
			}
		},
		onLoad(e) {
			console.log(e)
			this.current = parseInt(e.id)
			this.show = true
			const eventChannel = this.getOpenerEventChannel();
			eventChannel.once('getAssetData', (res) => {
				console.log('上个页面传来的数据', res.data)
				if (res.data && res.data.today) {
					return this.assetData = [res.data.today, res.data.yesterday, res.data.toBeSettled]
				}
				this.getAssetData()
			})
			this.getYearlyProfits()
		},
		methods: {
			orderTime(e) {
				GoNavTo({
					url: "/pagesmember/my/money/earnings?month=" + e
				})
			},
			handleChange(e) { //切换事件
				this.current = e
			},
			async getAssetData(e) { //获取资产详情数据
				const reset = await accountAssetget();
				if (reset && reset.success) {
					console.log('资产信息=', reset)
					this.assetData = [reset.body.today, reset.body.yesterday, reset.body.toBeSettled]
				}
			},
			getYearlyProfits() { //月份收益
				let date = new Date()
				let month = date.getMonth() + 1
				console.log(month)
				yearlyProfits({
					year: date.getFullYear()
				}).then(res => {
					console.log('年收益列表=', res)
					this.monthList = [res.body[12 - month]]
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
			height: 360rpx;
			background: #26273A;
			padding: 42rpx;

			.xx-moneyBoxbg {
				width: calc(100vw - 100rpx);
				height: 360rpx;
				border-radius: 0 0 360rpx 0;
				background-image: linear-gradient(to bottom, rgba(50, 51, 81, 0.81), rgba(54, 56, 86, 0));
				position: absolute;
				top: 0;
				left: 0;
				z-index: 100;
			}

			.xx-moneyBox {
				position: relative;
				z-index: 200;

				.xx-money-line {
					width: 100%;
					height: 2rpx;
					background: rgba(255, 255, 255, 0.3);
				}
			}

			.xx-money-tab {
				.xx-money-tab-item-order {
					width: 2rpx;
					height: 22rpx;
					background: rgba(255, 255, 255, 0.3);
					margin: 10rpx 30rpx 0 30rpx;
				}
			}
		}

		.xx-warp-bd {
			.xx-money-time {
				margin: 24rpx;
			}
		}
	}
</style>
