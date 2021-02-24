import { CHANGEMENUATTR, GETMENUS } from "../../mutations_type";
import request from "@/utils/request";

const state = {
  menuList: []
};
// 请求的url 前面需要加上 content
const actions = {
  // 获取海报列表
  async getMenu({ commit }, payload) {
    const { type } = payload;
    const response = (
      await request({
        url: `/content/admin/menu/auth/list?type=${type}`,
        method: "POST",
        data: {}
      })
    ).data;
    if (response.code == 200) {
      let menuList = response.data;
      commit("GETMENUS", { menuList });
    }
    return response;
  },
  async editMenu({ commit }, payload) {
    const response = (
      await request({
        url: `/content/admin/menu/auth/edit`,
        method: "POST",
        data: payload
      })
    ).data;
    if (response.code === 200) {
      commit("getMenu", {
        type: 0
      });
    }
    return response;
  },
  async changeMenuStatus({ commit }, payload) {
    const { status, id, dataIndex } = payload;
    const response = (
      await request({
        url: `/content/admin/menu/auth/status?status=${Number(status)}&id=${id}`,
        method: "POST",
        data: {}
      })
    ).data;
    if (response.code == 200) {
      commit("CHANGEMENUATTR", {value: status, id, dataIndex});
    }
    return response;
  }
};
const mutations = {
  // 获取列表
  [GETMENUS](state, payload) {
    state.menuList = payload.menuList;
  },
  // 修改状态
  [CHANGEMENUATTR](state, payload) {
    const {value, id, dataIndex} = payload;
    const menuList = [...state.menuList];
    const target = menuList.find(item => item.id === id);
    if (target) {
      target[dataIndex] = value;
    }
    state.menuList = menuList;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
