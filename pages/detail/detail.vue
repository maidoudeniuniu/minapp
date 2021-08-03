<template>
	<detail
		:BP="false"
		background="#ffffff"
		:title="data.name"
		:leftIcon="leftIcon"
		rightIcon="Share"
		:headerShow="true"
		:backgroundNavColor="backgroundNavColor"
		:fixed="true"
		:titleColor="titleColor"
		:hidden="cartShow"
		@clickRightEmit="clickRightEmit"
	>
		<view class="xx-warp">
			<view class="xx-warp-detail" v-if="show">
				<view class="xx-warp-property">
					<view class="xx-warp-banner">
						<swiper
							class="swiper"
							:interval="interval"
							:autoplay="autoplay"
							easing-function="easeOutCubic"
							:duration="duration"
							@change="change"
							:current="current"
							:circular="true"
						>
							<swiper-item v-for="(item, index) in background" :key="index" v-if="item">
								<view class="swiper-item uni-bg-red"><image :src="item" mode="aspectFill" style="width: 750rpx;height: 750rpx;"></image></view>
							</swiper-item>
						</swiper>
						<view class="swiperBottom">
							<view class="swiperjianbian" :style="{ width: spearItem, margin: '72rpx auto 0 auto', zIndex: 1000 }">
								<view class="page-section-subitem" v-for="(item, index) in background" :key="index" :class="{ active: index == current }"></view>
							</view>
						</view>
					</view>
				</view>
				<view class="">
					<view class="xx-warp-order">
						<price-component :detail="data"></price-component>
						<view class="xx-warp-item-title f18 mt14" style="position: relative;">{{ data.name }}</view>
						<view class="xx-warp-item-title f12 mt10 gray6">{{ data.brief }}</view>
					</view>
				</view>
				<view class="h10 basebg"></view>
				<view class="xx-model-title p14 wirtbg">
					下单最多可返
					<text class="gold2 DINM pl5 pr5 bold">{{ data.maxGrowth }}</text>
					成长值
				</view>
				<view class="h10 basebg" v-if="data.brandInfo"></view>
				<view class="" v-if="data.brandInfo">
					<view class="xx-warp-brand flexColumn" :style="{ background: 'url(' + data.brandInfo.img + ')  top center no-repeat', backgroundSize: '100% auto' }">
						<view class="xx-warp-brand-info flexRow flexSpaceBetween">
							<view class="xx-warp-brand-info-title flexRow flex1">
								<view class="imgBox" :style="{ background: 'url(' + data.brandInfo.logo + ')  center center #ffffff no-repeat', backgroundSize: '100% auto' }"></view>
								<view class="ml15 mt20 f14 wirtColor">{{ data.brandInfo.name }}</view>
							</view>
							<!-- <view class="xx-warp-brand-home xxtag-max xxtag-wite mt20">品牌主页</view> -->
						</view>
						<view class="f12 wirtColor mt14">{{ data.brandInfo.brief }}</view>
					</view>
				</view>
				<view class="h10 basebg"></view>
				<view class="xx-warp-view safe-area" v-if="data.pics && data.pics.extUrls.length > 0">
					<view class="xx-model-title p14 wirtbg">图文详情</view>
					<view class="" style="font-size: 0;">
						<image :src="img" mode="widthFix" style="width: 100%;font-size: 0;" v-for="(img, index) in data.pics.extUrls" :key="index"></image>
					</view>
				</view>
			</view>
			<view class="xx-warp-buy flexRow">
				<view class="xx-warp-message flexRow">
					<contact :sourceInfo="sourceInfo">
						<view class="xx-warp-message-item flexColumn">
							<view class="itemicon customericon"></view>
							<view class="message-item-txt f12">客服</view>
						</view>
					</contact>
					<view class="xx-warp-message-item relative" @click="goBuyCart">
						<view class="itemicon carticon ">
							<text class="ubadge f12 DIN" v-if="count > 0">{{ count }}</text>
						</view>
						<view class="message-item-txt f12">购物车</view>
					</view>
				</view>
				<view class="xx-warp-btn flexRow">
					<template v-if="data && data.saleType === 'pack'">
						<view class="Medium buy-button" @click="goBuyPack(data.discountInfo.grade)">立即购买</view>
					</template>
					<template v-else>
						<view class="flex1 mr15"><u-button class="xx-base-btn" @click="AddCart('cart')">加入购物车</u-button></view>
						<view class="flex1"><u-button class="xx-base-btn" type="primary" @click="goBuy('direct')">立即购买</u-button></view>
					</template>
				</view>
			</view>
		</view>
		<cart-item v-if="cartShow" :cartData="data" :cartType="cartType" @closeSku="closeSku" @emitSku="emitSku"></cart-item>
		<share-component :show="shareShow" @emitShare="emitShare" :shareData="shareData"></share-component>
		<!-- <u-back-top :scrollTop="scrollTop" icon="arrow-up" tips="顶部" duration="300" mode="square"
			:icon-style="iconStyle" :custom-style="customstyle" z-index="1000000" @click.native="top"></u-back-top> -->
		<back-top :scrollTop="scrollTop" @backTop="backTopClick"></back-top>
	</detail>
