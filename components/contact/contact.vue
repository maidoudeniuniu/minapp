<template>
	<view>
		<!-- #ifnef APP-PLUS -->
		<view :class="styleType === 3 ? className : 'contact_box ' + className" @click="clickContact">
			<block v-if="styleType===1">
				<image :src="icon"></image>
				<view>{{txt}}</view>
			</block>
			<block v-else-if="styleType===2">
				<view>{{txt}}</view>
			</block>
			<block v-else-if="styleType==3">
				<slot />
			</block>
		</view>
		<!-- #endi -->
		<!-- #ifdef MP-WEIXIN -->
		<!-- <button :class="styleType === 3 ? className : 'contact_box ' + className" open-type="contact" :session-from="userInfo" @click="clickContact">
			<slot />
		</button> -->
		<!-- #endif -->
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
		props: {
			txt: {
				type: String,
				default: '客服'
			},
			styleType: {
				type: Number,
				default: 3 //插槽形式
			},
			className: {
				type: String,
				default: ''
			},
			icon: {
				type: String,
				default: '/static/customer.png'
			},
			sourceInfo: {
				type: Object,
				default: ()=>{}
			}
		},
		data() {
			return {
				userInfo: ''
			};
		},
		created() {

		},
		mounted() {},
		methods: {
			contact() {

			},
			clickContact() { //点击客服
			GoNavTo({
				url: `/pages/commonPages/commonPages?type=contact&id=194`
			})
				// let params = {
				// 	"tel": getValue('mobile') || '',
				// 	"name": getValue('nickname') || ''
				// }
				// this.userInfo = JSON.stringify(Object.assign(params, this.sourceInfo))
				// #ifdef APP-PLUS
				// let url = encodeURIComponent(
				// 	`${httpUrl.baseUrl}/meiqia/chatlink.html?eid=34c2e68a369172110e2efc76f84185a8&metadata=${this.userInfo}`)
			
				// plug.openUser({
				// 		"name": getValue('nickname') || '',
				// 		"tel": getValue('mobile') || '',
				// 		...this.sourceInfo
				// });
				// #endif
			}
		}
	}
</script>

<style lang="scss" scoped>
	.contact_box {
		display: flex;
		flex-direction: column;
		align-items: center;

		image {
			width: 44rpx;
			height: 44rpx;
		}

		view {
			font-family: PingFangSC-Regular;
			font-size: 24rpx;
			color: #26273A;
			line-height: 24rpx;
			margin-top: 6rpx;
		}
	}

	button {
		margin: inherit;
		padding: inherit;
		width: inherit;
		border-radius: inherit;
		font-size: inherit;
		color: inherit;
		line-height: inherit;
		background-color: transparent;
	}

	button::after {
		display: none;
	}
</style>
