<template>
	<view class="skuBox" v-if="show">
		<view class="skuBox-hd flex1" @touchmove.stop.prevent="moveHandle" @click="CloseClick"></view>
		<view class="skuBox-sku flexColumn">
			<view class="googds flexRow">
				<view class="googds-img"><image :src="img" mode="aspectFill" style="width: 220rpx; height: 220rpx;"></image></view>
				<view class="googds-info flexColumn ml6">
					<view class="googds-close flexRow flexSpaceBetween">
						<view></view>
						<view class="googds-close-icon" @click="CloseClick"></view>
					</view>
					<view class="googds-price">
						<text class="f16 DINM">¥</text>
						<text class="f20 DINM">{{ goodsPrice }}</text>
						<text class="viptag ml10" v-if="data.discountInfo.grade !== 'E'">
							<text class="viptxt">{{ data.discountInfo.slogan_cn }}</text>
						</text>
						<text v-else-if="data.discountInfo.grade === 'E'">
							<text class="marking-price">¥{{ markingPrice }}</text>
						</text>
					</view>
					<view class="DINLight f12 gray6 mt6">{{ skuName ? skuName : '选择规格' }}</view>
				</view>
			</view>
			<view class="googds-sku-info">
				<view class="googds-sku mt25">
					<view class="googds-title f14">规格</view>
					<view class="googds-sku-box mt12 flexRow">
						<view
							class="sku-item DINLight"
							:class="[{ 'sku-item-ative': sku.show }, { 'sku-no': sku.stock < 1 }]"
							v-for="(sku, index) in skuInfos"
							:key="index"
							@click="seleteSku(sku)"
						>
							{{ sku.specifications_cn | skuFormat }}
						</view>
					</view>
				</view>
				<view class="googds-num flexRow swiperjianbian">
					<view class="f14 DINM">
						<view class="">购买数量</view>
						<view class="f12 grey1">
							<text v-if="buyLimited > 0">限购:{{ buyLimited }}件</text>
						</view>
					</view>
					<view class="flexRow xx-warp-cartNum">
						<view class="min" :class="{ nomin: num == 1 }" @click="minClick()"></view>
						<view class="flex1 DINM cartNum">{{ num }}</view>
						<view class="plus" @click="plusClick()"></view>
					</view>
				</view>
			</view>

			<view class="googds-btn">
				<view type="primary" v-if="cartType == 'cart'" class="Medium buy-button" @click="cartBuy">加入购物车</view>
				<view type="primary" v-if="cartType == 'direct'" @click="goBuy" :throttle-time="1" class="Medium buy-button">立即购买</view>
			</view>
		</view>
	</view>
</template>

