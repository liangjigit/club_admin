import { GETALLPAGES } from "../mutations_type";

import request from "@/utils/request";
const state = {
  allPages: []
};

const actions = {
  async getPages({ commit } ) {
    const response = (
      await request({
        url: `/content/admin/page/auth/list`,
        method: "POST",
        data: {}
      })
    ).data;
    if (response.code == 200) {
      const { data: allPages } = response;
      commit("GETALLPAGES", { allPages });
    }
    return response;
  }
};
const mutations = {
  [GETALLPAGES](state, payload) {
    state.allPages = payload.allPages;
    console.log(state.allPages);

  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
