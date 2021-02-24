import {
  SETDEVICE,
  SETTHEME,
  SETLAYOUT,
  SETMULTIPAGE
} from "../mutations_type";
const state = {
  isMobile: false,
  theme: "dark",
  layout: "side",
  systemName: "爱慕CLUB运营管理后台",
  copyright: new Date().getFullYear() + " 爱慕出品",
  footerLinks: [
    { link: "/", name: "爱慕CLUB运营管理后台" } //,
    // { link: "https://ant.design", name: "爱慕CLUB运营管理后台" }
  ],
  multipage: false
};
const mutations = {
  [SETDEVICE](state, isMobile) {
    state.isMobile = isMobile;
  },
  [SETTHEME](state, theme) {
    state.theme = theme;
  },
  [SETLAYOUT](state, layout) {
    state.layout = layout;
  },
  [SETMULTIPAGE](state, multipage) {
    state.multipage = multipage;
  }
};
export default {
  namespaced: true,
  state,
  mutations
};
