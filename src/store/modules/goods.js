import {GETGOODSINFO, GETGOODS, GETALLGOODS} from "../mutations_type";
import request from "@/utils/request";
const state = {
  allGoods: [], // 所有商品
  goods: [], // 商品列表
  pageNum: 1,
  pageSize: 20,
  totalSize: 0,
  detail: {}
};
const actions = {
  async getAllGoods({ commit }, payload) {
    const { goods } = payload;
    const response = (
      await request({
        url: `/content/admin/goods/auth/all?goods=${goods}`,
        method: "POST",
        data: {}
      })
    ).data;
    const { data: allGoods } = response;
    if (response.code == 200) {
      commit("GETALLGOODS", { allGoods });
    }
    return response;
  },
  //   获取商品列表
  async getGoods({ commit }, payload) {
    const response = (
      await request({
        url: `/content/admin/goods/auth/list`,
        method: "POST",
        data: payload
      })
    ).data;
    if (response.code == 200) {
      const { list: goods, pageNum, pageSize, totalSize } = response.data;
      commit("GETGOODS", { goods, pageNum, pageSize, totalSize });
    }
    return response;
  },
  // 修改商品状态
  async deleteGoods({ commit }, payload) {
    const { status, id, dataIndex } = payload;
    const response = (
      await request({
        url: `/content/admin/goods/auth/deleted?id=${id}`,
        method: "POST"
      })
    ).data;
    if (response.code === 200) {
      commit("CHANGEARTICLESATTR", { value: status, id, dataIndex });
    }
    return response;
  },
  // 修改商品状态
  async changeGoodsStatus({ commit }, payload) {
    const { status, id, dataIndex } = payload;
    const response = (
      await request({
        url: `/content/admin/goods/auth/status?status=${Number(status)}&id=${id}`,
        method: "POST"
      })
    ).data;
    if (response.code === 200) {
      commit("CHANGEARTICLESATTR", { value: status, id, dataIndex });
    }
    return response;
  },
  // 新增商品
  async createGoods({ commit }, payload) {
    const response = (
      await request({
        url: `/content/admin/goods/auth/add`,
        method: "POST",
        data: payload
      })
    ).data;
    if (response.code === 200) {
      const { list: goods, pageNum, pageSize, totalSize } = response.data;
      commit("GETGOODS", { goods, pageNum, pageSize, totalSize });
    }
    return response;
  },
  // 编辑商品
  async editGoods({ commit }, payload) {
    const response = (
      await request({
        url: `/content/admin/goods/auth/edit`,
        method: "POST",
        data: payload
      })
    ).data;
    if (response.code === 200) {
      const { list: goods, pageNum, pageSize, totalSize } = response.data;
      commit("GETGOODS", { goods, pageNum, pageSize, totalSize });
    }
    return response;
  },
  // 商品详情
  // eslint-disable-next-line no-empty-pattern
  async goodsDetail({}, payload) {
    const { id } = payload;
    const response = (
      await request({
        url: `/content/admin/goods/auth/detail?id=${id}`,
        method: "POST"
      })
    ).data;
    return response;
  }
};
const mutations = {
  [GETALLGOODS](state, payload) {
    state.allGoods = payload.allGoods;
  },
  [GETGOODSINFO](state, payload) {
    let detail = { ...payload.detail };
    state.detail = detail;
  },
  // 获取商品列表
  [GETGOODS](state, payload) {
    state.goods = payload.goods;
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

