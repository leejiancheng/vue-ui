<!-- **
 * mt-navbar
 * @module components/navbar
 * @desc 顶部 tab，依赖 tab-item
 *
 * @param {boolean} [fixed=false] - 固定底部
 * @param {*} selected - 返回 item component 传入的 value
 *
 * @example
 * <mt-navbar :selected.sync="selected">
 *   <mt-tab-item value="订单">
 *     <span slot="label">订单</span>
 *   </mt-tab-item>
 * </mt-navbar>
 *
 * <mt-navbar :selected.sync="selected" fixed>
 *   <mt-tab-item :value="['传入数组', '也是可以的']">
 *     <span slot="label">订单</span>
 *   </mt-tab-item>
 * </mt-navbar>
 * -->

<style lang="scss">
	@import "../../assets/css/variable/global";
	.mint-navbar{
		display: flex;
		text-align: center;
		background-color: $color-white;
		&.is-fixed{
			position: fixed;
			top: 0;
			right: 0;
			left: 0;
			z-index: $z-index-normal;
		}
		.mint-tab-item{
			padding: 17px 0;
			font-size: 15px;
			&:last-child{
				border-right: 0;
			}
			&.is-selected{
				border-bottom: 3px solid $color-blue;
				color: $color-blue;
				// margin-bottom: -3px;
			}
		}
	}
</style>

<template>
	<div class="mint-navbar" :class="{'is-fixed': fixed}">
		<slot></slot>
	</div>
</template>

<script>
	export default {
		name: "mt-navbar",
		props: {
			fixed: Boolean,
			value: {}
		}
	}
</script>