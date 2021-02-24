<template>
  <div>
    <div class="functional-area" slot="actions">
      <a-form layout="inline" :form="search" @submit="searchSubmit">
        <a-form-item label="用户手机号">
          <a-input
            placeholder="用户手机号"
            v-model="search.phone"
            :allowClear="true"
          />
        </a-form-item>
        <a-form-item label="姓名">
          <a-input
            placeholder="姓名"
            v-model="search.realname"
            :allowClear="true"
          />
        </a-form-item>
        <a-form-item label="会员卡号">
          <a-input
            placeholder="会员卡号"
            v-model="search.memberNo"
            :allowClear="true"
          />
        </a-form-item>
        <a-form-item label="类型">
          <a-select
            :allowClear="true"
            placeholder="请选择"
            :default-value="search.type"
            v-model="search.type"
            style="width: 100px"
          >
            <a-select-option :value="1" :key="1">增加</a-select-option>
            <a-select-option :value="2" :key="2">减少</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="积分来源">
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
              >{{ item.value }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="创建时间">
          <a-range-picker
            v-model="search.createTime"
            :show-time="{ defaultValue: [
                moment('00:00:00', 'HH:mm:ss'),
                moment('23:59:59', 'HH:mm:ss')
              ] }"
            format="YYYY-MM-DD HH:mm:ss"
            :placeholder="['开始', '结束']"
            @ok="confirmCreateTime"
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
      :data-source="userIntegralFlows"
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
import moment from "moment";
const columns = [
  {
    dataIndex: "id",
    title: "ID",
    width: 60
  },
  {
    dataIndex: "phone",
    title: "用户手机号",
    width: 140
  },
  {
    dataIndex: "realname",
    title: "姓名",
    width: 100
  },
  {
    dataIndex: "memberNo",
    title: "会员卡号"
  },
  {
    dataIndex: "currentIntegral",
    title: "当前积分",
    width: 100
  },
  {
    dataIndex: "type",
    title: "类型",
    width: 100,
    scopedSlots: { customRender: "typeSlot" }
  },
  {
    dataIndex: "integral",
    title: "变动积分",
    width: 100
  },
  {
    dataIndex: "source",
    title: "积分来源",
    scopedSlots: { customRender: "sourceSlot" }
  },
  {
    dataIndex: "createTime",
    title: "创建时间",
    width: 160
  }
];
const Type = [
  { key: 1, value: "增加" },
  { key: 2, value: "减少" }
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
      source: Source,
      exportLoading: false,
      type: Type,
      search: {
        phone: "", //手机号
        type: undefined,
        realname: "",
        source: undefined,
        memberNo: "",
        createTime: [] // 创建开始时间
      }
    };
  },
  computed: {
    ...mapState("integralFlow", [
      "userIntegralFlows",
      "pageNum",
      "pageSize",
      "totalSize"
    ])
  },
  created() {
    this.getData();
  },
  methods: {
    ...mapActions("integralFlow", [
      "getUserIntegralFlows",
      "exportIntegralFlow"
    ]),
    moment,
    async getData(page, pageSize) {
      let { phone, realname, type, memberNo, source, createTime } = this.search;
      // 格式化时间
      const [begin, end] = createTime;
      const startCreateTime = begin ? begin.format("YYYY-MM-DD HH:mm:ss") : "";
      const endCreateTime = end ? end.format("YYYY-MM-DD HH:mm:ss") : "";
      const response = await this.getUserIntegralFlows({
        phone,
        realname,
        type,
        memberNo,
        source,
        startCreateTime,
        endCreateTime,
        pageNum: page || this.pageNum,
        pageSize: pageSize || this.pageSize
      });
      console.log(response);
      if (response.code != 200) {
        this.$message.success({
          content: response.msg,
          key: "getUserIntegralFlows",
          duration: 2
        });
      }
    },
    async exportData() {
      this.exportLoading = true;
      this.$message.loading({
        content: "正在导出",
        key: "exportIntegralFlow",
        duration: 2
      });
      let { phone, realname, type, memberNo, source, createTime } = this.search;
      // 格式化时间
      const [begin, end] = createTime;
      const startCreateTime = begin ? begin.format("YYYY-MM-DD HH:mm:ss") : "";
      const endCreateTime = end ? end.format("YYYY-MM-DD HH:mm:ss") : "";
      const response = await this.exportIntegralFlow({
        phone,
        realname,
        type,
        memberNo,
        source,
        startCreateTime,
        endCreateTime
      });
      exportFile(response, "积分流水", "exportIntegralFlow");
      this.exportLoading = false;
    },
    // 按创建时间搜索
    confirmCreateTime(value) {
      this.search.createTime = value;
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
