import {
  GETCOURSES,
  CHANGECOURSESATTR,
  GETCOURSEDETAIL,
  GETDIAGRAMS
} from "../../mutations_type";
import request from "@/utils/request";
const state = {
  diagrams: [], // 分级图列表啊
  // 课程详情
  courseDetail: {},
  // 课程管理相关
  courses: [], // 课程列表
  pageNum: 1,
  pageSize: 20,
  totalSize: 0
  
};
// 请求的url 前面需要加上 content
const actions = {
  // 获取分解图列表
  async getDiagrams({ commit }, payload) {
    const response = (
      await request({
        url: `/content/admin/course/auth/list`,
        method: "POST",
        data: payload
      })
    ).data;
    // console.log(response);
    if (response.code == 200) {
      const { list: diagrams, pageNum, pageSize, totalSize } = response.data;
      commit("GETDIAGRAMS", { diagrams, pageNum, pageSize, totalSize });
    }
    return response;
  },
  // 删除分解图
  // eslint-disable-next-line no-empty-pattern
  async deleteDiagram({}, payload) {
    const { id } = payload;
    const response = (
      await request({
        url: `/content/admin/course/auth/deleteById`,
        method: "POST",
        data: {
          id
        }
      })
    ).data;
    return response;
  },
  // 保存海报
  // eslint-disable-next-line no-empty-pattern
  async savePoster({}, payload) {
    const response = (
      await request({
        url: `/content/admin/course/auth/savePoster`,
        method: "POST",
        data: payload
      })
    ).data;
    return response;
  },
  // 编辑课程
  // eslint-disable-next-line no-empty-pattern
  async editCourse({}, payload) {
    const response = (
      await request({
        url: `/content/admin/course/auth/edit`,
        method: "POST",
        data: payload
      })
    ).data;
    return response;
  },
  // 新增课程
  // eslint-disable-next-line no-empty-pattern
  async createCourse({}, payload) {
    const response = (
      await request({
        url: `/content/admin/course/auth/add`,
        method: "POST",
        data: payload
      })
    ).data;
    return response;
  },
  // 获取课程详情
  async getCourseDetail({ commit }, payload) {
    const { id } = payload;
    const response = (
      await request({
        url: `/content/admin/course/auth/queryCourse`,
        method: "POST",
        data: { id }
      })
    ).data;
    if (response.code == 200) {
      commit("GETCOURSEDETAIL", { detail: response.data });
    }
    return response;
  },
  // 获取课程列表
  async getCourses({ commit }, payload) {
    const response = (
      await request({
        url: `/content/admin/course/auth/list`,
        method: "POST",
        data: payload
      })
    ).data;
    // console.log(response);
    if (response.code == 200) {
      const { list: courses, pageNum, pageSize, totalSize } = response.data;
      commit("GETCOURSES", { courses, pageNum, pageSize, totalSize });
    }
    return response;
  },
  // 删除课程
  // eslint-disable-next-line no-empty-pattern
  async deleteCourse({}, payload) {
    const { id } = payload;
    const response = (
      await request({
        url: `/content/admin/course/auth/deleteById`,
        method: "POST",
        data: {
          id
        }
      })
    ).data;
    return response;
  },
  // 修改课程状态
  async changeCourseStatus({ commit }, payload) {
    const { status, id, dataIndex } = payload;
    const response = (
      await request({
        url: `/content/admin/course/auth/editStatus`,
        method: "POST",
        data: {
          status: status,
          id
        }
      })
    ).data;
    if (response.code == 200) {
      commit("CHANGECOURSESATTR", { value: status, id, dataIndex });
    }
    return response;
  },
  // 修改标签排序
  async changeCourseSort({ commit }, payload) {
    const { courseSort, id, dataIndex } = payload;
    const response = (
      await request({
        url: `/content/admin/course/auth/editSort`,
        method: "POST",
        data: {
          courseSort: Number(courseSort),
          id
        }
      })
    ).data;
    if (response.code == 200) {
      commit("CHANGECOURSESATTR", { value: courseSort, id, dataIndex });
    }
    return response;
  }
};
const mutations = {
  // 获取课程详情
  [GETCOURSEDETAIL](state, payload) {
    let detail = { ...payload.detail };
    detail.browseBaseStatus = Boolean(detail.browseBaseStatus);
    detail.verticalVideo = Boolean(detail.verticalVideo);
    detail.goods = detail.goods || [];
    state.courseDetail = detail;
  },
  // 修改课程状态、排序
  [CHANGECOURSESATTR](state, payload) {
    const { value, id, dataIndex } = payload;
    const courses = [...state.courses];
    const target = courses.find(item => item.id === id);
    if (target) {
      target[dataIndex] = value;
    }
    state.courses = courses;
    // console.log(state.tags);
  },
  // 获取课程列表
  [GETCOURSES](state, payload) {
    state.courses = payload.courses.map(item => {
      item.verticalVideo = Boolean(item.verticalVideo);
      return item;
    });
    state.pageNum = payload.pageNum;
    state.pageSize = payload.pageSize;
    state.totalSize = payload.totalSize;
  },
  //   获取分解图列表
  [GETDIAGRAMS](state, payload) {
    state.courses = payload.courses;
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
