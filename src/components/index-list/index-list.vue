<!-- **
 * mt-index-list
 * @module components/index-list
 * @desc 索引列表
 * @param {boolean} [showIndicator] - 是否显示索引值提示符
 * @param {Number} [height] - 组件的高度。若不指定，则自动延伸至视口底
 *
 * @example
 * <mt-index-list>
 * 	<mt-index-section v-for="item in alphabet" :index="item.initial">
 * 		<mt-cell v-for="cell in item.cells" :title="cell"></mt-cell>
 * 		</mt-index-section>
 * </mt-index-list>
 * -->

<style lang="scss">
	@import "../../assets/css/variable/global";
	.mint-indexlist{
		position: relative;
		width: 100%;
		overflow: hidden;
	}
	.mint-indexlist-content{
		margin: 0;
		padding: 0;
		overflow: auto;
	}
	.mint-indexlist-nav{
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		margin: 0;
		display: flex;
		max-height: 100%;
		flex-direction: column;
		justify-content: center;
		text-align: center;
		border-left: 1px solid #ddd;
		background-color: #fff;
	}
	.mint-indexlist-navlist{
		display: flex;
		flex-direction: column;
		max-height: 100%;
		list-style: none;
		padding: 0;
		margin: 0;
	}
	.mint-indexlist-navitem{
		padding: 2px 6px;
		font-size: 12px;
		user-select: none;
		-webkit-touch-callout: none;
	}
	.mint-indexlist-indicator{
		position: absolute;
		top: 50%;
		left: 50%;
		width: 50px;
		height: 50px;
		line-height: 50px;
		background-color: rgba(0, 0, 0, 0.7);
		border-radius: 5px;
		transform: translate(-50%, -50%);
		text-align: center;
		color: #fff;
		font-size: 22px;
	}
</style>

<template>
	<div class="mint-indexlist">
		<ul class="mint-indexlist-content" ref="content" :style="{'height': currentHeight + 'px', 'margin-right': navWidth + 'px'}">
			<slot></slot>
		</ul>
		<div class="mint-indexlist-nav" @touchstart="handleTouchStart" ref="nav">
			<ul class="mint-indexlist-navlist">
				<li class="mint-indexlist-navitem" v-for="section in sections">
					{{section.index}}
				</li>
			</ul>
		</div>
		<div class="mint-indexlist-indicator" v-if="showIndicator" v-show="moving">{{currentIndicator}}</div>
	</div>
</template>

<script>
	export default {
		name: "mt-index-list",
		props: {
			height: Number,
			showIndicator: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				sections: [],
				navWidth: 0,
				indicatorTime: null,
				moving: false,
				firstSection: null,
				currentIndicator: "",
				currentHeight: this.height,
				navOffsetX: 0
			};
		},
		watch: {
			sections() {
				this.init();
			},
			height(val) {
				if (val) {
					this.currentHeight = val;
				}
			}
		},
		methods: {
			init() {
				this.$nextTick(() => {
					this.navWidth = this.$refs.nav.clientWidth;
				});

				let listItems = this.$refs.content.getElementsByTagName("li");

				if (listItems.length > 0) {
					this.firstSection = listItems[0];
				}
			},
			handleTouchStart(event) {
				if (event.target.tagName !== "LI") {
					return;
				}

				this.navOffsetX = event.changedTouches[0].clientX;
				this.scrollList(event.changedTouches[0].clientY);

				if (this.indicatorTime) {
					clearTimeout(this.indicatorTime);
				}

				this.moving = true;
				window.addEventListener("touchmove", this.handleTouchMove);
				window.addEventListener("touchend", this.handleTouchEnd);
			},
			handleTouchMove(event) {
				event.preventDefault();
				this.scrollList(event.changedTouches[0].clientY);
			},
			handleTouchEnd() {
				this.indicatorTime = setTimeout(() => {
					this.moving = false;
					this.currentIndicator = "";
				}, 500);

				window.removeEventListener("touchmove", this.handleTouchMove);
				window.removeEventListener("touchend", this.handleTouchEnd);
			},
			scrollList(y) {
				let currentItem = document.elementFromPoint(this.navOffsetX, y);

				if (!currentItem || !currentItem.classList.contains("mint-indexlist-navitem")) {
					return;
				}

				this.currentIndicator = currentItem.innerText;

				let targets = this.sections.filter(section => section.index === currentItem.innerText);

				let targetDOM;

				if (targets.length > 0) {
					targetDOM = targets[0].$el;
					this.$refs.content.scrollTop = targetDOM.getBoundingClientRect().top - this.firstSection.getBoundingClientRect().top;
				}
			}
		},
		mounted() {
			if (!this.currentHeight) {
				this.currentHeight = document.documentElement.clientHeight - this.$refs.content.getBoundingClientRect().top;
			}
			this.init();
		}
		
	}
</script>