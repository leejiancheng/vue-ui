<!-- **
 * mt-spinner
 * @module components/spinner
 * @desc 加载动画
 * @param {(string|number)} [type=snake] - 显示类型，传入类型名或者类型 id，可选 `snake`, `dobule-bounce`, `triple-bounce`, `fading-circle`
 * @param {number} size - 尺寸
 * @param {string} color - 颜色
 *
 * @example
 * <mt-spinner type="snake"></mt-spinner>
 *
 * // double-bounce
 * <mt-spinner :type="1"></mt-spinner>
 *
 * // default snake
 * <mt-spinner :size="30" color="#999"></mt-spinner>
 * -->

<style lang="scss" scoped>
</style>

<template>
	<span>
		<component :is="spinner"></component>
	</span>
</template>

<script>
	const SPINNERS = [
		"snake",
		"double-bounce",
		"triple-bounce",
		"fading-circle"
	];

	const parseSpinner = (index) => {
		if ({}.toString.call(index) === "[object Number]") {
			if (SPINNERS.length <= index) {
				console.warn(`"${index}" spinner not found, use the default spinner.`);
				index = 0;
			}
			return SPINNERS[index]
		}
		if (SPINNERS.indexOf(index) === -1) {
			console.warn(`"${index}" spinner not found, use the default spinner.`);
			index = SPINNERS[0];
		}
		return index;
	};
	import SpinnerSnake from "./spinner/snake.vue";
	import SpinnerDoubleBounce from "./spinner/double-bounce.vue";
	import SpinnerTripleBounce from "./spinner/triple-bounce.vue";
	import SpinnerFadingCircle from "./spinner/fading-circle.vue";
	export default {
		name: "mt-spinner",
		props: {
			type: {
				default: 0
			},
			size: {
				type: Number,
				default: 28
			},
			color: {
				type: String,
				default: "#ccc"
			}
		},
		computed: {
			spinner() {
				return `spinner-${parseSpinner(this.type)}`;
			}
		},
		components: {
			"spinner-snake": SpinnerSnake,
			"spinner-double-bounce": SpinnerDoubleBounce,
			"spinner-triple-bounce": SpinnerTripleBounce,
			"spinner-fading-circle": SpinnerFadingCircle
		}
	}
</script>