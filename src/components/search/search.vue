<!-- **
 * mt-search
 * @module components/search
 * @desc 搜索框
 * @param {string} value - 绑定值
 * @param {string} [cancel-text=取消] - 取消按钮文字
 * @param {string} [placeholder=取消] - 搜索框占位内容
 * @param {boolean} [autofocus=false] - 自动 focus
 * @param {boolean} [show=false] - 始终显示列表
 * @param {string[]} [result] - 结果列表
 * @param {slot} 结果列表
 *
 * @example
 * <mt-search :value.sync="value" :result.sync="result"></mt-search>
 * <mt-search :value.sync="value">
 *   <mt-cell v-for="item in result" :title="item"></mt-cell>
 * </mt-search>
 * -->

<style lang="scss" scoped>
	@import "../../assets/css/variable/global";
	.mint-search{
		height: 100%;
		height: 100vh;
		overflow: hidden;
	}
	.mint-searchbar{
		position: relative;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		padding: 8px 10px;
		background-color: $color-grey;
		z-index: 1;
	}
	.mint-searchbar-inner{
		display: flex;
		flex: 1;
		align-items: center;
		height: 28px;
		padding: 4px 6px;
		border-radius: 2px;
		background-color: $color-white;
		.fa-search{
			font-size: 12px;
			color: $color-grey;
			margin-right: 5px;
		}
	}
	.mint-searchbar-core{
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		border: 0;
		appearance: none;
		outline: 0;
	}
	.mint-searchbar-cancel{
		margin-left: 10px;
		color: $color-blue;
		text-decoration: none;
	}
	.mint-search-list{
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		padding-top: 44px;
		overflow: auto;
	}
</style>

<template>
	<div class="mint-search">
		<div class="mint-searchbar">
			<div class="mint-searchbar-inner">
				<i class="fa fa-search"></i>
				<input type="search" class="mint-searchbar-core" :placeholder="placeholder" v-model="currentValue" ref="input" @click="visible = true">
			</div>
			<a class="mint-searchbar-cancel" v-show="visible" v-text="cancelText" @click="visible = false, currentValue = ''"></a>
		</div>
		<div class="mint-search-list" v-show="show || currentValue">
			<div class="mint-search-list-wrap">
				<slot>
					<x-cell v-for="(item, index) in result" :key="index" :title="item"></x-cell>
				</slot>
			</div>
		</div>
	</div>
</template>

<script>
	import XCell from "@/components/cell/cell.vue";
	export default {
		name: "mt-switch",
		components: {"x-cell": XCell},
		props: {
			value: String,
			autofocus: Boolean,
			show: Boolean,
			cancelText: {
				default: "取消"
			},
			placeholder: {
				default: "搜索"
			},
			result: Array
		},
		data() {
			return {
				visible: false,
				currentValue: this.value
			}
		},
		watch: {
			currentValue(val) {
				this.$emit("input", val);
			},
			value(val) {
				this.currentValue = val;
			}
		},
		mounted() {
			this.autofocus && this.$refs.input.focus();
		}
	}
</script>