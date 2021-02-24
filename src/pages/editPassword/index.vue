<template>
  <a-form-model ref="ruleForm" :model="ruleForm" :rules="rules" v-bind="layout">
    <a-form-model-item has-feedback label="原始密码" prop="oldPass">
      <a-input v-model="ruleForm.oldPass" type="password" autocomplete="off" />
    </a-form-model-item>
    <a-form-model-item has-feedback label="新密码" prop="pass">
      <a-input v-model="ruleForm.pass" type="password" autocomplete="off" />
    </a-form-model-item>
    <a-form-model-item has-feedback label="确认密码" prop="checkPass">
      <a-input
        v-model="ruleForm.checkPass"
        type="password"
        autocomplete="off"
      />
    </a-form-model-item>
    <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" @click="submitForm('ruleForm')">
        提交
      </a-button>
    </a-form-model-item>
  </a-form-model>
</template>
<script>
import request from "@/utils/request";
import { mapMutations } from "vuex";
export default {
  data() {
    let validateOldPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入原始密码"));
      } else {
        callback();
      }
    };
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("确认密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("确认密码与新密码不一致"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        oldPass: "",
        pass: "",
        checkPass: ""
      },
      rules: {
        oldPass: [{ validator: validateOldPass, trigger: "change" }],
        pass: [{ validator: validatePass, trigger: "change" }],
        checkPass: [{ validator: validatePass2, trigger: "change" }]
      },
      layout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 }
      }
    };
  },
  methods: {
    ...mapMutations("login", ["CHANGELOGINSTATUS"]),
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          const { oldPass, pass, checkPass } = this.ruleForm;
          const response = (
            await request({
              url: "/user/admin/auth/editPwd",
              method: "POST",
              data: {
                oldPassword: oldPass,
                newPassword: pass,
                confirmNewPassword: checkPass
              }
            })
          ).data;
          if (!response.code) return;
          if (response.code == 200) {
            this.CHANGELOGINSTATUS({
              token: "",
              username: ""
            });
            sessionStorage["token"] = "";
            sessionStorage["username"] = "";
            this.$message.success({
              content: "密码修改成功，请重新登录",
              key: "editPwd",
              duration: 2
            });
            this.$router.replace({
              name: "login"
            });
          } else {
            this.$message.error({
              content: response.msg,
              key: "editPwd",
              duration: 2
            });
          }
        } else {
          return false;
        }
      });
    }
  }
};
</script>
