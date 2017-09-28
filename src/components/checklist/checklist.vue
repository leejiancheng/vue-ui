<!-- **
 * mt-checklist
 * @module components/checklist
 * @desc 复选框列表，依赖 cell 组件
 *
 * @param {(string[]|object[])} options - 选项数组，可以传入 [{label: 'label', value: 'value', disabled: true}] 或者 ['ab', 'cd', 'ef']
 * @param {string[]} value - 选中值的数组
 * @param {string} title - 标题
 * @param {number} [max] - 最多可选的个数
 * @param {string} [align=left] - checkbox 对齐位置，`left`, `right`
 *
 *
 * @example
 * <mt-checklist :v-model="value" :options="['a', 'b', 'c']"></mt-checklist>
 * -->

<style lang="scss" scoped>
	@import "../../assets/css/variable/global";
	.mint-checklist{
		.mint-cell{
			padding: 0;
		}
		&.is-limit{
			.mint-checkbox-core:not(:checked) {
				background-color: $color-grey;
				border-color: $color-grey;
			}
		}
	}
	.mint-checklist-label{
		display: block;
		padding: 0 10px;
	}
	.mint-checklist-title{
		display: block;
		margin: 8px;
		font-size: 12px;
		color: $checklist-title-color;
	}
	.mint-checkbox{
		&.is-right{
			float: right;
		}
	}
	.mint-checkbox-label{
		margin-left: 6px;
		vertical-align: middle;
	}
	.mint-checkbox-input{
		display: none;
		&:checked{
			+ .mint-checkbox-core{
				background-color: $color-blue;
				border-color: $color-blue;
				&::after{
					border-color: $color-white;
					transform: rotate(45deg) scale(1);
				}
			}
		}
		&[disabled] + .mint-checkbox-core{
			background-color: $color-grey;
			border-color: #ccc;
		}
	}
	.mint-checkbox-core{
		position: relative;
		display: inline-block;
		width: 20px;
		height: 20px;
		border: 1px solid #ccc;
		border-radius: 100%;
		background-color: $color-white;
		vertical-align: middle;
		&::after{
			content: " ";
			position: absolute;
			top: 3px;
			left: 6px;
			width: 4px;
			height: 8px;
			border: 2px solid transparent;
			border-top: 0;
			border-left: 0;
			transform: rotate(45deg) scale(0);
			transition: transform 0.2s;
		}
	}
</style>

<template>
	<div class="mint-checklist" :class="{'is-limit': max <= currentValue.length}" @change="$emit('change', currentValue)">
		<label class="mint-checklist-title" v-text="title"></label>
		<x-cell v-for="option in options">
			<label class="mint-checklist-label" slot="title">
				<span class="mint-checkbox" :class="{'is-right': align === 'right'}">
					<input class="mint-checkbox-input" type="checkbox" v-model="currentValue" :disabled="option.disabled" :value="option.value || option">
					<span class="mint-checkbox-core"></span>
				</span>
				<span class="mint-checkbox-label" v-text="option.label || option"></span>
			</label>
		</x-cell>
	</div>
</template>

<script>
	import XCell from "@/components/cell/cell.vue";
	export default {
		name: "mt-switch",
		components: {"x-cell": XCell},
		props: {
			max: Number,
			title: String,
			align: String,
			options: {
				type: Array,
				requried: true
			},
			value: Array
		},
		data() {
			return {
				currentValue: this.value
			};
		},
		computed: {
			limit() {
				return this.max < this.currentValue.length;
			}
		},
		watch: {
			value(val) {
				this.currentValue = val;
			},
			currentValue(val) {
				if (this.limit) val.pop();
				this.$emit("input", val);
			}
		}
	}
</script>