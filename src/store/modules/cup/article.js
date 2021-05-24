import {
  GETARTICLES,
  CHANGEARTICLESATTR,
  GETARTICLEDETAIL
} from "../../mutations_type";
import request from "@/utils/request";
const state = {
  // 文章详情
  articleDetail: {},
  // 文章管理相关
  articles: [], // 文章列表
  pageNum: 1,
  pageSize: 20,
  totalSize: 0
};
// 请求的url 前面需要加上 content
// cup 与 brarts 共用接口，部分接口用type 区分，type 为 0 表示cup , type 为 1 表示 brarts 。
const actions = {
  // 保存海报
  // eslint-disable-next-line no-empty-pattern
  async savePoster({}, payload) {
    const response = (
      await request({
        url: `/content/admin/article/auth/savePoster`,
        method: "POST",
        data: payload
      })
    ).data;
    return response;
  },
  // 编辑文章
  // type 为 0 表示cup , type 为 1 表示 brarts 。
  // eslint-disable-next-line no-empty-pattern
  async editArticle({}, payload) {
    const response = (
      await request({
        url: `/content/admin/article/auth/edit`,
        method: "POST",
        data: payload
      })
    ).data;
    return response;
  },
  // 新增文章
  // type 为 0 表示cup , type 为 1 表示 brarts 。
  // eslint-disable-next-line no-empty-pattern
  async createArticle({}, payload) {
    const response = (
      await request({
        url: `/content/admin/article/auth/add`,
        method: "POST",
        data: payload
      })
    ).data;
    return response;
  },
  // 获取文章详情
  async getArticleDetail({ commit }, payload) {
    const { id } = payload;
    const response = (
      await request({
        url: `/content/admin/article/auth/queryArticle`,
        method: "POST",
        data: { id }
      })
    ).data;
    if (response.code == 200) {
      commit("GETARTICLEDETAIL", { detail: response.data });
    }
    return response;
  },
	//置顶
	async changeTop({
		commit
	}, payload) {
		console.log(commit)
		const {
			articleId
		} = payload
		const response = (await request({
			url: '/content/miniapp/cup/articleTop?articleId=' + articleId,
			method: "POST",
			// data: payload
		})).data
		return response
	},
  // 获取文章列表
  // type 为 0 表示cup , type 为 1 表示 brarts 。
  async getArticles({ commit }, payload) {
    const response = (
      await request({
        url: `/content/admin/article/auth/list`,
        method: "POST",
        data: payload
      })
    ).data;
    // console.log(response);
    if (response.code == 200) {
      const { list: articles, pageNum, pageSize, totalSize } = response.data;
      commit("GETARTICLES", { articles, pageNum, pageSize, totalSize });
    }
    return response;
  },
  // 删除文章
  // eslint-disable-next-line no-empty-pattern
  async deleteArticle({}, payload) {
    const { id } = payload;
    const response = (
      await request({
        url: `/content/admin/article/auth/deleteById`,
        method: "POST",
        data: {
          id
        }
      })
    ).data;
    return response;
  },
  // 修改文章状态
  async changeArticleStatus({ commit }, payload) {
    const { status, id, dataIndex } = payload;
    const response = (
      await request({
        url: `/content/admin/article/auth/editStatus`,
        method: "POST",
        data: {
          status: status,
          id
        }
      })
    ).data;
    if (response.code == 200) {
      commit("CHANGEARTICLESATTR", { value: status, id, dataIndex });
    }
    return response;
  },
  // 修改标签排序
  async changeArticleSort({ commit }, payload) {
    const { articleSort, id, dataIndex } = payload;
    const response = (
      await request({
        url: `/content/admin/article/auth/editSort`,
        method: "POST",
        data: {
          articleSort: Number(articleSort),
          id
        }
      })
    ).data;
    if (response.code == 200) {
      commit("CHANGEARTICLESATTR", { value: articleSort, id, dataIndex });
    }
    return response;
  }
};
const mutations = {
  [GETARTICLEDETAIL](state, payload) {
    let detail = { ...payload.detail };
    if (detail.tags) detail.tags = detail.tags.split(";");
    detail.browseBaseStatus = Boolean(detail.browseBaseStatus);
    detail.goods = detail.goods || [];
    state.articleDetail = detail;
  },
  // 修改文章状态、排序
  [CHANGEARTICLESATTR](state, payload) {
    const { value, id, dataIndex } = payload;
    const articles = [...state.articles];
    const target = articles.find(item => item.id === id);
    if (target) {
      target[dataIndex] = value;
    }
    state.articles = articles;
    // console.log(state.tags);
  },
  // 获取文章列表
  [GETARTICLES](state, payload) {
    state.articles = payload.articles.map(item => {
      if (item.tags) item.tags = item.tags.split(";");
      return item;
    });
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
