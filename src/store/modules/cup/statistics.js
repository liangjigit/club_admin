import { GETCUPSTATISTICS } from "../../mutations_type";
import request from "@/utils/request";
const state = {
  statistics: [],
  pageNum: 1,
  pageSize: 20,
  totalSize: 0
};
// 请求的url 前面需要加上 content
// cup 与 brarts 共用接口，部分接口用type 区分，type 为 0 表示cup , type 为 1 表示 brarts 。
const actions = {
  // cup 数据导出
  // eslint-disable-next-line no-empty-pattern
  async exportStatistics({}, payload) {
    const response = (
      await request({
        url: `/content/admin/articleData/auth/articleDataExport`,
        method: "POST",
        responseType: "arraybuffer",
        data: payload
      })
    ).data;
    return response;
  },
  // brarts 数据导出
  // eslint-disable-next-line no-empty-pattern
  async exportBrartsStatistics({}, payload) {
    const response = (
      await request({
        url: `/content/admin/articleData/auth/BRARTSExport`,
        method: "POST",
        responseType: "arraybuffer",
        data: payload
      })
    ).data;
    return response;
  },
  // 获取统计数据
  // type 为 0 表示cup , type 为 1 表示 brarts 。
  async getStatistics({ commit }, payload) {
    const response = (
      await request({
        url: `/content/admin/articleData/auth/list`,
        method: "POST",
        data: payload
      })
    ).data;
    if (response.code == 200) {
      const { list: statistics, pageNum, pageSize, totalSize } = response.data;
      commit("GETCUPSTATISTICS", { statistics, pageNum, pageSize, totalSize });
    }
    return response;
  }
};
const mutations = {
  // 获取统计数据
  [GETCUPSTATISTICS](state, payload) {
    state.statistics = payload.statistics;
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
