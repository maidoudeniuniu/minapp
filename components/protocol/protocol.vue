<template>
	<view @click="handelClick" :class="className">
		<slot></slot>
	</view>
</template>

<script>
	export default {
		name: "protocol",
		props: {
			type: { //类型
				type: String,
				default: '1',
				required: true
			},
			className: { //类名
				type: String,
				default: ''
			}
		},
		data() {
			return {
				linkObj: {
					'1': '18', //隐私协议
					'2': '19', //用户服务协议
					'3': '191', //协议规则
					// '1': 'https://m.puresnake.com/h5/pages/custom/article?article_id=18', //隐私协议
					// '2': 'https://m.puresnake.com/h5/pages/custom/article?article_id=19', //用户服务协议
					// '3': 'https://m.puresnake.com/h5/pages/custom/index?page_id=191', //协议规则
				}
			};
		},
		methods: {
			handelClick() {
				if (this.type === '3') { //要解析页面
					uni.navigateTo({
						url: '/pages/commonPages/commonPages?id=' + this.linkObj[this.type]
					})
					return
				}
				uni.navigateTo({ //文本类型
					url: '/pages/commonPages/article?article_id=' + this.linkObj[this.type]
				})
			}
		}
	}
</script>

<style lang="scss">
	.inline {
		display: inline;
	}
</style>
