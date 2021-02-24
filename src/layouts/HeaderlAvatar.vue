<template>
  <span>
    <a-icon type="user"></a-icon>
    <span style="margin-left:5px">{{ username }}</span>
    <a-divider type="vertical" />
    <span style="margin-left:5px;cursor: pointer" @click="logout">退出</span>
    <a-divider type="vertical" />
    <span style="margin-left:5px;cursor: pointer" @click="editPassword"
      >修改密码</span
    >
  </span>
  <!-- <a-dropdown
    style="display: inline-block; height: 100%; vertical-align: initial"
  >
    <span>
      <a-icon type="user"></a-icon>
      <span style="margin-left:5px">{{ username }}</span>
      <a-divider type="vertical" />
      <span style="margin-left:5px;cursor: pointer" @click="logout">退出</span>
    </span>
    <a-menu style="width: 150px" slot="overlay">
      <a-menu-item>
        <a-icon type="user" />
        <span>个人中心</span>
      </a-menu-item>
      <a-menu-item>
        <a-icon type="setting" />
        <span>设置</span>
      </a-menu-item>
      <a-menu-divider />
      <a-menu-item @click="logout">
          <a-icon type="poweroff" />
          <span style="margin-left:5px">退出登录</span>
      </a-menu-item>
    </a-menu>
  </a-dropdown> -->
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "HeaderAvatar",
  computed: {
    ...mapState("login", ["username"])
  },
  methods: {
    ...mapActions("login", ["logout"]),
    editPassword() {
      this.$router.push({
        name: "editPasswordIndex"
      });
    }
  }
};
</script>

<style lang="less" scoped>
.avatar {
  margin: 20px 4px 20px 0;
  color: #1890ff;
  background: hsla(0, 0%, 100%, 0.85);
  vertical-align: middle;
}
</style>
