
<style lang="scss" scoped>
	// @import "../../assets/css/variable/global";
	.mint-spinner-snake{
		border: 4px solid transparent;
		border-radius: 50%;
		animation: mint-spinner-rotate 0.8s infinite linear;
	}
	@keyframes mint-spinner-rotate{
		0%{
			transform: rotate(0deg);
		}
		100%{
			transform: rotate(360deg);
		}
	}
</style>

<template>
	<div class="mint-spinner-snake" :style="{'border-top-color': spinnerColor, 'border-left-color': spinnerColor, 'border-bottom-color': spinnerColor, 'width': spinnerSize, 'height': spinnerSize}"></div>
</template>

<script>
	import common from "./common.vue";
	export default {
		name: "snake",
		mixins: [common]
	}
</script>