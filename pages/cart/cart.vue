<template>
	<view class="xx-warp" v-if="show">
		<no-cart v-if="cartIndex == 0 && cartList.length < 1 && show"></no-cart>
		<List v-if="cartIndex == 1 && cartList.length > 0 && show" @CartItem="CartItem"></List>
	</view>
</template>

<script>
import { cartList, cartAdd } from '@/common/api/goods.js';
import { getValue, setValue, GoNavTo } from '@/common/js/utils.js';
import noCart from './nocart.vue';
import List from './list.vue';
export default {
	data() {
		return {
			token: '',
			show: false,
			cartIndex: null,
			cartList: []
		};
	},
	components: {
		noCart,
		List
	},
	onShow() {
		this.cartIndex = null;
		if (!getValue('token')) {
			this.startToken();
		} else {
			setTimeout(() => {
				this.resetPage();
			}, 100);
		}
	},
	onPullDownRefresh() {
		this.resetPage(true);
		setTimeout(()=>{uni.stopPullDownRefresh()},600)
	},
	methods: {
		//初始化页面
		resetPage(isFefresh) {
			let data = getValue('cart') && getValue('cart').length > 0 ? JSON.parse(getValue('cart')) : {};
			if (!isFefresh && data.exp && new Date().getTime() - data.exp < 120000) {
				this.cartList = data.data;
				this.cartIndex = this.cartList.length > 0 ? 1 : 0;
				this.show = true;
			} else {
				if (getValue('token')) {
					this.cartDataList();
				} else {
					this.cartList = [];
					this.cartIndex = this.cartList.length > 0 ? 1 : 0;
					this.show = true;
				}
			}
		},
		CartItem(e) {
			this.cartDataList();
		},
		// 获取购物车列表
		async cartDataList() {
			console.log('---------获取购物车列表----------');
			const reset = await cartList();
			if (reset && reset.success) {
				this.cartList = reset.body;
				this.cartIndex = this.cartList.length > 0 ? 1 : 0;
				this.show = true;
			}
		},
		startToken() {
			setValue('callback', '/pages/cart/cart');
			GoNavTo({
				url: '/pagesmember/user/login/login'
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.xx-warp {
	height: 100vh;
	width: 100vw;
}
</style>
