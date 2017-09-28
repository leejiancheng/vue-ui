<!-- **
 * mt-index-section
 * @module components/index-section
 * @desc 索引列表
 * @param {String} [index] - 索引值（必需参数）
 *
 * @example
 * <mt-index-list>
 * 	<mt-index-section v-for="item in alphabet" :index="item.initial">
 * 		<mt-cell v-for="cell in item.cells" :title="cell"></mt-cell>
 * 		</mt-index-section>
 * </mt-index-list>
 * -->

<style lang="scss">
	// @import "../../assets/css/variable/global";
	.mint-indexsection{
		padding: 0;
		margin: 0;
	}
	.mint-indexsection-index{
		margin: 0;
		padding: 10px;
		background-color: #fafafa;
		& + ul{
			padding: 0;
		}
	}
</style>

<template>
	<li class="mint-indexsection">
		<p class="mint-indexsection-index">{{index}}</p>
		<ul>
			<slot></slot>
		</ul>
	</li>
</template>

<script>
	export default {
		name: "mt-index-section",
		props: {
			index: {
				type: String,
				required: true
			}
		},
		mounted() {
			this.$parent.sections.push(this)
		},
		beforeDestroy() {
			let index = this.$parent.sections.indexOf(this);
			if (index > -1) {
				this.$parent.sections.splice(index, 1);
			}
		}
	}
</script>