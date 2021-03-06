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
        <a-form-model-item label="标题" prop="title">
          <a-input v-model="form.title" placeholder="请输入标题，30字以内" />
        </a-form-model-item>
        <a-form-model-item
          label="封面图"
          prop="img"
          extra="670*376px，png/jpg格式，2M以内"
        >
          <upload-file
            @uploadPic="uploadFacePic"
            :img="form.img"
            :imgWidth="670 / 4"
            :imgHeight="376 / 4"
          ></upload-file>
        </a-form-model-item>
        <a-form-model-item label="定时上下架时间" prop="validTime">
          <a-range-picker
            format="YYYY-MM-DD HH:mm:ss"
            v-model="form.validTime"
            :show-time="{
              defaultValue: [
                moment('00:00:00', 'HH:mm:ss'),
                moment('23:59:59', 'HH:mm:ss')
              ]
            }"
            :placeholder="['上架时间', '下架时间']"
            @ok="confirmValidTime"
          >
            <a-icon slot="suffixIcon" type="clock-circle" />
          </a-range-picker>
        </a-form-model-item>
        <a-form-model-item label="浏览人数" prop="browseBaseStatus">
          <a-switch v-model="form.browseBaseStatus" />
        </a-form-model-item>
        <a-form-model-item
          label="浏览人数基数"
          prop="browseBase"
          v-show="form.browseBaseStatus"
          :wrapper-col="{ span: 3 }"
        >
          <a-input v-model.number="form.browseBase" addon-after="人" />
        </a-form-model-item>
        <a-form-model-item label="正文" prop="content">
          <!-- <ueditor :content="form.content" @input="changeContent"></ueditor> -->
          <qeditor :content="form.content" @onChange="changeContent"></qeditor>
        </a-form-model-item>
        <a-form-model-item label="分享标题" prop="shareTitle">
          <a-input
            v-model="form.shareTitle"
            placeholder="请输入分享标题，30字以内"
          />
        </a-form-model-item>
        <a-form-model-item
          label="分享图片"
          prop="shareImg"
          extra="714*576px，png/jpg格式，2M以内"
        >
          <upload-file
            @uploadPic="uploadSharePic"
            :uploadText="'上传图片'"
            :img="form.shareImg"
            :imgWidth="714 / 3"
            :imgHeight="576 / 3"
          ></upload-file>
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
import uploadFile from "../../components/UploadFile";
// import ueditor from "../../components/UEditor";
import qeditor from "../../components/QuillEditor";
import moment from "moment";
import { mapActions, mapState } from "vuex";
import { scrollToField } from "@/utils/utils.js";
const MaxContentText = 5000; // 富文本文字内容最大长度
export default {
  components: {
    uploadFile,
    qeditor
    // ueditor
  },
  data() {
    return {
      contenTextLength: 0, // 富文本文字长度
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      loading: false, //页面加载
      isLoading: false, // 正在提交
      form: {
        id: 0,
        title: "", // 文章标题
        img: "", // 文章封面图
        validTime: [], // 上下架时间
        browseBaseStatus: false, // 是否显示浏览人数
        browseBase: undefined, //浏览基数
        content: "", //文章正文
        shareTitle: "", //分享标题
        shareImg: "" //分享图片
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
        img: [
          {
            required: true,
            message: "请上传封面图",
            trigger: "change"
          }
        ],
        // validTime: [
        //   {
        //     type: "array",
        //     required: true,
        //     message: "请选择上下架时间",
        //     trigger: "change"
        //   }
        // ],
        browseBase: {
          pattern: /^[0-9]\d*$/,
          required: false,
          message: "请输入整数",
          trigger: ["blur", "change"]
        },
        content: [
          {
            required: true,
            message: "请输入正文",
            trigger: ["change", "blur"]
          },
          // {
          //   min: 1,
          //   max: 3000,
          //   message: "3000字以内",
          //   trigger: ["change", "blur"]
          // }
          {
            validator: this.validateContentText
          }
        ],
        shareTitle: [
          {
            max: 30,
            message: "30字以内",
            trigger: ["blur"]
          }
        ]
      }
    };
  },
  computed: {
    ...mapState("cupArticle", ["articleDetail"])
  },
  created() {
    this.init();
  },
  watch: {
    $route: "init" // 监听路由变化 更新页面状态 getData 初始化页面数据
  },
  onLoad() {
    this.$nextTick(() => {
      window.scrollTo(0, 0);
    });
  },
  methods: {
    ...mapActions("cupArticle", [
      "createArticle",
      "getArticleDetail",
      "editArticle"
    ]),
    moment,
    // 初始化数据
    init() {
      // console.log("init");
      if (
        this.$route.name == "brartsArticleEdit" ||
        this.$route.name == "brartsArticleCreate"
      ) {
        this.loading = false; //页面加载
        this.isLoading = false; // 正在提交
        this.$nextTick(() => {
          this.$refs.ruleForm.resetFields();
        });
        this.getData(); // 获取编辑内容
      }
    },
    // 获取文章详情
    async getData() {
      // console.log(this.$route)
      // console.log(this.$route.name == "cupArticleDetail")
      const id = this.$route.params.id || 0;
      if (id == 0) {
        return false;
      }
      this.loading = true;
      this.$message.loading({
        content: "正在加载编辑内容",
        key: "getArticleDetail",
        duration: 2
      });
      const response = await this.getArticleDetail({
        id: Number(id)
      });
      this.loading = false;
      if (!response.code) return;
      if (response.code == 200) {
        const {
          id,
          title,
          img,
          startTime,
          endTime,
          browseBaseStatus,
          browseBase,
          shareImg,
          shareTitle,
          content
        } = this.articleDetail;
        // console.log(startTime, endTime);
        let validTime = [];
        if (startTime && endTime) {
          validTime = [
            moment(startTime, "YYYY-MM-DD HH:mm:ss"),
            moment(endTime, "YYYY-MM-DD HH:mm:ss")
          ];
        }
        // console.log(validTime);
        this.form = {
          id,
          title, // 文章标题
          img, // 文章封面图
          validTime, // 上下架时间
          browseBaseStatus, // 是否显示浏览人数
          browseBase, //浏览基数
          shareTitle, //分享标题
          shareImg, //分享图片
          content //文章正文
        };
        // console.log(this.form);
        this.$message.success({
          content: "加载完成",
          key: "getArticleDetail",
          duration: 2
        });
      } else {
        this.$message.error({
          content: response.msg,
          key: "getArticleDetail",
          duration: 2
        });
      }
    },
    // 创建/修改文章
    async edit() {
      this.$message.loading({
        content: "正在提交",
        key: "createArticle",
        duration: 2
      });
      const {
        browseBase,
        browseBaseStatus,
        content,
        id,
        img,
        shareImg,
        shareTitle,
        title,
        validTime
      } = this.form;
      const startTime =
        validTime.length > 0 ? validTime[0].format("YYYY-MM-DD HH:mm:ss") : "";
      const endTime =
        validTime.length > 0 ? validTime[1].format("YYYY-MM-DD HH:mm:ss") : "";
      // console.log({
      //   id,
      //   title,
      //   img,
      //   browseBase,
      //   browseBaseStatus,
      //   content,
      //   expertId,
      //   goodsIds,
      //   shareImg,
      //   shareTitle,
      //   tags: tags.join(";"),
      //   startTime,
      //   endTime
      // });
      const payload = {
        id,
        title,
        img,
        browseBase,
        browseBaseStatus: Number(browseBaseStatus),
        content,
        shareImg,
        shareTitle,
        startTime,
        endTime,
        type: 1 // 表示brarts
      };
      const isEdit = id > 0;
      const response = isEdit
        ? await this.editArticle(payload)
        : await this.createArticle(payload);
      if (!response.code) return;
      if (response.code == 200) {
        this.$message.success({
          content: isEdit ? "修改成功" : "新增成功",
          key: "createArticle",
          duration: 2
        });
        // 返回上一页
        this.$router.go(-1);
      } else {
        this.$message.error({
          content: response.msg,
          key: "createArticle",
          duration: 2
        });
      }
      this.isLoading = false;
    },
    //   上传封面图
    uploadFacePic(option) {
      this.form.img = option.imageUrl;
    },
    // 上传分享图片
    uploadSharePic(option) {
      this.form.shareImg = option.imageUrl;
    },
    //  上下架时间
    confirmValidTime(value) {
      this.form.validTime = value;
      console.log(this.form.validTime);
    },
    // 富文本内容同步
    changeContent(option) {
      this.form.content = option.content;
      this.contenTextLength = option.textLength;
    },
    // 校验文字内容（html 标签、图片不算长度） 长度不得超过最大限制
    validateContentText(rule, value, callback) {
      if (this.contenTextLength > MaxContentText) {
        callback(MaxContentText + "字以内");
      } else {
        callback();
      }
    },
    // 提交表单
    onSubmit() {
      this.isLoading = true;
      console.log(this.$refs);
      this.$refs.ruleForm.validate((valid, fieldObj) => {
        console.log(fieldObj);
        if (valid) {
          // alert("submit!");
          this.edit();
          // console.log(this.form);
        } else {
          scrollToField(this.$refs.ruleForm, fieldObj);
          this.isLoading = false;
          return false;
        }
      });
    }
  }
};
</script>
