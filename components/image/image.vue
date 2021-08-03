<template>
	<view class="imgListBox flexRow">
		<view class="imgList" v-for="(item,index) in list" :key="index">
			<view class="imgItem"></view>
		</view>
		<view class="imgList" v-if="list.length < len" >
			<view class="imgNoList flexColumn" @click="uploadClick">				
				<view class="uploadTxt">上传凭证</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { fileUpload } from '@/common/api/gb.js'
	import {getValue} from '@/common/js/utils.js'
	export default {
		props:{
			len:{
				type:Number,
				default:5
			},
			defalutList:{
				type:Array,
				default:()=>[]
			}
		},
		data (){
			return {
				list:[]
			}
		},
		mounted() {
			this.list = this.defalutList
		},
		methods:{
			uploadClick (){
				let count = this.len - this.list.length
				uni.chooseImage({
					count:count,
					sourceType:['album','camera'],					
				    success: (chooseImageRes) => {
				        const tempFilePaths = chooseImageRes.tempFilePaths;
						console.log(JSON.stringify(tempFilePaths))
						this.uploadFile(tempFilePaths)				       
				    }
				});
			},
			// 上传图片
			uploadFile (tempFilePaths){
				let token = getValue("token")
				uni.uploadFile({
				    url: fileUpload(), //仅为示例，非真实的接口地址
				    filePath: tempFilePaths[0],
				    name: 'file',
					header:{
						"Content-Type": "multipart/form-data",
						 token:token
					},
				    success: (uploadFileRes) => {
				        console.log(uploadFileRes.data);
				    }
				});
			}
		}
	}
</script>

<style lang="scss">
	.imgListBox{
		width: calc(100vw - 122rpx);
		flex-wrap: wrap;
		overflow: hidden;
		padding-bottom: 10rpx;
		.imgList{
			width: 25%;
			height: calc((100vw - 122rpx)/4);
			overflow: hidden;
			margin-bottom: 10rpx;			
			.imgItem{
				padding: 10rpx;				 
				height: calc((100vw - 142rpx)/4);
				background: #06c;
				border-radius: 10rpx;
				margin-right: 10rpx;
			}
		}
		.imgNoList{
			padding: 11rpx;
			border: #B1B2C1 1rpx dashed;
			height: calc((100vw - 142rpx)/4); 
			border-radius: 10rpx;
			align-items: center;
			justify-content: center;
			margin-right: 10rpx;
			.uploadTxt{
				background: url(../../static/iconcamera.png) center top no-repeat;
				padding-top:68rpx;
				background-size: 68rpx auto;
				text-align: center;
			}
		}
	}
</style>
