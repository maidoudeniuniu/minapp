<template>
	<view class="diy-banner"
		:style="{backgroundColor: info.style && info.style.background, height: info.style && info.style.height + 'rpx', paddingTop: info.style && info.style.paddingTop + 'rpx', paddingLeft: info.style && info.style.paddingLeft + 'rpx', paddingRight: info.style && info.style.paddingLeft + 'rpx'}">
		<uni-swiper-dot :info="info.data" :current="current" :mode="mode" :dots-styles="dotsStyles" field="content">
			<swiper :autoplay="autoplay" :duration="duration" :circular="true" :interval="interval"
				class="swiper-box banner-box" @change="change" :style="{height: swiperHeight + 'rpx'}">
				<swiper-item v-for="(item, index) in info.data" :key="index" :item-id="'swiperItem'+index">
					<image class="slide-image" @load="imagesHeight" :src="item.imgUrl" mode="aspectFit"
						:style="{'height':swiperHeight+'rpx'}" :data-id="index" @click="clickItem(item, info)" />
				</swiper-item>
			</swiper>
		</uni-swiper-dot>
	</view>
</template>

<script>
	import uniSwiperDot from '@/components/uni-swiper-dot/uni-swiper-dot.vue'

	export default {
		components: {
			uniSwiperDot
		},
		props: {
			info: {
				type: Object,
				default () {
					return {}
				},
			},
			dotsStyles: {
				type: Object,
				default () {
					return {
						backgroundColor: 'rgba(0, 0, 0, .3)',
						border: '1px rgba(0, 0, 0, .3) solid',
						color: '#fff',
						selectedBackgroundColor: 'rgba(0, 0, 0, .9)',
						selectedBorder: '1px rgba(0, 0, 0, .9) solid',
					}
				},
			},
			// 类型 ：default(默认) indexes long nav
			mode: {
				type: String,
				default: 'default',
			},
		},
		data() {
			return {
				// banner轮播组件属性
				current: 0,
				autoplay: true, // 是否自动切换
				interval: 3000, // 自动切换时间间隔
				duration: 800, // 滑动动画时长
				imgHeights: {}, // 图片的高度
				imgCurrent: {}, // 当前banne所在滑块指针
				swiperHeight: 200,
			}
		},
		created() {
			setTimeout(()=>{console.log(this.floors)},1000)
		},
		mounted() {
			console.log(777)
			setTimeout(() => {
				console.log(this.info)
			}, 6)
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
			clickItem(item, floor) {
				console.log(item)
				this.$emit('click', item)
			},
		},
	}
</script>

<style>
	/* banner轮播 */

	.diy-banner {
		position: relative;
	}

	.slide-image {
		width: 100%;
	}
</style>
