<template>
	<div class="over-dialog">
		<div class="dialog-action">
			<span class="dialog-close" @click.stop="close"></span>
		</div>
		<div class="dialog-container">
			<div class="dialog-title">
				<slot name="title"></slot>
			</div>
			<div class="dialog-msg">
				<slot name="msg"></slot>
			</div>
			<div class="dialog-content">
				<slot name="content"></slot>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		methods: {
			close () {
				this.$emit('close')
			}
		}
	}
</script>
<style lang="scss" scoped>
	$imgPath: '../assets/';
	.over-dialog {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 102;
		overflow-y: auto;
		text-align: left;
		line-height: normal;
		background-color: #FFF;
		.dialog-container {
			width: 840px;
			margin: 0 auto;
			padding-bottom: 40px;
		}
		.dialog-title {
			color: #333;
			font-size: 20px;
			padding: 40px 0 24px 0;
			border-bottom: 1px solid #E8E8E8;
		}
		.dialog-msg {
			position: relative;
			padding: 20px 0 40px 0;
			.msg {
				color: #999;
				font-size: 14px;
				margin-right: 10px;
			}
		}
		.dialog-content {
			color: #333;
			font-size: 16px;
			word-wrap: break-word;
		}
		.dialog-close {
			position: fixed;
			top: 40px;
			right: 50px;
			width:60px;
			height: 60px;
			cursor: pointer;
			background: url('#{$imgPath}imgs/icons.png') no-repeat;
			background-position: 8px -261px;
			&:hover {
				background-position: -52px -261px;
			}
		}
		/*.dialog-close {
			position: fixed;
			top: 40px;
			right: 50px;
			width:60px;
			height: 60px;
			cursor: pointer;
			border-radius: 100%;
			&:hover {
				background-color: #F2F2F2;
			}
			&:before, &:after {
				content: '';
				position: absolute;
				top: 50%;
				left: 50%;
				width: 36px;
				height: 3px;
				border-radius: 3px;
				background-color: #999;
			}
			&:before {
				transform: translate(-50%, -50%) rotate(-45deg);
			}
			&:after {
				transform: translate(-50%, -50%) rotate(45deg);
			}
		}*/
	}
</style>