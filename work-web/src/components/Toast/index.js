/**
 * Author : shangkuikui 
 * Date : 2017/10/26
 */
import Vue from 'vue';
import Toast from './Toast';
let toastInstance;
const ToastContructor = Vue.extend(Toast);
const showToast = function(options) {
    if (typeof options === 'string') {
        options = {
            message: options
        };
    }
    if (!toastInstance) {
        const dom = document.createElement('div');
        document.body.appendChild(dom);
        toastInstance = new ToastContructor({
            el: dom
        });
    }
    toastInstance.showToast(options);
};
export default showToast ;
