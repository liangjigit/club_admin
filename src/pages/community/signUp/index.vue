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
        <a-form-item label="用户手机号">
          <a-input
            placeholder="请输入用户手机号"
            v-model="search.phone"
            :allowClear="true"
          />
        </a-form-item>
        <a-form-item label="状态">
          <a-select
            :allowClear="true"
            placeholder="请选择状态"
            :default-value="search.status"
            v-model="search.status"
            style="width: 200px"
          >
            <a-select-option
              :key="item.name"
              :value="item.value"
              v-for="item in applyStatus"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
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
      :data-source="signUpList"
      bordered
      :pagination="false"
      :style="{ backgroundColor: '#ffffff' }"
      :rowKey="record => record.id"
      :loading="{ spinning: loading, delay: 500 }"
    >
      <template slot="id" slot-scope="text">
        <a>{{ text }}</a>
      </template>
      <!-- 状态 -->
      <template slot="status" slot-scope="text, record">
        <span
          v-for="item in applyStatus"
          :key="item.value"
          v-show="item.value === record.status"
        >
          {{ item.name }}
        </span>
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
    dataIndex: "phone",
    key: "phone",
    title: "手机号"
  },
  {
    dataIndex: "title",
    key: "title",
    title: "标题"
  },
  {
    dataIndex: "status",
    key: "status",
    title: "报名状态",
    scopedSlots: { customRender: "status" }
  },
  {
    dataIndex: "applyTime",
    key: "applyTime",
    title: "报名时间"
  },
  {
    dataIndex: "applyCancelTime",
    key: "applyCancelTime",
    title: "取消报名时间"
  }
];
const ApplyStatus = [
  {
    value: 0,
    name: "已报名"
  },
  {
    value: 1,
    name: "取消报名"
  }
];
export default {
  data() {
    return {
      exportLoading: false,
      applyStatus: ApplyStatus,
      activityCode: null,
      columns,
      loading: false,
      search: {
        title: "",
        phone: "",
        status: undefined
      }
    };
  },
  computed: {
    ...mapState("communitySignUp", [
      "signUpList",
      "pageNum",
      "pageSize",
      "totalSize"
    ])
  },
  created() {
    this.init();
  },
  onload(options) {
    this.activityCode = options.activityCode;
  },
  watch: {
    $route: "init" // 监听路由变化 更新页面状态 getData 初始化页面数据
  },
  methods: {
    ...mapActions("communitySignUp", ["exportSignUpData", "getSignUpList"]),
    init() {
      if (this.$route.name != "communitySignUpIndex") {
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
      const { title, phone, status } = this.search;
      const response = await this.exportSignUpData({
        pageNum,
        pageSize,
        title,
        phone,
        status
      });
      exportFile(response, "社区活动报名管理");
      this.exportLoading = false;
    },
    // 获取列表数据
    async getData(page, pageSize) {
      this.loading = true;
      const { title, phone, status } = this.search;
      const response = await this.getSignUpList({
        pageNum: page || this.pageNum,
        pageSize: pageSize || this.pageSize,
        title,
        phone,
        status,
        activityCode: this.$route.params.activityCode
      });
      // console.log(this.statistics)
      this.loading = false;
      if (!response.code) return;
      if (response.code != 200) {
        this.$message.error({
          content: response.msg,
          key: "getSignUpList",
          duration: 2
        });
      }
    },
    // 点击查询
    searchSubmit(e) {
      // console.log(this.search);
      e.preventDefault();
      this.getData();
    }
  }
};
</script>
