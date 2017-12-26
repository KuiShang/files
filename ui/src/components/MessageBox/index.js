/**
 * Created by lixiaohu on 2017/7/24.
 */

import Vue from 'vue';
import Modal from './Modal';
import Toast from './Toast';

let modalInstance, toastInstance;

const ModalConstructor = Vue.extend(Modal);
const ToastContructor = Vue.extend(Toast);

const showModal = function(options) {
    if (typeof options === 'string') {
        options = {
            message: options
        };
    }
    if (!modalInstance) {
        const dom = document.createElement('div');
        document.body.appendChild(dom);
        modalInstance = new ModalConstructor({
            el: dom
        });
    }
    modalInstance.showModal(options);
};

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

// MessageBox = { showModal, showToast };

export default { showModal, showToast };
// export default MessageBox;
