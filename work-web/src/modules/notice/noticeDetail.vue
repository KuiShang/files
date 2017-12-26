<template>
	<div class="notice-detail">
		<detail-dialog @close="close">
			<template v-if="detail">
				<span slot="title">{{ detail.title }}</span>
				<template slot="msg">
					<dl class="dialog-operate">
						<dd class="collect-icon">
							<i class="icon-box" :class="storeIcon" @click.stop="noticeStore(detail)"></i>
						</dd>
						<dt class="collect-text">
							<span class="text-box">收藏</span>
						</dt>
					</dl>
					<span class="msg">{{ noticeTime(new Date(detail.sendtime)) }}</span>
					<span class="msg">{{ detail.author }}</span>
				</template>
				<p slot="content" ref="detailContent" v-html="detail.text" ></p>
			</template>
		</detail-dialog>
		<toast-message ref="toast" :message="toastMessage" :bgColor="bgColor"></toast-message>
	</div>
</template>
<script>
	import { format } from '@/utils/dateFormat'
	import DetailDialog from '@/components/DetailDialog'
	import { fetchNoticeDetail, fetchNoticeStore } from '@/api/notice'
	import ToastMessage from '@/components/ToastMessage'
	
	export default {
		data () {
			return {
				toastMessage: '^_^',
				bgColor: 'rgb(92, 92, 92)'
			}
		},
		props: {
			detail: {
				type: Object,
				default: null
			},
			options: {
				type: Object,
				default: null
			}
		},
		created () {
			this.getNoticeDetail()
		},
		components: {
			DetailDialog,
			'toast-message': ToastMessage
		},
		methods: {
			/*
			 * 格式化公告时间
			 * sentime 公告发布时间
			 */
			noticeTime (sendtime) {
				return format(new Date(sendtime), 'yyyy-MM-dd HH:mm:ss')
			},
			getNoticeDetail () {
				// this.detail = this.$store.state.notice.noticeDetailMessage
				/* 处理已读状态 */
				// if(res.data.code == 0){
				// 	let index = this.options.index
				// }
			},
			async noticeStore (notice) {
				let options = Object.assign({}, notice, this.options)
				let res = await fetchNoticeStore(options)
				notice.hascollect = !!notice.hascollect ? 0 : 1
				//请求接口成功后触发toast弹层
				if(res.code == 0){
					this.toastMessage = notice.hascollect ? '收藏成功' : '已取消收藏'
				} else{
					this.toastMessage = res.msg
					
				}
				this.$refs.toast.changeToastState();
			},
			close () {
				/*
				* 切换成弹窗形式不需要路由跳转
				* let active = this.options && this.options.active
				* this.$router.push('/notice/' + (active ? active: 0))
				*/
				this.$emit('changeDetailState')
			}
		},
		computed: {
			storeIcon () {
				return !!this.detail.hascollect ? 'icon-active-box' : 'icon-normal-box'
			}
		}
	}
</script>
<style lang="scss" scoped>
	$imgPath: '../../assets/';
	.notice-detail {
		.dialog-operate {
			position: absolute;
			top: 24px;
			left: -82px;
			width: 50px;
			height: 54px;
			color: #666;
			font-size: 12px;
			background: #F9F9F9;
			text-align: center;
			box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.2);
			.collect-icon, .collect-text {
				displasa: inline-block;
				width: 100%;
				height: 50%;
			}
			.icon-box {
				display: inline-block;
				width: 16px;
				height: 16px;
				vertical-align: -8px;
				cursor: pointer;
				background: url('#{$imgPath}imgs/icons.png') no-repeat;
			}
			.icon-normal-box {
				background-position: -135px -237px;
				&:hover {
					background-position: -169px -236px;
				}
			}
			.icon-active-box {
				background-position: -199px -237px;
			}
			.icon-nocollect {
				background-position: -135px -237px;
				&:hover {
					background-position: -169px -236px;
				}
			}
			.icon-collect {
				background-position: -135px -237px;
				&:hover {
					background-position: -169px -236px;
				}
			}
			.text-box  {
				vertical-align: middle;
			}
		}
	}
</style>