<!-- **
 * mt-cell-swipe
 * @desc 类似 iOS 滑动 Cell 的效果
 * @module components/cell-swipe
 *
 * @example
 * <mt-cell-swipe
 *   :left=[
 *     {
 *       content: 'text',
 *       style: {color: 'white', backgroundColor: 'red'},
 *       handler(e) => console.log(123)
 *     }
 *   ]
 *   :right=[{ content: 'allowed HTML' }]>
 *   swipe me
 * </mt-cell-swipe>
 * -->

<style lang="scss">
	// @import "../../assets/css/variable/global";
	.mint-cell-swipe-button{
		display: inline-block;
		height: 100%;
		padding: 0 10px;
		line-height: 48px;
	}
	.mint-cell-swipe-buttongroup{
		height: 100%;
	}
	.mint-cell-swipe{
		position: relative;
	}
	.mint-cell-wrapper,
	.mint-cell-left,
	.mint-cell-right{
		transition: transform 150ms ease-in-out;
	}
</style>

<template>
	<x-cell class="mint-cell-swipe" ref="cell" :title="title" :icon="icon" :label="label" :to="to" :is-link="isLink" :value="value" v-clickoutside:touchstart="swipeMove" @click.native="swipeMove()" @touchstart.native="startDrag" @touchmove.native="onDrag" @touchend.native="endDrag">
		<div slot="right" class="mint-cell-swipe-buttongroup" ref="right">
			<a class="mint-cell-swipe-button" v-for="btn in right" v-html="btn.content" :style="btn.style" @click.stop="btn.handler && btn.handler(), swipeMove()"></a>
		</div>
		<div slot="left" class="mint-cell-swipe-buttongroup" ref="left">
			<a class="mint-cell-swipe-button" v-for="btn in left" v-html="btn.content" :style="btn.style" @click.stop="btn.handler && btn.handler(), swipeMove()"></a>
		</div>
		<slot></slot>
		<span slot="title" v-if="$slots.title">
			<slot name="title"></slot>
		</span>
		<span slot="icon" v-if="$slots.icon">
			<slot name="icon"></slot>
		</span>
	</x-cell>
</template>

<script>
	import XCell from "@/components/cell/cell.vue";
	import {once} from "../utils/dom";
	import Clickoutside from "../utils/clickoutside";
	export default {
		name: "mt-cell-swipe",
		components: {"x-cell": XCell},
		directives: {Clickoutside},
		props: {
			to: String,
			left: Array,
			right: Array,
			icon: String,
			title: String,
			label: String,
			isLink: Boolean,
			value: {}
		},
		data() {
			return {
				start: {x: 0, y: 0}
			}
		},
		methods: {
			resetSwipeStatus() {
				this.swiping = false;
				this.opened = true;
				this.offsetLeft = 0;
			},
			translate3d(offset) {
				return `translate3d(${offset}px, 0, 0)`;
			},
			swipeMove(offset = 0) {
				this.wrap.style.webkitTransform = this.translate3d(offset);
				this.rightWrapElm.style.webkitTransform = this.translate3d(this.rightWidth + offset);
				this.leftWrapElm.style.webkitTransform = this.translate3d(-this.leftWidth + offset);
				offset && (this.swiping = true);
			},
			swipeLeaveTransition(direction) {
				setTimeout(() => {
					this.swipeLeave = true;

					if (direction > 0 && -this.offsetLeft > this.rightWidth * 0.4) {
						// left
						this.swipeMove(-this.rightWidth);
						this.resetSwipeStatus();
						return;
					} else if (direction < 0 && this.offsetLeft > this.leftWidth * 0.4) {
						// right
						this.swipeMove(this.leftWidth);
						this.resetSwipeStatus();
						return;
					}

					this.swipeMove(0);
					once(this.wrap, "webkitTransitionEnd", _ => {
						this.wrap.style.webkitTransform = "";
						this.rightWrapElm.style.webkitTransform = this.rightDefaultTransform;
						this.leftWrapElm.style.webkitTransform = this.leftDefaultTransform;
						this.swipeLeave = false;
						this.swiping = false;
					});
				}, 0);
			},
			startDrag(event) {
				event = event.changedTouches ? event.changedTouches[0] : event;
				this.dragging = true;
				this.start.x = event.pageX;
				this.start.y = event.pageY;
			},
			onDrag(event) {
				if (this.opened) {
					!this.swiping && this.swipeMove(0);
					this.opened = false;
					return;
				}

				if (!this.dragging) return;
				let swiping;
				const e = event.changedTouches ? event.changedTouches[0] : event;
				const offsetTop = e.pageY - this.start.y;
				const offsetLeft = this.offsetLeft = e.pageX - this.start.x;

				if ((offsetLeft < 0 && -offsetLeft > this.rightWidth) ||
					(offsetLeft > 0 && offsetLeft > this.leftWidth) ||
					(offsetLeft > 0 && !this.leftWidth) ||
					(offsetLeft < 0 && !this.rightWidth)) {
					return;
				}

				const y = Math.abs(offsetTop);
				const x = Math.abs(offsetLeft);

				swiping = !(x < 5 || (x >= 5 && y >= x * 1.73));
				if (!swiping) return;
				event.preventDefault();

				this.swipeMove(offsetLeft);
			},
			endDrag() {
				if (!this.swiping) return;
				this.swipeLeaveTransition(this.offsetLeft > 0 ? -1 : 1);
			}
		},
		mounted() {
			this.wrap = this.$refs.cell.$el.querySelector(".mint-cell-wrapper");
			this.leftElm = this.$refs.left;
			this.rightElm = this.$refs.right;
			this.leftWrapElm = this.leftElm.parentNode;
			this.rightWrapElm = this.rightElm.parentNode;
			this.leftWidth = this.leftElm.getBoundingClientRect().width;
			this.rightWidth = this.rightElm.getBoundingClientRect().width;

			this.leftDefaultTransform = this.translate3d(-this.leftWidth - 1);
			this.rightDefaultTransform = this.translate3d(this.rightWidth);

			this.rightWrapElm.style.webkitTransform = this.rightDefaultTransform;
			this.leftWrapElm.style.webkitTransform = this.leftDefaultTransform;
		}
	}
</script>