</template>

<script>
import { goodsGet, cartAdd, ordersCompute, ordersSubmit, cartList } from '@/common/api/goods.js';
import { mineAccountInfo } from '@/common/api/member.js';
import { getValue, GoNavTo, showToast, setValue, sloganshift } from '@/common/js/utils.js';
import cartItem from '@/components/sku/sku.vue';
import shareComponent from '@/components/share/share.vue';
import contact from '@/components/contact/contact.vue';
import priceComponent from './price.vue';
import backTop from '@/components/backtop/top.vue';
export default {
	data() {
		return {
			cartType: '',
			cartShow: false,
			title: '',
			leftIcon: 'Back',
			indicatorDots: true,
			autoplay: true,
			interval: 1800,
			duration: 500,
			count: 0,
			type: 0,
			data: {},
			current: 0,
			grade: '', //用户等级
			cid: null,
			shareShow: false,
			show: false,
			barndBg: {},
			backgroundNavColor: 'rgba(255,255,255,0)',
			titleColor: 'rgba(38,39,58,0)',
			background: [],
			sourceInfo: {},
			scrollTop: 0, //滚动距离
			shareData: {},
			customstyle: {
				width: '80rpx',
				height: '80rpx',
				background: 'rgba(0,0,0,0.5)',
				color: '#fff',
				fontSize: '10rpx'
			},
			iconStyle: {
				fontSize: '34rpx',
				marginBottom: '6rpx'
			}
		};
	},
	components: {
		cartItem,
		shareComponent,
		contact,
		priceComponent,
		backTop
	},
	computed: {
		spearItem() {
			return this.background.length * 40 + 'rpx';
		}
	},
	async onLoad(e) {
		this.cid = e.id;
		if (e.inviterId) {
			setValue('inviterId', e.inviterId);
		}
		if (!e.grade && getValue('token')) {
			const userinfo = await mineAccountInfo();
			this.grade = userinfo.body.grade;
			this.detaillist();
			this.cartListItem();
		} else {
			this.grade = e.grade || '';
			this.detaillist();
			this.cartListItem();
		}
	},
	onShow() {},
	onShareAppMessage(res) {
		let inviterId = getValue('userId');
		if (res.from === 'button') {
			// 来自页面内分享按钮
			console.log(res.target);
		}
		return {
			title: this.data.name,
			imageUrl: this.background[0] || this.data.img || '',
			path: '/pages/detail/detail?inviterId=' + inviterId + '&id=' + this.cid
		};
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
		if (e.scrollTop > 0 && e.scrollTop < 300) {
			let num = parseFloat((e.scrollTop - 30) / 100) > 1 ? 1 : parseFloat((e.scrollTop - 30) / 100);
			this.backgroundNavColor = 'rgba(255,255,255,' + num + ')';
			this.titleColor = 'rgba(38,39,58,' + num + ')';
			// if (e.scrollTop > 80) {
			// 	this.title = this.data.name
			// }
		} else if (e.scrollTop < 15) {
			this.backgroundNavColor = 'rgba(255,255,255,0)';
			this.titleColor = 'rgba(38,39,58,0)';
			// this.title = " "
		}
		// },
	},
	methods: {
		//返回顶部
		backTopClick() {
			this.scrollTop = 0;
			uni.pageScrollTo({
				scrollTop: 0,
				duration: 300
			});
		},
		emitShare() {
			this.shareShow = false;
		},
		clickRightEmit() {
			this.shareShow = true;
		},

		// 跳转购物车
		async goBuyCart() {
			GoNavTo({
				type: 'reLaunch',
				url: '/pages/cart/cart'
			});
		},
		async cartListItem() {
			//登录后才能查看购物车数量
			if (!getValue('token')) {
				return;
			}
			const reset = await cartList({
				page: 0,
				size: 50
			});
			if (reset && reset.success) {
				//this.count = reset.body.map(item=>item.quantity).reduce((acc, current) => acc + current, 0)
				this.count = reset.body.length;
			}
		},
		//sku 返回组件
		emitSku(e) {
			console.log(e);
			this.cartShow = false;
			this.count = e.length;
		},
		closeSku() {
			this.cartShow = false;
		},
		// 立即购买
		async goBuy(e) {
			if (!getValue('token')) {
				showToast('请先登录');
				setTimeout(() => {
					GoNavTo({
						url: '/pagesmember/user/login/login'
					});
				}, 800);
				return;
			}
			this.cartType = e;
			this.cartShow = true;
		},
		async goBuyPack(grade) {
			//直充包的购买
			if (!getValue('token')) {
				showToast('请先登录');
				setTimeout(() => {
					GoNavTo({
						url: '/pagesmember/user/login/login'
					});
				}, 800);
				return;
			}
			if (grade === 'E') return showToast('本商品仅支持SP级以上用户购买');
			let { id, name, goodsSn, skuInfos, discountInfo } = this.data;
			let Items = [
				{
					goodsId: id,
					quantity: 1,
					skuId: skuInfos[0].id,
					price: skuInfos[0].price
				}
			];
			const reset = await ordersCompute({ channel: 'pack_direct', items: Items });
			if (reset && reset.success) {
				GoNavTo({
					url: '/pages/cart/order/order?data=' + JSON.stringify(reset.body)
				});
			}
		},
		async detaillist() {
			const reset = await goodsGet({
				grade: this.grade || '',
				id: this.cid
			});
			console.log(reset);
			if (reset && reset.success) {
				let data = reset.body;
				data.discountInfo.slogan_cn = sloganshift(data.discountInfo.slogan);
				this.data = data;
				this.background = data.pics.baseUrls;
				if (data && data.brandInfo) {
					this.barndBg = {
						background: 'url(' + data.brandInfo.img + ') center center no-repeat'
					};
				}
				this.shareData = {
					href: '/pages/detail/detail?inviterId=' + getValue('userId') + '&id=' + this.cid,
					imageUrl: this.background[0] || data.img || '',
					title: data.name,
					summary: data.brief
				};
				this.show = true;
			}
		},
		animationfinish(e) {
			if (e.detail.current == this.background.length - 1) {
				if (this.type == 1) {
					this.current = 0;
					this.type = 0;
				} else {
					this.type = 1;
				}
			}
		},
		change(e) {
			this.current = e.detail.current;
		},
		async AddCart(e) {
			if (!getValue('token')) {
				showToast('请先登录');
				GoNavTo({
					url: '/pagesmember/user/login/login'
				});
				return;
			}
			this.cartType = e;
			this.cartShow = true;
		}
	}
};
</script>

