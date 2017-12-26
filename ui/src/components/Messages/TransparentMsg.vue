<template>
    <div>
        <div class="list-time" v-if="showTime && msgText">{{$util.formatMsgTime(msg.sendtime)}}</div>
        <div class="list-revoke clearfix"  v-if="msgText !== false">
            <div class="text-wrapper">{{ msgText }}</div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['msg', 'isMyMsg', 'showTime'],
        computed: {
            msgText() {
                switch (this.msg.type) {
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                        return false;
                    case 6:
                        return '频道管理员已将频道名称更改为' + this.msg.channelName;
                    case 7:
                        let nameList = [],
                            action = '',
                            names = '';
                        this.msg.userList.forEach((item) => {
                            nameList.push(item.userName);
                        });
                        names = nameList.join('、');
                        if (this.msg.userIdList.length > 2) {
                            names = names = nameList.join('、') + '等' + this.msg.userIdList.length + '人';
                        }
                        action = this.msg.state === 0 ? '已被移出' : '加入了';
                        return names + action + '频道';
                    case 8:
                    case 9:
                        return false;
                    case 10:
                        if (this.msg.adminId === this.$store.state.myInfo.info.oaId) {
                            return '你成为了新的频道管理员';
                        }
                        return this.msg.adminName + '成为新的频道管理员';
                    default:
                        return false;
                }
            }
        },
        created() {
//            console.log('透传消息', this.msg);
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">

</style>
