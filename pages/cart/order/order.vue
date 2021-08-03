<template>
	<layout :BP="false" background="#ffffff">
		<view class="xx-warp" v-if="show">
			<view class="xx-warp-cart flexColumn">
				<view class="mt10"><address-component :addressData="addressData" :addressId="addressData.id ? addressData.id : ''"></address-component></view>
				<view class="flex1 mt10 cartItem">
					<u-card :show-head="false" margin="0rpx 24rpx" border-radius="8" :border="false" :head-border-bottom="false" :foot-border-top="false">
						<view class="" slot="body">
							<view class="xx-item" v-for="(item, index) in Cartdata" :key="index" @click="detailClick(item)">
								<view class="xx-item-img"><image :src="item.img" mode="aspectFit" style="width: 220rpx;height: 220rpx;background-color: #FBFBFB;"></image></view>
								<view class="xx-item-info">
									<view class="xx-item-info-bd">
										<view class="xx-item-title f14">{{ item.goodsName }}</view>
										<view class="xx-item-type mt6 flexRow flexSpaceBetween">
											<view class="xx-item-tags">
												<text class="xxtag DIN f12" style="border: none;">{{ item.specifications }}</text>
											</view>
											<view class="xx-item-number grey1 DIN">x{{ item.quantity }}</view>
										</view>
									</view>
									<view class="xx-item-info-fd">
										<view class="xx-item-price mb3 flexRow flexSpaceBetween">
											<view class="">
												<text class="f16 DIN">¥{{ item.realPrice }}</text>
												<template v-if="item.discountInfo.grade !== 'E'">
													<text class="f12 grey2 DIN relative">
														原价
														<text class="f12 grey2 DIN relative">
															¥{{ item.price }}
															<text class="delprice"></text>
														</text>
													</text>
												</template>
											</view>
										</view>
										<view v-if="item.discountInfo && item.discountInfo.slogan_cn && item.discountInfo.grade !== 'E'">
											<text class="viptag">
												<text class="viptxt">{{ item.discountInfo.slogan_cn }}</text>
											</text>
										</view>
									</view>
								</view>
							</view>
							<view class="cart-Total flexColumn">
								<view class="cart-freight flexRow flexSpaceBetween">
									<view class="label grey1 alignRight f12" style="width: 220rpx;">运费</view>
									<view class="flex1 alignRight grey1">¥{{ data.expressFee }}</view>
								</view>
								<view class="cart-freight flexRow flexSpaceBetween mt12">
									<view class="label grey1" style="width: 220rpx;"></view>
									<view class="flex1 alignRight">
										<text class="f14 DINM">
											共
											<text>{{ data.quantity }}</text>
											件 实付款:
										</text>
										<text class="DINM f16">¥{{ data.amount }}</text>
									</view>
								</view>
							</view>
						</view>
					</u-card>
				</view>
			</view>
			<view class="xx-warp-fb flexRow flexSpaceBetween">
				<view class="">
					<view class="">
						<text class="DIN f12" style="color:#26273A">合计:</text>
						<text class="DINM f16 bold">￥{{ data.amount }}</text>
					</view>
					<view class="grey1">
						优惠
						<text class="DINM red1">￥{{ data.deduct }}</text>
					</view>
				</view>
				<view class=""><view class="submit" type="primary" @click="goPayOrderSubmit">提交订单</view></view>
			</view>
			<invitation-component v-if="invShow" @confirmEmit="confirmEmit" :inviterId="inviterId"></invitation-component>
			<paytype-component :show="payShow" @emitClose="closePay" @emitConfim="emitConfim"></paytype-component>
		</view>
	</layout>
</template>

