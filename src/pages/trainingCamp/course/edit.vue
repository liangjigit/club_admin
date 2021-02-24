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
        <a-form-model-item label="分类" prop="classify">
          <a-select
            show-search
            :show-arrow="true"
            :not-found-content="'未找到'"
            placeholder="请选择分类"
            :default-value="form.classify"
            v-model="form.classify"
            style="width: 400px"
          >
            <a-select-option
              v-for="item in allCategories"
              :key="item.id"
              :value="item.categoryName"
            >
              {{ item.categoryName }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="标题" prop="title">
          <a-input v-model="form.title" placeholder="请输入标题，30字以内" />
        </a-form-model-item>
        <a-form-model-item label="视频地址" prop="videoAddr">
          <a-input
            placeholder="请输入视频地址"
            v-model="form.videoAddr"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item label="视频说明" prop="videoExplain">
          <a-textarea
            placeholder="请输入视频说明，100字以内"
            :auto-size="{ minRows: 2, maxRows: 6 }"
            v-model="form.videoExplain"
          />
        </a-form-model-item>
        <a-form-model-item
          ref="duration"
          label="时长"
          prop="duration"
          :wrapper-col="{ span: 3 }"
          v-show="!form.verticalVideo"
        >
          <a-input
            placeholder="请输入时长"
            v-model.number="form.duration"
            addon-after="分钟"
          />
        </a-form-model-item>
        <a-form-model-item label="竖视频" prop="verticalVideo">
          <a-switch
            v-model="form.verticalVideo"
            @change="changeVerticalVideo"
          />
        </a-form-model-item>
        <a-form-model-item
          label="15s视频"
          prop="shortVideo"
          extra="非必填，支持mp4/3gp/m3u8格式，20M以内"
        >
          <upload-file
            :uploadText="'上传视频'"
            @uploadPic="uploadShortVideo"
            :file="form.shortVideo"
            :imgWidth="690 / 4"
            :imgHeight="388 / 4"
            :accept="'.3gp, .mp4, .m3u8'"
            :fileType="'video'"
          ></upload-file>
        </a-form-model-item>
        <a-form-model-item
          label="封面大图"
          prop="bigImg"
          extra="690*388px，png/jpg格式，2M以内"
        >
          <upload-file
            @uploadPic="uploadBigImg"
            :img="form.bigImg"
            :imgWidth="690 / 4"
            :imgHeight="388 / 4"
          ></upload-file>
        </a-form-model-item>
        <a-form-model-item
          label="封面图"
          prop="img"
          extra="268*200px，png/jpg格式，2M以内"
        >
          <upload-file
            @uploadPic="uploadFacePic"
            :img="form.img"
            :imgWidth="324 / 2"
            :imgHeight="432 / 2"
          ></upload-file>
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
        <a-form-model-item label="练习周期" prop="practiceCycle">
          <a-radio-group name="radioGroup" :default-value="form.practiceCycle" v-model="form.practiceCycle">
            <a-radio :value="item" :key="item" v-for="item in Cycle">
              {{ item }}
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="适用人群" prop="suitablePeople">
          <a-textarea
            placeholder="请输入适用人群，100字以内"
            :auto-size="{ minRows: 2, maxRows: 6 }"
            v-model="form.suitablePeople"
          />
        </a-form-model-item>
        <a-form-model-item label="练习功效" prop="effect">
          <a-textarea
            placeholder="请输入练习功效，500字以内"
            :auto-size="{ minRows: 2, maxRows: 6 }"
            v-model="form.effect"
          />
        </a-form-model-item>
        <a-form-model-item label="练习建议" prop="suggest">
          <a-textarea
            placeholder="请输入练习建议，500字以内"
            :auto-size="{ minRows: 2, maxRows: 6 }"
            v-model="form.suggest"
          />
        </a-form-model-item>
        <a-form-model-item label="身体反应" prop="bodyReaction">
          <a-textarea
            placeholder="请输入身体反应，500字以内"
            :auto-size="{ minRows: 2, maxRows: 6 }"
            v-model="form.bodyReaction"
          />
        </a-form-model-item>
        <a-form-model-item label="导师" prop="expertId">
          <a-select
            show-search
            :show-arrow="true"
            :not-found-content="'未找到'"
            placeholder="请选择导师"
            :default-value="form.expertId"
            v-model="form.expertId"
            style="width: 400px"
          >
            <a-select-option
              v-for="item in allExperts"
              :key="item.id"
              :value="item.id"
            >
              {{ item.expertName }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="关联产品" prop="goodsIds">
          <a-select
            mode="multiple"
            :show-arrow="true"
            :not-found-content="'未找到'"
            placeholder="请选择关联产品"
            :default-value="form.goodsIds"
            v-model="form.goodsIds"
            style="width: 400px"
          >
            <a-select-option
              v-for="item in allGoods"
              :key="item.id"
              :value="item.id"
            >
              {{ item.goodsName }} - {{ item.itemNo }}
            </a-select-option>
          </a-select>
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
import { mapState, mapActions } from "vuex";
import { scrollToField } from "@/utils/utils.js";
const Cycle = ["每日", "每日2次", "每周2-5次", "每周3-5次"];
export default {
  components: {
    uploadFile
  },
  data() {
    return {
      Cycle,
      loading: false, //
      isLoading: false, // 正在提交
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      form: {
        id: 0,
        classify: undefined, //分类
        title: "", // 课程标题
        videoAddr: "", //视频地址
        videoExplain: "", // 视频说明
        duration: undefined, //时长
        verticalVideo: false, // 是否是竖视频，
        shortVideo: "", //15s 视频
        bigImg: "", //封面大图
        img: "", //封面图
        browseBaseStatus: false, // 是否显示浏览人数
        browseBase: undefined, //浏览基数
        practiceCycle: "每日", //练习周期
        suitablePeople: "", //适用人群
        effect: "", //练习功效
        suggest: "", //练习建议
        bodyReaction: "", //身体反应
        expertId: undefined, //导师
        goodsIds: [], //关联产品
        shareTitle: "", //分享标题
        shareImg: "" //分享图片
      },
      rules: {
        classify: {
          required: true,
          message: "请选择分类",
          trigger: ["blur", "change"]
        },
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
        videoAddr: {
          required: true,
          message: "请选择输入视频地址",
          trigger: ["blur", "change"]
        },
        videoExplain: [
          {
            required: true,
            message: "请输入视频说明",
            trigger: ["blur", "change"]
          },
          {
            max: 100,
            message: "100字以内",
            trigger: "blur"
          }
        ],
        duration: {
          pattern: /^[1-9]\d*$/,
          required: true,
          message: "请输入时长，整数",
          trigger: ["blur", "change"]
        },
        img: {
          required: true,
          message: "请上传封面图",
          trigger: "change"
        },
        browseBase: {
          pattern: /^[0-9]\d*$/,
          required: false,
          message: "请输入 ≥0 的整数",
          trigger: ["blur", "change"]
        },
        practiceCycle: {
          required: true,
          message: "请选择练习周期",
          trigger: "change"
        },
        suitablePeople: {
          max: 100,
          message: "100字以内",
          trigger: "blur"
        },
        effect: {
          max: 500,
          message: "500字以内",
          trigger: "blur"
        },
        suggest: {
          max: 500,
          message: "500字以内",
          trigger: "blur"
        },
        bodyReaction: {
          max: 500,
          message: "500字以内",
          trigger: "blur"
        },
        expertId: {
          required: true,
          message: "请选择导师",
          trigger: ["blur", "change"]
        },
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
    ...mapState("trainingCampCategory", ["allCategories"]),
    ...mapState("expert", ["allExperts"]),
    ...mapState("goods", ["allGoods"]),
    ...mapState("trainingCampCourse", ["courseDetail"])
  },
  created() {
    this.init();
  },
  watch: {
    $route: "init" // 监听路由变化 更新页面状态 getData 初始化页面数据
  },
  methods: {
    ...mapActions("trainingCampCourse", [
      "createCourse",
      "getCourseDetail",
      "editCourse"
    ]),
    ...mapActions("trainingCampCategory", ["getAllCategories"]),
    ...mapActions("expert", ["getAllExperts"]),
    ...mapActions("goods", ["getAllGoods"]),
    // 初始化数据
    init() {
      if (
        this.$route.name == "trainingCampCourseCreate" ||
        this.$route.name == "trainingCampCourseEdit"
      ) {
        this.loading = false;
        this.isLoading = false; // 正在提交
        this.$nextTick(() => {
          this.$refs.ruleForm.resetFields();
        });
        this.getAllCategoriseForEdit(""); // 获取所有标签
        this.getExpertsForEdit(""); // 获取所有导师
        this.getAllGoodsForEdit(""); // 获取所有商品
        this.getData(); // 获取编辑内容
      }
    },
    //竖视频修改
    changeVerticalVideo() {
      this.$refs.ruleForm.rules.duration.required = !this.form.verticalVideo;
      if (this.form.verticalVideo) {
        this.$refs.ruleForm.clearValidate("duration");
      }
    },
    // 获取课程详情
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
        key: "getCourseDetail",
        duration: 2
      });
      const response = await this.getCourseDetail({
        id: Number(id)
      });
      this.loading = false;
      if (!response.code) return;
      if (response.code == 200) {
        const {
          id,
          classify, //分类
          title, // 课程标题
          videoAddr, //视频地址
          videoExplain, // 视频说明
          duration, //时长
          verticalVideo, // 是否是竖视频，
          shortVideo, //15s 视频
          bigImg, //封面大图
          img, //封面图
          browseBaseStatus, // 是否显示浏览人数
          browseBase, //浏览基数
          practiceCycle, //练习周期
          suitablePeople, //适用人群
          effect, //练习功效
          suggest, //练习建议
          bodyReaction, //身体反应
          expertId, //导师
          goods, //关联产品
          shareTitle, //分享标题
          shareImg //分享图片
        } = this.courseDetail;
        // console.log(tags);
        const goodsIds = [];
        goods.forEach(item => {
          goodsIds.push(item.goodsId);
        });
        this.form = {
          id,
          classify, //分类
          title, // 课程标题
          videoAddr, //视频地址
          videoExplain, // 视频说明
          duration, //时长
          verticalVideo, // 是否是竖视频，
          shortVideo, //15s 视频
          bigImg, //封面大图
          img, //封面图
          browseBaseStatus, // 是否显示浏览人数
          browseBase: browseBase || undefined, //浏览基数
          practiceCycle, //练习周期
          suitablePeople, //适用人群
          effect, //练习功效
          suggest, //练习建议
          bodyReaction, //身体反应
          expertId, //导师
          goodsIds, //关联产品
          shareTitle, //分享标题
          shareImg //分享图片
        };
        this.$message.success({
          content: "加载完成",
          key: "getCourseDetail",
          duration: 2
        });
      } else {
        this.$message.error({
          content: response.msg,
          key: "getCourseDetail",
          duration: 2
        });
      }
    },
    // 创建/修改课程
    async edit() {
      const {
        id,
        classify, //分类
        title, // 课程标题
        videoAddr, //视频地址
        videoExplain, // 视频说明
        duration, //时长
        verticalVideo, // 是否是竖视频，
        shortVideo, //15s 视频
        bigImg, //封面大图
        img, //封面图
        browseBaseStatus, // 是否显示浏览人数
        browseBase, //浏览基数
        practiceCycle, //练习周期
        suitablePeople, //适用人群
        effect, //练习功效
        suggest, //练习建议
        bodyReaction, //身体反应
        expertId, //导师
        goodsIds, //关联产品
        shareTitle, //分享标题
        shareImg //分享图片
      } = this.form;
      // console.log({
      // id,
      // classify, //分类
      // title, // 课程标题
      // videoAddr, //视频地址
      // videoExplain, // 视频说明
      // duration, //时长
      // verticalVideo, // 是否是竖视频，
      // shortVideo, //15s 视频
      // bigImg, //封面大图
      // img, //封面图
      // browseBaseStatus, // 是否显示浏览人数
      // browseBase, //浏览基数
      // practiceCycle, //练习周期
      // suitablePeople, //适用人群
      // effect, //练习功效
      // suggest, //练习建议
      // bodyReaction, //身体反应
      // expertId, //导师
      // goodsIds, //关联产品
      // shareTitle, //分享标题
      // shareImg //分享图片
      // });
      const payload = {
        id,
        classify, //分类
        title, // 课程标题
        videoAddr, //视频地址
        videoExplain, // 视频说明
        duration, //时长
        verticalVideo: Number(verticalVideo), // 是否是竖视频，
        shortVideo, //15s 视频
        bigImg, //封面大图
        img, //封面图
        browseBaseStatus: Number(browseBaseStatus), // 是否显示浏览人数
        browseBase, //浏览基数
        practiceCycle, //练习周期
        suitablePeople, //适用人群
        effect, //练习功效
        suggest, //练习建议
        bodyReaction, //身体反应
        expertId, //导师
        goodsId: goodsIds, //关联产品
        shareTitle, //分享标题
        shareImg //分享图片
      };
      const isEdit = id > 0;
      const response = isEdit
        ? await this.editCourse(payload)
        : await this.createCourse(payload);
      if (!response.code) return;
      if (response.code == 200) {
        this.$message.success({
          content: isEdit ? "修改成功" : "新增成功",
          key: "createCourse",
          duration: 2
        });
        // 返回上一页
        this.$router.go(-1);
      } else {
        this.$message.error({
          content: response.msg,
          key: "createCourse",
          duration: 2
        });
      }
      this.isLoading = false;
    },
    // 获取所有导师
    async getExpertsForEdit(expertName) {
      // console.log(expertName)
      const response = await this.getAllExperts({ expertName, type: 0 });
      if (!response.code) return;
      if (response.code != 200) {
        this.$message.error({
          content: response.msg,
          key: "getAllExperts",
          duration: 2
        });
      }
    },
    // 获取所有标签
    async getAllCategoriseForEdit(categoryName) {
      const response = await this.getAllCategories({ categoryName });
      if (!response.code) return;
      if (response.code != 200) {
        this.$message.error({
          content: response.msg,
          key: "getAllCategories",
          duration: 2
        });
      }
    },

    // 获取所有商品
    async getAllGoodsForEdit(goodsName) {
      const response = await this.getAllGoods({ goods: goodsName });
      if (!response.code) return;
      if (response.code != 200) {
        this.$message.error({
          content: response.msg,
          key: "getAllGoods",
          duration: 2
        });
      }
    },
    // 上传视频
    uploadShortVideo(option) {
      this.form.shortVideo = option.imageUrl;
    },
    // 上传封面大图
    uploadBigImg(option) {
      this.form.bigImg = option.imageUrl;
    },
    //   上传封面图
    uploadFacePic(option) {
      this.form.img = option.imageUrl;
    },
    // 上传分享图片
    uploadSharePic(option) {
      this.form.shareImg = option.imageUrl;
    },
    // 提交表单
    onSubmit() {
      this.isLoading = true;
      this.$refs.ruleForm.validate((valid, fieldObj) => {
        if (valid) {
          // alert("submit!");
          this.edit();
          // console.log(this.form);
        } else {
          // console.log("error submit!!");
          scrollToField(this.$refs.ruleForm, fieldObj);
          this.isLoading = false;
          return false;
        }
      });
    }
  }
};
</script>
