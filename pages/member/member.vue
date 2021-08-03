<template>
	<view class="xx-warp">
		<view class="xx-warp-member" :class="{ memberVip: userSHow }">
			<view class="xx-warp-info flexRow" @click="UserClick">
				<view class="xx-warp-img">
					<!-- #ifdef MP-WEIXIN -->
					<!-- <view class="user-avatar" v-if="loginShow && !userData.headImgUrl"><open-data type="userAvatarUrl"></open-data></view> -->
					<!-- #endif -->
					<image :src="userData.headImgUrl" mode="aspectFill" class="user-avatar" v-if="userData.headImgUrl"></image>
					<image src="../../static/usericon.png" mode="aspectFill" class="user-avatar" v-if="!userData.headImgUrl"></image>
				</view>
				<view class="xx-warp-user flexColumn" :class="{ mt20: !loginShow }">
					<view class="xx-warp-name mb6" v-if="loginShow">
						<text class="f16 memberUser">{{ userData.nickname }}</text>
						<text class="vipicon" v-if="userSHow"></text>
					</view>
					<view class="xx-warp-name mb6" v-if="!loginShow">登录/注册</view>
					<view class="xx-warp-userId wirtColor" v-if="loginShow">
						<text class="f12 grey1" style="height: 32rpx;line-height: 28rpx;">我的推荐ID:{{ userData.uid }}</text>
						<text class="xxtagp ml6 f12" @click="Ciip(userData.uid)">复制</text>
					</view>
				</view>
			</view>

			<view class="xx-warp-level" v-if="loginShow" @click="goToMember">
				<view class="xx-warp-level-info greybg">
					<view class="xx-warp-level-user flexRow flexSpaceBetween f12 mb6">
						<view class="xx-warp-level-cz wirtColor">
							成长值
							<text class="bold ml3 DIN">{{ assetData.growth }}</text>
						</view>
						<view class="xx-warp-level-txt wirtColor">{{ growth }}</view>
					</view>
					<view class="xx-warp-level-plan">
						<view class="xx-warp-level-bg"></view>
						<view class="xx-warp-level-on" :style="{ width: assetData.grade === 'A' ? '100%' :(assetData.growth / assetData.growthCeiling) * 100 + '%' }"></view>
					</view>
				</view>
			</view>
		</view>
		<view class="xx-warp-item scrollY">
			<!-- #ifndef MP-WEIXIN -->
			<view class="earnings-card mt10" v-if="loginShow && assetData.grade !== 'E'">
				<view class="flexRow flexSpaceBetween flexCenter">
					<view class="earnings-overview">收益概览</view>
					<view class="see_all" @click="moneyClick(0)">
						<text>查看全部</text>
						<u-icon name="arrow-right" color="#707184" style="margin-left: 6rpx;"></u-icon>
					</view>
				</view>
				<view class="xx-card-bd">
					<view class="xx-member-price flexRow flexCenter">
						<view class="xx-member-price-item" @click="moneyClick(0)">
							<view class="f16 bold DIN">¥{{ assetData.today ? assetData.today.income : 0 }}</view>
							<view class="f12 grey1 mt3">今日收益</view>
						</view>
						<view class="parting-line"></view>
						<view class="xx-member-price-item" @click="moneyClick(1)">
							<view class="f16 bold DIN">¥{{ assetData.today ? assetData.yesterday.income : 0 }}</view>
							<view class="f12 grey1 mt3">昨日收益</view>
						</view>
						<view class="parting-line"></view>
						<view class="xx-member-price-item" @click="moneyClick(2)">
							<view class="f16 bold DIN">¥{{ assetData.today ? assetData.toBeSettled.income : 0 }}</view>
							<view class="f12 grey1 mt3">等待入账</view>
						</view>
					</view>
				</view>
				<view class="flexRow flexSpaceBetween flexCenter my-customer" @click="seeCustomer">
					<view class="flexRow flexCenter my-customer-title">
						<image src="https://s.umeibei.com/app/img/Manageaddress.svg"></image>
						<text>我的客户</text>
					</view>
					<u-icon name="arrow-right" color="#707184"></u-icon>
				</view>
			</view>
			<!-- #endif -->
			<view class="xx-card mt10 promotion-slogan" :style="'background-image: url(' + assetData.promotionSlogan[0] + ');'" v-if="loginShow && assetData.grade === 'E'">
				<view class="no-user-lv">
					<view class="flexRow flexSpaceBetween">
						<view class="flexColumn flex1"></view>
						<view class="alignItemCenter">
							<view class="goBtn" @click="goToHome"><text class="relative goBtnTxt">GO</text></view>
						</view>
					</view>
				</view>
			</view>
			<!-- #ifndef APP-PLUS -->
			<view class="flexRow flexSpaceBetween flexCenter no-user-lv download" v-if="loginShow && assetData.grade !== 'E'">
				<view>
					<view class="download-title">下载熙选APP</view>
					<view class="download-subtitle">查看我的收益</view>
				</view>
				<view class="alignItemCenter">
					<view class="goBtn" @click="goToHome"><text class="relative goBtnTxt">GO</text></view>
				</view>
			</view>
			<!-- #endif -->
			<view class="xx-card mt10 relative">
				<view class="xx-card-hd">
					<view class="xx-card-title">我的订单</view>
					<view class="xx-card-more" @click="orderAll">
						<text class="xx-card-more-text mt3">查看全部</text>
						<u-icon name="arrow-right" color="#707184" style="margin-left: 6rpx;"></u-icon>
					</view>
				</view>
				<view class="">
					<view class="xx-member-modue flexRow mt20">
						<view class="xx-member-item grey1 orderpayingicon" @click="orderClick('no_pay')">待付款</view>
						<view class="xx-member-item grey1 ordershippingicon" @click="orderClick('paid')">待发货</view>
						<view class="xx-member-item grey1 orderreceivingicon" @click="orderClick('delivered')">待收货</view>
						<view class="xx-member-item grey1 orderreturnrefundicon" @click="refundClick">退款/售后</view>
					</view>
				</view>
			</view>
			<view class="xx-card mt10">
				<view class="xx-card-hd"><view class="xx-card-title">更多服务</view></view>
				<view class="">
					<view class="xx-member-modue flexRow mt20">
						<contact style="width: 25%;"><view class="xx-member-item grey1 messageicon" style="width: 100%;">线上客服</view></contact>
						<protocol type="3" style="width: 25%;"><view class="xx-member-item grey1 rulesicon" style="width: 100%;">协议规则</view></protocol>
						<view class="xx-member-item grey1 addressicon" @click="addressClick">地址管理</view>
						<!-- 	<view class="xx-member-item grey1 addressicon" @click="tabItem">
							切换主题
						</view> -->
						<!-- #ifndef MP-WEIXIN -->
						<view class="xx-member-item grey1 logout" @click="delStore">退出登录</view>
						<!-- #endif -->
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import contact from '@/components/contact/contact.vue';
import protocol from '@/components/protocol/protocol.vue';
import { getValue, GoNavTo, showToast, removeKey, setValue } from '@/common/js/utils';
import { accountToken } from '@/common/api/login';
import { accountInfo, accountAssetget } from '@/common/api/member.js';
export default {
	data() {
		return {
			userData: {}, //用户信息
			userSHow: false,
			loginShow: false,
			assetData: {}, //资产信息
			growth: '',
			promotion: ''
		};
	},
	components: {
		contact,
		protocol
	},
	onShow() {
		this.loginShow = getValue('token') ? getValue('token') : false;
		// //监听登录状态
		// this.$Sub.addListent('refreshToken',()=>{
		// 	console.log("-----------------------------")
		// 	this.resetPage()
		// 	return
		// })
		console.log('-------2222------------');
		if (getValue('token')) {
			this.resetPage();
		}
	},
	methods: {
		//初始化页面
		resetPage() {
			this.userInfo();
			this.priceList();
		},
		goToHome() {
			//点击go
			GoNavTo({
				url: '/pages/index/index',
				type: 'switchTab'
			});
		},
		moneyClick(e) {
			uni.navigateTo({
				url: '/pagesmember/my/money/money?id=' + e,
				success: res => {
					// 通过eventChannel向被打开页面传送数据
					res.eventChannel.emit('getAssetData', {
						data: this.assetData
					});
				}
			});
		},
		//我的资产
		async priceList() {
			const reset = await accountAssetget();
			if (reset && reset.success) {
				console.log('资产信息=', reset);
				this.assetData = reset.body;
				this.userSHow = reset.body.grade !== 'E';
				setValue('grade', reset.body.grade);
				let newTxt = reset.body.growthSlogan[0];
				if (reset.body.growthSlogan.length > 1) {
					reset.body.growthSlogan.forEach((item, i) => {
						if (i < 1) return;
						newTxt = newTxt.replace(`{${i}}`, item);
					});
				}
				this.growth = newTxt;
			}
		},
		//退款和售后
		refundClick() {
			this.notLogin('/pagesmember/order/refund/refund');
		},
		orderClick(e) {
			this.notLogin('/pagesmember/order/order?type=' + e);
		},
		// 全部订单
		orderAll() {
			this.notLogin('/pagesmember/order/order');
		},
		notLogin(path) {
			//未登录统一处理
			if (!this.loginShow) {
				showToast('请先登录');
				setTimeout(() => {
					GoNavTo({
						url: '/pagesmember/user/login/login'
					});
				}, 800);
				return;
			}
			GoNavTo({
				url: path
			});
		},
		delStore() {
			removeKey('token');
			removeKey('refreshToken');
			removeKey('cart');
			removeKey('payerId');
			removeKey('exp');
			showToast('退出成功', 'success');
			setTimeout(() => {
				GoNavTo({
					type: 'reLaunch',
					url: '/pages/index/index'
				});
			}, 800);
		},
		Ciip(e) {
			uni.setClipboardData({
				data: e,
				success: function() {
					showToast('复制成功');
				}
			});
		},
		addressClick() {
			//地址管理
			this.notLogin('/pagesmember/address/list/address');
		},
		UserClick() {
			if (this.loginShow) {
				return;
			}
			GoNavTo({
				url: '/pagesmember/user/login/login'
			});
		},
		// 获取用户信息
		async userInfo() {
			const reset = await accountInfo();
			if (reset && reset.success) {
				this.userData = reset.body;
				this.userData.uid = getValue('userId');
				this.loginShow = true;
			}
		},
		tabItem() {
			this.userSHow = !this.userSHow;
		},
		//查看收益详情
		seeEarnings() {
			this.notLogin('/pagesmember/my/money/money');
		},
		//查看客户管理
		seeCustomer() {
			this.notLogin('/pagesearnings/customerManagement/customerManagement');
		},
		//查看会员页
		goToMember() {
			GoNavTo({
				url: '/pages/commonPages/commonPages?id=197'
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.xx-warp {
	background: #f6f6f6;
	height: 100vh;

	.memberVip {
		background: #26273a !important;

		.xx-warp-name {
			color: #ffffff;
		}
	}

	.xx-warp-member {
		// height: 338rpx;
		padding: 0 24rpx 0;
		background: #ffffff;

		.xx-warp-info {
			margin-top: 36rpx;
			margin-bottom: 36rpx;

			.xx-warp-img {
				width: 120rpx;
				height: 120rpx;
				background: #e8e8e8;
				border-radius: 120rpx;
			}

			.xx-warp-user {
				flex: 1;
				margin-left: 20rpx;
				margin-top: 20rpx;

				.xx-warp-name {
				}
			}
		}
	}

	.no-user-lv {
		.goBtn {
			position: absolute;
			background: #000;
			width: 100rpx;
			height: 50rpx;
			border-radius: 25rpx;
			color: #fff;
			text-align: center;
			line-height: 50rpx;
			text-align: center;
			right: 40rpx;
			top: 50%;
			transform: translateY(-50%);

			.goBtnTxt {
				background: url(../../static/jiantou.png) center right no-repeat;
				background-size: auto 16rpx;
				padding-right: 16rpx;
			}
		}
	}

	.xx-warp-level {
		margin: 30rpx 0;

		.xx-warp-level-info {
			height: 86rpx;
			padding: 16rpx 28rpx;
			border-radius: 8rpx;
			margin-bottom: 12rpx;
		}
	}

	.xx-warp-level-plan {
		position: relative;
		height: 10rpx;
		background: rgba(255, 255, 255, 0.3);
		border-radius: 10px;

		.xx-warp-level-on {
			position: absolute;
			left: 0;
			top: 0;
			height: 10rpx;
			background: #fff2ed;
			min-width: 12rpx;
			width: 100rpx;
			border-radius: 10px;
		}
	}

	.xx-member-price {
		.xx-member-price-item {
			flex: 1;
			text-align: center;
		}
		.parting-line {
			width: 1rpx;
			height: 48rpx;
			background: #e8e8e8;
		}
	}

	.xx-card-more {
		position: absolute;
		top: 0;
		right: 0;
		padding-top: 24rpx;

		.xx-card-more-text {
			height: 30rpx;
			line-height: 30rpx;
			font-family: PingFangSC-Regular;
			font-size: 22rpx;
			color: #26273a;
		}
	}

	.xx-warp-item {
		flex: 1;
		padding: 0 24rpx;

		.xx-member-modue {
			.xx-member-item {
				width: 25%;
				text-align: center;
				font-size: 22rpx;
				padding-top: 64rpx;
			}
		}
	}

	.messageicon {
		background: url(../../static/customer.png) center top no-repeat;
		background-size: 48rpx auto;
	}

	.rulesicon {
		background: url(../../static/rulesicon.png) center top no-repeat;
		background-size: 48rpx auto;
	}

	.addressicon {
		background: url(../../static/addressicon.png) center top no-repeat;
		background-size: 48rpx auto;
	}

	.orderpayingicon {
		background: url(../../static/orderpayingicon.png) center top no-repeat;
		background-size: 48rpx auto;
	}

	.ordershippingicon {
		background: url(../../static/ordershippingicon.png) center top no-repeat;
		background-size: 48rpx auto;
	}

	.orderreceivingicon {
		background: url(../../static/orderreceivingicon.png) center top no-repeat;
		background-size: 48rpx auto;
	}

	.orderreturnrefundicon {
		background: url(../../static/orderreturnrefundicon.png) center top no-repeat;
		background-size: 48rpx auto;
	}
	.logout {
		background: url(../../static/logout.png) center top no-repeat;
		background-size: 48rpx auto;
	}

	.memberUser {
		display: inline-block;
		height: 40rpx;
		line-height: 40rpx;
	}

	.vipicon {
		background: url(../../static/vipicon.png) center top no-repeat;
		background-size: 32rpx auto;
		width: 40rpx;
		height: 40rpx;
		margin-left: 8rpx;
		display: inline-block;
		vertical-align: middle;
	}

	.xx-warp-level-cz {
		background: url(../../static/morewhiteicon.png) center right no-repeat;
		padding-right: 20rpx;
		background-size: 20rpx auto;
	}

	.promotion-slogan {
		position: relative;
		height: 120rpx;
		background-color: #ffffff;
		background-position: center;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		box-sizing: border-box;
	}

	.user-avatar {
		width: 120rpx;
		height: 120rpx;
		border-radius: 120rpx;
		overflow: hidden;
	}
}
.earnings-overview {
	font-family: PingFangSC-Regular;
	font-size: 28rpx;
	color: #26273a;
}
.see_all {
	color: #26273a;
	font-family: PingFangSC-Regular;
	font-size: 22rpx;
}
.xx-card-bd {
	margin-top: 40rpx;
}
.earnings-card {
	background: #ffffff;
	border-radius: 8rpx;
	padding: 24rpx 24rpx 0;
	.my-customer {
		height: 88rpx;
		font-size: 28rpx;
		color: #26273a;
		padding-left: 6rpx;
		margin-top: 22rpx;
		border-top: 1rpx solid #e8e8e8;
		box-sizing: border-box;
		.my-customer-title image {
			width: 30rpx;
			height: 30rpx;
			margin-right: 16rpx;
		}
	}
}
.download {
	position: relative;
	height: 120rpx;
	background: #ffffff;
	padding: 0 39rpx 0 32rpx;
	margin-top: 20rpx;
	border-radius: 8rpx;
	box-sizing: border-box;
	.download-title {
		font-family: PingFangSC-Regular;
		font-size: 28rpx;
		color: #26273a;
	}
	.download-subtitle {
		font-family: PingFangSC-Regular;
		font-size: 22rpx;
		color: #707184;
		line-height: 32rpx;
		margin-top: 4rpx;
	}
}
</style>
