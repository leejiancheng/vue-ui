<!-- **
 * mt-radio
 * @module components/radio
 * @desc 单选框列表，依赖 cell 组件
 *
 * @param {string[], object[]} options - 选项数组，可以传入 [{label: 'label', value: 'value', disabled: true}] 或者 ['ab', 'cd', 'ef']
 * @param {string} value - 选中值
 * @param {string} title - 标题
 * @param {string} [align=left] - checkbox 对齐位置，`left`, `right`
 *
 * @example
 * <mt-radio v-model="value" :options="['a', 'b', 'c']"></mt-radio>
 * -->

<style lang="scss" scoped>
	@import "../../assets/css/variable/global";
	.mint-radiolist{
		.mint-cell{
			padding: 0;
		}
	}
	.mint-radiolist-label{
		display: block;
		padding: 0 10px;
	}
	.mint-radiolist-title{
		display: block;
		margin: 8px;
		font-size: 12px;
		color: $radio-title-color;
	}
	.mint-radio{
		&.is-right{
			float: right;
		}
	}
	.mint-radio-label{
		vertical-align: middle;
		margin-left: 6px;
	}
	.mint-radio-input{
		display: none;
		&:checked{
			+ .mint-radio-core{
				background-color: $color-blue;
				border-color: $color-blue;
				&::after{
					background-color: $color-white;
					transform: scale(1);
				}
			}
		}
		&[disabled] + .mint-radio-core{
			background-color: $color-grey;
			border-color: #ccc;
		}
	}
	.mint-radio-core{
		position: relative;
		display: inline-block;
		box-sizing: border-box;
		width: 20px;
		height: 20px;
		background-color: $color-white;
		border-radius: 100%;
		vertical-align: middle;
		border: 1px solid #ccc;
		&::after{
			content: " ";
			position: absolute;
			top: 5px;
			left: 5px;
			width: 8px;
			height: 8px;
			border-radius: 100%;
			transform: scale(0);
			transition: transform 0.2;
		}
	}
</style>

<template>
	<div class="mint-radiolist" @change="$emit('change', currentValue)">
		<label class="mint-radiolist-title" v-text="title"></label>
		<x-cell v-for="option in options">
			<label class="mint-radiolist-label" slot="title">
				<span class="mint-radio" :class="{'is-right': align === 'right'}">
					<input class="mint-radio-input" type="radio" v-model="currentValue" :disabled="option.disabled" :value="option.value || option">
					<span class="mint-radio-core"></span>
				</span>
				<span class="mint-radio-label" v-text="option.label || option"></span>
			</label>
		</x-cell>
	</div>
</template>

<script>
	import XCell from "@/components/cell/cell.vue";
	export default {
		name: "mt-radio",
		components: {"x-cell": XCell},
		props: {
			title: String,
			align: String,
			options: {
				type: Array,
				required: true
			},
			value: String
		},
		data() {
			return {
				currentValue: this.value
			}
		},
		watch: {
			value(val) {
				this.currentValue = val;
			},
			currentValue(val) {
				this.$emit("input", val);
			}
		}
		
	}
</script>