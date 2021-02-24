import { GETUSERINTEGRALRULE, CHANGEUSERINTEGRALRULEATTR } from "../../mutations_type";
import request from "@/utils/request";

const state = {
  userIntegralRules: []
};

const actions = {
  async saveSignInRule({ commit }, payload) {
    const response = (
      await request({
        url: `/user/admin/user-integral-rule/auth/saveSignInRule`,
        method: "POST",
        data: payload
      })
    ).data;
    if (response.code == 200) {
      let userIntegralRules = response.data;
      commit("GETUSERINTEGRALRULE", { userIntegralRules });
    }
    return response;
  },
  async saveTrainAndCupSave({ commit }, payload) {
    const response = (
      await request({
        url: `/user/admin/user-integral-rule/auth/saveUserIntegralRule`,
        method: "POST",
        data: payload
      })
    ).data;
    if (response.code == 200) {
      let userIntegralRules = response.data;
      commit("GETUSERINTEGRALRULE", { userIntegralRules });
    }
    return response;
  },
  async getUserIntegralRules({ commit }) {
    const response = (
      await request({
        url: `/user/admin/user-integral-rule/auth/list`,
        method: "GET",
        data: {}
      })
    ).data;
    if (response.code == 200) {
      let userIntegralRules = response.data;
      commit("GETUSERINTEGRALRULE", { userIntegralRules });
    }
    return response;
  },
  async changeIntegralRuleStatus({ commit }, payload) {
    const {status, type, dataIndex} = payload;
    const response = (
      await request({
        url: `/user/admin/user-integral-rule/auth/status?status=${status}&type=${type}`,
        method: "GET",
        data: {}
      })
    ).data;
    if (response.code == 200) {
      commit("CHANGEUSERINTEGRALRULEATTR", { value: status, type, dataIndex });
    }
    return response;
  }
};

const mutations = {
  // 获取列表
  [GETUSERINTEGRALRULE](state, payload) {
    state.userIntegralRules = payload.userIntegralRules;
  },
  // 修改广告位状态、排序
  [CHANGEUSERINTEGRALRULEATTR](state, payload) {
    const {value, id, dataIndex} = payload;
    const userIntegralRules = [...state.userIntegralRules];
    const target = userIntegralRules.find(item => item.id === id);
    if (target) {
      target[dataIndex] = value;
    }
    state.userIntegralRules = userIntegralRules;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