<script>
import { ordersCompute, ordersSubmit } from '@/common/api/goods.js';
import { setValue, getValue, showToast, GoNavTo, sloganshift } from '@/common/js/utils.js';
import { Pay, accountAddressList, mineAccountInfo, accountAddressGet } from '@/common/api/member.js';
import addressComponent from './address.vue';
import invitationComponent from '@/components/invitation/invitation.vue';
import paytypeComponent from '@/components/pay/pay.vue';
export default {
	data() {
		return {
			type: '',
			cdata: [],
			payShow: false,
			Cartdata: [],
			data: {},
			addressData: {},
			Ipshow: false,
			show: false,
			inviterId: '',
			invShow: false
		};
	},
	components: {
		addressComponent,
		invitationComponent,
		paytypeComponent
	},
	onLoad(e) {
 		this.initializeData(e.data)
		// this.type = e.type || 'cart';
		// if (e && e.data) {
		// 	this.cdata = JSON.parse(e.data);
		// 	setValue('ordersCompute', e.data);
		// } else {
		// 	setValue('ordersCompute', '[]');
		// }
		// this.list();
		this.address();
	},
	onShow() {
		let _this = this;
		uni.$on('handClickAddress', res => {
			console.log(res);
			_this.addressData = res;
			console.log(_this.addressData);
			// 清除监听
			uni.$off('handClickAddress');
		});

		uni.$on('handClickRebeak', res => {
			// 清除监听
			uni.$off('handClickRebeak');
		});
	},
	mounted() {
		let that = this;
		wx.getSystemInfo({
			success: res => {
				let modelmes = res.model;
				that.modelmes = modelmes;
				if (res.windowHeight > 800 || modelmes.search('iPhone X') != -1 || modelmes.search('iPhoneX') != -1) {
					that.Ipshow = true;
				}
			}
		});
	},
	methods: {
		async address() {
			const reset = await accountAddressGet();
			if (reset && reset.success) {
				this.addressData = reset.body || {};
			}
		},
		closePay() {
			this.payShow = false;
		},
		emitConfim(e) {
			this.payShow = false;
			this.goPayOrder(e);
		},
		//app 环境下，触发支付方式
		goPayAppSubmit() {
			this.payShow = true;
		},
		confirmEmit(e) {
			console.log(e);
			this.invShow = false;
			if (e) {
				this.inviterId = e;
				// #ifdef APP-PLUS
				this.goPayAppSubmit();
				// #endif

				// #ifdef MP-WEIXIN
				this.goPayOrder({
					payChannel: 'wx_ma'
				});
				// #endif
			}
		},
		async list() {
			let data = {
				channel: this.type
			};
			if (this.type == 'cart') {
				data.cartIds = this.cdata.map(item => item.cartId);
			} else if (this.type == 'direct' || this.type == 'pack_direct') {
				data.items = this.cdata;
			}
			const reset = await ordersCompute(data);
			if (reset && reset.success) {
				this.data = reset.body;
				this.Cartdata = reset.body.items.map(item => {
					return {
						...item,
						discountInfo: Object.assign(item.discountInfo, {
							slogan_cn: sloganshift(item.discountInfo.slogan)
						}),
						specifications: item.specifications ? JSON.parse(item.specifications).join('') : ''
					};
				});
				this.show = true;
			} else {
				setTimeout(() => {
					uni.navigateBack();
				}, 1000);
			}
		},
		async goPayOrderSubmit() {
			if (!this.addressData || (this.addressData && Object.keys(this.addressData).length < 1)) {
				showToast('收货地址没有选择');
				return;
			}

			// 判断当前用户是否首购
			if (this.data.firstBuy) {
				this.inviterId = getValue("inviterId")
				this.invShow = true;
				return;
			}

			// #ifdef APP-PLUS
			this.goPayAppSubmit();
			// #endif

			// #ifdef MP-WEIXIN
			this.goPayOrder({
				payChannel: 'wx_ma'
			});
			// #endif
		},
		//提交订单
		async goPayOrder(param) {
			let _data = this.data;
			var data = {
				address: this.addressData,
				content: _data,
				requestId: '' + _data.requestId
			};
			if (this.inviterId) {
				data.inviterId = this.inviterId;
			}
			const reset = await ordersSubmit(data);
			if (reset && reset.success) {
				//支付渠道（ali_app->支付宝APP；wx_app->微信APP; ali_ma->支付宝小程序；wx_ma->微信小程序；ali_h5->支付宝H5页面；wx_h5->微信H5页面）
				setValue('cart', null);
				this.Paylist(reset.body, param);
			}
		},
		async Paylist(e, param) {
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
				console.log(JSON.stringify(reset));
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
			console.log(JSON.stringify(e));
			uni.requestPayment({
				provider: param.provider,
				orderInfo: e, //微信、支付宝订单数据 【注意微信的订单信息，键值应该全部是小写，不能采用驼峰命名】
				success: function(res) {
					GoNavTo({
						type: 'redirectTo',
						url: '/pagesmember/order/order'
					});
				},
				fail: function(err) {
					GoNavTo({
						type: 'redirectTo',
						url: '/pagesmember/order/order'
					});
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
					GoNavTo({
						type: 'redirectTo',
						url: '/pagesmember/order/order'
					});
				},
				fail: function(err) {
					GoNavTo({
						type: 'redirectTo',
						url: '/pagesmember/order/order'
					});
				}
			});
		},
		//初始化数据
		initializeData(data) {
			data = JSON.parse(data);
			this.data = data;
			this.Cartdata = data.items.map(item => {
				return {
					...item,
					discountInfo: Object.assign(item.discountInfo, {
						slogan_cn: sloganshift(item.discountInfo.slogan)
					}),
					specifications: item.specifications ? JSON.parse(item.specifications).join('') : ''
				};
			});
			this.show = true;
		}
	}
};
</script>

<style lang="scss" scoped>
.xx-warp {
	flex: 1;
	display: flex;
	flex-direction: column;
	overflow: hidden;

	.xx-warp-cart {
		flex: 1;
		flex-direction: column;
		background: #f5f5f5;
		overflow-y: auto;
		padding-bottom: 30rpx;
	}

	.xx-warp-fb {
		padding: 30rpx;
	}
}

.cartItem {
}

.xx-item {
	background: #ffffff;
	// padding: 24rpx;
	margin-bottom: 20rpx;
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

.submit {
	width: 240rpx;
	height: 78rpx;
	line-height: 78rpx;
	background: #26273a;
	border-radius: 4rpx;
	text-align: center;
	font-family: PingFangSC-Medium;
	font-size: 28rpx;
	color: #ffffff;
}
</style>
