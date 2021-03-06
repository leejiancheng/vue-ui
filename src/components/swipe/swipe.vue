<!-- **
 * mt-swipe
 * @module components/swipe
 * @desc 轮播图，搭配 swipe-item 使用
 * ********** API **********
 * @param {Number} [speed=300] - 动画持时（毫秒）
 * @param {Number} [auto=3000] - 自动播放的时间间隔（毫秒）
 * @param {Number} [defaultIndex=0] - 初始显示的轮播图的索引
 * @param {Boolean} [continuous=true] - 是否可以循环播放
 * @param {Boolean} [showIndicators=true] - 是否显示 indicators
 * @param {Boolean} [prevent=false] - 是否在 touchstart 事件触发时阻止事件的默认行为。设为 true 可提高运行在低版本安卓浏览器时的性能
 * @param {Boolean} [stopPropagation=false] - 是否在 touchstart 事件触发时阻止冒泡。
 * ********** Slot **********
 * @param [mt-swipe] - 一个或多个 mt-swipe-item 组件
 * @param [mt-swipe-item] - 单个轮播图的内容
 *
 * @example
 * <mt-swipe :auto="4000">
 * 	 <mt-swipe-item>1</mt-swipe-item>
 * 	 <mt-swipe-item>2</mt-swipe-item>
 * 	 <mt-swipe-item>3</mt-swipe-item>
 * </mt-swipe>
 * -->

<style lang="scss">
	// @import "../../assets/css/variable/global";
	.mint-swipe{
		position: relative;
		height: 100%;
		overflow: hidden;
	}
	.mint-swipe-items-wrap{
		position: relative;
		height: 100%;
		overflow: hidden;
		> div{
			position: absolute;
			display: none;
			width: 100%;
			height: 100%;
			transform: translateX(-100%);
			&.is-active{
				display: block;
				transform: none;
			}
		}
	}
	.mint-swipe-indicators{
		position: absolute;
		left: 50%;
		bottom: 10px;
		transform: translateX(-50%);
	}
	.mint-swipe-indicator{
		display: inline-block;
		width: 8px;
		height: 8px;
		border-radius: 100%;
		background-color: #000;
		opacity: 0.2;
		margin: 0 3px;
		&.is-active{
			background-color: #fff;
		}
	}
</style>

<template>
	<div class="mint-swipe">
		<div class="mint-swipe-items-wrap" ref="wrap">
			<slot></slot>
		</div>
		<div class="mint-swipe-indicators" v-show="showIndicators">
			<div class="mint-swipe-indicator" :class="{'is-active': $index === index}" v-for="(page, $index) in pages"></div>
		</div>
	</div>
</template>

