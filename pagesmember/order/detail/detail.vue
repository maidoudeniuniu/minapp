<template>
	<view class="orderDetail xx-warp">
		<view class="orderDetail-info flex1 scrollY" v-if="show" @click="warpClick">
			<view class="orderStatus flexRow">
				<view
					class="orderStatusIcon orderclosed mt3"
					:class="[
						{ Iconorderwaitoshipping: orderData.status == 'paid' },
						{ Iconorderwaittopay: orderData.status == 'no-pay' },
						{ logisticsnotracking: orderData.status == 'delivered' },
						{ ordercomplete: orderData.status == 'finished' }
					]"
				></view>
				<view class="orderStatus_info flex1">
					<view class="orderStatus_type f16">{{ orderData.statusLabel }}</view>
					<view class="orderStatus_txt f12" v-if="orderData.status != 'expired'">
						<text v-if="orderData.status == 'no_pay' || orderData.status == 'delivered'">{{ orderData.statusCopyWriteCN }}</text>
						<text v-else>{{ orderData.statusCopyWrite }}</text>
					</view>
					<view class="orderStatus_txt f12" v-if="orderData.status == 'expired'">再逛逛，下一件一定是有缘的商品</view>
				</view>
			</view>
			<view class="order_address">
				<!-- v-if="orderData.status=='delivered'" -->
				<view class="address-selete-user address_user flexRow borderBottom" v-if="orderData.status == 'delivered'">
					<view class="flex1 address_user_info flexRow">
						<view class="logisticsicon f14"></view>
						<view class="flex1 f14 address_user_text flexColumn">
							<view class="DINM"><text class="f14 bold mr5">点击复制物流单号</text></view>
							<view class="f12 grey1 mt3">
								<text class="mr5">{{ orderData.expressNo }}</text>
								<text class="xx-item-tags" @click="Ordercopy"><text class="xxtag-mins f11">复制</text></text>
							</view>
						</view>
						<!-- <view class="address_icon"></view> -->
					</view>
				</view>
				<view class="address-selete-user address_user flexRow">
					<view class="flex1 address_user_info flexRow">
						<view class="shouicon f14"></view>
						<view class="flex1 f14 address_user_text flexColumn">
							<view class="DINM">
								<text class="f14 bold mr5">{{ orderData.recipient.name }}</text>
								<text class="f16">{{ orderData.recipient.phone }}</text>
							</view>
							<view class="f12 grey1 mt3">
								<text>{{ orderData.recipient.postAddress }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="order_item mt10">
				<view class="xx-item" v-for="(item, index) in orderData.items" :key="index">
					<view class="xx-item-img"><image :src="item.img" mode="aspectFit" style="width: 220rpx;height: 220rpx;"></image></view>
					<view class="xx-item-info">
						<view class="xx-item-info-bd">
							<view class="xx-item-title f14">{{ item.goodsName }}</view>
							<view class="xx-item-type mt6 flexRow flexSpaceBetween">
								<view class="xx-item-tags" v-for="(itm, ix) in item.specifications" :key="ix">
									<text class="DIN f12 grey1">{{ itm }}</text>
								</view>
								<view class="xx-item-number grey1 DIN">x{{ item.quantity }}</view>
							</view>
						</view>
						<view class="xx-item-info-fd flexRow flexSpaceBetween flex1">
							<view class="flexend flexColumn">
								<view class="xx-item-price mb3">
									<text class="f16 DIN">¥{{ item.realPrice }}</text>
									<text class="f12 grey2">
										原价
										<text class="f12 grey2 pl3 DINLight relative">
											¥{{ item.price }}
											<text class="delprice"></text>
										</text>
									</text>
								</view>
								<view v-if="item.slogan">
									<text class="viptag">
										<text class="viptxt">{{ item.slogan }}</text>
									</text>
								</view>
							</view>
							<view class="flexend flexColumn">
								<view class="xx-item-tags" v-if="orderData.status == 'paid'"><text class="DIN f12  xxtag-min">退款</text></view>
							</view>
						</view>
					</view>
				</view>
				<view class="mt14 alignRight" v-if="orderData.status != 'expired' && orderData.status != 'closed'">
					<text class="f12">共{{ orderData.items.length }} 件 {{ orderData.status == 'no_pay' ? '需付款' : '实付款' }}:</text>
					<text class="DINM f16">¥{{ orderData.amount }}</text>
				</view>
			</view>
			<view class="order_order mt10 mb10">
				<view class="xx-list">
					<view class="xx-list-item">
						<view class="xx-list-item-babel f12">订单编号</view>
						<view class="xx-list-item-info grey1 flexRow">
							<view class="mr5 f12" style="line-height: 46rpx;">{{ orderData.orderSn }}</view>
							<view class="xx-item-tags" @click="copy"><text class="xxtag DIN f12">复制</text></view>
						</view>
					</view>
					<view class="xx-list-item">
						<view class="xx-list-item-babel f12">下单时间</view>
						<view class="xx-list-item-info grey1 f12">{{ orderData.time_cn }}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="orderDetail-footer flexRow flexSpaceBetween">
			<view class="relative">
				<view class="iconmore" @click="isorder"></view>
				<view class="xx-order-fixed xx-order-bottom-fixed" style="left:40rpx;" v-if="orderData.show">
					<text class="xx-order-doc"></text>
					<view class="relative xx-order-fixed-info">
						<view class="xx-order-fixed-item" v-if="orderData.status == 'expired'" @click="delOrder">删除订单</view>
						<view class="xx-order-fixed-item" v-if="orderData.status == 'no_pay'" @click="cancelOrderClick">取消订单</view>
						<view class="xx-order-fixed-item" v-if="orderData.status == 'paid' && orderData.orderType != 'pack'" @click="refundApply(orderData)">我要退款</view>
						<contact><view class="xx-order-fixed-item">联系客服</view></contact>
					</view>
				</view>
			</view>
			<view class="flexRow flex1 flexend" @click="warpClick">
				<view class="mr5" v-if="orderData.status == 'delivered'"><u-button @click="logistics">查看物流</u-button></view>
				<view class="mr5" v-if="orderData.status == 'no_pay'"><u-button type="primary" @click="paylistClick">立即支付</u-button></view>
				<view class="" v-if="orderData.status == 'delivered'"><u-button type="primary" @click="confirmGoods(orderData.id)">确认收货</u-button></view>
			</view>
		</view>
		<u-modal v-model="modelShow" :content="content" @confirm="delConfirm" :show-cancel-button="true" :show-title="false" border-radius="4rpx" confirm-color="#26273A"></u-modal>
		<paytype-component :show="payShow" @emitClose="closePay" @emitConfim="emitConfim"></paytype-component>
	</view>
</template>

<script>
import contact from '@/components/contact/contact.vue';
import { ordersDetails, Pay, ordersCancel, confirmReceipt } from '@/common/api/member.js';
import { ArrayList, TimeLength, statusCN, showToast, getValue, GoNavTo, sloganshift } from '@/common/js/utils.js';
import paytypeComponent from '@/components/pay/pay.vue';
let orderDataTime;
export default {
	data() {
		return {
			cid: null,
			content: '',
			modelShow: false,
			orderData: {},
			orderTime: 0,
			show: false,
			payShow: false
		};
	},
	components: {
		paytypeComponent,
		contact
	},
	onHide() {
		this.clearOrderTime();
	},
	onUnload() {
		this.clearOrderTime();
	},
	onLoad(e) {
		this.cid = e.id;
	},
	onShow() {
		this.detail();
	},
	methods: {
		//取消订单
		async cancelOrder() {
			const reset = await ordersCancel({
				id: this.orderData.id
			});
			if (reset && reset.success) {
				showToast('取消订单成功');
				this.detail();
			}
		},
		cancelOrderClick() {
			this.content = '确定要取消订单?';
			this.modelShow = true;
		},
		delConfirm() {
			this.modelShow = false;
			this.cancelOrder();
		},
		//清除是否弹框的现场
		warpClick() {
			this.$SubOrder.nofiy('nofiy');
		},
		closePay() {
			this.payShow = false;
		},
		emitConfim(e) {
			this.payShow = false;
			this.Paylist(e);
		},
		paylistClick() {
			// #ifdef MP-WEIXIN
			this.Paylist({
				payChannel: 'wx_ma'
			});
			// #endif
			// #ifdef APP-PLUS
			this.goPayAppSubmit();
			// #endif

			this.warpClick();
		},
		goPayAppSubmit() {
			this.payShow = true;
		},
		async Paylist(param) {
			let _this = this;
			let e = this.orderData;
			let payer = getValue('payerId');
			let data = {
				amount: e.amount,
				id: parseFloat(e.id),
				payChannel: param.payChannel
			};
			// #ifdef MP-WEIXIN
			data.payer = payer;
			// #endif
			const reset = await Pay(data);
			if (reset && reset.success) {
				if (param.payChannel == 'wx_ma') {
					this.wxmp(reset.body);
				}
				if (param.payChannel == 'ali_app' || param.payChannel == 'wx_app') {
					this.appPay(param, reset.body);
				}
			}
		},
		// app 支付
		appPay(param, e) {
			uni.requestPayment({
				provider: param.provider,
				orderInfo: e, //微信、支付宝订单数据 【注意微信的订单信息，键值应该全部是小写，不能采用驼峰命名】
				success: function(res) {
					this.detail();
				},
				fail: function(err) {
					showToast('付款失败');
				}
			});
		},
		//微信小程序支付
		wxmp(e) {
			let { nonceStr, packageValue, paySign, signType, timeStamp } = e;
			uni.requestPayment({
				provider: 'wxpay',
				timeStamp: timeStamp,
				nonceStr: nonceStr,
				package: packageValue,
				signType: signType,
				paySign: paySign,
				success: function(res) {
					this.detail();
				},
				fail: function(err) {
					showToast('付款失败');
				}
			});
		},
		logistics() {
			console.log('-------------');
			const { express, expressNo } = this.orderData;
			GoNavTo({
				url: `/pagesmember/order/logistics/logistics?express=${express}&expressno=${expressNo}`
			});
		},
		confirmGoods(id) {
			//确认收货
			confirmReceipt({ id })
				.then(res => {
					console.log('确认收货成功=', res);
					this.detail();
					showToast('确认收货成功', 'success');
				})
				.catch();
		},
		isorder() {
			this.orderData.show = !this.orderData.show;
		},
		Ordercopy() {
			uni.setClipboardData({
				data: this.orderData.orderSn,
				success: function() {
					showToast('复制成功');
				}
			});
		},
		copy() {
			uni.setClipboardData({
				data: this.orderData.orderSn,
				success: function() {
					showToast('复制成功');
				}
			});
		},
		//倒计时
		startOrder() {
			if (this.orderTime > 0) {
				this.orderTime--;
				if (this.orderData.status == 'no_pay') {
					this.orderData.statusCopyWriteCN = this.orderData.statusCopyWrite.replace(/\%s/g, Math.ceil(this.orderTime / 60));
				} else if (this.orderData.status == 'delivered') {
					this.orderData.statusCopyWriteCN = this.orderData.statusCopyWrite.replace(/\%s天%s/g, Math.ceil(this.orderTime));
				}
			} else {
				this.clearOrderTime();
				this.detail();
			}
		},
		//清除定时器
		clearOrderTime() {
			orderDataTime && clearInterval(orderDataTime);
		},
		async detail() {
			let _this = this;
			this.clearOrderTime();
			const reset = await ordersDetails({
				id: this.cid
			});
			if (reset && reset.success) {
				let data = reset.body;
				data.items = data.items.map(item => {
					return {
						...item,
						specifications: ArrayList(item.specifications),
						slogan: item.slogan ? sloganshift(item.slogan) : ''
					};
				});
				data.time_cn = TimeLength(data.gmtCreate, 5);
				data.status_cn = statusCN(data.status);
				data.show = false;
				this.orderData = data;
				//订单详情是待支付的时候，需要倒计时
				if (data.status == 'no_pay' || data.status == 'delivered') {
					let endTime = new Date(data.gmtCreate).getTime() + (data.status == 'delivered' ? 15 * 24 * 60 * 60 * 1000 : 15 * 60 * 1000);
					this.orderTime = Math.ceil((endTime - data.sysTimeStamp) / 1000);
					console.log(this.orderTime);
					if (this.orderTime > 0) {
						orderDataTime = setInterval(this.startOrder, 1000);
					} else {
						data.statusCopyWriteCN = data.statusCopyWrite.replace(/\%s/g, '');
					}
				}
				this.$SubOrder.addListent('clearOrder' + this.orderData.id, {
					fn: function() {
						_this.orderData.show = false;
					}
				});
				this.show = true;
			}
		},
		//我要退款
		refundApply(e) {
			GoNavTo({
				url: `/pagesmember/order/applyrefund/applyrefund?data=${JSON.stringify(e)}`
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.xx-warp {
	width: 100vw;
	height: 100vh;
	overflow: hidden;
	background: #f6f6f6;

	.logisticsicon {
		background: url(../../../static/logisticsnotracking.png) center center #303149 no-repeat;
		background-size: 40rpx auto;
		height: 56rpx;
		width: 56rpx;
		border-radius: 56rpx;
		margin: 36rpx 24rpx 36rpx 0;
	}

	.xxtag {
		padding: 0 20rpx;
		margin-left: 12rpx;
	}

	.order_address {
		background: #ffffff;
	}

	.orderStatus {
		padding: 40rpx;
		background: #26273a;
		height: 162rpx;

		.orderclosed {
			background: url(../../../static/Iconorderwaittopay.png) center center no-repeat;
			background-size: 70rpx auto;
			width: 70rpx;
			height: 70rpx;
			margin-right: 40rpx;
		}

		.Iconorderwaitoshipping {
			background: url(../../../static/Iconorderwaitoshipping.png) center center no-repeat;
			background-size: 70rpx auto;
		}

		.Iconorderwaittopay {
			background: url(../../../static/Iconorderwaittopay.png) center center no-repeat;
			background-size: 70rpx auto;
		}

		.logisticsnotracking {
			background: url(../../../static/logisticsnotracking.png) center center no-repeat;
			background-size: 70rpx auto;
		}

		.ordercomplete {
			background: url(../../../static/ordercomplete.png) center center no-repeat;
			background-size: 70rpx auto;
		}

		.orderStatus_type {
			color: #ffffff;
		}

		.orderStatus_txt {
			color: #ffffff;
			margin-top: 6rpx;
		}
	}

	.iconmore {
		background: url(../../../static/iconmore.png) center center no-repeat;
		background-size: 44rpx auto;
		width: 80rpx;
		height: 60rpx;
		margin-top: 10rpx;
		margin-left: 34rpx;
	}

	.delprice {
		position: absolute;
		top: 50%;
		left: 0;
		height: 2rpx;
		background: #b1b2c1;
		right: 0;
	}

	.address_user {
		background: #ffffff;
		margin: 0 20rpx;

		.address_user_info {
			.shouicon {
				height: 56rpx;
				width: 56rpx;
				background: url(../../../static/shouicon.png) center center no-repeat;
				background-size: 56rpx auto;
				line-height: 56rpx;
				border-radius: 56rpx;
				margin: 36rpx 24rpx 36rpx 0;
				text-align: center;
			}

			.address_user_text {
				margin: 24rpx 0;
			}
		}
		.address_icon {
			height: 56rpx;
			width: 56rpx;
			background: url(../../../static/moreicon.png) center center no-repeat;
			background-size: 32rpx auto;
			margin-top: 30rpx;
		}
	}

	.order_item {
		background: #ffffff;
		padding: 24rpx;

		.xx-item {
			background: #ffffff;
			display: flex;
			flex-direction: row;
			margin-bottom: 20rpx;

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
					flex: 1;
					display: flex;
					flex-direction: column;

					.xx-item-title {
						max-height: 80rpx;
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
	}
}

.orderDetail-footer {
	background: #ffffff;
	padding: 22rpx 30rpx 40rpx 0;
}
</style>
