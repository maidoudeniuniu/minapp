<template>
	<view class="flexColumn" v-if="show">
		<view class="xx-order-hd flexRow flexSpaceBetween" @click="warpClick">
			<view class="DINM f14">{{ order.time_cn }}</view>
			<view class="red1 f14">{{ order.status_cn }}</view>
		</view>
		<view class="xx-order-content flexColumn">
			<view class="xx-item" v-for="(itemShop, shopindex) in order.items" :key="shopindex" @click="detailClick()">
				<view class="xx-item-img"><image :src="itemShop.img" mode="aspectFit" style="width: 220rpx;height: 220rpx;"></image></view>
				<view class="xx-item-info">
					<view class="xx-item-info-bd">
						<view class="xx-item-title f14">{{ itemShop.goodsName }}</view>
					</view>
					<view class="xx-item-type flexRow flexSpaceBetween flex1 mt3">
						<view class="flexRow flex1 flexwrap">
							<view class="xx-item-tags mb3 inlineBlock mr5" v-for="(specifications, sindex) in itemShop.specifications" :key="sindex">
								<text class="f11 grey1">{{ specifications }}</text>
							</view>
						</view>
						<view class="xx-item-number grey1 DIN">x{{ itemShop.quantity }}</view>
					</view>
					<view class="xx-item-info-fd">
						<view class="xx-item-price mb3">
							<text class="f16 DIN">¥{{ itemShop.realPrice }}</text>
							<text class="f12 grey2">
								原价
								<text class="f12 grey2 pl3 DINLight relative" v-if="itemShop.price">
									¥{{ itemShop.price }}
									<text class="delprice"></text>
								</text>
							</text>
						</view>
						<view>
							<text class="viptag" v-if="itemShop.slogan_cn">
								<text class="viptxt">{{ itemShop.slogan_cn }}</text>
							</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="xx-order-fb flexColumn" style="justify-content: flex-end;">
			<view class="xx-order-fb-item flexRow">
				<view class="flexColumn flexend relative">
					<view class="iconmore" @click="isorder"></view>
					<view class="xx-order-fixed" v-if="order.show" :class="[{ orderFixedAtive: order.status == 'no_pay' }, { orderFixedAtive: order.status == 'delivered' }]">
						<text class="xx-order-doc"></text>
						<view class="relative xx-order-fixed-info">
							<view class="xx-order-fixed-item" v-if="order.status == 'expired'" @click="delOrder">删除订单</view>
							<view class="xx-order-fixed-item" v-if="order.status == 'no_pay'" @click="cancelOrder">取消订单</view>
							<view class="xx-order-fixed-item" v-if="order.status == 'paid' && order.orderType != 'pack'" @click="refundClick(order)">我要退款</view>
							<contact><view class="xx-order-fixed-item">联系客服</view></contact>
						</view>
					</view>
				</view>
				<view class="flexColumn flex1" @click="orderClick">
					<view class="alignRight" v-if="order.status != 'expired' && order.status != 'closed'">
						<text class="f12">共{{ order.items.length }} 件 {{ order.status == 'no_pay' ? '需付款' : '实付款' }}:</text>
						<text class="f16 DINM">¥{{ order.amount }}</text>
					</view>
					<view class="mt12 alignRight flexRow flexend">
						<view class="ml5"><u-button size="medium" v-if="order.status == 'delivered'" @click="logistics">查看物流</u-button></view>
						<view class="ml5"><u-button size="medium" type="primary" v-if="order.status == 'no_pay'" @click="Paylist">立即支付</u-button></view>
						<view class="ml5"><u-button size="medium" type="primary" v-if="orderData.status == 'delivered'" @click="confirmGoods(order.id)">确认收货</u-button></view>
					</view>
				</view>
			</view>
		</view>
		<u-modal v-model="modelShow" :content="content" @confirm="delConfirm" :show-cancel-button="true" :show-title="false" border-radius="4rpx" confirm-color="#26273A"></u-modal>
		<paytype-component :show="payShow" @emitClose="closePay" @emitConfim="emitConfim"></paytype-component>
	</view>
</template>

<script>
import contact from '@/components/contact/contact.vue';
import { Pay, ordersDelete, ordersCancel, confirmReceipt } from '@/common/api/member.js';
import { GoNavTo, getValue, showToast, sloganshift } from '@/common/js/utils.js';
import paytypeComponent from '@/components/pay/pay.vue';

