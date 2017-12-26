<template>
	<div class="">
		<!--搜索框-->
		<div class="search-box">
			<input type="text" name="" class="search-input" v-model="searchValue" @keyup.enter="search">
			<button class="search-btn" @click="search"></button>
			<button class="clear-btn" @click="emptySearchInput" :class="{'clear-btn-show':isEmpty}"></button>
		</div>
		<!--选人部分-->
		<div class="select-box">
			<!--左侧树-->
			<div class="left">
				<!--所有成员和职务的按钮-->
				<div class="operation">
					<p>所有成员</p>
				</div>
				<div class="select-content">
					<!--树-->
					<ul class="tree-root" :class="{'tree-root-show':memberSelected}">
						<deptTree v-for="dept in depts.children" key="dept.id"
					    class="item"
					    :model="dept">
						</deptTree>
					</ul>
				</div>
			</div>
			<!--右侧表格-->
			<div class="right">
				<div class="title">
					<p class="name">姓名</p>
					<p class="duty">职务</p>
				</div>
				<div class="staff-content">
					<table class="table" v-if="tableList.length>0">
						<template v-for="line in tableList">
							<tr class="tr-line" @click="staffSelected(line)" :class="{'tr-selected':line.id==selectedStaff}">
								<td class="td-name"><nobr>{{line.staffName}}<span class="part-icon" v-if="line.partTime==1">兼</span></nobr></td>
								<td class="td-job"><nobr>{{line.dutyName}}</nobr></td>
							</tr>
						</template>
					</table>
					<p class="no-data" v-if="tableList.length==0">暂无数据</p>
				</div>
			</div>
		</div>
		<!--已选人部分-->
		<div class="selected-box">
			<!--清空按钮所在行-->
			<div class="selected-title">
				<span class="intro">已选人员(单击移除)</span>
				<a class="empty-btn" href="javascript:void(0)" @click="empty">清空</a>
			</div>
			<div class="selected-content">
				<table class="table" v-if="selectedList.length>0">
					<tr class="thead">
						<th class="td-name">姓名</th>
						<th class="td-job">职务</th>
						<th class="td-dept">部门</th>
					</tr>
					<template v-for="line in selectedList">
						<tr class="tr-line" @click="deleteSelected(line)">
							<td class="td-name"><nobr>{{line.name}}</nobr></td>
							<td class="td-job"><nobr>{{line.job}}</nobr></td>
							<td class="td-dept"><nobr>{{line.dept}}</nobr></td>
						</tr>
					</template>
				</table>
			</div>
		</div>
	</div>
</template>

<script type="text/javascript">
import deptTree from './DeptTree'
import { mapMutations } from "vuex"
export default{
	props:['staffs','depts','deptStaff','initStaff'],
	components:{deptTree},
	data:function(){
		return {
			memberSelected:true,//所有成员按钮的选中标志
			dutySelected:false,//职务按钮的选中标志
			tableList:[],//右侧表格中员工信息列表
			selectedList:[],//已选人员的列表
			searchValue:'',//搜索输入框的值
			deptAndStaff:{},//部门与员工对象 以部门id作为key
			selectedStaff:'',//被选中的员工的id
		}
	},
	created:function(){
		this.deptAndStaff=this.deptStaff
		this.initData()
	},
	mounted:function(){
		
	},
	computed:{
		isEmpty:function(){
			return this.searchValue.length>0 ? true : false;
		},
		treeSelectedId(){
			return this.$store.state.approveTreeSelected
		}
	},
	watch:{
		treeSelectedId(){
			this.tableList=this.deptAndStaff[this.treeSelectedId] || []
		},
		initStaff(newValue,oldValue){
			this.initData()
		}
	},
	methods:{
		/**
		* 搜索框按钮的点击作用
		*/
		search:function(){
			this.tableList=[];
			//去除头尾空格
			this.searchValue=this.searchValue.replace(/(^\s*)|(\s*$)/g, "");
			for(let i=0,length=this.staffs.length;i<length;i++){
				let staff=this.staffs[i]
				if(staff.staffName.indexOf(this.searchValue)>-1){
					this.tableList.push(staff);
				}
			}
		},
		/**
		* 清空搜索输入框
		*/
		emptySearchInput:function(){
			this.searchValue='';
		},
		/**
		* 清空已选人员列表
		*/
		empty:function(){
			this.selectedList=[];
			this.selectedStaff="";
			//去除树的选中
			this.CHANGE_APPROVE_TREE_SELECTED(-1)
			this.$emit("pushSelectedValue",{})
		},
		/**
		* 员工列表选中
		*/
		staffSelected:function(staff){
			let selectedStaff={};
			selectedStaff.id=staff.id;
			selectedStaff.name=staff.staffName;
			selectedStaff.job=staff.dutyName;
			selectedStaff.dept=staff.deptName;
			this.selectedList=[];
			this.selectedList.push(selectedStaff);
			this.selectedStaff=staff.id;
			this.$emit("pushSelectedValue",selectedStaff)
		},
		/**
		* 单击选中的员工会删除
		*/
		deleteSelected:function(selected){
			//因为只显示一条记录 所以可以 调用empty方法
			this.empty();
		},
		/**
		* 选人控件选中数据初始化
		*/
		initData(){
			if(this.initStaff){
				for(let i=0,length=this.staffs.length;i<length;i++){
					let staff=this.staffs[i]
					let selected=this.initStaff
					if(staff.partTime == 0 && staff.id == selected){
						let selectedStaff={};
						selectedStaff.id=staff.id;
						selectedStaff.name=staff.staffName;
						selectedStaff.job=staff.dutyName;
						selectedStaff.dept=staff.deptName;
						this.selectedList=[];
						this.selectedList.push(selectedStaff);
						this.selectedStaff=staff.id;
						break;
					}
					
				}
			}else{
				this.selectedList=[]
				this.selectedStaff=""
			}
		},
		...mapMutations([
        	'CHANGE_APPROVE_TREE_SELECTED'
        ])
	}
}	
</script>

