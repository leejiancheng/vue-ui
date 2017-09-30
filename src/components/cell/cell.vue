<!-- **
 * mt-cell
 * @module components/cell
 * @desc 单元格
 * @param {string|Object} [to] - 跳转链接，使用 vue-router 的情况下 to 会传递给 router.push，否则作为 a 标签的 href 属性处理
 * @param {string} [icon] - 图标，提供 more, back，或者自定义的图标（传入不带前缀的图标类名，最后拼接成 .fa-xxx）
 * @param {string} [title] - 标题
 * @param {string} [label] - 备注信息
 * @param {boolean} [is-link=false] - 可点击的链接
 * @param {string} [value] - 右侧显示文字
 * @param {slot} - 同 value, 会覆盖 value 属性
 * @param {slot} [title] - 同 title, 会覆盖 title 属性
 * @param {slot} [icon] - 同 icon, 会覆盖 icon 属性，例如可以传入图片
 *
 * @example
 * <mt-cell title="标题文字" icon="back" is-link value="描述文字"></mt-cell>
 * <mt-cell title="标题文字" icon="back">
 *   <div slot="value">描述文字啊哈</div>
 * </mt-cell>
 * -->

<style lang="scss">
	@import "../../assets/css/variable/global";
	.mint-cell{
		position: relative;
		display: block;
		box-sizing: border-box;
		min-height: 48px;
		color: inherit;
		background-color: $color-white;
		text-decoration: none;
		overflow: hidden;
		img{
			vertical-align: middle;
		}
		&:first-child{
			.mint-cell-wrapper{
				background-origin: border-box;
			}
		}
		&:last-child{
	        background-image: linear-gradient(0deg, $color-grey, $color-grey 50%, transparent 50%);
	        background-size: 100% 1px;
	        background-repeat: no-repeat;
	        background-position: bottom;
		}
	}
	.mint-cell-mask{
		&::after{
			content: " ";
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			opacity: 0;
			background-color: #000;
		}
		&:active::after{
			opacity: 0.1;
		}
	}
	.mint-cell-wrapper{
		display: flex;
		align-items: center;
		width: 100%;
		min-height: inherit;
		box-sizing: border-box;
		padding: 0 10px;
		line-height: 1;
		font-size: 16px;
		background-image:linear-gradient(180deg, $color-grey, $color-grey 50%, transparent 50%);
		background-size: 120% 1px;
		background-repeat: no-repeat;
		background-position: top left;
		background-origin: content-box;
		overflow: hidden;
	}
	.mint-cell-text{
		vertical-align: middle;
	}
	.mint-cell-label{
		display: block;
		color: #888;
		font-size: 12px;
		margin-top: 6px;
	}
	.mint-cell-title{
		flex: 1;
	}
	.mint-cell-value{
		display: flex;
		align-items: center;
		color: $cell-value-color;
		&.is-link{
			margin-right: 24px;
		}
	}
	.mint-cell-left{
		position: absolute;
		left: 0;
		height: 100%;
		transform: translate3d(-100%, 0, 0);
	}
	.mint-cell-right{
		position: absolute;
		top: 0;
		right: 0;
		height: 100%;
		transform: translate3d(100%, 0, 0);
	}
	.mint-cell-allow-right::after{
		content: " ";
		position: absolute;
		top: 50%;
		right: 20px;
		width: 5px;
		height: 5px;
		border: 2px solid $border-color;
		border-bottom-width: 0;
		border-left-width: 0;
		transform: translateY(-50%) rotate(45deg);
	}
</style>

<template>
	<a class="mint-cell" :href="href">
		<span class="mint-cell-mask" v-if="isLink"></span>
		<div class="mint-cell-left">
			<slot name="left"></slot>
		</div>
		<div class="mint-cell-wrapper">
			<div class="mint-cell-title">
				<slot name="icon">
					<i class="fa" :class="'fa-' + icon" v-if="icon"></i>
				</slot>
				<slot name="title">
					<span class="mint-cell-text" v-text="title"></span>
					<span class="mint-cell-label" v-text="label" v-if="label"></span>
				</slot>
			</div>
			<div class="mint-cell-value" :class="{'is-link': isLink}">
				<slot>
					<span v-text="value"></span>
				</slot>
			</div>
		</div>
		<div class="mint-cell-right">
			<slot name="right"></slot>
		</div>
		<i class="mint-cell-allow-right" v-if="isLink"></i>
	</a>
</template>

<script>
	export default {
		name: "mt-cell",
		props: {
			to: [String, Object],
			icon: String,
			title: String,
			label: String,
			isLink: Boolean,
			value: {}
		},
		computed: {
			href() {
				if (this.to && !this.added && this.$router) {
					const resolved = this.$router.match(this.to);
					if (!resolved.matched.length) return this.to;

					this.$nextTick(() => {
						this.added = true;
						this.$el.addEventListener("click", this.handleClick);
					})
				}
				return this.to
			}
		},
		methods: {
			handleClick($event) {
				$event.preventDefault();
				this.$router.push(this.href)
			}
		}
	}
</script>