<script>
import { showToast, GoNavTo, setValue, getValue, sloganshift } from '@/common/js/utils.js';
import { cartAdd, ordersCompute, goodsSku } from '@/common/api/goods.js';
export default {
	props: {
		cartType: {
			type: String,
			default: 'direct'
		},
		cartData: {
			type: Object,
			default: () => {}
		}
	},
	data() {
		return {
			data: {},
			goodsPrice: 0,
			markingPrice: 0, //处理过的划线价
			skuInfos: [],
			skuName: '',
			img: '',
			num: 1,
			buyLimited: 0,
			show: false,
			disabled: true
		};
	},
	async mounted() {
		//先获取当前购物车是否加入过
		let data = Object.assign({}, this.cartData);
		console.log(data);
		let refreshSku = await goodsSku({ goodsId: data.id }).then();
		console.log('refreshSku=', refreshSku);
		this.skuInfos = data.skuInfos = refreshSku.body.map((item, i, arr) => {
			return {
				...item,
				goodsId: data.goodsSn,
				goodsName: data.goodsName,
				goodsSn: data.goodsSn,
				show: arr.length === 1 && i === 0 ? true : false,
				num: 1,
				specifications_cn: item.specifications ? (item.specifications.indexOf('[') > -1 ? JSON.parse(item.specifications) : [item.specifications]) : []
			};
		});
		// 规格大于2个才显示区间价
		if (this.skuInfos && this.skuInfos.length > 1) {
			this.goodsPrice = data.priceInfo.discountFloor + '-' + data.priceInfo.discountCelling;
			this.markingPrice = data.priceInfo.markingFloor + '-' + data.priceInfo.markingCelling;
			this.buyLimited = this.skuInfos[0].buyLimited;
		} else {
			this.goodsPrice = data.priceInfo.discountFloor;
			this.markingPrice = data.priceInfo.markingFloor;
			this.skuName = Array.isArray(this.skuInfos[0].specifications_cn) ? this.skuInfos[0].specifications_cn.join('') : this.skuInfos[0].specifications_cn;
			this.buyLimited = this.skuInfos[0].buyLimited;
		}

		this.data = data;
		this.img = this.data.img;
		this.show = true;
	},
	methods: {
		async goBuy() {
			let data = this.skuInfos.find(item => item.show);
			if (!data) {
				showToast('请选择规格');
				return;
			}
			if (data && data.buyLimited) {
				if (this.num > data.stock || data.stock < 1) {
					showToast('商品库存不足');
					return;
				} else if (this.num >= data.buyLimited) {
					showToast(`商品限购数量为${data.buyLimited}`);
					return;
				} 
			}
			let { id, name, goodsSn, skuInfos } = this.data;
			let Items = [
				{
					goodsId: id,
					quantity: this.num,
					skuId: data.id,
					price: data.price
				}
			];
			const reset = await ordersCompute({ channel: 'direct', items: Items });
			if (reset && reset.success) {
				GoNavTo({
					url: '/pages/cart/order/order?data=' + JSON.stringify(reset.body)
				});
			}
			// GoNavTo({
			// 	url: '/pages/cart/order/order?type=direct&data=' + JSON.stringify(Items)
			// });
		},
		minClick() {
			if (this.num <= 1) {
				return;
			}
			this.num--;
		},
		plusClick() {
			// 先获取sku 型号数量
			let skuData = this.skuInfos.find(item => item.show);
			if (skuData && skuData.buyLimited) {
				if (this.num > skuData.stock || skuData.stock < 1) {
					showToast('商品库存不足');
					return;
				} else if (this.num >= skuData.buyLimited) {
					showToast(`商品限购数量为${skuData.buyLimited}`);
					return;
				} else {
					this.num++;
				}
			} else {
				this.num++;
			}
		},
		//选择sku型号
		seleteSku(e) {
			if (e.stock < 1) {
				showToast('商品库存不足');
				return;
			}
			if (e.buyLimited < 1) {
				showToast('商品库存不足');
				return;
			}
			this.num = 1;
			this.skuName = e.specifications_cn.join('-');
			this.buyLimited = e.buyLimited;
			this.skuInfos = this.skuInfos.map(item => {
				return {
					...item,
					show: e.id == item.id
				};
			});
			this.img = e.img;
			this.goodsPrice = e.price;
			this.markingPrice = e.markingPrice;
		},
		//新数据方法
		newCart(data) {
			let { id, name, goodsSn, skuInfos, goodsId, goodsName } = data;
			return {
				goodsId: goodsId,
				goodsName: goodsName,
				goodsSn: goodsSn,
				img: data.img,
				price: data.price,
				quantity: this.num,
				skuId: data.id,
				specifications: JSON.stringify(data.specifications)
			};
		},
		async cartBuy() {
			let param = {};
			let data = this.skuInfos.find(item => item.show);
			if (!data) {
				showToast('请选择规格');
				return;
			}
			let { id, name, goodsSn, skuInfos } = this.data;
			let cartData = getValue('cart') && getValue('cart').length > 0 ? JSON.parse(getValue('cart')) : {};

			// 改商品第一次添加购物车
			if (cartData.data && cartData.data.length > 0) {
				let newData = cartData.data.find(item => item.skuId == data.skuId);
				if (newData) {
					param = {
						id: newData.id,
						quantity: this.num + newData.quantity
					};
				} else {
					param = this.newCart(data);
				}
			} else {
				param = this.newCart(data);
			}
			if (param.quantity > data.stock) {
				showToast('数量超过库存');
				return;
			}
			if (param.quantity > data.buyLimited) {
				showToast('超过限购数量');
				return;
			}
			const reset = await cartAdd(param);
			if (reset && reset.success) {
				let data = reset.body.map(item => {
					return {
						...item,
						slogan_cn: sloganshift(item.slogan)
					};
				});
				showToast('已加入购物车');
				setValue(
					'cart',
					JSON.stringify({
						exp: new Date().getTime(),
						data: data
					})
				);
				this.$emit('emitSku', data);
			}
		},
		CloseClick() {
			this.$emit('closeSku');
		},
		moveHandle() {
			return;
		}
	}
};
</script>

