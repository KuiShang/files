/**
 * 当前登录人的信息
 */
var myInfo;

/**
 * 全局聊天对象，值为正在聊天的窗口参数
 */
var CHATOBJ = {};

/**
 * 消息盒子回调获取的对象
 */
var messageBoxOBJ = {};

/**
 * 在线发送消息和接收消息的时间容器
 * 结构： {
 * 			'groupId1':lastTime1,
 * 			'groupId2':lastTime2
 * 		}
 */
var lastMsgTimeMap = new Map();

/**
 * 聊天窗口内首条消息时间容器
 * 结构： {
 * 			'groupId1':lastTime1,
 * 			'groupId2':lastTime2
 * 		}
 */
var firstMsgTimeMap = new Map();

/**
 * 回执消息容器
 * 结构：	{
 * 			'groupId':	[{
 * 							'senderId':1111
 * 							'seqId':1111
 * 							'msgId':1
 *						}],[{.....}]
 * 		}
 */
var receiptMap = new Map();

/**
 * 特殊消息数量容器
 * 结构： {
 *          'groupId': [{
 *              'AtMeCount' : 0,
 *              'GroupAnnouncementCount': 0,
 *              'ReportCount': 0
 *          }]
 * }
 */
var specialMassageCountMap = new Map();


/**
 * 消息重发的集合
 */
var resendMsgMap = new Map();

/**
 * 窗口最大化和还原
 */
var windowSize = false;

/**
 * 输入区光标对象
 */

var sel, range;
var rangeMap = new Map();

/**
 * 默认表情
 */
/* var faces = [
             "微笑","色","亲亲","得意","流泪","害羞","闭嘴","鼓掌","大哭","尴尬",
             "生气","调皮","呲牙","惊讶","委屈","吐血","冷汗","抓狂","难过","偷笑",
             "白眼","不屑","快哭了","困","装酷","大笑","偷瞄","奋斗","咒骂","疑问",
        	 "晕","捶打","再见","抠鼻","发呆","坏笑","哈欠","鄙视","睡觉","饿",
        	 "阴险","难受","可怜","撇嘴","石化","泪眼"
        	]; */
// var faces = ["微笑","YY","惊恐","愤怒","色","尴尬","石化","大笑","流泪","可怜",
//              "大哭","晕","抠鼻","得意","疑问","抓狂","亲","恶心","鄙视","伤心",
//              "阴险","困","迷茫","睡觉","努力"];

var faces = ['aixin', 'baiyan', 'bishi', 'bizui', 'buxie', 'chuida', 'ciya', 'daku', 'daxiao', 'deyi',
    'dianzan', 'e', 'fadai', 'fendou', 'ganga', 'guzhang', 'haixiu', 'haqian',
    'huaixiao', 'jingya', 'kelian', 'koubi', 'kuaikule', 'kun', 'leiyan', 'lenghan',
    'liulei', 'nanguo', 'nanshou', 'OK', 'piezui', 'qin', 'se', 'fennu', 'shihua',
    'shuijiao', 'tiaopi', 'toumiao', 'touxiao', 'tuxie', 'weiqu', 'weixiao', 'xiaoku',
    'yinxian', 'yiwen', 'yun', 'zaijian', 'zhouma', 'zhuakuang', 'zhuangku'];

var facesMap = {
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
};


/**
 * 表情展开状态
 */
var faceOpen = false;

/**
 * 我的群组展开状态
 */
var myGroupOpen = false;

/**
 * 常用联系人展开状态
 */
var myContactsOpen = false;


/**
 * 我的频道展开状态
 */
var myChannelOpen = false;


/**
 * 文件列表展开状态
 */
var filesListOpen = false;

/**
 * 发起群聊弹出状态
 */
var groupChatOpen = false;

/**
 * 群组详情删除成员弹出状态
 */
var groupDelMemberOpen = false;

/**
 * 群组详情弹窗删除成员弹出状态
 */
var groupWindowDelMemberOpen = false;

/**
 * 群组详情添加成员弹出状态
 */
var groupAddMemberOpen = false;

/**
 * 群组详情弹窗添加成员弹出状态
 */
var groupWindowAddMemberOpen = false;

/**
 * 点击创建群还是添加群成员
 */
var createOrAdd;

/**
 * 发起群聊常用联系人展开状态
 */
var myContactsOpen2 = false;

/**
 * 刷新是否完成
 */
