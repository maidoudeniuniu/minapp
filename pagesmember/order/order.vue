<template>
	<layout :BP="false" background="#f5f5f5" :ISXSHOW="false">
		<view class="xx-warp" @click="warpClick">
			<view class="order_nav flexRow">
				<view class="order_nav_item flex1" :class="{ order_nav_ative: item.show }" v-for="(item, index) in NavList" :key="index" @click="NavClick(item)">
					<view class="order_nav_item_list">
						{{ item.name }}
						<text class="order_border"></text>
					</view>
				</view>
			</view>
			<view class="flex1 flexColumn alignItemCenter" v-if="goodsDataList.length < 1 && show">
				<u-empty
					text="暂无订单"
					mode="list"
					color="#000"
					src="https://img.alicdn.com/imgextra/i3/O1CN01u0EWR81FMfzy4OCZA_!!6000000000473-2-tps-48-48.png"
					icon-size="250"
				></u-empty>
			</view>
			<view class="order_content flex1 flexColumn" v-if="goodsDataList.length > 0 && show">
				<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" @scroll="scroll" @scrolltolower="scrolltolower">
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
						<view class="" slot="body"><order-item :orderData="item" @emitOrder="emitOrder"></order-item></view>
					</u-card>
					<view class="h100" v-if="totalPage == page"></view>
				</scroll-view>
			</view>
		</view>
	</layout>
</template>

<script>
import { ordersList } from '@/common/api/member.js';
import invitationComponent from '@/components/invitation/invitation.vue';
import { ArrayList, statusCN, TimeLength, GoNavTo, sloganshift } from '@/common/js/utils.js';
import orderItem from './orderItem.vue';
let TimePro;
export default {
	data() {
		return {
			cid: null,
			NavList: [
				{
					name: '全部',
					show: true,
					id: 'all'
				},
				{
					name: '待付款',
					show: false,
					id: 'no_pay'
				},
				{
					name: '待发货',
					show: false,
					id: 'paid'
				},
				{
					name: '待收货',
					show: false,
					id: 'delivered'
				}
			],
			scrollTop: 0,
			goodsDataList: [],
			totalPage: 0,
			show: false,
			page: 0,
			size: 5
		};
	},
	components: {
		invitationComponent,
		orderItem
	},
	// 下拉刷新
	onPullDownRefresh() {
		setTimeout(() => {
			this.resetlist();
			uni.stopPullDownRefresh();
		}, 500);
	},
	onLoad(e) {
		this.cid = e.type;
		if (this.cid) {
			let cid = this.cid;
			this.NavList = this.NavList.map(item => {
				return {
					...item,
					show: cid == item.id
				};
			});
			this.list();
		} else {
			this.list();
		}
	},
	onShow() {
		// this.goodsDataList = []
	},
	methods: {
		//清除是否弹框的现场
		warpClick() {
			this.$SubOrder.nofiy('nofiy');
		},
		//倒计时
		emitOrder(e = {}) {
			if (e.type == 'del') {
				let top = this.scrollTop;
				let data = this.goodsDataList.filter(item => item.id != e.data);
				this.goodsDataList = [];
				setTimeout(() => {
					this.goodsDataList = data;
					this.scrollTop = top;
				}, 300);
			} else if (e.type == 'cancel') {
				this.resetlist();
			} else {
				this.goodsDataList = [];
				this.scrollTop = 0;
				this.page = 0;
				this.list();
			}
		},
		scroll(e) {
			if (TimePro) {
				clearTimeout(TimePro);
			}
			TimePro = setTimeout(() => {
				this.scrollTop = e.detail.scrollTop;
				TimePro = null;
				this.warpClick();
			}, 300);
		},
		scrolltolower() {
			if (this.totalPage > this.page) {
				this.page++;
				this.list();
			}
		},
		async list() {
			let data = this.NavList.find(item => item.show);
			const reset = await ordersList({
				scope: data.id,
				page: this.page,
				size: this.size
			});
			if (reset && reset.success && reset.body) {
				this.goodsDataList = this.goodsDataList.concat(
					reset.body.map(item => {
						return {
							...item,
							show: false,
							timeCnAll: item.sysTimeStamp,
							createTime: TimeLength(item.gmtCreate, 6),
							time_cn: TimeLength(item.gmtCreate, 5),
							status_cn: statusCN(item.status),
							items: item.items
								? item.items.map(newItem => {
										return {
											...newItem,
											slogan_cn: newItem.slogan ? sloganshift(newItem.slogan) : '',
											specifications: ArrayList(newItem.specifications)
										};
								  })
								: []
						};
					})
				);
				this.totalPage = reset.totalPage - 1;
				this.show = true;
			}
		},
		NavClick(e) {
			this.NavList = this.NavList.map(item => {
				return {
					...item,
					show: e.id == item.id
				};
			});
			setTimeout(() => {
				this.resetlist();
			}, 500);
		},
		//重置列表
		resetlist() {
			this.show = false;
			this.goodsDataList = [];
			this.totalPage = 0;
			this.scrollTop = 0;
			this.page = 0;
			setTimeout(() => {
				this.list();
			}, 300);
		}
	}
};
</script>

<style lang="scss" scoped>
.xx-warp {
	flex: 1;
	display: flex;
	flex-direction: column;

	.order_nav {
		background: #ffffff;

		.order_nav_item {
			height: 84rpx;
			line-height: 84rpx;
			text-align: center;
			flex: 1;

			.order_nav_item_list {
				width: 100rpx;
				position: relative;
				margin: 0 auto;
				color: #707184;
			}
		}

		.order_nav_ative {
			.order_nav_item_list {
				color: #26273a;
				font-weight: bold;
			}

			.order_border {
				position: absolute;
				bottom: 0;
				left: 20%;
				right: 20%;
				background: #26273a;
				height: 6rpx;
			}
		}
	}

	.order_content {
		.scroll-Y {
			height: calc(100vh - 84rpx);
		}
	}
}
</style>
