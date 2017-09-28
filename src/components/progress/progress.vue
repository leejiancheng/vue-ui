<!-- **
 * mt-progress
 * @module components/progress
 * @desc 进度条
 * @param {Number} [value] - 进度条的进度
 * @param {Number} [value] - 进度条的高度
 *
 * @example
 * <mt-progress :value="20" :barHeight="4"></mt-progress>
 * -->

<style lang="scss">
	@import "../../assets/css/variable/global";
	.mint-progress{
		position: relative;
		display: flex;
		height: 30px;
		line-height: 30px;
		& > * {
			display: flex;
			display: -webkit-box;
		}
		& *[slot="start"]{
			margin-right: 5px;
		}
		& *[slot="end"]{
			margin-left: 5px;
		}
	}
	.mint-progress-content{
		position: relative;
		flex: 1;
	}
	.mint-progress-runway{
		position: absolute;
		top: 50%;
		left: 0;
		right: 0;
		height: 3px;
		background-color: #ebebeb;
		transform: translate(0, -50%);
	}
	.mint-progress-progress{
		position: absolute;
		top: 50%;
		display: block;
		width: 0;
		background-color: #26a2ff;
		transform: translate(0, -50%);
	}
</style>

<template>
	<div class="mint-progress">
		<slot name="start"></slot>
		<div class="mint-progress-content">
			<div class="mint-progress-runway" :style="{height: barHeight + 'px'}"></div>
			<div class="mint-progress-progress" :style="{width: value + '%', height: barHeight + 'px'}"></div>
		</div>
		<slot name="end"></slot>
	</div>
</template>

<script>
	export default {
		name: "mt-progress",
		props: {
			value: Number,
			barHeight: {
				type: Number,
				default: 3
			}
		}
	}
</script>