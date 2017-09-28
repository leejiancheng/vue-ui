<!-- **

 * -->

<style lang="scss">
	// @import "../../assets/css/variable/global";
	.picker-slot{
		position: relative;
		max-height: 100%;
		font-size: 18px;
		overflow: hidden;
		&.picker-slot-left{
			text-align: left;
		}
		&.picker-slot-center{
			text-align: center;
		}
		&.picker-slot-right{
			text-align: right;
		}
		&.picker-slot-divider{
			display: flex;
			align-items: center;
			color: #000;
		}
	}
	.picker-slot-wrapper{
		transition-duration: 0.3s;
		transition-timing-function: ease-out;
		backface-visibility: hidden;
		&.dragging,
		&.dragging .picker-item{
			transition-duration: 0s;
		}
	}
	.picker-item{
		position: relative;
		top: 0;
		left: 0;
		width: 100%;
		height: 36px;
		padding: 0 10px;
		line-height: 36px;
		color: #707274;
		box-sizing: border-box;
		transition-duration: 0.3s;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		backface-visibility: hidden;
		&.picker-item-far{
			pointer-events: none;
		}
		&.picker-selected{
			color: #000;
			transform: translate3d(0, 0, 0) rotateX(0);
		}
	}
	.picker-slot-absolute{
		.picker-item{
			position: absolute;
		}
	}
	.picker-3d{
		.picker-items{
			perspective: 700px;
			overflow: hidden;
		}
		.picker-item,
		.picker-slot,
		.picker-slot-wrapper{
			transform-style: preserve-3d;
		}
		.picker-slot{
			overflow: visible;
		}
		.picker-item{
			transform-origin: center center;
			backface-visibility: hidden;
			transition-timing-function: ease-out;
		}
	}
</style>

<template>
	<div class="picker-slot" :class="classNames" :style="flexStyle">
		<div class="picker-slot-wrapper" :class="{dragging: dragging}" :style="{height: contentHeight + 'px'}" v-if="!divider" ref="wrapper">
			<div class="picker-item" v-for="itemValue in mutatingValues" :class="{'picker-selected': itemValue === currentValue}" :style="{height: itemHeight + 'px', lineHeight: itemHeight + 'px'}">
				{{typeof itemValue === "object" && itemValue[valueKey] ? itemValue[valueKey] : itemValue}}
			</div>
		</div>
		<div v-if="divider">{{content}}</div>
	</div>
</template>

