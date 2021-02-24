<template>
  <div>
    <a-spin :spinning="loading" :delay="500">
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="产品名称" prop="goodsName">
          <a-input
            v-model="form.goodsName"
            placeholder="请输入产品名称，30字以内"
          />
        </a-form-model-item>
        <a-form-model-item
          label="产品图片"
          prop="goodsImg"
          extra="160*160px，png/jpg格式，2M以内"
        >
          <upload-file
            @uploadPic="uploadFacePic"
            :uploadText="'上传图片'"
            :img="form.goodsImg"
            :imgWidth="160"
            :imgHeight="160"
          ></upload-file>
        </a-form-model-item>
        <a-form-model-item label="款号" prop="itemNo">
          <a-input v-model="form.itemNo" />
        </a-form-model-item>
        <a-form-model-item label="价格（元）" prop="goodsPrice">
          <a-input v-model="form.goodsPrice" />
        </a-form-model-item>
        <a-form-model-item label="卖点" prop="sellingPoint">
          <a-textarea
            v-model="form.sellingPoint"
            rows="8"
            cols="20"
            placeholder="100字以内"
          ></a-textarea>
        </a-form-model-item>

        <a-form-model-item label="目标小程序" prop="miniappId">
          <a-input v-model="form.miniappId" placeholder="输入目标小程序appId" />
        </a-form-model-item>
        <a-form-model-item
          label="链接"
          prop="goodsUrl"
          extra="例如：/Index/pages/goodsDetail/goodsDetail?goods_id=商品id"
        >
          <a-input v-model="form.goodsUrl" />
        </a-form-model-item>
        <a-form-model-item label="浏览人数">
          <a-switch v-model="form.visitors" />
        </a-form-model-item>
        <a-form-model-item
          label="浏览人数基数"
          prop="visitorsBase"
          v-show="form.visitors"
          :wrapper-col="{ span: 3 }"
        >
          <a-input v-model.number="form.visitorsBase" addon-after="人" />
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="default" @click="$router.go(-1)">
            取消
          </a-button>
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
    </a-spin>
  </div>
</template>
<script>
import uploadFile from "../components/UploadFile";
import { mapActions, mapState } from "vuex";
export default {
  components: {
    uploadFile
  },
  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      loading: false,
      isLoading: false, // 正在提交
      form: {
        id: 0,
        goodsName: "",
        itemNo: "",
        goodsPrice: "",
        miniappId: "",
        goodsUrl: "",
        goodsImg: "",
        sellingPoint: "",
        content: "",
        visitors: false,
        visitorsBase: ""
      },
      rules: {
        goodsName: [
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
        goodsImg: [
          {
            required: true,
            message: "请上传产品图片",
            trigger: "change"
          }
        ],
        itemNo: [
          {
            required: true,
            message: "请输入款号",
            trigger: "blur"
          },
          {
            min: 1,
            max: 20,
            message: "20字以内",
            trigger: "blur"
          }
        ],
        goodsPrice: [
          {
            required: true,
            message: "请输入价格",
            trigger: "blur"
          },
          {
            required: true,
            pattern: /^\d+\.?\d{0,2}$/,
            message: "请输入正确价格",
            trigger: "blur"
          }
        ],
        sellingPoint: [
          {
            min: 1,
            max: 100,
            message: "100字以内",
            trigger: "blur"
          }
        ],
        miniappId: {
          max: 30,
          message: "30字以内",
          trigger: "blur"
        },
        visitorsBase: {
          pattern: /^[0-9]\d*$/,
          required: false,
          message: "请输入 ≥0 的整数",
          trigger: ["blur", "change"]
        }
      }
    };
  },
  computed: {
    ...mapState("goods", ["goods", "detail"])
  },
  created() {
    this.init();
  },
  watch: {
    $route: "init" // 监听路由变化 更新页面状态 getData 初始化页面数据
  },
  methods: {
    ...mapActions("goods", [
      "getGoods",
      "goodsDetail",
      "editGoods",
      "createGoods"
    ]),
    // 初始化数据
    init() {
      if (
        this.$route.name == "goodsCreate" ||
        this.$route.name == "goodsEdit"
      ) {
        // console.log("init");
        this.loading = false;
        this.isLoading = false;
        this.$nextTick(() => {
          this.$refs.ruleForm.resetFields();
        });
        this.getData(); // 获取编辑内容
      }
    },
    // 获取文章详情
    async getData() {
      const id = this.$route.params.id || 0;
      if (id == 0) {
        return false;
      }
      this.loading = true;
      this.$message.loading({
        content: "正在加载编辑内容",
        key: "detail",
        duration: 2
      });
      const response = await this.goodsDetail({
        id: Number(id)
      });
      this.loading = false;
      if (!response.code) return;
      if (response.code == 200) {
        const {
          id,
          goodsName,
          itemNo,
          goodsPrice,
          miniappId,
          goodsUrl,
          goodsImg,
          sellingPoint,
          content,
          visitors,
          visitorsBase
        } = response.data;
        console.log(id);
        this.form = {
          id,
          goodsName,
          itemNo,
          goodsPrice,
          miniappId,
          goodsUrl,
          goodsImg,
          sellingPoint,
          content,
          visitors,
          visitorsBase
        };

        this.$message.success({
          content: "加载完成",
          key: "detail",
          duration: 2
        });
      } else {
        this.$message.error({
          content: response.msg,
          key: "detail",
          duration: 2
        });
      }
    },
    // 创建/修改文章
    async edit() {
      this.$message.loading({
        content: "正在提交",
        key: "createGoods",
        duration: 2
      });

      const {
        id,
        goodsName,
        itemNo,
        goodsPrice,
        miniappId,
        goodsUrl,
        goodsImg,
        sellingPoint,
        content,
        visitors,
        visitorsBase
      } = this.form;

      const payload = {
        goodsName,
        itemNo,
        goodsPrice,
        miniappId,
        goodsUrl,
        goodsImg,
        sellingPoint,
        content,
        visitors,
        visitorsBase
      };
      const isEdit = id > 0;
      if (isEdit) {
        payload.id = id;
      }
      const response = isEdit
        ? await this.editGoods(payload)
        : await this.createGoods(payload);
      if (!response.code) return;
      if (response.code == 200) {
        this.$message.success({
          content: isEdit ? "修改成功" : "新增成功",
          key: "createGoods",
          duration: 2
        });
        // 返回上一页
        this.$router.go(-1);
      } else {
        this.$message.error({
          content: response.msg,
          key: "createGoods",
          duration: 2
        });
      }
      this.isLoading = false;
    },
    //   上传封面图
    uploadFacePic(option) {
      this.form.goodsImg = option.imageUrl;
    },
    // 提交表单
    onSubmit() {
      this.isLoading = true;
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          // alert("submit!");
          this.edit();
          // console.log(this.form);
        } else {
          // console.log("error submit!!");
          this.isLoading = false;
          return false;
        }
      });
    }
  }
};
</script>
