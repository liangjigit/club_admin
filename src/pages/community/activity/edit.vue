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
        <a-form-model-item label="活动时间" prop="activityTime">
          <a-range-picker
            v-model="form.activityTime"
            :show-time="{
              defaultValue: [
                moment('00:00:00', 'HH:mm:ss'),
                moment('23:59:59', 'HH:mm:ss')
              ]
            }"
            format="YYYY-MM-DD HH:mm:ss"
            :placeholder="['开始', '结束']"
            @ok="confirmActivityTime"
          >
            <a-icon slot="suffixIcon" type="clock-circle" />
          </a-range-picker>
        </a-form-model-item>
        <a-form-model-item
          label="活动城市"
          prop="activityCity"
          :wrapper-col="{ span: 5 }"
        >
          <a-cascader
            :options="provinceAndCityData"
            placeholder="请选择活动城市"
            :showSearch="true"
            :default-value="form.activityCity"
            v-model="form.activityCity"
          />
        </a-form-model-item>
        <a-form-model-item label="详细地址" prop="address">
          <a-textarea
            placeholder="请输入详细地址，100字以内"
            :auto-size="{ minRows: 2, maxRows: 6 }"
            v-model="form.address"
          />
        </a-form-model-item>
        <a-form-model-item label="报名时间" prop="applyTime">
          <a-range-picker
            v-model="form.applyTime"
            :disabledDate="disabledDate"
            :show-time="{
              hideDisabledOptions: true,
              defaultValue: [
                moment('00:00:00', 'HH:mm:ss'),
                moment('23:59:59', 'HH:mm:ss')
              ]
            }"
            format="YYYY-MM-DD HH:mm:ss"
            :placeholder="['开始', '结束']"
            @ok="confirmApplyTime"
          >
            <a-icon slot="suffixIcon" type="clock-circle" />
          </a-range-picker>
        </a-form-model-item>
        <a-form-model-item label="最低会员等级" prop="lowestLevel">
          <a-select
            :allowClear="true"
            :show-arrow="true"
            :not-found-content="'未找到'"
            placeholder="请选择"
            :default-value="form.lowestLevel"
            v-model="form.lowestLevel"
            style="width: 200px"
          >
            <a-select-option
              v-for="item in MemberLevel"
              :key="item.value"
              :value="item.name"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item
          label="报名人数限制"
          prop="applyNumLimit"
          :wrapper-col="{ span: 3 }"
        >
          <a-input
            placeholder="请输入报名人数限制"
            v-model.number="form.applyNumLimit"
          />
        </a-form-model-item>
        <!-- <a-form-model-item
          label="评级消费金额"
          prop="lowestMoney"
          :wrapper-col="{ span: 3 }"
        >
          <a-input
            placeholder="请输入评级消费金额"
            v-model.number="form.lowestMoney"
          />
        </a-form-model-item> -->
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
import { scrollToField } from "@/utils/utils.js";
import {
  provinceAndCityData,
  //   regionData,
  // provinceAndCityDataPlus ,
  // regionDataPlus,
  CodeToText,
  TextToCode
} from "element-china-area-data";
import moment from "moment";
import { mapActions, mapState } from "vuex";
// 会员等级
const MemberLevel = [
  {
    name: "JT普卡",
    value: 1
  },
  {
    name: "JT银卡",
    value: 2
  },
  {
    name: "JT金卡",
    value: 3
  },
  {
    name: "JT白金卡",
    value: 4
  },
  {
    name: "JT至尊卡",
    value: 5
  }
];
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
      MemberLevel,
      provinceAndCityData, //省份城市
      CodeToText,
      TextToCode,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      loading: false,
      isLoading: false, // 正在提交
      form: {
        id: 0,
        title: "", // 文章标题
        img: "", // 文章封面图
        activityTime: [], // 上下架时间
        applyTime: [], //报名时间
        activityCity: [], // 活动城市
        address: "", //活动详细地址
        lowestLevel: undefined, //最低会员等级 TODO
        applyNumLimit: undefined, //报名人数限制
        lowestMoney: undefined, //评级消费金额
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
        activityTime: [
          {
            type: "array",
            required: true,
            message: "请选择活动时间",
            trigger: "change"
          },
          { validator: this.validateActivityTime, trigger: "change" }
        ],
        activityCity: [
          {
            type: "array",
            required: true,
            message: "请选择活动城市",
            trigger: "change"
          }
        ],
        address: [
          {
            required: true,
            message: "请填写详细地址",
            trigger: "change"
          },
          {
            min: 1,
            max: 100,
            message: "100字以内",
            trigger: "blur"
          }
        ],
        applyTime: [
          {
            type: "array",
            required: true,
            message: "请选择报名时间",
            trigger: "change"
          },
          { validator: this.validateApplyTime, trigger: "change" }
        ],
        applyNumLimit: {
          pattern: /^[1-9]\d*$/,
          required: false,
          message: "请输入 >0 的整数",
          trigger: ["blur", "change"]
        },
        lowestMoney: {
          pattern: /^[1-9]\d*$/,
          required: false,
          message: "请输入 >0 的整数",
          trigger: ["blur", "change"]
        },
        browseBase: {
          pattern: /^[1-9]\d*$/,
          required: false,
          message: "请输入 >0 的整数",
          trigger: ["blur", "change"]
        },
        img: [
          {
            required: true,
            message: "请上传封面图",
            trigger: "change"
          }
        ],
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
    ...mapState("communityActivity", ["activityDetail"])
  },
  created() {
    this.init();
  },
  watch: {
    $route: "init" // 监听路由变化 更新页面状态 getData 初始化页面数据
  },
  methods: {
    ...mapActions("communityActivity", [
      "createActivity",
      "getActivityDetail",
      "editActivity"
    ]),
    moment,
    disabledDate(current) {
      // Can not select days before today and today
      if (this.form.activityTime && this.form.activityTime.length > 0) {
        return current > this.form.activityTime[1];
      }
    },
    // 初始化数据
    init() {
      // console.log("init");
      if (
        this.$route.name == "communityActivityEdit" ||
        this.$route.name == "communityActivityCreate"
      ) {
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
      // console.log(this.$route)
      // console.log(this.$route.name == "cupArticleDetail")
      const id = this.$route.params.id || 0;
      if (id == 0) {
        return false;
      }
      this.loading = true;
      this.$message.loading({
        content: "正在加载编辑内容",
        key: "getActivityDetail",
        duration: 2
      });
      const response = await this.getActivityDetail({
        id: Number(id)
      });
      this.loading = false;
      if (!response.code) return;
      if (response.code == 200) {
        const {
          id,
          title,
          activityEndTime,
          activityStartTime,
          applyEndTime,
          applyStartTime,
          applyNumLimit,
          lowestLevel,
          lowestMoney,
          address,
          city,
          province,
          img,
          browseBase,
          browseBaseStatus,
          content,
          shareImg,
          shareTitle
        } = this.activityDetail;
        // 时间转换
        // 活动时间
        const activityTime = [
          activityStartTime
            ? moment(activityStartTime, "YYYY-MM-DD HH:mm:ss")
            : null,
          activityEndTime
            ? moment(activityEndTime, "YYYY-MM-DD HH:mm:ss")
            : null
        ];
        // 报名时间
        const applyTime = [
          applyStartTime ? moment(applyStartTime, "YYYY-MM-DD HH:mm:ss") : null,
          applyEndTime ? moment(applyEndTime, "YYYY-MM-DD HH:mm:ss") : null
        ];
        // 城市转换 TextToCode
        // console.log(this.TextToCode);
        let currentCity = this.TextToCode[province];
        let provinceCode = "";
        let cityCode = "";
        if (currentCity) {
          provinceCode = currentCity["code"];
          // console.log(provinceCode);
          cityCode = city ? currentCity[city]["code"] : "";
          // console.log(cityCode)
        }
        const activityCity = [provinceCode, cityCode];
        this.form = {
          activityTime,
          applyTime,
          activityCity,
          id,
          title, // 文章标题
          img, // 文章封面图
          applyNumLimit,
          lowestLevel: lowestLevel || undefined,
          lowestMoney,
          address,
          browseBaseStatus, // 是否显示浏览人数
          browseBase: browseBase || undefined, //浏览基数
          shareTitle, //分享标题
          shareImg, //分享图片
          content //文章正文
        };
        this.$message.success({
          content: "加载完成",
          key: "getActivityDetail",
          duration: 2
        });
      } else {
        this.$message.error({
          content: response.msg,
          key: "getActivityDetail",
          duration: 2
        });
      }
    },
    // 创建/修改文章
    async edit() {
      this.$message.loading({
        content: "正在提交",
        key: "createActivity",
        duration: 2
      });
      const {
        activityTime,
        applyTime,
        activityCity,
        address,
        lowestLevel,
        applyNumLimit,
        lowestMoney,
        browseBase,
        browseBaseStatus,
        content,
        id,
        img,
        shareImg,
        shareTitle,
        title
      } = this.form;
      // 时间转换
      // 活动时间
      const activityStartTime =
        activityTime.length > 0
          ? activityTime[0].format("YYYY-MM-DD HH:mm:ss")
          : "";
      const activityEndTime =
        activityTime.length > 0
          ? activityTime[1].format("YYYY-MM-DD HH:mm:ss")
          : "";
      // 报名时间
      const applyStartTime =
        applyTime.length > 0 ? applyTime[0].format("YYYY-MM-DD HH:mm:ss") : "";
      const applyEndTime =
        applyTime.length > 0 ? applyTime[1].format("YYYY-MM-DD HH:mm:ss") : "";
      // 城市转换 CodeToText
      const provinceCode = activityCity[0];
      const cityCode = activityCity[1];
      // console.log(activityCity);
      const province = !provinceCode ? "" : this.CodeToText[provinceCode];
      const city = !cityCode ? "" : this.CodeToText[cityCode];
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
        activityEndTime,
        activityStartTime,
        applyEndTime,
        applyStartTime,
        applyNumLimit,
        lowestLevel,
        lowestMoney,
        address,
        city,
        province,
        img,
        browseBase,
        browseBaseStatus: Number(browseBaseStatus),
        content,
        shareImg,
        shareTitle
      };
      const isEdit = id > 0;
      const response = isEdit
        ? await this.editActivity(payload)
        : await this.createActivity(payload);
      if (!response.code) return;
      if (response.code == 200) {
        this.$message.success({
          content: isEdit ? "修改成功" : "新增成功",
          key: "createActivity",
          duration: 2
        });
        // 返回上一页
        this.$router.go(-1);
      } else {
        this.$message.error({
          content: response.msg,
          key: "createActivity",
          duration: 2
        });
      }
      this.isLoading = false;
    },
    validateActivityTime(rule, value, callback) {
      // eslint-disable-next-line no-debugger
      // debugger;
      if (this.form.applyTime.length > 0 && this.form.activityTime.length > 0) {
        if (this.form.applyTime[1] > this.form.activityTime[1]) {
          this.$refs.ruleForm.validateField("applyTime");
        } else {
          callback();
        }
      } else if (this.form.activityTime.length > 0) {
        callback();
      }
    },
    validateApplyTime(rule, value, callback) {
      if (this.form.applyTime.length > 0 && this.form.activityTime.length > 0) {
        if (this.form.applyTime[1] > this.form.activityTime[1]) {
          callback(new Error("报名结束在活动结束之前"));
        } else {
          callback();
        }
      } else if (this.form.applyTime.length > 0) {
        callback();
      }
    },
    //   上传封面图
    uploadFacePic(option) {
      this.form.img = option.imageUrl;
    },
    // 上传分享图片
    uploadSharePic(option) {
      this.form.shareImg = option.imageUrl;
    },
    //  活动时间
    confirmActivityTime(value) {
      this.form.activityTime = value;
      // console.log(this.form.activityTime);
    },
    // 报名时间
    confirmApplyTime(value) {
      this.form.applyTime = value;
      // console.log(this.form.applyTime);
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
