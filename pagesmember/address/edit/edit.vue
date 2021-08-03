<template>
	<layout :BP="false" background="#F6F6F6">
		<view class="" v-if="detailShow">
			<u-cell-group>
				 <u-cell-item title="收货人" :arrow='false' title-width="140">
				 	<view class="">
				 		<u-input v-model="name" placeholder="请使用真实姓名" placeholder-style="color:#B1B2C1"/>
				 	</view>
				 </u-cell-item>
				 <u-cell-item title="手机号码" :arrow='false' title-width="140">
				 	<u-input type="number" v-model="phone" maxlength="11" placeholder="输入手机号码" placeholder-style="color:#B1B2C1"/>
				 </u-cell-item>
				 <u-cell-item title="所在地区" :arrow='true' title-width="140"  @click="cityClick" :value-style='valueStyle'>					
				 	 <view class="alignLeft">
				 	 	{{cityList.length>0?cityList[0] + '-' + cityList[1]+ '-' + cityList[2]:"点击选择"}}
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
					<u-button type="primary" @click="save">保存</u-button>
				</view>
			<!-- 	<view class="mt14" >
					<u-button @click="delShow">删除</u-button>
				</view> -->
			</view>
		</view>
		<u-modal v-model="modelShow" :content="content" @confirm="delConfirm" :show-cancel-button='true' :show-title='false' border-radius="4rpx" confirm-color="#26273A"></u-modal>
 	</layout>
</template>

<script>
	import { getValue , setValue , GoNavTo , showToast ,PhoneReg} from '@/common/js/utils.js'
	import { accountAddressSaveNew,accountAddressGet } from '@/common/api/member.js'
	export default {
		data () {
			return {
				cid:null,
				show:false,
				token:"",
				cityList:[],
				cartIndex:null,
				checked:false,
				areaCode:[],
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
				detailShow:false,
				modelShow:false,
				content:"确定要删除？" 
			}
		},
		onLoad(e) {
			this.cid = e.id
		},
		onShow() {
			this.detailShow = false
			this.detailClick()			
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
		methods:{
			open (){
				this.modelShow = true;
			},
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
					id:this.id,
					city:this.city,
					deleted:0,
					defaulted:this.defaulted?true:false,
					detail:this.detail,
					name:this.name,
					phone:this.phone,
					province:this.province,
					userId:userId,
					county:this.county
				},"update")
				if(reset && reset.success){
					uni.navigateBack()
				}
			},
			async detailClick () {
				const reset = await accountAddressGet({
					id:this.cid
				})
				if(reset && reset.success){
					let {city,county,province,phone,name,id,detail,defaulted} =reset.body
					this.city = city
					this.county = county
					this.province = province
					this.phone = phone
					this.name = name
					this.id = id
					this.detail = detail
					this.defaulted = defaulted
					this.cityList = [province,city,county]
					console.log(this.areaCode)
					this.detailShow = true					 
				}
			},			
			cityClick (){
				this.show = true
			},
			delShow () {
				this.modelShowBox = true
				this.modelShow = true
			},
			//删除
			async delConfirm (){
				this.modelShow = false
				const reset = await accountAddressGet({
					deleted:1,
					id:parseInt(this.id)
				},"update")
				if(reset && reset.success){
					uni.navigateBack()
				}
			},
			confirmText (e){
  				this.cityList = [e.province.label,e.city.label,e.area.label]
				this.county = e.area.label
				this.province = e.province.label
				this.city = e.city.label
				this.areaCode = [e.province.label,e.city.label,e.area.label]				
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
