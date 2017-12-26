<template>
    <div class="approve-form-list">
        <div class="approve-line">
            <div class="item-title" style="-webkit-box-orient: vertical">{{ titleUnit }}</div>
            <div class="item-value">
                <span class="wrap" v-if="!ifShowCheckList" :class="{none: none}">{{ checkTypeName }}</span>
                <span class="wrap" v-if="ifShowCheckList" >{{ checkedArr | getCheckedText }}</span>
                <!-- <div class="wrap" v-if="ifShowCheckList">
                    <div class="checked-list" v-for="(item, idx) in checkedArr" :key="idx">
                        <span class="option">{{ item.option }}</span>
                        <span class="detail" :class="item.id | getClassName">{{ item.id | getText }}</span>
                    </div>
                </div> -->
            </div>  
        </div>
    </div>
</template>

<script>
    import  { format } from '@/utils/dateFormat'
    export default {
        props: {
            value: {
                type: Object
            }
        },
        data () {
            return {
            	ifShowCheckList: false,
                none: false
            };
        },
        computed: {
            checkTypeName () {
                if (this.value.typeName === 'radio') {
                    this.ifShowCheckList = false;
                    for (let item of this.value.items) {
                        if (Number(this.value.value) === item.id) {
                            let selectValue = item.item;
                            return selectValue;
                        }
                    }
                } else if (this.value.typeName === 'checkbox') {
                	this.ifShowCheckList = true;
                	// 单独处理多选组件
                    return;
                } else if (this.value.typeName === 'date') {
                    this.ifShowCheckList = false;
                    return format(new Date(Number(this.value.value)), this.value.format);
                }

                if (this.value.value) {
                	return this.value.value;
                } else {
                	this.none = true;
                	return '无';
                }
            },
            titleUnit () {
                let title = this.value.title;
                if (this.value.typeName === 'number') {
                    if (this.value.extra1 && JSON.parse(this.value.extra1).unit) {
                        let unit = '(' + JSON.parse(this.value.extra1).unit + ')';
                        return title + unit;
                    }
                }

                return title;
            },
            checkedArr () {
            	let arr = [];
            	let valueArr = this.value.value.split(',');
                for (let i = 0; i < valueArr.length; i++) {
                    let obj = {};
                    obj.id = Number(valueArr[i]);
                    obj.option = this.value.items[i].item;
                    arr.push(obj);
                }
                return arr;
            }
        },
        filters: {
            getText (id) {
            	return id > -1 ? '是' : '否';
            },
            getClassName (id) {
                return id > -1 ? 'colored' : '';
            },
            getCheckedText (checkedArr) {
                let value = ''
                checkedArr.forEach( item => {
                    if (item.id > -1) {
                        value = item.option
                    }
                })
                return value
            }
        }
    };
</script>

<style lang="scss" type="text/css" rel="stylesheet/scss" scoped>
.approve-form-list {
    margin-top: 56px;
    .approve-line {
        width: 100%;
        margin-top: 48px;
        text-align: left;
        .item-title {
            color: #333;
            font-weight: bold;
            font-size: 16px;
            margin-left: 50px;
            margin-bottom: 19px;
            line-height: 20px;
        }
        .item-value{
            margin: 0 50px;
            line-height: 20px;
            color: #333;
            font-size: 14px;
        }
    }
}
</style>
