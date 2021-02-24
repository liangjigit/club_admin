import { GETSHARE } from "../../mutations_type";
import request from "@/utils/request";

const state = {
  getShare: {}
};
// 请求的url 前面需要加上 content
const actions = {
  // 获取用户权益
  async getShare({ commit }) {
    const response = (
      await request({
        url: `/content/admin/share/auth/detail`,
        method: "POST",
        data: {}
      })
    ).data;
    if (response.code == 200) {
      let share = response.data;
      commit("GETSHARE", { share });
    }
    return response;
  },
  async saveShare({ commit }, payload) {
    const response = (
      await request({
        url: `/content/admin/share/auth/save`,
        method: "POST",
        data: payload
      })
    ).data;
    if (response.code === 200) {
      commit("getShare");
    }
    return response;
  }
};
const mutations = {
  // 获取分享
  [GETSHARE](state, payload) {
    state.getShare = payload.getShare;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
