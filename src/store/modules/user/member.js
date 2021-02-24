import { GETMEMBERS, GETUSERSPOUSE, GETUSERBABY, GETUSERINTEGRAL, GETUSERGUIDE } from "../../mutations_type";
import request from "@/utils/request";

const state = {
  members: [],
  pageNum: 1,
  pageSize: 20,
  totalSize: 0,
  userSpouse: {},
  userIntegral: {},
  userGuide: {},
  userBaby: []
};

const actions = {
  // eslint-disable-next-line no-empty-pattern
  async exportMember({}, payload) {
    const response = (
      await request({
        url: `/user/admin/user/auth/userListExport`,
        method: "POST",
        responseType: "arraybuffer",
        data: payload
      })
    ).data;
    return response;
  },
  // eslint-disable-next-line no-empty-pattern
  async exportUserGuide({}, payload) {
    const response = (
      await request({
        url: `/user/admin/user/auth/userGuideExport`,
        method: "POST",
        responseType: "arraybuffer",
        data: payload
      })
    ).data;
    return response;
  },
  // 获取会员列表
  async getMembers({ commit }, payload) {
    const response = (
      await request({
        url: "/user/admin/user/auth/query",
        method: "POST",
        data: payload
      })
    ).data;
    if (response.code == 200) {
      let { list: members, pageNum, pageSize, totalSize } = response.data;
      commit("GETMEMBERS", { members, pageNum, pageSize, totalSize });
    }
    return response;
  },
  // 我的TA
  async getUserSpouse({ commit }, payload) {
    const { userId } = payload;
    const response = (
      await request({
        url: `/user/admin/user/auth/userSpouse?userId=${userId}`,
        method: "GET",
        data: {}
      })
    ).data;
    if (response.code == 200) {
      commit("GETUSERSPOUSE", { userSpouse: response.data});
    }
    return response;
  },
  // 我的宝贝
  async getUserBaby({ commit }, payload) {
    const { userId } = payload;
    const response = (
      await request({
        url: `/user/admin/user/auth/userBaby?userId=${userId}`,
        method: "GET",
        data: {}
      })
    ).data;
    if (response.code == 200) {
      commit("GETUSERBABY", { userBaby: response.data });
    }
    return response;
  },
  // 导购关系
  async getUserGuide({ commit }, payload) {
    const { userId } = payload;
    const response = (
      await request({
        url: `/user/admin/user/auth/userGuide?userId=${userId}`,
        method: "GET",
        data: {}
      })
    ).data;
    if (response.code == 200) {
      commit("GETUSERGUIDE", { userGuide: response.data });
    }
    return response;
  },
  // 积分信息
  async getUserIntegral({ commit }, payload) {
    const { userId } = payload;
    const response = (
      await request({
        url: `/user/admin/user/auth/userIntegral?userId=${userId}`,
        method: "GET",
        data: {}
      })
    ).data;
    if (response.code == 200) {
      commit("GETUSERINTEGRAL", { userIntegral: response.data });
    }
    return response;
  }
};

const mutations = {
  // 获取会员列表
  [GETMEMBERS](state, payload) {
    state.members = payload.members.map(item => {
      return item;
    });
    state.pageNum = payload.pageNum;
    state.pageSize = payload.pageSize;
    state.totalSize = payload.totalSize;
  },
  [GETUSERSPOUSE](state, payload) {
    let userSpouse = { ...payload.userSpouse };
    state.userSpouse = userSpouse;
  },
  [GETUSERINTEGRAL](state, payload) {
    let userIntegral = { ...payload.userIntegral };
    state.userIntegral = userIntegral;
  },
  [GETUSERBABY](state, payload) {
    let userBaby = { ...payload.userBaby };
    state.userBaby = userBaby;
  },
  [GETUSERGUIDE](state, payload) {
    let userGuide = { ...payload.userGuide };
    state.userGuide = userGuide;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
