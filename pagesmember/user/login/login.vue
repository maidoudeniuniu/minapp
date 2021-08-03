<template>
	<view class="page">
		<layout :BP="false" background="transparent" backgroundNavColor="transparent" :headerShow='true'
			:border='false'>
			<view class="xx-warp-warp">
				<view class="xx-warp-header flexRow flexSpaceBetween mt100">
					<view class="xx-warp-header-close closeicon" @click="clickLeft"></view>
					<view class="xx-warp-header-Text" @click="clickLeft">跳过看好物</view>
				</view>
				<view class="xx-warp-login-content">

				</view>
				<view class="xx-warp-footer">
					<view class="mb20">
						<!-- #ifdef APP-PLUS -->
						<u-button type="success" open-type="getPhoneNumber" @click="onGetPhoneNumberApp">
							<view class="weixinicon">微信一键登录</view>
						</u-button>
						<!-- #endif -->
						<!-- #ifdef MP-WEIXIN -->
						<u-button type="success" open-type="getPhoneNumber" @getphonenumber="onGetPhoneNumber">
							<view class="weixinicon">微信一键登录</view>
						</u-button>
						<!-- #endif -->
					</view>
					<u-button type="primary" @click="telClick">手机登录</u-button>
					<view class="xx-warp-footer-xieyi grey2 f12 mt14 mb30">
						登录即视为您已阅读同意 <protocol class="baseColor protocol" type="2">用户注册协议</protocol> 和 <protocol
							class="baseColor protocol" type="1">熙选平台隐私协议
						</protocol>
					</view>
				</view>
			</view>
		</layout>
	</view>
</template>

