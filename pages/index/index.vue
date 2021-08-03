<template>
	<detail :BP="false" :headerShow="true" :backgroundNavColor="backgroundNavColor" :fixed="true" :titleColor="titleColor" :titleIcon="true">
		<view class="xx-warp basebg">
			<!-- <image src="../../static/2_00000_iSpt.png"></image> -->
			<cms :config="config" v-if="config"></cms>
			<warm-component></warm-component>
		</view>
	</detail>
</template>

<script>
import { cmsPages } from '@/common/api/cms.js';
import { GoNavTo, sloganshift, getValue, setValue } from '@/common/js/utils.js';
import warmComponent from '@/components/warm/warm.vue';
import cms from '@/components/cms/cms.vue';
export default {
	name: 'home',
	data() {
		return {
			title: 'Hello',
			scrollTop: 0,
			topstatus: false,
			size: 10,
			totalPage: 0,
			config: null,
			backgroundNavColor: 'rgba(255,255,255,0)',
			titleColor: 'rgb(255,255,255)',
			headerShow: true //自定义nav是否显示
		};
	},
	components: {
		warmComponent,
		cms
	},
	onLoad() {		
		this.getCmsContent();
	},
	onShow() {
		console.log(11111111111)
		uni.setTabBarItem({
			index: 0,
			text: ''
		});
		this.scrollTop = 0;
	},
	onTabItemTap(e) {
		if (this.scrollTop < 100) return;
		uni.pageScrollTo({
			scrollTop: 0,
			duration: 400
		});
	},
	onPageScroll(e) {
		this.$u.debounce(this.scrollEvent.bind(this, e), 50);
		if (e.scrollTop > 0 && e.scrollTop < 300) {
			let num = parseFloat((e.scrollTop - 30) / 100) > 1 ? 1 : parseFloat((e.scrollTop - 30) / 100);
			this.backgroundNavColor = 'rgba(255,255,255,' + num + ')';
			this.titleColor = `rgb(${255 - num * 255},${255 - num * 255},${255 - num * 255})`;
		} else if (e.scrollTop < 15) {
			this.backgroundNavColor = 'rgba(255,255,255,0)';
			this.titleColor = 'rgb(255,255,255)';
		}
	},
	onPullDownRefresh(e) {
		this.$u.throttle(this.getCmsContent, 1000);
		setTimeout(() => {
			uni.stopPullDownRefresh();
		}, 1000);
	},
	methods: {
		async getCmsContent() {
			cmsPages('192')
				.then(res => {
					console.log(res);
					this.config = res;
				})
				.catch(err => {
					console.log(err);
				});
		},
		wxGetUserInfo() {
			wx.getUserInfo({
				success: function(infoRes) {
					console.log(infoRes);
				},
				fail(res) {}
			});
		},
		wxLogin() {
			let _this = this;
			wx.login({
				async success(res) {
					console.log(res);
					return;
					if (res.code) {
						let data = {
							code: res.code
						};
						const resdata = await getopenidRequest(data);
						if (resdata.codeId === 1) {
							// 第一次进入的时候resdata.resData中userLoginInfo位null页面就一直在loading
							if (resdata.resData.openid && resdata.resData.sessionkey) {
								setValue('sessionkey', resdata.resData.sessionkey);
								setValue('openid', resdata.resData.openid);
								_this.isLoading = true;
								uni.hideLoading();
							}
							if (resdata.resData.userLoginInfo && Object.keys(resdata.resData.userLoginInfo).length > 0) {
								setValue('userLoginInfo', resdata.resData.userLoginInfo);
								setValue('token', resdata.resData.userLoginInfo.token);
								setValue('phoneNo', resdata.resData.userLoginInfo.phoneNo);
								setValue('accountId', resdata.resData.userLoginInfo.accountId);
								_this.skipPage();
							}
							if (resdata.resData.errorDes) {
								showToast(resdata.resData.errorDes);
							}
						} else {
							_this.isLoading = true;
							uni.hideLoading();
						}
					}
				}
			});
		},
		detailClick(e) {
			console.log(e);
			uni.navigateTo({
				url: '/pages/detail/detail?id=' + e.id
			});
		},
		scrollEvent(e) {
			let _this = this;
			_this.scrollTop = e.scrollTop;
			if (_this.scrollTop > 100) {
				if (_this.topstatus) {
					return;
				}
				uni.setTabBarItem({
					index: 0,
					text: '',
					iconPath: 'static/index.png',
					selectedIconPath: '/static/top.png'
				});
				_this.topstatus = true;
			} else {
				if (!_this.topstatus) {
					return;
				}
				uni.setTabBarItem({
					index: 0,
					text: '',
					iconPath: 'static/index.png',
					selectedIconPath: '/static/index-selected.png'
				});
				_this.topstatus = false;
				_this.scrollTop = e.scrollTop;
			}
		},
		callback() {}
	},
	onUnload() {
		uni.setTabBarItem({
			index: 0,
			text: '熙选'
		});
	},
	onHide() {
		uni.setTabBarItem({
			index: 0,
			text: '熙选'
		});
	}
};
</script>

<style lang="scss" scoped>
.scroll-Y {
	height: 100vh;
}

.xx-item {
	background: #ffffff;
	padding: 24rpx;
	margin-bottom: 20rpx;
	display: flex;
	flex-direction: row;

	.xx-item-img {
		width: 220rpx;
		height: 220rpx;
		overflow: hidden;
		margin-right: 24rpx;
	}

	.xx-item-info {
		flex: 1;
		display: flex;
		flex-direction: column;

		.xx-item-info-bd {
			// flex: 1;
			min-height: 80rpx;
			display: flex;
			flex-direction: column;

			.xx-item-title {
				max-height: 80rpx;
				overflow: hidden;
			}

			.xx-item-number {
				height: 52rpx;
				line-height: 52rpx;
			}
		}

		.xx-item-info-fd {
			.xx-item-price {
			}
		}
	}
}
</style>
