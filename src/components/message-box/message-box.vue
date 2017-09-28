<!-- **
 * message-box
 * @module components/message-box
 * @desc 弹出式提示框
 * ********** API **********
 * @param {String} [title] - 提示框的标题
 * @param {String} [message] - 提示框的内容
 * @param {Boolean} [showConfirmButton=true] - 是否显示确认按钮
 * @param {Boolean} [showCancelButton=false] - 是否显示取消按钮
 * @param {String} [confirmButtonText] - 确认按钮的文本
 * @param {Boolean} [confirmButtonHighlight=false] - 是否将确认按钮的文本加粗显示
 * @param {String} [confirmButtonClass] - 确认按钮的类名
 * @param {String} [cancelButtonText] - 取消按钮的文本
 * @param {Boolean} [cancelButtonHighlight=false] - 是否将取消按钮的文本加粗显示
 * @param {String} [cancelButtonClass] - 取消按钮的类名
 * @param {Boolean} [closeOnClickModal] - 是否在点击遮罩时关闭提示光
 * @param {Boolean} [showInput=false] - 是否显示一个输入框
 * @param {String} [inputType=text] - 输入框的类型
 * @param {String} [inputValue] - 输入框的值
 * @param {String} [inputPlaceholder] - 输入框的占位符
 *
 * @example
 * MessageBox.alert('操作成功!', '提示');
 * -->

<style lang="scss" scoped>
	// @import "../../assets/css/variable/global";
	.mint-msgbox{
		position: fixed;
		top: 50%;
		left: 50%;
		width: 85%;
		border-radius: 3px;
		font-size: 16px;
		-webkit-user-select: none;
		overflow: hidden;
		background-color: #fff;
		transform: translate3d(-50%, -50%, 0);
		backface-visibility: hidden;
		transition: 0.2s;
	}
	.mint-msgbox-header{
		padding: 15px 0 0;
	}
	.mint-msgbox-content{
		position: relative;
		min-height: 36px;
		border-bottom: 1px solid #ddd;
		padding: 10px 20px 15px;
	}
	.mint-msgbox-input{
		padding-top: 15px;
		input{
			width: 100%;
			padding: 4px 5px;
			border: 1px solid #dedede;
			border-radius: 5px;
			appearance: none;
			outline: none;
			&.invalid{
				border-color: #ff4949;
				&:focus{
					border-color: #ff4949;
				}
			}
		}
	}
	.mint-msgbox-errormsg{
		min-height: 18px;
		font-size: 12px;
		color: red;
		margin-top: 2px;
	}
	.mint-msgbox-title{
		margin-bottom: 0;
		padding-left: 0;
		font-size: 16px;
		font-weight: bold;
		color: #333;
		text-align: center;
	}
	.mint-msgbox-btns{
		display: flex;
		height: 40px;
		line-height: 40px;
	}
	.mint-msgbox-btn{
		display: block;
		flex: 1;
		margin: 0;
		border: 0;
		line-height: 35px;
		background-color: #fff;
		&:focus{
			outline: none;
		}
		&:active{
			background-color: #fff;
		}
	}
	.mint-msgbox-cancel{
		width: 50%;
		border-right: 1px solid #ddd;
		&:active{
			color: #000;
		}
	}
	.mint-msgbox-confirm{
		width: 50%;
		color: #26a2ff;
		&:acitve{
			color: #26a2ff;
		}
	}
	.msgbox-bounce-enter{
		opacity: 0;
		transform: translate3d(-50%, -50%, 0) scale(0.7);
	}
	.msgbox-bounce-leave-active{
		opacity: 0;
		transform: translate3d(-50%, -50%, 0) scale(0.9);
	}
</style>

