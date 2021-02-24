import { GETSIGNUPLIST } from "../../mutations_type";
import request from "@/utils/request";
const state = {
  signUpList: [],
  pageNum: 1,
  pageSize: 20,
  totalSize: 0
};
// 请求的url 前面需要加上 content
const actions = {
  // 数据导出
  // eslint-disable-next-line no-empty-pattern
  async exportSignUpData({}, payload) {
    const response = (
      await request({
        url: `/content/admin/activityApply/auth/activityApplyExport`,
        method: "POST",
        responseType: "arraybuffer",
        data: payload
      })
    ).data;
    return response;
  },
  // 获取报名数据
  async getSignUpList({ commit }, payload) {
    const response = (
      await request({
        url: `/content/admin/activityApply/auth/list`,
        method: "POST",
        data: payload
      })
    ).data;
    if (response.code == 200) {
      const { list: signUpList, pageNum, pageSize, totalSize } = response.data;
      commit("GETSIGNUPLIST", {
        signUpList,
        pageNum,
        pageSize,
        totalSize
      });
    }
    return response;
  }
};
const mutations = {
  // 获取统计数据
  [GETSIGNUPLIST](state, payload) {
    state.signUpList = payload.signUpList;
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
