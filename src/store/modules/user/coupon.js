import { GETCOUPONS } from "../../mutations_type";
import request from "@/utils/request";

const state = {
  coupons: [],
  pageNum: 1,
  pageSize: 20,
  totalSize: 0
};

const actions = {
  // eslint-disable-next-line no-empty-pattern
  async exportCouponData({}, payload) {
    const response = (
      await request({
        url: `/user/admin/coupon/auth/couponDataExport`,
        method: "POST",
        responseType: "arraybuffer",
        data: payload
      })
    ).data;
    return response;
  },
  async getCoupons({ commit }, payload) {
    const response = (
      await request({
        url: `/user/admin/coupon/auth/query`,
        method: "POST",
        data: payload
      })
    ).data;
    if (response.code == 200) {
      let { list: coupons, pageNum, pageSize, totalSize } = response.data;
      commit("GETCOUPONS", { coupons, pageNum, pageSize, totalSize });
    }
    return response;
  }
};

const mutations = {
  // 获取列表
  [GETCOUPONS](state, payload) {
    state.coupons = payload.coupons.map(item => {
      return item;
    });
    state.pageNum = payload.pageNum;
    state.pageSize = payload.pageSize;
    state.totalSize = payload.totalSize;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
