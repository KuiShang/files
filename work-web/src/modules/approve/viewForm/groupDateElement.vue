<template>
    <div class="approve-form-list">
        <div class="approve-line">
            <div class="item-title" style="-webkit-box-orient: vertical">{{ titleUnit }}</div>
            <div class="item-value">
                <span class="wrap" v-html="dt"></span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            value: {
                type: Object
            }
        },
        data () {
            return {
                startTime: '',
                endTime: '',
                allDays: ''
            };
        },
        computed: {
            formatToJSON () {
                return JSON.parse(this.value.value);
            },
            showDate () {
                let dateObj = this.formatToJSON;
                let beginDate = '';
                let endDate = '';
                let beginTime = '';
                let endTime = '';
                let start = '';
                let end = '';
                let days = '';
                if (dateObj.beginDate) {
                    beginDate = this.formatDate(dateObj.beginDate);
                }
                if (dateObj.endDate) {
                    endDate = this.formatDate(dateObj.endDate);
                }
//                if (dateObj.beginTime) {
//                    beginTime = this.formatTime(dateObj.beginTime);
//                }
//                if (dateObj.endTime) {
//                    endTime = this.formatTime(dateObj.endTime);
//                }
                if (dateObj.beginTime && this.value.format.indexOf(':') > 0) {
                    beginTime = this.formatTime(dateObj.beginTime);
                }
                if (dateObj.endTime && this.value.format.indexOf(':') > 0) {
                    endTime = this.formatTime(dateObj.endTime);
                }

                if (dateObj) {
                    days = this.formatDays(dateObj);
                }
                if (beginDate) {
                    start = beginDate + ' ' + beginTime;
                }
                if (endDate) {
                    end = endDate + ' ' + endTime;
                }
                return {start, end, days};
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
            dt () {
                // {{showDate.start}} 至 {{showDate.end}} ( 共计 {{showDate.days}} )
                return `${this.showDate.start} 至 ${this.showDate.end} ( 共计 ${this.showDate.days} )`
            }
        },
        methods: {
            formatDate (str) { // 格式化 年-月-日
                let year = str.substr(0, 4);
                let month = str.substr(4, 2);
                let day = str.substr(6, 2);
                return year + '-' + month + '-' + day;
            },
            formatTime (str) { // 格式化时间 00:00
                let hour = str.substr(0, 2);
                let minute = str.substr(2, 2);
                return hour + ':' + minute;
            },
            formatDays (obj) { // 格式化时长
                let days = `<span style="color:#4590e4">${obj.days}</span> 天 `;
                let hours = `<span style="color:#4590e4">${obj.hours}</span> 小时 `;
                let minutes =  `<span style="color:#4590e4">${obj.minutes}</span> 分钟`;
                return days + hours + minutes;
            }

        }
    };
</script>
<style lang='scss' rel="stylesheet/scss" type="text/css" scoped>
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
