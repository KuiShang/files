<template>
	<div class="main">
		<div class="left">
			<ul class="approve-list" id="approveList">
				<router-link tag="li" :to="{name: 'approvalList'}" id="newApprove" class="newApprove active">新建审批</router-link>
				
				<!-- <li id="waitApprove">待我审批<div id="waitApp" class="waitApp" style="display: none;">（<span id="waitAppNum"></span>）</div></li>
				<li id="myFinishedTask">我已审批</li>
				<li id="myApprove">我发起的审批</li>
				<li id="draft">审批草稿</li>
				<li id="archive">已归档</li> -->
				<li class="">
					<router-link to="/approval/waitApprove">待我审批</router-link>
					<span class="wait-app-num" v-if="waitApprovalCount !== 0">{{waitApprovalCount}}</span>
				</li>
				<li class="">
					<router-link to="/approval/myFinishedTask">我已审批</router-link>
				</li>
				<li class="">
					<router-link to="/approval/myApprove">我发起的审批</router-link>
				</li>
				<li class="">
					<router-link to="/approval/draft">审批草稿</router-link>
				</li>
				<li class="">
					<router-link to="/approval/archive">已归档</router-link>
				</li>

			</ul>
		</div>
		<div class="right">
			<router-view></router-view>
		</div>
	</div>
</template>
<script>
	import { fetchBaseStaffInfos, fetchLightList, fetchCacheStaffInfos } from '@/api/currency'	
	import { mapGetters } from 'vuex';
	import * as types from '@/store/mutation-types';
	export default {
		name: 'Approve',
		data() {
			return {
			}
		},
		created() {
			// this.getBaseStaffInfos()
			// this.getLightList()
			this.getStaffInfos()
		},
		computed: {
			...mapGetters([	
                'waitApprovalCount'
            ])
		},
		methods: {
			//获取全量员工信息并存到sessionStorage
		    // async getBaseStaffInfos(){
		    // 	let baseStaffInfos=await fetchBaseStaffInfos({
		    // 		params:{
		    // 			companyId:1
		    // 		}
		    // 	})
		    // 	sessionStorage.setItem("baseStaffInfos",JSON.stringify(baseStaffInfos.data))
		    // },
		    //获取全量职务信息并存到sessionStorage
		    // async getLightList(){
		    // 	let lightList = await fetchLightList({
		    // 		params:{
		    // 			companyId:1
		    // 		}
		    // 	})
		    // 	sessionStorage.setItem("lightList",JSON.stringify(lightList.data))
		    // },

		    //获取全量员工信息并保存到sessionStorage中（员工信息较全）
		    async getStaffInfos() {
		    	let res= await fetchCacheStaffInfos({
		    		companyId:sessionStorage.getItem('companyId')
		    	})
		    	sessionStorage.setItem("cacheStaffInfos",JSON.stringify(res.data.data.list))
			}
		}
	}
</script>
<style lang="scss" scoped>
.router-link-active {
	background-color: #e4e4e4 !important;
}
.dialog-content {
	height: 379px;
}
	@mixin size($width:auto,$height:auto){
		width: $width;
		height:$height
	}
	.main {
		@include size(100%,100%);
		.left {
			background-color: #f1f1f1;
		    border: none;
		    @include size(300px,100%);
		    border-right: 1px solid #d2d2d2;
		    /* margin-right: -100%; */
		    float: left;
			text-align: left;

			.newApprove {
				@include size(100%, 60px);
				box-sizing: border-box;
				border-bottom: 1px solid #d2d2d2;
				padding-left: 46px;
				line-height: 60px;
				font-size: 14px;
				cursor: pointer;
				background: url(../../assets/imgs/approve/creat_newApp.png) no-repeat 20px 21px;
			}

			li {
				@include size(100%, 42px);
				box-sizing: border-box;
				line-height: 42px;
				font-size: 12px;
				position: relative;

				.wait-app-num{
					@include size(30px ,16px);
					position: absolute;
					right: 20px;
					top: 13px;
					background-color: #999;
					color: #fff;
					border-radius: 16px;
					line-height: 16px;
					text-align: center;
				}

				a {
					box-sizing: border-box;
					display: block;
					padding-left: 20px;
					color: #000;
					cursor: pointer;
					&:hover, &:active {background-color: #eaeaea;}
				}
			}
		}
		.right {
			@include size(auto,100%);
			overflow:hidden;
			background-color:#ffffff;
		}
	}
</style>