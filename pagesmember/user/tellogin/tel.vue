<template>
	<layout :BP="false" :headerShow="false">
		<view class="xx-warp">
			<view class="xx-warp-login mt67">
				<view class="f18 bold">{{ openid ? '绑定' : '输入' }}您的手机号码</view>
				<view class="grey2 mt6 f12 wordBreakAll">
					登录注册表示同意
					<protocol class="baseColor protocol" type="2">《用户注册协议》</protocol>
					和
					<protocol class="baseColor protocol" type="1">《熙选平台隐私协议》</protocol>
				</view>
			</view>
			<view class="xx-warp-login-form mt64 flexColumn">
				<view class="login-form-item borderBottom flexRow flexCenter">
					<view class="DINM bold f15 formLabel formLabelTxt">+86</view>
					<view class="f15 DINM flex1 formInfo">
						<u-input v-model="value" type="number" placeholder="输入手机号码" maxlength="11" placeholder-style="color:#B1B2C1" :class="[{ DINM: value }, { bold: value }]" />
						<!-- 	<Input v-model="value" placeholder="输入手机号码" maxlength="11" type="number" placeholder-style="color:#B1B2C1" :class="[{DINM:value},{bold:value}]"/> -->
					</view>
				</view>
				<view class="login-form-item flexRow mt6 borderBottom flexCenter">
					<view class="flex1 formInfo">
						<u-input
							v-model="code"
							type="number"
							placeholder="输入验证码"
							maxlength="4"
							placeholder-style="color:#B1B2C1"
							:class="[{ DINM: value }, { bold: value }]"
							:clearable="false"
						/>
						<!-- <Input v-model="code" placeholder="输入验证码" placeholder-style="color:#B1B2C1" maxlength="6" type="number" :class="[{DINM:code},{bold:code}]"/> -->
					</view>
					<view class="f15" @click="sendCode">{{ codeNum == 60 ? (index == 0 ? codeTxt : '重新获取') : codeNum + 'S' }}</view>
				</view>
				<view class="mt14 mt20"><u-button type="primary" :disabled="!disabled" @click="loginClick">手机号登录</u-button></view>
			</view>
		</view>
	</layout>
</template>

<script>
import protocol from '@/components/protocol/protocol.vue';
import { GoNavTo, setValue, showToast } from '@/common/js/utils.js';
import { accountCode, accountToken } from '@/common/api/login.js';
let sentTime;
export default {
	data() {
		return {
			value: '',
			code: '',
			codeTxt: '获取验证码',
			codeNum: 60,
			index: 0,
			openid: null
		};
	},
	components: {
		protocol
	},
	computed: {
		disabled() {
			return this.value && this.code;
		}
	},
	onHide() {
		clearInterval(sentTime);
	},
	onUnload() {
		clearInterval(sentTime);
	},
	onShow() {
		this.resetpage();
	},
	onLoad(e) {
		// #ifdef APP-PLUS
		this.openid = e.openid;
		// #endif
	},
	methods: {
		//初始化
		resetpage() {
			this.codeNum = 60;
			this.sendShow = true;
		},
		//发送验证码
		async sendCode() {
			if (!this.value) {
				showToast('手机号码没有填写');
				return;
			}
			if (this.value.length != 11) {
				showToast('手机号码格式不对');
				return;
			}
			if (!this.sendShow) {
				return;
			}
			this.code = '';
			const reset = await accountCode({
				phone: this.value
			});
			if (reset && reset.body) {
				this.sendShow = false;
				sentTime = setInterval(this.sendCodeNum, 1000);
			}
		},
		sendCodeNum() {
			this.index = 1;
			if (this.codeNum < 1) {
				this.resetpage();
				clearInterval(sentTime);
			} else {
				this.codeNum--;
			}
		},
		async loginClick() {
			let data = {
				phone: this.value,
				code: this.code
			};
			if (this.openid) {
				data.openid = this.openid;
			}
			const reset = await accountToken(data);

			if (reset && reset.success) {
				// uni.navigateBack()
				showToast('登录成功', 'success');
				uni.reLaunch({
					url: '/pages/member/member'
				});
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.xx-warp {
	padding: 0 50rpx;

	.login-form-item {
		// padding: 20rpx 0;
		height: 100rpx;
	}

	.formLabel {
		height: 30rpx;
		line-height: 30rpx;
		padding: 0 20rpx;
		// margin-top: 5rpx;
		margin-right: 20rpx;
	}

	.formLabelTxt {
		border-right: #ddd 1px solid;
	}

	.formInfo {
		// height: 40rpx;
		/* #ifdef APP-PLUS */
		// margin-top: -12rpx;
		/* #endif */
	}
}

.protocol {
	display: inline-block;
}
</style>