<script>
	import protocol from '@/components/protocol/protocol.vue'
	import {
		GoNavTo,
		setValue,
		getValue,
		showToast
	} from '@/common/js/utils.js'
	import {
		accountToken,
		accountAuthGetUserID
	} from '@/common/api/login.js'
	export default {
		data() {
			return {
				clickLeftShow: true
			}
		},
		components: {
			protocol
		},
		onLoad(e) {

		},
		onShow() {
			// #ifdef MP-WEIXIN
			     this.startLogin()
			// #endif  
		},
		methods: {
			startLogin(type = 1) {
				//type 1 小程序  2 app 登陆
				let _this = this;
				let openId = getValue("payerId")
				wx.login({
					async success(res) {
						if (res.code) {
							const reset = await accountToken({
								authCode: res.code,
								appId: "1030"
							})
							if (reset && reset.success) {
								// 新用户进来只有openid 和 sessionKey
								let { openid , sessionKey , apiKey} = reset.body || {}
								if(openid){
									console.log("-------------------新用户---------------------")
									setValue("payerId", openid)
									return
								}else{	
									console.log("-------------------老用户---------------------")
									// 老用户
									if (type == 1) {
										setValue("token", reset.token)
										setValue("mobile", reset.body.mobile)
										setValue("userId", reset.body.userId)
										setValue("logo", reset.body.logo)
										setValue("nickname", reset.body.nickname)
										setValue("refreshToken", reset.body.refreshToken)
										_this.startUser(type)
									} else if (type == 2) {
										GoNavTo({
											url: "/pagesmember/user/tellogin/tel?openid=" + openId
										})
									}									
								}
							}
						}
					}
				})
			},
			startUser(type = 1) {
				//type 1 小程序  2 app 登陆
				let openId = getValue("payerId")
				wx.login({
					async success(res) {
						if (res.code) {
							const reset1 = await accountAuthGetUserID({
								authCode: res.code,
								authType: "wx_ma",
								appId: "1030"
							})
							if (reset1 && reset1.success) {
								if (type == 1) {
									setValue("payerId", reset1.body)
									uni.navigateBack()
								} else if (type == 2) {
									GoNavTo({
										url: "/pagesmember/user/tellogin/tel?openid=" + openId
									})
								}
							}
						}
					}
				})
			},
			async startAppLogin(code) {
				let openId = getValue("payerId")
				const reset = await accountAuthGetUserID({
					authCode: code,
					authType: "wx_ma",
					appId: "1030"
				})
				if (reset && reset.success) {
					GoNavTo({
						url: "/pagesmember/user/tellogin/tel?openid=" + openId
					})
				}
			},
			// #ifdef MP-WEIXIN
			//获取手机号码
			async onGetPhoneNumber(e) {
				let _this = this;
				wx.login({
					async success(res) {
						if (res.code) {
							const reset = await accountToken({
								authCode: res.code,
								appId: "1030",
								iv: e.detail.iv,
								encryptedData: e.detail.encryptedData
							})
							if (reset && reset.success && reset.token) {
								console.log(reset)
								_this.loginSuccess(reset)
							}
						}
					}
				})
			},
			// #endif
			// #ifdef APP-PLUS		
			onGetPhoneNumberApp: function(res) {
				console.log(res)
				let _this = this;
				uni.getProvider({
					service: 'oauth',
					success: function(res) {
						console.log(res)
						//支持微信、qq和微博等
						if (~res.provider.indexOf("weixin")) {
							console.log(res)
							uni.login({
								provider: 'weixin',
								success: async function(loginRes) {
									console.log(loginRes)
									// _this.wxAuthSuccess(loginRes)
								},
								fail(err) {
									console.log(err)
									showToast('授权失败')
								},
								async complete(loginRes) {
									console.log(loginRes)
									_this.wxAuthSuccess(loginRes)
								}
							});
						} else {
							showToast('授权失败')
						}
					},
					fail(err) {
						console.log(err)
					}
				});
			},

			// #endif
			loginSuccess(reset) { //登录成功处理
				setValue("token", reset.token)
				setValue("mobile", reset.body.mobile)
				setValue("userId", reset.body.userId)
				setValue("logo", reset.body.logo)
				setValue("nickname", reset.body.nickname)
				setValue("refreshToken", reset.body.refreshToken)
				// _this.startLogin(1)
				showToast('登录成功', 'success')
				setTimeout(() => {
					uni.navigateBack()
				}, 600)
			},
			// #ifdef APP-PLUS
			async wxAuthSuccess(loginRes) { //app微信授权成功处理
				console.log(loginRes)
				let _this = this
				if (loginRes.errMsg !== "login:ok") return showToast('授权失败')
				setValue("payerId", loginRes.authResult.openid)
				const {
					access_token,
					openid
				} = loginRes.authResult
				const reset = await accountToken({
					openid,
					accessToken: access_token,
					"authType": "wx_open",
				})
				console.log(JSON.stringify(reset))
				if (reset.success && reset.token) {
					_this.loginSuccess(reset)
				} else {
					GoNavTo({
						url: '/pagesmember/user/tellogin/tel?openid=' + openid
					})
				}
			},
			// #endif
			clickLeft() {
				GoNavTo({
					type: 'reLaunch',
					url: "/pages/index/index"
				})
			},
			telClick() {
				GoNavTo({
					type: 'redirectTo',
					url: "/pagesmember/user/tellogin/tel"
				})
			}
		}
	}
</script>

<style lang="scss">
	.xx-warp-warp {
		display: flex;
		flex-direction: column;
		padding: 0 30rpx;
		flex: 1;

		// background: url(../../../static/regbg.png) center center no-repeat;
		background-size: 100% 100%;

		.xx-warp-header {
			.xx-warp-header-close {
				background: url(../../../static/closeIcon.png) center center no-repeat;
				width: 48rpx;
				height: 48rpx;
				background-size: 48rpx auto;
			}

			.xx-warp-header-Text {
				height: 48rpx;
				line-height: 48rpx;
			}
		}

		.xx-warp-login-content {
			flex: 1;
			// background: url(../../../static/loginbg.png) center center no-repeat;
			background-size: 200rpx auto;
		}

		.xx-warp-footer {
			.weixinicon {
				background: url(../../../static/weixinicon.png) center left no-repeat;
				padding-left: 50rpx;
				background-size: 44rpx auto;
			}

			.xx-warp-footer-xieyi {
				background: url(../../../static/checkboxSelected.png) center left no-repeat;
				padding-left: 30rpx;
				background-size: 24rpx auto;
			}
		}
	}

	.protocol {
		display: inline-block;
	}

	.xx-warp-warp {
		background-color: transparent;
	}

	.page {
		background: url('https://s.umeibei.com/app/img/loginbg.jpg') top center no-repeat;
		background-size: 100% 100%;
	}
</style>
