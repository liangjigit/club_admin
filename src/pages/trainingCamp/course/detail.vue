<template>
  <div style="background-color:#fff;padding:15px">
    <a-spin :spinning="loading" :delay="500">
      <a-descriptions
        :title="courseDetail.title"
        layout="vertical"
        :column="{ xxl: 5, xl: 5, lg: 3, md: 1, sm: 1, xs: 1 }"
        bordered
        size="small"
      >
        <a-descriptions-item label="分类">
          {{ courseDetail.classify }}
        </a-descriptions-item>
        <a-descriptions-item label="视频地址">
          {{ courseDetail.videoAddr }}
        </a-descriptions-item>
        <a-descriptions-item label="视频说明">
          {{ courseDetail.videoExplain }}
        </a-descriptions-item>
        <a-descriptions-item label="时长">
          {{ courseDetail.duration }} 分钟
        </a-descriptions-item>
        <a-descriptions-item label="竖视频">
          {{ Boolean(courseDetail.verticalVideo) ? "是" : "否" }}
        </a-descriptions-item>
        <a-descriptions-item label="15s视频">
          {{ courseDetail.shortVideo || "-" }}
        </a-descriptions-item>
        <a-descriptions-item label="封面大图">
          <img :src="courseDetail.bigImg" style="width:172.5px;height:97px" />
        </a-descriptions-item>
        <a-descriptions-item label="封面图">
          <img :src="courseDetail.img" style="width:108px;height:144px" />
        </a-descriptions-item>
        <a-descriptions-item label="是否显示浏览人数">
          {{ Boolean(courseDetail.browseBaseStatus) ? "是" : "否" }}
        </a-descriptions-item>
        <a-descriptions-item label="浏览人数基数">
          {{ courseDetail.browseBase || 0 }} 人
        </a-descriptions-item>
        <a-descriptions-item label="练习周期">
          {{ courseDetail.practiceCycle }}
        </a-descriptions-item>
        <a-descriptions-item label="适用人群">
          {{ courseDetail.suitablePeople || "-" }}
        </a-descriptions-item>
        <a-descriptions-item label="练习功效">
          {{ courseDetail.effect || "-" }}
        </a-descriptions-item>
        <a-descriptions-item label="练习建议">
          {{ courseDetail.suggest || "-" }}
        </a-descriptions-item>
        <a-descriptions-item label="身体反应">
          {{ courseDetail.bodyReaction || "-" }}
        </a-descriptions-item>
        <a-descriptions-item label="导师">
          {{ courseDetail.expertName }}
        </a-descriptions-item>
        <a-descriptions-item label="关联产品">
          <p v-for="item in courseDetail.goods" :key="item.id">
            {{ item.goodsName }} - {{ item.itemNo }}
          </p>
          <span v-if="courseDetail.goods && courseDetail.goods.length == 0"
            >-</span
          >
        </a-descriptions-item>
        <a-descriptions-item label="分享图片">
          <span v-if="!courseDetail.shareImg">-</span>
          <img
            v-else
            :src="courseDetail.shareImg"
            style="width:176.5px;height:144px"
          />
        </a-descriptions-item>
        <a-descriptions-item label="分享标题">
          {{ courseDetail.shareTitle || "-" }}
        </a-descriptions-item>
        <a-descriptions-item label="分享海报">
          <span v-if="!courseDetail.previewImg">-</span>
          <img
            v-else
            :src="courseDetail.previewImg"
            style="width:165px;height:auto"
          />
        </a-descriptions-item>
        <a-descriptions-item label="创建时间">
          {{ courseDetail.createTime }}
        </a-descriptions-item>
        <a-descriptions-item label="排序">
          {{ courseDetail.courseSort }}
        </a-descriptions-item>
      </a-descriptions>
    </a-spin>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      // id: 0 // 文章ID
      loading: false
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
    ...mapActions("trainingCampCourse", ["getCourseDetail"]),
    init() {
      if (this.$route.name != "trainingCampCourseDetail") {
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
      if (response.code != 200) {
        this.$message.error({
          content: response.msg || response.message,
          key: "getCourseDetail",
          duration: 2
        });
      }
    }
  }
};
</script>

<style></style>
