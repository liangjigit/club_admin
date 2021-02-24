import { GETEVALUATIONS } from "../../mutations_type";
import request from "@/utils/request";
const state = {
  evaluations: [], // 体态测评列表
  pageNum: 1,
  pageSize: 20,
  totalSize: 0
};
// 请求的url 前面需要加上 user
const actions = {
  // 获取体态测评列表
  async getEvaluations({ commit }, payload) {
    const response = (
      await request({
        url: "/user/admin/posture/auth/list",
        method: "POST",
        data: payload
      })
    ).data;
    // console.log(response);
    if (response.code == 200) {
      let { list: evaluations, pageNum, pageSize, totalSize } = response.data;
      commit("GETEVALUATIONS", { evaluations, pageNum, pageSize, totalSize });
    }
    return response;
  },
  // 查询体态测量信息
  // eslint-disable-next-line no-unused-vars
  async getReport({ commit }, payload) {
    const { date, postureId, showCourse } = payload;
    let response = (
      await request({
        url:
          "/user/miniapp/posture/auth/queryByDate?date=" +
          date +
          "&postureId=" +
          postureId +
          "&showCourse=" +
          showCourse,
        method: "GET",
        data: payload
      })
    ).data;
    return response;
  }
};
const mutations = {
  // 获取体态测评列表
  [GETEVALUATIONS](state, payload) {
    state.evaluations = payload.evaluations.map(item => {
      item.nippleSpacing = item.nippleSpacing || "-";
      item.nippleToUnderBreast = item.nippleToUnderBreast || "-";
      item.underBust = item.underBust || "-";
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
