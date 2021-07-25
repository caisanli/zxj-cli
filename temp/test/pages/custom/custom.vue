<template>
	<view class="custom">
		<u-nav-bar>自定义组件</u-nav-bar>
		<u-button @click="onShare">分享</u-button>
		<u-popup-share v-model="shareVisible" :list="shareList" :sub-list="shareSubList"></u-popup-share>
		<u-footer tip="北京众信佳"></u-footer>
	</view>
</template>

<script>

	export default {
		data() {
			return {
				shareVisible: false,
				shareList: [{
					label: '微信好友',
					type: 'wechat'
				}, {
					label: '连接',
					type: 'link'
				}, {
					label: 'QQ',
					type: 'qq'
				}, {
					label: '微信好友',
					type: 'wechat'
				}, {
					label: '连接',
					type: 'link'
				}, {
					label: 'QQ',
					type: 'qq'
				}],
				shareSubList: [{
					label: '海报',
					type: 'poster'
				}, {
					label: '复制连接',
					type: 'link'
				}, {
					label: '二维码',
					type: 'qr'
				}]
			};
		},
		methods: {
			onShare() {
				this.shareVisible = true;
			}
		}
	}
</script>

<style lang="scss">

</style>
