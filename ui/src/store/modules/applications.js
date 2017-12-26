/**
 * Created by lixiaohu on 2017/9/18.
 */

import * as types from '../mutation-types';

const state = {
    officialApp: [
        {
            title: '审批',
            image: '../images/icon/shenpi.png',
            dev: 'http://10.112.178.22/login.html',
            pre: 'https://work.pre.gomeplus.com/login.html',
            pro: 'https://work.gomeplus.com/login.html',
            unReadNum: 0,
            official: true
        },
        {
            title: '公告',
            image: '../images/icon/gonggao.png',
            dev: 'http://10.112.178.22/login.html',
            pre: 'https://work.pre.gomeplus.com/login.html',
            pro: 'https://work.gomeplus.com/login.html',
            unReadNum: 0,
            official: true
        },
        {
            title: '考勤',
            image: '../images/icon/kaoqin.png',
            dev: 'https://work.gomeplus.com',
            pre: 'https://work.gomeplus.com',
            pro: 'https://work.gomeplus.com',
            unReadNum: 0,
            active: false,
            official: true
        }
    ],
    thirdPartyApp: [
        {
            title: '办证助手',
            image: '../images/icon/banzhengzhushou.png',
            url: 'http://biandang.58.com/bj/shenfenhuji/?PGTID=0d311b73-0000-1cc2-4853-54659e31d435&ClickID=1&depth=1',
            unReadNum: 0,
            official: false
        },
        {
            title: '工商查询',
            image: '../images/icon/gongshangchaxun.png',
            url: 'https://www.tianyancha.com/',
            unReadNum: 0,
            official: false
        },
        {
            title: '快递助手',
            image: '../images/icon/kuaidizhushou.png',
            url: 'http://www.kuaidi100.com/',
            unReadNum: 0,
            official: false
        },
        {
            title: '途家商旅',
            image: '../images/icon/tujiashanglv.png',
            url: 'https://www.tujia.com/',
            unReadNum: 0,
            official: false
        },
        {
            title: '豆包保险',
            image: '../images/icon/doubaobaoxian.png',
            url: 'https://www.17doubao.com/enterprise-login',
            unReadNum: 0,
            official: false
        }
    ],
    totalAppUnReadNum: 0
};

const mutations = {
    [types.SET_APPLICATION_UNREAD_NUM](state, data) {
        state.officialApp[0].unReadNum = data.approveCount;
        state.officialApp[1].unReadNum = data.noticeCount;
        state.totalAppUnReadNum = data.totalCount;
    },
    [types.RECEIVE_APPLICATION_NOTIFY](state, data) {
        if (data.type === 3) {
            state.officialApp[1].unReadNum += data.handleCount;
            state.totalAppUnReadNum += data.handleCount;
        } else if (data.type === 2) {
            state.officialApp[0].unReadNum = data.count;
            state.totalAppUnReadNum = state.officialApp.reduce(function(sum, app) {
                return sum + app.unReadNum;
            }, 0);
        }
    }
};

const getters = {
    officialApp: state => state.officialApp,
    thirdPartyApp: state => state.thirdPartyApp,
    totalAppUnReadNum: state => state.totalAppUnReadNum
};

export default {
    state,
    mutations,
    getters
};