var refreshisfinished = true;

/**
 * 部门树选中标识
 */
var DEPT = {};

/**
 * 草稿
 */
var draftMap = new Map();

/**
 * 常用联系人发起会话参数
 */
var contactsDetailObj;

/**
 * 我的群组发起会话参数
 */
var groupDetailObj;

/**
 * 定时器容器
 */
var timer = {};

/**
 * 置顶会话总数
 */
var topNum = 0;

/**
 * 切换会话滚动条位置记录
 */
var scrollTopMap = new Map();

/**
 * 是否开启消息提示音
 */
var soundOpen;

/**
 * 新消息提示及未读消息定位容器
 * 格式：{
 * 		'groupId':{
 * 			'type':0------第一次打开  1------不是第一次打开
 * 			'msgId':'11111111'
 * 			'position':1111,
 * 			'unreadNum':12,
 * 			'oldPosition':111
 * 		},
 * 		groupid:{
 *
 * 		}.......
 * }
 */
var newMsgTipMap = new Map();

/**
 * 支持的文件格式
 * @type {{pdf: [*], ppt: [*], txt: [*], word: [*], other: [*], excel: [*]}}
 */
var fileThumbnail =
    {
        PDF: ['pdf'],
        PPT: ['ppt', 'pptx', 'ppsx'],
        TXT: ['txt', 'pps'],
        WORD: ['doc', 'docx', 'dotx'],
        OTHER: [ 'pot', 'rtf', 'wps', 'et', 'dps', 'epub', 'potx', 'dot'],
        EXCEL: ['xls', 'xlsx', 'xlt', 'xltx'],
        Video: ['mp4', 'avi', 'rm', 'asf', 'wmv', 'mov', '3gp', 'rmvb', 'avs', 'flv', 'mkv', 'mpg', 'dat', 'ogm', 'vob', 'rm', 'ts', 'tp', 'ifo', 'nsv', 'm2ts', 'swf'],
        Audio: ['wav', 'mp3', 'ra', 'rma', 'wma', 'ogg', 'ape', 'flac', 'acc', 'mpc', 'aac', 'au', 'aiff', 'ape', 'mod', 'asf', 'cda', 'mid', 'mka', 'mpa', 'ofr', 'wv', 'tta', 'ac3', 'dts'],
        VSD: ['vsd'],
        RAR: ['rar'],
        ZIP: ['zip']
    };

/**
 * 支持的文件格式src
 * @type {{pdf: [*], ppt: [*], txt: [*], word: [*], other: [*], excel: [*]}}
 */
var fileThumbnailSrc =
    {
        PDF: 'PDF',
        PPT: 'PPT',
        TXT: 'TXT',
        WORD: 'WORD',
        OTHER: 'other',
        EXCEL: 'EXCEL',
        Video: 'video',
        Audio: 'sound',
        VSD: 'vsd',
        RAR: 'rar',
        ZIP: 'zip'
    };
/**
 * 文件背景颜色
 */
var fileBgColorClassNameObj = {
    PDF: 'pdf-bac-color on ',
    TXT: 'txt-bac-color on ',
    PPT: 'ppt-bac-color on ',
    EXCEL: 'excel-bac-color on ',
    OTHER: 'other-bac-color on ',
    WORD: 'doc-bac-color on ',
    Video: 'video-bac-color on ',
    Audio: 'audio-bac-color on ',
    VSD: 'vsd-bac-color on ',
    RAR: 'rar-bac-color on ',
    ZIP: 'zip-bac-color on '
};
/**
 * 屏蔽的文件格式src
 * @type
 */
var fileLimitType = ['COM', 'BAT', 'CHM', 'HLP', 'JS', 'MSI', 'SCR', 'VBS', 'REG', 'app', 'APP'];

/**
 * 把文件转换成图片的格式
 * @type
 */
var fileImgType = ['BMP', 'JPG', 'JPEG', 'PNG', 'GIF'];
// PC来源
var PcSourceType = 2;
/**
 * 文件来源
 */
var sourceFromObj = {
    '0': 'Aeromind移动端', // android
    '1': 'Aeromind移动端', // ios
    '2': 'Aeromind桌面端'
};
/**
 * 当前激活的输入框
 */
let currentInput
const AllINPUT = {
    'SEARCH':'搜索框的input',
    'FORWARD': '转发的input',
    'PRE':'消息发送区的pre'
}
