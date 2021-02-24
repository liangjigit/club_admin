<template>
  <div>
    <div class="functional-area" slot="actions">
      <a-form layout="inline" :form="search" @submit="searchSubmit">
        <a-form-item>
          <a-button
            type="primary"
            @click="$router.push({ path: '/goods/create' })"
            >新增产品</a-button
          >
        </a-form-item>

        <a-form-item label="产品名称">
          <a-input
            placeholder="请输入产品名称"
            v-model="search.goodsName"
            :allowClear="true"
          />
        </a-form-item>
        <a-form-item label="款号">
          <a-input
            placeholder="请输入款号"
            v-model="search.itemNo"
            :allowClear="true"
          />
        </a-form-item>
        <a-form-item label="状态">
          <a-select
            :allowClear="true"
            placeholder="请选择"
            :default-value="search.status"
            v-model="search.status"
            style="width: 100px"
          >
            <a-select-option :value="1" :key="1">上架</a-select-option>
            <a-select-option :value="0" :key="0">下架</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit">
            查询
          </a-button>
        </a-form-item>
      </a-form>
    </div>
    <a-table
      :columns="columns"
      :data-source="goods"
      bordered
      :pagination="false"
      :rowKey="record => record.id"
      :locale="{
        filterConfirm: '确定',
        filterReset: '重置',
        emptyText: '暂无数据'
      }"
      :style="{ backgroundColor: '#ffffff' }"
    >
      <template slot="status" slot-scope="text, record">
        <span
          v-for="item in goodsStatus"
          :key="item.value"
          v-show="item.key === record.status"
        >
          {{ item.value }}
        </span>
      </template>
      <template slot="id" slot-scope="text">
        <a>{{ text }}</a>
      </template>
      <!-- 封面图 -->
      <template slot="faceUrl" slot-scope="text, record">
        <img :src="record.faceUrl" style="width:200px;height:100px" />
      </template>
      <!-- 标签 -->
      <template slot="tags" slot-scope="tags">
        <a-tag color="pink" v-for="tag in tags" :key="tag">
          {{ tag }}
        </a-tag>
      </template>
      <!-- 操作 -->
      <template slot="action" slot-scope="text, record">
        <span
          v-for="item in goodsStatus"
          :key="item.value"
          v-show="item.key === record.status"
        >
          <a @click="changeStatus(record.id, 'status', record.status)">
            {{ item.value == "下架" ? "上架" : "下架" }}
          </a>
        </span>
        <span v-if="record.status === false">
          <a-divider type="vertical" />
          <router-link :to="{ name: 'goodsEdit', params: { id: record.id } }"
            >编辑</router-link
          >
          <a-divider type="vertical" />
          <a-popconfirm
            v-if="goods.length"
            title="确认删除?"
            ok-text="删除"
            cancel-text="取消"
            @confirm="() => onDelete(record.id, 'deleteGoods')"
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
        @change="getList"
        show-size-changer
        @showSizeChange="(current, pageSize) => getList(1, pageSize)"
        :show-total="total => `总计${total} 条数据`"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
const columns = [
  {
    dataIndex: "id",
    key: "id",
    title: "ID",
  },
  {
    dataIndex: "goodsName",
    key: "goodsName",
    title: "产品名称",
  },
  {
    dataIndex: "itemNo",
    key: "itemNo",
    title: "款号",
  },
  {
    dataIndex: "goodsPrice",
    key: "goodsPrice",
    title: "价格",
  },
  {
    dataIndex: "goodsUrl",
    key: "goodsUrl",
    title: "链接"
  },
  {
    dataIndex: "status",
    key: "status",
    title: "状态",
    scopedSlots: { customRender: "status" }
  },
  {
    title: "操作",
    key: "action",
    width: 160,
    scopedSlots: { customRender: "action" }
  }
];
const goodsStatus = [
  { key: "", value: "所有" },
  { key: false, value: "下架" },
  { key: true, value: "上架" }
];
export default {
  created() {
    this.getList();
  },
  data() {
    return {
      goodsStatus: goodsStatus,
      columns,
      search: {
        goodsName: "",
        itemNo: "" // 款号
      }
    };
  },
  computed: {
    ...mapState("goods", ["goods", "pageNum", "totalSize", "pageSize"])
  },
  methods: {
    ...mapActions("goods", ["getGoods", "changeGoodsStatus", "deleteGoods"]),
    // 点击查询
    searchSubmit(e) {
      e.preventDefault();
      this.getList(1, this.pageSize);
    },
    async getList(page, pageSize) {
      this.loading = true;
      const response = await this.getGoods({
        goodsName: this.search.goodsName,
        itemNo: this.search.itemNo,
        status: this.search.status,
        pageNum: page || this.pageNum,
        pageSize: pageSize || this.pageSize
      });
      if (response.code != 200) {
        this.$message.success({
          content: response.msg,
          key: "getGoods",
          duration: 2
        });
      }
    },
    // 创建商品
    async created() {
      const response = await this.createGoods();
      if (response.code == 200) {
        this.$message.success({
          content: "添加成功",
          key: "createGoods",
          duration: 2
        });
      } else {
        this.$message.error({
          content: response.msg,
          key: "createGoods",
          duration: 2
        });
      }
    },
    async onDelete(id, dataIndex) {
      this.$message.loading({
        content: "正在删除",
        key: dataIndex,
        duration: 2
      });
      const response = await this.deleteGoods({ id });
      if (!response.code) return;
      if (response.code == 200) {
        await this.getList();
        this.$message.success({
          content: "删除成功",
          key: dataIndex,
          duration: 2
        });
        this.getList();
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
      const response = await this.changeGoodsStatus({
        status,
        id,
        dataIndex
      });
      if (response.code == 200) {
        this.$message.success({
          content: "修改成功",
          key: dataIndex,
          duration: 2
        });
        this.getList(this.pageNum, this.pageSize);
      }
    }
  }
};
</script>

<style>
.functional-area {
  padding: 10px;
  background-color: #ffffff;
}
</style>