<style lang="scss" scoped>
.xx-warp-buy {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	padding-bottom: constant(safe-area-inset-bottom);
	/* 兼容 iOS < 11.2 */
	padding-bottom: env(safe-area-inset-bottom);
	/* 兼容 iOS >= 11.2 */
	z-index: 10000;
}

.xx-warp {
	flex: 1;
	display: flex;
	flex-direction: column;
	overflow: hidden;

	.swiper {
		height: 750rpx;
	}

	.xx-warp-detail {
		flex: 1;
		overflow: hidden;
		padding-bottom: 120rpx;

		// overflow-y: auto;
		.xx-warp-order {
			padding: 20rpx 28rpx 40rpx;
			background: #ffffff;
		}

		.xx-warp-banner {
			position: relative;

			.swiperBottom {
				position: absolute;
				left: 0;
				bottom: 0;
				right: 0;
				height: 110rpx;
				background-image: linear-gradient(180deg, rgba(247, 247, 247, 0) 0%, rgba(237, 237, 237, 0.3) 100%);
				z-index: 1000;

				.swiperjianbian {
					margin: 72rpx 0;
					height: 4rpx;
					background: rgba(38, 39, 58, 0.2);
					display: flex;
					flex-direction: row;
					border-radius: 4rpx;
				}

				.page-section-subitem {
					height: 4rpx;
					width: 40rpx;
				}

				.active {
					background: #26273a !important;
				}
			}
		}

		.xx-warp-brand {
			background: #000;
			padding: 32rpx 28rpx;
		}

		.xx-warp-tip {
			background: #ffffff;
			padding: 24rpx 28rpx;
			padding-bottom: constant(safe-area-inset-bottom);
			/* 兼容 iOS < 11.2 */
			padding-bottom: env(safe-area-inset-bottom);
			/* 兼容 iOS >= 11.2 */
			margin-bottom: 24rpx;
		}
	}

	.delprice {
		position: absolute;
		top: 50%;
		left: 0;
		height: 2rpx;
		background: #6e6e6e;
		right: 0;
	}

	.xx-warp-buy {
		background: #ffffff;
		min-height: 110rpx;
		padding-top: 20rpx;
		padding-left: 16rpx;
		padding-right: 16rpx;
		box-shadow: 0 -4rpx 10rpx #e5e5e5;
		.xx-warp-message {
			.xx-warp-message-item {
				height: 78rpx;
				margin: 0 23rpx;

				.itemicon {
					height: 44rpx;
					width: 44rpx;
					background: #000;
					margin: 0 auto;
				}

				.customericon {
					background: url(../../static/customer.png) center center no-repeat;
					background-size: 44rpx auto;
				}

				.carticon {
					background: url(../../static/carticon.png) center center no-repeat;
					background-size: 44rpx auto;
				}

				.message-item-txt {
					margin-top: 4rpx;
					height: 30rpx;
					line-height: 30rpx;
				}
			}
		}

		.xx-warp-btn {
			flex: 1;

			.xx-warp-buy-btn {
				flex: 1;
			}
			.buy-button {
				width: 496rpx;
				height: 84rpx;
				line-height: 84rpx;
				background: #26273a;
				border-radius: 4rpx;
				font-family: PingFangSC-Medium;
				font-size: 28rpx;
				color: #ffffff;
				text-align: center;
			}
		}
	}
}
</style>
