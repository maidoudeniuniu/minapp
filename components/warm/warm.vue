<template>
	<view class="xx-warm" v-if="show">
		<view class="xx-warm-info">
			<view class="xx-warm-header bold alignCenter">温馨提示</view>
			<view class="xx-warm-centent">
				<view class="grey1">熙选为了更好地保护您的隐私和信息安全，根据国家相关法律规定和国家标准更新了<protocol type="1" class="protocol" className="inline">《熙选隐私政策》
					</protocol>，特向您说明：</view>
				<view class="baseColor">为向您提供基本服务，我们会遵循正当、合法、必要的原则收集和使用必要的信息。</view>
				<view class="baseColor">未经您的授权同意，我们不会将您的信息共享给第三方或用于您未授权的其他用途。</view>
				<view class="baseColor">我们会采用业界先进的安全措施保护您的信息安全。</view>
				<view class="baseColor">您在点击同意前，请您务必审慎阅读，并充分理解协议条款内容，确认同意后即可开启熙选服务。如您不同意<protocol type="1"
						class="protocol" className="inline">《熙选隐私政策》</protocol>，请不要开启服务。</view>
			</view>
			<view class="xx-warm-footer mt14">
				<view class="xx-warm-footer-item flex1 alignCenter f16 bold grey2" @click="warmClick('no')">
					拒绝
				</view>
				<view class="xx-warm-footer-item flex1 alignCenter f16 bold" @click="warmClick('ok')">
					同意
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import protocol from '@/components/protocol/protocol.vue'
	import {
		setValue,
		getValue
	} from '@/common/js/utils.js'
	export default {
		props: {
			warmShow: {
				type: Boolean,
				default: true,
			}
		},
		data() {
			return {
				show: false
			}
		},
		mounted() {
			if (getValue("warmType")) {
				this.show = false
				return
			}
			this.show = this.warmShow
		},
		methods: {
			warmClick(e) {
				this.show = false
				setValue("warmType", 1)
				this.$emit("warmEmit", e)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.xx-warm {
		position: fixed;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		background: rgba(0, 0, 0, .6);
		z-index: 10000;
		display: flex;
		flex-direction: column;
		justify-content: center;

		.xx-warm-info {
			width: 534rpx;
			background: #FFFFFF;
			margin: auto;
			border-radius: 10rpx;
			font-size: 26rpx;

			.xx-warm-header {
				height: 70rpx;
				line-height: 70rpx;
				font-size: 32rpx;
				margin-top: 20rpx;
			}

			.xx-warm-centent {
				padding: 0 32rpx;
			}

			.xx-warm-footer {
				display: flex;
				flex-direction: row;
				border-top: #f5f5f5 1px solid;

				.xx-warm-footer-item {
					padding: 34rpx 0;
				}

				.xx-warm-footer-item:first-child {
					border-right: #f5f5f5 1px solid;
				}
			}
		}

		.protocol {
			color: #3c68e4;
						display: inline;
		}
	}
</style>
