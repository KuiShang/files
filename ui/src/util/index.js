const util = {};


/**
 * 获取头像颜色
 * @param staffId
 * @returns
 */

util.getNickNameColor = function getNickNameColor(staffId) {
    var colorArr = ['#B2DBF3', '#81BDEE', '#A6E6C2', '#68C6AA', '#F8B185',
        '#F693BF', '#B5B4E3', '#C280D3'
    ];
    return colorArr[staffId % 8];
};


/**
 * 获取头像名称
 * @param staffName
 * @returns
 */

util.getNickName = function getNickName(staffName) {
    if (!staffName) {
        return '';
    }
    staffName = staffName || '';
    var words = staffName.split('');
    if (words) {
        return words[words.length - 2] + words[words.length - 1];
    } else {
        return '';
    }
};


/**
 * 时间格式化
 * @param timeStamp
 * @param formatStr
 * @returns
 */

util.dateFormat = function dateFormat(timeStamp, formatStr) {
    Date.prototype.pattern = function(fmt) {
        var o = {
                'M+': this.getMonth() + 1, // 月份
                'd+': this.getDate(), // 日
                'h+': this.getHours() % 12 === 0 ? 12 : this.getHours() % 12, // 小时
                'H+': this.getHours(), // 小时
                'm+': this.getMinutes(), // 分
                's+': this.getSeconds(), // 秒
                'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
                'S': this.getMilliseconds()
                    // 毫秒
            },
            week = {
                '0': '星期日',
                '1': '星期一',
                '2': '星期二',
                '3': '星期三',
                '4': '星期四',
                '5': '星期五',
                '6': '星期六'
            },
            k;
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '')
                .substr(4 - RegExp.$1.length));
        }
        if (/(E+)/.test(fmt)) {
            fmt = fmt
                .replace(
                    RegExp.$1,
                    ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '/u661f/u671f' : '/u5468') : '') + week[this.getDay() + '']);
        }
        for (k in o) {
            if (new RegExp('(' + k + ')').test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
            }
        }
        return fmt;
    };
    var newDate = new Date();
    newDate.setTime(timeStamp);
    return newDate.pattern(formatStr);
};


/**
 * js Map工具类
 */

util.Map = function Map() {
    /** 存放键的数组(遍历用到) */
    this.keys = [];
    /** 存放数据 */
    this.data = {};

    /**
     * 放入一个键值对
     * @param {String}
     *            key
     * @param {Object}
     *            value
     */
    this.put = function(key, value) {
        if (typeof (this.data[key]) === 'undefined') {
            this.keys.push(key);
        }
        this.data[key] = value;
    };

    /**
     * 获取某键对应的值
     * @param {String} key
     * @return {Object} value
     */
    this.get = function(key) {
        return this.data[key];
    };

    /**
     * 删除一个键值对
     * @param {String} key
     */
    this.remove = function(key) {
        var index = this.keys.indexOf(key);
        this.keys.splice(index, 1);
        this.data[key] = null;
    };

    /**
     * 遍历Map,执行处理函数
     * @param {Function}
     * 回调函数 function(key,value,index){..}
     */
    this.each = function(fn) {
        if (typeof fn !== 'function') {
            return;
        }
        var len = this.keys.length,
            i, k;
        for (i = 0; i < len; i++) {
            k = this.keys[i];
            fn(k, this.data[k], i);
        }
    };

    /**
     * 获取键值数组(类似<a href="http://lib.csdn.net/base/javase" class='replace_word'
     * title="Java SE知识库" target='_blank' style='color:#df3434;
     * font-weight:bold;'>Java</a>的entrySet())
     * @return 键值对象{key,value}的数组
     */
    this.entrys = function() {
        var len = this.keys.length,
            entrys = new Array(len),
            i;
        for (i = 0; i < len; i++) {
            entrys[i] = {
                key: this.keys[i],
                value: this.data[i]
            };
        }
        return entrys;
    };

    /**
     * 判断Map是否为空
     */
    this.isEmpty = function() {
        return this.keys.length === 0;
    };

    /**
     * 获取键值对数量
     */
    this.size = function() {
        return this.keys.length;
    };

    /**
     * 重写toString
     */
    this.toString = function() {
        var s = '{',
            i, k;
        for (i = 0; i < this.keys.length; i++, s += ',') {
            k = this.keys[i];
            s += k + '=' + this.data[k];
        }
        s += '}';
        return s;
    };
};


