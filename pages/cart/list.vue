<template>
	<view class="xx-warp flexColumn">
		<view class="xx-warp-cart flex1">
			<view class="cart-count flexRow flexSpaceBetween">
				<view class="grey1">共{{ showList.length }}件商品</view>
				<view class="" @click="editClick">{{ editShow ? '完成' : '编辑' }}</view>
			</view>
			<view class="cart-pro flex1">
				<u-card
					:show-head="false"
					margin="0rpx"
					border-radius="4"
					:head-border-bottom="false"
					:border="false"
					:foot-border-top="false"
					:bodyStyle="{ padding: '24rpx 24rpx 24rpx 0' }"
				>
					<view class="" slot="body">
						<view class="xx-itemList flexRow" v-for="(n, index) in showList" :key="index">
							<view class="" @click="detailClick(n)"><view class="xx-selecticon" :class="{ 'xx-selectAtive': n.show }"></view></view>
							<view class="xx-item" @click.stop="seeDetail(n)">
								<view class="xx-item-img alignItemCenter"><image :src="n.img" mode="aspectFit" style="width: 150rpx;height: 150rpx;"></image></view>
								<view class="xx-item-info">
									<view class="xx-item-info-bd">
										<view class="xx-item-title f14">{{ n.goodsName }}</view>
										<view class="xx-item-type mt3 flexRow flexSpaceBetween">
											<view class="xx-item-tags">
												<text class="grey1 DIN f12">{{ n.specifications_cn | skuFormat }}</text>
											</view>
											<!-- <view class="xx-item-number grey1 DIN">x1</view> -->
										</view>
									</view>
									<view class="xx-item-info-fd flexRow">
										<view class="flex1">
											<view class="xx-item-price mb3">
												<text class="f16 DINM">¥{{ n.realPrice }}</text>
												<text class="f12 grey2">
													原价
													<text class="f12 grey2 pl3 DIN relative">
														¥{{ n.price }}
														<text class="delprice"></text>
													</text>
												</text>
											</view>
											<view v-if="n.slogan_cn && n.grade !== 'E'" class="mr8">
												<text class="viptag">
													<text class="viptxt">{{ n.slogan_cn }}</text>
												</text>
											</view>
										</view>
										<view class="xx-warp-cartNumBox">
											<view class="flexRow xx-warp-cartNum">
												<view class="min" :class="{ nomin: n.quantity == 1 }" @click.stop="minClick(n)"></view>
												<view class="flex1 DINM cartNum">{{ n.quantity }}</view>
												<view class="plus" :class="{ noplus: n.quantity > 98 }" @click.stop="plusClick(n)"></view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</u-card>
				<!-- <view class="h20"></view>
				<u-card  margin="0rpx" title="失效商品" :headStyle="headStyle" border-radius="4rpx" :head-border-bottom='false' :foot-border-top='false'>
					<view class="" slot="body">
						 
					</view>
				</u-card> -->
			</view>
		</view>
		<view class="xx-warp-footer borderBottom flexRow">
			<view class="xx-warp-selete" @click="allselete" :class="{ allative: allShow }"><view class="selecticon f14">全选</view></view>
			<view class="flex1 flexRow">
				<view class="flex1 alignRight mr5 xx-warp-price">
					<view class="" v-if="!editShow">
						<text class="grey1 f12 mr5">不含运费</text>
						<text class="f12">总计:</text>
						<text class="f18 DINM">¥{{ totalPrice }}</text>
					</view>
				</view>
				<view class="">
					<u-button type="primary" @click="telClick" v-if="!editShow"><view class="w80">结算</view></u-button>
					<u-button @click="delClick" v-if="editShow"><view class="pl5 pr5">删除</view></u-button>
				</view>
			</view>
		</view>
		<u-modal v-model="modelShow" :content="content" @confirm="delConfirm" :show-cancel-button="true" :show-title="false" border-radius="4rpx" confirm-color="#26273A"></u-modal>
	</view>
</template>

