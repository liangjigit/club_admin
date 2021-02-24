import { GETTAGS, CHANGETAGATTR, GETALLTAGS } from "../../mutations_type";
import request from "@/utils/request";
const state = {
  allTags: [], // 所有标签
  tags: [], // 标签列表
  tagsPageNum: 1,
  tagsPageSize: 20,
  tagsTotalSize: 0
};
// 请求的url 前面需要加上 content
const actions = {
  // 获取所有标签
  async getAllTags({ commit }, payLoad) {
    const { tagsName } = payLoad;
    const response = (
      await request({
        url: `/content/admin/tags/auth/all?tagsName=${tagsName}`,
        method: "POST"
      })
    ).data;
    if (response.code == 200) {
      commit("GETALLTAGS", { allTags: response.data });
    }
    return response;
  },
  // 编辑标签
  async editTag({ commit }, payload) {
    const { tagName, id, dataIndex } = payload;
    const response = (
      await request({
        url: `/content/admin/tags/auth/edit?tagsName=${tagName}&id=${id}`,
        method: "POST",
        data: {}
      })
    ).data;
    // console.log(response)
    if (response.code == 200) {
      commit("CHANGETAGATTR", { value: tagName, id, dataIndex });
    }
    return response;
  },
  // 新增标签
  async createTag({ dispatch }, payload) {
    const { tagName } = payload;
    const response = (
      await request({
        url: `/content/admin/tags/auth/save?tagName=${tagName}`,
        method: "POST",
        data: {}
      })
    ).data;
    if (response.code == 200) {
      dispatch("getTags", {
        pageNum: 1,
        pageSize: 20,
        status: "",
        tagsName: ""
      });
    }
    return response;
  },
  // 获取标签
  async getTags({ commit }, payload) {
    const response = (
      await request({
        url: "/content/admin/tags/auth/list",
        method: "POST",
        data: payload
      })
    ).data;
    // console.log(response);
    if (response.code == 200) {
      let { list: tags, pageNum, pageSize, totalSize } = response.data;
      commit("GETTAGS", { tags, pageNum, pageSize, totalSize });
    }
    return response;
  },
  // 修改标签状态
  async changeTagStatus({ commit }, payload) {
    const { status, id, dataIndex } = payload;
    const response = (
      await request({
        url: `/content/admin/tags/auth/status?status=${Number(
          status
        )}&id=${id}`,
        method: "POST",
        data: {}
      })
    ).data;
    if (response.code == 200) {
      commit("CHANGETAGATTR", { value: status, id, dataIndex });
    }
    return response;
  },
  // 修改标签排序
  async changeTagSort({ commit }, payload) {
    const { tagsSort, id, dataIndex } = payload;
    const response = (
      await request({
        url: `/content/admin/tags/auth/sort?tagsSort=${Number(
          tagsSort
        )}&id=${id}`,
        method: "POST",
        data: {}
      })
    ).data;
    if (response.code == 200) {
      commit("CHANGETAGATTR", { value: tagsSort, id, dataIndex });
    }
    return response;
  }
};
const mutations = {
  // 获取所有标签
  [GETALLTAGS](state, payload) {
    state.allTags = payload.allTags;
  },
  // 修改标签状态、排序
  [CHANGETAGATTR](state, payload) {
    const { value, id, dataIndex } = payload;
    const tags = [...state.tags];
    const target = tags.find(item => item.id === id);
    if (target) {
      target[dataIndex] = value;
    }
    state.tags = tags;
    // console.log(state.tags);
  },
  // 获取标签列表
  [GETTAGS](state, payload) {
    state.tags = payload.tags;
    state.tagsPageNum = payload.pageNum;
    state.tagsPageSize = payload.pageSize;
    state.tagsTotalSize = payload.totalSize;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
