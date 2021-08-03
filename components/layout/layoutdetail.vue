<template>
	<view class="warp-content" :class="[{ isIphoneX: isIphoneX && ISXSHOW }, { warpPB: BP }, { hidden: hidden }]" :style="[{ background: background }]">
		<header-component
			:title="title"
			:titleIcon="titleIcon"
			:statusBar="statusBar"
			:rightIcon="rightIcon"
			:leftIcon="leftIcon"
			@clickLeft="clickLeftEmit"
			@clickRight="clickRightEmit"
			v-if="headerShow"
			:backgroundColor="backgroundNavColor"
			:color="titleColor"
			leftcolor="#000000"
			rightcolor="#000000"
			:fixed="fixed"
		></header-component>
		<view class="relative">
			<!-- <scroll-view scroll-y="true" class="flex1 flexColumn" :class="scrollClass" @scrolltoupper="upper" @scrolltolower="lower" @scroll="scroll"> -->
			<view class="warp-content-info"><slot></slot></view>
			<!-- </scroll-view> -->
		</view>
		<view class="layoutFooter" v-if="isIphoneX && ISXSHOW" :style="[{ background: background }]"></view>
	</view>
</template>

<script>
var statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
import headerComponent from '@/components/uni-nav-bar/uni-nav-bar.vue';
export default {
	name: 'layout',
	data() {
		return {
			show: false,
			modelmes: ''
		};
	},
	components: {
		headerComponent
	},
	props: {
		hidden: {
			type: Boolean,
			default: false
		},
		titleIcon: {
			type: Boolean,
			default: false
		},
		rightIcon: {
			type: String,
			default: ''
		},
		leftIcon: {
			type: String,
			default: ''
		},
		logo: {
			type: Boolean,
			default: false
		},
		title: {
			type: String,
			default: ''
		},
		headerShow: {
			type: Boolean,
			default: false
		},
		BP: {
			type: Boolean,
			default: true
		},
		ISXSHOW: {
			type: Boolean,
			default: true
		},
		clickLeftShow: {
			type: Boolean,
			default: false
		},
		backgroundNavColor: {
			type: String,
			default: '#ffffff'
		},
		titleColor: {
			type: String,
			default: '#000000'
		},
		fixed: {
			type: Boolean,
			default: false
		},
		statusBar: {
			type: Boolean,
			default: true
		},
		background: {
			type: String,
			default: '#ffffff'
		}
	},
	computed: {
		layoutHeight() {
			var str = this.logo ? 'calc(100vh - 88rpx)' : '100vh';
			return str;
		},
		isIphoneX() {
			return this.show;
		},
		scrollClass() {
			let className = 'layoutScroll';
			if (this.isIphoneX && this.ISXSHOW && this.headerShow && this.fixed) {
				className = 'headerIpXFixedClass';
			} else if (this.isIphoneX && this.ISXSHOW && this.headerShow) {
				className = 'headerIpXClass';
			} else if (this.headerShow) {
				className = 'headerClass';
			} else if (this.isIphoneX && this.ISXSHOW) {
				className = 'IpXClass';
			}
			return className;
		}
	},
	mounted() {
		let that = this;
		wx.getSystemInfo({
			success: res => {
				if (res.safeArea.top > 20) {
					that.show = true;
				}
			}
		});
	},
	methods: {
		upper(e) {
			this.$emit('upper', e);
			//console.log(e)
		},
		lower(e) {
			this.$emit('lower', e);
			//console.log(e)
		},
		scroll(e) {
			this.$emit('scroll', e);
			//console.log(e)
		},
		clickRightEmit() {
			this.$emit('clickRightEmit');
		},
		clickLeftEmit() {
			if (this.clickLeftShow) {
				this.$emit('clickLeft');
			} else {
				uni.navigateBack();
			}
		}
	}
};
</script>

<style lang="scss" scoped>
// $ab : var(--statusBarHeight);
.warp-content {
	display: flex;
	flex-direction: column;
	background: #ffffff;
	height: 100vh;
	// padding-top: calc(#{$ab} + 80rpx);
	position: relative;
	.warp-content-info {
		display: flex;
		flex-direction: column;
		flex: 1;
		overflow: hidden;
	}
}

.warpPB {
	padding: 0 30rpx;
}

.layoutFooter {
	width: 100%;
	height: 68rpx;
}

.isIphoneX {
	//height: calc(100vh - 68rpx)!important;
}

.layoutScroll {
	height: 100vh;
}

.headerIpXFixedClass {
	height: calc(100vh - 108rpx) !important;
}

.headerIpXClass {
	height: calc(100vh - 196rpx) !important;
}

.headerClass {
	height: calc(100vh - 128rpx) !important;
}

.IpXClass {
	height: calc(100vh - 68rpx) !important;
}
</style>
