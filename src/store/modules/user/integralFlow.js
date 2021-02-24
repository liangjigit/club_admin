import { GETUSERINTEGRALFLOW } from "../../mutations_type";
import request from "@/utils/request";

const state = {
  userIntegralFlows: [],
  pageNum: 1,
  pageSize: 20,
  totalSize: 0
};

const actions = {
  // eslint-disable-next-line no-empty-pattern
  async exportIntegralFlow({}, payload) {
    const response = (
      await request({
        url: `/user/admin/user/auth/userIntegralFlowExport`,
        method: "POST",
        responseType: "arraybuffer",
        data: payload
      })
    ).data;
    return response;
  },
  async getUserIntegralFlows({ commit }, payload) {
    const response = (
      await request({
        url: `/user/admin/user/auth/userIntegralFlow`,
        method: "POST",
        data: payload
      })
    ).data;
    if (response.code == 200) {
      let { list: userIntegralFlows, pageNum, pageSize, totalSize } = response.data;
      commit("GETUSERINTEGRALFLOW", { userIntegralFlows, pageNum, pageSize, totalSize });
    }
    return response;
  }
};

const mutations = {
  // 获取列表
  [GETUSERINTEGRALFLOW](state, payload) {
    state.userIntegralFlows = payload.userIntegralFlows.map(item => {
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
