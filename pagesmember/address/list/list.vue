<template>
	<view class="xx-warp flexColumn">
		<view class="xx-warp-hb flex1 flexColumn">
			<view class="addressBox">
				<view class="address-item flexRow mb10" v-for="(item, index) in data" :key="index">
					<view class="flex1" @click="addressClick(item)">
						<view class="flexRow">
							<view class="mr5" v-if="item.defaulted"><text class="f12 xxtag xxtagorg">默认</text></view>
							<view class="DINM f14 mr5 bold">{{ item.name }}</view>
							<view class="DINM f16 ">{{ item.phone }}</view>
						</view>
						<view class="mt6 grey1 f12">{{ item.province }}{{ item.city }}{{ item.county }}{{ item.detail }}</view>
					</view>
					<view class="address-item-icon mt3" @click="edit(item)"></view>
				</view>
			</view>
		</view>
		<view class="xx-warp-fb"><view type="primary" class="add-button medium" @click="goadd">新增收货地址</view></view>
	</view>
</template>

<script>
import {
	accountAddressList
} from '@/common/api/member.js'
import {
	GoNavTo
} from '@/common/js/utils.js'
export default {
	data() {
		return {
			editShow: false,
			data: [],
			headStyle: {
				padding: "20rpx"
			}
		}
	},
	props: {
		callback: {
			type: String,
			default: null
		}
	},
	computed: {
		// totalPrice() {
		// 	return (this.data.filter(item => item.show)).map(item => item.price * item.num).reduce((acc, current) =>
		// 		acc + current, 0)
		// },
	},
	mounted() {
		this.list()
	},
	destroyed() {
		// this.$emit("addressEmit", e)
	},
	methods: {
		addressClick(e) {
			this.$emit("addressEmit", e)
		},
		goadd() {
			if (this.callback) {
				GoNavTo({
					url: "/pagesmember/address/add/add?callback=" + this.callback
				})
			} else {
				GoNavTo({
					url: "/pagesmember/address/add/add"
				})
			}

		},
		//进入编辑页面
		edit(e) {
			if (this.callback) {
				GoNavTo({
					url: "/pagesmember/address/edit/edit?id=" + e.id + "&callback=" + this.callback
				})
			} else {
				GoNavTo({
					url: "/pagesmember/address/edit/edit?id=" + e.id
				})
			}

		},
		async list() {
			const reset = await accountAddressList()
			if (reset && reset.body) {
				let defaultlist = reset.body.filter(item => item.defaulted)
				let otherList = reset.body.filter(item => !item.defaulted)
				console.log('收货地址=',reset.body)
				this.data = [...defaultlist, ...otherList]
			}
		}
	}
}
</script>

<style lang="scss">
.xx-warp {
	flex: 1;
	height: 100vh;

	.xx-warp-hb {
		overflow-y: auto;
		padding: 24rpx;

		.address-item {
			background: #ffffff;
			padding: 24rpx;
			position: relative;
			border-radius: 8rpx;
			.address-item-icon {
				width: 52rpx;
				height: 52rpx;
				background: url(../../../static/IconEdit.png) center center no-repeat;
				background-size: 32rpx auto;
			}
		}
	}

	.addressBox {
		padding-bottom: 180rpx;
	}
}

.xx-warp .xx-warp-fb {
	position: absolute;
	bottom: 0;
	right: 0;
	left: 0;
	width: 750rpx;
	padding: 14rpx 0;
}

.add-button {
	width: 702rpx;
	height: 84rpx;
	line-height: 84rpx;
	background: #26273a;
	border-radius: 4rpx;
	font-family: PingFangSC-Medium;
	font-size: 28rpx;
	color: #ffffff;
	text-align: center;
	margin: auto;
}
</style>
