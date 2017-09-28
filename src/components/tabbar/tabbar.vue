<!-- **
 * mt-tabbar
 * @module components/tabbar
 * @desc 底部 tab，依赖 tab-item
 * @param {boolean} [fixed=false] - 固定底部
 * @param {*} value - 返回 item component 传入的 id
 *
 * @example
 * <mt-tabbar v-model="selected">
 *   <mt-tab-item id="订单">
 *     <img slot="icon" src="http://placehold.it/100x100">
 *     <span slot="label">订单</span>
 *   </mt-tab-item>
 * </mt-tabbar>
 *
 * <mt-tabbar v-model="selected" fixed>
 *   <mt-tab-item :id="['传入数组', '也是可以的']">
 *     <img slot="icon" src="http://placehold.it/100x100">
 *     <span slot="label">订单</span>
 *   </mt-tab-item>
 * </mt-tabbar>
 * -->

<style lang="scss" scoped>
	@import "../../assets/css/variable/global";
	.mint-tabbar{
		position: relative;
		position: absolute;
		right: 0;
		bottom: 0;
		left: 0;
		display: flex;
		text-align: center;
		background-image:linear-gradient(180deg, $color-grey, $color-grey 50%, transparent 50%);
		background-size: 100% 1px;
		background-repeat: no-repeat;
		background-position: top left;
		background-color: $tabbar-background-color;
		&.is-fixed{
			position: fixed;
			right: 0;
			bottom: 0;
			left: 0;
			z-index: $z-index-normal;
		}
		& > .mint-tab-item.is-selected{
			background-color: $tabbar-tab-item-selected-background-color;
			color: $tabbar-tab-item-selected-color;
		}
	}
</style>

<template>
	<div class="mint-tabbar" :class="{'is-fixed': fixed}">
		<slot></slot>
	</div>
</template>

<script>
	export default {
		name: "mt-tabbar",
		props: {
			fixed: Boolean,
			value: {}
		}
	}
</script>