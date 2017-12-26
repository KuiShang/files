<template>
<div class="vue-dist-picker"  v-clickoutside="immEndChoice">
	<div class="el-input" @click="startChoice">
	<i class="el-input__icon el-icon-caret-top" :class="{'is-reverse' : distPanelIsShow}"></i>
	<input type="text" class="el-input__inner" readonly="readonly" autocomplete="off" icon="caret-top" disableautocomplete :placeholder="placeholder" :value="showName"
		@focus="startChoice" @keypress="startChoice"  ref="input">
	</div>
	<!--选择面板-->
	<div class="vdp-panel" v-show="distPanelIsShow">
		<h5>选择省市区</h5>
		<ul class="vdp-tags">
			<li :class="{'z-on': activatedTag==1}" @click="activeTag(1)">{{ currProv.name }}</li>
			<li :class="{'z-on': activatedTag==2}" @click="activeTag(2)" v-if="provId">{{ currCity.name }}</li>
			<li :class="{'z-on': activatedTag==3}" @click="activeTag(3)" v-if="cityId">{{ currDist.name }}</li>
		</ul>
		<div class="vdp-list">
			<ul v-if="activatedTag==1">
				<li v-for="(item, idx ) in provList" @click="choiceProv(item.id)" :key="idx" :title=" item.name ">{{ item.name }}</li>
			</ul>
			<ul v-if="activatedTag==2">
				<li v-for="(item, idx ) in cityList" @click="choiceCity(item.id)" :key="idx" :title=" item.name ">{{ item.name }}</li>
			</ul>
			<ul v-if="activatedTag==3">
				<li v-for="(item, idx ) in distList" @click="choiceDist(item.id)" :key="idx" :title="item.name ">{{ item.name }}</li>
			</ul>
		</div>
	</div>
</div>

</template>

<script>

import Vue from 'vue'
import VueClickoutside from './clickoutside.js'
import DIST_PICKER_LIST from 'china-dist-data'
const collection = {
    /*
	 * 通过id获取集合条目，取得条目
	 */
	get(arr, id, field = 'id') {
		let res = null;
		if (typeof arr == 'object' && typeof arr.length != 'undefined' && arr.length > 0) {
			arr.forEach((item) => {
				if (item[field] == id) {
					res = item;
				}
			});
		}
		return res;
	}
};

export default {
	name : 'cascader',
	directives: {
		'clickoutside' : VueClickoutside
	},
	create() {
		this.setShowName();
	},
	props: {
		placeholder: {
			type: String,
			default: '请选择城市'
		}
	},
	data() {
		return {
			distPanelIsShow: false,
			activatedTag : 1, //1省 2市 3区
			provList: DIST_PICKER_LIST['-1'],
			provId:'',
			cityId:'',
			distId:'',
			showName:''
		};
	},
	computed: {
		cityList() {
			let {
				provId
			} = this;
			if (provId && typeof DIST_PICKER_LIST[provId] != 'undefined') {
				return DIST_PICKER_LIST[provId];
			} else {
				return [];
			}
		},
		distList() {
			let {
				cityId
			} = this;
			if (cityId && typeof DIST_PICKER_LIST[cityId] != 'undefined') {
				return DIST_PICKER_LIST[cityId];
			} else {
				return [];
			}
		},
		currProv() {
			let {
				provList,
				provId
			} = this;
			if (provId) {
				return collection.get(provList, provId);
			} else {
				return {
					id: '',
					name: '请选择'
				};
			}
		},
		currCity() {
			let {
				cityList,
				cityId
			} = this;
			if (cityList.length > 0 && cityId) {
				return collection.get(cityList, cityId);
			} else {
				return {
					id: '',
					name: '请选择'
				};
			}
		},
		currDist() {
			let {
				distList,
				distId
			} = this;
			if (distList.length > 0 && distId) {
				return collection.get(distList, distId);
			} else {
				return {
					id: '',
					name: '请选择'
				};
			}
		}
	},
	methods: {
		// 开始选择（显示省市区面板）
		startChoice(e) {
			if (e && e.type == 'keypress') {
				e.returnValue = false;
			}
			this.distPanelIsShow = true;
		},
		activeTag(k) {
			this.activatedTag = k;
		},
		choiceProv(id) {
			this.provId = id;
			this.cityId = '';
			this.distId = '';
			this.activeTag(2);
		},
		choiceCity(id) {
			this.cityId = id;
			this.distId = '';
			this.activeTag(3);
		},
		choiceDist(id) {
			this.distId = id;
			this.setShowName();
			this.immEndChoice();
			this.$emit('change', this.currDist);
		},
		setShowName() {
			let {
				currProv,
				currCity,
				currDist
			} = this;
			if (currProv.id && currCity.id && currDist.id) {
				this.showName = currProv.name + '-' + currCity.name + '-' + currDist.name;
			} else {
				this.showName = '';
			}
		},
		// 立即关闭省市区面板
		immEndChoice() {
			if (this.distPanelIsShow) {
				this.$emit('visible-change', this.currDist )
			}
			this.distPanelIsShow = false;
			
		}
	}
}

