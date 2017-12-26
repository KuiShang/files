<template>
	<li>
		<div class="leaf" :class="{'leaf-selected':deptSelected}"
		      @click="show($event,model.id)">
		      <a class="collopse-btn" :class="{expand:open,hideBtn:!hasChild}"></a>
		      <span class="folder-icon"></span>
		      {{model.deptName}}
		</div>
	    <ul v-show="open" v-if="hasChild">
	      <deptTree
	        class="item"
	        v-for="model in model.children"
	        :model="model" key="model.id">
	      </deptTree>
	    </ul>
  	</li>
</template>

<script>
import { mapMutations } from "vuex"
export default{
	name:'deptTree',//组件递归调用，加name属性
    props: ['model'],
    data: function () {
        return {
            open: false
        }
    },
    created:function(){
    },
    computed: {
    	deptSelected:function(){
    		return this.model.id == this.selectedId ? true : false;
    	},
        hasChild: function () {
            return this.model.children &&
        this.model.children.length
        },
        selectedId(){
        	return this.$store.state.approveTreeSelected
        }
    },
    methods: {
        show: function(event,deptId){
        	event=event||windowm.event;
            var target=event.target || event.srcElement;
            if(target.tagName.toLowerCase() == "a"){
                if (this.hasChild) {
                    this.open = !this.open
                } 
            }else{
            	if(deptId!=this.selectedId){

            		this.CHANGE_APPROVE_TREE_SELECTED(deptId)	
             	}else{
                    this.open=!this.open;
                }
            }
        },
        ...mapMutations([
        	'CHANGE_APPROVE_TREE_SELECTED'
        ])
    }	
}
</script>

<style lang="scss" scoped>
	ul,li{
		padding: 0;
		margin: 0;
	}
	li{
		list-style: none;
	}
	// .root-leaf{
 //    	height: 42px;
 //    	border-bottom: 1px solid #d2d2d2;
 //    }
 //    .position{
 //    	width: 300px;
 //    	position: absolute;
 //    	top: 43px;
 //    	bottom: 0;
 //    	overflow-x: hidden;
 //    	overflow-y:auto;
 //    }
	.leaf{
		vertical-align: middle;
	    line-height: 25px;
	    height: 25px;
	    text-align: left;
	    white-space: nowrap;
		&:hover{
			background-color: #eef7fd;
		}
	}
	.leaf-selected{
		background: #eef7fd !important;
	}
	.folder-icon{
		display: inline-block;
		width: 11px;
		height: 12px;
		background: url("../assets/imgs/icons.png") no-repeat -235px -24px;
	}
	.collopse-btn{
		display: inline-block;
		width: 11px;
		height: 12px;
		background: url("../assets/imgs/icons.png") no-repeat -250px -24px;
		margin-left: 7px;
	}
	.hideBtn{
		visibility: hidden;
	}
	.expand{
		background-position: -267px -26px
	}
	.selected{
		background: #e4e4e4 !important;
	}
	.item{
		white-space: nowrap;
		font-size: 14px;
		cursor: pointer;
	}
	.item .leaf{
		padding-left: 0;
	}
	.item .item .leaf{
		padding-left: 10px;
	}
	.item .item .item .leaf{
		padding-left: 20px;
	}
	.item .item .item .item .leaf{
		padding-left: 30px;
	}
	.item .item .item .item .item .leaf{
		padding-left: 40px;
	}
</style>