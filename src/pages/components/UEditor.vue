<template>
  <vue-ueditor-wrap
    v-model="cont"
    :config="uEditConfig"
    @input="input"
    :destroy="true"
  ></vue-ueditor-wrap>
</template>

<script>
import VueUeditorWrap from "vue-ueditor-wrap";
const uEditConfig = {
  // 编辑器不自动被内容撑高
  autoHeightEnabled: false,
  //启用自动保存
  enableAutoSave: false,
  // 初始容器高度
  initialFrameHeight: 500,
  // 初始容器宽度
  initialFrameWidth: "100%",
  // 上传文件接口
  serverUrl: "https://clubtest.aimer.com.cn/content/file/ueditor/config",
  // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
  UEDITOR_HOME_URL: "/ueditor/"
};
export default {
  components: {
    VueUeditorWrap
  },
  props: {
    content: String
  },
  data() {
    return {
      uEditConfig,
      contentData: ""
    };
  },
  computed: {
    cont: {
      get: function() {
        return this.content;
      },
      set: function(value) {
        this.contentData = value; // 编辑器内容
      }
    }
  },
  methods: {
    input() {
      this.$emit("input", { content: this.contentData });
    }
  }
};
</script>

<style>
/* ueditor 样式修复 */
.edui-default .edui-button-body {
  height: 20px;
}
.edui-default .edui-toolbar .edui-combox .edui-combox-body {
  height: 22px;
}
.edui-default .edui-box {
  height: 22px;
}
.edui-editor div {
  display: flex;
  flex-wrap: wrap;
}
</style>
