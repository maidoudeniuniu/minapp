<template>
	<view class="backTop" v-if="scrollTop>100" @click="backTop"></view>
</template>
<script>
	export default {
		props:{
			scrollTop:{
				type:Number,
				default:0
			}
		},
		methods:{
			backTop(){
				console.log(1111)
				this.$emit('backTop')
			}
		}
	}
</script>

<style lang="scss">
	.backTop{
		position: fixed;
		bottom:180rpx;
		right: 28rpx;
		width: 80rpx;
		height: 80rpx;
		background: url(../../static/backtop.png) center center no-repeat;
		background-size: 80rpx auto;
		border-radius: 4rpx;
	}
</style>
