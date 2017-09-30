<style lang="scss">
	@import "../../assets/css/variable/global";
	.mint-select{
		position: relative;
		display: flex;
		width: 100%;
		line-height: 1;
		height: 36px;
		font-size: 16px;
		align-items: center;
		color: $cell-value-color;
		&::after{
			content: "";
			display: block;
			position: absolute;
			top: auto;
			right: auto;
			left: 0;
			bottom: 0;
			width: 100%;
			height: 1px;
			background-image: linear-gradient(180deg,#d9d9d9,#d9d9d9 50%,transparent 0);
		}
	}
	.mint-select-text{
		flex: 1;
		padding: 0 10px;
	}
	.mint-select-options{
		position: absolute;
		width: 100%;
		top: 36px;
		left: 0;
		box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
		z-index: 10;
		background-color: $color-white;
		overflow: hidden;
		overflow-scrolling: touch;
		.mint-select-options-item{
			position: relative;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			font-size: 16px;
			padding: 6px 10px;
			min-height: 36px;
			color: #333;
			> span{
				flex: 1;
				padding-right: 10px;
			}
		}
	}
</style>

<template>
	<div class="mint-select">
		<div class="mint-select-label" v-text="label" v-if="label"></div>
		<div class="mint-select-text" @click="toggleSelect()">{{"currentValue" || placholder}}</div>
		<div class="mint-select-icon" @click="toggleSelect()">
			<i :class="['fa', isUp ? 'fa-caret-down' : 'fa-caret-up']"></i>
		</div>
		<ul class="mint-select-options" v-show="focus">
			<li v-for="option in options">
				<a href="javascript:void(0);" class="mint-select-options-item" @click="select(option)" :class="{'is-selct': selectValue}">
					<span>{{option.text || option}}</span>
					<i class="fa fa-check"></i>
				</a>
			</li>
		</ul>
		<!-- <div class="mint-select-list"> -->
		<!-- </div> -->
	</div>
</template>

<script>
	export default{
		name: "mt-select",
		props: {
			label: {
				type: String,
				default: ""
			},
			placholder: {
				type: String,
				default: "选择一个你喜欢的"
			},
			focus: {
				type: Boolean,
				default: false
			},
			multi: {
				type: Boolean,
				default: false
			},
			options: {
				type: Array,
				default: []
			}
		},
		data() {
			return {
				isUp: false,
				selectValue: "01"
			}
		},
		watch: {
			currentValue(val) {
				return val
			}
		},
		methods: {
			hideSelect() {
				this.focus = false;
			},
			toggleSelect() {
				this.focus = !this.focus;
				this.isUp = !this.isUp;
			},
			select(option) {
				if (this.multi) {

				} else {
					this.value = option.value || option;
					this.hideSelect();
				}
			}
		}
	}
</script>