<!-- **
 * mt-switch
 * @module components/switch
 * @desc 切换按钮
 * @param {boolean} [value] - 绑定值，支持双向绑定
 * @param {slot} - 显示内容
 *
 * @example
 * <mt-progress :value="20" :barHeight="4"></mt-progress>
 * -->

<style lang="scss">
	@import "../../assets/css/variable/global";
	.mint-switch{
		display: flex;
		align-items: center;
		position: relative;
		*{
			pointer-events: none;
		}
	}
	.mint-switch-label{
		display: inline-block;
		margin-left: 10px;
		&:empty{
			margin-left: 0;
		}
	}
	.mint-switch-core{
		display: inline-block;
		position: relative;
		width: 52px;
		height: 32px;
		border: 1px solid $color-grey;
		border-radius: 16px;
		box-sizing: border-box;
		background: $color-grey;
		&::after,
		&::before{
			content: " ";
			position: absolute;
			top: 0;
			left: 0;
			transition: transform 0.3s;
			border-radius: 15px;
		}
		&::after{
			width: 30px;
			height: 30px;
			background-color: $color-white;
			box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
		}
		&::before{
			width: 50px;
			height: 30px;
			background-color: #fdfdfd;
		}
	}
	.mint-switch-input{
		display: none;
		&:checked{
			+ .mint-switch-core{
				border-color: $color-blue;
				background-color: $color-blue;
				&::before{
					transform: scale(0);
				}
				&::after{
					transform: translateX(20px);
				}
			}
		}
	}
</style>

<template>
	<label class="mint-switch">
		<input class="mint-switch-input" :disabled="disabled" type="checkbox" v-model="currentValue" @change="$emit('change', currentValue)">
		<span class="mint-switch-core"></span>
		<div class="mint-switch-label">
			<slot></slot>
		</div>
	</label>
</template>

<script>
	export default {
		name: "mt-switch",
		props: {
			value: Boolean,
			disabled: {
				type: Boolean,
				default: false
			}
		},
		computed: {
			currentValue: {
				get() {
					return this.value;
				},
				set(val) {
					this.$emit("input", val)
				}
			}
		}
	}
</script>