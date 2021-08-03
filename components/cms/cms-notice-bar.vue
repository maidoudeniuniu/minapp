<template>
	<view class="snake-noticebar" :style="{height: info.style.height || 60 + 'rpx',backgroundColor: info.style.background, paddingTop: info.style.paddingTop + 'rpx', paddingBottom: info.style.paddingTop + 'rpx', paddingLeft: info.style.paddingLeft + 'rpx', paddingRight: info.style.paddingLeft + 'rpx'}">
		<image :src="info.style.imgUrl" mode="widthFix" style="width: 40rpx; height: 40rpx; margin-right: 20rpx;"></image>
		<swiper class="floor-swiper floor-swiper__v" :autoplay="true" :duration="500" :circular="true" :vertical="true" :style="{lineHeight: info.style.height || 60 + 'rpx'}">
			<swiper-item v-for="(option, index) in info.data" :key="index" @click="onClick(option, info)">
				<view class="floor-swiper__title" :class="{'snake-ellipsis':single || moreText}" :style="{color: option.color || '#333333' }">{{option.text}}</view>
			</swiper-item>
		</swiper>
		<view v-if="showGetMore === true || showGetMore === 'true'" class="snake-noticebar__more" @click="clickMore">
			<text v-if="moreText" :style="{ color: moreColor }" class="snake-noticebar__more-text">{{ moreText }}</text>
			<uni-icons type="arrowright" :color="moreColor" size="14" />
		</view>
	</view>
</template>

<script>
import uniIcons from '@/components/uni-icons/uni-icons.vue'
export default {
	components: { uniIcons },
	props: {
		info: {
			type: Object,
			default() {
				return {}
			},
		},
		moreText: {
			type: String,
			default: '',
		},
		moreColor: {
			type: String,
			default: '#999999',
		},
		single: {
			// 是否单行
			type: [Boolean, String],
			default: false,
		},
		showGetMore: {
			// 是否显示右侧查看更多
			type: [Boolean, String],
			default: false,
		},
	},
	data() {
		return {
			// banner轮播组件属性
			current: 0,
			autoplay: false, // 是否自动切换
			interval: 3000, // 自动切换时间间隔
			duration: 800, // 滑动动画时长
			imgHeights: {}, // 图片的高度
			imgCurrent: {}, // 当前banne所在滑块指针
			swiperHeight: 200,
		}
	},
	methods: {
		imagesHeight(e) {

			/**
			 * 根据图片高度计算swiper高度
			 */
			const ratio = e.detail.width / e.detail.height // 宽高比
			const viewHeight = 750 / ratio // 计算的高度值
			this.swiperHeight = viewHeight
		},
		change(e) {
			this.current = e.detail.current
		},
		onClick(item, floor) {
			this.$emit('click', item)
			// floor && this.$util.tdappEvent(floor.type, floor.name, item)
		},
		clickMore() {
			this.$emit('getmore')
		},
	},
}
</script>

<style>
	.snake-noticebar {
		display: flex;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		flex-direction: row;
		align-items: center;
	}

	.floor-swiper {
		height: 100%;
		flex: 1;
		flex-direction: column;
		overflow: hidden;
	}

	.snake-noticebar-close {
		margin-right: 5px;
	}

	.snake-noticebar-icon {
		margin-right: 5px;
	}

	.snake-noticebar__more {
		/* #ifndef APP-NVUE */
		display: inline-flex;
		/* #endif */
		flex-direction: row;
		flex-wrap: nowrap;
		align-items: center;
		padding-left: 5px;
	}

	.snake-noticebar__more-text {
		font-size: 14px;
	}
</style>
