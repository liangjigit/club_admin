import {CHANGEBANNERATTR, GETBANNERS} from "../../mutations_type";
import request from "@/utils/request";

const state = {

  bannerList: [],
  bannerPageNum: 1,
  bannerPageSize: 20,
  bannerTotalSize: 0
};
// 请求的url 前面需要加上 content
const actions = {
  // 获取广告位
  async getBanner({commit}, payload) {
    const response = (
      await request({
        url: "/content/admin/banner/auth/list",
        method: "POST",
        data: payload
      })
    ).data;
    // console.log(response);
    if (response.code == 200) {
      let {list: bannerList, pageNum, pageSize, totalSize} = response.data;
      commit("GETBANNERS", {bannerList, pageNum, pageSize, totalSize});
    }
    return response;
  },
  async createBanner({dispatch}, payload) {
    // 新增banner
    const response = (
      await request({
        url: `/content/admin/banner/auth/save`,
        method: "POST",
        data: payload
      })
    ).data;
    if (response.code == 200) {
      dispatch("getBanner", {
        pageNum: 1,
        pageSize: 20
      });
    }
    return response;
  },
  async editBanner({commit}, payload) {
    console.log(payload);
    const response = (
      await request({
        url: `/content/admin/banner/auth/edit`,
        method: "POST",
        data: payload
      })
    ).data;
    // console.log(response)
    if (response.code === 200) {
      const {list: bannerList, pageNum, pageSize, totalSize} = response.data;
      commit("GETBANNERS", {bannerList, pageNum, pageSize, totalSize});
    }
    return response;
  },
  async changeBannerStatus({commit}, payload) {
    const {status, id, dataIndex} = payload;
    const response = (
      await request({
        url: `/content/admin/banner/auth/status?status=${Number(
          status
        )}&id=${id}`,
        method: "GET",
        data: {}
      })
    ).data;
    if (response.code == 200) {
      commit("CHANGEBANNERATTR", {value: status, id, dataIndex});
    }
    return response;
  },
  // eslint-disable-next-line no-empty-pattern
  async bannerDelete({}, payload) {
    const { id } = payload;
    const response = (
      await request({
        url: `/content/admin/banner/auth/delete?id=${id}`,
        method: "GET",
        data: {}
      })
    ).data;
    return response;
  },
  // 修改标签排序
  async changeBannerSort({commit}, payload) {
    const {bannerSort, id, dataIndex} = payload;
    const response = (
      await request({
        url: `/content/admin/banner/auth/sort?bannerSort=${Number(
          bannerSort
        )}&id=${id}`,
        method: "GET",
        data: {}
      })
    ).data;
    if (response.code == 200) {
      commit("CHANGEBANNERATTR", {value: bannerSort, id, dataIndex});
    }
    return response;
  }
};
const mutations = {
  // 获取广告位列表
  [GETBANNERS](state, payload) {
    state.bannerList = payload.bannerList.map(item => {
      item.bannerSort = item.bannerSort.toString();
      return item;
    });
    state.bannerPageNum = payload.pageNum;
    state.bannerPageSize = payload.pageSize;
    state.bannerTotalSize = payload.totalSize;
  },
  // 修改广告位状态、排序
  [CHANGEBANNERATTR](state, payload) {
    const {value, id, dataIndex} = payload;
    const bannerList = [...state.bannerList];
    const target = bannerList.find(item => item.id === id);
    if (target) {
      target[dataIndex] = value;
    }
    state.bannerList = bannerList;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
