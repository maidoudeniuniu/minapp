<template>
	<layout :BP="false" background="#ffffff">
		<view class="xx-warp" v-if="show">
			<view class="flex1 xx-warp-hd overflowY">
				<u-card
					title="退款商品"
					:head-style="headStyle"
					margin="20rpx 30rpx 0 30rpx"
					:body-style="{ padding: '0 32rpx 32rpx 32rpx' }"
					border-radius="10"
					:border="false"
					:head-border-bottom="false"
					:foot-border-top="false"
				>
					<view class="" slot="body"><apply-item :orderData="orderData" @emitOrder="emitOrder"></apply-item></view>
				</u-card>
				<u-card
					title="退款信息"
					:head-style="headStyle"
					margin="20rpx 30rpx 0 30rpx"
					:body-style="{ padding: '0 32rpx 32rpx 32rpx' }"
					border-radius="10"
					:border="false"
					:head-border-bottom="false"
					:foot-border-top="false"
				>
					<view class="" slot="body">
						<view class="refundDetail">
							<view class="refundList flexRow">
								<view class="refundList-label">退款类型</view>
								<view class="refundList-info flexRow flex1 flexend">
									<u-button :type="item.type" size="medium" v-for="(item, index) in refundListType" @click="refundListClick(item)" :key="index" :custom-style="customStyle">
										{{ item.name }}
									</u-button>
								</view>
							</view>
							<view class="refundList flexRow mt10">
								<view class="refundList-label">退款原因</view>
								<view class="refundList-info flex1 flexend alignRight" @click="refundDescription">
									<view class="f12 refundDescriptionTxt">{{ refundTxt ? refundTxt : '退款原因描述' }}</view>
								</view>
							</view>
							<view class="refundList flexRow mt10">
								<view class="refundList-label">退款总额</view>
								<view class="refundList-info flex1 flexend alignRight">¥{{ orderData.amount }}</view>
							</view>
							<!-- <view class="refundListPrice borderRadius4 flexRow">
								<view class="f16 bold" style="height: 74rpx;line-height: 74rpx;" v-if="PriceValue > 0">￥</view>
								<view class="flex1">
									<u-input type="text" v-model="PriceValue" placeholder="输入退款金额" class="DIN f16" style="width: 100%;" :class="{ bold: PriceValue > 0 }" @input="priceInput" />
								</view>
							</view> -->
							<!-- <view class="mt3 grey1 f12">不可修改，最多¥{{ orderData.amount }}，含邮费¥0.00</view> -->
						</view>
					</view>
				</u-card>
				<u-card
					title="补充描述和凭证"
					margin="20rpx 30rpx 30rpx 30rpx"
					:head-style="headStyle"
					:body-style="{ padding: '0 32rpx 32rpx 32rpx' }"
					border-radius="10"
					:border="false"
					:head-border-bottom="false"
					:foot-border-top="false"
				>
					<view class="" slot="body">
						<view class="refundDescription borderRadius4">
							<u-input v-model="desvalue" type="textarea" maxlength="200" placeholder="补充描述" />
							<view class="grey2 alignRight f12">{{ desvalue.length }}/200</view>
						</view>
						<view class="mt10"><image-component></image-component></view>
					</view>
				</u-card>
			</view>
			<view class="xx-warp-fb"><u-button type="primary" @click="submitApply">提交</u-button></view>
		</view>
		<refundcause-component title="选择退款原因" @emitRefund="emitRefund" v-if="refundCauseShow"></refundcause-component>
	</layout>
</template>

<script>
import applyItem from './applyrefundItem.vue';
import imageComponent from '@/components/image/image.vue';
import { showToast, ArrayList } from '@/common/js/utils.js';
import { ordersDetails, refundApply } from '@/common/api/member.js';
import refundcauseComponent from '@/components/refundcause/refundcause.vue';
let ApplyTime;
export default {
	data() {
		return {
			title: '退款信息',
			show: false,
			orderData: {},
			cid: null,
			PriceValue: '',
			refundTxt: '',
			refundCauseShow: false,
			customStyle: {
				padding: '0 30rpx',
				marginRight: '10rpx'
			},
			refundListType: [
				{
					name: '仅退款',
					type: 'default'
				},
				{
					name: '退货退款',
					type: 'default'
				}
			],
			headStyle: {
				padding: '24rpx 30rpx',
				fontWeight: 'bold'
			},
			desvalue: ''
		};
	},
	onLoad(e) {
		let data = JSON.parse(e.data);
		this.cid = data.id;
		this.list(data);
	},
	components: {
		applyItem,
		imageComponent,
		refundcauseComponent
	},
	methods: {
		refundDescription() {
			this.refundCauseShow = true;
		},
		emitRefund(e) {
			this.refundCauseShow = false;
			if (e) {
				this.refundTxt = e.name;
			}
		},
		async list(e) {
			// const reset = await ordersDetails({
			// 	id:this.cid
			// })
			console.log(e);
			if (e) {
				let data = e;
				data.items = data.items.map(item => {
					return {
						...item
						// specifications: item.specifications
					};
				});
				this.orderData = data;
				this.show = true;
			}
		},
		priceInput(e) {
			let reg = /(^[1-9]{1}[0-9]*$)|(^[0-9]*\.[0-9]{0,2}$)/;
			if (!e) {
				return;
			}
			if (!reg.test(e)) {
				showToast('输入金额格式不对');
			}
			if (e > this.orderData.amount) {
				clearTimeout(ApplyTime);
				ApplyTime = setTimeout(() => {
					this.PriceValue = this.orderData.amount;
					showToast('输入金额大于订单总金额');
				}, 300);
				return;
			}
		},
		refundListClick(e) {
			console.log(e);
			if (e.name === '仅退款') return showToast('请联系客服进行退款');
			this.refundListType = this.refundListType.map(item => {
				return {
					...item,
					type: item.name == e.name ? 'primary' : 'default'
				};
			});
			console.log(this.refundListType);
		},
		//提交申请
		submitApply() {
			let orderSkuInfo = this.orderData.items.map(item => {
				return {
					orderGoodsId: item.id,
					refundQuantity: item.quantity
				};
			});
			refundApply({
				orderId: this.orderData.id,
				orderSkuInfo,
				refundImg: [],
				refundMessage: this.refundTxt,
				refundOtherMessage: this.desvalue,
				refundorderType: 0
			})
				.then()
				.catch();
		}
	}
};
</script>

<style lang="scss" scoped>
.xx-warp {
	background: #f6f6f6;
	flex: 1;
	overflow: hidden;
	.refundDescription {
		background: #f6f6f6;
		padding: 20rpx;
	}
	.custom-style {
		color: #606266;
		padding: 0 auto !important;
	}
	.refundList {
		.refundList-label {
			height: 70rpx;
			line-height: 70rpx;
		}
		.refundDescriptionTxt {
			height: 70rpx;
			line-height: 70rpx;
			background: url(../../../static/moreicon.png) center right no-repeat;
			background-size: 30rpx auto;
			padding-right: 30rpx;
		}
	}
	.refundListPrice {
		background: #f6f6f6;
		padding: 14rpx;
	}
	.xx-warp-fb {
		background: #ffffff;
		padding: 14rpx 20rpx;
	}
}
</style>
