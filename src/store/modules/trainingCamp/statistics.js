import { GETCOURSESTATISTICS } from "../../mutations_type";
import request from "@/utils/request";
const state = {
  statistics: [],
  pageNum: 1,
  pageSize: 20,
  totalSize: 0
  
};
// 请求的url 前面需要加上 content
const actions = {
  // 数据导出
  // eslint-disable-next-line no-empty-pattern
  async exportStatistics({}, payload) {
    const response = (
      await request({
        url: `/content/admin/courseData/auth/courseDataExport`,
        method: "POST",
        responseType: "arraybuffer",
        data: payload
      })
    ).data;
    return response;
  },
  // 获取统计数据
  async getStatistics({ commit }, payload) {
    const response = (
      await request({
        url: `/content/admin/courseData/auth/list`,
        method: "POST",
        data: payload
      })
    ).data;
    if (response.code == 200) {
      const { list: statistics, pageNum, pageSize, totalSize } = response.data;
      commit("GETCOURSESTATISTICS", {
        statistics,
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
  [GETCOURSESTATISTICS](state, payload) {
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
