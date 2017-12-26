import {myApproveCount} from "@/api/approve";
import * as types from "@/store/mutation-types";
export default {
  methods: {
    async getMyApproveCount() {
      let res = await myApproveCount({
        cid: sessionStorage.getItem('companyId')
      });
      let code = res && res.data && res.data.code;
      if (code === 0) {
        this.$store.commit(types.SET_WAIT_APPROVE_NUM, res.data.data.approveCount);
      }
    },
    randomColor(number) {
      if (isNaN(number) || number < 9) {
        return "#68c6aa";
      }
      let colorArr = [
        "#a992d4",
        "#f7b189",
        "#b3dbf2",
        "#f495bf",
        "#c182d1",
        "#b5b5e2",
        "#a8e5c2",
        "#83beec",
        "#61d6d6"
      ];
      return colorArr[number % 9];
    },
  }
}
