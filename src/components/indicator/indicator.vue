<!-- **
 * Indicator
 * @module components/indicator
 * @desc 加载提示框，支持自定义文本和加载图标。
 * @param {String} [text] - 文本内容
 * @param {String} [spinnerType=snake] - 加载图标的类型(可选值: snake, fading-circle, double-bounce, triple-bounce)
 *
 * @example
 * Indicator.open('加载中...');
 * -->

<style lang="scss" scoped>
	.mint-indicator{
		transition: opacity 0.2s linear;
	}
	.mint-indicator-wrapper{
		position: fixed;
		top: 50%;
		left: 50%;
		box-sizing: border-box;
		transform: translate(-50%, -50%);
		border-radius: 5px;
		background: rgba(0, 0, 0, 0.7);
		color: #fff;
		text-align: center;
	}
	.mint-indicator-spin{
		display: inline-block;
		text-align: center;
	}
	.mint-indicator-text{
		display: block;
		margin-top: 10px;
		text-align: center;
		font-size: 16px;
		color: #fff;
	}
	.mint-indicator-mask{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
		background: transparent;
	}
	.mint-indicator-enter,
	.mint-indicator-leave-active{
		opacity: 0;
	}
</style>

<template>
	<transition name="mint-indicator">
		<div class="mint-indicator" v-show="visible">
			<div class="mint-indicator-wrapper" :style="{'padding': text ? '20px' : '15px'}">
				<spinner class="mint-indicator-spin" :type="convertedSpinnerType" :size="32"></spinner>
				<span class="mint-indicator-text" v-show="text">{{text}}</span>
			</div>
			<div class="mint-indicator-mask" @touchmove.stop.prevent></div>
		</div>
	</transition>
</template>

<script>
	import Spinner from "@/components/spinner/spinner.vue";
	export default {
		name: "mt-indicator",
		components: {'spinner': Spinner},
		props: {
			text: String,
			spinnerType: {
				type: String,
				default: "snake"
			}
		},
		data() {
			return {
				visible: false
			}
		},
		computed: {
			convertedSpinnerType() {
				switch(this.spinnerType) {
					case "double-bounce":
						return 1;
					case "triple-bounce":
						return 2;
					case "fading-circle":
						return 3;
					default:
						return 0;
				}
			}
		}
	}
</script>