<script>
	import {once, addClass, removeClass} from "../utils/dom";
	export default {
		name: "mt-swipe",
		props: {
			speed: {
				type: Number,
				default: 300
			},
			defaultIndex: {
				type: Number,
				default: 0
			},
			auto: {
				type: Number,
				default: 3000
			},
			continuous: {
				type: Boolean,
				default: true
			},
			showIndicators: {
				type: Boolean,
				default: true
			},
			noDragWhenSingle: {
				type: Boolean,
				default: false
			},
			prevent: {
				type: Boolean,
				default: false
			},
			stopPropagation: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				ready: false,
				dragging: false,
				ready: false,
				userScrolling: false,
				animating: false,
				index: 0,
				pages: [],
				timer: null,
				reInitTimer: null,
				noDrag: false,
				isDone: false
			};
		},
		watch: {
			index(newIndex) {
				this.$emit("change", newIndex);
			}
		},
		created() {
			this.dragState = {};
		},
		methods: {
			swipeItemCreated() {
				if (!this.ready) return;

				clearTimeout(this.reInitTimer);

				this.reInitTimer = setTimeout(() => {
					this.reInitPages();
				}, 100)
			},
			swipeItemDestroyed() {
				if (!this.ready) return;
				
				clearTimeout(this.reInitTimer);

				this.reInitTimer = setTimeout(() => {
					this.reInitPages();
				}, 100);	
			},
			translate(element, offset, speed, callback) {
				if (speed) {
					this.animating = true;
					element.style.webkitTransition = `-webkit-transform ${speed}ms ease-in-out`;
					setTimeout(() => {
						element.style.webkitTransform = `translate3d(${offset}px, 0, 0)`;
					}, 50)

					let called = false;

					let transitionEndCallback = () => {
						if (called) return;

						called = true;
						this.animating = false;
						element.style.webkitTransition = "";
						element.style.webkitTransform = "";

						if (callback) {
							callback.apply(this, arguments);
						}
					};

					once(element, "webkitTransitionEnd", transitionEndCallback);
					setTimeout(transitionEndCallback, speed + 100);
				} else {
					element.style.webkitTransition = "";
					element.style.webkitTransform = `translate3d(${offset}px, 0, 0)`;
				}
			},
			reInitPages() {
				let children = this.$children;
				this.noDrag = children.length === 1 && this.noDragWhenSingle;

				let pages = [];
				let intDefaultIndex = Math.floor(this.defaultIndex);
				let defaultIndex = (intDefaultIndex >= 0 && intDefaultIndex < children.length) ? intDefaultIndex : 0;

				this.index = defaultIndex;

				children.forEach((child, index) => {
					pages.push(child.$el);

					removeClass(child.$el, "is-active");

					if (index === defaultIndex) {
						addClass(child.$el, "is-active");
					}
				});

				this.pages = pages;
			},
			doAnimate(towards, options) {
				if (this.$children.length === 0) return;
				if (!options && this.$children.length < 2) return;

				let prevPage, nextPage, currentPage, pageWidth, offsetLeft;
				let speed = this.speed || 3000,
					index = this.index,
					pages = this.pages,
					pageCount = pages.length;

				if (!options) {
					pageWidth = this.$el.clientWidth;
					currentPage = pages[index];
					prevPage = pages[index - 1];
					nextPage = pages[index + 1];

					if (this.continuous && pages.length > 1) {
						if (!prevPage) {
							prevPage = pages[pages.length - 1];
						}
						if (!nextPage) {
							nextPage = pages[0];
						}
					}

					if (prevPage) {
						prevPage.style.display = "block";
						this.translate(prevPage, -pageWidth);
					}

					if (nextPage) {
						nextPage.style.display = "block";
						this.translate(nextPage, pageWidth);
					}
				} else {
					prevPage = options.prevPage;
					currentPage = options.currentPage;
					nextPage = options.nextPage;
					pageWidth = options.pageWidth;
					offsetLeft = options.offsetLeft;
				}

				let newIndex;

				let oldPage = this.$children[index].$el;

				if (towards === "prev") {
					if (index > 0) {
						newIndex = index - 1;
					}
					if (this.continuous && index === 0) {
						newIndex = pageCount - 1;
					}
				} else if (towards === "next") {
					if (index < pageCount - 1) {
						newIndex = index + 1;
					}
					if (this.continuous && index === pageCount - 1) {
						newIndex = 0;
					}
				}

				let callback = () => {
					if (newIndex !== undefined) {
						let newPage = this.$children[newIndex].$el;
						removeClass(oldPage, "is-active");
						addClass(newPage, "is-active");

						this.index = newIndex;
					}

					if (this.isDone) {
						this.end();
					}

					if (prevPage) {
						prevPage.style.display = "";
					}

					if (nextPage) {
						nextPage.style.display = "";
					}
				};

				setTimeout(() => {
					if (towards === "next") {
						this.isDone = true;
						this.before(currentPage);
						this.translate(currentPage, -pageWidth, speed, callback);

						if (nextPage) {
							this.translate(nextPage, 0, speed);
						}
					} else if (towards === "prev") {
						this.isDone = true;
						this.before(currentPage);
						this.translate(currentPage, pageWidth, speed, callback);

						if (prevPage) {
							this.translate(prevPage, 0, speed);
						}
					} else {
						this.isDone = false;
						this.translate(currentPage, 0, speed, callback);
						if (typeof offsetLeft !== "undefined") {
							if (prevPage && offsetLeft > 0) {
								this.translate(prevPage, pageWidth * -1, speed);
							}
							if (nextPage && offsetLeft < 0) {
								this.translate(nextPage, pageWidth, speed);
							}
						} else {
							if (prevPage) {
								this.translate(prevPage, pageWidth * -1, speed);
							}
							if (nextPage) {
								this.translate(nextPage, pageWidth, speed)
							}
						}
					}
				}, 10)
			},
			next() {
				this.doAnimate("next");
			},
			prev() {
				this.doAnimate("prev");
			},
			before() {
				this.$emit("before", this.index);
			},
			end() {
				this.$emit("end", this.index);
			},
			doOnTouchStart(event) {
				if (this.noDrag) return;

				let element = this.$el;
				let dragState = this.dragState;
				let touch = event.touches[0];

				dragState.startTime = new Date();
				dragState.startLeft = touch.pageX;
				dragState.startTop = touch.pageY;
				dragState.startTopAbsolute = touch.clientY;

				dragState.pageWidth = element.offsetWidth;
				dragState.pageHeight = element.offsetHeight;

				let prevPage = this.$children[this.index - 1];
				let dragPage = this.$children[this.index];
				let nextPage = this.$children[this.index + 1];

				if (this.continuous && this.pages.length > 1) {
					if (!prevPage) {
						prevPage = this.$children[this.$children.length - 1];
					}
					if (!nextPage) {
						nextPage = this.$children[0];
					}
				}

				dragState.nextPage = nextPage ? nextPage.$el : null;
				dragState.prevPage = prevPage ? prevPage.$el : null;
				dragState.dragPage = dragPage ? dragPage.$el : null;

				if (dragState.prevPage) {
					dragState.prevPage.style.display = "block";
				}

				if (dragState.nextPage) {
					dragState.nextPage.style.display = "block";
				}

			},
			doOnTouchMove(event) {
				if (this.noDrag) return;

				let dragState = this.dragState;
				let touch = event.touches[0];

				dragState.currentLeft = touch.pageX;
				dragState.currentTop = touch.pageY;
				dragState.currentTopAbsolute = touch.clientY;

				let offsetLeft = dragState.currentLeft - dragState.startLeft;
				let offsetTop = dragState.currentTopAbsolute - dragState.startTopAbsolute;

				let distanceX = Math.abs(offsetLeft);
				let distanceY = Math.abs(offsetTop);

				if (distanceX < 5 || (distanceX >= 5 && distanceY >= 1.73 * distanceX)) {
					this.userScrolling = true;
					return;
				} else {
					this.userScrolling = false;
					event.preventDefault();
				}

				offsetLeft = Math.min(Math.max(-dragState.pageWidth + 1, offsetLeft), dragState.pageWidth - 1);

				let towards = offsetLeft < 0 ? "next" : "prev";

				if (dragState.prevPage && towards === "prev") {
					this.translate(dragState.prevPage, offsetLeft - dragState.pageWidth);
				}

				this.translate(dragState.dragPage, offsetLeft);

				if (dragState.nextPage && towards === "next") {
					this.translate(dragState.nextPage, offsetLeft + dragState.pageWidth);
				}
			},
			doOnTouchEnd() {
				if (this.noDrag) return;

				let dragState = this.dragState;
				let dragDuration = new Date() - dragState.startTime;
				let towards = null;

				let offsetLeft = dragState.currentLeft - dragState.startLeft;
				let offsetTop = dragState.currentTop - dragState.startTop;
				let pageWidth = dragState.pageWidth;
				let index = this.index;
				let pageCount = this.pages.length;

				if (dragDuration < 300) {
					let fireTap = Math.abs(offsetLeft) < 5 && Math.abs(offsetTop) < 5;

					if (isNaN(offsetLeft) || isNaN(offsetTop)) {
						fireTap = true;
					}
					if (fireTap) {
						this.$children[this.index].$emit("tap");
					}
				}

				if (dragDuration < 300 && dragState.currentLeft === undefined) {
					return;
				}

				if (dragDuration < 300 || Math.abs(offsetLeft) > pageWidth / 2) {
					towards = offsetLeft < 0 ? "next" : "prev";
				}

				if (!this.continuous) {
					if ((index === 0 && towards === "prev") || (index === pageCount - 1 && towards === "next")) {
						towards = null;
					}
				}

				if (this.$children.length < 2) {
					towards = null;
				}

				this.doAnimate(towards, {
					offsetLeft: offsetLeft,
					pageWidth: dragState.pageWidth,
					prevPage: dragState.prevPage,
					currentPage: dragState.dragPage,
					nextPage: dragState.nextPage
				});

				this.dragState = {};
			},
			initTimer() {
				if (this.auto > 0 && !this.timer) {
					this.timer = setInterval(() => {
						if (!this.continuous && (this.index >= this.pages.length - 1)) {
							return this.clearTimer();
						}
						if (!this.dragging && !this.animating) {
							this.next();
						}
					}, this.auto)
				}
			},
			clearTimer() {
				clearInterval(this.timer);
				this.timer = null;
			}
		},
		destroyed() {
			if (this.timer) {
				this.clearTimer();
			}
			if (this.reInitTimer) {
				clearTimeout(this.reInitTimer);
				this.reInitTimer = null;
			}
		},
		mounted() {
			this.ready = true;

			this.initTimer();

			this.reInitPages();

			let element = this.$el;

			element.addEventListener("touchstart", (event) => {
				if (this.prevent) event.preventDefault();
				if (this.stopPropagation) event.stopPropagation();
				if (this.animating) return;

				this.dragging = true;
				this.userScrolling = false;
				this.doOnTouchStart(event);
			});

			element.addEventListener("touchmove", (event) => {
				if (!this.dragging) return;
				if (this.timer) this.clearTimer();

				this.doOnTouchMove(event);
			});

			element.addEventListener("touchend", (event) => {
				if (this.userScrolling) {
					this.dragging = false;
					this.dragState = {};
					return;
				}
				if (!this.dragging) return;
				this.initTimer();
				this.doOnTouchEnd(event);
				this.dragging = false;
			});
		}
	};
</script>