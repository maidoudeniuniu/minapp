<template>
	<view>
		<!-- <view class="banner" v-if="article.thumb">
			<image v-if="article.thumb" class="banner-img" mode="widthFix" :src="article.thumb.url"></image>
			<view class="banner-title">{{article.title}}</view>
		</view>
		<view v-else>
			<view class="article-title">{{article.title}}</view>
		</view> -->
		<view class="article-meta" v-if="article.author">
			<text class="article-author">{{article.author}}</text>
			<!-- <text class="article-text">发表于</text> -->
			<text class="article-time">{{new Date(article.created_at).toLocaleDateString()}}</text>
		</view>
		<view class="article-content">
			<rich-text :nodes="htmlNodes"></rich-text>
		</view>
	</view>
</template>

<script>
	const DETAIL_PAGE_PATH = '/pages/custom/article'
	import marked from 'marked'
	import htmlParser from '@/common/js/html-parser.js'
	import {
		cmsarticles
	} from '@/common/api/cms.js'

	function _handleShareChannels(provider) {
		const channels = []
		for (let i = 0, len = provider.length; i < len; i++) {
			switch (provider[i]) {
				case 'weixin':
					channels.push({
						text: '分享到微信好友',
						id: 'weixin',
						sort: 0,
					})
					channels.push({
						text: '分享到微信朋友圈',
						id: 'weixin',
						sort: 1,
					})
					break
				default:
					break
			}
		}
		channels.sort((x, y) => x.sort - y.sort)
		return channels
	}

	export default {
		data() {
			return {
				title: '',
				articleId: '',
				article: {},
				htmlNodes: [],
			}
		},
		onLoad(event) {
			const {
				article_id
			} = event
			this.articleId = article_id
			this.getArticle().then((res) => {
				uni.setNavigationBarTitle({
					title: this.article.title
				})
			})
		},
		onShareAppMessage() {
			return this.$util.uniShare({
				title: this.article.title,
				path: `${DETAIL_PAGE_PATH}?detailDate=${JSON.stringify(this.article)}`,
			})
		},
		onNavigationBarButtonTap(event) {
			const buttonIndex = event.index
			if (buttonIndex === 0) {
				// 分享 H5 的页面
				const shareProviders = []
				uni.getProvider({
					service: 'share',
					success: (result) => {
						// 目前仅考虑分享到微信
						if (result.provider && result.provider.length && ~result.provider.indexOf('weixin')) {
							const channels = _handleShareChannels(result.provider)
							uni.showActionSheet({
								itemList: channels.map((channel) => channel.text),
								success: (result) => {
									const {
										tapIndex
									} = result
									uni.share({
										provider: 'weixin',
										type: 0,
										title: this.article.title,
										scene: tapIndex === 0 ? 'WXSceneSession' :
											'WXSenceTimeline',
										href: `https://uniapp.dcloud.io/h5${DETAIL_PAGE_PATH}?detailDate=${JSON.stringify(this.article)}`,
										imageUrl: 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/app/share-logo@3.png',
									})
								},
							})
						} else {
							uni.showToast({
								title: '未检测到可用的微信分享服务'
							})
						}
					},
					fail: (error) => {
						uni.showToast({
							title: '获取分享服务失败'
						})
					},
				})
			}
		},
		methods: {
			async getArticle() {
				try {
					const response = await cmsarticles(this.articleId)
					if (response) {
						let htmlString = marked(response.content)
						htmlString = htmlString.replace(/\\/g, '').replace(/<img/g, '<img style="width: 100%;"')
						this.htmlNodes = htmlParser(htmlString)
						this.article = response
					}
					return response
				} catch (e) {
					console.log(e)
				}
			},
		},
	}
</script>

<style>
	.banner {
		height: 360rpx;
		overflow: hidden;
		position: relative;
		background-color: #ccc;
	}

	.banner-img {
		width: 100%;
	}

	.banner-title {
		max-height: 84rpx;
		overflow: hidden;
		position: absolute;
		left: 30rpx;
		bottom: 30rpx;
		width: 90%;
		font-size: 32rpx;
		font-weight: 400;
		line-height: 42rpx;
		color: white;
		z-index: 11;
	}

	.article-title {
		overflow: hidden;
		width: 95%;
		margin: 0 auto;
		font-size: 32rpx;
		font-weight: 600;
		color: #333333;
	}

	.article-meta {
		padding: 20rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		color: gray;
	}

	.article-text {
		font-size: 26rpx;
		line-height: 50rpx;
		margin: 0 20rpx;
	}

	.article-author,
	.article-time {
		font-size: 30rpx;
	}

	.article-content {
		padding: 0 30rpx;
		overflow: hidden;
		font-size: 30rpx;
		margin-bottom: 30rpx;
	}
</style>
