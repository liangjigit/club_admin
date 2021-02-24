<template>
  <div>
    <a-spin :spinning="loading" :delay="500">
      <make-poster
        :form="form"
        :qrcode="qrcode"
        @save="save"
        @cancel="cancel"
      ></make-poster>
    </a-spin>
  </div>
</template>

<script>
import makePoster from "../../components/MakePoster";
import { mapActions, mapState } from "vuex";
export default {
  components: {
    makePoster
  },
  data() {
    return {
      qrcode: "", //"https://aimer-zt.oss-cn-beijing.aliyuncs.com/pictures_test/1593181328578",
      loading: false,
      form: {
        id: 0, //
        img: "", //"https://aimer-zt.oss-cn-beijing.aliyuncs.com/pictures_test/1593180252293", // 分享卡片
        posX: 0, // 二维码定位X
        posY: 0, // 二维码定位Y
        size: 400 //二维码尺寸
      }
    };
  },
  computed: {
    ...mapState("trainingCampCourse", ["courseDetail"])
  },
  created() {
    this.init();
  },
  watch: {
    $route: "init" // 监听路由变化 更新页面状态 getData 初始化页面数据
  },
  methods: {
    ...mapActions("trainingCampCourse", ["getCourseDetail", "savePoster"]),
    init() {
      if (this.$route.name != "trainingCampCoursePoster") {
        this.form = {
          id: 0, //
          img: "", // 分享卡片
          posX: 0, // 二维码定位X
          posY: 0, // 二维码定位Y
          size: 280 //二维码尺寸
        };
        return;
      }
      this.getData();
    },
    // 获取文章详情
    async getData() {
      // console.log(this.$route)
      // console.log(this.$route.name == "cupArticleDetail")
      const id = this.$route.params.id || 0;
      if (id == 0) {
        return;
      }
      this.loading = true;
      const response = await this.getCourseDetail({
        id: Number(id)
      });
      this.loading = false;
      if (!response.code) return;
      if (response.code == 200) {
        const {
          qrcodeX,
          qrcodeY,
          shareCardImg,
          qrcodePx,
          id,
          qrcodeUrl
        } = response.data;
        this.qrcode = qrcodeUrl;
        this.form = {
          id, //
          img: shareCardImg, // 分享卡片
          posX: qrcodeX, // 二维码定位X
          posY: qrcodeY, // 二维码定位Y
          size: qrcodePx || 280 //二维码尺寸
        };
      } else {
        this.$message.error({
          content: response.msg,
          key: "getArticleDetail",
          duration: 2
        });
      }
    },
    async save(event) {
      const {
        id,
        img: shareCardImg,
        posX: qrcodeX,
        posY: qrcodeY,
        size: qrcodePx,
        posterImg: previewImg
      } = event;
      const response = await this.savePoster({
        id,
        qrcodePx,
        qrcodeX,
        qrcodeY,
        shareCardImg,
        previewImg
      });
      if (!response.code) return;
      if (response.code == 200) {
        this.$message.success({
          content: "保存成功",
          key: "savePoster",
          duration: 2
        });
      } else {
        this.$message.error({
          content: response.msg,
          key: "savePoster",
          duration: 2
        });
      }
    },
    cancel() {
      // console.log("cancel");
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
canvas {
  width: 320px;
  height: auto;
  background-color: #ffffff;
}
</style>
