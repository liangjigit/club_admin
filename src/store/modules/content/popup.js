import { CHANGEPOPUPATTR, GETPOPUPS } from "../../mutations_type";
import request from "@/utils/request";

const state = {
  popupList: [],
  popupPageNum: 1,
  popupPageSize: 20,
  popupTotalSize: 0
};
// 请求的url 前面需要加上 content
const actions = {
  // 获取弹窗列表
  async getPopup({ commit }, payload) {
    const response = (
      await request({
        url: "/content/admin/popup/auth/list",
        method: "POST",
        data: payload
      })
    ).data;
    if (response.code == 200) {
      let { list: popupList, pageNum, pageSize, totalSize } = response.data;
      console.log(popupList);
      commit("GETPOPUPS", { popupList, pageNum, pageSize, totalSize });
    }
    return response;
  },
  async createPopup({ dispatch }, payload) {
    // 新增弹窗
    const response = (
      await request({
        url: `/content/admin/popup/auth/save`,
        method: "POST",
        data: payload
      })
    ).data;
    if (response.code == 200) {
      dispatch("getPopup", {
        pageNum: 1,
        pageSize: 20
      });
    }
    return response;
  },
  async editPopup({ commit }, payload) {
    const response = (
      await request({
        url: `/content/admin/popup/auth/edit`,
        method: "POST",
        data: payload
      })
    ).data;
    if (response.code === 200) {
      const { list: popupList, pageNum, pageSize, totalSize } = response.data;
      commit("GETPOPUPS", { popupList, pageNum, pageSize, totalSize });
    }
    return response;
  },
  async changePopupStatus({ commit }, payload) {
    const { status, id, dataIndex } = payload;
    const response = (
      await request({
        url: `/content/admin/popup/auth/status?status=${Number(status)}&id=${id}`,
        method: "POST",
        data: {}
      })
    ).data;
    if (response.code == 200) {
      commit("CHANGEPOPUPATTR", { value: status, id, dataIndex });
    }
    return response;
  },
  // eslint-disable-next-line no-empty-pattern
  async deletePopup({}, payload) {
    const { id } = payload;
    const response = (
      await request({
        url: `/content/admin/popup/auth/delete?id=${id}`,
        method: "POST",
        data: {}
      })
    ).data;
    return response;
  }
};
const mutations = {
  // 获取弹窗列表
  [GETPOPUPS](state, payload) {
    state.popupList = payload.popupList.map(item => {
      return item;
    });
    state.popupPageNum = payload.pageNum;
    state.popupPageSize = payload.pageSize;
    state.popupTotalSize = payload.totalSize;
  },
  // 修改弹窗状态
  [CHANGEPOPUPATTR](state, payload) {
    const { value, id, dataIndex} = payload;
    const popupList = [...state.popupList];
    const target = popupList.find(item => item.id === id);
    if (target) {
      target[dataIndex] = value;
    }
    state.popupList = popupList;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
