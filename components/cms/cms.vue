<template>
	<view class="cms-page" :style="{ background: config.page.style && config.page.style.background }">
		<block v-for="(item, floorIndex) in config.floors" :key="floorIndex">
			<!-- 搜索框 -->
			<block v-if="item.type === 'searchBar'">
				<view :style="{ height: item.style && item.style.height + 'rpx' }">搜索占位</view>
				<view
					class="snake-searchbar"
					:style="{
						height: item.style && item.style.height + 'rpx',
						backgroundColor: item.style && item.style.background,
						paddingTop: item.style && item.style.paddingTop + 'rpx',
						paddingLeft: item.style && item.style.paddingLeft + 'rpx',
						paddingRight: item.style && item.style.paddingLeft + 'rpx',
						paddingBottom: item.style && item.style.paddingTop + 'rpx'
					}"
				>
					<view class="snake-searchbar__box">
						<view class="snake-searchbar__box-icon-search"><uni-icons color="#999999" size="18" type="search" /></view>
						<input
							class="input-box"
							confirm-type="search"
							:placeholder="item.data && item.data[0].text"
							placeholder-style="color:#AAAAAA; font-size: 14px;"
							@confirm="handleSearch"
						/>
						<view v-if="searchVal !== ''" class="snake-searchbar__box-icon-clear" @click="handleClear"><uni-icons color="#DADADA" size="22" type="clear" /></view>
						<snake-icon class="iconsousuo" type="quxiao" size="16" @click="resetResult"></snake-icon>
					</view>
					<view v-if="item.params && item.params.text === 'category'" class="snake-searchbar__category" @click="toPage('/pages/category/category')">
						<!-- <image class="category-icon" src="../../static/pawnshop-category.png" mode="widthFix"></image> -->
					</view>
				</view>
			</block>
			<!-- banner轮播 -->
			<block v-if="item.type === 'banner'"><cms-banner :info="item" @click="handleRedirect"></cms-banner></block>
			<!-- 通告栏 -->
			<block v-if="item.type === 'special'"><cms-notice-bar :info="item" :showGetMore="false" :single="true" @click="handleRedirect"></cms-notice-bar></block>
			<!-- 客服 -->
			<block v-if="item.type === 'service'"><snake-kefu :bottom="100" :kefuIcon="true" :userInfo="userInfo"></snake-kefu></block>
			<!-- 富文本 -->
			<view
				v-if="item.type === 'richText'"
				class="snake-text-center"
				:style="{
					height: item.style.height + 'rpx',
					backgroundColor: item.style.background,
					paddingTop: item.style.paddingTop + 'rpx',
					paddingLeft: item.style.paddingLeft + 'rpx',
					paddingRight: item.style.paddingLeft + 'rpx'
				}"
			>
				<view v-if="item.params.title" class="floor-richtext__title snake-h4 snake-bold">{{ item.params.title }}</view>
				<view v-if="item.params.content" class="floor-richtext__content snake-text snake-black" v-html="item.params.content"></view>
			</view>
			<!-- 单图组 -->
			<view
				v-if="item.type === 'imageSingle'"
				class="snake-grids col-1"
				:style="{
					height: item.style && item.style.height + 'rpx',
					backgroundColor: item.style && item.style.background,
					paddingTop: item.style && item.style.paddingTop + 'rpx',
					paddingLeft: item.style && item.style.paddingLeft + 'rpx',
					paddingRight: item.style && item.style.paddingLeft + 'rpx'
				}"
			>
				<block v-for="(option, index) in item.data" :key="index">
					<view class="floor-image__wrap snake-flex" @click="handleRedirect(option, item)">
						<image class="floor-image" :src="option.imgUrl" mode="widthFix" lazy-load :data-img-id="index" :data-floor-id="floorIndex" />
					</view>
				</block>
			</view>
			<!-- 多图组 -->
			<view
				v-if="item.type === 'imageMulti'"
				class="snake-grids"
				:class="{
					'col-1': item.style && item.style.column == 1,
					'col-2': item.style && item.style.column == 2,
					'col-3': item.style && item.style.column == 3,
					'col-4': item.style && item.style.column == 4
				}"
				:style="{
					backgroundColor: item.style && item.style.background,
					paddingTop: item.style && item.style.paddingTop + 'rpx',
					paddingLeft: item.style && item.style.paddingLeft + 'rpx',
					paddingRight: item.style && item.style.paddingLeft + 'rpx'
				}"
			>
				<block v-for="(option, index) in item.data" :key="index">
					<view class="floor-image__wrap snake-flex" @click="handleRedirect(option, item)">
						<image class="floor-image" :src="option.imgUrl" mode="widthFix" lazy-load :data-img-id="index" :data-floor-id="floorIndex" />
					</view>
				</block>
			</view>
			<!-- 空白 -->
			<view
				v-if="item.type === 'blank'"
				class="snake-grids"
				:style="{
					height: item.style && item.style.height + 'rpx',
					backgroundColor: item.style && item.style.background,
					paddingTop: item.style && item.style.paddingTop + 'rpx',
					paddingLeft: item.style && item.style.paddingLeft + 'rpx',
					paddingRight: item.style && item.style.paddingLeft + 'rpx'
				}"
			></view>
			<!-- 领通用优惠券 -->
			<view
				v-if="item.type === 'coupon'"
				class="snake-grids"
				:class="{
					'col-1': item.style && item.style.column == 1,
					'col-2': item.style && item.style.column == 2,
					'col-3': item.style && item.style.column == 3,
					'col-4': item.style && item.style.column == 4
				}"
				:style="{
					backgroundColor: item.style && item.style.background,
					paddingTop: item.style && item.style.paddingTop + 'rpx',
					paddingLeft: item.style && item.style.paddingLeft + 'rpx',
					paddingRight: item.style && item.style.paddingLeft + 'rpx'
				}"
			>
				<block v-for="(option, index) in item.data" :key="index">
					<view class="floor-image__wrap snake-flex" @click="handleReceiveCoupon(option.couponId)">
						<image class="floor-image" :src="option.imgUrl" mode="widthFix" :data-img-id="index" :data-floor-id="floorIndex" />
					</view>
				</block>
			</view>
			<!-- 跳转生活号 -->
			<view
				v-if="item.type === 'lifestyle'"
				class="life-follow"
				:style="{
					height: item.style && item.style.height + 'rpx',
					backgroundColor: item.style && item.style.background,
					paddingTop: item.style && item.style.paddingTop + 'rpx',
					paddingLeft: item.style && item.style.paddingLeft + 'rpx',
					paddingRight: item.style && item.style.paddingLeft + 'rpx'
				}"
			>
				<!-- #ifdef MP-ALIPAY -->
				<!-- 跳转生活号 -->
				<lifestyle v-if="lifestyleShow" publicId="2018091261345315" />
				<!-- 支付宝生活号关注组件 -->
				<!-- <life-follow v-if="lifeFollowShow" sceneId="ff4c83a375a24ffdb3f348e8990b5e10" /> -->
				<!-- #endif -->
			</view>
			<!-- 遮罩页 -->
			<view
				v-if="item.type === 'cover'"
				v-show="coverShow && coverState[item.name] !== 'hide'"
				class="snake-fixed-top"
				@click="coverClick(item.name)"
				style="z-index: 999999; height: 100vh; "
				:style="{ backgroundColor: (item.style && item.style.background) || '#00000055' }"
				@touchmove.stop.prevent
			>
				<view
					v-for="(option, index) in item.data"
					:key="index"
					class="snake-fixed-top cover-content"
					@click.stop="handleRedirect(option, item)"
					:style="option.text"
					v-show="index === coverQuery"
				>
					<image style="width: inherit;" :src="option.imgUrl" mode="widthFix" :data-img-id="index" :data-floor-id="floorIndex" />
				</view>
			</view>
		</block>
	</view>
