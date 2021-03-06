<!-- **
 * mt-palette-button
 * @module components/palette-button
 * @desc 调色板按钮
 * ********** API **********
 * @param {String} [content] - 主按钮内容
 * @param {Number} [offset=Math.PI / 4] - 角度偏移量
 * @param {String} [direction=lt] - 按钮展开方向(可选值: lt, t, rt, r, rb, b, lb, l)
 * @param {Number} [radius=90] - 按钮展开半径
 * @param {String} [mainButtonStyle] - 主按钮样式
 * ********** 方法 **********
 * @param [toggle] - 切换按钮展开/收起状态
 * @param [expand] - 展开按钮
 * @param [collapse] - 收起按钮
 * ********** Events **********
 * @param {Function} [expand] - 按钮开始展开
 * @param {Function} [expanded] - 按钮完全展开（动画效果执行结束）
 * @param {Function} [collapse] - 按钮开始收起
 *
 * @example
 * <mt-palette-button content="+">
 *   <div class="my-icon-button"></div>
 *   <div class="my-icon-button"></div>
 *   <div class="my-icon-button"></div>
 * </mt-palette-button>
 * -->

<style lang="scss">
	// @import "../../assets/css/variable/global";
	.mint-palette-button{
		position: relative;
		display: inline-block;
		width: 56px;
		height: 56px;
		line-height: 56px;
		text-align: center;
		border-radius: 50%;
		transition: transform 0.1s ease-in-out;
	}
	.mint-main-button{
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		background-color: blue;
		font-size: 2em;
	}
	.mint-palette-button-active{
		animation: mint-zoom 0.5s ease-in-out;
	}
	.mint-sub-button-container{
		> *{
			position: absolute;
			top: 15px;
			left: 15px;
			width: 25px;
			height: 25px;
			transition: transform 0.3s ease-in-out;
		}
	}
	@keyframes mint-zoom{
		0%{
			transform: scale(1);
		}
		10%{
			transform: scale(1.1);
		}
		30%{
			transform: scale(0.9);
		}
		50%{
			transform: scale(1.05);
		}
		70%{
			transform: scale(0.95);
		}
		90%{
			transform: scale(1.01);
		}
		100%{
			transform: scale(1);
		}
	}
</style>

<template>
	<div class="mint-palette-button" :class="{expand: expanded, 'mint-palette-button-active': transforming}" @animationend="onMainAnimationEnd" @webkitAnimationEnd="onMainAnimationEnd" @mozAnimationEnd="onMainAnimationEnd">
		<div class="mint-sub-button-container">
			<slot></slot>
		</div>
		<div class="mint-main-button" :style="mainButtonStyle" @touchstart="toggle">{{content}}</div>
	</div>
</template>

<script>
	export default {
		name: "mt-palette-button",
		props: {
			content: {
				type: String,
				default: ""
			},
			offset: {
				typpe: Number,
				default: Math.PI / 4
			},
			direction: {
				type: String,
				default: "lt"
				// lt t rt this.radius rb b lb l
				// 取值有8个方向，左上、上、右上、右、右下、下、左下、左，默认为左上
			},
			radius: {
				type: Number,
				default: 90
			},
			mainButtonStyle: {
				type: String,
				default: ""
			}
		},
		data() {
			return {
				transforming: false,
				expanded: false
			}
		},
		methods: {
			toggle(event) {
				if (!this.transforming) {
					if (this.expanded) {
						this.collapse(event);
					} else {
						this.expand(event);
					}
				}
			},
			onMainAnimationEnd(event) {
				this.transforming = false;
				this.$emit("expanded");
			},
			expand(event) {
				this.expanded = true;
				this.transforming = true;
				this.$emit("expand", event);
			},
			collapse(event) {
				this.expanded = false;
				this.$emit("collapse", event);
			}
		},
		mounted() {
			this.slotChildren = [];
			for(let i = 0; i < this.$slots.default.length; i++) {
				if (this.$slots.default[i].elm.nodeType !== 3) {
					this.slotChildren.push(this.$slots.default[i]);
				}
			}

			let css = "";
			let direction_arc = Math.PI * (3 + Math.max(["lt", "t", "rt", "r", "rb", "b", "lb", "l"].indexOf(this.direction), 0)) / 4;

			for(let i = 0; i < this.slotChildren.length; i++) {
				let arc = (Math.PI - this.offset * 2) / (this.slotChildren.length - 1) * i + this.offset + direction_arc;
				let x = (Math.cos(arc) * this.radius).toFixed(2);
				let y = (Math.sin(arc) * this.radius).toFixed(2);

				// let item_css = ".expand .palette-button-" + this._uid + "-sub-" + i + "{transform: translate(" + x + "px," + y + "px) rotate(720deg); transition-delay:" + 0.03 * i + "s}";

				let item_css = `.expand .palette-button-${this._uid}-sub-${i}{transform: translate(${x}px, ${y}px) rotate(720deg); transition-delay: ${0.03 * i}s}`;

				css += item_css;

				this.slotChildren[i].elm.className += (" palette-button-" + this._uid + "-sub-" + i);
			}

			this.styleNode = document.createElement("style");
			this.styleNode.type = "text/css";
			this.styleNode.rel = "stylesheet";
			this.styleNode.title = "palette button style";
			this.styleNode.appendChild(document.createTextNode(css));
			document.getElementsByTagName("head")[0].appendChild(this.styleNode);
		},
		destroyed() {
			if (this.styleNode) {
				this.styleNode.parentNode.removeChild(this.styleNode);
			}
		}
	}
</script>