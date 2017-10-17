<!-- **
 * mt-button
 * @module components/button
 * @desc 按钮
 * @param {string} [type=default] - 显示类型，接受 default, primary, danger
 * @param {boolean} [disabled=false] - 禁用
 * @param {boolean} [plain=false] - 幽灵按钮
 * @param {string} [size=normal] - 尺寸，接受 normal, small, large
 * @param {string} [native-type] - 原生 type 属性
 * @param {string} [icon] - 图标，提供 more, back，或者自定义的图标（传入不带前缀的图标类名，最后拼接成 .fa-xxx）
 * @param {slot} - 显示文本
 * @param {slot} [icon] 显示图标
 *
 * @example
 * <mt-button size="large" icon="back" type="primary">按钮</mt-button>
 * -->

<style lang="scss">
	@import "../../assets/css/variable/global";
	.mint-card{
		position: relative;
		margin: 8px;
		border-radius: 2px;
		background-color: #fff;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
	}
	.mint-card-header{
		position: relative;
		display: flex;
		min-height: 48px;
		padding: 4px 15px;
		justify-content: space-between;
		align-items: center;
		border-radius: 2px 2px 0 0;
		font-size: 18px;
		box-sizing: border-box;
		&::after{
			content: "";
			position: absolute;
			left: 0;
			bottom: 0;
			display: block;
			width: 100%;
			height: 1px;
			background-color: rgba(0, 0, 0, 0.12);
		}
	}
	.mint-card-image{
		position: relative;
		height: 40vw;
		img{
			display: block;
			width: 100%;
			height: 100%;
		}
	}
	.mint-card-content{
		position: relative;
		padding: 16px;
		color: $default-color;
	}
	.mint-card-footer{
		position: relative;
		min-height: 48px;
		padding: 4px 15px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-radius: 0 0 2px 2px;
		color: $common-color;
		box-sizing: border-box;
		&::before{
			content: "";
			position: absolute;
			left: 0;
			top: 0;
			display: block;
			width: 100%;
			height: 1px;
			background-color: rgba(0, 0, 0, 0.12);
		}
	}
</style>

<template>
	<div class="mint-card">
		<div class="mint-card-header">
			<slot name="header"></slot>
		</div>
		<div class="mint-card-image" v-show="showImage">
			<slot name="image">
				<img src="" >
			</slot>
		</div>
		<div class="mint-card-content">
			<slot></slot>
		</div>
		<div class="mint-card-footer">
			<slot name="footer"></slot>
		</div>
	</div>
</template>

<script >
	export default {
		name: "mt-card",
		props: {
			showImage: {
				type: Boolean,
				default: false
			}
		}
		
	}
</script>