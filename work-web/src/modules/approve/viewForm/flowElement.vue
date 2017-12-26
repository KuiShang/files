<template>
    <div class="flow-table">
        <ul class="flow-thead">
                <li>审批流程</li>
        </ul>
        <ul class="flow-item">
            <li>
                <div class="fitem-title">
                    <div class="approve-view-process">
                        <p class="view-process-status">
                            <span>发起申请</span>
                        </p>
                        <p class="view-process-time">{{ approves.ctime | formatDate }}</p>
                    </div>
                    <div class="view-process-user-dept clearfix">
                        <div class="info-img clearfix" :style="{backgroundColor: randomColor(Number(ownInfo.id))}">{{ ownInfo.staffName | takeLastTwo}}</div>
                        <div class="info-content clearfix">
                            <span class="name pr10">{{ ownInfo.staffName }}</span>
                            <span class="additional">
                                <span>{{ownInfo.staffInfoToUser | staffInfoMainShow}}</span>
                            </span>
                        </div>
                    </div>
                     <p class="under-line"></p>
                </div>
                <div class="flow-dot">
                    <span class="dot default-span">&nbsp;</span>
                </div>
                <div class="first-node fitem-cover"></div>
            </li>
        </ul>
        <!-- notes有值时 start-->
        <!--我发起的-->
        <ul class="flow-item" v-for="(note, index) in featureNotes" :key="index">
           
           <li>
                <div class="fitem-title">
                    <div class="approve-view-process">
                        <p class="view-process-status">
                           <span class="status" :class="note.resultCode | getClass">{{ note.resultStatusText }}</span>
                        </p>
                        <p class="view-process-time">{{ note.utime | formatDate }}</p>
                    </div>
                    <div class="view-process-user-dept clearfix">
                        <!-- notes有撤销时 -->
                        <div v-if="note.resultCode === 3" class="info-img clearfix" :style="{backgroundColor: note.backgroundColor}">{{ ownInfo.staffName | takeLastTwo}}</div>
                        <div v-else class="info-img clearfix" :style="{backgroundColor: note.backgroundColor}">{{ note.staffName | takeLastTwo}}</div>
           
                        <div class="info-content clearfix">
                            <span class="name pr10">{{ note.staffName }}</span>

                            <span v-if="note.resultCode === 3" class="additional">
                                <span>{{ownInfo.staffInfoToUser | staffInfoMainShow}}</span>
                            </span>
                            <span v-else v-for="(deptNameDutyName, idx ) in note.staffInfoToUser" :key="idx" class="additional">
                                <span>{{deptNameDutyName | staffInfoShow}}</span>
                                <span v-if="deptNameDutyName.partTime" class="partTime_1">兼</span>
                                <span>, </span>
                            </span>
                        </div>
                    </div>
                    <div class="view-process-note mb24" >
                        <p v-if="note.note" class="reason">审批意见: {{ note.note | formatToObj }}</p>
                    </div>
                     <p class="under-line"></p>
                </div>
                <div class="flow-dot">
                    <span class="dot " :class="note.resultCode | getDotClass" >&nbsp;</span>
                </div>
                <div v-if="index === featureNotes.length-1" class="fitem-cover block-cover"></div>
                <div v-else class="fitem-cover"></div>
           </li>
        </ul>
        <div class="bottom-whiteSpace"></div>
    </div>
</template>

