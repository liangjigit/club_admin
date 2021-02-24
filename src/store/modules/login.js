import { CHANGELOGINSTATUS } from "../mutations_type";
import router from "../../router";
import { parse } from "query-string";
import request from "@/utils/request";
const state = {
  username: "", // 用户名
  token: "" // 登录验证token
};
const actions = {
  // 登录
  async login({ commit }, payload) {
    // console.log(payload);
    const response = (
      await request({
        url: "/user/admin/login",
        method: "POST",
        data: payload
      })
    ).data;
    if (response.code == 200) {
    // console.log(response);
      commit("CHANGELOGINSTATUS", {
        username: response.data.username,
        token: response.data.authorization
      });
      sessionStorage["token"] = response.data.authorization;
      sessionStorage["username"] = response.data.username;
      const urlParams = new URL(window.location.href);
      let redirect = parse(location.search).redirect;
      if (redirect) {
        const redirectUrlParams = new URL(redirect);
        if (redirectUrlParams.origin === urlParams.origin) {
          redirect = redirect.substr(urlParams.origin.length);
          if (redirect.match(/^\/.*#/)) {
            redirect = redirect.substr(redirect.indexOf("#") + 1);
          }
        } else {
          redirect = null;
        }
      }
      router.replace({ path: redirect || "/" });
    }
    return response
  },
  // 登出
  async logout({ commit }) {
    commit("CHANGELOGINSTATUS", {
      token: "",
      username: ""
    });
    sessionStorage["token"] = "";
    sessionStorage["username"] = "";
    const redirect = parse(location.search).redirect;
    // redirect
    if (window.location.pathname !== "/login" && !redirect) {
      router.replace({
        path: "/login",
        query: {
          redirect: window.location.href
        }
      });
    }
  }
};

const mutations = {
  [CHANGELOGINSTATUS](state, payload) {
    state.token = payload.token;
    state.username = payload.username;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
