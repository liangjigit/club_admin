import { CHANGEPOSTERATTR, GETPOSTERS } from "../../mutations_type";
import request from "@/utils/request";

const state = {
  posterList: []
};
// 请求的url 前面需要加上 content
const actions = {
  // 获取海报列表
  async getPoster({ commit }, payload) {
    const { type } = payload;
    const response = (
      await request({
        url: `/content/admin/poster/auth/list?type=${type}`,
        method: "POST",
        data: {}
      })
    ).data;
    if (response.code == 200) {
      let posterList = response.data;
      commit("GETPOSTERS", { posterList });
    }
    return response;
  },
  async createPoster({ dispatch }, payload) {
    // 新增海报
    const response = (
      await request({
        url: `/content/admin/poster/auth/save`,
        method: "POST",
        data: payload
      })
    ).data;
    if (response.code == 200) {
      dispatch("getPoster", {
        type: 0
      });
    }
    return response;
  },
  async editPoster({ commit }, payload) {
    const response = (
      await request({
        url: `/content/admin/poster/auth/edit`,
        method: "POST",
        data: payload
      })
    ).data;
    if (response.code === 200) {
      commit("getPoster", {
        type: 0
      });
    }
    return response;
  },
  async changePosterStatus({ commit }, payload) {
    const { status, id, dataIndex } = payload;
    const response = (
      await request({
        url: `/content/admin/poster/auth/status?status=${Number(status)}&id=${id}`,
        method: "POST",
        data: {}
      })
    ).data;
    if (response.code == 200) {
      commit("CHANGEPOSTERATTR", {value: status, id, dataIndex});
    }
    return response;
  }
};
const mutations = {
  // 获取海报列表
  [GETPOSTERS](state, payload) {
    state.posterList = payload.posterList;
  },
  // 修改弹窗状态
  [CHANGEPOSTERATTR](state, payload) {
    const {value, id, dataIndex} = payload;
    const posterList = [...state.posterList];
    const target = posterList.find(item => item.id === id);
    if (target) {
      target[dataIndex] = value;
    }
    state.posterList = posterList;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
