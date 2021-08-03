<template>
	<view class="button-box safe-area">
		<!-- #ifdef APP-PLUS -->
		<view class="button online" @click="clickContact">
			<image src="https://s.umeibei.com/app/img/contact.png" style="width: 64rpx;height: 64rpx;"></image>
			<text>在线客服</text>
		</view>
		<!-- #endif -->
		<!-- #ifdef MP-WEIXIN -->
		<button class="button online" open-type="contact" :session-from="userInfo" @click="clickContact">
			<image src="https://s.umeibei.com/app/img/contact.png" style="width: 64rpx;height: 64rpx;"></image>
			<text>在线客服</text>
		</button>
		<!-- #endif -->
		<view class="center-line"></view>
		<view class="button tel">
			<view style="">
				<image src="https://s.umeibei.com/app/img/kefu_tel.png" style="width: 64rpx;height: 64rpx;">
				</image>
			</view>
			<view class="txt">
				<view class="">即将上线</view>
				<view class="">熙选官方客服热线</view>
			</view>
		</view>
	</view>
</template>

<script>
	// // #ifdef APP-PLUS
	// const plug = uni.requireNativePlugin("Html5app-Meiqia");
	// // #endif
	import {
		getValue,
		setValue,
		GoNavTo
	} from '@/common/js/utils.js'
	import httpUrl from '@/http/config.js'
	export default {
		name: "contact",
		props: {},
		data() {
			return {
				userInfo: ''
			};
		},
		created() {

		},
		mounted() {},
		methods: {
			clickContact() { //点击客服
				let params = {
					"tel": getValue('mobile') || '',
					"name": getValue('nickname') || ''
				}
				this.userInfo = JSON.stringify(Object.assign(params, this.sourceInfo))
				// #ifdef APP-PLUS
				let url = encodeURIComponent(
					`${httpUrl.baseUrl}/meiqia/chatlink.html?eid=34c2e68a369172110e2efc76f84185a8&metadata=${this.userInfo}`
					)
				GoNavTo({
					url: `/pages/commonPages/commonPages?url=${url}`
				})
				// plug.openUser({
				// 	"name": getValue('nickname') || '',
				// 	"tel": getValue('mobile') || '',
				// 	...this.sourceInfo
				// });
				// #endif
			}
		}
	}
</script>

<style lang="scss" scoped>
	button {
		margin: inherit;
		// padding: inherit;
		width: inherit;
		border-radius: inherit;
		font-size: inherit;
		color: inherit;
		// line-height: inherit;
		background-color: transparent;
	}

	button::after {
		display: none;
	}

	.button-box {
		display: flex;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		width: 750rpx;
		background-color: #FFFFFF;
		align-items: center;


		.button {
			display: flex;
			flex: 1;
			height: 110rpx;
			justify-content: center;
			align-items: center;
		}

		.center-line {
			width: 1rpx;
			height: 48rpx;
			background: #E8E8E8;
		}

		.online {
			font-family: PingFangSCRegular;
			font-size: 24rpx;
			color: #26273A;
		}

		.tel {
			font-family: PingFangSC-Regular;
			font-size: 24rpx;
			color: #B1B2C1;

			.txt {
				text-align: center;
			}
		}
	}
</style>
