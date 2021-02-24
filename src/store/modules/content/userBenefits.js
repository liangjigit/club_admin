import { GETUSERBENEFITS } from "../../mutations_type";
import request from "@/utils/request";

const state = {
  userBenefits: {}
};
// 请求的url 前面需要加上 content
const actions = {
  // 获取用户权益
  async getBenefits({ commit }) {
    const response = (
      await request({
        url: `/content/admin/benefits/auth/detail`,
        method: "POST",
        data: {}
      })
    ).data;
    if (response.code == 200) {
      let posterList = response.data;
      commit("GETUSERBENEFITS", { posterList });
    }
    return response;
  },
  async saveBenefitsImg({ commit }, payload) {
    const response = (
      await request({
        url: `/content/admin/benefits/auth/save/image`,
        method: "POST",
        data: payload
      })
    ).data;
    if (response.code === 200) {
      commit("getBenefits", {
        type: 0
      });
    }
    return response;
  },
  async saveBenefitsProfile({ commit }, payload) {
    const response = (
      await request({
        url: `/content/admin/benefits/auth/save/profile`,
        method: "POST",
        data: payload
      })
    ).data;
    if (response.code === 200) {
      commit("getBenefits", {
        type: 0
      });
    }
    return response;
  }
};
const mutations = {
  // 获取用户权益
  [GETUSERBENEFITS](state, payload) {
    state.userBenefits = payload.userBenefits;
  }

};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
