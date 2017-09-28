
<style lang="scss" scoped>
	// @import "../../assets/css/variable/global";
	.mint-spinner-fading-circle{
		position: relative;
	}
	.mint-spinner-fading-circle-circle{
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		&::before{
			content: " ";
			display: block;
			margin: 0 auto;
			width: 15%;
			height: 15%;
			border-radius: 100%;
			animation: mint-fading-circle 1.2s infinite ease-in-out both;
		}
		@for $i from 2 to 12 {
			&.is-circle-#{$i}{
				transform: rotate(calc(360deg / 12 * (#{$i} - 1)));
				&::before{
					animation-delay: calc(-1.2s + 1.2s / 12 * (#{$i} - 1));
				}
			}
		}
	}
	@keyframes mint-fading-circle{
		0%, 39%, 100%{
			opacity: 0;
		}
		40%{
			opacity: 1;
		}
	}
</style>

<template>
	<div :class="['mint-spinner-fading-circle circle-color-' + _uid]" :style="{width: spinnerSize, height: spinnerSize}">
		<div class="mint-spinner-fading-circle-circle" v-for="n in 12" :class="['is-circle-' + (n + 1)]"></div>
	</div>
</template>

<script>
	import common from "./common.vue";
	export default {
		name: "fading-circle",
		mixins: [common],
		created() {
			if (this.$isServer) return;
			this.styleNode = document.createElement("style");
			const css = `.circle-color-${this._uid} > div::before{background-color: ${this.spinnerColor};}`;
			this.styleNode.type = "text/css";
			this.styleNode.rel = "stylesheet";
			this.styleNode.title = "fading circle style";
			document.getElementsByTagName("head")[0].appendChild(this.styleNode);
			this.styleNode.appendChild(document.createTextNode(css));
		},
		destroyed() {
			if (this.styleNode) {
				this.styleNode.parentNode.removeChild(this.styleNode);
			}
		}
	}
</script>