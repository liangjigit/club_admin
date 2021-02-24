import { GETCOURSEJOINS } from "../../mutations_type";
import request from "@/utils/request";
const state = {
  joins: [],
  pageNum: 1,
  pageSize: 20,
  totalSize: 0
};
// 请求的url 前面需要加上 user
const actions = {
  // 获取打卡用户
  // model 为 2 表示体态训练营课程打卡 , type 为 1 表示 BRARTS打卡 。
  async getJoins({ commit }, payload) {
    const response = (
      await request({
        url: `/user/admin/userPunch/queryPunchByModel`,
        method: "POST",
        data: payload
      })
    ).data;
    if (response.code == 200) {
      const { list: joins, pageNum, pageSize, totalSize } = response.data;
      commit("GETCOURSEJOINS", { joins, pageNum, pageSize, totalSize });
    }
    return response;
  }
};
const mutations = {
  // 获取统计数据
  [GETCOURSEJOINS](state, payload) {
    state.joins = payload.joins;
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