<script>
import { cartList, cartAdd, cartDelete, ordersCompute } from '@/common/api/goods.js';
import { showToast, GoNavTo, setValue, getValue, sloganshift, stringLen } from '@/common/js/utils.js';
export default {
	data() {
		return {
			title: '失效商品',
			editShow: false,
			data: [],
			nodata: [],
			allShow: false,
			modelShow: false,
			content: '',
			bodyStyle: {
				padding: '0'
			},
			headStyle: {
				padding: '20rpx'
			}
		};
	},
	computed: {
		showList() {
			return this.data;
			// return this.data.filter(item => item.stock > 1)
		},
		totalPrice() {
			let price = this.data
				.filter(item => item.show)
				.map(item => item.realPrice * item.quantity)
				.reduce((acc, current) => acc + current, 0);
			console.log(price);
			return price.toFixed(2);
		}
	},
	mounted() {
		let data = getValue('cart') && getValue('cart').length > 0 ? JSON.parse(getValue('cart')) : {};
		if (data.exp && new Date().getTime() - data.exp < 120000) {
			this.data = data.data.map(item => {
				return {
					...item,
					specifications_cn: item.specifications ? (item.specifications.indexOf('[') > -1 ? JSON.parse(stringLen(item.specifications)) : [item.specifications]) : [],
					show: false
				};
			});
		} else {
			this.cartDataList();
		}
	},
	methods: {
		//去结算
		async telClick() {
			let data = this.data
				.filter(item => item.show)
				.map(item => {
					return item.id;
					// {
					// goodsId: parseFloat(item.goodsId),
					// cartId: parseFloat(item.id),
					// quantity: parseFloat(item.quantity),
					// skuId: parseFloat(item.skuId)
					// };
				});
			console.log(this.data, data);
			if (data && data.length < 1) {
				showToast('购物车至少选择一个商品');
				return;
			}
			const reset = await ordersCompute({ channel: 'cart', cartIds: data });
			if (reset && reset.success) {
				GoNavTo({
					url: '/pages/cart/order/order?data=' + JSON.stringify(reset.body)
				});
			}
		},
		allselete() {
			this.allShow = !this.allShow;
			this.data = this.data.map(item => {
				return {
					...item,
					show: this.allShow
				};
			});
		},
		// 获取购物车列表
		async cartDataList() {
			const reset = await cartList();
			if (reset && reset.success) {
				this.cartData(reset.body);
			}
		},
		cartData(data) {
			this.data = data.map(item => {
				return {
					...item,
					show: false,
					slogan_cn: sloganshift(item.slogan),
					specifications_cn: item.specifications ? (item.specifications.indexOf('[') > -1 ? JSON.parse(stringLen(item.specifications)) : [item.specifications]) : []
				};
			});
			setValue(
				'cart',
				JSON.stringify({
					exp: new Date().getTime(),
					data: this.data
				})
			);
		},
		// 减库存
		async minClick(n) {
			if (n.quantity <= 1) {
				return;
			}
			let num = parseInt(n.quantity) - 1;
			const reset = await cartAdd({
				id: parseInt(n.id),
				quantity: num
			});
			if (reset && reset.success) {
				n.quantity--;
				this.cartData(reset.body);
			}
		},
		// 加库存
		async plusClick(n) {
			if (n.stock < 1) {
				showToast('商品库存不足');
				return;
			}
			if (n.quantity >= 99) {
				showToast('购买数量不能超过99');
				return;
			}
			if (n.quantity >= n.buyLimited) {
				showToast('购买数量超过' + n.buyLimited);
				return;
			}
			let num = parseInt(n.quantity) + 1;
			const reset = await cartAdd({
				id: parseInt(n.id),
				quantity: num
			});
			if (reset && reset.success) {
				n.quantity++;
				this.cartData(reset.body);
			}
		},
		detailClick(e) {
			e.show = !e.show;
			// this.data = this.data.map(item=>{
			// 	return {
			// 		...item,
			// 		show:e.id == item.id
			// 	}
			// })
		},
		editClick() {
			this.editShow = !this.editShow;
		},
		async delConfirm() {
			let ids = this.data.filter(item => item.show).map(item => parseInt(item.id));
			if (ids && ids.length < 1) {
				showToast('购物车商品至少选择一个');
				return;
			}
			const reset = await cartDelete(ids);
			if (reset && reset.success) {
				this.data = reset.body.map(item => {
					console.log(item.specifications.indexOf('[') > -1);
					return {
						...item,
						show: false,
						specifications_cn: item.specifications ? (item.specifications.indexOf('[') > -1 ? JSON.parse(stringLen(item.specifications)) : [item.specifications]) : []
					};
				});
				// if (this.data && this.data.length < 1) {
				setValue(
					'cart',
					JSON.stringify({
						exp: new Date().getTime(),
						data: this.data
					})
				);
				this.$emit('CartItem', this.data);
				// }
			}
		},
		//删除
		async delClick() {
			let ids = this.data.filter(item => item.show).length;
			this.content = '确认将这' + ids + '个宝贝删除?';
			this.modelShow = true;
		},
		seeDetail(e) {
			//查看详情
			console.log(e);
			GoNavTo({
				url: `/pages/detail/detail?id=${e.goodsId}&grade=${e.grade}`
			});
		}
	}
};
</script>

