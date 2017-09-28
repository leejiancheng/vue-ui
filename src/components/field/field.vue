<!-- **
 * mt-field
 * @desc 编辑器，依赖 cell
 * @module components/field
 *
 * @param {string} [type=text] - field 类型，接受 text, textarea 等
 * @param {string} [label] - 标签
 * @param {string} [rows] - textarea 的 rows
 * @param {string} [placeholder] - placeholder
 * @param {string} [disabled] - disabled
 * @param {string} [readonly] - readonly
 * @param {string} [state] - 表单校验状态样式，接受 error, warning, success
 *
 * @example
 * <mt-field v-model="value" label="用户名"></mt-field>
 * <mt-field v-model="value" label="密码" placeholder="请输入密码"></mt-field>
 * <mt-field v-model="value" label="自我介绍" placeholder="自我介绍" type="textarea" rows="4"></mt-field>
 * <mt-field v-model="value" label="邮箱" placeholder="成功状态" state="success"></mt-field>
 * -->

<style lang="scss">
	@import "../../assets/css/variable/global";
	.mint-field{
		display: flex;
		.mint-cell-title{
			width: 105px;
			flex: none;
		}
		.mint-cell-value{
			display: flex;
			flex: 1;
			color: inherit;
		}
		&.is-nolabel{
			.mint-cell-title{
				display: none;
			}
		}
		&.is-textarea{
			align-items: inherit;
			.mint-cell-title{
				padding: 10px 0;
			}
			.mint-cell-value{
				padding: 5px 0;
			}
		}
	}
	.mint-field-core{
		appearance: none;
		width: 100%;
		flex: 1;
		outline: 0;
		line-height: 1.6;
		border: 0;
		border-radius: 0;
		font-size: inherit;
	}
	.mint-field-clear{
		opacity: 0.2;
	}
	.mint-field-state{
		color: inherit;
		margin-left: 20px;
		.mintui{
			font-size: 20px;
		}
		&.is-default{
			margin-left: 0;
		}
		&.is-error{
			color: $error-color;
		}
		&.is-warning{
			color: $warning-color;
		}
		&.is-success{
			color: $success-color;
		}
	}
	.mint-field-other{
		position: relative;
		top: 0;
		right: 0;
	}
</style>

<template>
	<x-cell class="mint-field" :class="[{'is-textarea': type === 'textarea', 'is-nolabel': !label}]" :title="label" v-clickoutside="doCloseActive">
		<textarea ref="textarea" class="mint-field-core" @change="$emit('change', currentValue)" :placeholder="placeholder" v-if="type === 'textarea'" :rows="rows" :disabled="disabled" :readonly="readonly" v-model="currentValue"></textarea>
		<input ref="input" class="mint-field-core" @change="$emit('change', currentValue)" :placeholder="placeholder" :number="type === 'number'" v-else :disabled="disabled" :readonly="readonly" :value="currentValue" :type="type" @focus="active = true"  @input="handleInput">
		<div class="mint-field-clear" @click="handleClear" v-if="!disabledClear" v-show="currentValue && type !== 'textarea' && active">
			<i class="mintui mintui-field-error"></i>
		</div>
		<span class="mint-field-state" v-if="state" :class="['is-' + state]">
			<i class="mintui" :class="['mintui-field-' + state]"></i>
		</span>
		<div class="mint-field-other">
			<slot></slot>
		</div>
	</x-cell>
</template>

<script>
	import XCell from "@/components/cell/cell.vue";
	import Clickoutside from "@/components/utils/clickoutside.js";
	export default {
		name: "mt-field",
		directives: {Clickoutside},
		components: {"x-cell": XCell},
		props: {
			type: {
				type: String,
				default: "text"
			},
			rows: String,
			label: String,
			placeholder: String,
			readonly: Boolean,
			disabled: Boolean,
			disabledClear: Boolean,
			state: {
				type: String,
				default: "default"
			},
			value: {},
			attr: Object
		},
		data() {
			return {
				active: false,
				currentValue: this.value
			}
		},
		watch: {
			value(val) {
				this.currentValue = val;
			},
			currentValue(val) {
				this.$emit("input", val);
			},
			attr: {
				immediate: true,
				handler(attrs) {
					this.$nextTick(() => {
						const target = [this.$refs.input, this.$refs.textarea];
						target.forEach(el => {
							if (!el || !attrs) return;
							Object.keys(attrs).map(name => el.setAttribute(name, attrs[name]))
						});
					});
				}
			}
		},
		methods: {
			doCloseActive() {
				this.active = false;
			},
			handleInput(event) {
				this.currentValue = event.target.value;
			},
			handleClear() {
				if (this.disabled || this.readonly) return;
				this.currentValue = "";
			}
		}
	}
</script>