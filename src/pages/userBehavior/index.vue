<template>
  <div>
    <div class="functional-area" slot="actions">
      <a-form layout="inline" :form="search" @submit="searchSubmit">
        <a-form-item label="日期">
          <a-range-picker
            v-model="search.statisticsDate"
            format="YYYY-MM-DD"
            :placeholder="['开始', '结束']"
            @ok="confirmTime"
          >
            <a-icon slot="suffixIcon" type="clock-circle" />
          </a-range-picker>
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
      :scroll="{ x: 1000 }"
      :columns="columns"
      :data-source="userBehaviors"
      bordered
      :pagination="false"
      :style="{ backgroundColor: '#ffffff' }"
      :rowKey="record => record.id"
      :loading="{ spinning: loading, delay: 500 }"
    >
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
import { mapActions, mapState } from "vuex";
import { exportFile } from "@/utils/utils.js";
const columns = [
  {
    dataIndex: "id",
    title: "ID"
  },
  {
    dataIndex: "statisticsDate",
    title: "日期",
    width: 160
  },
  {
    dataIndex: "signInNum",
    title: "签到次数"
  },
  {
    dataIndex: "totalSignInNum",
    title: "累计签到次数"
  },
  {
    dataIndex: "activityNum",
    title: "活动签到次数"
  },
  {
    dataIndex: "totalActivityNum",
    title: "累计活动签到次数"
  },
  {
    dataIndex: "cupNum",
    title: "cup有料阅读次数"
  },
  {
    dataIndex: "totalCupNum",
    title: "累计cup有料阅读次数"
  },
  {
    dataIndex: "punchNum",
    title: "打卡次数"
  },
  {
    dataIndex: "totalPunchNum",
    title: "累计打卡次数"
  }
];
export default {
  data() {
    return {
      columns,
      loading: false,
      exportLoading: false,
      search: {
        statisticsDate: []
      }
    };
  },
  computed: {
    ...mapState("userBehavior", [
      "userBehaviors",
      "pageNum",
      "pageSize",
      "totalSize"
    ])
  },
  created() {
    this.getData();
  },
  methods: {
    ...mapActions("userBehavior", ["getUserBehaviors", "exportUserBehaviors"]),
    async exportData() {
      this.exportLoading = true;
      this.$message.loading({
        content: "正在导出",
        key: "exportUserBehaviors",
        duration: 2
      });
      let { statisticsDate } = this.search;
      // 格式化时间
      const [begin, end] = statisticsDate;
      const startDate = begin ? begin.format("YYYY-MM-DD") : "";
      const endDate = end ? end.format("YYYY-MM-DD") : "";

      const response = await this.exportUserBehaviors({
        startDate,
        endDate
      });
      exportFile(response, "用户行为统计", "exportUserBehaviors");
      this.exportLoading = false;
    },
    async getData(page, pageSize) {
      let { statisticsDate } = this.search;
      // 格式化时间
      const [begin, end] = statisticsDate;
      const startDate = begin ? begin.format("YYYY-MM-DD") : "";
      const endDate = end ? end.format("YYYY-MM-DD") : "";
      const response = await this.getUserBehaviors({
        startDate,
        endDate,
        pageNum: page || this.pageNum,
        pageSize: pageSize || this.pageSize
      });
      if (response.code != 200) {
        this.$message.success({
          content: response.msg,
          key: "getUserBehaviors",
          duration: 2
        });
      }
    },
    // 按创建时间搜索
    confirmTime(value) {
      this.search.statisticsDate = value;
    },
    // 提交搜索
    searchSubmit(e) {
      e.preventDefault();
      this.getData(1, this.pageSize);
    }
  }
};
</script>
