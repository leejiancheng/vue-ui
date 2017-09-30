<style lang="scss">
	.mint-popup{
		width: 100%;
	}
	.modal{
		width: 100%;
		height: 60px;
		text-align: center;
		line-height: 60px;
	}
	.page-view{
		padding: 20px;
	}
	.mint-button{
		margin-top: 10px;
	}
</style>

<template>
	<div class="page-view">
		<!-- <mt-select label="单选框" :options="games" placeholder="选择一个你喜欢的"></mt-select> -->
		<!-- <mt-select label="多选框" multi :options="games" placeholder="选择一个你喜欢的"></mt-select> -->
		<mt-select label="单选框" :options="games" placeholder="选择一个你喜欢的"></mt-select>
		<mt-button>选择一个你喜欢的</mt-button>
	</div>
</template>

<script>
	import Popup from "@/components/popup/popup";
	import Search from "@/components/search/search";
	import Button from "@/components/button/button";
	import Select from "@/components/select/select";
	import Toast from "@/components/toast";
	export default {
		components: {"mt-popup": Popup, "mt-button": Button, "mt-search": Search, "mt-select": Select},
		data() {
			return {
				games: [{
					value: '01',
					text: '守望先锋'
				}, {
					value: '03',
					text: '英雄联盟'
				}, {
					value: '04',
					text: '炉石传说'
				}, {
					value: '05',
					text: '风暴英雄'
				}]
			}
		}
	}
</script>