<template>
	<view class="xx-drawer" v-if="show">
		<view class="xx-drawer-mask"></view>
		<view class="xx-drawer-content">
			<view class="xx-drawer-content-header">
				<view class="xx-content-header-left"></view>
				<view class="xx-content-header-title">选择支付方式</view>
				<view class="xx-content-header-right" @click="close"></view>
			</view>
			<view class="xx-drawer-content-body">
				<view class="xxx-list" v-for="(item,index) in list" :key="index"
					:class="[{'xxx-list-ative':item.show},{'borderBottom':index==0}]" @click="refundClick(item)">
					<text :class="item.className"></text> {{item.name}}
				</view>
				<view class="mt20">
					<u-button type="primary" :disabled="!disabled" @click="emitConfim">提交</u-button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			show: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				list: [
					// #ifdef APP-PLUS
					{
						name: "支付宝支付",
						type: 1,
						show: false,
						className: "alipayicon",
						payChannel: "ali_app",
						provider: 'alipay'
					},
					// #endif
					// #ifdef MP-WEIXIN
					{
						name: "微信支付",
						type: 2,
						show: false,
						className: "weixinicon",
						payChannel: "wx_app",
						provider: 'wxpay'
					},
					// #endif

				]
			}
		},
		computed: {
			disabled() {
				let list = this.list.filter(item => item.show)
				return list && list.length > 0
			}
		},
		methods: {
			close() {
				this.$emit("emitClose", )
			},
			emitConfim() {
				let data = this.list.find(item => item.show)
				this.$emit("emitConfim", data)
			},
			refundClick(e) {
				this.list = this.list.map(item => {
					return {
						...item,
						show: e.type == item.type
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.xx-drawer {
		.xx-content-header-right {
			position: absolute;
			right: 0;
			top: 0;
			height: 100rpx;
			width: 100rpx;
			background: url(../../static/closeIcon.png) center center no-repeat;
			background-size: 40rpx auto;
		}

		.xxx-list {
			height: 100rpx;
			line-height: 100rpx;
			position: relative;
			background: url(../../static/selectno.png) center right no-repeat;
			background-size: 50rpx auto;
		}

		.xxx-list-ative {
			background: url(../../static/select.png) center right no-repeat;
			background-size: 50rpx auto;
		}

		.alipayicon {
			background: url(../../static/alipayicon.png) no-repeat;
			width: 56rpx;
			height: 56rpx;
			background-size: 56rpx auto;
			vertical-align: middle;
			display: inline-block;
			border-radius: 12rpx;
			margin-right: 16rpx;
		}

		.weixinicon {
			background: url(../../static/weixinicon.png) no-repeat;
			width: 56rpx;
			height: 56rpx;
			background-size: 56rpx auto;
			vertical-align: middle;
			display: inline-block;
			border-radius: 12rpx;
			margin-right: 16rpx;
		}
	}
</style>