<style lang="scss" scoped>
	/*box的border radius样式*/
	@mixin box-border-radius{
		-webkit-border-radius: 3px;/*Safari, Chrome*/
		-moz-border-radius: 3px;/*Firefox*/
		border-radius: 3px;
	}
	/*列表的hover效果*/
	@mixin table-hover{
		background-color: #eef7fd;
	}

	/*表格头的设置以及hover*/
	@mixin table-header{
		height: 30px;
		line-height: 30px;
		font-family: "microsoft yahei";
		font-size: 14px;
		text-align: center; 
		outline: none;
	    background: #ffffff;
	    border: none;
	    padding:0;
		margin: 0;
	}
	@mixin table-header-hover{
		background-color: #4590e4;
    	color: #fff;
	}

	/*列表单行样式*/
	@mixin tr-line{
		margin: 0;
		padding: 0;
		line-height: 25px;
	    height: 25px;
	    text-align: left;
	    white-space: nowrap;
	    box-sizing: border-box;
		cursor: pointer;
		font-size: 14px;
	}
	@mixin tr-line-hover{
		background-color: #eef7fd
	}
	@mixin tr-line-selected{
		background-color: #eef7fd
	}

	/*box大小*/
	@mixin size($width,$height){
		width: $width;
		height: $height;
	}
	ul,li{
		padding: 0;
		margin: 0;
	}
	li{
		list-style: none;
	}
	.search-box{
		@include size(480px,35px)
	    position: relative;
	    .search-input{
	    	@include size(480px,35px)
	    	@include box-border-radius
	    	padding-left: 30px;
		    border: 1px solid #ccc;
		    outline: none;
		    box-sizing:border-box;
	    }
	    .search-btn{
	    	@include size(16px,16px)
	    	margin-left: 7px;
		    padding: 0;
		    background: url(../assets/imgs/icons.png) no-repeat -134px -21px;
		    border-style: none;
		    position: absolute;
		    top: 50%;
		    left: 0;
		    margin-top: -8px;
		    cursor: pointer;
		    outline: none;
	    }
	    .clear-btn{
	    	@include size(16px,16px)
	    	padding: 0;
		    border: none;
		    background: url(../assets/imgs/icons.png) no-repeat -194px -73px;
		    position: absolute;
		    top: 50%;
		    margin-top: -6px;
		    right: 8px;
		    cursor: pointer;
		    display: none;
		    outline: none;
	    }
	    .clear-btn-show{
	    	display: block;
	    }
	    &:hover{
	    	.search-input{
	    		border-color: #419ce3;
	    	}
	    	.search-btn{
	    		background-position: -159px -21px;
	    	}
	    }
	}
	.select-box{
		@include size(478px,240px)	
	    @include box-border-radius
		margin-top: 15px;
	    border: 1px solid #ccc;
	    overflow: hidden;
	    .left{
	    	@include size(238,240px)
	    	border-right: 1px solid #ccc;
		    float: left;
		    overflow: hidden;
		    .operation{
		    	height: 30px;
		    	line-height: 30px;
		    	background-color: #4590e4;
    			color: #fff;
    			padding-left: 12px;
		    	border-bottom: 1px solid #ccc;
		    }
		    .member-btn,.job-btn{
		    	@include size(119px,auto)
		    	float: left;
			    cursor: pointer;
			    @include table-header
			    &:hover{
			    	@include table-header-hover
			    }
		    }
		    .btn-selected{
		    	background-color: #4590e4;
    			color: #fff;
		    }
		    .member-btn{
		    	border-right: 1px solid #ccc;
		    }
		    .operation{
		    	overflow: hidden;
		    }
		    .select-content{
		    	@include size(238px,210px)
			    overflow: auto;
			    padding-top: 5px;
			    box-sizing: border-box;
		    }
		    .tree-root{
		    	width: auto;
		    	padding: 0;
		    	margin: 0;
		    	display: none;
			}
			.tree-root-show{
				display: block;
			}
			.dept-list{
				display: none;
			}
			.dept-list-show{
				display: block;
			}
			.dept-line{
			    @include tr-line
			    padding-left: 30px;
			    &:hover{
			    	@include tr-line-hover
			    }		
			}
	    }
	    .right{
	    	@include size(239px,240px)
	    	float: left;
	    	.title{
	    		overflow: hidden;
	    		border-bottom: 1px solid #ccc;
	    		.name,.duty{
	    			@include table-header
				    width: 119px;
				    float: left;  
	    		}
	    		.name{
	    			border-right: 1px solid #ccc;
	    		}
	    	}
	    	.staff-content{
	    		@include size(auto,210px)
	    		overflow: auto;
			    padding-top: 5px;
			    box-sizing: border-box;
			    .table{
			    	width: 100%;
			    	border: 0px;
				    border-collapse: collapse;
				    font-size: 14px;
				    font-family: "microsoft yahei";
				    .tr-line{
				    	@include tr-line
    					&:hover{
    						@include tr-line-hover
    					}
    					.td-name{
    						padding-left: 15px;
						    min-width: 120px;
						    box-sizing: border-box;
    					}
    					.part-icon{
			    			margin-left: 5px;
						    padding: 2px 4px;
						    border-radius: 3px;
						    background-color: #f0a522;
						    color: #fff;
						    font-size: 12px;
			    		}
    					.td-job{
    						padding-left: 15px;
						    min-width: 118px;
						    box-sizing: border-box;
    					}
				    }
				    .tr-selected{
				    	background: #eef7fd;
				    }
			    }
			    .no-data{
			    	color: #cccccc;
				    text-align: center;
				    margin-top: 65px;
				    font-size: 14px;
			    }
	    	}
	    }
	}
	.selected-box{
		.selected-title{
			@include size(478px,38px)
		    line-height: 38px;
		    position: relative;
		    border: 1px solid transparent;
		    .intro{
		    	font-size: 14px;
			    font-family: "microsoft yahei";
			    display: inline-block;
			    vertical-align: middle;
			    float: left;
		    }
		    .empty-btn{
		    	@include size(65px,40px)
		    	display: inline-block;
			    position: absolute;
			    right: 0;
			    color: #000;
			    text-decoration: none;
			    font-size: 14px;
		    }
		}
		.selected-content{
			@include size(478px,110px)
			border: 1px solid #ccc;
		    @include box-border-radius
		    overflow: auto;
		    box-sizing: border-box;
		    .table{
		    	width: 100%;
		    	border: 0px;
			    border-collapse: collapse;
			    font-size: 14px;
			    font-family: "microsoft yahei";
			    .thead{
			    	@include table-header;
			    	border-bottom:1px solid #ccc;
			    	.td-name,.td-job,.td-dept{
			    		font-weight: normal;
			    		text-align: center;
			    	}
			    	.td-name{
			    		width: 148px;
					    box-sizing: border-box;
			    		border-right:1px solid #ccc;
			    	}
			    	.td-job{
			    		border-right:1px solid #ccc;
			    		width: 200px;
					    box-sizing: border-box;
			    	}
			    	.td-dept{
			    		width: 127px;
					    box-sizing: border-box;
			    	}
			    }
			    .tr-line{
			    	@include tr-line
					&:hover{
						@include tr-line-hover
					}
					.td-name{
						text-align: center;
						width: 148px;
					}
					.td-job{
						text-align: center;
					    width: 200px;
					}
					.td-dept{
						text-align: center;
					    width: 127px;
					}
			    }
		    }
		}
	}
	
</style>