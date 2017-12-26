import Vue from 'vue';
import Vuex from 'vuex';
import * as actions from './actions';
import * as getters from './getters';
import myInfo from './modules/my-info';
import sessions from './modules/sessions';
import messages from './modules/messages';
import status from './modules/status';
import channels from './modules/channels';
import applications from './modules/applications';
import channelSetting from './modules/channelSetting';
Vue.use(Vuex);

// const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
    actions,
    getters,
    modules: {
        myInfo,
        sessions,
        messages,
        status,
        channels,
        channelSetting,
        applications
    }
});
