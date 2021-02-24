import { GETDIAGRAMS, CHANGEDIAGRAMSATTR } from "../../mutations_type";
import request from "@/utils/request";
const state = {
  diagrams: [], // 分级图列表啊
  pageNum: 1,
  pageSize: 20,
  totalSize: 0,
  courseId: 0
};
// 请求的url 前面需要加上 content
const actions = {
  // 编辑分解图
  async editDiagram({ commit }, payload) {
    const { explodedImg, explodedExplain, id } = payload;
    const response = (
      await request({
        url: `/content/admin/courseExploded/auth/edit`,
        method: "POST",
        data: {
          id,
          courseId: state.courseId,
          explodedImg,
          explodedExplain
        }
      })
    ).data;
    // console.log(response)
    if (response.code == 200) {
      commit("CHANGEDIAGRAMSATTR", {
        value: explodedImg,
        id,
        dataIndex: "explodedImg"
      });
      commit("CHANGEDIAGRAMSATTR", {
        value: explodedExplain,
        id,
        dataIndex: "explodedExplain"
      });
    }
    return response;
  },
  // 新增分解图
  async createDiagram({ dispatch }, payload) {
    const { explodedImg, explodedExplain } = payload;
    const response = (
      await request({
        url: `/content/admin/courseExploded/auth/add`,
        method: "POST",
        data: {
          courseId: state.courseId,
          explodedImg,
          explodedExplain
        }
      })
    ).data;
    if (response.code == 200) {
      dispatch("getDiagrams", {
        pageNum: 1,
        pageSize: 20,
        courseId: state.courseId
      });
    }
    return response;
  },
  // 获取分解图列表
  async getDiagrams({ commit }, payload) {
    const response = (
      await request({
        url: `/content/admin/courseExploded/auth/list`,
        method: "POST",
        data: payload
      })
    ).data;
    // console.log(response);
    if (response.code == 200) {
      const { courseId } = payload;
      const { list: diagrams, pageNum, pageSize, totalSize } = response.data;
      commit("GETDIAGRAMS", {
        diagrams,
        pageNum,
        pageSize,
        totalSize,
        courseId
      });
    }
    return response;
  },
  // 删除分解图
  // eslint-disable-next-line no-empty-pattern
  async deleteDiagram({}, payload) {
    const { id } = payload;
    const response = (
      await request({
        url: `/content/admin/courseExploded/auth/deleteById`,
        method: "POST",
        data: {
          id,
          courseId: state.courseId
        }
      })
    ).data;
    return response;
  },
  // 修改分解图状态
  async changeDiagramStatus({ commit }, payload) {
    const { status, id, dataIndex } = payload;
    const response = (
      await request({
        url: `/content/admin/courseExploded/auth/editStatus`,
        method: "POST",
        data: {
          status: status,
          id,
          courseId: state.courseId
        }
      })
    ).data;
    if (response.code == 200) {
      commit("CHANGEDIAGRAMSATTR", { value: status, id, dataIndex });
    }
    return response;
  },
  // 修改标签排序
  async changeDiagramSort({ commit }, payload) {
    const { sort, id, dataIndex } = payload;
    const response = (
      await request({
        url: `/content/admin/courseExploded/auth/editSort`,
        method: "POST",
        data: {
          sort: Number(sort),
          id,
          courseId: state.courseId
        }
      })
    ).data;
    if (response.code == 200) {
      commit("CHANGEDIAGRAMSATTR", { value: sort, id, dataIndex });
    }
    return response;
  }
};
const mutations = {
  // 修改分解图状态、排序
  [CHANGEDIAGRAMSATTR](state, payload) {
    const { value, id, dataIndex } = payload;
    const diagrams = [...state.diagrams];
    const target = diagrams.find(
      item => item.id === id && item.courseId === state.courseId
    );
    if (target) {
      target[dataIndex] = value;
    }
    state.diagrams = diagrams;
    // console.log(state.tags);
  },
  // 获取分解图列表
  [GETDIAGRAMS](state, payload) {
    state.diagrams = payload.diagrams.map(item => {
      item.status = item.status === "" ? "" : Number(item.status);
      return item;
    });
    state.pageNum = payload.pageNum;
    state.pageSize = payload.pageSize;
    state.totalSize = payload.totalSize;
    state.courseId = payload.courseId;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
