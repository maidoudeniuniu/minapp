<template>
	<view>
		<view class="xx-warp list_box">
			<view class="xx-item" v-for="(item,index) in goodsDataList" :key="index" @click="detailClick(item)">
				<view class="xx-item-img">
					<image :src="item.img"></image>
				</view>
				<view class="xx-item-info">
					<view class="xx-item-title f13">{{item.name}}</view>
					<view class="xx-item-price">
						<view class="f16 DIN medium">¥{{item.priceInfo.discountFloor}}</view>
						<view class="viptag1" v-if="item.discountInfo.slogan_cn && item.discountInfo.grade !== 'E'">
							{{item.discountInfo.slogan_cn}}</view>
						<!-- 	<text class="f12 grey2">原价<text
									class="f12 grey2 pl3 DIN relative">¥{{item.priceInfo.markingFloor}}<text
										class="delprice"></text></text></text> -->
					</view>
				</view>
			</view>
			<!-- <warm-component></warm-component> -->
		</view>
		<view class="bottom_bg" v-if="page === totalPage"></view>
	</view>
</template>

<script>
	import {
		GoNavTo,
		sloganshift,
		getValue,
		setValue
	} from '@/common/js/utils.js'
	import {
		goodsList
	} from '@/common/api/goods.js'
	import {
		mineAccountInfo
	} from '@/common/api/member.js'
	import warmComponent from '@/components/warm/warm.vue'
	export default {
		name: "productList",
		data() {
			return {
				title: 'Hello',
				userinfo: null, //用户等级相关数据
				goodsDataList: [],
				topstatus: false,
				page: 1,
				size: 10,
				totalPage: 0
			}
		},
		components: {
			warmComponent
		},
		async onLoad() {
			this.page = 0
			const isLogin = getValue('token')
			if (isLogin) {
				this.userinfo = await mineAccountInfo()
				console.log('用户等级相关信息=', this.userinfo)
				this.goodslist()
			} else {
				this.goodslist()
			}
		},
		onShow() {

		},
		onReachBottom() {
			if (this.totalPage > this.page) {
				this.page++
				this.goodslist()
			}
		},
		methods: {
			async goodslist() {
				const reset = await goodsList({
					grade: this.userinfo ? this.userinfo.body.grade : '',
					page: this.page,
					size: this.size
				})
				if (reset && reset.success) {
					let data = this.goodsDataList.concat(reset.body)
					setTimeout(() => {
						this.goodsDataList = data.map(item => {
							return {
								...item,
								discountInfo: item.discountInfo.slogan ? Object.assign(item
									.discountInfo, {
										slogan_cn: sloganshift(item.discountInfo.slogan)
									}) : item.discountInfo
							}
						})
						console.log(this.goodsDataList)
					}, 100)

					this.totalPage = reset.totalPage - 1
				}
			},
			wxGetUserInfo() {
				wx.getUserInfo({
					success: function(infoRes) {
						console.log(infoRes)


					},
					fail(res) {

					}
				});
			},
			wxLogin() {
				let _this = this;
				wx.login({
					async success(res) {
						console.log(res)
						return
						if (res.code) {
							let data = {
								code: res.code,
							}
							const resdata = await getopenidRequest(data)
							if (resdata.codeId === 1) {
								// 第一次进入的时候resdata.resData中userLoginInfo位null页面就一直在loading
								if (resdata.resData.openid && resdata.resData.sessionkey) {
									setValue('sessionkey', resdata.resData.sessionkey)
									setValue('openid', resdata.resData.openid)
									_this.isLoading = true
									uni.hideLoading()
								}
								if (resdata.resData.userLoginInfo && Object.keys(resdata.resData.userLoginInfo)
									.length > 0) {
									setValue('userLoginInfo', resdata.resData.userLoginInfo)
									setValue('token', resdata.resData.userLoginInfo.token)
									setValue('phoneNo', resdata.resData.userLoginInfo.phoneNo)
									setValue('accountId', resdata.resData.userLoginInfo.accountId)
									_this.skipPage()
								}
								if (resdata.resData.errorDes) {
									showToast(resdata.resData.errorDes)
								}
							} else {
								_this.isLoading = true
								uni.hideLoading()
							}
						}
					}
				})
			},
			detailClick(e) {
				console.log(e)
				uni.navigateTo({
					url: `/pages/detail/detail?id=${e.id}`
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.scroll-Y {
		height: 100vh;
	}

	.list_box {
		flex-direction: row;
		flex-wrap: wrap;
		padding: 8rpx 24rpx 0;
		justify-content: space-between;
		box-sizing: border-box;
	}

	.xx-item {
		width: 343rpx;
		height: 466rpx;
		background: #FBFBFB;
		border-radius: 4rpx;
		margin-top: 16rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		box-sizing: border-box;

		.xx-item-img {
			width: 100%;
			height: 343rpx;
			text-align: center;
			overflow: hidden;
		}

		.xx-item-img image {
			width: 100%;
			height: 100%;
		}

		.xx-item-info {
			flex: 1;
			width: 100%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			.xx-item-info-bd {
				// flex: 1;
				min-height: 80rpx;
				display: flex;
				flex-direction: column;

				.xx-item-title {
					color: #26273A;
					width: 100%;
					padding: 0 18rpx;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					box-sizing: border-box;
				}

				.xx-item-number {
					height: 52rpx;
					line-height: 52rpx;
				}
			}

			.xx-item-price {
				display: flex;
				font-family: DIN-Medium;
				font-size: 32rpx;
				color: #26273A;
				text-align: center;
				align-items: center;
				margin-top: 12rpx;
			}

			.viptag1 {
				height: 32rpx;
				line-height: 30rpx;
				padding: 0 6rpx;
				font-family: PingFangSC-Regular;
				font-size: 22rpx;
				margin-left: 6rpx;
				// color: #764B40;
				border: 1rpx solid #AA7D71;
				border-radius: 2rpx;
				background-image: -webkit-linear-gradient(left, #B18679, #754336);
				-webkit-background-clip: text;
				-webkit-text-fill-color: transparent;
			}
		}
	}

	.bottom_bg {
		width: 100%;
		height: 120rpx;
		background: url(../../static/slogan.png) no-repeat;
		background-size: 100% 100%;
	}
</style>
