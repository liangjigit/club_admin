<template>
  <div>
    <div class="functional-area" slot="actions">
      <a-form layout="inline" :form="search" @submit="searchSubmit">
        <a-form-item label="优惠券ID">
          <a-input
            placeholder="优惠券ID"
            v-model="search.couponId"
            :allowClear="true"
          />
        </a-form-item>
        <a-form-item label="优惠券标题">
          <a-input
            placeholder="优惠券标题"
            v-model="search.title"
            :allowClear="true"
          />
        </a-form-item>

        <a-form-item label="领取来源">
          <a-select
            :allowClear="true"
            placeholder="请选择"
            :default-value="search.source"
            v-model="search.source"
            style="width: 150px"
          >
            <a-select-option
              v-for="item in source"
              :value="item.key"
              :key="item.item"
              >{{ item.value }}</a-select-option
            >
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
      :data-source="coupons"
      bordered
      :pagination="false"
      :style="{ backgroundColor: '#ffffff' }"
      :rowKey="record => record.id"
      :loading="{ spinning: loading, delay: 500 }"
    >
      <template slot="typeSlot" slot-scope="text, record">
        <span
          v-for="item in type"
          :key="item.value"
          v-show="item.key === record.type"
        >
          {{ item.value }}
        </span>
      </template>

      <template slot="sourceSlot" slot-scope="text, record">
        <span
          v-for="item in source"
          :key="item.value"
          v-show="item.key === record.source"
        >
          {{ item.value }}
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
import { mapActions, mapState } from "vuex";
import { exportFile } from "@/utils/utils.js";
const columns = [
  {
    dataIndex: "id",
    title: "ID",
    width: 60
  },
  {
    dataIndex: "couponId",
    title: "优惠券ID",
    width: 140
  },
  {
    dataIndex: "title",
    title: "优惠券标题"
  },
  {
    dataIndex: "source",
    title: "领取来源",
    scopedSlots: { customRender: "sourceSlot" }
  },
  {
    dataIndex: "receiveCount",
    title: "领取数量"
  }
];
const Source = [
  { key: 1, value: "每日签到" },
  { key: 2, value: "阅读CUP有料" },
  { key: 3, value: "参加体态训练营" },
  { key: 4, value: "新人礼" },
  { key: 5, value: "完善我的信息" },
  { key: 6, value: "完善我的TA信息" },
  { key: 7, value: "完善我的宝贝信息" },
  { key: 8, value: "邀请好友" },
  { key: 9, value: "参加社区活动" },
  { key: 10, value: "BRARTS打卡" }
];
export default {
  data() {
    return {
      columns,
      loading: false,
      exportLoading: false,
      source: Source,
      search: {
        couponId: "",
        title: "",
        source: undefined
      }
    };
  },
  computed: {
    ...mapState("coupon", [
      "coupons",
      "pageNum",
      "pageSize",
      "totalSize"
    ])
  },
  created() {
    this.getData();
  },
  methods: {
    ...mapActions("coupon", ["getCoupons", "exportCouponData"]),
    async exportData() {
      this.exportLoading = true;
      this.$message.loading({
        content: "正在导出",
        key: "exportStatistics",
        duration: 2
      });
      let { couponId, title, source } = this.search;

      const response = await this.exportCouponData({
        couponId,
        title,
        source
      });
      exportFile(response, "优惠券统计");
      this.exportLoading = false;
    },
    async getData(page, pageSize) {
      let { couponId, title, source } = this.search;
      const response = await this.getCoupons({
        couponId,
        title,
        source,
        pageNum: page || this.pageNum,
        pageSize: pageSize || this.pageSize
      });
      if (response.code != 200) {
        this.$message.success({
          content: response.msg,
          key: "getCoupons",
          duration: 2
        });
      }
    },
    // 提交搜索
    searchSubmit(e) {
      e.preventDefault();
      this.getData(1, this.pageSize);
    }
  }
};
</script>

<style scoped></style>