</template>

<script>
import cmsBanner from './cms-banner.vue';
import cmsNoticeBar from './cms-notice-bar.vue';
// import snakeKefu from '@/components/snake-kefu/snake-kefu.vue'
// import { postCouponReceive } from '@/api/coupon.js'

export default {
	components: {
		cmsBanner: cmsBanner,
		cmsNoticeBar: cmsNoticeBar
		// snakeKefu,
	},
	props: {
		floors: {
			type: Array,
			default() {
				return [];
			}
		},
		config: {
			type: Object,
			default: () => {}
		}
	},
	data() {
		return {
			coverState: {},
			coverShow: true,
			coverQuery: 0
		};
	},
	created() {
		// this.coverState = this.$store.getters.coverState
	},
	mounted() {
		setTimeout(() => {
			let { style, name } = this.config.page;
			uni.setNavigationBarTitle({
				title: name || ''
			});
			uni.setNavigationBarColor({
				backgroundColor: style ? style.titleBackgroundColor || '#ffffff' : '#ffffff',
				frontColor: style ? style.titleTextColor || '#000000' : '#000000'
			});
		}, 400);
	},
	computed: {
		parseJson() {
			return jsonStr => JSON.parse(jsonStr);
		}
	},
	methods: {
		handleRedirect(e, item) {
			if (e.linkUrl) {
				this.toPage(e.linkUrl);
			} else if (item.type === 'cover') {
				this.coverClick(item.name);
			}
		},

		toPage(page, query = {}) {
			// const formatQuery = this.$util.parseQueryString(page)
			let url = page;
			if (page.indexOf('http') > -1 && page.indexOf('http') === 0) {
				// #ifdef H5
				location.href = url;
				// #endif

				// #ifndef H5
				// this.$Router.push({
				// 	path: '/pages/custom/webview',
				// 	query: {
				// 		url
				// 	},
				// })
				uni.navigateTo({
					url: '/pages/commonPages/commonPages?url=' + decodeURIComponent(url)
				});
				// #endif
			}
			// if (page.indexOf('?') > -1) {
			// 	url = page.substring(0, page.indexOf('?'))
			// }
			if (page.indexOf('tabbar') > -1) {
				this.$Router.pushTab({
					path: url,
					query: {
						...formatQuery,
						...query
					}
				});
			} else {
				// this.$Router.push({
				// 	path: url,
				// 	query: {
				// 		...formatQuery,
				// 		...query,
				// 	},
				// })
				uni.navigateTo({
					url
				});
			}
		},

		// 领取优惠券
		async handleReceiveCoupon(couponId) {
			try {
				const response = await postCouponReceive({
					activityId: couponId
				});
				if (response.success) {
					this.$toast('领取成功');
				} else {
					debugger;
					this.$toast(response.message);
				}
			} catch (e) {
				console.log(e);
			}
		},

		// 遮罩floor点击
		coverClick(strName) {
			const coverLength = this.floors.find(item => item.type === 'cover').data.length;
			console.log(coverLength);
			if (this.coverQuery < coverLength - 1) {
				this.coverQuery++;
			} else {
				this.coverShow = false;
				const tempJson = {};
				tempJson[strName] = 'hide';
				console.log(strName, tempJson);
				Object.assign(this.coverState, tempJson);
				this.$store.dispatch('setCoverState', this.coverState);
			}
		},

		handleSearch(event) {
			console.log(event);
			this.$emit('handle-search', event);
		}
	}
};
</script>