<style lang="scss">
.skuBox {
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	bottom: 0;
	display: flex;
	flex-direction: column;
	width: 100%;
	z-index: 10000;

	.skuBox-hd {
		background: rgba(0, 0, 0, 0.2);
	}

	.googds-sku-info {
		flex: 1;
		overflow-y: auto;
	}

	.skuBox-sku {
		position: relative;
		background: #ffffff;
		padding: 24rpx;
		padding-bottom: calc(var(--window-bottom) + 10px);
		z-index: 10001;
		height: 60vh;

		.googds {
			.googds-img {
				height: 220rpx;
				width: 220rpx;
				background: #ffffff;
			}

			.googds-info {
				flex: 1;

				.googds-close {
					margin-bottom: 90rpx;
				}

				.googds-close-icon {
					background: url(../../static/closeIcon.png) center right no-repeat;
					width: 44rpx;
					height: 44rpx;
					background-size: 44rpx auto;
				}
			}
		}

		.googds-sku {
			.googds-sku-box {
				flex-wrap: wrap;

				.sku-item {
					height: 60rpx;
					line-height: 60rpx;
					border: 2rpx solid #dbdce2;
					border-radius: 2rpx;
					padding: 0 20rpx;
					margin-right: 24rpx;
					margin-bottom: 20rpx;
				}

				.sku-no {
					border: #dbdce2 2rpx dashed;
					color: #dbdce2;
				}

				.sku-item-ative {
					border: #ff525d 2rpx solid;
					color: #ff525d;
				}
			}
		}

		.googds-num {
			position: relative;
			margin-top: 40rpx;

			.xx-warp-cartNum {
				width: 138rpx;
				height: 60rpx;
				border: 2rpx solid #dbdce2;
				border-radius: 2px;
				position: absolute;
				bottom: 0;
				right: 0;
				z-index: 10;

				.min {
					background: url(../../static/increaseicon.png) center center no-repeat;
					background-size: 24rpx auto;
					width: 24rpx;
					height: 60rpx;
					margin-left: 12rpx;
				}

				.nomin {
					background: url(../../static/noincreaseicon.png) center center no-repeat !important;
					background-size: 24rpx auto !important;
					width: 24rpx;
					height: 60rpx;
					margin-left: 12rpx;
				}

				.cartNum {
					line-height: 60rpx;
					text-align: center;
				}

				.plus {
					background: url(../../static/decreaseicon.png) center center no-repeat;
					background-size: 24rpx auto;
					width: 24rpx;
					height: 60rpx;
					margin-right: 12rpx;
				}
			}
		}

		.googds-btn {
			margin-top: 92rpx;
			margin-bottom: 40rpx;
		}

		.marking-price {
			font-size: 32rpx;
			color: #b1b2c1;
			line-height: 38rpx;
			margin-left: 6rpx;
			text-decoration: line-through;
		}
	}
}
.buy-button {
	height: 84rpx;
	line-height: 84rpx;
	font-family: PingFangSC-Medium;
	font-size: 28rpx;
	color: #FFFFFF;
	background: #26273A;
	border-radius: 4rpx;
	text-align: center;
}
</style>
