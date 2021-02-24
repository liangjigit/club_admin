<template>
    <div>
    <a-form-model
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
    >

        <a-form-model-item label="封面图" prop="face" extra="600*360px，png/jpg格式，2M以内">
            <upload-file @uploadPic="uploadFacePic" :img="image"
                         :imgWidth="300"
                         :imgHeight="180"></upload-file>
        </a-form-model-item>

        <a-form-model-item label="内容管理" prop="shareTitle">
            <a-button @click="edit()">编辑权益介绍</a-button>
        </a-form-model-item>

        <a-modal
                :width="600"
                v-model="visible"
                :title="'编辑权益介绍'"
                cancelText="取消"
                okText="确定"
                :centered="true"
                :keyboard="false"
                :maskClosable="false"
                :closable="false"
                :confirmLoading="loading"
                @ok="createSubmit"
                @cancel="cancelCreate"
                :destroyOnClose="true"
        >
            <ul>
                <li v-for="(item, index) in userBenefitsList" :key="index">
                    <a-form-model-item ref="title" label="标题" prop="title">
                        <a-input placeholder="请输入标题，18字以内" v-model="item.title" style="width: 88%; margin-right: 6px"/>
                        <a-popconfirm
                                v-if="index > 0"
                                title="确定删除?"
                                ok-text="删除"
                                cancel-text="取消"
                                @confirm="() => deleteUserBenefits(index)"
                        >
                            <a href="javascript:;">删除</a>
                        </a-popconfirm>
                    </a-form-model-item>
                    <a-form-model-item ref="content" label="内容" prop="content">
                        <a-textarea v-model="item.content" rows="8" cols="20" placeholder="请输入内容，1000字以内"></a-textarea>
                    </a-form-model-item>

                </li>
                <a @click="addUserBenefits()" style="margin-left:90px">添加一条权益</a>
            </ul>
        </a-modal>
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
        labelCol: {span: 4},
        wrapperCol: {span: 18},
        image: "",
        visible: false,
        loading: false,
        userBenefitsList: [
          {
            title: null,
            content: null
          }
        ]
      };
    },
    computed: {
      ...mapState("userBenefits", ["userBenefits"])
    },
    created() {
      this.getData();
    },
    methods: {
      ...mapActions("userBenefits", [
        "saveBenefitsImg",
        "saveBenefitsProfile",
        "getBenefits"
      ]),
      async getData() {
        const response = await this.getBenefits();
        this.image = response.data.image;
        this.userBenefitsList = response.data.profile;
        if (response.code != 200) {
          this.$message.success({
            content: response.msg,
            key: "getBenefits",
            duration: 2
          });
        }
      },
      //   上传封面图
      uploadFacePic(option) {
        this.image = option.imageUrl;
        const payload = {image: option.imageUrl};
        this.saveBenefitsImg(payload);
      },
      edit() {
        this.visible = true;
      },
      cancelCreate() {
        this.visible = false;
      },
      addUserBenefits() {
        this.userBenefitsList.push({
          title: null,
          content: null
        });
      },
      createSubmit() {
        const payload = {profile: this.userBenefitsList};
        const response = this.saveBenefitsProfile(payload);
        response.then(res => {
          // console.log(res)
          if (res.code == 200) {
            this.$message.success({
              content: "操作成功",
              key: "getBenefits",
              duration: 2
            });
            this.visible = false;
          } else {
            this.$message.error({
              content: res.msg,
              key: "getBenefits",
              duration: 2
            });
          }
          this.loading = false;
        }).catch(() => {
          this.loading = false;
        });
      },
      deleteUserBenefits(index) {
        this.userBenefitsList.splice(index, 1);
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
