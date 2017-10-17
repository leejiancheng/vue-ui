<style lang="scss">
	.mint-ripple{
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: block;
		border-radius: inherit;
		overflow: hidden;
		mask-image: radial-gradient(circle, white, black);
		.ripple{
			position: absolute;
			width: 0;
			height: 0;
			pointer-events: none;
			user-select: none;
			border-radius: 50%;
			// background-color: currentColor;
			background-clip: padding-box;
			transform: scale(0);
			transition: transform 0.4s ease-out, opacity 0.4s ease-out;
			&.held{
				transform: scale(1);
			}
			&.done{
				opacity: 0 !important;
			}
		}
	}
</style>

<template>
	<div class="mint-ripple" :style="{'color': color}"></div>
</template>

<script>
	import {handleMouseDown, handleTouchStart} from "./ripple.js";

	export default {
		name: "mt-ripple",
		props: {
			trigger: {
				// type: window.Element,
				required: true
			},
			color: {
				type: String,
				default: ""
			}
		},
		watch: {
			trigger() {
				this.initialize();
			}
		},
		ready() {
			this.initialize();
		},
		beforeDestory() {
			if (this.trigger) {
				this.trigger.removeEventListener("touchstart", handleTouchStart);
				this.trigger.removeEventListener("mousedown", handleMouseDown);
			}
		},
		methods: {
			initialize() {
				if (this.trigger) {
					this.trigger.addEventListener("touchstart", handleTouchStart);
					this.trigger.addEventListener("mousedown", handleMouseDown);
				}
			}
		}
	}
</script>