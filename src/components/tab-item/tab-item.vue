<!-- **
 * mt-tab-item
 * @module components/tab-item
 * @desc 搭配 tabbar 或 navbar 使用
 * @param {*} id - 选中后的返回值，任意类型
 * @param {slot} [icon] - icon 图标
 * @param {slot} - 文字
 *
 * @example
 * <mt-tab-item>
 *   <img slot="icon" src="http://placehold.it/100x100">
 *   订单
 * </mt-tab-item>
 * -->

<style lang="scss">
	@import "../../assets/css/variable/global";
	.mint-tab-item{
		display: block;
		padding: 7px 0;
		flex: 1;
		text-decoration: none;
	}
	.mint-tab-item-icon{
		width: 24px;
		height: 24px;
		margin: 0 auto 5px;
		&:empty{
			display: none;
		}
		& > *{
			display: block;
			width: 100%;
			height: 100%;
		}
	}
	.mint-tab-item-label{
		color: inherit;
		font-size: $tab-item-font-size;
		line-height: 1;
	}
</style>

<template>
	<a class="mint-tab-item" :class="{'is-selected': $parent.value === id}" @click="$parent.$emit('input', id)">
		<div class="mint-tab-item-icon">
			<slot name="icon"></slot>
		</div>
		<div class="mint-tab-item-label">
			<slot></slot>
		</div>
	</a>
</template>

<script>
	export default {
		name: "mt-tab-item",
		props: ["id"]
	}
</script>