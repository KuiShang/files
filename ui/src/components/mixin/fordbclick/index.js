/**
 * Created by shangkuikui on 2017/7/22.
 */
export default {
    methods: {
        mouseenter() {
            this.$api.forDbclickEnter();
        },
        mouseleave() {
            this.$api.forDbclickOut();
        }
    }
};
