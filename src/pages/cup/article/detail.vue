<template>
  <div style="background-color:#fff;padding:15px">
    <a-spin :spinning="loading" :delay="500">
      <a-descriptions
        :title="articleDetail.title"
        layout="vertical"
        :column="{ xxl: 6, xl: 5, lg: 3, md: 1, sm: 1, xs: 1 }"
        bordered
        size="small"
      >
        <a-descriptions-item label="封面图">
          <img :src="articleDetail.img" style="width:105px;height:165px" />
        </a-descriptions-item>
        <a-descriptions-item label="定时上下架时间">
          <span v-if="articleDetail.startTime && articleDetail.endTime">
            {{ articleDetail.startTime + " - " + articleDetail.endTime }}
          </span>
          <span v-else>-</span>
        </a-descriptions-item>
        <a-descriptions-item label="是否显示浏览人数">
          {{ Boolean(articleDetail.browseBaseStatus) ? "是" : "否" }}
        </a-descriptions-item>
        <a-descriptions-item label="浏览人数基数">
          {{ articleDetail.browseBase || 0 }} 人
        </a-descriptions-item>
        <a-descriptions-item label="状态">
          {{ articleDetail.status ? "上架" : "下架" }}
        </a-descriptions-item>
        <a-descriptions-item label="标签">
          <a-tag color="pink" v-for="tag in articleDetail.tags" :key="tag">
            {{ tag }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="专家">
          {{ articleDetail.expertName }}
        </a-descriptions-item>
        <a-descriptions-item label="关联产品">
          <p v-for="item in articleDetail.goods" :key="item.id">
            {{ item.goodsName }} - {{ item.itemNo }}
          </p>
          <span v-if="articleDetail.goods && articleDetail.goods.length == 0"
            >-</span
          >
        </a-descriptions-item>
        <a-descriptions-item label="分享图片">
          <span v-if="!articleDetail.shareImg">-</span>
          <img
            v-else
            :src="articleDetail.shareImg"
            style="width:178.5px;height:144px"
          />
        </a-descriptions-item>
        <a-descriptions-item label="分享标题">
          {{ articleDetail.shareTitle || "-" }}
        </a-descriptions-item>
        <a-descriptions-item label="分享海报">
          <span v-if="!articleDetail.previewImg">-</span>
          <img
            v-else
            :src="articleDetail.previewImg"
            style="width:165px;height:auto"
          />
        </a-descriptions-item>
        <a-descriptions-item label="创建时间">
          {{ articleDetail.createTime }}
        </a-descriptions-item>
        <a-descriptions-item label="排序">
          {{ articleDetail.articleSort }}
        </a-descriptions-item>
      </a-descriptions>
      <a-descriptions
        layout="vertical"
        :column="{ xxl: 6, xl: 5, lg: 3, md: 1, sm: 1, xs: 1 }"
        bordered
        size="small"
        style="margin-top:10px"
      >
        <a-descriptions-item label="正文" style="background-color:#ffffff">
          <show-editor-content
            :content="articleDetail.content"
          ></show-editor-content>
          <!-- <div v-html="articleDetail.content"></div> -->
        </a-descriptions-item>
      </a-descriptions>
    </a-spin>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import showEditorContent from "@/pages/components/ShowEditorContent.vue";
export default {
  components: {
    showEditorContent
  },
  data() {
    return {
      // id: 0 // 文章ID
      loading: false
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
  methods: {
    ...mapActions("cupArticle", ["getArticleDetail"]),
    init() {
      if (this.$route.name != "cupArticleDetail") {
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
      const response = await this.getArticleDetail({
        id: Number(id)
      });
      this.loading = false;
      if (!response.code) return;
      if (response.code != 200) {
        this.$message.error({
          content: response.msg || response.message,
          key: "getArticleDetail",
          duration: 2
        });
      }
    }
  }
};
</script>

<style></style>
