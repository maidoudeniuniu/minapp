<template>
	<view>
		<!-- h5 -->
		<template v-if="url">
			<web-view :src="url"></web-view>
		</template>
		<!-- 协议等cms简单页 -->
		<template v-else-if="id">
			<cms :config="config" v-if="config"></cms>
		</template>
		<template v-if="type === 'contact'">
			<service />
		</template>
	</view>
</template>

<script>
	import {
		cmsPages
	} from '@/common/api/cms.js'
	import cms from '@/components/cms/cms.vue'
	import service from '@/components/contact/service.vue'
	export default {
		data() {
			return {
				url: '', //h5链接
				id: '', //cms id
				type: '', //类型，判断是否contact客服页，需要自定义按钮
				config: null, //cms 配置数据
				webviewStyles: {
					progress: {
						color: '#00aa00'
					}
				}
			};
		},
		components: {
			cms,
			service
		},
		onLoad(options) {
			if (options.url) {
				this.url = decodeURIComponent(options.url)
			} else if (options.id) {
				this.id = options.id
				options.type && (this.type = options.type)
				this.getCmsContent(options.id)
			}
		},
		methods: {
			getCmsContent(id) {
				cmsPages(id).then(res => {
					this.config = res
				}).catch(err => {
					console.log(err)
					uni.showToast({
						title: '出错啦，请稍后再试~',
						icon: 'none'
					})
				})
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>
