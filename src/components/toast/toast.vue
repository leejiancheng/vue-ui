<!-- **
 * Toast
 * @module components/toast
 * @desc 简短的消息提示框
 * ********** API **********
 * @param {String} [message] - 文本内容
 * @param {String} [position=middle] - Toast 的位置(可选值: top, middel, bottom)
 * @param {Number} [duration=3000] - 持续时间（毫秒），若为 -1 则不会自动关闭
 * @param {String} [className] - Toast 的类名。可以为其添加样式
 * @param {String} [iconClass] - icon 图标的类名
 *
 * @example
 * Toast({
 *  message: '操作成功',
 *  iconClass: 'icon icon-success'
 * });
 * -->

<style lang="scss" scoped>
	.mint-toast{
		position: fixed;
		max-width: 80%;
		border-radius: 5px;
		background: rgba(0, 0, 0, 0.7);
		color: #fff;
		box-sizing: border-box;
		text-align: center;
		z-index: 1000;
		transition: opacity 0.3s linear;
	}
	.mint-toast.is-placetop{
		top: 50px;
		left: 50%;
		transform: translate(-50%, 0);
	}
	.mint-toast.is-placemiddle{
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
	.mint-toast.is-placebottom{
		left: 50%;
		bottom: 50px;
		transform: translate(-50%, 0);
	}
	.mint-toast-icon{
		display: block;
		text-align: center;
		font-size: 56px;
	}
	.mint-toast-text{
		display: block;
		text-align: center;
		font-size: 14px;
	}
	.mint-toast-pop-enter,
	.mint-toast-pop-leave-active{
		opacity: 0;
	}
</style>

<template>
	<transition name="mint-toast-pop">
		<div class="mint-toast" v-show="visible" :class="customClass" :style="{'padding': iconClass === '' ? '10px' : '20px'}">
			<i class="mint-toast-icon" :class="iconClass" v-if="iconClass !== ''"></i>
			<span class="mint-toast-text" :style="{'padding-top': iconClass === '' ? '0' : '10px'}">{{message}}</span>
		</div>
	</transition>
</template>

<script type="text/babel">
	export default {
		props: {
			message: String,
			className: {
				type: String,
				default: ""
			},
			position: {
				type: String,
				default: "middle"
			},
			iconClass: {
				type: String,
				default: ""
			}
		},
		data() {
			return {
				visible: false
			}
		},
		computed: {
			customClass() {
				let classes = [];
				switch(this.position) {
					case "top":
						classes.push("is-placetop");
						break;
					case "bottom":
						classes.push("is-placebottom");
						break;
					default:
						classes.push("is-placemiddle");
				}
				classes.push(this.className);
				console.log(classes.join(" "));
				return classes.join(" ");
			}
		}
	}
</script>