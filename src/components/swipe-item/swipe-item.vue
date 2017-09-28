<!-- **
 * mt-swipe
 * @module components/swipe
 * @desc 轮播图，搭配 swipe-item 使用
 * ********** API **********
 * @param {Number} [speed=300] - 动画持时（毫秒）
 * @param {Number} [auto=3000] - 自动播放的时间间隔（毫秒）
 * @param {Number} [defaultIndex=0] - 初始显示的轮播图的索引
 * @param {Boolean} [continuous=true] - 是否可以循环播放
 * @param {Boolean} [showIndicators=true] - 是否显示 indicators
 * @param {Boolean} [prevent=false] - 是否在 touchstart 事件触发时阻止事件的默认行为。设为 true 可提高运行在低版本安卓浏览器时的性能
 * @param {Boolean} [stopPropagation=false] - 是否在 touchstart 事件触发时阻止冒泡。
 * ********** Slot **********
 * @param [mt-swipe] - 一个或多个 mt-swipe-item 组件
 * @param [mt-swipe-item] - 单个轮播图的内容
 *
 * @example
 * <mt-swipe :auto="4000">
 * 	 <mt-swipe-item>1</mt-swipe-item>
 * 	 <mt-swipe-item>2</mt-swipe-item>
 * 	 <mt-swipe-item>3</mt-swipe-item>
 * </mt-swipe>
 * -->

<style lang="scss" scoped>
	// @import "../../assets/css/variable/global";
</style>

<template>
	<div class="mint-swipe-item">
		<slot></slot>
	</div>
</template>

<script>
	export default {
		name: "mt-swipe-item",
		mounted() {
			this.$parent && this.$parent.swipeItemCreated(this);
		},
		destroyed() {
			this.$parent && this.$parent.swipeItemDestroyed(this);
		}
	};
</script>