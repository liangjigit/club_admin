<template>
  <div>
    <div class="functional-area" slot="actions">
      <a-form layout="inline" :form="search" @submit="searchSubmit">
        <a-form-item label="标题">
          <a-input
            placeholder="请输入标题"
            v-model="search.title"
            :allowClear="true"
          />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit">
            查询
          </a-button>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="exportData" :loading="exportLoading">
            导出
          </a-button>
        </a-form-item>
      </a-form>
    </div>
    <a-table
      :scroll="{ x: 1300 }"
      :columns="columns"
      :data-source="statistics"
      bordered
      :pagination="false"
      :style="{ backgroundColor: '#ffffff' }"
      :rowKey="record => record.id"
      :loading="{ spinning: loading, delay: 500 }"
    >
      <template slot="id" slot-scope="text">
        <a>{{ text }}</a>
      </template>
      <template slot="browseBase" slot-scope="text, record">
        {{ Boolean(record.browseBaseStatus) ? record.browseBase : "-" }}
      </template>
      <template slot="punchCount" slot-scope="text, record">
        <span v-if="record.punchCount <= 0">{{ record.punchCount }}</span>
        <router-link
          v-else
          :to="{
            name: 'trainingCampStatisticsJoin',
            params: { id: record.courseId, title: record.title }
          }"
        >
          {{ record.punchCount }}
        </router-link>
      </template>
    </a-table>
    <!-- 分页器 -->
    <div style="margin-top:20px;textAlign:right">
      <a-pagination
        :default-current="1"
        v-model="pageNum"
        :total="totalSize"
        :pageSize="pageSize"
        @change="getData"
        show-size-changer
        @showSizeChange="(current, pageSize) => getData(1, pageSize)"
        :show-total="total => `总计${total} 条数据`"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { exportFile } from "@/utils/utils.js";
const columns = [
  {
    dataIndex: "id",
    key: "id",
    title: "ID"
  },
  {
    dataIndex: "title",
    key: "title",
    title: "标题"
  },
  {
    dataIndex: "browseBase",
    key: "browseBase",
    title: "浏览基数",
    scopedSlots: { customRender: "browseBase" }
  },
  {
    dataIndex: "browseUserCount",
    key: "browseUserCount",
    title: "实时浏览人数"
  },
  {
    dataIndex: "shareCount",
    key: "shareCount",
    title: "分享次数"
  },
  {
    dataIndex: "punchCount",
    key: "punchCount",
    title: "打卡人数",
    scopedSlots: { customRender: "punchCount" }
  },
  {
    dataIndex: "qrcodeCount",
    key: "qrcodeCount",
    title: "识别二维码数"
  },
  {
    dataIndex: "posterCount",
    key: "posterCount",
    title: "海报下载次数"
  }
];
export default {
  data() {
    return {
      //查询
      columns,
      loading: false,
      exportLoading: false,
      search: {
        title: ""
      }
    };
  },
  computed: {
    ...mapState("trainingCampStatistics", [
      "statistics",
      "pageNum",
      "pageSize",
      "totalSize"
    ])
  },
  created() {
    this.init();
  },
  watch: {
    $route: "init" // 监听路由变化 更新页面状态 getData 初始化页面数据
  },
  methods: {
    ...mapActions("trainingCampStatistics", [
      "getStatistics",
      "exportStatistics"
    ]),
    init() {
      if (this.$route.name != "trainingCampStatisticsIndex") {
        return;
      }
      this.getData();
    },
    // 导出数据
    async exportData() {
      this.exportLoading = true;
      this.$message.loading({
        content: "正在导出",
        key: "exportStatistics",
        duration: 2
      });
      const { pageNum, pageSize } = this;
      const { title } = this.search;
      const response = await this.exportStatistics({
        pageNum,
        pageSize,
        title
      });
      exportFile(response, "体态训练营数据统计"); // 导出文件
      this.exportLoading = false;
    },
    // 获取列表数据
    async getData(page, pageSize) {
      this.loading = true;
      const { title } = this.search;
      const response = await this.getStatistics({
        pageNum: page || this.pageNum,
        pageSize: pageSize || this.pageSize,
        title
      });
      this.loading = false;
      if (!response.code) return;
      if (response.code != 200) {
        this.$message.error({
          content: response.msg,
          key: "getStatistics",
          duration: 2
        });
      }
    },
    // 点击查询
    searchSubmit(e) {
      // console.log(this.search);
      e.preventDefault();
      this.getData(1, this.pageSize);
    }
  }
};
</script>
