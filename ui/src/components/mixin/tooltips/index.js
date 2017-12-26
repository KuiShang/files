/**
 * Created by shangkuikui on 2017/7/24.
 */
let timer_;
export default {
    methods: {
        tooltipIn(str) {
            timer_ = setTimeout(() => {
                this.$api.setTip(str);
            }, 800);
        },
        tooltipOut() {
            window.clearTimeout(timer_);
            this.$api.hideTip();
        }
    }
};
