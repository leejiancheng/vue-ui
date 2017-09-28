<!-- **
 * mt-header
 * @module components/header
 * @desc 顶部导航
 * @param {boolean} [fixed=false] - 固定顶部
 * @param {string} [title] - 标题
 * @param {slot} [left] - 显示在左侧区域
 * @param {slot} [right] - 显示在右侧区域
 *
 * @example
 * <mt-header title="我是标题" fixed>
 *   <mt-button slot="left" icon="back" @click="handleBack">返回</mt-button>
 *   <mt-button slot="right" icon="more"></mt-button>
 * </mt-header>
 * -->

<style lang="scss">
	@import "../../assets/css/variable/global";
	@import "../../assets/css/mixin/mixin";
	.mint-header{
		position: relative;
		display: flex;
		align-items: center;
		box-sizing: border-box;
		height: $header-height;
		padding: 0 10px;
		line-height: 1;
		font-size: 14px;
		color: $color-white;
		background-color: $color-blue;
		white-space: nowrap;
		text-align: center;
		&.is-fixed{
			position: fixed;
			top: 0;
			right: 0;
			left: 0;
			z-index: $z-index-normal;
		}
		.mint-button{
			display: inline-block;
			padding: 0;
			font-size: inherit;
			background-color: transparent;
			border: 0;
			box-shadow: none;
			color: inherit;
			&::after{
				content: none;
			}
		}
	}
	.mint-header-button{
		flex: 0.5;
		> a{
			color: inherit;
		}
		&.is-left{
			text-align: left;
		}
		&.is-right{
			text-align: right;
		}
	}
	.mint-header-title{
		flex: 1;
		font-size: inherit;
		font-weight: normal;
		@include ellipsis;
	}
</style>

<template>
	<header class="mint-header" :class="{'is-fixed': fixed}">
		<div class="mint-header-button is-left">
			<slot name="left"></slot>
		</div>
		<h1 class="mint-header-title" v-text="title"></h1>
		<div class="mint-header-button is-right">
			<slot name="right"></slot>
		</div>
	</header>
</template>

<script>
	export default {
		name: "mt-header",
		props: {
			fixed: Boolean,
			title: String
		}
	}
</script>