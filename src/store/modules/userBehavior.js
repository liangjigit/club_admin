import { GETUSERBEHAVIOR } from "../mutations_type";
import request from "@/utils/request";

const state = {
  userBehaviors: [],
  pageNum: 1,
  pageSize: 20,
  totalSize: 0
};

const actions = {
  // eslint-disable-next-line no-empty-pattern
  async exportUserBehaviors({}, payload) {
    const response = (
      await request({
        url: `/user/admin/behavior/auth/userBehaviorExport`,
        method: "POST",
        responseType: "arraybuffer",
        data: payload
      })
    ).data;
    return response;
  },
  async getUserBehaviors({ commit }, payload) {
    const response = (
      await request({
        url: `/user/admin/behavior/auth/query`,
        method: "POST",
        data: payload
      })
    ).data;
    if (response.code == 200) {
      let { list: userBehaviors, pageNum, pageSize, totalSize } = response.data;
      commit("GETUSERBEHAVIOR", { userBehaviors, pageNum, pageSize, totalSize });
    }
    return response;
  }
};

const mutations = {
  // 获取列表
  [GETUSERBEHAVIOR](state, payload) {
    state.userBehaviors = payload.userBehaviors.map(item => {
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