<template>
	<div class="mint-msgbox-wrapper">
		<transition name="msgbox-bounce">
			<div class="mint-msgbox" v-show="value">
				<div class="mint-msgbox-header" v-if="title !== ''">
					<div class="mint-msgbox-title">{{title}}</div>
				</div>
				<div class="mint-msgbox-content" v-if="message !== ''">
					<div class="mint-msgbox-message" v-html="message"></div>
					<div class="mint-msgbox-input" v-show="showInput">
						<input v-model="inputValue" :placeholder="inputPlaceholder" ref="input">
						<div class="mint-msgbox-errormsg" :style="{visibility: !!editorErrorMessage ? 'visible' : 'hidden'}">{{editorErrorMessage}}</div>
					</div>
				</div>
				<div class="mint-msgbox-btns">
					<button :class="[cancelButtonClasses]" v-show="showCancelButton" @click="handleAction('cancel')">{{cancelButtonText}}</button>
					<button :class="[confirmButtonClasses]" v-show="showConfirmButton" @click="handleAction('confirm')">{{confirmButtonText}}</button>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
	import Popup from "@/components/popup/popup.vue";
	let CONFIRM_TEXT = "确定";
	let CANCEL_TEXT = "取消";
	export default {
		mixins: [Popup],
		props: {
			modal: {
				default: true
			},
			showClose: {
				type: Boolean,
				default: true
			},
			lockScroll: {
				type: Boolean,
				default: false
			},
			closeOnClickModal: {
				default: true
			},
			closeOnPressEscape: {
				default: true
			},
			inputType: {
				type: String,
				default: "text"
			}
		},
		computed: {
			confirmButtonClasses() {
				let classes = "mint-msgbox-btn mint-msgbox-confirm " + this.confirmButtonClass;

				if (this.confirmButtonHighlight) {
					classes += " mint-msgbox-confirm-highlight";
				}
				return classes;
			},
			cancelButtonClasses() {
				let classes = "mint-msgbox-btn mint-msgbox-cancel " + this.cancelButtonClass;

				if (this.cancelButtonHighlight) {
					classes += " mint-msgbox-cancel-highlight";
				}
				return classes;
			}
		},
		data() {
			return {
				title: "",
				message: "",
				type: "",
				showInput: false,
				inputValue: null,
				inputPlaceholder: "",
				inputPattern: null,
				inputValidator: null,
				inputErrorMessage: "",
				showConfirmButton: true,
				showCancelButton: false,
				confirmButtonText: CONFIRM_TEXT,
				cancelButtonText: CANCEL_TEXT,
				confirmButtonClass: "",
				confirmButtonDisabled: false,
				cancelButtonClass: "",
				editorErrorMessage: null,
				callback: null
			}
		},
		watch: {
			inputValue() {
				if (this.$type === "prompt") {
					this.validate();
				}
			},
			value(val) {
				this.handleInputType(this.inputType);
				if (val && this.$type === "prompt") {
					setTimeout(() => {
						if (this.$refs.input) {
							this.$refs.input.focus();
						}
					}, 500);
				}
			},
			inputType(val) {
				this.handleInputType(val);
			}
		},
		methods: {
			doClose() {
				this.value = false;
				this._closing = true;

				this.onClose && this.onClose();

				setTimeout(() => {
					if (this.modal && this.bodyOverflow !== "hidden") {
						document.body.style.overflow = this.bodyOverflow;
						document.body.style.paddingRight = this.bodyPaddingRight;
					}

					this.bodyOverflow = null;
					this.bodyPaddingRight = null;
				}, 200);
				this.opened = false;

				if (!this.transition) {
					this.doAfterClose();
				}
			},
			handleAction(action) {
				if (this.$type === "prompt" && action === "confirm" && !this.validate()) {
					return;
				}
				let callback = this.callback;
				this.value = false;
				callback(action);
			},
			validate() {
				if (this.$type === "prompt") {
					let inputPattern = this.inputPattern;

					if (inputPattern && !inputPattern.test(this.inputValue || "")) {
						this.editorErrorMessage = this.inputErrorMessage || "输入的数据不合法!";
						this.$refs.input.classList.add("invalid");
						return false;
					}

					let inputValidator = this.inputValidator;

					if (typeof inputValidator === "function") {
						let validateResult = inputValidator(this.inputValue);

						if (validateResult === false) {
							this.editorErrorMessage = this.inputErrorMessage || "输入的数据不合法!";
							this.$refs.input.classList.add("invalid");
						}
						if (typeof validateResult === "string") {
							this.editorErrorMessage = validateResult;
							return false;
						}
					}
				}
				this.editorErrorMessage = "";
				this.$refs.input.classList.remove("invalid");
				return false;
			},
			handleInputType(val) {
				if (val === "range" || !this.$refs.input) return;
				this.$refs.input.type = val;
			}
		}
	}
</script>