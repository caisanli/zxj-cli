<template>
	<u-popup
		mode="bottom" 
		:border-radius="borderRadius" 
		:popup="false" 
		v-model="value" 
		:maskCloseAble="maskCloseAble"
	    length="auto" 
		:safeAreaInsetBottom="safeAreaInsetBottom" 
		@close="popupClose" 
		:z-index="uZIndex"
	>
		<view :class="clsPrefix">
			<view :class="`${ clsPrefix }-header`">
				<text :class="`${ clsPrefix }-title`">
					{{ title }}
				</text>
			</view>
			<view :class="`${ clsPrefix }-body`">
				<scroll-view scroll-x="true">
					<view :class="`${ clsPrefix }-list`">
						<view 
							:class="`${ clsPrefix }-item`" 
							v-for="(item, index) in list"
							:key="index"
							@tap="onTap(item)"
						>
							<image :class="`${ clsPrefix }-image`" :src="getImage(item)" mode="widthFix"></image>
							<view :class="`${ clsPrefix }-label`">
								{{ item.label }}
							</view>
						</view>
					</view>
				</scroll-view>
				<view v-if="subList.length" :class="`${ clsPrefix }-divider`">
					<u-divider bg-color="#e6e6e6" :margin-top="34" :margin-bottom="34"></u-divider>
				</view>
				<scroll-view v-if="subList.length" scroll-x="true" >
					<view :class="`${ clsPrefix }-list`">
						<view 
							:class="`${ clsPrefix }-item`" 
							v-for="(item, index) in subList"
							:key="index"
							@tap="onTap(item)"
						>
							<image :class="`${ clsPrefix }-image`" :src="getImage(item)" mode="widthFix"></image>
							<view :class="`${ clsPrefix }-label`">
								{{ item.label }}
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
			<!-- <view class="u-gab" v-if="cancelBtn"></view> -->
			<u-gap bg-color="#f5f5f5" :height="16" v-if="cancelBtn"></u-gap>
			<view 
				:class="`${ clsPrefix }-footer`"
				@touchmove.stop.prevent
				hover-class="u-hover-class"
				:hover-stay-time="150" 
				v-if="cancelBtn" 
				@tap="close"
			>
				{{ cancelText }}
			</view>
		</view>
	</u-popup>
</template>

<script>
	const DEFAULT_TYPE = ['link', 'poster', 'pyq', 'qq', 'qr', 'trends', 'wechat', 'weibo'];
	/**
	 * 分享组件 见API:https://uniapp.dcloud.io/api/plugins/share
	 * 
	 */
	export default {
		name: "u-popup-share",
		props: {
			// 分享列表
			list: {
				type: Array,
				default() {
					return [];
				}
			},
			// 子分享列表
			subList: {
				type: Array,
				default() {
					return [];
				}
			},
			// 分享标题
			title: {
				type: String,
				default: '立即分享'
			},
			// 底部的取消按钮
			cancelBtn: {
				type: Boolean,
				default: true
			},
			// 是否开启底部安全区适配，开启的话，会在iPhoneX机型底部添加一定的内边距
			safeAreaInsetBottom: {
				type: Boolean,
				default: false
			},
			// 通过双向绑定控制组件的弹出与收起
			value: {
				type: Boolean,
				default: false
			},
			// 弹出的顶部圆角值
			borderRadius: {
				type: [String, Number],
				default: 36
			},
			// 弹出的z-index值
			zIndex: {
				type: [String, Number],
				default: 0
			},
			// 取消按钮的文字提示
			cancelText: {
				type: String,
				default: '取消'
			},
			// 点击遮罩是否可以关闭actionsheet
			maskCloseAble: {
				type: Boolean,
				default: true
			},
			// 弹出的顶部圆角值
			borderRadius: {
				type: [String, Number],
				default: 36
			}
		},
		computed: {
			uZIndex() {
				// 如果用户有传递z-index值，优先使用
				return this.zIndex ? this.zIndex : this.$u.zIndex.popup;
			}
		},
		data() {
			return {
				clsPrefix: 'u-popup-share'
			};
		},
		methods: {
			onTap(item) {
				this.popupClose();
				this.$emit('click', item);
			},
			getImage(item) {
				if(item.src) 
					return item.src;
					
				if(DEFAULT_TYPE.includes(item.type))
					return require(`./images/icon_${item.type}.png`);
					
				return undefined;
			},
			close() {
				this.popupClose();
				this.$emit('close');
			},
			popupClose() {
				this.$emit('input', false);
			}
		}
	}
</script>

<style scoped lang="scss">
	// @import "../../libs/css/style.components.scss";
	.u-popup-share {
		&-header {
			padding: 34rpx 0;
			text-align: center;
		}
		&-title {
			font-size: 28rpx;
		}
		&-footer {
			padding: 24rpx 0;
			text-align: center;
			color: $u-tips-color;
		}
		&-body {
			margin-bottom: 30rpx;
		}
		&-list {
			display: flex;
			// @include vue-flex;
			align-items: center;
			padding: 0 16rpx;
		}
		&-item {
			padding: 0 32rpx;
			text-align: center;
		}
		&-image {
			width: 96rpx;
			height: 96rpx;
		}
		&-label {
			color: $u-tips-color;
			font-size: 24rpx;
		}
		&-divider {
			padding: 0 48rpx;
		}
	}
</style>
