<!-- **
 * mt-badge
 * @module components/badge
 * @desc 徽章
 * @param {string} [type=primary] 组件样式，可选 primary, error, success, warning
 * @param {string} [color] - 传入颜色值
 * @param {string} [size=normal] - 尺寸，接受 normal, small, large
 *
 * @example
 * <mt-badge color="error">错误</mt-badge>
 * <mt-badge color="#333">30</mt-badge>
 * -->

<style lang="scss">
	@import "../../assets/css/variable/global";
	.mint-badge{
		display: inline-block;
		text-align: center;
		color: $color-white;
		&.is-success{
			background-color: $success-color;
		}
		&.is-primary{
			background-color: $color-blue;
		}
		&.is-error{
			background-color: $error-color;
		}
		&.is-warning{
			background-color: $warning-color;
		}
		&.is-size-large{
			padding: 2px 10px;
			font-size: 18px;
			border-radius: 14px;
		}
		&.is-size-normal{
			padding: 2px 8px;
			font-size: 15px;
			border-radius: 12px;
		}
		&.is-size-small{
			padding: 2px 6px;
			font-size: 12px;
			border-radius: 8px;
		}
	}
</style>

<template>
	<span class="mint-badge" :style="{backgroundColor: color}" :class="['is-' + type, 'is-size-' + size]">
		<slot></slot>
	</span>
</template>

<script>
	export default {
		name: "mt-badge",
		props: {
			color: String,
			type: {
				type: String,
				default: "primary"
			},
			size: {
				type: String,
				default: "normal"
			}
		}
	}
</script>