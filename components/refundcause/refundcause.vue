<template>
	<view class="refundcause flexColumn">
		<view class="refundcause_mask flex1"></view>
		<view class="refundcause_info">
			<view class="xxx-card flexColumn">
				<view class="xxx-card-hd" :class="{'xxx-card-hd-order':topBorder}">
					<view class=""></view>
					<view class="flex1 alignCenter">{{title}}</view>
					<view class="xxx-card-close" @click="refundClose"></view>
				</view>
				<view class="xxx-card-bd">
					<view class="xxx-list" v-for="(item,index) in list" :key="index" :class="{'xx-list-ative':item.show}" @click="refundClick(item)">{{item.name}}</view>
					<view class="mt20">
						<u-button type="primary" :disabled="disabled" @click="submitRefund">提交</u-button>
					</view>
				</view>
				<view class="h20" v-if="bottomShow"></view>
			</view>
		</view>
	</view>
</template>

<script>
	import { bottomStart } from '@/common/js/utils.js'
	export default {
		props:{
			title:{
				type:String,
				default:""
			},
			topBorder:{
				type:Boolean,
				default:true
			}			
		},
		data () {
			return {
				bottomShow:false,
				list:[
					{name:"退款原因描述1",type:1,show:false},
					{name:"退款原因描述2",type:2,show:false},
					{name:"退款原因描述3",type:3,show:false},
					{name:"退款原因描述4",type:4,show:false},
					{name:"退款原因描述5",type:5,show:false},
					{name:"退款原因描述6",type:6,show:false},
					{name:"退款原因描述7",type:7,show:false},
				]
			}
		},
		computed:{
			disabled (){
				let data = this.list.find(item=>item.show)
				return data?false:true
			}
		},
		mounted() {
			this.bottomShow = bottomStart()
		},
		methods:{
			refundClose () {
				this.$emit("emitRefund",)
			},
			submitRefund () {
				let data = this.list.find(item=>item.show)
				this.$emit("emitRefund",data)
			},
			refundClick (e){
				this.list = this.list.map(item=>{
					return {
						...item,
						show:e.type == item.type
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.refundcause{
		position: fixed;
		top: 0;
		left:0;
		bottom: 0;
		right: 0;
		z-index: 1000;
		.refundcause_mask{
			background: rgba(0,0,0,.2);			
		}
		.refundcause_info{
			background: #FFFFFF;			
			.xxx-card-close{
				position: absolute;
				background: url(../../static/closeIcon.png) center center no-repeat;
				width: 100rpx;
				height: 100rpx;
				top: 0;
				right: 0rpx;
				background-size: 50rpx auto;
			}
			
			.xxx-list{
				height: 80rpx;
				line-height: 80rpx;
				position: relative;
				border-bottom: #E8E8E8 1px solid;
				background: url(../../static/selectno.png) center right no-repeat;
				background-size: 50rpx auto;
			}
			.xx-list-ative{
				background: url(../../static/select.png) center right no-repeat;
				background-size: 50rpx auto;
			}
		}
	}
</style>
