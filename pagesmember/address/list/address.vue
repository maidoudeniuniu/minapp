<template>
	<layout :BP="false" background="#F6F6F6" backgroundFooter="#ffffff">
		<no-cart v-if="cartIndex == 0 && addressList.length<1 && show" :callback="callback"></no-cart>
		<List v-if="cartIndex == 1 && show" @addressEmit="addressEmit" :callback="callback"></List>
	</layout>
</template>

<script>
	import {
		getValue,
		setValue,
		GoNavTo
	} from '@/common/js/utils.js'
	import {
		accountAddressList
	} from '@/common/api/member.js'
	import noCart from './noaddress.vue'
	import List from './list.vue'
	export default {
		data() {
			return {
				callback: null,
				token: "",
				show: null,
				cartIndex: null,
				addressList: []
			}
		},
		components: {
			noCart,
			List
		},
		onLoad(e) {
			this.callback = e.callback
			console.log(e)
		},
		onShow() {
			this.addressList = []
			this.show = false
			setTimeout(() => {
				this.show = true
			}, 300)
			this.list()
		},
		methods: {
			addressEmit(e) {
				if (this.callback) {
					uni.$emit("handClickAddress", e)
					uni.navigateBack({
						delta: 1
					});
					// GoNavTo({
					// 	type:"redirectTo",
					// 	url:this.callback
					// }) 
				}

			},
			async list() {
				console.log('----90--')
				const reset = await accountAddressList()
				if (reset && reset.body.length) {
					this.addressList = reset.body
					this.cartIndex = 1
				} else {
					this.cartIndex = 0
				}
			},
			startToken() {
				setValue("callback", "/pages/cart/cart")
				GoNavTo({
					url: "/pagesmember/user/login/login"
				})
			}
		}
	}
</script>

<style lang="scss">
	.xx-warp {
		flex: 1;
		display: flex;
		flex-direction: column;

		.xx-warp-hd {
			flex: 1;
		}

		.xx-warp-fb {
			background: #FFFFFF;
			padding: 30rpx;
		}
	}
</style>
