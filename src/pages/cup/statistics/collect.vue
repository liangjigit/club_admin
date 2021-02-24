<template>
  <div>
    <div class="functional-area">
      <div>{{ title }}</div>
      <div>{{ collects.length }}人收藏</div>
    </div>
    <a-table
      :scroll="{ x: 1300 }"
      :columns="columns"
      :data-source="collects"
      bordered
      :pagination="false"
      :style="{ backgroundColor: '#ffffff' }"
      :rowKey="record => record.id"
      :loading="{ spinning: loading, delay: 500 }"
    >
      <template slot="id" slot-scope="text">
        <a>{{ text }}</a>
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

const columns = [
  {
    dataIndex: "phone",
    key: "phone",
    title: "手机号"
  },
  {
    dataIndex: "nickname",
    key: "nickname",
    title: "微信昵称"
  },
  {
    dataIndex: "realname",
    key: "realname",
    title: "姓名"
  },
  {
    dataIndex: "createTime",
    key: "createTime",
    title: "收藏时间"
  }
];
export default {
  data() {
    return {
      columns,
      loading: false
    };
  },
  computed: {
    ...mapState("cupCollect", ["collects", "pageNum", "pageSize", "totalSize"]),
    title() {
      return this.$route.params.title;
    }
  },
  created() {
    this.init();
  },
  watch: {
    $route: "init" // 监听路由变化 更新页面状态 getData 初始化页面数据
  },
  methods: {
    ...mapActions("cupCollect", ["getCollects"]),
    init() {
      if (this.$route.name != "cupStatisticsCollect") {
        return;
      }
      this.getData();
    },
    // 获取列表数据
    async getData(page, pageSize) {
      let id = this.$route.params.id || 0;
      if (id == 0) {
        return;
      }
      this.loading = true;
      const response = await this.getCollects({
        pageNum: page || this.pageNum,
        pageSize: pageSize || this.pageSize,
        modelId: Number(id), //文章id
        model: 1, // cup 文章
        type: 0 // 表示收藏
      });
      this.loading = false;
      if (!response.code) return;
      if (response.code != 200) {
        this.$message.error({
          content: response.msg,
          key: "getCollects",
          duration: 2
        });
      }
    }
  }
};
</script>
