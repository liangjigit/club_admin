<template>
  <div id="app">
    <a-config-provider :locale="locale">
      <router-view />
    </a-config-provider>
  </div>
</template>

<script>
import enquireScreen from "./utils/device";
import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";
import moment from "moment";
import "moment/locale/zh-cn";
moment.locale("zh-cn");
export default {
  name: "App",
  data() {
    return {
      locale: zhCN
    };
  },
  created() {
    let _this = this;
    enquireScreen(isMobile => {
      _this.$store.commit("setting/SETDEVICE", isMobile);
    });
  }
};
</script>
<style lang="less">
#app {
  height: 100%;
}
// 搜索区域
.functional-area {
  padding: 10px;
  background-color: #ffffff;
}
:global {
  //页面切换动画
  .page-toggle-enter-active {
    transition: all 0.2s ease-in 0.25s;
  }
  .page-toggle-leave-active {
    transition: all 0.2s ease-out 0s;
  }
  .page-toggle-enter,
  .page-toggle-leave-to {
    opacity: 0;
    padding: 0px;
  }
}
</style>