<script>
	
	import draggable from "./draggable";
	import translateUtil from "./translate";
	import {once, addClass, removeClass} from "../utils/dom";
	import emitter from "../utils/emitter";
	import Vue from "vue";
	// if (!Vue.prototype.$isServer) {
	// 	require('raf.js');
	// }

	const rotateElement = (element, angle) => {
		if (!element) return;
		let transformProperty = translateUtil.transformProperty;

		element.style[transformProperty] = element.style[transformProperty].replace(/rotateX\(.+?deg\)/gi, '') + ` rotateX(${angle}deg)`;
	};

	const ITEM_HEIGHT = 36;
	const VISIBLE_ITEMS_ANGLE_MAP = {
		3: -45,
		5: -20,
		7: -15
	};

	export default {
		name: "picker-slot",
		mixins: [emitter],
		props: {
			values: {
				type: Array,
				default() {
					return [];
				}
			},
			value: {},
			visibleItemCount: {
				type: Number,
				default: 5
			},
			valueKey: String,
			rotateEffect: {
				type: Boolean,
				default: false
			},
			divider: {
				type: Boolean,
				default: false
			},
			textAlign: {
				type: String,
				default: "center"
			},
			flex: {},
			className: {},
			content: {},
			itemHeight: {
				type: Number,
				default: ITEM_HEIGHT
			},
			defaultIndex: {
				type: Number,
				default: 0,
				require: false
			}
		},
		data() {
			return {
				currentValue: this.value,
				mutatingValues: this.values,
				dragging: false,
				animationFrameId: null
			};
		},
		computed: {
			flexStyle() {
				return {
					"-webkit-box-flex": this.flex,
					"-moz-box-flex": this.flex,
					"-ms-flex": this.flex,
					"flex": this.flex
				};
			},
			classNames() {
				const PREFIX = "picker-slot-";
				let resultArray = [];

				if (this.rotateEffect) {
					resultArray.push(PREFIX + "absolute");
				}

				let textAlign = this.textAlign || "center";
				resultArray.push(PREFIX + textAlign);

				if (this.divider) {
					resultArray.push(PREFIX + "divider");
				}

				if (this.className) {
					resultArray.push(this.className);
				}
				return resultArray.join(" ");
			},
			contentHeight() {
				return this.itemHeight * this.visibleItemCount;
			},
			valueIndex() {
				return this.mutatingValues.indexOf(this.currentValue);
			},
			dragRange() {
				let values = this.mutatingValues;
				let visibleItemCount = this.visibleItemCount;
				let itemHeight = this.itemHeight;

				return [ -itemHeight * (values.length - Math.ceil(visibleItemCount / 2)), itemHeight * Math.floor(visibleItemCount / 2) ];
			}
		},
		watch: {
			values(val) {
				this.mutatingValues = val;
			},
			mutatingValues(val) {
				if (this.valueIndex === -1) {
					this.currentValue = (val || [])[0];
				}
				if (this.rotateEffect) {
					this.$nextTick(() => {
						this.doOnValuesChange();
					});
				}
			},
			currentValue(val) {
				this.doOnValueChange();
				if (this.rotateEffect) {
					this.planUpdateRotate();
				}
				this.$emit("input", val);
				this.dispatch("picker", "slotValueChange", this);
			},
			defaultIndex(val) {
				if ((this.mutatingValues[val] !== undefined) && (this.mutatingValues.length >= val + 1)) {
					this.currentValue = this.mutatingValues[val];
				}
			}
		},
		methods: {
			value2Translate(value) {
				let values = this.mutatingValues;
				let valueIndex = values.indexOf(value);
				let offset = Math.floor(this.visibleItemCount / 2);
				let itemHeight = this.itemHeight;

				if (valueIndex !== -1) {
					return (valueIndex - offset) * -itemHeight;
				}
			},
			translate2Value(translate) {
				let itemHeight = this.itemHeight;
				translate = Math.round(translate / itemHeight) * itemHeight;
				let index = -(translate - Math.floor(this.visibleItemCount / 2) * itemHeight) / itemHeight;

				return this.mutatingValues[index];
			},
			updateRotate(currentTranslate, pickerItems) {
				if (this.divider) return;
				let dragRange = this.dragRange;
				let wrapper = this.$refs.wrapper;

				if (!pickerItems) {
					pickerItems = wrapper.querySelectorAll(".picker-item");
				}

				if (currentTranslate === undefined) {
					currentTranslate = translateUtil.getElementTranslate(wrapper).top;
				}

				let itemsFit = Math.ceil(this.visibleItemCount / 2);
				let angleUnit = VISIBLE_ITEMS_ANGLE_MAP[this.visibleItemCount] || -20;

				[].forEach.call(pickerItems, (item, index) => {
					let itemOffsetTop = index * this.itemHeight;
					let translateOffset = dragRange[1] - currentTranslate;
					let itemOffset = itemOffsetTop - translateOffset;
					let percentage = itemOffset / this.itemHeight;

					let angle = angleUnit * percentage;

					if (angle > 180) angle = 180;
					if (angle < -180) angle = -180;

					rotateElement(item, angle);

					if (Math.abs(percentage) > itemsFit) {
						addClass(item, "picker-item-far");
					} else {
						removeClass(item, "picker-item-far");
					}
				});
			},
			planUpdateRotate() {
				let el = this.$refs.wrapper;
				cancelAnimationFrame(this.animationFrameId);

				this.animationFrameId = requestAnimationFrame(() => {
					this.updateRotate();
				});

				once(el, translateUtil.transitionEndProperty, () => {
					cancelAnimationFrame(this.animationFrameId);
					this.animationFrameId = null;
				});
			},
			initEvents() {
				let el = this.$refs.wrapper;
				let dragState = {};

				let velocityTranslate, prevTranslate, pickerItems;

				draggable(el, {
					start: (event) => {
						cancelAnimationFrame(this.animationFrameId);
						this.animationFrameId = null;
						dragState = {
							range: this.dragRange,
							start: new Date(),
							startLeft: event.pageX,
							startTop: event.pageY,
							startTranslateTop: translateUtil.getElementTranslate(el).top
						};
						pickerItems = el.querySelectorAll(".picker-item");
					},
					drag: (event) => {
						this.dragging = true;

						dragState.left = event.pageX;
						dragState.top = event.pageY;

						let deltaY = dragState.top - dragState.startTop;
						let translate = dragState.startTranslateTop + deltaY;

						translateUtil.translateElement(el, null, translate);

						velocityTranslate = translate - prevTranslate || translate;
						prevTranslate = translate;

						if (this.rotateEffect) {
							this.updateRotate(prevTranslate, pickerItems);
						}
					},
					end: () => {
						if (this.dragging) {
							this.dragging = false;

							let momentumRatio = 7;
							let currentTranslate = translateUtil.getElementTranslate(el).top;
							let duration = new Date() - dragState.start;
							let momentumTranslate;

							if (duration < 300) {
								momentumTranslate = currentTranslate + velocityTranslate * momentumRatio;
							}

							let dragRange = dragState.range;

							this.$nextTick(() => {
								let translate;
								let itemHeight = this.itemHeight;
								if (momentumTranslate) {
									translate = Math.round(momentumTranslate / itemHeight) * itemHeight;
								} else {
									translate = Math.round(currentTranslate / itemHeight) * itemHeight;
								}

								translate = Math.max(Math.min(translate, dragRange[1]), dragRange[0]);

								translateUtil.translateElement(el, null, translate);

								this.currentValue = this.translate2Value(translate);

								if (this.rotateEffect) {
									this.planUpdateRotate();
								}
							});
						}
						dragState = {};
					}
				});
			},
			doOnValueChange() {
				let value = this.currentValue;
				let wrapper = this.$refs.wrapper;

				translateUtil.translateElement(wrapper, null, this.value2Translate(value));
			},
			doOnValuesChange() {
				let el = this.$el;
				let items = el.querySelectorAll(".picker-item");
				[].forEach.call(items, (item, index) => {
					translateUtil.translateElement(item, null, this.itemHeight * index);
				});
				if (this.rotateEffect) {
					this.planUpdateRotate();
				}
			}
		},
		mounted() {
			this.ready = true;
			this.$emit("input", this.currentValue);

			if (!this.divider) {
				this.initEvents();
				this.doOnValueChange();
			}

			if (this.rotateEffect) {
				this.doOnValuesChange();
			}
		}
	}
</script>