<style lang="scss" scoped>
.cms-page {
	width: 750rpx;
	min-height: 100vh;
}

/* banner轮播 */
.app-status-bar-height {
	height: var(--status-bar-height);
	width: 100%;
}

.diy-banner {
	position: relative;
}

.slide-image {
	width: 100%;
}

.floor-image__wrap {
	width: 100%;
}

.floor-image {
	display: block;
	width: 100%;
}

// 搜索框
.snake-searchbar {
	position: fixed;
	top: 0;
	width: 100%;
	box-sizing: border-box;
	z-index: 99;
	/* #ifdef APP-PLUS */
	top: calc(var(--status-bar-height) + 80rpx);
	/* #endif */
	/* #ifdef H5 */
	top: var(--status-bar-height);
	/* #endif */
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: row;
	align-items: center;
	justify-content: center;
	padding: 0 16rpx;
	background-color: #ffffff;

	&__box {
		/* #ifndef APP-NVUE */
		display: flex;
		box-sizing: border-box;
		/* #endif */
		overflow: hidden;
		position: relative;
		flex: 1;
		justify-content: center;
		flex-direction: row;
		align-items: center;
		height: 70rpx;
		padding: 5px 8px 5px 0px;
		border-width: 0.5px;
		border-style: solid;
		border-color: #f6f6f6;
		border-radius: 40rpx;
		background: #ffffff;

		// line-height: 60rpx;
		&-icon-clear {
			line-height: 70rpx;
			align-items: center;
			padding-left: 5px;
		}

		&-icon-search {
			/* #ifndef APP-NVUE */
			display: flex;
			/* #endif */
			flex-direction: row;
			width: 32px;
			justify-content: center;
			align-items: center;
			color: #808080;
			line-height: 1.8;
		}

		.input-box {
			flex: 1;
			padding: 0 5px;
			font-size: 28rpx;
		}

		input {
			font-size: 12px;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #111111;
			line-height: 17px;

			&.active {
				color: #333333;
			}
		}
	}

	&__cancel {
		padding-left: 10px;
		line-height: 70rpx;
		font-size: 14px;
		color: #333;
	}

	&__category {
		width: 40rpx;
		height: 70rpx;
		overflow: hidden;
		padding-left: 10rpx;

		.category-icon {
			width: 100%;
			height: 70rpx;
		}
	}
}

