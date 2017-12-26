<template>
    <div class="emoji" @click.stop>
        <div class="emoji-list">
            <div class="emoji-default">
                <li v-for="emoji in defaultEmoji">
                    <Face :name="emoji" :cName="defaultEmojiMap[emoji]" @hideEmoji="hideEmoji"/>
                </li>
            </div>
        </div>
        <div class="emoji-tab">
            <div class="tab-default">
                <em class="iconn-1"></em>
            </div>
        </div>
    </div>
</template>

<script>
    import Face from './Face';
    export default {
        components: { Face },
        data() {
            return {
                defaultEmoji: ['aixin', 'baiyan', 'bishi', 'bizui', 'buxie', 'chuida', 'ciya', 'daku', 'daxiao', 'deyi',
                    'dianzan', 'e', 'fadai', 'fendou', 'ganga', 'guzhang', 'haixiu', 'haqian',
                    'huaixiao', 'jingya', 'kelian', 'koubi', 'kuaikule', 'kun', 'leiyan', 'lenghan',
                    'liulei', 'nanguo', 'nanshou', 'OK', 'piezui', 'qin', 'se', 'fennu', 'shihua',
                    'shuijiao', 'tiaopi', 'toumiao', 'touxiao', 'tuxie', 'weiqu', 'weixiao', 'xiaoku',
                    'yinxian', 'yiwen', 'yun', 'zaijian', 'zhouma', 'zhuakuang', 'zhuangku'],
                defaultEmojiMap: {
                    'aixin': '爱心',
                    'baiyan': '白眼',
                    'bishi': '鄙视',
                    'bizui': '闭嘴',
                    'buxie': '不屑',
                    'chuida': '捶打',
                    'ciya': '呲牙',
                    'daku': '大哭',
                    'daxiao': '大笑',
                    'deyi': '得意',
                    'dianzan': '点赞',
                    'e': '饿',
                    'fadai': '发呆',
                    'fendou': '奋斗',
                    'ganga': '尴尬',
                    'guzhang': '鼓掌',
                    'haixiu': '害羞',
                    'haqian': '哈欠',
                    'huaixiao': '坏笑',
                    'jingya': '惊讶',
                    'kelian': '可怜',
                    'koubi': '抠鼻',
                    'kuaikule': '快哭了',
                    'kun': '困',
                    'leiyan': '泪眼',
                    'lenghan': '冷汗',
                    'liulei': '流泪',
                    'nanguo': '难过',
                    'nanshou': '难受',
                    'OK': 'OK',
                    'piezui': '撇嘴',
                    'qin': '亲',
                    'se': '色',
                    'fennu': '愤怒',
                    'shihua': '石化',
                    'shuijiao': '睡觉',
                    'tiaopi': '调皮',
                    'toumiao': '偷瞄',
                    'touxiao': '偷笑',
                    'tuxie': '吐血',
                    'weiqu': '委屈',
                    'weixiao': '微笑',
                    'xiaoku': '笑哭',
                    'yinxian': '阴险',
                    'yiwen': '疑问',
                    'yun': '晕',
                    'zaijian': '再见',
                    'zhouma': '咒骂',
                    'zhuakuang': '抓狂',
                    'zhuangku': '装酷'
                }
            };
        },
        methods: {
            hideEmoji() {
                this.$emit('hideEmoji');
            }
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">

</style>
