import { GETCUPCOLLECTS } from "../../mutations_type";
import request from "@/utils/request";
const state = {
  collects: [],
  pageNum: 1,
  pageSize: 20,
  totalSize: 0
};
// 请求的url 前面需要加上 user
const actions = {
  // 获取收藏用户
  // type 为 0 表示收藏 , type 为 1 表示 取消收藏 。
  async getCollects({ commit }, payload) {
    const response = (
      await request({
        url: `/user/admin/userCollect/queryCollectByModel`,
        method: "POST",
        data: payload
      })
    ).data;
    if (response.code == 200) {
      const { list: collects, pageNum, pageSize, totalSize } = response.data;
      commit("GETCUPCOLLECTS", { collects, pageNum, pageSize, totalSize });
    }
    return response;
  }
};
const mutations = {
  // 获取统计数据
  [GETCUPCOLLECTS](state, payload) {
    state.collects = payload.collects;
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
