<template>
	<layout :BP="false" background="#F6F6F6">	
		<u-cell-group>
			<u-cell-item title="收货人" :arrow='false' title-width="140" >
				<view class="">
					<u-input v-model="name" placeholder="请使用真实姓名" placeholder-style="color:#B1B2C1"/>
				</view>
			</u-cell-item>
			<u-cell-item title="手机号码" :arrow='false' title-width="140">
				<u-input type="number" v-model="phone" maxlength="11" placeholder="输入手机号码" placeholder-style="color:#B1B2C1"/>
			</u-cell-item>
			<u-cell-item title="所在地区" :arrow='true' title-width="140" @click="cityClick" :value-style='valueStyle'>
				<view class="alignLeft">
				 	{{cityList.length>0?cityList[0].province.label + ' ' + cityList[0].city.label+ ' ' + cityList[0].area.label:"点击选择"}}
				 </view>
				 <u-picker v-model="show"  mode="region" @confirm="confirmText" :default-region='defaultRegion'></u-picker>
			</u-cell-item>
			<u-cell-item title="详细地址" :arrow='false' title-width="140">
				<u-input v-model="detail" type="textarea" placeholder="请输入详细地址" placeholder-style="color:#B1B2C1"/>
			</u-cell-item>
		</u-cell-group>
		
		<view class="mt10">
			<u-cell-group>
				<u-cell-item title="设置为默认地址" :arrow='false' title-width="200">
					<view class="flexRow flexSpaceBetween">
						<view class="" style="line-height: 78rpx;">
							(每次下单时默认使用)
						</view>
						<view class="mt6">							
							<u-switch v-model="defaulted" active-color="#26273A" inactive-color="#EEEEEE"></u-switch>
						</view>
					</view>
				</u-cell-item>			 
			</u-cell-group>
		</view>
		<view style="padding:0 24rpx;" class="mt20">
			<view class="">
				<u-button type="primary" @click="save" :disabled="!disShow">保存</u-button>
			</view> 
		</view>
	</layout>
</template>

<script>
	import { getValue , setValue , GoNavTo , showToast ,PhoneReg} from '@/common/js/utils.js'
	import { accountAddressSaveNew } from '@/common/api/member.js'
	export default {
		data () {
			return {
				show:false,
				token:"",
				cityList:[],
				cartIndex:null,
				checked:false,
				areaCode:"",
				city:"",					
				county: "",
				defaulted: false,
				deleted: 0,
				detail: "",
				gmtCreate: "",
				gmtModified: "",				
				name: "",
				phone: "",
				province: "",
				userId: 0,
				defaultRegion:[]
			}
		},	
		computed:{
			valueStyle (){
				let str = {
					color:"#B1B2C1"
				}
				if(this.cityList.length>0){
					str.color = '#26273A'
				}
				return str
			},
			disShow () {
				return this.name && this.phone && this.province && this.detail
			}
		},
		onShow() {			
			if(!getValue("token")){
				this.startToken()
			}
			this.cartIndex = 1
		},		 
		methods:{
			async save (){
				let Reg = PhoneReg()
				
				if(!this.name){
					showToast("收货人没有填写")
					return
				}
				if(!this.phone){
					showToast("手机号码没有填写")
					return
				}
				if(!Reg.test(this.phone)){
					showToast("手机号码格式不对")
					return
				}
				if(!this.province){
					showToast("所在地区没有选择")
					return
				}
				if(!this.detail){
					showToast("详细地址没有填写")
					return
				}
				const userId = getValue("userId")
				const reset = await accountAddressSaveNew({					 
					city:this.city,
					deleted:0,
					defaulted:this.defaulted?true:false,
					detail:this.detail,
					name:this.name,
					phone:this.phone,
					province:this.province,
					userId:userId,
					county:this.county
				})
				if(reset && reset.success){
					uni.navigateBack()
					// GoNavTo({
					// 	url:"/pagesmember/address/list/address"
					// })
				}
			},
			cityClick (){
				this.show = true
			},
			confirmText (e){				
				console.log(e)
				this.cityList = [e]				
				this.county = e.area.label
				this.province = e.province.label
				this.city = e.city.label
				this.show = false
			},
			startToken(){
				setValue("callback","/pages/cart/cart")
				GoNavTo({
					url:"/pagesmember/user/login/login"
				})
			}
		}
	}
</script>

<style>
</style>
