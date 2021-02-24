<template>
    <div>
        <p><a-alert message="小程序的分享标题和分享图管理" banner /></p>

    <a-form-model
            ref="ruleForm"
            :rules="rules"
            :model="form"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
    >

        <a-form-model-item label="分享图" extra="714*576px，png/jpg格式，100KB以内">
            <upload-file @uploadPic="uploadSharePic" :img="form.image"
                         :imgWidth="300"></upload-file>
        </a-form-model-item>

        <a-form-model-item ref="title" label="标题" prop="title">
            <a-input placeholder="请输入标题，30字以内" v-model="form.title"/>
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
            <a-button
                    type="primary"
                    @click="onSubmit"
                    style="margin-left:20px"
                    :loading="isLoading"
            >
                提交
            </a-button>
        </a-form-model-item>
    </a-form-model>
    </div>
</template>
<script>
  import uploadFile from "../components/UploadFile";
  import {mapActions, mapState} from "vuex";

  export default {
    components: {
      uploadFile
    },
    data() {
      return {
        labelCol: {span: 2},
        wrapperCol: {span: 18},
        isLoading: false,
        form: {
          image: "",
          title: "",
        },
        rules: {
          title: [
            {
              required: true,
              message: "请输入标题",
              trigger: "blur"
            },
            {
              min: 1,
              max: 30,
              message: "30字以内",
              trigger: "blur"
            }
          ],
        }
      };
    },
    computed: {
      ...mapState("share", ["share"])
    },
    created() {
      this.$nextTick(() => {
        this.$refs.ruleForm.resetFields();
      });
      this.getData();
    },
    methods: {
      ...mapActions("share", [
        "getShare",
        "saveShare"
      ]),
      async getData() {
        const response = await this.getShare();
        this.form.image = response.data.image;
        this.form.title = response.data.title;
        if (response.code != 200) {
          this.$message.success({
            content: response.msg,
            key: "getShare",
            duration: 2
          });
        }
      },
      //   上传封面图
      uploadSharePic(option) {
        this.form.image = option.imageUrl;
      },
      async save() {
        const payload = {image: this.form.image, title: this.form.title};
        const response = await this.saveShare(payload);
        if (response.code == 200) {
          this.$message.success({
            content: "保存成功",
            key: "getShare",
            duration: 2
          });
        }
        this.isLoading = false;
        return true;
      },
      onSubmit() {
        this.isLoading = true;
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            this.save();
          } else {
            this.isLoading = false;
            return false;
          }
        });
      }
    }
  };
</script>
<style lang="less" scoped>
    ul {
        padding: 0;
        margin: 0;
    }

    ul li {
        list-style: none;
    }


</style>
