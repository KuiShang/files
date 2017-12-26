<template>
	<div class="notice-content">
		<div class="notice-wrap">
			<div class="notice-tabs">
				<a @click="changeActive(0)" :class="['notice-tab', { 'active': active === 0 }]">全部公告</a>
				<a @click="changeActive(1)" :class="['notice-tab', { 'active': active === 1 }]">收藏公告</a>
				<!-- 左上角分页标签 -->
				<div class="paging-turning">
               		<simple-page
					   @current-change="pageChange"
					   :page-size="options.pageSize" 
					   :total-record="options.totalRecord"
					   :current-page="options.pageNo"
					>
					</simple-page>
            	</div>
			</div>
			<ul v-if="list && list.length > 0" class="notice-items">
				<li @click.stop="noticeDetail(item, index)" class="notice-item" :class="{'hasread': item.hasread == 1}" v-for="(item, index) in list" :key="index">
					<dl class="notice-item-wrap">
						<dt class="notice-item-title">{{ item.notice.title }}</dt>
						<dd class="notice-item-desc">
							<span class="notice-item-txt">{{ noticeTime(item.notice.sendtime) }}</span>
							<span class="notice-item-txt">{{ item.notice.author || '无名' }}</span>
							<span class="notice-item-txt notice-item-opera" v-if="item.hascollect === 1" @click.stop="noticeCancel(item)">
							</span>
						</dd>
					</dl>
				</li>
			</ul>
			<!-- 页面下的分页 -->
			<div class="page-box">
				<pagination 
					@size-change="sizeChange"
					@current-change="pageChange"
					:page-size="options.pageSize"
					:page-sizes="options.pageSizes"
					:total-record="options.totalRecord"
					:current-page="options.pageNo"
				>
				</pagination>
			</div>
		</div>
		<toast-message ref="toast" :message="toastBase.message" :bgColor="toastBase.bgColor"></toast-message>
		<!-- 公告详情页 -->
		<notice-detail-page 
			v-if="noticeDetailState"
			@changeDetailState="changeDetailState" 
			:detail="noticeDetailData.data" 
			:options="noticeDetailData.options"
		>
		</notice-detail-page>
	</div>
</template>

