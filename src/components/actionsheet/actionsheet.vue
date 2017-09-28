<!-- **
 * mt-actionsheet
 * @module components/actionsheet
 * @desc 操作表
 * ********** API **********
 * @param {String} [cancelText=取消] - 取消按钮的文本。若设为空字符串，则不显示取消按钮
 * @param {Array} [actions] - 菜单项数组
 * @param {Boolean} [closeOnClickModal=true] - 是否可以通过点击 modal 层来关闭 actionsheet
 *
 * @example
 * <mt-actionsheet :actions="actions" v-model="sheetVisible"></mt-actionsheet>
 * -->

<style lang="scss" scoped>
	.mint-actionsheet{
		position: fixed;
		left: 50%;
		bottom: 0;
		width: 100%;
		background: #e0e0e0;
		text-align: center;
		transform: translate3d(-50%, 0, 0);
		backface-visibility: hidden;
		transition: transform 0.3s ease-out;
	}
	.mint-actionsheet-list{
		list-style: none;
		padding: 0;
		margin: 0;
	}
	.mint-actionsheet-listitem{
		border-bottom: 1px solid #e0e0e0;
	}
	.mint-actionsheet-listitem,
	.mint-actionsheet-button{
		display: block;
		width: 100%;
		height: 45px;
		line-height: 45px;
		font-size: 18px;
		color: #333;
		background-color: #fff;
		&:active{
			background-color: #f0f0f0;
		}
	}
	.actionsheet-float-enter,
	.actionsheet-float-leave-active{
		transform: translate3d(-50%, 100%, 0);
	}
</style>

<template>
	<transition name="actionsheet-float">
		<div class="mint-actionsheet" v-show="currentValue">
			<ul class="mint-actionsheet-list" :style="{'margin-bottom': cancelText ? '5px' : '0'}">
				<li class="mint-actionsheet-listitem" @click.stop="itemClick(item, index)" v-for="(item, index) in actions">{{item.name}}</li>
			</ul>
			<a class="mint-actionsheet-button" @click.stop="currentValue = false" v-if="cancelText">{{cancelText}}</a>
		</div>
	</transition>
</template>

<script>
	import Popup from "../popup/popup.vue";
	export default {
		name: "mt-actionsheet",
		mixins: [Popup],
		props: {
			modal: {
				default: true
			},
			modalFade: {
				default: false
			},
			lockScroll: {
				default: false
			},
			closeOnClickModal: {
				default: true
			},
			cancelText: {
				type: String,
				default: "取消"
			},
			actions: {
				type: Array,
				default: () => []
			}
		},
		data() {
			return {
				currentValue: false
			};
		},
		watch: {
			currentValue(val) {
				this.$emit("input", val);
			},
			value(val) {
				this.currentValue = val;
			}
		},
		methods: {
			itemClick(item, index) {
				if (item.method && typeof item.method === "function") {
					item.method(item, index);
				}
				this.currentValue = false
			}
		},
		mouted() {
			if (this.value) {
				this.rendered = true;
				this.currentValue = true;
				this.open();
			}
		}
	}
</script>