/**
 * replaceAllStr
 * @param str
 * @param r_str
 * @param t_str
 * @returns
 */

util.replaceAll = function replaceAll(str, rStr, tStr) {
    var re = new RegExp(rStr, 'g');
    return str.replace(re, tStr);
};


/**
 * java hashCode
 * @param str
 * @returns {Number}
 */

util.hashCode = function hashCode(str) {
    let hash = 0;
    if (str.length === 0) return hash;
    for (let i = 0; i < str.length; i++) {
        let char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
};


util.formatMsgTime = function formatMsgTime(lastTime) {
    // 获得今天零点的时间戳
    var today = new Date(),
        time, todayTime, yesterdayTime, oneWeekTime;
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);
    todayTime = today.getTime();
    // 昨天零点时间戳
    yesterdayTime = todayTime - 1000 * 60 * 60 * 24;
    // 一周之内零点时间戳
    oneWeekTime = todayTime - 1000 * 60 * 60 * 24 * 6;
    // 今天
    if (lastTime > todayTime) {
        time = date_format(lastTime, 'HH:mm');
        return time;
    }
    // 昨天
    if (lastTime < todayTime && lastTime >= yesterdayTime) {
        time = '昨天 ' + date_format(lastTime, 'HH:mm');
        return time;
    }
    // 一周内
    if (lastTime < yesterdayTime && lastTime >= oneWeekTime) {
        time = date_format(lastTime, 'E HH:mm');
        return time;
    }
    // 一周之外
    if (lastTime < oneWeekTime) {
        time = date_format(lastTime, 'yyyy-MM-dd HH:mm');
        return time;
    }
};


util.formatSessionTime = function(lastTime) {
// 获得今天零点的时间戳
    var today = new Date(),
        time, todayTime, yesterdayTime, oneWeekTime;
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);
    todayTime = today.getTime();
    // 昨天零点时间戳
    yesterdayTime = todayTime - 1000 * 60 * 60 * 24;
    // 一周之内零点时间戳
    oneWeekTime = todayTime - 1000 * 60 * 60 * 24 * 6;
    // 今天
    if (lastTime > todayTime) {
        time = date_format(lastTime, 'HH:mm');
        return time;
    }
    // 昨天
    if (lastTime < todayTime && lastTime >= yesterdayTime) {
        time = '昨天 ';
        return time;
    }
    // 一周内
    if (lastTime < yesterdayTime && lastTime >= oneWeekTime) {
        time = date_format(lastTime, 'E');
        return time;
    }
    // 一周之外
    if (lastTime < oneWeekTime) {
        time = date_format(lastTime, 'MM-dd');
        return time;
    }
};


util.decodeStr = function decodeStr(str) {
    $('#decode').html(str);
    var result = $('#decode').text();
    return result;
};


util.codeStr = function codeStr(str) {
    $('#decode').text(str);
    var result = $('#decode').html();
    return result;
};


/**
 * 文件字节转换为单位大小
 * @param bytes 文件大小
 * @returns 对应的MB保留两位小数
 */