.cover-content {
	margin-top: var(--status-bar-height);
}

/* 吸顶容器 */
.snake-fixed-top {
	width: 100%;
	height: auto;
	position: fixed;
	z-index: 1;
	left: 0;
	top: 0;
}

.snake-fixed-bottom {
	width: 100%;
	height: auto;
	position: fixed;
	z-index: 1;
	left: 0;
	bottom: 0;
}

/* 九宫格 */
.snake-grids {
	padding: 0;
	display: flex;
	flex-wrap: wrap;
}

.snake-grids .items {
	width: 33.3%;
	padding: 8px 0;
	box-sizing: border-box;
}

.snake-grids .icon {
	width: 100rpx;
	height: 100rpx;
	margin: 0 auto;
	line-height: 100rpx;
	text-align: center;
	font-size: 0;
}

.snake-grids .icon text {
	font-size: 60rpx;
}

.snake-grids .icon image {
	width: 100%;
	border-radius: 6rpx;
}

.snake-grids .text {
	line-height: 2em;
	text-align: center;
	font-size: 26rpx;
	margin-top: 5px;
}

/* grid布局 */
.snake-grids.grid-square > view {
	margin-right: 20rpx;
	margin-bottom: 20rpx;
	position: relative;
	overflow: hidden;
}

.snake-grids.col-2.grid-square > view {
	width: calc((100% - 20rpx) / 2);
}

.snake-grids.col-3.grid-square > view {
	width: calc((100% - 40rpx) / 3);
}

.snake-grids.col-4.grid-square > view {
	width: calc((100% - 60rpx) / 4);
}

.snake-grids.col-5.grid-square > view {
	width: calc((100% - 80rpx) / 5);
}

.snake-grids.col-1.grid-square > view {
	margin-right: 0;
}

.snake-grids.col-2.grid-square > view:nth-child(2n),
.snake-grids.col-3.grid-square > view:nth-child(3n),
.snake-grids.col-4.grid-square > view:nth-child(4n),
.snake-grids.col-5.grid-square > view:nth-child(5n) {
	margin-right: 0;
}

.snake-grids.col-1 > view {
	width: 100%;
}

.snake-grids.col-2 > view {
	width: 50%;
}

.snake-grids.col-3 > view {
	width: 33.33%;
}

.snake-grids.col-4 > view {
	width: 25%;
}

.snake-grids.col-5 > view {
	width: 20%;
}

.snake-grids .items {
	width: 33.3%;
	padding: 8px 0;
	box-sizing: border-box;
}

.snake-grids .icon {
	width: 100rpx;
	height: 100rpx;
	margin: 0 auto;
	line-height: 100rpx;
	text-align: center;
	font-size: 0;
}

.snake-grids .icon text {
	font-size: 60rpx;
}

.snake-grids .icon image {
	width: 100%;
	border-radius: 6rpx;
}

.snake-grids .text {
	line-height: 2em;
	text-align: center;
	font-size: 26rpx;
	margin-top: 5px;
}

/* 内外间距 */
.snake-title-padding {
	padding: 30rpx 24rpx;
}

.snake-padding {
	padding: 0 30rpx;
}

.snake-padding12 {
	padding: 0 24rpx;
}

.snake-margin {
	margin: 0;
}
</style>
