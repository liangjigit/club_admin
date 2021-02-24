import { GETALLEXPERTS, GETEXPERTS, CHANGEEXPERTSATTR } from "../mutations_type";
import request from "@/utils/request";
const state = {
  allExperts: [],
  experts: [],
  expertPageNum: 1,
  expertPageSize: 20,
  expertTotalSize: 0
};
// 请求的url 前面需要加上 content
// 专家，导师使用 type 区分 1 表示专家，0 表示导师。
const actions = {
  async getAllExperts({ commit }, payload) {
    const { expertName, type } = payload;
    const response = (
      await request({
        url: `/content/admin/expert/auth/all?expertName=${expertName}&type=${type}`,
        method: "POST",
        data: {}
      })
    ).data;
    const { data: allExperts } = response;
    if (response.code == 200) {
      commit("GETALLEXPERTS", { allExperts });
    }
    return response;
  },
  // 获取专家
  async getExperts({ commit }, payload) {
    const response = (
      await request({
        url: `/content/admin/expert/auth/list`,
        method: "POST",
        data: payload
      })
    ).data;
    if (response.code == 200) {
      const { list: experts, pageNum, pageSize, totalSize } = response.data;
      commit("GETEXPERTS", { experts, pageNum, pageSize, totalSize });
    }
    return response;
  },
  // 删除文章
  // eslint-disable-next-line no-empty-pattern
  async deleteExpert({}, payload) {
    const { id } = payload;
    const response = (
      await request({
        url: `/content/admin/expert/auth/deleted?id=${id}`,
        method: "GET",
        data: {}
      })
    ).data;
    return response;
  },
  async changeExpertStatus({commit}, payload) {
    const {status, id, dataIndex} = payload;
    const response = (
      await request({
        url: `/content/admin/expert/auth/status?status=${Number(
          status
        )}&id=${id}`,
        method: "POST",
        data: {}
      })
    ).data;
    if (response.code == 200) {
      commit("CHANGEEXPERTSATTR", {value: status, id, dataIndex});
    }
    return response;
  },
  // 修改专家排序
  async changeExpertSort({ commit }, payload) {
    const { expertSort, id, dataIndex } = payload;
    const response = (
      await request({
        url: `/content/admin/expert/auth/sort?expertSort=${Number(
          expertSort
        )}&id=${id}`,
        method: "POST",
        data: {
          expertSort: Number(expertSort),
          id
        }
      })
    ).data;
    if (response.code == 200) {
      commit("CHANGEEXPERTSATTR", { value: expertSort, id, dataIndex });
    }
    return response;
  },
  async createExpert({ commit }, payload) {
    // 新增专家
    const { type } = payload;
    const response = (
      await request({
        url: `/content/admin/expert/auth/add`,
        method: "POST",
        data: payload
      })
    ).data;
    if (response.code == 200) {
      commit("GETEXPERTS", {
        type: type,
        pageNum: 1,
        pageSize: 20
      });
    }
    return response;
  },
  async editExpert({ commit }, payload) {
    const { type } = payload;
    const response = (
      await request({
        url: `/content/admin/expert/auth/edit`,
        method: "POST",
        data: payload
      })
    ).data;
    // console.log(response)
    if (response.code === 200) {
      commit("GETEXPERTS", {
        type: type,
        pageNum: 1,
        pageSize: 20
      });
    }
    return response;
  }
};

const mutations = {
  [GETALLEXPERTS](state, payload) {
    state.allExperts = payload.allExperts;
  },
  // 获取专家列表
  [GETEXPERTS](state, payload) {
    // state.experts = payload.experts.map(item => {
    //   item.expertSort = item.expertSort.toString();
    //   return item;
    // });
    state.experts = payload.experts;
    state.expertPageNum = payload.pageNum;
    state.expertPageSize = payload.pageSize;
    state.expertTotalSize = payload.totalSize;
  },
  // 修改文章状态、排序
  [CHANGEEXPERTSATTR](state, payload) {
    const { value, id, dataIndex } = payload;
    const experts = [...state.experts];
    const target = experts.find(item => item.id === id);
    if (target) {
      target[dataIndex] = value;
    }
    state.experts = experts;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
