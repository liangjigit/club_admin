<template>
  <div style="background-color:#fff;padding:15px">
    <a-spin :spinning="loading" :delay="500">
      <a-descriptions
        :title="activityDetail.title"
        layout="vertical"
        :column="{ xxl: 6, xl: 5, lg: 3, md: 1, sm: 1, xs: 1 }"
        bordered
        size="small"
      >
        <a-descriptions-item label="封面图">
          <img :src="activityDetail.img" style="width:167.5px;height:94px" />
        </a-descriptions-item>
        <a-descriptions-item label="状态">
          {{ activityDetail.status ? "上架" : "下架" }}
        </a-descriptions-item>
        <a-descriptions-item label="活动时间">
          {{ activityDetail.activityStartTime }} ~
          {{ activityDetail.activityEndTime }}
        </a-descriptions-item>
        <a-descriptions-item label="报名开始时间">
          {{ activityDetail.applyStartTime }} ~
          {{ activityDetail.applyEndTime }}
        </a-descriptions-item>
        <a-descriptions-item label="报名人数限制">
          {{ activityDetail.applyNumLimit || "-" }}
        </a-descriptions-item>
        <a-descriptions-item label="活动城市">
          {{ activityDetail.province }}
          -
          {{ activityDetail.city }}
        </a-descriptions-item>
        <a-descriptions-item label="详细地址">
          {{ activityDetail.address }}
        </a-descriptions-item>
        <a-descriptions-item label="最低会员等级">
          {{ activityDetail.lowestLevel || "-" }}
        </a-descriptions-item>
        <a-descriptions-item label="评级消费金额">
          {{ activityDetail.lowestMoney || "-" }}
        </a-descriptions-item>
        <a-descriptions-item label="是否显示浏览人数">
          {{ Boolean(activityDetail.browseBaseStatus) ? "是" : "否" }}
        </a-descriptions-item>
        <a-descriptions-item label="浏览人数基数">
          {{ activityDetail.browseBase || 0 }} 人
        </a-descriptions-item>
        <a-descriptions-item label="分享图片">
          <span v-if="!activityDetail.shareImg">-</span>
          <img
            v-else
            :src="activityDetail.shareImg"
            style="width:178.5px;height:144px"
          />
        </a-descriptions-item>
        <a-descriptions-item label="分享标题">
          {{ activityDetail.shareTitle || "-" }}
        </a-descriptions-item>
        <a-descriptions-item label="分享海报">
          <span v-if="!activityDetail.previewImg">-</span>
          <img
            v-else
            :src="activityDetail.previewImg"
            style="width:165px;height:auto"
          />
        </a-descriptions-item>
        <a-descriptions-item label="创建时间">
          {{ activityDetail.createTime }}
        </a-descriptions-item>
        <a-descriptions-item label="排序">
          {{ activityDetail.activitySort }}
        </a-descriptions-item>
      </a-descriptions>
      <a-descriptions
        layout="vertical"
        :column="{ xxl: 6, xl: 5, lg: 3, md: 1, sm: 1, xs: 1 }"
        bordered
        size="small"
        style="margin-top:10px;"
      >
        <a-descriptions-item label="正文">
          <show-editor-content
            :content="activityDetail.content"
          ></show-editor-content>
          <!-- <div class="ql-container ql-snow">
              <div class="ql-editor" v-html="activityDetail.content">
          </div> -->
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
    ...mapState("communityActivity", ["activityDetail"])
  },
  created() {
    this.init();
  },
  watch: {
    $route: "init" // 监听路由变化 更新页面状态 getData 初始化页面数据
  },
  methods: {
    ...mapActions("communityActivity", ["getActivityDetail"]),
    init() {
      if (this.$route.name != "communityActivityDetail") {
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
      const response = await this.getActivityDetail({
        id: Number(id)
      });
      this.loading = false;
      if (!response.code) return;
      if (response.code != 200) {
        this.$message.error({
          content: response.msg,
          key: "getActivityDetail",
          duration: 2
        });
      }
    }
  }
};
</script>

<style></style>
