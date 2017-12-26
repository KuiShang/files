<template>
    <div class="my-approve">
        <div class="header">
            <span>我发起的</span>
        </div>
        <div>
            <search-criteria @getSearchList="getSearchList" :optionData="optionData"></search-criteria>
        </div>
        <div class="approve-right">
            <div class="approve-right-wrap">
                <div class="approve-head">
                    <ul class="approve-sheet">
                        <li class="approve-type type-special">审批单名称</li>
                        <li class="approve-peo">申请时间</li>
                        <li class="approve-time">状态</li>
                    </ul>
                </div>
                <div class="page-overflow">
                    <div class="scroll-content">
                        <div id="approveListBox">

                            <ul @click="gotoViewform(approve)" class="sline " v-for="(approve, index) in list " :key="index">
                                <li class="approve-type type-special" :title="approve.approves.formName">
                                    {{ approve.approves.typeName }}
                                </li>
                                <li class="approve-peo" :title="time(approve.approves.time)">
                                {{ time(approve.approves.ctime)}}
                                </li>
                                <li :class="statusName(approve.approves.status).className" class="approve-time" :title="statusName(approve.approves.status)">
                                    {{ statusName(approve.approves.status).statusName }}
                                    <span class="myapprove-status">
                                        ({{ JSON.parse(approve.approves.curApprovers).name}})
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {fetchMyApprovelist} from "@/api/approve"
import searchCriteria from "@/modules/approve/components/Filter.vue"
import CONSTANT from "@/modules/approve/constant"
import filterData from "@/modules/approve/filterConst"
export default{
    name: 'myApprove',
    data () {
        return {
            list:[],
            optionData: filterData.optionData
        };
    },
    components: {
        "search-criteria": searchCriteria
    },
    created () {
        // 获取数据，赋值给data.list
        this.getMyapp();
    },
    //给当前组件提供方法 挂载this上面。
    methods:{
        async getMyapp () {
            let res = await fetchMyApprovelist ({
                typeId : CONSTANT.SENDED,
                companyId:sessionStorage.getItem('companyId')
            });
            //console.log(list);
            //this.list =list.data[1].list;
            this.list =res.data.data.list
        },
        //状态显示的6个方案
        statusName (value) {
            let status = [
            {"statusName":"草稿","className":"blueword"},
            {"statusName":"审批中","className":"blueword"},
            {"statusName":"已完成","className":"blackword"},
            {"statusName":"已终止","className":"redword"},
            {"statusName":"已撤销","className":"redword"},
            {"statusName":"已归档","className":"blackword"}];
            return status[value];
        },
        time(timer){
            let date = new Date(timer);
            let minutes = date.getMinutes();
            let month = date.getMonth()+1;
            let day = date.getDate();
            let hour = date.getHours();
            let val = date.getFullYear() +'-'+ this.checkTime(month)  + '-' + this.checkTime(day)+' '+this.checkTime(hour)+':'+this.checkTime(minutes);
            return val;
        },
        checkTime(i){
            if(i<10){
                i="0"+i;
            }
            return i;
        },
        getSearchList(data){
            console.log('我已审批筛选', data)
            this.getMyapp(data);
        },
        gotoViewform(approve) {
            //let path = `/approval/launch/${approve.approveId}`
            //this.$router.push(path)
             this.$router.push({name: 'approval-launch', params: {approveId: approve.approveId}})
        }
    }

}
</script>
<style lang="scss" scoped>
.my-approve {
    height: 100%;
    background-color: #fff;
    .header {
        height: 61px;
        margin: 0 40px;
        line-height: 61px;
        text-align: left;
        span {
            vertical-align: text-top;
            line-height: 61px;
            font-family: "microsoft yahei";
        }
    }
}
.approve-right{
    background-color: #fff;
    border-radius:3px;
    overflow: hidden;
    height: 100%;
    .approve-right-wrap{
        height:100%;
        position:relative;
        .approve-head{
            width:100%;
            height:60px;
            border-bottom:1px solid #d2d2d2;
            background-color:#f7f7f7;
            line-height:61px;
            position:relative;
            overflow:hidden;
        }
    /*列表标题头部样式开始 */
        .approve-sheet{
            width:98%;
            position:absolute;
            padding:0 1%;
            color:#333;
            li{
                float:left;
                text-align:left;
            }
        }
        .approve-type{
            width:57%;
            margin-right:5%;
            position:relative;
        }
        .approve-peo{
            width:14%;
            margin-right:7%;
            position:relative;
            float:left;
        }
        .approve-time{
            width:16%;
            margin-right:0.25%;
            position:relative;
            float:left;
        }
        .type-special{
            text-indent:10px;
        }
    /*列表头部样式结束*/
    /* 详情列表样式开始 */
        .page-overflow{
            position:absolute;
            overflow-x:hidden;
            overflow-y:auto;
            width:100%;
            top:61px;
            bottom:0;
        }
        .myapprove-status{
            color:#333;
        }
        .sline{
            height:50px;
            padding-left:10px;
            line-height:51px;
            width:98%;
            font-size:14px;
            border-bottom:1px solid #efefef;
            background-color:#fff;
            margin-left:1%;
            position:relative;
            font-size:14px;
            cursor:pointer;
            li{
                float:left;
                text-align:left;
            }
        }
        .sline:hover{
                background:#e4f2ff;
            }
    /* 详情列表样式结束 */
    }
     .blueword{
        color:#4590e4;
    }
    .redword{
        color:#f41935;
    }
    .blackword{
        color:#333;
    }
}
</style>