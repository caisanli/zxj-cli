<template>
	<u-popup
		:maskCloseAble="maskCloseAble" 
		mode="bottom" 
		:popup="false" 
		v-model="uValue" 
		length="auto" 
		:safeAreaInsetBottom="safeAreaInsetBottom" 
		@close="close" 
		:z-index="uZIndex"
		:borderRadius="borderRadius"
	>
		<view :class="clsPrefix">
			<view :class="`${clsPrefix}-header`">
				<view class="u-btn-picker u-btn-picker--tips"
					:style="{ color: cancelColor }" 
					hover-class="u-opacity" 
					:hover-stay-time="150" 
					@tap="getResult('cancel')"
				>{{cancelText}}</view>
				<view :class="`${clsPrefix}-header_title`">
					{{ title }}
				</view>
				<view
					class="u-btn-picker u-btn-picker--primary"
					:style="{ color: moving ? cancelColor : confirmColor }"
					hover-class="u-opacity"
					:hover-stay-time="150"
					@touchmove.stop=""
					@tap.stop="getResult('confirm')"
				>
					{{confirmText}}
				</view>
			</view>
			<view :class="`${clsPrefix}-body`">
				<!-- 标签 -->
				<u-tabs :current="tabCurrent" :list="tabs" @change="onTabChange"></u-tabs>
				<!--  -->
				<view :class="`${clsPrefix}-content`">
					<!-- 日期 -->
					<picker-view 
						v-if="tabCurrent === 0" :class="`${clsPrefix}-picker`" 
						:value="dateValue"
						@change="onDateChange"
					>
						<picker-view-column>
							<view :class="`${clsPrefix}-picker-item`" v-for="(item, index) in years" :key="index">
								<view class="u-line-1">{{ item }}年</view>
							</view>
							<view :class="`${clsPrefix}-picker-item`" v-for="(item, index) in months" :key="index">
								<view class="u-line-1">{{ item }}月</view>
							</view>
							<view :class="`${clsPrefix}-picker-item`" v-for="(item, index) in days" :key="index">
								<view class="u-line-1">{{ item }}日</view>
							</view>
						</picker-view-column>
					</picker-view>
					<!-- 时间 -->
					<picker-view v-else-if="tabCurrent === 1">
						
					</picker-view>
				</view>
				<!-- <view :class="`${clsPrefix}-tabs`">
					<view :class="`${clsPrefix}-tab`">
						日期
					</view>
					<view :class="`${clsPrefix}-tab`">
						时间
					</view>
				</view> -->
				
			</view>
		</view>
	</u-popup>
</template>

<script>
	import themeColor from '../../theme.js'
	export default {
		name: "u-date-time-picker",
		props: {
			// 控制组件显示、隐藏
			value: {
				type: Boolean,
				default: false
			},
			// 
			safeAreaInsetBottom: {
				type: Boolean,
				default: false
			},
			borderRadius: {
				type: Number,
				default: 36
			},
			// 是否允许通过点击遮罩关闭Picker
			maskCloseAble: {
				type: Boolean,
				default: true
			},
			// 弹出的z-index值
			zIndex: {
				type: [String, Number],
				default: 0
			},
			// 顶部标题
			title: {
				type: String,
				default: ''
			},
			// "取消"按钮的颜色
			cancelColor: {
				type: String,
				default: themeColor.tip //'#606266'
			},
			// "确定"按钮的颜色
			confirmColor: {
				type: String,
				default: themeColor.primary // '#2979ff'
			},
			// 取消按钮的文字
			cancelText: {
				type: String,
				default: '取消'
			},
			// 确认按钮的文字
			confirmText: {
				type: String,
				default: '确认'
			}
		},
		computed: {
			uZIndex() {
				// 如果用户有传递z-index值，优先使用
				return this.zIndex ? this.zIndex : this.$u.zIndex.popup;
			}
		},
		watch: {
			value(newVal) {
				this.uValue = newVal;
			}
		},
		data() {
			return {
				clsPrefix: 'u-date-time-picker', // 类前缀
				uValue: this.value,
				tabCurrent: 0,
				tabs: [{name: '日期'}, {name: '时间'}],
				years: [2021, 2022, 2023, 2024, 2025],
				oldYearIndex: 0,
				months: [],
				days: [],
				dateValue: [0, 0, 0],
				moving: false // 列是否还在滑动中，微信小程序如果在滑动中就点确定，结果可能不准确
			};
		},
		methods: {
			onDateChange(e) {
				const { detail: { value } } = e;
				const [ yearIndex, monthIndex, dayIndex ] = value;
				if(yearIndex === 0) {
					this.setYears(this.years[yearIndex], 'up');
					this.dateValue = [10, monthIndex, dayIndex]
				} else if(yearIndex === this.years.length - 1) {
					this.setYears(this.years[yearIndex], 'down');
					this.dateValue = [yearIndex, monthIndex, dayIndex]
				}
				this.oldYearIndex = yearIndex;
			},
			
			onTabChange(val) {
				this.tabCurrent = val;
			},
			// 设置年
			setYears(currentYear, type) {
				const UP_DOWN_YEAR_COUNT = 10;
				const newYears = [];
				currentYear = currentYear / 1;
				
				for(let y = UP_DOWN_YEAR_COUNT; y > 0; y--) {
					const ny = y;
					const year = type === 'up' ? currentYear - ny
												: currentYear + ny;
					newYears.push(year);
				}
				if(type === 'up') {
					this.years = [...newYears, ...this.years]
				} else if(type === 'down') {
					this.years = [...this.years, ...newYears]
				}
				console.log('newYears：', newYears);
				// this.years
			},
			close() {
				
			}
		}
	}
</script>

<style scoped lang="scss">
	@import '../../libs/css/style.components.scss';
	.u-date-time-picker {
		&-tabs {
			@include vue-flex;
		}
		&-tab {
			
		}
		&-header {
			width: 100%;
			height: 90rpx;
			padding: 0 40rpx;
			@include vue-flex;
			justify-content: space-between;
			align-items: center;
			box-sizing: border-box;
			font-size: 30rpx;
			background: #fff;
			position: relative;
			&_title {
				color: $u-main-color;
				font-size: 34rpx;
			}
		}
		&-content {
			height: 500rpx;
			padding: 0 40rpx;
		}
		&-picker {
			height: 100%;
			&-item {
				height: $u-select-item;
				line-height: $u-select-item;
			}
		}
	}
</style>
