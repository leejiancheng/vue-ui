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
	.mint-button{
		appearance: none;
		border-radius: 4px;
		border: 0;
		box-sizing: border-box;
		color: inherit;
		display: block;
		font-size: 18px;
		height: 41px;
		outline: 0;
		overflow: hidden;
		position: relative;
		text-align: center;
		&::after{
			content: " ";
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			opacity: 0;
			background-color: #000;
		}
		&:not(.is-disabled):active::after{
			opacity: 0.4;
		}
		&.is-disabled{
			opacity: 0.6;
		}
	}
	.mint-button-icon{
		display: inline-block;
		vertical-align: middle;
	}
	.mint-button--default{
		color: $button-default-color;
		background-color: $button-default-background-color;
		box-shadow: $button-default-box-shadow;
		&.is-plain{
			border: 1px solid $button-default-plain-color;
			background-color: transparent;
			box-shadow: none;
			color: $button-default-plain-color;
		}
	}
	.mint-button--primary{
		color: $button-primary-color;
		background-color: $button-primary-background-color;
		&.is-plain{
			border: 1px solid $button-primary-background-color;
			background-color: transparent;
			color: $button-primary-background-color;
		}
	}
	.mint-button--danger{
		color: $button-danger-color;
		background-color: $button-danger-background-color;
		&.is-plain{
			border: 1px solid $button-danger-background-color;
			background-color: transparent;
			color: $button-danger-background-color;
		}
	}
	.mint-button--large{
		display: block;
		width: 100%;
	}
	.mint-button--normal{
		display: inline-block;
		padding: 0 12px;
	}
	.mint-button--small{
		display: inline-block;
		font-size: 14px;
		padding: 0 12px;
		height: 33px;
	}
	
</style>

<template>
	<button
		:type="nativeType"
		class="mint-button"
		:class="['mint-button--' + type, 'mint-button--' + size, {
			'is-disabled': disabled,
			'is-plain': plain
		}]"
		@click="handleClick"
		:disabled="disabled"
	>
		<span class="mint-button-icon" v-if="icon || $slots.icon">
			<slot name="icon">
				<i v-if="icon" class="fa" :class="'fa-' + icon"></i>
			</slot>
		</span>
		<label class="mint-buton-text">
			<slot></slot>
		</label>
	</button>
</template>

<script >
	export default {
		name: "mt-button",
		props: {
			icon: String,
			disabled: Boolean,
			nativeType: String,
			plain: Boolean,
			type: {
				type: String,
				default: "default",
				validator(value) {
					return [
						"default",
						"danger",
						"primary"
					].indexOf(value) > -1;
				}
			},
			size: {
				type: String,
				default: "normal",
				validator(value) {
					return [
						"small",
						"normal",
						"large"
					].indexOf(value) > -1;
				}
			}
		},
		methods: {
			handleClick(event) {
				this.$emit("click", event)
			}
		}
		
	}
</script>