<style lang="scss">
.xx-warp {
	flex: 1;
	height: 100vh;
	background: #f5f5f5;

	.xx-warp-cart {
		padding: 16rpx 24rpx;
		overflow-y: auto;

		.cart-count {
			margin-bottom: 16rpx;
		}

		.xx-itemList {
			position: relative;

			.xx-selecticon {
				position: absolute;
				top: 0;
				width: 80rpx;
				height: 220rpx;
				background: url(../../static/selectno.png) center center no-repeat;
				background-size: 40rpx auto;
			}

			.xx-selectAtive {
				background: url(../../static/select.png) center center no-repeat;
				background-size: 40rpx auto;
			}
		}

		.xx-item {
			background: #ffffff;
			margin-bottom: 20rpx;
			display: flex;
			flex-direction: row;
			flex: 1;
			margin-left: 50rpx;

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
						height: 28rpx;
						line-height: 28rpx;
					}
				}

				.xx-item-info-fd {
					position: relative;

					.xx-warp-cartNumBox {
						width: 138rpx;
					}

					.xx-warp-cartNum {
						width: 138rpx;
						height: 48rpx;
						border: 2rpx solid #dbdce2;
						border-radius: 2px;
						position: absolute;
						bottom: 0;
						right: 0;

						.min {
							background: url(../../static/increaseicon.png) center center no-repeat;
							background-size: 24rpx auto;
							width: 24rpx;
							height: 48rpx;
							margin-left: 12rpx;
						}

						.nomin {
							background: url(../../static/noincreaseicon.png) center center no-repeat !important;
							background-size: 24rpx auto !important;
							width: 24rpx;
							height: 48rpx;
							margin-left: 12rpx;
						}

						.cartNum {
							line-height: 45rpx;
							text-align: center;
						}

						.plus {
							background: url(../../static/decreaseicon.png) center center no-repeat;
							background-size: 24rpx auto;
							width: 24rpx;
							height: 48rpx;
							margin-right: 12rpx;
						}

						.noplus {
							background: url(../../static/nodecreaseicon.png) center center no-repeat;
							background-size: 24rpx auto;
						}
					}

					.xx-item-price {
					}
				}
			}
		}
	}

	.xx-warp-footer {
		background: #ffffff;
		padding: 12rpx 20rpx;

		.xx-warp-selete {
			height: 80rpx;
			line-height: 80rpx;
			padding-left: 60rpx;
			margin-right: 10rpx;
			background: url(../../static/selectno.png) center left no-repeat;
			background-size: 40rpx auto;
		}

		.allative {
			background: url(../../static/select.png) center left no-repeat;
			background-size: 40rpx auto;
			padding-left: 60rpx;
			margin-right: 10rpx;
		}

		.xx-warp-price {
			height: 80rpx;
			line-height: 80rpx;
		}

		.selecticon {
		}
	}
}
</style>
