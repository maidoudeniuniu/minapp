<template>
	<view class="pages">
		<view class="head">
			<view class="medium status-name">{{ order.statusName }}</view>
			<view class="refund-copy-write">{{ order.refundCopyWrite || order.statusName }}</view>
		</view>
		<view class="amount-box">
			<view class="amount-item flexRow flexSpaceBetween flexCenter" v-if="order.realRefundAmount">
				<view class="amount-name">实际退款金额</view>
				<view class="DIN refund-amount">¥{{ order.realRefundAmount }}</view>
			</view>
			<view class="center-line" v-if="order.realRefundAmount"></view>
			<view class="amount-item flexRow flexSpaceBetween flexCenter">
				<view class="amount-name">退款总额</view>
				<view class="DIN refund-amount">¥{{ order.refundAmount }}</view>
			</view>
		</view>
		<view class="goods-card">
			<view class="medium card-title">退款信息</view>
			<template>
				<view class="flexRow goods_item" v-for="(item, index) in order.refundGoodsInfos" :key="index">
					<u-image :src="item.img" mode="aspectFit" :width="220" :height="220" :border-radius="4" bg-color="#FBFBFB"></u-image>
					<view class="flex1 goods-info">
						<view class="multi-line-omit goods-name">{{ item.goodsName }}</view>
						<view class="DIN flexRow flexSpaceBetween goods-spec">
							<view class="">{{ item.specifications | skuFormat }}</view>
							<view class="">x{{ item.quantity }}</view>
						</view>
					</view>
				</view>
			</template>
			<view class="flexRow flexCenter refund-info">
				<view class="refund-name">退款类型</view>
				<view class="refund-des">{{ order.refundorderTypeName }}</view>
			</view>
			<view class="flexRow flexCenter refund-info">
				<view class="refund-name">退款原因</view>
				<view class="refund-des">{{ order.refundReson || '' }}</view>
			</view>
			<view class="flexRow flexCenter refund-info">
				<view class="refund-name">商品金额</view>
				<view class="refund-des">{{ order.refundAmount || 0 }}</view>
			</view>
			<view class="flexRow flexCenter refund-info">
				<view class="refund-name">申请时间</view>
				<view class="refund-des">{{ order.refundTime }}</view>
			</view>
			<view class="flexRow flexCenter refund-info">
				<view class="refund-name">订单编号</view>
				<view class="flexRow flexCenter refund-des">
					<view class="">{{ order.refundTradeNo || '' }}</view>
					<view class="alignItemCenter copy" @click="copy(order.refundTradeNo)">复制</view>
				</view>
			</view>
		</view>
		<view class="flexRow flexCenter flexend buttom-card">
			<contact><view class="alignItemCenter contact">联系客服</view></contact>
		</view>
	</view>
</template>

<script>
import contact from '@/components/contact/contact.vue';
import { refundDetails } from '@/common/api/member.js';
import { GoNavTo, getValue, showToast, sloganshift } from '@/common/js/utils.js';
import paytypeComponent from '@/components/pay/pay.vue';

let OrderTime;
let NumTime = 0;
export default {
	components: {
		paytypeComponent
	},
	data() {
		return {
			payShow: false,
			order: {},
			modelShow: false,
			content: '',
			orderIndex: 0,
			show: false
		};
	},
	components: {
		contact
	},
	onLoad(e) {
		this.getDetail(e.id);
	},
	methods: {
		getDetail(id) {
			//获取详情
			refundDetails({ refundId: id || this.id })
				.then(res => {
					console.log('退款详情=', res);
					this.order = res.body;
				})
				.catch(err => console.log(err));
		},
		//复制
		copy(e) {
			uni.setClipboardData({
				data: e || '',
				success: function() {
					showToast('复制成功');
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.pages {
	width: 750rpx;
	padding-bottom: 110rpx;
	min-height: 100vh;
	background-color: #f6f6f6;
	box-sizing: border-box;
	.head {
		width: 750rpx;
		height: 162rpx;
		color: #ffffff;
		padding: 40rpx 40rpx 0;
		background-color: #26273a;
		box-sizing: border-box;
		.status-name {
			font-family: PingFangSC-Medium;
			font-size: 32rpx;
			line-height: 44rpx;
		}
		.refund-copy-write {
			font-family: PingFangSC-Regular;
			font-size: 24rpx;
			color: #ffffff;
			line-height: 32rpx;
			margin-top: 6rpx;
		}
	}
	.amount-box {
		color: #26273a;
		margin-top: 20rpx;
		background-color: #ffffff;
		.amount-item {
			height: 100rpx;
			padding: 0 24rpx;
			box-sizing: border-box;
		}
		.amount-name {
			font-family: PingFangSC-Regular;
			font-size: 28rpx;
		}
		.refund-amount {
			font-size: 32rpx;
		}
		.center-line {
			width: 702rpx;
			height: 1rpx;
			margin: auto;
			background: #e8e8e8;
		}
	}
	.goods-card {
		padding: 24rpx;
		margin-top: 20rpx;
		background-color: #ffffff;
		box-sizing: border-box;
		.card-title {
			font-family: PingFangSC-Medium;
			font-size: 32rpx;
			color: #26273a;
			line-height: 40rpx;
		}
		.goods_box {
		}
		.goods_item {
			margin-top: 24rpx;
		}
		.goods-name {
			font-family: PingFangSC-Regular;
			font-size: 28rpx;
			color: #26273a;
		}
		.goods-spec {
			font-size: 24rpx;
			color: #707184;
			line-height: 28rpx;
			margin-top: 12rpx;
		}
		.refund-info {
			margin-top: 24rpx;
			font-size: 24rpx;
			line-height: 32rpx;
			font-family: PingFangSC-Regular;
			.refund-name {
				color: #26273a;
			}
			.refund-des {
				color: #707184;
				margin-left: 56rpx;
			}
			.copy {
				width: 62rpx;
				height: 32rpx;
				font-family: PingFangSC-Light;
				font-size: 22rpx;
				color: #707184;
				border: 1rpx solid #707184;
				border-radius: 2rpx;
				box-sizing: border-box;
			}
		}
	}
	.buttom-card {
		position: fixed;
		width: 750rpx;
		height: 110rpx;
		left: 0;
		right: 0;
		bottom: 0;
		padding-right: 24rpx;
		background: #ffffff;
		box-sizing: border-box;
		.contact {
			width: 190rpx;
			height: 64rpx;
			border: 1rpx solid #26273a;
			border-radius: 4rpx;
		}
	}
}
.u-image {
	background-color: #fbfbfb;
}
</style>