</script>

<style lang="scss" scoped>

$grey1: #DDD;
$grey2: #f2f2f3;
// $c1: #d01;
// $c2: #dd606a;
$c1: #89aef9;
$c2: #8babec;

@keyframes vueDistPicker {
	0% {
		opacity: 0;
		transform: translate(-50%, -50%) scale(0);
	}

	100% {
		opacity: 1;
		transform: translate(0) scale(1);
	}
}
div.vue-dist-picker {

	.el-input__icon {
		transition: transform .3s;
		transform: translateY(-50%) rotateZ(180deg);
		top: 50%;
		cursor: pointer;
	}
	.el-input__inner {
		width: 100%;
		height: 36px;
		border: none;
		border-bottom: 1px solid #e5e5e5;
		border-radius: 0px;
		padding-left: 0px;
		cursor: pointer;
	}
	.is-reverse {
		transform: translateY(-50%);
	}

}


.vue-dist-picker {
	position: relative;
	margin: 0;
	padding: 0;
	font: 12px/1.5 'Microsoft YaHei',tahoma,arial,'Hiragino Sans GB','\\5b8b\4f53',sans-serif;
	color: #666;

	* {
		margin: 0;
		padding: 0;
		box-sizing: content-box;
	}

	input {
		display: block;
		width: 245px;
		height: 28px;
		padding-left: 6px;
		border: 1px solid $grey1;
		outline: none;
		font-size: 14px;
	}

	li {
		list-style-type: none;
	}

	.vdp-panel {
		position: absolute;
		z-index: 99999;
		left: 0;
		padding: 12px 10px 0;
		width: 320px;
		border: 1px solid $grey1;
		box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.18);
		overflow: hidden;
		background-color: #FFF;
		animation: vueDistPicker 0.1s ease-out;

		h5 {
			margin-bottom: 5px;
			padding-left: 2px;
			color: #aaa;
			line-height: 1.5;
			font-weight: normal;
		}

		.vdp-tags {
			margin: 5px 0;
			border-bottom: 2px solid $c2;

			&::after {
				content: '';
				display: block;
				clear: both;
			}

			li {
				position: relative;
				display: block;
				bottom: -2px;
				float: left;
				margin-right: 6px;
				padding: 0 4px;
				width: 85px;
				font-size: 12px;
				line-height: 24px;
				height: 23px;
				text-align: center;
				border: 1px solid #ccc;
				border-bottom: none;
				cursor: pointer;
				font-weight: bold;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;

				&.z-on {
					color: $c1;
					border-color: $c2;
					border-width: 2px;
					border-bottom: 2px solid #fff;
				}
			}
		}

		.vdp-list {
			overflow: hidden;
			border-bottom: 10px solid #fff;

			ul {
				padding: 10px 12px 20px;
				line-height: 28px;
				overflow: hidden;

				li {
					float: left;
					display: block;
					width: 70px;
					padding-left: 4px;
					cursor: pointer;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;

					&:hover {
						color: $c1;
						background-color: $grey2;
					}
				}
			}
		}
	}
}


</style>
