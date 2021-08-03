<template>
	<view class="xx-warp flexColumn flex1">
		<view class="flex1 flexColumn alignItemCenter wirtbg" v-if="goodsDataList.length < 1 && show">
			<u-empty text="退款售后～" font-size="28" color="#26273A" src="https://s.umeibei.com/app/img/default/refund.png" icon-size="250"></u-empty>
		</view>
		<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" @scroll="scroll" @scrolltolower="scrolltolower" v-if="goodsDataList.length > 0 && show">
		<u-card
			:show-head="false"
			margin="20rpx 30rpx 0 30rpx"
			border-radius="10"
			:border="false"
			:head-border-bottom="false"
			:foot-border-top="false"
			v-for="(item, index) in goodsDataList"
			:key="index"
		>
			<view class="" slot="body"><refund-item :orderData="item" @emitOrder="emitOrder"></refund-item></view>
		</u-card>
		</scroll-view>
		<view class="xx-warp-bd" v-if="goodsDataList.length"></view>
	</view>
</template>

<script>
import { refundGoodsList } from '@/common/api/member.js';
import refundItem from './refundrItem.vue';
import { ArrayList, statusCN, TimeLength, GoNavTo } from '@/common/js/utils.js';
let TimePro;
export default {
	components: {
		refundItem
	},
	data() {
		return {
			goodsDataList: [],
			scrollTop: 0,
			page: 0,
			size: 10,
			totalPage: 0,
			show: false
		};
	},
	onShow() {
		this.resetList();
	},
	methods: {
		async list() {
			const reset = await refundGoodsList({
				scope: 'refund',
				page: this.page,
				size: this.size
			});
			if (reset && reset.success && reset.body) {
				console.log(reset);
				this.goodsDataList = reset.body;
				this.totalPage = reset.totalPage - 1;
				this.show = true;
			}
		},
		emitOrder() {},
		scroll(e) {
			if (TimePro) {
				clearTimeout(TimePro);
			}
			TimePro = setTimeout(() => {
				this.scrollTop = e.detail.scrollTop;
			}, 300);
		},
		scrolltolower(e) {
			if (this.totalPage > this.page) {
				this.page++;
				this.list();
			}
		},
		resetList() {
			this.scrollTop = 0;
			this.page = 0;
			this.goodsDataList = [];
			this.list();
		}
	}
};
</script>

<style lang="scss">
.xx-warp {
	overflow: hidden;
	height: 100vh;
	background: #f6f6f6;
	.scroll-Y {
		height: calc(100vh - 130rpx);
		overflow-y: auto;
	}
}
.xx-warp-bd {
	width: 750rpx;
	height: 120rpx;
	background: url(../../../static/slogan.png) center center no-repeat;
	background-size: 100% 100%;
}
</style>