<script>
    import  { format } from '@/utils/dateFormat'
    import mixin from "@/modules/approve/mixin";
    export default {
        props: {
            notes: {
                type: Array
            },
            ownInfo: {
                type: Object
            },
            approves: {
                type: Object
            },
            routeName: {
                type: String
            }
        },
        data () {
            return {
                notesArr: []
            };
        },
        mixins: [mixin],
        computed: {
        	featureNotes () {
        		let noteArr = [];
        		let approving = false;
                if (this.notes.length > 0) {
                	if (this.$route.name === 'approval-launch') {
                		for (let i = 0; i < this.notes.length; i++) {
                			let note = this.notes[i];
                			if (note.id) {
                                note.resultStatusText = this.resultStatus(note.resultCode);
                                note.backgroundColor = this.randomColor(note.assignNow);
                            } else {
                				// 首个id为空  是审批中状态
                                if (!approving) {
                                    note.backgroundColor = this.randomColor(note.assignNow);
                                    note.resultStatusText = '审批中';
                                    approving = true;
                                    note.resultCode = '#';
                                } else {
                                    // note.backgroundColor = this.randomColor();
                                     note.backgroundColor = this.randomColor(note.assignNow);
                                }
                            }
                        }
                        noteArr = this.notes;
                    }
                    if (this.$route.name === 'approval-wait' || this.$route.name === 'approval-done' || this.$route.name === 'apply-filed') {
                        for (let i = 0; i < this.notes.length; i++) {
                            let note = this.notes[i];
                           
                            note.backgroundColor = this.randomColor(note.assignNow);
                            if (note.id) {
                                note.resultStatusText = this.resultStatus(note.resultCode);
                                noteArr.push(note);
                            } else {
                                note.resultStatusText = '审批中';
                                note.resultCode = '#';
                                noteArr.push(note);
                                break;
                            }
                        }
                    }
                }

                return noteArr;
            }
        },
        methods: {
            resultStatus (code) {
                switch (code) {
                    case 0:
                        return '同意';
                    case 1:
                        return '已拒绝';
                    case 2:
                        return '已拒绝';
                    case 3:
                        return '已撤销';
                    case 8:
                        return '已转交';
                    default:
                        return '';
                }
            },
            mainAuth (arr) {
                let newArr = arr || [];
                let num = 0;
                if (newArr.length > 0) {
                    return ' - ' + newArr[num];
                } else {
                    return '';
                }
            },
            getInfoValue (note) {
                if (note.id) {
                    return Number(note.ownerId);
                } else {
                    return Number(note.assignNow);
                }
            }
        },
        filters: {
            takeLastTwo (name) {
                if (name) {
                    return name.substr(-2);
                } else {
                    return '';
                }
            },
            staffInfoShow (obj) {
                let staffObj = obj || {};
                if (staffObj.dutyName) {
                    return staffObj.deptName + ' - ' + staffObj.dutyName;
                } else {
                    return staffObj.deptName;
                }
            },
            staffInfoMainShow (arr) {
                let staffArr = arr || {};
                for (let staff of staffArr) {
                	if (staff.partTime === 0) {
                		if (staff.dutyName) {
                            return staff.deptName + ' - ' + staff.dutyName;
                        } else {
                            return staff.deptName;
                        }
                    }
                }
            },
            formatDate (date) {
                if (date) {
                    return format(new Date(Number(date)), 'yyyy/MM/dd HH:mm');
                } else {
                    return '';
                }
            },
            getClass (num) {
                if (num || num === 0) {
                    switch (num) {
                        case 0:
                            return 'agree';
                        case 1:
                            return 'refuse';
                        case 2:
                            return 'refuse';
                        case 3:
                            return 'cancel';
                        case '#':
                            return 'approving';
                        default:
                            return '';
                    }
                } else {
                    return '';
                }
            },
            getDotClass (num) {
                if (num || num === 0) {
                    switch (num) {
                        case 0:
                            return 'greed-approve-span';
                        case 1:
                            return 'refused-approve-span';
                        case 2:
                            return 'refused-approve-span';
                        case 3:
                            return 'default-span';
                        case '#':
                            return 'wait-approve-span';
                        default:
                            return 'default-span';
                    }
                } else {
                    return 'default-span';
                }
            },
            formatToObj (obj) {
                if(obj) {
                    let noteOBJ = JSON.parse(obj);
                    let reason = noteOBJ.reason;
                    let opinion = noteOBJ.opinion;
                    if (opinion && reason) {
                        return reason + ':' + opinion;
                    }
                    if (reason && !opinion) {
                        return reason;
                    }
                    if (opinion && !reason) {
                        return opinion;
                    }
                    if (!opinion && !reason) {
                        return '';
                    }
                }
            }
        }
    };
