<template>
	<div class='list'>
		<div class="table-top" v-if="tableTop" ref="tableTop">
			<slot name="table-top"></slot>
			<simple-page
				:total-record="totalRecord"
				:current-page="pageNo"
				:page-size="pageSize"
				@current-change="currentChange">
			</simple-page>
		</div>
		<div class="clearfix table-header" ref="tableHeader">
			<slot name="table-header"></slot>
		</div>
		<div class="table-box">
			<div v-if="listData.length == 0" class="table-nodata">
				<slot name="table-nodata"></slot>
			</div>
			<template v-show="listData.length > 0">
				<div class="clearfix table-body" ref="tableBody">
					<slot name="table-item" v-for="(item, index) in listData" :item="item" :index="index"></slot>
					<div class="pages-box">
						<pagination
							:total-record="totalRecord"
							:current-page="pageNo"
							:page-size="pageSize"
							@size-change="sizeChange"
		        			@current-change="currentChange"
						></pagination>
					</div>
				</div>
			</template>
			
		</div>
	</div>
</template>
<script>
/*<gome-table
    :list-data="list"  //type:Array   required 列表数据
    :total-record="40"	// type:Number required  数据的总条数
    table-top			// type:Boolean  是否添加 top-box 默认false(不添加)
    @size-change="sizeChange"	// 每页显示数量 变更 回调函数(参数2个：pageSize, currentPage )
    @current-change="currentChange">  //页码变更 回调函数(参数2个：currentPage, pageSize)

    <template slot="table-top">
		//小分页自带 不需要填写， 只需要填写 top-box 左侧部分		
    </template>
    
    <template slot="table-header">
        //表头
    </template>

    <template slot="table-item" scope="props">
        //表格内容
    </template>
</gome-table>*/
import { pageParams } from '@/config/options'
const simplePage = () => import('./SimplePage.vue')
const pagination = () => import('./pagination.vue')
export default {
	data(){
		return {
			...pageParams,
			tableBodyOffsetTop: 0,
			clientHeight: 0
		}
	},
	components:{
		pagination,
		simplePage
	},
	props:{
		listData:{
			type: Array,
			default(){
				return []
			}
		},
		totalRecord:{
			type: Number,
			default: 0
		},
		tableTop:{
			type: Boolean,
			default: false
		}
	},
	methods:{
		sizeChange(size){
			this.pageSize = pageSize
			this.$emit("size-change", size)
		},
		currentChange(currentPage){
			this.pageNo = currentPage
			this.$emit("current-change", currentPage)
		},
		resize(){
			const tableBody = this.$refs.tableBody
			if(!tableBody) return;
			
			const clientHeight = document.documentElement.clientHeight

			const tableBodyOffsetTop = this.getOffsetTop(tableBody)
			
			if(this.tableBodyOffsetTop == tableBodyOffsetTop && clientHeight == this.clientHeight) return;
			this.tableBodyOffsetTop = tableBodyOffsetTop
			this.clientHeight = clientHeight

			tableBody.style.height = clientHeight - tableBodyOffsetTop + 'px';
		},
		getOffsetTop(el,root){
			if(el == root)return 0;
			let top = 0
			while(el){
				top += el.offsetTop
				el = el.offsetParent
				if(el == root) break;
			}
			return top
		}
	},
	mounted(){
		window.addEventListener('resize', this.resize, false)
	},
	watch:{
		listData(next , pre){
			if(next.length == pre.length){
				return;
			}
			this.$nextTick(()=>{
				this.resize()
			})
		}
	}
}
</script>
<style scoped lang="scss">
	.list{
		width:100%;
		height:100%;
		.table-top {
			position: relative;
		}
		.simple-page {
			position: absolute;
			right: 0;
			top: 50%;
			transform: translateY(-50%);
		}
		.table-header{
			position: relative;
			z-index: 3;
		}
		.table-body{
			position: relative;
			overflow-y: auto;
			overflow-x: hidden;
		}
		.pages-box{
			padding:31px 20px 31px 0px;
		}
		.table-box{
			position: relative;
		}
		/* .table-nodata{
			position:absolute;
			top:0;
			left:0;
		} */
	}
</style>