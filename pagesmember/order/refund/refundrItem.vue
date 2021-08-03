<template>
	<view class="flexColumn">
		<view class="xx-order-hd flexRow flexSpaceBetween">
			<view class="DINM f14">{{ $u.timeFormat(order.applyTime, 'yyyy-mm-dd hh:MM') }}</view>
			<view class="red1 f14">{{ order.refundTypeClazz }}</view>
		</view>
		<view class="xx-order-content flexColumn">
			<view class="xx-item" v-for="(itemShop, shopindex) in order.items" :key="shopindex" @click="detailClick(order.orderId)">
				<view class="xx-item-img"><image :src="itemShop.img" mode="aspectFit" style="width: 220rpx;height: 220rpx;"></image></view>
				<view class="xx-item-info">
					<view class="xx-item-info-bd">
						<view class="xx-item-title f14">{{ itemShop.name }}</view>
					</view>
					<view class="xx-item-type flexRow flexSpaceBetween flex1">
						<view class="flexRow">
							<text class="DIN grey1 f12">{{ itemShop.specifications | skuFormat }}</text>
						</view>
						<view class="xx-item-number grey1 DIN">x1</view>
					</view>
					<view class="xx-item-info-fd">
						<view class="xx-item-price mb3">
							<text class="f12">退款金额:</text>
							<text class="f12 bold">{{ itemShop.amount }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="xx-item-detail-info flexRow flexSpaceBetween">
			<view class="f14">
				<text class="f14 bold">{{ order.statusClazz }}:</text>
				<text class="f14 DIN bold">{{ order.amount }}元</text>
			</view>
			<view class="f14 grey1 showDetail" @click="seeDetail(order.refundId)">查看详情</view>
		</view>
	</view>
</template>

<script>
import { Pay, ordersDelete } from '@/common/api/member.js';
import { GoNavTo, getValue, showToast } from '@/common/js/utils.js';
let OrderTime;
let NumTime = 0;
export default {
	props: {
		orderData: {
			type: Object,
			default: () => {}
		}
	},
	data() {
		return {
			order: {},
			orderIndex: 0,
			show: false
		};
	},
	destroyed() {
		clearTimeout(OrderTime);
	},
	mounted() {
		this.order = this.orderData;
		this.show = true;
		if (this.order.status == 'no_pay') {
			this.timeOut();
		}
	},
	methods: {
		//删除订单
		async delOrder() {
			const reset = await ordersDelete({
				id: this.order.id
			});
			if (reset && reset.success) {
				showToast('删除成功');
				this.$emit('emitOrder', {
					type: 'del',
					data: this.order.id
				});
			}
		},
		isorder() {
			this.order.show = !this.order.show;
		},
		detailClick(id) {
			GoNavTo({
				url: '/pagesmember/order/detail/detail?id=' + id
			});
		},
		timeOut() {
			let { timeCnAll, createTime } = this.order;
			let endTime = new Date(createTime).getTime() + 15 * 60 * 1000;
			let curTime = this.order.sysTimeStamp;
			NumTime = parseInt((endTime - curTime) / 1000);
			if (NumTime > 0) {
				OrderTime = setInterval(this.startTime, 1000);
			} else {
				clearTimeout(OrderTime);
			}
		},
		startTime() {
			if (NumTime > 0) {
				this.orderIndex = 1;
				NumTime--;
				console.log(NumTime);
			} else {
				clearTimeout(OrderTime);
				this.$emit('emitOrder', this.order);
			}
		},
		async Paylist() {
			let _this = this;
			let e = this.order;
			const openId = getValue('openId');
			const reset = await Pay({
				amount: e.amount,
				id: parseFloat(e.id),
				payChannel: 'wx_ma',
				payer: openId
			});
			if (reset && reset.success) {
				let { nonceStr, packageValue, paySign, signType, timeStamp } = reset.body;
				uni.requestPayment({
					provider: 'wxpay',
					timeStamp: timeStamp,
					nonceStr: nonceStr,
					package: packageValue,
					signType: signType,
					paySign: paySign,
					success: function(res) {
						_this.$emit('emitOrder');
					},
					fail: function(err) {
						showToast('付款失败');
					}
				});
			}
		},
		//查看详情
		seeDetail(id) {
			GoNavTo({ url: '/pagesmember/order/refundDetail/refundDetail?id=' +  id});
		}
	}
};
</script>

<style lang="scss" scoped>
.xx-item-detail-info {
	background: #f6f6f6;
	padding: 16rpx 20rpx;
	border-radius: 4rpx;
	.showDetail {
		background: url(../../../static/moreicon.png) center right no-repeat;
		background-size: 32rpx auto;
		padding-right: 36rpx;
		height: 32rpx;
		line-height: 32rpx;
	}
}
.xx-item {
	background: #ffffff;
	padding: 24rpx 24rpx 24rpx 0;
	display: flex;
	flex-direction: row;
	.xx-item-img {
		width: 220rpx;
		height: 220rpx;
		overflow: hidden;
		margin-right: 24rpx;
		background-color: #fbfbfb;
	}
	.xx-item-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		.xx-item-info-bd {
			// flex: 1;
			display: flex;
			flex-direction: column;
			margin-bottom: 12rpx;
			.xx-item-title {
				max-height: 70rpx;
				overflow: hidden;
			}
			.xx-item-number {
				height: 52rpx;
				line-height: 52rpx;
			}
		}
		.xx-item-info-fd {
			.xx-item-price {
			}
		}
	}
}
</style>
