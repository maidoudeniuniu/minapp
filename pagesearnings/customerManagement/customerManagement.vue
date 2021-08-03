<template>
	<view class="page">
		<view class="statistics">
			<view>客户人数（人）</view>
			<view class="people-num DIN Medium">{{ total }}</view>
		</view>
		<view class="list_box">
			<view class="flexColumn list-item" v-for="(item, index) in list" :key="index">
				<view class="flex flexSpaceBetween flexCenter customer-account">
					<view style="font-size: 28rpx;">{{ item.name }}</view>
					<view>{{ item.phone | telFormat }}</view>
				</view>
				<view class="line-between"></view>
				<view class="flex1 flex flexCenter flexSpaceBetween">
					<view class="flex1 alignCenter">
						<view class="current-value Medium">{{ item.gradeName }}</view>
						<view class="title">客户等级</view>
					</view>
					<view class="center-line"></view>
					<view class="alignCenter" style="width: 246rpx;">
						<view class="current-value Medium">{{ item.growth }}</view>
						<view class="title">成长值</view>
					</view>
					<view class="center-line"></view>
					<view class="flex1 alignCenter">
						<view class="current-value Medium">{{ item.gmtModified | timeFormat }}</view>
						<view class="title">首次下单</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { customerList } from '@/common/api/member.js';
export default {
	data() {
		return {
			list: [],
			total: 0,
			params: { page: 0, size: 10 }
		};
	},
	onLoad() {
		this.getCustomerList();
	},
	onReachBottom() {
		this.params.page += 1;
		this.getCustomerList();
	},
	methods: {
		getCustomerList() {
			if (this.list.length > 0 && this.list.length >= this.total) return;
			customerList(this.params)
				.then(res => {
					console.log('客户列表=', res);
					if (!res.body.length) return;
					this.list.push(...res.body);
					this.total = res.total;
				})
				.catch(err => console.log(err));
		}
	}
};
</script>

<style lang="scss">
.page {
	width: 750rpx;
	min-height: 100vh;
	padding: 23rpx 0 20rpx;
	background-color: #f6f6f6;

	.statistics {
		width: 702rpx;
		height: 156rpx;
		font-family: PingFangSC-Light;
		font-size: 24rpx;
		color: rgba(255, 255, 255, 0.6);
		padding-left: 48rpx;
		padding-top: 26rpx;
		margin: auto;
		box-sizing: border-box;
		background: url(https://s.umeibei.com/app/img/customer_bg.png) top center no-repeat, linear-gradient(134deg, #44455a 0%, #26273a 100%);
		background-size: 100% 100%;
		border-radius: 8rpx;
	}
	.people-num {
		font-size: 48rpx;
		color: #ffffff;
		line-height: 72rpx;
	}

	.list-item {
		position: relative;
		width: 702rpx;
		height: 230rpx;
		margin: 20rpx auto 0;
		background: #ffffff;
		border-radius: 8rpx;
		box-sizing: border-box;

		.customer-account {
			height: 88rpx;
			padding: 0 48rpx;
			color: #26273a;
			font-size: 22rpx;
			box-sizing: border-box;
		}

		.line-between {
			display: flex;
			width: 654rpx;
			height: 2rpx;
			margin: auto;
			background-color: #e8e8e8;

			&:after,
			&:before {
				display: inline-block;
				position: absolute;
				content: '';
				width: 4rpx;
				height: 28rpx;
				top: 74rpx;
				background: #aa7d71;
			}

			&:after {
				left: 0;
				border-radius: 0 20rpx 20rpx 0;
			}

			&:before {
				right: 0;
				border-radius: 20rpx 0 0 20rpx;
			}
		}

		.center-line {
			width: 2rpx;
			height: 48rpx;
			background: #e8e8e8;
		}

		.title {
			font-family: PingFangSC-Regular;
			font-size: 22rpx;
			color: #707184;
			line-height: 32rpx;
			margin-top: 2rpx;
		}

		.current-value {
			font-family: PingFangSC-Medium;
			font-size: 28rpx;
			color: #26273a;
		}
	}
}
</style>
