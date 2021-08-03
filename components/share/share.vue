<template>
	<view class="shareBox" v-if="show">
		<view class="shareBox-mark" v-if="show"></view>
		<view class="shareBox-info" v-if="show">
			<view class="shareBox-item flexRow">
				<view class="flex1">
					<view class="shareBox-item-list" @click="weixinhaoyou">
						<view class="shareBox-item-img weixinicon"></view>
						<view class="shareBox-item-txt mt10">微信好友</view>
					</view>
				</view>
				<!-- 		<view class="flex1">
					<view class="shareBox-item-list" @click="weixinpy">
						<view class="shareBox-item-img shareIcon"></view>
						<view class="shareBox-item-txt mt10">微信朋友圈</view>
					</view>
				</view> -->
			</view>
			<view class="h10 basebg"></view>
			<view class="shareBox-info-btn" @click="emitShare">取消</view>
		</view>
	</view>
</template>

<script>
import { getValue, GoNavTo, showToast } from '@/common/js/utils.js';
export default {
	props: {
		show: {
			type: Boolean,
			default: false
		},
		shareData: {
			type: Object,
			default: () => {}
		}
	},
	methods: {
		emitShare() {
			this.$emit('emitShare');
		},
		weixinhaoyou() {
			if (!getValue('token')) {
				showToast('请先登录');
				setTimeout(() => {
					GoNavTo({
						url: '/pagesmember/user/login/login'
					});
				}, 800);
				return;
			}
			let { href, title, imageUrl, summary } = this.shareData;
			let userId = getValue("userId") || ""
			let _this = this;			 
			uni.share({
				provider: 'weixin',
				scene: 'WXSceneSession',
				type: 5,
				title,
				summary,
				imageUrl,
				miniProgram: {
					id: 'gh_db0df14c3f55',
					path: href,
					type: 2,
					webUrl: 'https://m.puresnake.com/h5/pages/custom/index?page_id=192'
				},
				success: function(res) {
					_this.$emit('emitShare');
				},
				fail: function(err) {
					_this.$emit('emitShare');
				},
				complete(e) {
					console.log(e);
				}
			});
		},
		weixinpy() {
			let { href, title, imageUrl, summary } = this.shareData;
			let _this = this;
			uni.share({
				provider: 'weixin',
				scene: 'WXSenceTimeline',
				type: 0,
				href,
				title,
				summary,
				imageUrl,
				success: function(res) {
					_this.$emit('emitShare');
				},
				fail: function(err) {
					_this.$emit('emitShare');
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.shareBox {
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 10000;
	display: flex;
	flex-direction: column;

	.shareBox-mark {
		background: rgba(37, 38, 45, 0.5);
		flex: 1;
	}

	.shareBox-info {
		background: #ffffff;

		.shareBox-item {
			padding: 40rpx;

			.shareBox-item-list {
				width: 200rpx;
				margin: 0 auto;

				.shareBox-item-img {
					width: 100rpx;
					height: 100rpx;
					border-radius: 100rpx;
					margin: 0 auto;
					background: #000;
				}

				.weixinicon {
					background: url(../../static/weixin.png) center center no-repeat;
					background-size: 100rpx auto;
				}

				.shareIcon {
					background: url(../../static/share.png) center center #fff no-repeat;
					background-size: 80rpx auto;
					box-shadow: 0px 1px 5px #ddd;
				}

				.shareBox-item-txt {
					text-align: center;
				}
			}
		}

		.shareBox-info-btn {
			height: 120rpx;
			line-height: 120rpx;
			text-align: center;
			color: #707184;
		}
	}
}
</style>