<script>
	import { format } from '@/utils/dateFormat'
	import { pageParams } from '@/config/options'
	import page from '@/components/pagination.vue'
	import { fetchNoticeList, fetchNoticeDetail, fetchNoticeStore } from '@/api/notice'
	import noticeDetailPage from './noticeDetail'
	import SimplePage from '@/components/SimplePage'
	import Pagination from '@/components/pagination'
	import ToastMessage from '@/components/ToastMessage'

	export default {
		name: 'notice',
		data () {
			// 获取安全参数active
			let params = this.$route.params
			let temp = params ? parseInt(params.active) : 0
			let active = isNaN(temp) ? 0 : (temp > 1 || temp < 0) ? 0 : temp
			return {
				noticeDetailState: false,
				active: active,
				list: null,
				options: {
					...pageParams,
					hascollect: active === 1 ? 1 : -1,
					pageSizes: [20,40,60,80],
					pageSize: 20,
					totalRecord: 0,
					pageNo: 1
				},
				noticeDetailData: {
					options: null,
					code: -1,
					data: null
				},
				toastBase:{
					message: '^_^',
					bgColor: 'rgb(92, 92, 92)'
				}
			}
		},
		components: {
			SimplePage,
			Pagination,
			'toast-message': ToastMessage,
			'notice-detail-page': noticeDetailPage
		},
		created () {
			this.getNoticeList()
		},
		methods: {
			/*
			 * 格式化公告时间
			 * sentime 公告发布时间
			 */
			noticeTime (sendtime) {
				return format(new Date(sendtime), 'yyyy-MM-dd HH:mm')
			},
			/*
			 * 取消收藏公告
			 * id 公告ID
			 */
			async noticeCancel (item) {
				let res = await fetchNoticeStore({
					id: item.id,
					noticeId: item.noticeId,
					hascollect: item.hascollect
				})
				this.getNoticeList()
			},
			/*
			 * 公告详情跳转
			 * notice 公告Object
			 */
			async noticeDetail (notice, index) {
				//let path = '/notice/detail'
				this.noticeDetailData.options = { 'id': notice.id, 'noticeId': notice.noticeId, active: this.active, 'index': index}
				await this.getNoticeDetail(index)
				if(this.noticeDetailData.code == 0){
					this.noticeDetailState = true
					//已读状态
					this.list[index].hasread = 1
					//this.$router.push({ 'path': path, 'query': this.noticeDetailData.options })
				}else{
					this.$refs.toast.changeToastState();
				}
				//这里需要根据code不同来进行弹窗
			},
			changeActive (active) {
				if(this.active === active) {
					return false
				}
				this.active = active
				// 切换地址栏的信息
				history.pushState({ actice: active }, 'noticeList', '/notice/' + active)
				//切换收藏或公告时需重置当前页为1
				this.options.pageNo = 1
			},
			async getNoticeList () {
				let { data } = await fetchNoticeList(this.options)
				this.list = data.data.list
				this.options.totalRecord = data.data.totalCount
			},
			pageChange (pageNo) {
				this.options.pageNo = pageNo
				this.getNoticeList()
			},
			sizeChange (pageNo,pageSize) {
				this.options.pageNo = 1
				this.options.pageSize = pageSize
				this.getNoticeList()
			},
			//请求公告详情接口，因为需要判断code来处理是否跳转到详情页
			async getNoticeDetail () {
				let res = await fetchNoticeDetail(this.noticeDetailData.options)
				this.noticeDetailData.code = res.data.code
				this.toastBase.message = res.data.msg ? res.data.msg : '^__^'
				this.noticeDetailData.data = res.data.data
			},
			//屏蔽公告详情弹窗页面
			changeDetailState() {
				this.noticeDetailState = false
				this.getNoticeList()
			},
		},
		watch: {
			active (curVal, oldVal) {
				this.options.hascollect = curVal > 0  ? 1 : -1
            	this.getNoticeList()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.notice-content {
		position: relative;
		min-width: 1024px;
		height: 100%;
		overflow-y: auto;
		text-align: left;
		background-color: #FFF;
		.notice-wrap {
			width: 940px;
			margin: 0 auto;

			.page-box {
				float:left;
				padding:30px 20px 30px 0;
				box-sizing: border-box;
				width: 100%;
				text-align: center;
			}
		}
		.notice-tabs {
			padding-top: 20px;
			border-bottom: 1px solid #E8E8E8;

			.paging-turning{
				font-size: 0px;
				float: right;
				margin: 24px 20px 24px 0;
				height: 20px;
				vertical-align: middle;
				text-align: right;
			}
		}
		.notice-tab {
			display: inline-block;
			line-height: 68px;
			text-decoration: none;
			height: 68px;
			min-width: 82px;
			text-align: left;
			border: none;
			font-size: 20px;
			color: #999;
			margin-left: 20px;
			cursor: pointer;
			&.active {
				color: #333;
			}
		}
		.notice-item {			
			height: 85px;
			padding: 30px 20px;
			border-bottom: 1px solid #E8E8E8;
			color: #999;
			cursor: pointer;
			&:hover {
				background: #f9f9f9;

				.notice-item-title{
					color: #4B84F9;
				}
			}		
		}
		.notice-item-wrap {
			position: relative;
			height: 100%;
		}
		.notice-item-title {
			line-height: 26px;
			color: #333;
		}
		.hasread .notice-item-title {
			color: #999;
		}
		.notice-item-desc {
			width: 100%;
			position: absolute;
			bottom: 0;
		}
		.notice-item-txt {
			float: left;
			margin-right: 10px;
			font-size: 14px;
			color: #999;
		}
		.notice-item-opera {
			float: right;
			&:before {
				content: '已收藏';
			}
			&:hover:before {
				content: '取消收藏';
			}
		}
	}
</style>