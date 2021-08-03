<template>
	<view class="warp-content" :class="[{isIphoneX:isIphoneX&&ISXSHOW},{warpPB:BP}]" :style="[{background:background}]">		 
		 <header-component :title="title" :statusBar='true' :rightIcon="rightIcon" :leftIcon="leftIcon" @clickLeft="clickLeftEmit" v-if="headerShow" :backgroundColor="backgroundNavColor"></header-component>	
		 <view class="warp-content-info">			
		 	<slot></slot>
		 </view>		  
		 <view class="layoutFooter" v-if="isIphoneX&&ISXSHOW" :style="[{background:backgroundFooterShow}]"></view>
	</view>
</template>

<script>
	import headerComponent from '@/components/uni-nav-bar/uni-nav-bar.vue'
	export default {
		name:"layout",		
		data () {
			return {				 
				show:false,
				modelmes:""
			}
		},		
		components:{
			headerComponent
		},
		props:{
			rightIcon:{
				type:String,
				default:""
			},
			leftIcon:{
				type:String,
				default:""
			},
			logo:{
				type:Boolean,
				default:false
			},
			title:{
				type:String,
				default:""
			},
			headerShow:{
				type:Boolean,
				default:false
			},
			BP:{
				type:Boolean,
				default:true
			},
			ISXSHOW:{
				type:Boolean,
				default:true
			},
			clickLeftShow:{
				type:Boolean,
				default:false
			},
			backgroundNavColor:{
				type:String,
				default:"#ffffff"
			},
			backgroundFooter:{
				type:String,
				default:""
			},
			background:{
				type:String,
				default:"#ffffff"
			}
		},
		computed: {
			backgroundFooterShow (){
				return this.backgroundFooter?this.backgroundFooter:this.background
			},
			layoutHeight () {
				var str = this.logo?'calc(100vh - 88rpx)':'100vh'
				return str
			},
			isIphoneX () {
				return this.show
			}			
		},
		mounted(){			 
			let  that = this;
				wx.getSystemInfo({ 
				   success:  res=>{
					console.log("-------------------------------")
					console.log(res)
					if(res.safeArea.top > 20){
						that.show = true 
					}							
				} 
			}) 
		},
		methods:{
			clickLeftEmit () {
 				if(this.clickLeftShow){
					this.$emit("clickLeft")
				}else{
					uni.navigateBack()
				}
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.warp-content{
		display: flex;
		flex-direction: column;
		background: #FFFFFF;
		height: 100vh;		
		position: relative;
		.warp-content-info{
			display: flex;
			flex-direction: column;
			flex: 1;			 
			overflow: hidden;
			position: relative;
		}
	}
	.warpPB{
		padding: 0 30rpx;
	}
	.layoutFooter{
		width: 100%;
		height: 68rpx;
	}
	.isIphoneX{
		//height: calc(100vh - 68rpx)!important;
	}
</style>