util.bytesToSize = function bytesToSize(bytes) {
    if (bytes === '0' || bytes === 0) return '0 B';

    var k = 1024,
        sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat(bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
    // toPrecision(3) 后面保留一位小数，如1.0GB                                                                                                                  //return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
};


/**
 * 返回文件列表里的状态
 * @param status 文件状态
 * @param senderImId 发送人id
 * @returns
 */

util.fileStatus = function fileStatus(status, senderImId, from) {
    var obj1 = {
            '未下载': '0',
            '下载中': '1',
            '已下载': '2',
            '已过期': '3',
            '暂停': '4',
            '下载失败': '100',
            '文件被删除': '101'
        },
        obj2 = {
            '发送中': '1',
            '已发送': '2',
            '已过期': '3',
            '暂停': '4',
            '发送失败': '100'
        },
        fromType = parseInt(from / 1000000),
        attr1, attr2;
    if (senderImId === myInfo.imUserid) {
        if (fromType === 2) {
            for (attr2 in obj2) {
                if (obj2[attr2] === status) {
                    return attr2;
                }
            }
        } else {
            for (attr1 in obj1) {
                if (obj1[attr1] === status) {
                    return attr1;
                }
            }
        }
    } else {
        for (attr1 in obj1) {
            if (obj1[attr1] === status) {
                return attr1;
            }
        }
    }
};


/**
 * 取得文件的后缀
 * @param str 文件名
 * @returns 对应文件图片路径
 */

util.fileTypeImg = function fileTypeImg(str) {
    var d;
    str = str || '';
    d = /\.([^.]+$)/.exec(str);
    if (d[1] === 'doc' || d[1] === 'docx') {
        return '../images/file/WORD56.png';
    } else if (d[1] === 'xls' || d[1] === 'xlsx') {
        return '../images/file/EXCEL56.png';
    } else if (d[1] === 'ppt' || d[1] === 'pptx') {
        return '../images/file/PPT56.png';
    } else if (d[1] === 'pdf') {
        return '../images/file/PDF56.png';
    } else if (d[1] === 'txt') {
        return '../images/file/TXT56.png';
    } else {
        return '../images/file/other56.png';
    }
};


/**
 * 取得文件扩展名
 * @param str
 * @returns
 */

util.getFileType = function getFileType(str) {
    var d;
    str = str || '';
    d = /\.([^.]+$)/.exec(str);
    return d ? d[1] : '';
};


/**
 * 取得文件名带扩展名
 * @param str
 * @returns
 */

util.getFileNameWidthType = function getFileNameWidthType(str) {
    var reg = /[^/]*[/]+/g;
    str = str || '';
    str = str.replace(reg, '');
    return str;
};


/**
 * 取得文件名不带扩展名
 * @param str
 * @returns
 */

util.getFileNameWidthOutType = function getFileNameWidthOutType(str) {
    str = str || '';
    return str.replace(/(.*\/)*([^.]+).*/ig, '$2');
};


/**
 * 去除空格
 * @param str
 * @returns
 */

util.trimSpace = function trimSpace(str) {
    return str.replace(/(^\s*)|(\s*$)/g, '');
};


/**
 * 校验七天有效期
 * @param sendtime发送文件时间
 * @param 文件的当前状态
 * @returns 新的状态
 */

util.validityDate = function validityDate(sendTime, status) {
    var nowTime = new Date(),
        time, fileZeroTime, validityTime;
    if (typeof sendTime === 'number') {
        time = sendTime;
    } else {
        time = sendTime.getTime();
    }
    fileZeroTime = new Date(time + 1000 * 60 * 60 * 24 * 8);
    fileZeroTime.setHours(0);
    fileZeroTime.setMinutes(0);
    fileZeroTime.setSeconds(0);
    fileZeroTime.setMilliseconds(0);
    validityTime = (new Date(fileZeroTime - 1000));
    if ((nowTime - validityTime) >= 0) {
        return 3;
    } else {
        return status;
    }
};

util.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
        var last = Date.parse(new Date()) - timestamp;

        if (last < wait && last >= 0) {
            timeout = setTimeout(later, wait - last);
        } else {
            timeout = null;
            if (!immediate) {
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            }
        }
    };

    return function() {
        context = this;
        args = arguments;
        timestamp = Date.parse(new Date());
        var callNow = immediate && !timeout;
        if (!timeout) timeout = setTimeout(later, wait);
        if (callNow) {
            result = func.apply(context, args);
            context = args = null;
        }

        return result;
    };
};

util.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
        previous = options.leading === false ? 0 : Date.parse(new Date());
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
    };
    return function() {
        var now = Date.parse(new Date());
        if (!previous && options.leading === false) previous = now;
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
        }
        return result;
    };
};

export default util;
