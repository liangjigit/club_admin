import {
  GETACTIVITIES,
  CHANGEACTIVITYATTR,
  GETACTIVITYDETAIL,
  GETALLACTIVITIES
} from "../../mutations_type";
import request from "@/utils/request";
const state = {
  // 活动详情
  activityDetail: {},
  // 活动管理相关
  activities: [], // 活动列表
  allActivites: [],
  pageNum: 1,
  pageSize: 20,
  totalSize: 0
};
const actions = {
  // 获取所有活动
  async getAllActivity({ commit }) {
    const response = (
      await request({
        url: `/content/admin/activity/auth/all`,
        method: "POST",
        data: {}
      })
    ).data;
    if (response.code == 200) {
      commit("GETALLACTIVITIES", { allActivites: response.data });
    }
    return response;
  },
  // 保存海报
  // eslint-disable-next-line no-empty-pattern
  async savePoster({}, payload) {
    const response = (
      await request({
        url: `/content/admin/activity/auth/savePoster`,
        method: "POST",
        data: payload
      })
    ).data;
    return response;
  },
  // 编辑活动
  // eslint-disable-next-line no-empty-pattern
  async editActivity({}, payload) {
    const response = (
      await request({
        url: `/content/admin/activity/auth/edit`,
        method: "POST",
        data: payload
      })
    ).data;
    return response;
  },
  // 新增活动
  // eslint-disable-next-line no-empty-pattern
  async createActivity({}, payload) {
    const response = (
      await request({
        url: `/content/admin/activity/auth/add`,
        method: "POST",
        data: payload
      })
    ).data;
    return response;
  },
  // 获取活动详情
  async getActivityDetail({ commit }, payload) {
    const { id } = payload;
    const response = (
      await request({
        url: `/content/admin/activity/auth/queryActivity`,
        method: "POST",
        data: { id }
      })
    ).data;
    if (response.code == 200) {
      commit("GETACTIVITYDETAIL", { detail: response.data });
    }
    return response;
  },
  // 获取活动列表
  async getActivities({ commit }, payload) {
    const response = (
      await request({
        url: `/content/admin/activity/auth/list`,
        method: "POST",
        data: payload
      })
    ).data;
    if (response.code == 200) {
      const { list: activities, pageNum, pageSize, totalSize } = response.data;
      commit("GETACTIVITIES", { activities, pageNum, pageSize, totalSize });
    }
    return response;
  },
  // 删除活动
  // eslint-disable-next-line no-empty-pattern
  async deleteActivity({}, payload) {
    const { id } = payload;
    const response = (
      await request({
        url: `/content/admin/activity/auth/deleteById`,
        method: "POST",
        data: {
          id
        }
      })
    ).data;
    return response;
  },
  // 修改活动状态
  async changeActivityStatus({ commit }, payload) {
    const { status, id, dataIndex } = payload;
    const response = (
      await request({
        url: `/content/admin/activity/auth/editStatus`,
        method: "POST",
        data: {
          status: status,
          id
        }
      })
    ).data;
    if (response.code == 200) {
      commit("CHANGEACTIVITYATTR", { value: status, id, dataIndex });
    }
    return response;
  },
  // 修改标签排序
  async changeActivitySort({ commit }, payload) {
    const { activitySort, id, dataIndex } = payload;
    const response = (
      await request({
        url: `/content/admin/activity/auth/editSort`,
        method: "POST",
        data: {
          activitySort: Number(activitySort),
          id
        }
      })
    ).data;
    if (response.code == 200) {
      commit("CHANGEACTIVITYATTR", { value: activitySort, id, dataIndex });
    }
    return response;
  }
};
const mutations = {
  // 获取所有活动
  [GETALLACTIVITIES](state, payload) {
    state.allActivites = payload.allActivites;
  },
  // 获取活动详情
  [GETACTIVITYDETAIL](state, payload) {
    let detail = { ...payload.detail };
    detail.browseBaseStatus = Boolean(detail.browseBaseStatus);
    state.activityDetail = detail;
  },
  // 获取活动列表
  [GETACTIVITIES](state, payload) {
    state.activities = payload.activities.map(item => {
      item.city =
        item.city == "市辖区" ||
        item.city == "县" ||
        !item.city ||
        item.city == "自治区直辖县级行政区划"
          ? item.province
          : item.city;
      return item;
    });
    state.pageNum = payload.pageNum;
    state.pageSize = payload.pageSize;
    state.totalSize = payload.totalSize;
  },
  // 修改活动状态、排序
  [CHANGEACTIVITYATTR](state, payload) {
    const { value, id, dataIndex } = payload;
    const activities = [...state.activities];
    const target = activities.find(item => item.id === id);
    if (target) {
      target[dataIndex] = value;
    }
    state.activities = activities;
    // console.log(state.tags);
  }
};
export default {
  namespaced: true,
  state,
  actions,
  mutations
};