let OrderTime;
let NumTime = 0;
export default {
	props: {
		orderData: {
			type: Object,
			default: () => {}
		}
	},
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
	destroyed() {
		clearTimeout(OrderTime);
	},
	mounted() {
		let _this = this;
		this.order = this.orderData;
		this.show = true;
		this.$SubOrder.addListent('clearOrder' + this.order.id, {
			fn: function() {
				_this.order.show = false;
			}
		});
	},
	methods: {
		closePay() {
			this.payShow = false;
		},
		async emitConfim(e) {
			let data = {
				amount: e.amount,
				id: parseFloat(e.id),
				payChannel: e.payChannel
			};
			const reset = await Pay(data);
			if (reset && reset.success) {
				this.appPay(e, reset.body);
			}
		},
		// app 支付
		appPay(param, e) {
			console.log(JSON.stringify(e));
			let _this = this;
			uni.requestPayment({
				provider: param.provider,
				orderInfo: e, //微信、支付宝订单数据 【注意微信的订单信息，键值应该全部是小写，不能采用驼峰命名】
				success: function(res) {
					showToast('付款成功');
					_this.$emit('emitOrder', {});
				},
				fail: function(err) {
					showToast('付款失败');
				}
			});
		},
		//清除是否弹框的现场
		orderClick() {
			this.order.show = false;
		},
		warpClick() {
			this.$SubOrder.nofiy('nofiy');
		},
		logistics() {
			const { express, expressNo } = this.order;
			GoNavTo({
				url: `/pagesmember/order/logistics/logistics?express=${express}&expressno=${expressNo}`
			});
		},
		//我要退款
		refundClick(e) {
			GoNavTo({
				url: '/pagesmember/order/applyrefund/applyrefund?data=' + JSON.stringify(e)
			});
		},
		//删除订单
		delOrder() {
			this.content = '确定要删除订单?';
			this.modelShow = true;
		},
		async delConfirm(e) {
			const reset = await ordersDelete({
				id: this.order.id
			});
			if (reset && reset.success) {
				showToast('删除成功', 'success');
				this.$emit('emitOrder', {
					type: 'del',
					data: this.order.id
				});
			}
		},
		//取消订单
		async cancelOrder() {
			const reset = await ordersCancel({
				id: this.order.id
			});
			if (reset && reset.success) {
				showToast('取消订单成功', 'success');
				this.$emit('emitOrder', {
					type: 'cancel',
					data: this.order.id
				});
			}
		},
		isorder() {
			this.order.show = !this.order.show;
		},
		detailClick(e) {
			GoNavTo({
				url: '/pagesmember/order/detail/detail?id=' + this.order.id
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
		//支付集合，判断是小程序还是app
		Paylist() {
			// #ifdef APP-PLUS
			this.goPayAppSubmit();
			// #endif

			// #ifdef MP-WEIXIN
			this.mppaylist();
			// #endif
		},
		// app 支付
		goPayAppSubmit() {
			this.payShow = true;
		},
		//小程序支付
		async mppaylist() {
			let _this = this;
			let e = this.order;
			const payerId = getValue('payerId');
			const reset = await Pay({
				amount: e.amount,
				id: parseFloat(e.id),
				payChannel: 'wx_ma',
				payer: payerId
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
		confirmGoods(id) {
			//确认收货
			confirmReceipt({ id })
				.then(res => {
					console.log('确认收货成功=', res);
					showToast('确认收货成功', 'success');
					this.$emit('emitOrder', {
						type: 'confirm',
						data: id
					});
				})
				.catch();
		}
	}
};
</script>

<style lang="scss" scoped>
.xxtag {
	overflow: hidden;
}
.xx-order-fb {
	justify-items: flex-end;

	.xx-order-fb-item {
		width: 100%;
		justify-content: space-between;
	}

	.iconmore {
		background: url(../../static/iconmore.png) center center no-repeat;
		background-size: 44rpx auto;
		width: 80rpx;
		height: 60rpx;
	}
}

.delprice {
	position: absolute;
	top: 50%;
	left: 0;
	height: 2rpx;
	background: #b1b2c1;
	right: 0;
}

.xx-item {
	background: #ffffff;
	padding: 24rpx;
	display: flex;
	flex-direction: row;

	.xx-item-img {
		width: 220rpx;
		height: 220rpx;
		overflow: hidden;
		margin-right: 24rpx;
	}

	.xx-item-info {
		flex: 1;
		display: flex;
		flex-direction: column;

		.xx-item-info-bd {
			display: flex;
			flex-direction: column;

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
