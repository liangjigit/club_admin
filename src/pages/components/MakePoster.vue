<template>
  <div>
    <a-row>
      <a-col :span="12">
        <a-form-model
          ref="ruleForm"
          :model="form"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-model-item
            label="分享卡片"
            prop="img"
            extra="建议宽度：不小于 750px，png/jpg格式，2M以内"
          >
            <upload-file
              @uploadPic="uploadImg"
              :img="form.img"
              :imgWidth="320 / 2"
            ></upload-file>
          </a-form-model-item>
          <a-form-model-item
            label="二维码定位"
            prop="posX"
            extra="X 代表二维码左顶端的横坐标，正数，单位为像素"
          >
            <a-input
              v-model.number="form.posX"
              type="number"
              placeholder="X轴偏移量"
              addon-after="（X）"
            />
          </a-form-model-item>
          <a-form-model-item
            label="二维码定位"
            prop="posY"
            extra="Y 代表二维码左顶端的纵坐标，正数，单位为像素"
          >
            <a-input
              v-model.number="form.posY"
              type="number"
              placeholder="Y轴偏移量"
              addon-after="（Y）"
            />
          </a-form-model-item>
          <a-form-model-item
            label="二维码尺寸"
            prop="size"
            extra="最小280px，最大 1280px"
          >
            <a-input
              v-model.number="form.size"
              placeholder="二维码尺寸"
              type="number"
            />
          </a-form-model-item>
          <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
            <a-button type="default" @click="cancel">
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
      </a-col>
      <a-col :span="12">
        <div>
          <div style="margin-bottom:10px">
            预览尺寸（px）：{{
              canvasAttr
                ? canvasAttr.offsetWidth + " x " + canvasAttr.offsetHeight
                : ""
            }}（保持纵横比）。 <br />实际尺寸（px）：{{
              canvasAttr ? canvasAttr.width + " x " + canvasAttr.height : ""
            }}（与分享卡片尺寸一致）。
            <!-- <br />{{
              qrSize ? "二维码实际尺寸约（px）：" + qrSize : ""
            }}。 -->
          </div>
          <canvas ref="canvas" width="750" height="1334"></canvas>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import uploadFile from "./UploadFile";
import request from "@/utils/request";
export default {
  components: {
    uploadFile
  },
  props: {
    qrcode: {
      type: String,
      default: ""
    },
    form: {
      type: Object,
      default: () => {
        return {
          id: 0, //
          img: "", // 分享卡片
          posX: 0, // 二维码定位X
          posY: 0, // 二维码定位Y
          size: 280 //二维码尺寸
        };
      }
    }
  },
  data() {
    return {
      qrSize: null, // 二维码实际尺寸
      canvasAttr: null, //预览以实际尺寸
      isLoading: false,
      id: 0, //
      canvas: null, // 画布
      context: null, //context 2d
      labelCol: { span: 4 },
      wrapperCol: { span: 12 },
      rules: {
        img: [
          {
            required: true,
            message: "请上传分享卡片",
            trigger: "change"
          }
        ],
        posX: {
          pattern: /^(0|0\.0*[1-9]+[0-9]*$|[1-9]+[0-9]*\.[0-9]*[0-9]$|[1-9]+[0-9]*$)/,
          required: true,
          message: "请输入≥ 0 的坐标",
          trigger: ["blur", "change"]
        },
        posY: {
          pattern: /^(0|0\.0*[1-9]+[0-9]*$|[1-9]+[0-9]*\.[0-9]*[0-9]$|[1-9]+[0-9]*$)/,
          required: true,
          message: "请输入≥ 0 的坐标",
          trigger: ["blur", "change"]
        },
        size: [
          {
            type: "number",
            required: true,
            message: "最小280px，最大1280px",
            max: 1280,
            min: 280,
            trigger: ["blur", "change"]
          }
        ]
      }
    };
  },
  created() {
    this.$nextTick(() => {
      this.init(); //初始化 canvas
    });
  },
  watch: {
    form: {
      // eslint-disable-next-line no-unused-vars
      handler(newValue, oldValue) {
        this.drawPoster();
      },
      deep: true
    }
  },
  methods: {
    init() {
      this.$refs.ruleForm.resetFields();
      this.isLoading = false;
      this.canvas = this.$refs.canvas;
      this.context = this.canvas.getContext("2d");
      this.drawPoster();
    },
    // 绘制海报
    drawPoster() {
      let _this = this;
      _this.context.clearRect(0, 0, _this.canvas.width, _this.canvas.height); // 清空画布
      if (!_this.form.img) {
        return;
      }
      let img = new Image();
      img.src = this.form.img + "?t=" + new Date().getTime(); // 去掉图片缓存
      img.setAttribute("crossOrigin", "anonymous");
      // console.log(_this.canvas)
      img.onload = e => {
        const img = e.path[0];
        const img_w = img.width;
        const img_h = img.height;
        _this.canvas.width = img_w;
        _this.canvas.height = img_h;
        _this.canvasAttr = {
          offsetWidth: _this.canvas.offsetWidth,
          offsetHeight: _this.canvas.offsetHeight,
          width: _this.canvas.width,
          height: _this.canvas.height
        };
        _this.context.drawImage(img, 0, 0);
        // 绘制二维码
        _this.drawQRCode();
      };
    },
    // 绘制二维码
    drawQRCode() {
      if (!this.qrcode) {
        return;
      }
      let _this = this;
      let img = new Image();
      img.setAttribute("crossOrigin", "anonymous");
      img.src = _this.qrcode + "?t=" + new Date().getTime(); // 去掉图片缓存
      // console.log(_this.canvas.offsetWidth);
      // console.log(_this.canvas.width);
      // console.log(img.width);
      // const ratio = _this.canvas.offsetWidth / _this.canvas.width;
      img.onload = e => {
        const img = e.path[0];
        // const ratio = _this.canvas.offsetWidth / img.width;
        // const size = ((_this.form.size || img.width) * ratio).toFixed(2);
        // console.log(ratio);
        // console.log(size);
        // _this.qrSize = _this.form.size;
        _this.context.drawImage(
          img,
          _this.form.posX,
          _this.form.posY,
          _this.form.size,
          _this.form.size
        );
      };
    },
    // 提交
    onSubmit() {
      // console.log(this.form);
      this.isLoading = true;
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          // console.log(this.form);
          let base64Url = "";
          try {
            this.$message.loading({
              content: "正在保存",
              key: "savePoster",
              duration: 5
            });
            base64Url = this.canvas.toDataURL("image/png", 1);
            const response = (
              await request({
                url: "/content/file/upload-oss-base64-image",
                method: "POST",
                data: {
                  image: base64Url
                }
              })
            ).data;
            if (!response.code) return;
            if (response.code == 200) {
              this.form.posterImg = response.data;
              // console.log(this.form);
              this.$emit("save", this.form);
            } else {
              this.$message.error({
                content: response.msg || response.message,
                key: "savePoster",
                duration: 2
              });
            }
            this.isLoading = false;
          } catch (error) {
            this.$message.error({
              content: "上传图片发生错误",
              key: "savePoster",
              duration: 2
            });
            this.isLoading = false;
            // console.log(error);
          }
        } else {
          // console.log("error submit!!");
          this.isLoading = false;
          return false;
        }
      });
    },
    // 上传分享卡片
    uploadImg(option) {
      this.form.img = option.imageUrl;
    },
    // 取消上传
    cancel() {
      this.$emit("cancel");
    }
  }
};
</script>

<style scoped>
canvas {
  width: 375px;
  height: auto;
  background-color: #ffffff;
}
</style>