</script>
<style lang='scss'  scoped>
$img-path: '../../../assets/imgs/approve/flow';
    .flow-table {
        width: 100%;
        overflow: hidden;
        .flow-thead {
            margin: 0 50px;
            margin-bottom: 10px;
            border-bottom: 1px solid #d2d2d2;
            font-family: '微软雅黑';
            font-size: 16px;
            color: #333333;
            height: 40px;
            font-weight: bold;
            text-align: left;
        }
        .flow-item {
            width: 100%;
            min-height: 83px;
            font-size: 14px;
            color: #333333;
            position: relative;
            float: left;
            height: auto;
            li {
                height: 100%;
                list-style: none;
                margin:0 50px 0 56px;
                padding: 0;
                .fitem-title {
                    height: 100%;
                    border-left: 1px solid #d2d2d2;
                    position: relative;
                    overflow: hidden;
                    padding: 10px 0px;
                    .approve-view-process {
                        overflow: hidden;
                        margin-bottom: 13px;
                        margin-top: 13px;
                        float: right;
                        .view-process-status {
                            margin-left: 27px;
                            font-size: 16px;
                            color: #333;
                            text-align: right;
                            margin-bottom: 10px;
                        }
                        .view-process-time {
                            float: right;
                            font-size: 12px;
                            color: #999;
                        }
                    }
                    .view-process-user-dept {
                        line-height: 24px;
                        margin-bottom: 10px;
                        color: #333;
                        font-size: 16px;
                        margin-left: 27px;
                        width: 80%;
                        margin-top: 10px;
                        .info-img {
                            height: 44px;
                            width: 44px;
                            line-height: 44px;
                            float: left;
                            border-radius: 4px;
                            background: transparent;
                            color: #fff;
                            text-align: center;
                        }
                        .info-content {
                            float: left;
                            width: 86%;
                            padding-left: 10px;
                            text-align: left;
                            .name {
                                display: block;
                                max-width: 15%;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                overflow: hidden;
                                padding-right: 10px
                            }
                            .additional {
                                // display: inline-block;
                                // width: 83%;
                                vertical-align: top;
                                font-size: 12px;
                                color: #999;
                                text-align: left;
                            }
                        }
                    }
                    .under-line {
                        margin-left: 27px;
                        border-bottom: 1px solid #e8e8e8;
                    }
                }
            }
        }
    }

    .bottom-whiteSpace {
        height: 100px;
        float: left;
        width: 100%;
    }
    .view-process-note {
        line-height: 24px;
        color: #333;
        font-size: 12px;
        margin-left: 27px;
        word-break: break-all;
        overflow: hidden;
    }
    .mb24{
        margin-bottom: 24px;
    }
    .reason {
        text-align: left;
    }
    .refuse {
        color: #F06767;
    }

    .cancel {
        color: #CCCCCC;
    }

    .agree {
        color: #68C6AA;
    }

    .approving {
        color: #F1991A;
    }
    .refused-approve-span{
        background: url("#{$img-path}/refuse-node.png") no-repeat center;
    }
    .wait-approve-span{
        background: url("#{$img-path}/wait-node.png") no-repeat center;
    }
    .greed-approve-span{
        background: url("#{$img-path}/agreed-node.png") no-repeat center;
    }
    .default-span{
        background: url("#{$img-path}/default-node.png") no-repeat center;
    }
    
    .flow-dot {
        height: 14px;
        width: 14px;
        position: absolute;
        background-color: #ffffff;
        left: 50px;
        top: 34px;
        .dot {
            display: block;
            height: 14px;
            width: 14px;
            border-radius: 50%;
            background-color: #fff
        }
    }
    .fitem-cover {
        width: 1px;
        height: 9999px;
        position: absolute;
        top: 48px;
        left: 56px;
        background-color: #ffffff;
        display: none;
    }
    .first-node {
        display: block;
        top: 0;
        height: 34px;
        left: 56px;
    }
    .block-cover {
        display: block !important;
    }

    .partTime_1 {
            background-color: #f0a522;
    color: #FFF;
    padding: 2px 4px;
    border-radius: 4px;
    margin-right: 10px;
    font-size: 12px;
    }
</style>
