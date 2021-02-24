<template>
  <div>
    <div class="functional-area" slot="actions">
      <a-form layout="inline" :form="search" @submit="searchSubmit">
        <a-form-item>
          <a-button
            type="primary"
            @click="$router.push({ path: '/community/activity/create' })"
            >新增活动</a-button
          >
        </a-form-item>
        <a-form-item label="标题">
          <a-input
            placeholder="请输入标题"
            v-model="search.title"
            :allowClear="true"
          />
        </a-form-item>
        <a-form-item label="活动开始时间">
          <a-range-picker
            v-model="search.activityStartTime"
            :show-time="{ defaultValue: [
                moment('00:00:00', 'HH:mm:ss'),
                moment('23:59:59', 'HH:mm:ss')
              ]}"
            format="YYYY-MM-DD HH:mm:ss"
            :placeholder="['开始', '结束']"
            @ok="confirmActivityStartTime"
          >
            <a-icon slot="suffixIcon" type="clock-circle" />
          </a-range-picker>
        </a-form-item>
        <a-form-item label="活动结束时间">
          <a-range-picker
            v-model="search.activityEndTime"
            :show-time="{ defaultValue: [
                moment('00:00:00', 'HH:mm:ss'),
                moment('23:59:59', 'HH:mm:ss')
              ] }"
            format="YYYY-MM-DD HH:mm:ss"
            :placeholder="['开始', '结束']"
            @ok="confirmActivityEndTime"
          >
            <a-icon slot="suffixIcon" type="clock-circle" />
          </a-range-picker>
        </a-form-item>
        <a-form-item label="活动城市">
          <a-cascader
            :options="provinceAndCityDataPlus"
            placeholder="请选择活动城市"
            :showSearch="true"
            :default-value="search.activityCity"
            v-model="search.activityCity"
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
              :value="item.key"
              v-for="item in activityStatus"
              :key="item.value"
              >{{ item.value }}</a-select-option
            >
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
      </a-form>
    </div>
    <a-table
      :scroll="{ x: 1300 }"
      :columns="columns"
      :data-source="activities"
      bordered
      :pagination="false"
      :style="{ backgroundColor: '#ffffff' }"
      :rowKey="record => record.id"
      :loading="{ spinning: loading, delay: 500 }"
    >
      <template slot="id" slot-scope="text">
        <a>{{ text }}</a>
      </template>
      <!-- 封面图 -->
      <template slot="img" slot-scope="text, record">
        <img :src="record.img" style="width:167.5px;height:94px" />
      </template>
      <template slot="applyTime" slot-scope="text, record">
        {{ record.applyStartTime }} ~ {{ record.applyEndTime }}
      </template>
      <template slot="activityTime" slot-scope="text, record">
        {{ record.activityStartTime }} ~ {{ record.activityEndTime }}
      </template>
      <!-- 状态 -->
      <template slot="status" slot-scope="text, record">
        <span
          v-for="item in activityStatus"
          :key="item.value"
          v-show="item.key === record.status"
        >
          {{ item.value }}
        </span>
      </template>
      <!-- 排序 -->
      <span slot="activitySort" slot-scope="text, record">
        <editable-cell
          :text="text"
          @change="onCellChange(record.id, 'activitySort', $event)"
        />
      </span>
      <!-- 操作 -->
      <template slot="action" slot-scope="text, record">
        <span
          v-for="item in activityStatus"
          :key="item.value"
          v-show="item.key === record.status"
        >
          <a @click="changeStatus(record.id, 'status', record.status)">
            {{ item.value == "下架" ? "上架" : "下架" }}
          </a>
        </span>
        <br />
        <router-link
          :to="{ name: 'communityActivityDetail', params: { id: record.id } }"
        >
          查看
        </router-link>
        <br />
        <router-link
          :to="{ name: 'communityActivityPoster', params: { id: record.id } }"
        >
          分享
        </router-link>
        <br />
        <a :href="record.qrcodeUrl" :download="record.activityCode + '.png'"
          >下载二维码</a
        >
        <br />
        <!-- 下架状态下显示编辑和删除 -->
        <span v-if="record.status == 0">
          <router-link
            :to="{ name: 'communityActivityEdit', params: { id: record.id } }"
          >
            编辑
          </router-link>
          <br />
          <a-popconfirm
            v-if="activities.length"
            title="确定删除?"
            ok-text="删除"
            cancel-text="取消"
            @confirm="() => onDelete(record.id, 'deleteArticel')"
          >
            <a href="javascript:;">删除</a>
          </a-popconfirm>
        </span>
      </template>
    </a-table>
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
import EditableCell from "../../components/EditableCell";
import {
  // provinceAndCityData,
  // regionData,
  provinceAndCityDataPlus,
  // regionDataPlus,
  CodeToText,
  TextToCode
} from "element-china-area-data";
import { mapState, mapActions } from "vuex";
import moment from "moment";
const columns = [
  {
    dataIndex: "id",
    key: "id",
    title: "ID",
    width: 100
  },
  {
    dataIndex: "img",
    key: "img",
    title: "封面图",
    scopedSlots: { customRender: "img" },
    width: 200
  },
  {
    dataIndex: "title",
    key: "title",
    title: "标题",
    scopedSlots: { customRender: "title" },
    width: 300
  },
  {
    dataIndex: "activityStartTime",
    key: "activityStartTime",
    title: "活动时间",
    width: 200,
    scopedSlots: { customRender: "activityTime" }
  },
  {
    dataIndex: "city",
    key: "city",
    title: "城市",
    width: 150
  },
  {
    dataIndex: "applyStartTime",
    key: "applyStartTime",
    title: "报名时间",
    width: 200,
    scopedSlots: { customRender: "applyTime" }
  },
  {
    dataIndex: "status",
    key: "status",
    title: "状态",
    width: 100,
    scopedSlots: { customRender: "status" }
  },
  {
    dataIndex: "createTime",
    key: "createTime",
    title: "创建时间",
    width: 200
  },
  {
    dataIndex: "activitySort",
    key: "activitySort",
    title: "排序",
    scopedSlots: { customRender: "activitySort" },
    width: 130
  },
  {
    dataIndex: "action",
    title: "操作",
    key: "action",
    fixed: "right",
    width: 150,
    scopedSlots: { customRender: "action" }
  }
];
const ActivityStatus = [
  { key: 0, value: "下架" },
  { key: 1, value: "上架" }
];
export default {
  components: {
    EditableCell
  },
  data() {
    return {
      activityStatus: ActivityStatus,
      // 搜索相关
      // provinceAndCityData, //省份城市
      CodeToText,
      TextToCode,
      // regionData,
      provinceAndCityDataPlus, // 省份城市+全部
      columns,
      loading: false, // 列表加载中
      // 列表搜索相关
      search: {
        title: "", // 名称
        activityStartTime: [], // 活动开始时间
        activityEndTime: [], // 活动开始时间
        activityCity: [], // 省市
        status: undefined, // 状态
        createTime: [] // 创建开始时间
      }
    };
  },
  computed: {
    ...mapState("communityActivity", [
      "activities",
      "pageNum",
      "pageSize",
      "totalSize"
    ])
  },
  watch: {
    $route: "init" // 监听路由变化 更新页面状态 getData 初始化页面数据
  },
  created() {
    this.init();
  },
  methods: {
    ...mapActions("communityActivity", [
      "getActivities",
      "changeActivityStatus",
      "changeActivitySort",
      "deleteActivity"
    ]),
    moment,
    // 初始化数据
    init() {
      if (this.$route.name != "communityActivityIndex") {
        return false;
      }
      this.getData(); // 获取列表数据
    },
    // 列表相关
    // 删除文章
    async onDelete(id, dataIndex) {
      this.$message.loading({
        content: "正在删除",
        key: dataIndex,
        duration: 2
      });
      const response = await this.deleteActivity({ id });
      if (!response.code) return;
      if (response.code == 200) {
        await this.getData();
        this.$message.success({
          content: "删除成功",
          key: dataIndex,
          duration: 2
        });
      }
    },
    // 修改状态
    async changeStatus(id, dataIndex, value) {
      // console.log(id, dataIndex, value)
      this.$message.loading({
        content: "正在修改",
        key: dataIndex,
        duration: 2
      });
      const status = value == 1 ? 0 : 1;
      const response = await this.changeActivityStatus({
        status,
        id,
        dataIndex
      });
      if (!response.code) return;
      if (response.code == 200) {
        this.$message.success({
          content: "修改成功",
          key: dataIndex,
          duration: 2
        });
      }
    },
    // 修改排序
    async onCellChange(id, dataIndex, value) {
      this.$message.loading({
        content: "正在修改",
        key: dataIndex,
        duration: 2
      });
      const response = await this.changeActivitySort({
        activitySort: value,
        id,
        dataIndex
      });
      await this.getData();
      if (!response.code) return;
      if (response.code == 200) {
        this.$message.success({
          content: "修改成功",
          key: dataIndex,
          duration: 2
        });
      }
    },
    // 获取列表
    async getData(page, pageSize) {
      let {
        title,
        status,
        createTime,
        activityStartTime,
        activityEndTime,
        activityCity
      } = this.search;
      // 格式化时间 创建时间
      const [begin, end] = createTime;
      const startCreateTime = begin ? begin.format("YYYY-MM-DD HH:mm:ss") : "";
      const endCreateTime = end ? end.format("YYYY-MM-DD HH:mm:ss") : "";
      // 格式化时间 活动时间
      const [end_aBegin, end_aEnd] = activityEndTime;
      const endActivityStartTime = end_aBegin? end_aBegin.format("YYYY-MM-DD HH:mm:ss"): "";
      const endActivityEndTime = end_aEnd ? end_aEnd.format("YYYY-MM-DD HH:mm:ss") : "";
      const [start_aBegin, start_aEnd] = activityStartTime;
      const startActivityStartTime = start_aBegin? start_aBegin.format("YYYY-MM-DD HH:mm:ss"): "";
      const startActivityEndTime = start_aEnd ? start_aEnd.format("YYYY-MM-DD HH:mm:ss") : "";
      // 城市转换 CodeToText
      const provinceCode = activityCity[0];
      const cityCode = activityCity[1];
      // console.log(activityCity);
      const province = !provinceCode ? "" : this.CodeToText[provinceCode];
      const city = !cityCode ? "" : this.CodeToText[cityCode];
      this.loading = true;
      const response = await this.getActivities({
        pageNum: page || this.pageNum,
        pageSize: pageSize || this.pageSize,
        title,
        startActivityStartTime,
        startActivityEndTime,
        endActivityStartTime,
        endActivityEndTime,
        city,
        province,
        status,
        startCreateTime,
        endCreateTime
      });
      // console.log(response);
      this.loading = false;
      if (!response.code) return;
      if (response.code != 200) {
        this.$message.error({
          content: response.msg,
          key: "getActivities",
          duration: 2
        });
      }
    },
    // 搜索相关
    // 按活动时间搜索
    confirmActivityStartTime(value) {
      this.search.activityStartTime = value;
    },
    confirmActivityEndTime(value) {
      this.search.activityEndTime = value;
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
    // 选择城市
    // changeCity(value) {
    //   const provinceCode = value[0];
    //   const cityCode = value[1] || "";
    //   const province = this.CodeToText[provinceCode];
    //   const city = this.CodeToText[cityCode];
    //   // console.log(province);
    //   // console.log(city);
    //   this.search.activityCity = [province, city];
    // }
  }
};
</script>
