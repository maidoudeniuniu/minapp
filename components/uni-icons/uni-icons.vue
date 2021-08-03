<template>
	<!-- #ifdef APP-PLUS -->
		<text :style="{ color: color, 'font-size': size + 'px' }" class="uni-icons" @click="_onClick" v-html="icons[type]"></text>
	<!-- #endif -->	
	<!-- #ifdef MP-WEIXIN -->
		<text :style="{ color: color, 'font-size': size + 'px' }" class="uni-icons" :class="type" @click="_onClick"></text>
	<!-- #endif -->
	
</template>

<script>
	import icons from './icons.js';
	// #ifdef APP-NVUE
	var domModule = weex.requireModule('dom');
	domModule.addRule('fontFace', {
		'fontFamily': "iconfont",
		'src': url('~@/static/iconfont.ttf')
	});
	// #endif
	export default {
		name: 'UniIcons',
		props: {
			type: {
				type: String,
				default: ''
			},
			color: {
				type: String,
				default: '#333333'
			},
			size: {
				type: [Number, String],
				default: 16
			}
		},
		data() {
			return {
				icons: icons
			}
		},
		methods: {
			_onClick() {
				this.$emit('click')
			}
		}
	}
</script>

<style lang="scss" scoped>
	/* #ifndef APP-NVUE */
	@font-face {
		font-family: "iconfont";
		src: url('~@/static/iconfont.ttf') format('truetype');
	}

	/* #endif */
	.uni-icons {
		font-family: "iconfont";
		text-decoration: none;
		text-align: center;
	}
	
	.Back:before {
	  content: "\e600";
	}
	
	
</style>
