<!-- **
 * mt-range
 * @module components/range
 * @desc 滑块
 * ********** API **********
 * @param {Number} [value] - 滑块的值
 * @param {Number} [min=0] - 最小值
 * @param {Number} [max=100] - 最大值
 * @param {Number} [step=1] - 步长
 * @param {Boolean} [disabled=false] - 是否禁用
 * @param {Number} [barHeight=1] - 滑槽的线宽（像素）
 * ********** Slot **********
 * @param [start] - 滑块左侧 DOM
 * @param [end] - 滑块右侧 DOM
 *
 * @example
 * <mt-range v-model="rangeValue"></mt-range>
 * -->

<style lang="scss">
	@import "../../assets/css/variable/global";
	.mint-range{
		position: relative;
		display: flex;
		height: 30px;
		line-height: 30px;
		& > *{
			display: flex;
		}
		& *[slot=start]{
			margin-right: 5px;
		}
		& *[slot=end]{
			margin-left: 5px;
		}
		&.mint-range--disabled{
			opacity: 0.5;
		}
	}
	.mint-range-content{
		position: relative;
		flex: 1;
		margin-right: 30px;
	}
	.mint-range-runway{
		position: absolute;
		top: 50%;
		left: 0;
		right: -30px;
		transform: translateY(-50%);
		border-top-color: #a9acb1;
		border-top-style: solid;
	}
	.mint-range-thumb{
		position: absolute;
		top: 0;
		left: 0;
		width: 30px;
		height: 30px;
		border-radius: 100%;
		cursor: move;
		background-color: #fff;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
	}
	.mint-range-progress{
		position: absolute;
		top: 50%;
		display: block;
		width: 0;
		background-color: #26a2ff;
		transform: translateY(-50%);
	}
</style>

<template>
	<div class="mint-range" :class="{'mint-range--disabled': disabled}">
		<slot name="start"></slot>
		<div class="mint-range-content" ref="content">
			<div class="mint-range-runway" :style="{'border-top-width': barHeight + 'px'}"></div>
			<div class="mint-range-progress" :style="{width: progress + '%', height: barHeight + 'px'}"></div>
			<div class="mint-range-thumb" ref="thumb" :style="{left: progress + '%'}"></div>
		</div>
		<slot name="end"></slot>
	</div>
</template>

<script>
	import draggable from "./draggable";
	export default {
		name: "mt-range",
		props: {
			min: {
				type: Number,
				default: 0
			},
			max: {
				type: Number,
				default: 100
			},
			step: {
				type: Number,
				default: 1
			},
			disabled: {
				type: Boolean,
				default: false
			},
			value: {
				type: Number
			},
			barHeight: {
				type: Number,
				default: 1
			}
		},
		computed: {
			progress() {
				const value = this.value;
				if (typeof value === "undefined" || value === null) return 0;
				return Math.floor((value - this.min) / (this.max - this.min) * 100); 
			}
		},
		mounted() {
			const thumb = this.$refs.thumb;
			const content = this.$refs.content;

			const getThumbPosition = () => {
				const contentBox = content.getBoundingClientRect();
				const thumbBox = thumb.getBoundingClientRect();

				return {
					left: thumbBox.left - contentBox.left,
					top: thumbBox.top - contentBox.top,
					thumbBoxLeft: thumbBox.left
				};
			};

			let dragState = {};

			draggable(thumb, {
				start: (event) => {
					if (this.disabled) return;
					const position = getThumbPosition();
					const thumbClickDetalX = event.clientX - position.thumbBoxLeft;

					dragState = {
						thumbStartLeft: position.left,
						thumbStartTop: position.top,
						thumbClickDetalX: thumbClickDetalX
					};
				},
				drag: (event) => {
					if (this.disabled) return;

					const contentBox = content.getBoundingClientRect();
					const deltaX = event.pageX - contentBox.left - dragState.thumbStartLeft - dragState.thumbClickDetalX;
					const stepCount = Math.ceil((this.max - this.min) / this.step);
					const newPosition = (dragState.thumbStartLeft + deltaX) - (dragState.thumbStartLeft + deltaX) % (contentBox.width / stepCount);

					let newProgress = newPosition / contentBox.width;

					if (newProgress < 0) {
						newProgress = 0;
					} else if (newProgress > 1) {
						newProgress = 1;
					}

					this.$emit('input', Math.round(this.min + newProgress * (this.max - this.min)));
				},
				end: () => {
					if (this.disabled) return;

					this.$emit("change", this.value);
					dragState = {};
				}
			});
		}
	};
</script>