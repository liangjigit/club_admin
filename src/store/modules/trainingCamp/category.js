import {
  GETCATEGORY,
  CHANGECATEGORYATTR,
  GETALLCATEGORYIES
} from "../../mutations_type";
import request from "@/utils/request";
const state = {
  allCategories: [], // 所有分类
  categories: [], // 分类列表
  pageNum: 1,
  pageSize: 20,
  totalSize: 0
};
// 请求的url 前面需要加上 content
const actions = {
  // 获取所有分类
  async getAllCategories({ commit }, payLoad) {
    const { categoryName } = payLoad;
    const response = (
      await request({
        url: `/content/admin/category/auth/all?categoryName=${categoryName}`,
        method: "POST"
      })
    ).data;
    if (response.code == 200) {
      commit("GETALLCATEGORYIES", { allCategories: response.data });
    }
    return response;
  },
  // 编辑分类
  async editCategory({ commit }, payload) {
    const { categoryName, id, dataIndex } = payload;
    const response = (
      await request({
        url: `/content/admin/category/auth/edit?categoryName=${categoryName}&id=${id}`,
        method: "POST",
        data: {}
      })
    ).data;
    // console.log(response)
    if (response.code == 200) {
      commit("CHANGECATEGORYATTR", { value: categoryName, id, dataIndex });
    }
    return response;
  },
  // 新增分类
  async createCategory({ dispatch }, payload) {
    const { categoryName } = payload;
    const response = (
      await request({
        url: `/content/admin/category/auth/save?categoryName=${categoryName}`,
        method: "POST",
        data: {}
      })
    ).data;
    if (response.code == 200) {
      dispatch("getCategories", {
        pageNum: 1,
        pageSize: 20,
        status: "",
        categoryName: ""
      });
    }
    return response;
  },
  // 获取分类
  async getCategories({ commit }, payload) {
    const response = (
      await request({
        url: "/content/admin/category/auth/list",
        method: "POST",
        data: payload
      })
    ).data;
    // console.log(response);
    if (response.code == 200) {
      let { list: categories, pageNum, pageSize, totalSize } = response.data;
      commit("GETCATEGORY", { categories, pageNum, pageSize, totalSize });
    }
    return response;
  },
  // 修改分类状态
  async changeCategoryStatus({ commit }, payload) {
    const { status, id, dataIndex } = payload;
    const response = (
      await request({
        url: `/content/admin/category/auth/status?status=${Number(
          status
        )}&id=${id}`,
        method: "POST",
        data: {}
      })
    ).data;
    if (response.code == 200) {
      commit("CHANGECATEGORYATTR", { value: status, id, dataIndex });
    }
    return response;
  },
  // 修改分类排序
  async changeCategorySort({ commit }, payload) {
    const { categorySort, id, dataIndex } = payload;
    const response = (
      await request({
        url: `/content/admin/category/auth/sort?categorySort=${Number(
          categorySort
        )}&id=${id}`,
        method: "POST",
        data: {}
      })
    ).data;
    if (response.code == 200) {
      commit("CHANGECATEGORYATTR", { value: categorySort, id, dataIndex });
    }
    return response;
  }
};
const mutations = {
  // 获取所有分类
  [GETALLCATEGORYIES](state, payload) {
    state.allCategories = payload.allCategories;
  },
  // 修改分类状态、排序
  [CHANGECATEGORYATTR](state, payload) {
    const { value, id, dataIndex } = payload;
    const categories = [...state.categories];
    const target = categories.find(item => item.id === id);
    if (target) {
      target[dataIndex] = value;
    }
    state.categories = categories;
    // console.log(state.categories);
  },
  // 获取分类列表
  [GETCATEGORY](state, payload) {
    state.categories = payload.categories;
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
