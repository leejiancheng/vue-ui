<!-- **
 * mt-picker
 * @module components/picker
 * @desc 选择器，支持多 slot 联动。
 * ********** API **********
 * @param {Array} [slots=[]] - slot 对象数组
 * @param {String} [valueKey=''] - 当 values 为对象数组时，作为文本显示在 Picker 中的对应字段的字段名
 * @param {Boolean} [showToolbar=false] - 是否在组件顶部显示一个 toolbar，内容自定义
 * @param {Number} [visibleItemCount=5] - slot 中可见备选值的个数
 * @param {Number} [itemHeight=36] - 每个 slot 的高度

 * ********** 绑定到 slots 属性的数组由对象组成，每个对象都对应一个 slot，它们有如下键名 **********
 * @param [divider] - 对应 slot 是否为分隔符
 * @param [content] - 分隔符 slot 的显示文本
 * @param [values] - 对应 slot 的备选值数组。若为对象数组，则需在 mt-picker 标签上设置 value-key 属性来指定显示的字段名
 * @param [defaultIndex] - 对应 slot 初始选中值，需传入其在 values 数组中的序号，默认为 0
 * @param [textAlign] - 对应 slot 的对齐方式
 * @param [flex] - 对应 slot CSS 的 flex 值
 * @param [className] - 对应 slot 的类名

  * ********** Slot **********
 * @param [] - 当 showToolbar 为 true 时，toolbar 中的内容
 * ********** Events **********
 * @param {Function} [expand] - 按钮开始展开
 * @param {Function} [expanded] - 按钮完全展开（动画效果执行结束）
 * @param {Function} [collapse] - 按钮开始收起
 *
 * @example
 * <mt-picker :slots="slots" @change="onValuesChange"></mt-picker>
 * -->

<style lang="scss" scoped>
	// @import "../../assets/css/variable/global";
	.mint-picker{
		overflow: hidden;
	}
	.mint-picker-toolbar{
		height: 40px;
	}
	.mint-picker-items{
		position: relative;
		display: flex;
		justify-content: center;
		padding: 0;
		text-align: right;
		font-size: 24px;
	}
	.mint-picker-center-highlight{
		position: absolute;
		top: 50%;
		left: 0;
		box-sizing: border-box;
		width: 100%;
		margin-top: -18px;
		pointer-events: none;
	}
	.mint-picker-center-highlight::before,
	.mint-picker-center-highlight::after{
		content: "";
		position: absolute;
		display: block;
		width: 100%;
		height: 1px;
		background-color: #eaeaea;
		z-index: 15;
		transform: scaleY(0.5);
	}
	.mint-picker-center-highlight::before{
		top: 0;
		right: auto;
		bottom: auto;
		left: 0;
	}
	.mint-picker-center-highlight::after{
		top: auto;
		right: auto;
		bottom: 0;
		left: 0;
	}
</style>

<template>
	<div class="mint-picker" :class="{'picker-3d': rotateEffect}">
		<div class="mint-picker-toolbar" v-if="showToolbar">
			<slot></slot>
		</div>
		<div class="mint-picker-items">
			<picker-slot v-for="slot in slots" :valueKey="valueKey" :values="slot.values || []" :text-align="slot.textAlign || 'center'" :visible-item-count="visibleItemCount" :class-name="slot.calssName" :flex="slot.flex" v-model="values[slot.valueIndex]" :rotate-effect="rotateEffect" :divider="slot.divider" :content="slot.content" :itemHeight="itemHeight" :default-index="slot.defaultIndex"></picker-slot>
			<div class="mint-picker-center-highlight" :style="{height: itemHeight +'px', marginTop: -itemHeight / 2 + 'px'}"></div>
		</div>
	</div>
</template>

<script>
	import PickerSlot from "./picker-slot.vue";
	export default {
		name: "mt-picker",
		componentName: "picker",
		components: {"picker-slot": PickerSlot},
		props: {
			slots: {
				type: Array
			},
			showToolbar: {
				type: Boolean,
				default: false
			},
			visibleItemCount: {
				type: Number,
				default: 5
			},
			valueKey: String,
			rotateEffect: {
				type: Boolean,
				default: false
			},
			itemHeight: {
				type: Number,
				default: 36
			}
		},
		computed: {
			values() {
				let slots = this.slots || [];
				let values = [];
				slots.forEach(slot => {
					if (!slot.divider) {
						values.push(slot.value);
					}
				});
				return values;
			},
			slotCount() {
				let slots = this.slots || [];
				let result = 0;
				slots.forEach(slot => {
					if (!slot.divider) {
						result++;
					}
				});
				return result;
			}
		},
		created() {
			this.$on("slotValueChange", this.slotValueChange);
			let slots = this.slots || [];
			let values = [];
			let valueIndexCount = 0;
			slots.forEach(slot => {
				if (!slot.divider) {
					slot.valueIndex = valueIndexCount++;
					values[slot.valueIndex] = (slot.values || [])[slot.defaultIndex || 0];
					this.slotValueChange();
				}
			});
		},
		methods: {
			slotValueChange() {
				this.$emit("change", this, this.values);
			},
			getSlot(slotIndex) {
				let slots = this.slots || [];
				let count = 0;
				let target;
				let children = this.$children.filter(child => child.$options.name === "picker-slot");

				slots.forEach((slot, index) => {
					if (!slot.divider) {
						if (slotIndex === count) {
							target = children[index];
						}
						count++;
					}
				});
				return target;
			},
			getSlotValue(index) {
				let slot = this.getSlot(index);
				if (slot) {
					return slot.value;
				}
				return null;
			},
			setSlotValue(index, value) {
				let slot = this.getSlot(index);
				if (slot) {
					slot.currentValue = value;
				}
			},
			getSlotValues(index) {
				let slot = this.getSlot(index);
				if (slot) {
					return slot.mutatingValues;
				}
				return null;
			},
			setSlotValues(index, values) {
				let slot = this.getSlot(index);
				if (slot) {
					slot.mutatingValues = values;
				}
			},
			getValues() {
				return this.values;
			},
			setValues(values) {
				let slotCount = this.slotCount;
				values = values || [];
				if (slotCount !== values.length) {
					throw new Error("values length is not equal slot count.");
				}
				values.forEach((value, index) => {
					this.setSlotValue(index, value);
				});
			}
		}
	}
</script>