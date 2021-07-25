<template>
	<view class="u-footer">
		<image class="u-footer-img" src="./images/logo.png" mode="widthFix" />
		<view class="u-footer-tip">
			{{ tip }}
			<slot></slot>
		</view>
	</view>
</template>

<script>
	/**
	 * footer 页脚
	 * @description 页脚
	 * @property {String} tip 提示信息 
	 */
	
	export default {
		name: "u-footer",
		props: {
			// logo下方提示信息
			tip: {
				type: String,
				default: ''
			}
			
		}
	}
</script>

<style scoped lang="scss">
	.u-footer {
		padding: 50rpx 0 46rpx;
		text-align: center;
		background-color: #F5F5F5;
		&-img {
			width: 156rpx;
		}
		&-tip {
			color: #ccc;
			font-size: 24rpx;
			line-height: 36rpx;
			font-weight: 400;
		}
	}
</style>
